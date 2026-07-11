import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/states";
import { ProductImage } from "@/components/product-image";
import { ProductForm } from "./product-form";
import { useAsync } from "@/hooks/use-async";
import { fetchProducts, deleteProduct, fetchCategories } from "@/lib/api";
import type { ProductRow } from "@/integrations/supabase/types";
import { useCurrency } from "@/context/currency";

export default function AdminProducts() {
  const [params, setParams] = useSearchParams();
  const products = useAsync(
    () => fetchProducts({ status: "all", sort: "newest" }),
    [],
  );
  const categories = useAsync(fetchCategories, []);
  const { formatBase } = useCurrency();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ProductRow | null>(null);

  // Support /admin/products?new=1 deep-link from the dashboard.
  useEffect(() => {
    if (params.get("new")) {
      setEditing(null);
      setFormOpen(true);
      const next = new URLSearchParams(params);
      next.delete("new");
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  const categoryName = useMemo(() => {
    const map = new Map((categories.data ?? []).map((c) => [c.id, c.name]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [categories.data]);

  const filtered = useMemo(() => {
    const list = products.data ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q));
  }, [products.data, search]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: ProductRow) => {
    setEditing(p);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteProduct(pendingDelete.id);
      toast.success("Product deleted");
      products.refetch();
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-1 font-display text-3xl">Products</h1>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </header>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="pl-9"
        />
      </div>

      {products.error ? (
        <ErrorState error={products.error} onRetry={products.refetch} />
      ) : products.loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "No matches" : "No products yet"}
          message={
            search
              ? "Try a different search term."
              : "Add your first product to start building the catalog."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Header row (desktop) */}
          <div className="hidden grid-cols-[1fr_8rem_6rem_6rem_5rem] gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <ul className="divide-y divide-border">
            {filtered.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-secondary/40 md:grid-cols-[1fr_8rem_6rem_6rem_5rem] md:items-center md:gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-secondary">
                    <ProductImage src={p.images?.[0]} alt={p.name} />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-medium">
                      {p.name}
                      {p.featured && (
                        <Star className="h-3.5 w-3.5 shrink-0 fill-clay text-clay" />
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      /{p.slug}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-muted-foreground">
                  {categoryName(p.category_id)}
                </span>
                <span className="text-sm font-medium">
                  {formatBase(p.price)}
                </span>
                <span>
                  <Badge variant={p.status === "live" ? "live" : "draft"}>
                    {p.status}
                  </Badge>
                </span>

                <div className="flex items-center gap-1 md:justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(p)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingDelete(p)}
                    aria-label="Delete"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={products.refetch}
        product={editing}
        categories={categories.data ?? []}
      />

      {/* Delete confirmation */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg">Delete product?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              “{pendingDelete.name}” will be permanently removed. This can't be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
