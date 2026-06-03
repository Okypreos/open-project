export default {
  providers: [
    {
      // Set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard (Settings > Environment Variables)
      // to your Clerk Frontend API / Issuer URL, e.g. https://your-app-123.clerk.accounts.dev
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
