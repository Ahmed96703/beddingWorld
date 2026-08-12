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
      product_variants: {
        Row: ProductVariantRow;
        Insert: ProductVariantInsert;
        Update: Partial<ProductVariantInsert>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow>;
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Partial<OrderItemRow>;
        Update: Partial<OrderItemRow>;
        Relationships: [];
      };
      product_categories: {
        Row: ProductCategoryRow;
        Insert: ProductCategoryRow;
        Update: Partial<ProductCategoryRow>;
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
      place_order: {
        Args: { _customer: PlaceOrderCustomer; _items: PlaceOrderItem[]; _shipping: number };
        Returns: PlaceOrderResult;
      };
      set_order_status: {
        Args: { _order_id: string; _status: OrderStatus };
        Returns: undefined;
      };
      set_order_archived: {
        Args: { _order_id: string; _archived: boolean };
        Returns: undefined;
      };
      get_inventory_report: {
        Args: Record<string, never>;
        Returns: InventoryReportRow[];
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

/* ------------------------------ Variants ------------------------------------ */

export type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  variant_key: string;
  price: number;
  stock: number;
  sort_order: number;
  created_at: string;
};

export type ProductVariantInsert = {
  id?: string;
  product_id: string;
  name: string;
  variant_key: string;
  price: number;
  stock?: number;
  sort_order?: number;
};

/* -------------------------------- Orders ------------------------------------ */

export type OrderStatus =
  | "received"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderRow = {
  id: string;
  order_ref: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductCategoryRow = {
  product_id: string;
  category_id: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

/** An order joined with its line items (used by the admin Orders page). */
export type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };

/* -------------------------- place_order() payloads -------------------------- */

export type PlaceOrderCustomer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
};

export type PlaceOrderItem = {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
};

export type PlaceOrderResult = {
  id: string;
  order_ref: string;
  subtotal: number;
  shipping: number;
  total: number;
};

export type InventoryReportRow = {
  product_id: string;
  product_name: string;
  variant_name: string | null;
  stock: number;
  sold: number;
};
