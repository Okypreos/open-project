"use client";

import { useRef, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useBasket } from "@/lib/useBasket";

type Status =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "parsing" }
  | { kind: "done"; added: number; unmatched: string[] }
  | { kind: "error"; message: string };

/** Downscale a large photo client-side to keep uploads small and fast. */
async function compressImage(file: File, maxDim = 1600): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.8),
  );
}

export function ReceiptUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const parseReceipt = useAction(api.receipts.parseReceipt);
  const { mergeEntries } = useBasket();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleFile(file: File) {
    try {
      setStatus({ kind: "uploading" });
      const blob = await compressImage(file);

      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/jpeg" },
        body: blob,
      });
      if (!res.ok) throw new Error("Upload failed. Please try again.");
      const { storageId } = (await res.json()) as { storageId: string };

      setStatus({ kind: "parsing" });
      const result = await parseReceipt({
        storageId: storageId as Id<"_storage">,
      });

      const toAdd: Record<string, number> = {};
      for (const m of result.matched) {
        toAdd[m.productId] = (toAdd[m.productId] ?? 0) + m.qty;
      }
      mergeEntries(toAdd);

      setStatus({
        kind: "done",
        added: result.matched.length,
        unmatched: result.unmatched,
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Something went wrong scanning that receipt.",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = status.kind === "uploading" || status.kind === "parsing";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Scan a receipt</p>
          <p className="text-xs text-slate-400">
            Upload a photo and AI fills your basket.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="shrink-0 rounded-lg border border-emerald-600 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
        >
          {status.kind === "uploading"
            ? "Uploading…"
            : status.kind === "parsing"
              ? "Reading receipt…"
              : "Upload photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {status.kind === "done" && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
          <p className="font-medium">
            Added {status.added} item{status.added === 1 ? "" : "s"} to your basket.
          </p>
          {status.unmatched.length > 0 && (
            <p className="mt-1 text-emerald-700">
              Couldn’t match: {status.unmatched.slice(0, 5).join(", ")}
              {status.unmatched.length > 5 ? "…" : ""}. Add these manually if needed.
            </p>
          )}
        </div>
      )}

      {status.kind === "error" && (
        <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
          {status.message}
        </p>
      )}
    </div>
  );
}
