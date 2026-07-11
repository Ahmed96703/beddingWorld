/**
 * Database types — mirror the schema defined in `supabase/migrations`.
 * Keeping these in one place gives the whole app end-to-end type-safety.
 */

export type AppRole = "admin" | "customer";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: Partial<CategoryInsert>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
        Relationships: [];
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: UserRoleInsert;
        Update: Partial<UserRoleInsert>;
        Relationships: [];
      };
      store_settings: {
        Row: StoreSettingsRow;
        Insert: Partial<StoreSettingsRow>;
        Update: Partial<StoreSettingsRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
      list_admins: {
        Args: Record<string, never>;
        Returns: { user_id: string; email: string; created_at: string }[];
      };
      grant_admin: {
        Args: { _email: string };
        Returns: undefined;
      };
      revoke_admin: {
        Args: { _user_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  /** null = top-level category, otherwise points at the parent category id */
  parent_id: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type CategoryInsert = {
  id?: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number;
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  /** primary category (usually the sub or sub-sub category) */
  category_id: string | null;
  images: string[];
  status: "live" | "draft";
  featured: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type ProductInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  category_id?: string | null;
  images?: string[];
  status?: "live" | "draft";
  featured?: boolean;
  stock?: number;
};

export type UserRoleRow = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
};

export type UserRoleInsert = {
  id?: string;
  user_id: string;
  role: AppRole;
};

export type StoreSettingsRow = {
  id: number;
  store_name: string;
  base_currency: string;
  auto_detect_currency: boolean;
  free_shipping_threshold: number;
  shipping_flat: number;
  updated_at: string;
};
