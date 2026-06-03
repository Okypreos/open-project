# TrolleyWise — Smart Shopping Destination

Tell users where to shop based on their regular items. TrolleyWise takes a household's
grocery trolley — typed in manually or scanned from a receipt photo — and shows which of
**Coles**, **Woolworths**, or **Aldi** is cheapest overall, by how much, and tracks savings
over time.

## Features

- **Manual trolley builder** — search a catalog of Australian staples and set quantities.
- **AI receipt scanning** — upload a receipt photo; a vision model extracts items and matches
  them to the catalog for review.
- **Live comparison** — the cheapest store with the total dollar (and %) saving, plus a
  per-item breakdown of which store wins each line.
- **Saved trolleys + lifetime savings** — each comparison is saved to your account with a
  running savings total.
- **Auth** — accounts via Clerk, all data scoped per user.

## Tech stack

| Concern       | Choice                                              |
| ------------- | --------------------------------------------------- |
| Framework     | Next.js (App Router) + TypeScript + Tailwind CSS v4 |
| Backend / DB  | Convex (database, file storage, server functions)   |
| Auth          | Clerk (`ConvexProviderWithClerk`)                   |
| AI extraction | Vercel AI SDK (`generateObject`) + OpenAI vision    |
| Validation    | Zod                                                 |

