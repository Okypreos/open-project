# Cart Compass — Smart Shopping Destination

> Brief 3A (Groceries): _Tell users where to shop this week based on their regular items and current specials._

Cart Compass takes a household's regular grocery basket — typed in manually or scanned from a
receipt photo — and tells them whether **Coles** or **Woolworths** is cheaper this week, by how
much, and tracks their savings over time.

## Why this matters

A typical $250/week basket can vary 10–20% between the two big supermarkets depending on rotating
specials. That's $1,300–$2,000/year for an average household. The blocker isn't willingness to
save, it's the _effort_ of comparing. Cart Compass removes that friction down to one tap.

## Features

- **Manual basket builder** — fast catalog search across ~50 Australian staples, with quantities.
- **AI receipt scanning** — upload a receipt photo; a vision model extracts line items, which are
  matched to the catalog and added to your basket for review.
- **Live comparison** — a clear weekly winner, the dollar (and %) saving, an annualised projection,
  and a per-item breakdown showing which store wins each line and what's on special.
- **Saved history + lifetime savings** — every comparison is snapshotted to your account, with a
  running total of how much you've saved.
- **Auth** — accounts via Clerk, with all data scoped per user.

## Tech stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | Next.js (App Router) + TypeScript + Tailwind CSS v4 |
| Backend / DB   | Convex (database, file storage, server functions)   |
| Auth           | Clerk (`ConvexProviderWithClerk`)                   |
| AI extraction  | Vercel AI SDK (`generateObject`) + OpenAI vision    |
| Validation     | Zod                                                 |
| Hosting        | Vercel (app) + Convex (backend)                     |

## Architecture

- **`convex/`** — backend. `schema.ts` (products, baskets, trips), `products.ts` (search + seed +
  matching), `baskets.ts`, `trips.ts` (server-recomputed comparison snapshots), `files.ts` (upload
  URL), `receipts.ts` (Node action: OpenAI vision → structured items → catalog match).
- **`src/lib/compare.ts`** — pure, dependency-free comparison engine, reused on client and server.
- **`src/lib/useBasket.tsx`** — client basket state, persisted to `localStorage`.
- **`src/components/`** — UI: search, basket list, comparison panel, receipt upload, history.

### Key decisions

- **Seed pricing data.** Neither retailer offers a public price API, so the catalog in
  `convex/seedData.ts` is a curated, representative dataset. The data layer is isolated so a real
  scraper/API adapter could replace it without touching the UI.
- **Comparison recomputed server-side.** When saving a trip, the client sends only `productId + qty`;
  Convex re-prices from the live catalog so stored snapshots can't be tampered with.
- **AI is additive, never required.** Manual entry works with zero API keys; receipt scanning fails
  gracefully with a clear message if `OPENAI_API_KEY` isn't configured.

## Local setup

```bash
npm install
```

Create `.env.local` (the Convex CLI fills the first two in automatically):

```bash
# Added by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Set these in the **Convex dashboard** (Settings → Environment Variables), _not_ in `.env.local`:

```
CLERK_JWT_ISSUER_DOMAIN = https://your-app.clerk.accounts.dev
OPENAI_API_KEY          = sk-...
```

In Clerk, create a **JWT template named `convex`** (use the Convex preset).

Then run the backend and frontend in two terminals:

```bash
npx convex dev          # pushes functions, watches for changes
npm run dev             # Next.js on http://localhost:3000
```

Seed the catalog once:

```bash
npx convex run products:seed
```

## What I'd do next

- Real pricing via a Coles/Woolworths data adapter behind the existing seed interface.
- Smarter receipt matching (embeddings) and confidence-based review UI for low-score matches.
- "Saved basket" management (rename/reopen prior baskets) and price-drop alerts.
