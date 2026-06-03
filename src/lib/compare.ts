// Pure, dependency-free comparison engine.
// Reusable on both the client (live preview) and the Convex server (when recording a trip).
//
// Store-keyed so adding/removing a retailer only means editing STORES + the seed data.

export const STORES = ["coles", "woolies", "aldi"] as const;
export type Store = (typeof STORES)[number];
export type Winner = Store | "tie";

export const STORE_LABELS: Record<Store, string> = {
  coles: "Coles",
  woolies: "Woolworths",
  aldi: "Aldi",
};

export interface StoreCell {
  price: number;
  special: boolean;
}

/** A basket line with a price at every store. */
export interface PricedItem {
  name: string;
  qty: number;
  prices: Record<Store, StoreCell>;
}

export interface LineCell {
  price: number;
  lineTotal: number;
  special: boolean;
}

export interface LineResult {
  name: string;
  qty: number;
  cells: Record<Store, LineCell>;
  cheapest: Winner;
}

export interface ComparisonResult {
  totals: Record<Store, number>;
  /** Store with the lowest basket total ("tie" if multiple share the lowest). */
  cheapest: Winner;
  cheapestTotal: number;
  dearestTotal: number;
  /** Saving from shopping the whole basket at the cheapest store vs the dearest store. */
  saved: number;
  savedPercent: number;
  lineItems: LineResult[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** The single cheapest store for a set of per-store prices, or "tie". */
function cheapestOf(prices: Record<Store, { price: number }>): Winner {
  let min = Infinity;
  let winners: Store[] = [];
  for (const s of STORES) {
    const p = round2(prices[s].price);
    if (p < min) {
      min = p;
      winners = [s];
    } else if (p === min) {
      winners.push(s);
    }
  }
  return winners.length === 1 ? winners[0] : "tie";
}

export function compareBasket(items: PricedItem[]): ComparisonResult {
  const lineItems: LineResult[] = items.map((item) => {
    const cells = {} as Record<Store, LineCell>;
    for (const s of STORES) {
      const cell = item.prices[s];
      cells[s] = {
        price: cell.price,
        lineTotal: round2(cell.price * item.qty),
        special: cell.special,
      };
    }
    return {
      name: item.name,
      qty: item.qty,
      cells,
      cheapest: cheapestOf(item.prices),
    };
  });

  const totals = {} as Record<Store, number>;
  for (const s of STORES) {
    totals[s] = round2(lineItems.reduce((sum, l) => sum + l.cells[s].lineTotal, 0));
  }

  let cheapestTotal = Infinity;
  let dearestTotal = -Infinity;
  let winners: Store[] = [];
  for (const s of STORES) {
    const t = totals[s];
    if (t < cheapestTotal) {
      cheapestTotal = t;
      winners = [s];
    } else if (t === cheapestTotal) {
      winners.push(s);
    }
    if (t > dearestTotal) dearestTotal = t;
  }

  const cheapest: Winner = winners.length === 1 ? winners[0] : "tie";
  const saved = round2(dearestTotal - cheapestTotal);
  const savedPercent = dearestTotal > 0 ? round2((saved / dearestTotal) * 100) : 0;

  return {
    totals,
    cheapest,
    cheapestTotal: round2(cheapestTotal),
    dearestTotal: round2(dearestTotal),
    saved,
    savedPercent,
    lineItems,
  };
}
