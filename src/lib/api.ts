import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type {
  CategoryRow,
  ProductRow,
  ProductInsert,
  CategoryInsert,
} from "@/integrations/supabase/types";
import { useDemoCatalog } from "@/lib/demo-store";

/** Small async helper so demo reads mimic a real (resolved) network call. */
const demo = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

const demoProducts = () => useDemoCatalog.getState().products;
const demoCategories = () => useDemoCatalog.getState().categories;

/** Apply a ProductQuery to the in-memory product list (demo mode). */
function filterDemoProducts(query: ProductQuery): ProductRow[] {
  let list = demoProducts().slice();
  if (query.status && query.status !== "all") {
    list = list.filter((p) => p.status === query.status);
  } else if (!query.status) {
    list = list.filter((p) => p.status === "live");
  }
  if (query.featured) list = list.filter((p) => p.featured);
  if (query.categoryIds && query.categoryIds.length > 0) {
    const set = new Set(query.categoryIds);
    list = list.filter((p) => p.category_id && set.has(p.category_id));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q),
    );
  }
  switch (query.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return query.limit ? list.slice(0, query.limit) : list;
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

function ensureConfigured() {
  if (!isSupabaseConfigured) throw new SupabaseNotConfiguredError();
}

/* --------------------------------- Categories -------------------------------- */

export async function fetchCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured) {
    return demo(
      demoCategories()
        .slice()
        .sort(
          (a, b) =>
            a.sort_order - b.sort_order || a.name.localeCompare(b.name),
        ),
    );
  }
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<CategoryRow | null> {
  if (!isSupabaseConfigured)
    return demo(demoCategories().find((c) => c.slug === slug) ?? null);
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCategory(
  payload: CategoryInsert,
): Promise<CategoryRow> {
  if (!isSupabaseConfigured)
    return demo(useDemoCatalog.getState().addCategory(payload));
  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    useDemoCatalog.getState().removeCategory(id);
    return demo(undefined);
  }
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------------------------- Products --------------------------------- */

export interface ProductQuery {
  /** Restrict to these category ids (a category + all its descendants). */
  categoryIds?: string[];
  status?: "live" | "draft" | "all";
  featured?: boolean;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name";
  limit?: number;
}

export async function fetchProducts(
  query: ProductQuery = {},
): Promise<ProductRow[]> {
  if (!isSupabaseConfigured) return demo(filterDemoProducts(query));
  let q = supabase.from("products").select("*");

  if (query.status && query.status !== "all") {
    q = q.eq("status", query.status);
  } else if (!query.status) {
    q = q.eq("status", "live");
  }

  if (query.featured) q = q.eq("featured", true);
  if (query.categoryIds && query.categoryIds.length > 0) {
    q = q.in("category_id", query.categoryIds);
  }
  if (query.search) {
    q = q.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%`);
  }

  switch (query.sort) {
    case "price-asc":
      q = q.order("price", { ascending: true });
      break;
    case "price-desc":
      q = q.order("price", { ascending: false });
      break;
    case "name":
      q = q.order("name", { ascending: true });
      break;
    default:
      q = q.order("created_at", { ascending: false });
  }

  if (query.limit) q = q.limit(query.limit);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ProductRow | null> {
  if (!isSupabaseConfigured)
    return demo(demoProducts().find((p) => p.slug === slug) ?? null);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProduct(
  payload: ProductInsert,
): Promise<ProductRow> {
  if (!isSupabaseConfigured)
    return demo(useDemoCatalog.getState().addProduct(payload));
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(
  id: string,
  payload: Partial<ProductInsert>,
): Promise<ProductRow> {
  if (!isSupabaseConfigured)
    return demo(useDemoCatalog.getState().updateProduct(id, payload));
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    useDemoCatalog.getState().removeProduct(id);
    return demo(undefined);
  }
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

/* ---------------------------------- Storage ---------------------------------- */

const BUCKET = "product-images";

export async function uploadProductImage(file: File): Promise<string> {
  // Demo mode: encode the image as a data URL so previews work without storage.
  if (!isSupabaseConfigured) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read image file"));
      reader.readAsDataURL(file);
    });
  }
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* ------------------------------------ Roles ---------------------------------- */

/** Is the given user an admin? Uses the `has_role` security-definer function. */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  ensureConfigured();
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw error;
  return Boolean(data);
}

/** Whether any admin already exists (controls the "claim admin" flow). */
export async function adminExists(): Promise<boolean> {
  ensureConfigured();
  const { count, error } = await supabase
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw error;
  return (count ?? 0) > 0;
}

/** First registered user claims the admin role. */
export async function claimAdminRole(userId: string): Promise<void> {
  ensureConfigured();
  const { error } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });
  if (error) throw error;
}

/* ------------------------------ Admin statistics ----------------------------- */

export interface AdminStats {
  totalProducts: number;
  liveProducts: number;
  draftProducts: number;
  totalCategories: number;
  featuredProducts: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured) {
    const items = demoProducts();
    return demo({
      totalProducts: items.length,
      liveProducts: items.filter((p) => p.status === "live").length,
      draftProducts: items.filter((p) => p.status === "draft").length,
      totalCategories: demoCategories().length,
      featuredProducts: items.filter((p) => p.featured).length,
    });
  }
  const [products, live, draft, categories, featured] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "live"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("featured", true),
  ]);

  const firstError =
    products.error ||
    live.error ||
    draft.error ||
    categories.error ||
    featured.error;
  if (firstError) throw firstError;

  return {
    totalProducts: products.count ?? 0,
    liveProducts: live.count ?? 0,
    draftProducts: draft.count ?? 0,
    totalCategories: categories.count ?? 0,
    featuredProducts: featured.count ?? 0,
  };
}

/* ------------------------------ Store settings ------------------------------- */

export interface StoreSettings {
  store_name: string;
  base_currency: string;
  auto_detect_currency: boolean;
  free_shipping_threshold: number;
  shipping_flat: number;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  store_name: "Bedding World",
  base_currency: "PKR",
  // Show PKR to everyone by default; visitors can still switch manually.
  auto_detect_currency: false,
  free_shipping_threshold: 5000,
  shipping_flat: 250,
};

export async function fetchSettings(): Promise<StoreSettings> {
  if (!isSupabaseConfigured) return demo(DEFAULT_SETTINGS);
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  // If the settings table hasn't been created yet, fall back to defaults so
  // the storefront keeps working (currency detection still functions).
  if (error || !data) return DEFAULT_SETTINGS;
  return {
    store_name: data.store_name,
    base_currency: data.base_currency,
    auto_detect_currency: data.auto_detect_currency,
    free_shipping_threshold: Number(data.free_shipping_threshold),
    shipping_flat: Number(data.shipping_flat),
  };
}

export async function updateSettings(
  patch: Partial<StoreSettings>,
): Promise<void> {
  ensureConfigured();
  const { error } = await supabase
    .from("store_settings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw error;
}

/* ------------------------------ Team / admins -------------------------------- */

export interface AdminMember {
  user_id: string;
  email: string;
  created_at: string;
}

export async function listAdmins(): Promise<AdminMember[]> {
  if (!isSupabaseConfigured)
    return demo([
      {
        user_id: "demo-admin",
        email: "demo@linea.local",
        created_at: new Date().toISOString(),
      },
    ]);
  const { data, error } = await supabase.rpc("list_admins");
  if (error) throw error;
  return (data ?? []) as AdminMember[];
}

export async function grantAdmin(email: string): Promise<void> {
  if (!isSupabaseConfigured)
    throw new Error("Connect Supabase to manage real admins.");
  const { error } = await supabase.rpc("grant_admin", { _email: email });
  if (error) throw error;
}

export async function revokeAdmin(userId: string): Promise<void> {
  if (!isSupabaseConfigured)
    throw new Error("Connect Supabase to manage real admins.");
  const { error } = await supabase.rpc("revoke_admin", { _user_id: userId });
  if (error) throw error;
}
