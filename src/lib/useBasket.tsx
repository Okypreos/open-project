"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BasketEntries = Record<string, number>; // productId -> qty

type BasketContextValue = {
  entries: BasketEntries;
  name: string;
  count: number;
  setName: (name: string) => void;
  setQty: (productId: string, qty: number) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  loadEntries: (entries: BasketEntries) => void;
  mergeEntries: (toAdd: BasketEntries) => void;
};

const STORAGE_KEY = "cartcompass.basket.v1";

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<BasketEntries>({});
  const [name, setName] = useState("My weekly shop");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { entries?: BasketEntries; name?: string };
        if (parsed.entries) setEntries(parsed.entries);
        if (parsed.name) setName(parsed.name);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration to avoid clobbering).
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries, name }));
  }, [entries, name, hydrated]);

  const setQty = useCallback((productId: string, qty: number) => {
    setEntries((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[productId];
      else next[productId] = qty;
      return next;
    });
  }, []);

  const add = useCallback((productId: string) => {
    setEntries((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
  }, []);

  const remove = useCallback((productId: string) => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clear = useCallback(() => setEntries({}), []);

  const loadEntries = useCallback((next: BasketEntries) => setEntries(next), []);

  const mergeEntries = useCallback((toAdd: BasketEntries) => {
    setEntries((prev) => {
      const next = { ...prev };
      for (const [id, qty] of Object.entries(toAdd)) {
        next[id] = (next[id] ?? 0) + qty;
      }
      return next;
    });
  }, []);

  const count = useMemo(
    () => Object.values(entries).reduce((s, q) => s + q, 0),
    [entries],
  );

  const value: BasketContextValue = {
    entries,
    name,
    count,
    setName,
    setQty,
    add,
    remove,
    clear,
    loadEntries,
    mergeEntries,
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used within BasketProvider");
  return ctx;
}
