import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demo-data";
import type {
  CategoryRow,
  CategoryInsert,
  ProductRow,
  ProductInsert,
} from "@/integrations/supabase/types";

/**
 * Editable in-memory catalog used ONLY when Supabase is not configured. It lets
 * the admin dashboard be fully exercised offline — add / edit / delete products
 * and categories, toggle Live/Draft & Featured — with changes persisted to
 * localStorage so they survive reloads. When Supabase env vars are present this
 * store is never touched; all data is live.
 */
interface DemoCatalogState {
  products: ProductRow[];
  categories: CategoryRow[];

  addProduct: (payload: ProductInsert) => ProductRow;
  updateProduct: (id: string, patch: Partial<ProductInsert>) => ProductRow;
  removeProduct: (id: string) => void;

  addCategory: (payload: CategoryInsert) => CategoryRow;
  removeCategory: (id: string) => void;

  reset: () => void;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `demo-${Math.random().toString(36).slice(2)}`;

export const useDemoCatalog = create<DemoCatalogState>()(
  persist(
    (set, get) => ({
      products: DEMO_PRODUCTS.map((p) => ({ ...p })),
      categories: DEMO_CATEGORIES.map((c) => ({ ...c })),

      addProduct: (payload) => {
        const stamp = new Date().toISOString();
        const product: ProductRow = {
          id: uid(),
          name: payload.name,
          slug: payload.slug,
          description: payload.description ?? null,
          price: payload.price,
          compare_at_price: payload.compare_at_price ?? null,
          category_id: payload.category_id ?? null,
          images: payload.images ?? [],
          status: payload.status ?? "draft",
          featured: payload.featured ?? false,
          stock: payload.stock ?? 0,
          created_at: stamp,
          updated_at: stamp,
        };
        set({ products: [product, ...get().products] });
        return product;
      },

      updateProduct: (id, patch) => {
        let updated: ProductRow | undefined;
        set({
          products: get().products.map((p) => {
            if (p.id !== id) return p;
            updated = {
              ...p,
              ...patch,
              description:
                patch.description === undefined
                  ? p.description
                  : patch.description ?? null,
              compare_at_price:
                patch.compare_at_price === undefined
                  ? p.compare_at_price
                  : patch.compare_at_price ?? null,
              category_id:
                patch.category_id === undefined
                  ? p.category_id
                  : patch.category_id ?? null,
              updated_at: new Date().toISOString(),
            } as ProductRow;
            return updated;
          }),
        });
        if (!updated) throw new Error("Product not found");
        return updated;
      },

      removeProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),

      addCategory: (payload) => {
        const category: CategoryRow = {
          id: uid(),
          name: payload.name,
          slug: payload.slug,
          parent_id: payload.parent_id ?? null,
          description: payload.description ?? null,
          image_url: payload.image_url ?? null,
          sort_order: payload.sort_order ?? 0,
          created_at: new Date().toISOString(),
        };
        set({ categories: [...get().categories, category] });
        return category;
      },

      removeCategory: (id) => {
        const hasChildren = get().categories.some((c) => c.parent_id === id);
        if (hasChildren)
          throw new Error("Delete sub-categories first.");
        set({ categories: get().categories.filter((c) => c.id !== id) });
      },

      reset: () =>
        set({
          products: DEMO_PRODUCTS.map((p) => ({ ...p })),
          categories: DEMO_CATEGORIES.map((c) => ({ ...c })),
        }),
    }),
    { name: "linea-demo-catalog" },
  ),
);
