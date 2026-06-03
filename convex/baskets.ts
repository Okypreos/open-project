import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function requireUserId(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity.subject;
}

const basketItems = v.array(
  v.object({ productId: v.id("products"), qty: v.number() }),
);

/** All of the signed-in user's saved baskets (newest first). */
export const myBaskets = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("baskets")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

/** A single basket the user owns, or null. */
export const getBasket = query({
  args: { id: v.id("baskets") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const basket = await ctx.db.get(id);
    if (!basket || basket.userId !== identity.subject) return null;
    return basket;
  },
});

/** Create a new basket or overwrite an existing one the user owns. */
export const saveBasket = mutation({
  args: {
    id: v.optional(v.id("baskets")),
    name: v.string(),
    items: basketItems,
  },
  handler: async (ctx, { id, name, items }) => {
    const userId = await requireUserId(ctx);
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing || existing.userId !== userId) {
        throw new Error("Basket not found");
      }
      await ctx.db.patch(id, { name, items });
      return id;
    }
    return await ctx.db.insert("baskets", { userId, name, items });
  },
});

export const deleteBasket = mutation({
  args: { id: v.id("baskets") },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Basket not found");
    }
    await ctx.db.delete(id);
  },
});
