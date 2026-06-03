"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useBasket } from "@/lib/useBasket";
import {
  compareBasket,
  STORES,
  STORE_LABELS,
  type PricedItem,
  type Store,
} from "@/lib/compare";
import { money, storeLabel } from "@/lib/format";

export function ComparisonPanel() {
  const products = useQuery(api.products.list);
  const { entries, name, clear } = useBasket();
  const recordTrip = useMutation(api.trips.recordTrip);
  const [saving, setSaving] = useState(false);
  const [savedTrip, setSavedTrip] = useState(false);

  const priced: PricedItem[] = useMemo(() => {
    if (!products) return [];
    const byId = new Map(products.map((p) => [p._id, p]));
    return Object.entries(entries).flatMap(([id, qty]) => {
      const p = byId.get(id as Id<"products">);
      if (!p) return [];
      return [
        {
          name: p.name,
          qty,
          prices: {
            coles: { price: p.colesPrice, special: p.colesSpecial },
            woolies: { price: p.wooliesPrice, special: p.wooliesSpecial },
            aldi: {
              price: p.aldiPrice ?? p.wooliesPrice,
              special: p.aldiSpecial ?? false,
            },
          },
        },
      ];
    });
  }, [products, entries]);

  const result = useMemo(
    () => (priced.length ? compareBasket(priced) : null),
    [priced],
  );

  // Once the user starts a new basket after saving, re-enable saving.
  useEffect(() => {
    if (priced.length > 0 && savedTrip) setSavedTrip(false);
  }, [priced.length, savedTrip]);

  if (!result) {
    // Saving clears the basket; show a confirmation instead of the empty prompt.
    if (savedTrip) {
      return (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">
            Basket saved
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Your savings are recorded. Start a new basket or review your history.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setSavedTrip(false)}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              New basket
            </button>
            <Link
              href="/baskets"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              View baskets →
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Add items to see which store is cheapest for your basket.
        </p>
      </div>
    );
  }

  const hasSaving = result.saved > 0 && result.cheapest !== "tie";

  async function handleSave() {
    setSaving(true);
    try {
      await recordTrip({
        basketName: name,
        items: Object.entries(entries).map(([productId, qty]) => ({
          productId: productId as Id<"products">,
          qty,
        })),
      });
      setSavedTrip(true);
      clear();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Headline result */}
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          hasSaving ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
        }`}
      >
        {hasSaving ? (
          <>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Save {money(result.saved)}
              <span className="text-base font-medium text-slate-500">
                {" "}
                ({result.savedPercent}%)
              </span>
              <span className="text-base font-semibold text-slate-700">
                {" "}
                by shopping at {storeLabel(result.cheapest)}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Basket total: {money(result.cheapestTotal)}.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-500">This basket</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {money(result.cheapestTotal)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              All stores cost about the same for this basket.
            </p>
          </>
        )}

        {/* Store totals */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {STORES.map((store) => (
            <StoreTotal
              key={store}
              label={STORE_LABELS[store]}
              total={result.totals[store]}
              winning={hasSaving && result.cheapest === store}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || savedTrip}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {savedTrip ? "Saved ✓" : saving ? "Saving…" : "Save this basket"}
          </button>
          {savedTrip && (
            <Link
              href="/baskets"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              View baskets →
            </Link>
          )}
        </div>
      </div>

      {/* Per-item breakdown */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-2 font-medium">Item</th>
              {STORES.map((store) => (
                <th key={store} className="px-3 py-2 text-right font-medium">
                  {STORE_LABELS[store]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {result.lineItems.map((l) => (
              <tr key={l.name}>
                <td className="px-4 py-2.5">
                  <span className="font-medium text-slate-800">{l.name}</span>
                  {l.qty > 1 && <span className="text-slate-400"> ×{l.qty}</span>}
                </td>
                {STORES.map((store) => (
                  <td
                    key={store}
                    className="px-3 py-2.5 text-right tabular-nums"
                  >
                    <PriceCell
                      value={l.cells[store].lineTotal}
                      special={l.cells[store].special}
                      win={l.cheapest === store}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StoreTotal({
  label,
  total,
  winning,
}: {
  label: string;
  total: number;
  winning: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        winning ? "border-emerald-400 bg-white" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-lg font-bold tabular-nums text-slate-900">
        {money(total)}
      </p>
    </div>
  );
}

function PriceCell({
  value,
  special,
  win,
}: {
  value: number;
  special: boolean;
  win: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {special && (
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
          Special
        </span>
      )}
      <span className={win ? "font-semibold text-emerald-700" : "text-slate-600"}>
        {money(value)}
      </span>
    </span>
  );
}
