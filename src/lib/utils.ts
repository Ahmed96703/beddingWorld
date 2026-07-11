import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/** Format a numeric price into a localized currency string. */
export function formatPrice(value: number): string {
  return currency.format(Number.isFinite(value) ? value : 0);
}

/** Convert an arbitrary string into a url-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Estimated delivery date for COD orders (default 4 business-ish days). */
export function estimatedDelivery(days = 4): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Stable, human-friendly order reference. */
export function makeOrderRef(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `LIN-${stamp}${rand}`;
}
