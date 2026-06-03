import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { SEED_PRODUCTS } from "./seedData";
import { bestMatch, scoreMatch } from "./matching";

/** All products, alphabetised. Used to populate the catalog picker. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.sort((a, b) => a.name.localeCompare(b.name));
  },
});

/** Free-text search over name + aliases, ranked by match score. */
export const search = query({
  args: { q: v.string() },
  handler: async (ctx, { q }) => {
    const products = await ctx.db.query("products").collect();
    if (!q.trim()) {
      // No query: return the whole catalog so users can browse by scrolling.
      return products.sort((a, b) => a.name.localeCompare(b.name));
    }
    return products
      .map((p) => ({ p, score: scoreMatch(q, p) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.p);
  },
});

/**
 * Idempotent seed: wipes the catalog and reloads it from `seedData.ts`.
 * Run with: `npx convex run products:seed`
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    for (const p of existing) {
      await ctx.db.delete(p._id);
    }
    for (const p of SEED_PRODUCTS) {
      await ctx.db.insert("products", p);
    }
    return { inserted: SEED_PRODUCTS.length };
  },
});

/**
 * Match a batch of free-text item names (e.g. from a parsed receipt) to catalog
 * products. Returns one result per input line, with the matched product or null.
 */
export const matchMany = query({
  args: {
    names: v.array(v.string()),
  },
  handler: async (ctx, { names }) => {
    const products = await ctx.db.query("products").collect();
    return names.map((name) => {
      const match = bestMatch(name, products);
      return {
        query: name,
        product: match?.product ?? null,
        score: match?.score ?? 0,
      };
    });
  },
});
