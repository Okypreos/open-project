"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useBasket } from "@/lib/useBasket";

export function ProductSearch() {
  const [q, setQ] = useState("");
  const results = useQuery(api.products.search, { q });
  const { entries, add } = useBasket();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Add items to your basket
      </label>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search milk, bananas, coffee…"
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <p className="mt-2 px-1 text-xs text-slate-400">
        {q.trim()
          ? `${results?.length ?? 0} match${results?.length === 1 ? "" : "es"}`
          : "Browse the full catalog or search to filter"}
      </p>

      <ul className="mt-1 max-h-80 space-y-1 overflow-auto">
        {results === undefined && (
          <li className="px-1 py-6 text-center text-sm text-slate-400">
            Loading catalog…
          </li>
        )}
        {results && results.length === 0 && (
          <li className="px-1 py-6 text-center text-sm text-slate-400">
            No matches. Try a simpler word like “bread”.
          </li>
        )}
        {results?.map((p) => {
          const inBasket = (entries[p._id] ?? 0) > 0;
          return (
            <li
              key={p._id}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {p.name}
                </p>
                <p className="text-xs text-slate-400">
                  {p.category} · {p.unit}
                </p>
              </div>
              <button
                onClick={() => add(p._id)}
                disabled={inBasket}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  inBasket
                    ? "cursor-default bg-emerald-50 text-emerald-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {inBasket ? `In basket (${entries[p._id]})` : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
