"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const receiptSchema = z.object({
  items: z.array(
    z.object({
      rawText: z.string().describe("The raw line text as printed on the receipt"),
      name: z
        .string()
        .describe("A simple generic product name, e.g. 'milk', 'bananas', 'coffee'"),
      quantity: z.number().describe("Number of units bought; default 1 if unclear"),
      unit: z.string().describe("Pack/size unit if shown, else empty string"),
    }),
  ),
});

const PROMPT = `You are extracting grocery items from a photo of a supermarket receipt (Australian Coles or Woolworths).

Return ONLY the purchased grocery line items. For each item:
- "rawText": the line as printed.
- "name": a short, generic product name a shopper would search for (e.g. "WW F/CREAM MILK 2L" -> "milk"; "CAVENDISH BANANAS" -> "bananas"; "GROUND COFFEE 1KG" -> "coffee").
- "quantity": how many units were bought (default 1 if not shown).
- "unit": the pack size if present (e.g. "2L", "500g"), otherwise "".

Ignore non-product lines: store name/address, ABN, date/time, subtotal, total, GST, EFTPOS/card details, loyalty points, change, savings lines, and barcodes.
If the image is unreadable, return an empty items array.`;

/**
 * Parse a receipt image (already uploaded to Convex storage) into structured
 * line items via an OpenAI vision model, then match each to the catalog.
 * Returns matched products (with quantities) plus any unmatched raw lines for
 * the user to review. Never writes to the basket directly.
 */
export const parseReceipt = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "AI receipt scanning isn't configured yet. Add OPENAI_API_KEY to your Convex environment to enable it.",
      );
    }

    const blob = await ctx.storage.get(storageId);
    if (!blob) throw new Error("Uploaded image could not be found.");
    const bytes = new Uint8Array(await blob.arrayBuffer());

    let parsed;
    try {
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: receiptSchema,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: PROMPT },
              { type: "image", image: bytes },
            ],
          },
        ],
      });
      parsed = object;
    } finally {
      // Clean up the uploaded image regardless of outcome.
      await ctx.storage.delete(storageId).catch(() => {});
    }

    const names = parsed.items.map((i) => i.name?.trim() || i.rawText);
    const matchResults = await ctx.runQuery(api.products.matchMany, { names });

    const matched: { productId: string; name: string; qty: number }[] = [];
    const unmatched: string[] = [];

    parsed.items.forEach((item, idx) => {
      const match = matchResults[idx];
      const qty = Math.max(1, Math.round(item.quantity || 1));
      if (match?.product) {
        matched.push({
          productId: match.product._id,
          name: match.product.name,
          qty,
        });
      } else {
        unmatched.push(item.rawText || item.name);
      }
    });

    return {
      matched,
      unmatched,
      totalParsed: parsed.items.length,
    };
  },
});
