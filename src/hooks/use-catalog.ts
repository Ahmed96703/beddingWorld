import { useMemo } from "react";
import { useAsync } from "./use-async";
import { fetchCategories } from "@/lib/api";
import { buildCategoryTree, type CategoryNode } from "@/lib/categories";
import type { CategoryRow } from "@/integrations/supabase/types";

export interface CatalogState {
  flat: CategoryRow[];
  tree: CategoryNode[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Loads the full category list once and exposes both the flat list and a
 * nested tree. Used by the header mega-menu, mobile drawer, and category pages.
 */
export function useCatalog(): CatalogState {
  const { data, loading, error, refetch } = useAsync<CategoryRow[]>(
    fetchCategories,
    [],
  );
  const flat = useMemo(() => data ?? [], [data]);
  const tree = useMemo(() => buildCategoryTree(flat), [flat]);
  return { flat, tree, loading, error, refetch };
}
