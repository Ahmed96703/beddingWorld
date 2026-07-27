import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  /** Variant label shown to the customer, e.g. "Single" (undefined = no variant). */
  variant?: string;
  /** Variant row id — sent to place_order() so the right stock is decremented. */
  variantId?: string;
  /** Max available stock for this line, used to cap the quantity selector. */
  maxStock?: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, variant?: string) => void;
  setQuantity: (id: string, quantity: number, variant?: string) => void;
  increment: (id: string, variant?: string) => void;
  decrement: (id: string, variant?: string) => void;
  clear: () => void;
}

const itemKey = (id: string, variant?: string) => `${id}::${variant ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const key = itemKey(item.id, item.variant);
          const existing = state.items.find(
            (i) => itemKey(i.id, i.variant) === key,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.id, i.variant) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (id, variant) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.id, i.variant) !== itemKey(id, variant),
          ),
        })),
      setQuantity: (id, quantity, variant) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              itemKey(i.id, i.variant) === itemKey(id, variant)
                ? { ...i, quantity: Math.max(1, quantity) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      increment: (id, variant) =>
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.id, i.variant) === itemKey(id, variant)
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        })),
      decrement: (id, variant) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              itemKey(i.id, i.variant) === itemKey(id, variant)
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "linea-cart" },
  ),
);

/** Derived selectors (kept outside the store to avoid re-renders). */
export const selectCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
