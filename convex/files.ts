import { mutation } from "./_generated/server";

/**
 * Generate a short-lived upload URL for a receipt image. Only signed-in users
 * may upload. The client POSTs the file to this URL and receives a storageId,
 * which is then passed to `receipts.parseReceipt`.
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});
