import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { compareBasket, type PricedItem } from "../src/lib/compare";

async function requireUserId(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity.subject;
}

/**
 * Record a comparison ("trip"). The client sends only basket items
 * (productId + qty); prices and the winner are recomputed server-side from the
 * live catalog so the stored snapshot is trustworthy.
 */
export const recordTrip = mutation({
  args: {
    basketId: v.optional(v.id("baskets")),
    basketName: v.string(),
    items: v.array(v.object({ productId: v.id("products"), qty: v.number() })),
  },
  handler: async (ctx, { basketId, basketName, items }) => {
    const userId = await requireUserId(ctx);

    const priced: PricedItem[] = [];
    for (const { productId, qty } of items) {
      const p = await ctx.db.get(productId);
      if (!p) continue;
      priced.push({
        name: p.name,
        qty,
        prices: {
          coles: { price: p.colesPrice, special: p.colesSpecial },
          woolies: { price: p.wooliesPrice, special: p.wooliesSpecial },
          // Fallbacks keep older catalog rows safe; every seeded product sets Aldi.
          aldi: {
            price: p.aldiPrice ?? p.wooliesPrice,
            special: p.aldiSpecial ?? false,
          },
        },
      });
    }
    if (priced.length === 0) throw new Error("Basket is empty");

    const result = compareBasket(priced);

    return await ctx.db.insert("trips", {
      userId,
      basketId,
      basketName,
      colesTotal: result.totals.coles,
      wooliesTotal: result.totals.woolies,
      aldiTotal: result.totals.aldi,
      winner: result.cheapest,
      saved: result.saved,
      savedPercent: result.savedPercent,
      lineItems: result.lineItems.map((l) => ({
        name: l.name,
        qty: l.qty,
        colesPrice: l.cells.coles.price,
        wooliesPrice: l.cells.woolies.price,
        colesSpecial: l.cells.coles.special,
        wooliesSpecial: l.cells.woolies.special,
        aldiPrice: l.cells.aldi.price,
        aldiSpecial: l.cells.aldi.special,
        cheaper: l.cheapest,
      })),
    });
  },
});

/** Delete a single trip the user owns. */
export const deleteTrip = mutation({
  args: { id: v.id("trips") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const trip = await ctx.db.get(id);
    if (!trip || trip.userId !== userId) throw new Error("Trip not found");
    await ctx.db.delete(id);
  },
});


/** The user's recorded trips, newest first. */
export const myTrips = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

/** Aggregate lifetime savings across all recorded trips. */
export const savingsSummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { totalSaved: 0, basketCount: 0, avgSaved: 0 };
    }
    const trips = await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    const totalSaved = Math.round(trips.reduce((s, t) => s + t.saved, 0) * 100) / 100;
    const avgSaved = trips.length
      ? Math.round((totalSaved / trips.length) * 100) / 100
      : 0;
    return {
      totalSaved,
      basketCount: trips.length,
      avgSaved,
    };
  },
});
