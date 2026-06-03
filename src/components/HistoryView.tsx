"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { money } from "@/lib/format";

export function HistoryView() {
  const summary = useQuery(api.trips.savingsSummary);
  const trips = useQuery(api.trips.myTrips);
  const deleteTrip = useMutation(api.trips.deleteTrip);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Your baskets
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Every basket you save shows up here with its savings.
      </p>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Metric
          label="Total saved"
          value={summary ? money(summary.totalSaved) : "—"}
          highlight
        />
        <Metric
          label="Baskets saved"
          value={summary ? String(summary.basketCount) : "—"}
        />
        <Metric
          label="Avg per basket"
          value={summary ? money(summary.avgSaved) : "—"}
        />
      </div>

      {/* Trips */}
      <div className="mt-8">
        {trips && trips.length > 0 && (
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Saved baskets
          </h2>
        )}

        {trips === undefined && (
          <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
        )}

        {trips && trips.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-slate-600">
              No shops saved yet
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Compare a basket and hit “Save this basket” to start tracking.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Compare a basket
            </Link>
          </div>
        )}

        <ul className="space-y-3">
          {trips?.map((trip) => {
            const isTie = trip.winner === "tie";
            const itemCount = trip.lineItems.reduce((s, l) => s + l.qty, 0);
            const dearer = Math.max(
              trip.colesTotal,
              trip.wooliesTotal,
              trip.aldiTotal ?? 0,
            );
            const pct =
              trip.savedPercent ??
              (dearer > 0 ? Math.round((trip.saved / dearer) * 100) : 0);
            return (
              <li
                key={trip._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">
                      {trip.basketName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(trip._creationTime).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {itemCount} item{itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-start gap-2">
                    <div className="text-right">
                      {isTie ? (
                        <p className="text-sm font-medium text-slate-500">
                          No saving
                        </p>
                      ) : (
                        <>
                          <p className="text-lg font-bold text-emerald-700">
                            Saved {money(trip.saved)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {pct}% off this basket
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTrip({ id: trip._id as Id<"trips"> })}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Delete basket"
                      title="Delete basket"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Basket contents */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {trip.lineItems.map((l) => (
                    <span
                      key={l.name}
                      className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-600"
                    >
                      {l.name}
                      {l.qty > 1 && (
                        <span className="text-slate-400"> ×{l.qty}</span>
                      )}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        highlight ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold tabular-nums ${
          highlight ? "text-emerald-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
