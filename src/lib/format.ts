import { STORE_LABELS, type Store } from "./compare";

const AUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

export const money = (n: number) => AUD.format(n);

export const storeLabel = (store: string) =>
  STORE_LABELS[store as Store] ?? "Multiple stores";
