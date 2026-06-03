import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// A single store-vs-store comparison line, snapshotted at the time a trip is saved
// so that history stays accurate even if catalog prices change later.
const lineItem = v.object({
  name: v.string(),
  qty: v.number(),
  colesPrice: v.number(),
  wooliesPrice: v.number(),
  colesSpecial: v.boolean(),
  wooliesSpecial: v.boolean(),
  // Optional for backward-compatibility with line items recorded before Aldi existed.
  aldiPrice: v.optional(v.number()),
  aldiSpecial: v.optional(v.boolean()),
  cheaper: v.string(), // "coles" | "woolies" | "aldi" | "tie"
});

export default defineSchema({
  // Canonical product catalog. The backbone for both manual search and receipt matching.
  products: defineTable({
    name: v.string(),
    category: v.string(),
    unit: v.string(),
    aliases: v.array(v.string()),
    colesPrice: v.number(),
    wooliesPrice: v.number(),
    colesSpecial: v.boolean(),
    wooliesSpecial: v.boolean(),
    // Optional in the schema so adding Aldi didn't require clearing existing rows;
    // every seeded product sets them.
    aldiPrice: v.optional(v.number()),
    aldiSpecial: v.optional(v.boolean()),
  }).index("by_category", ["category"]),

  // A user's saved basket (their recurring shopping list).
  baskets: defineTable({
    userId: v.string(),
    name: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        qty: v.number(),
      }),
    ),
  }).index("by_user", ["userId"]),

  // A recorded comparison ("shop"). Stores a full snapshot of the result.
  trips: defineTable({
    userId: v.string(),
    basketId: v.optional(v.id("baskets")),
    basketName: v.string(),
    colesTotal: v.number(),
    wooliesTotal: v.number(),
    aldiTotal: v.optional(v.number()),
    winner: v.string(), // "coles" | "woolies" | "aldi" | "tie"
    saved: v.number(),
    // Optional for backward-compatibility with trips recorded before this field existed.
    savedPercent: v.optional(v.number()),
    lineItems: v.array(lineItem),
  }).index("by_user", ["userId"]),
});
