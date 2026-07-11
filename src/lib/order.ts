import type { CartItem } from "@/store/cart";

export const SHIPPING_FLAT = 9;
export const FREE_SHIPPING_THRESHOLD = 120;

export function shippingFor(
  subtotal: number,
  threshold: number = FREE_SHIPPING_THRESHOLD,
  flat: number = SHIPPING_FLAT,
): number {
  if (subtotal <= 0) return 0;
  return subtotal >= threshold ? 0 : flat;
}

export interface PlacedOrder {
  ref: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  placedAt: string;
  deliveryEstimate: string;
}

const KEY = "linea-last-order";

/** Persist the most recent order so the success page survives a refresh. */
export function saveLastOrder(order: PlacedOrder) {
  sessionStorage.setItem(KEY, JSON.stringify(order));
}

export function loadLastOrder(): PlacedOrder | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
