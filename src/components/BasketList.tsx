"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useBasket } from "@/lib/useBasket";

export function BasketList() {
  const products = useQuery(api.products.list);
  const { entries, setQty, remove, clear, count } = useBasket();

  const ids = Object.keys(entries);

  if (ids.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-600">Your trolley is empty</p>
        <p className="mt-1 text-sm text-slate-400">
          Search for items or scan a receipt to get started.
        </p>
      </div>
    );
  }

  const byId = new Map((products ?? []).map((p) => [p._id, p]));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-700">
          Your trolley · {count} item{count === 1 ? "" : "s"}
        </h2>
        <button
          onClick={clear}
          className="text-xs font-medium text-slate-400 hover:text-rose-600"
        >
          Clear all
        </button>
      </div>

      <ul className="divide-y divide-slate-100">
        {ids.map((id) => {
          const p = byId.get(id as Id<"products">);
          const qty = entries[id];
          return (
            <li key={id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {p ? p.name : "…"}
                </p>
                {p && <p className="text-xs text-slate-400">{p.unit}</p>}
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setQty(id, qty - 1)}
                  className="grid h-8 w-8 place-items-center rounded-l-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(id, qty + 1)}
                  className="grid h-8 w-8 place-items-center rounded-r-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => remove(id)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Remove item"
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
