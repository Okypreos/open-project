// Lightweight, dependency-free product matching shared by manual search and
// receipt parsing. Scores a free-text query against a product's name + aliases.

export type MatchableProduct = {
  name: string;
  aliases: string[];
  category: string;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Score how well `query` matches a product. Higher is better; 0 means no match. */
export function scoreMatch(query: string, product: MatchableProduct): number {
  const q = normalize(query);
  if (!q) return 0;

  const candidates = [product.name, ...product.aliases].map(normalize);
  let best = 0;

  for (const cand of candidates) {
    if (cand === q) {
      best = Math.max(best, 100);
      continue;
    }
    if (cand.includes(q) || q.includes(cand)) {
      // Longer overlaps score higher; cap below an exact match.
      const overlap = Math.min(cand.length, q.length) / Math.max(cand.length, q.length);
      best = Math.max(best, 60 + overlap * 30);
      continue;
    }
    // Token overlap fallback (e.g. "full cream milk 2l" vs "milk").
    const qTokens = new Set(q.split(" "));
    const cTokens = cand.split(" ");
    const shared = cTokens.filter((t) => qTokens.has(t)).length;
    if (shared > 0) {
      best = Math.max(best, 20 + shared * 15);
    }
  }
  return Math.round(best);
}

/** Return the best-matching product (with score) for a free-text query, or null. */
export function bestMatch<T extends MatchableProduct>(
  query: string,
  products: T[],
  threshold = 25,
): { product: T; score: number } | null {
  let winner: { product: T; score: number } | null = null;
  for (const product of products) {
    const score = scoreMatch(query, product);
    if (score >= threshold && (!winner || score > winner.score)) {
      winner = { product, score };
    }
  }
  return winner;
}
