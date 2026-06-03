"use client";

import { BasketProvider, useBasket } from "@/lib/useBasket";
import { ProductSearch } from "@/components/ProductSearch";
import { BasketList } from "@/components/BasketList";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { ReceiptUpload } from "@/components/ReceiptUpload";

function BasketNameField() {
  const { name, setName } = useBasket();
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      placeholder="Name this basket"
      aria-label="Basket name"
    />
  );
}

export function BasketWorkspace() {
  return (
    <BasketProvider>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Where should I shop this week?
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Build your basket, then we’ll compare it across all supermarkets.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <BasketNameField />
            <ReceiptUpload />
            <ProductSearch />
            <BasketList />
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <ComparisonPanel />
          </div>
        </div>
      </div>
    </BasketProvider>
  );
}
