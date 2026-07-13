import { useMemo, useState } from "react";
import {
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Seo } from "@/components/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { EmptyState, ErrorState, LoadingSpinner } from "@/components/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/hooks/use-catalog";
import { useAsync } from "@/hooks/use-async";
import { fetchProducts, type ProductQuery } from "@/lib/api";
import { childrenOf, collectDescendantIds } from "@/lib/categories";
import { cn } from "@/lib/utils";

type SortKey = NonNullable<ProductQuery["sort"]>;

export default function SubCategoryPage() {
  const { slug = "", sub = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const activeLeaf = params.get("cat") ?? "all";
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { flat, loading: catLoading, error: catError } = useCatalog();

  const parent = useMemo(() => flat.find((c) => c.slug === slug), [flat, slug]);
  const subCategory = useMemo(
    () => flat.find((c) => c.slug === sub && c.parent_id === parent?.id),
    [flat, sub, parent],
  );

  // Sub-sub categories become the left sidebar filters.
  const leaves = useMemo(
    () => (subCategory ? childrenOf(flat, subCategory.id) : []),
    [flat, subCategory],
  );

  const activeLeafCategory = useMemo(
    () => leaves.find((l) => l.slug === activeLeaf),
    [leaves, activeLeaf],
  );

  // Which category ids to query: a specific leaf, or the whole sub-category.
  const queryIds = useMemo(() => {
    if (!subCategory) return [];
    if (activeLeafCategory) {
      return collectDescendantIds(flat, activeLeafCategory.id);
    }
    return collectDescendantIds(flat, subCategory.id);
  }, [flat, subCategory, activeLeafCategory]);

  const products = useAsync(
    () =>
      queryIds.length
        ? fetchProducts({ categoryIds: queryIds, status: "live", sort })
        : Promise.resolve([]),
    [queryIds.join(","), sort],
  );

  const setLeaf = (leafSlug: string) => {
    const next = new URLSearchParams(params);
    if (leafSlug === "all") next.delete("cat");
    else next.set("cat", leafSlug);
    setParams(next, { replace: true });
    setMobileFiltersOpen(false);
  };

  if (catLoading) return <LoadingSpinner label="Loading…" />;
  if (catError)
    return (
      <div className="container py-16">
        <ErrorState error={catError} />
      </div>
    );
  if (flat.length > 0 && (!parent || !subCategory))
    return <Navigate to={parent ? `/category/${parent.slug}` : "/"} replace />;
  if (!parent || !subCategory) return null;

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="text-[0.72rem] font-medium uppercase tracking-widest2 text-muted-foreground">
          Categories
        </h3>
        <ul className="mt-4 space-y-1">
          <li>
            <button
              onClick={() => setLeaf("all")}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                activeLeaf === "all"
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              All {subCategory.name}
            </button>
          </li>
          {leaves.map((leaf) => (
            <li key={leaf.id}>
              <button
                onClick={() => setLeaf(leaf.slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                  activeLeaf === leaf.slug
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {leaf.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <Seo
        title={`${subCategory.name} · ${parent.name}`}
        description={
          subCategory.description ??
          `Shop ${subCategory.name.toLowerCase()} in our ${parent.name.toLowerCase()} collection at Bedding World.`
        }
        image={subCategory.image_url ?? undefined}
        path={`/category/${parent.slug}/${subCategory.slug}`}
      />

      <div className="container py-8 md:py-10">
        <Breadcrumbs
          items={[
            { label: parent.name, to: `/category/${parent.slug}` },
            { label: subCategory.name },
          ]}
        />
        <div className="mt-5 flex flex-col gap-2">
          <h1 className="font-display text-3xl leading-tight md:text-4xl">
            {activeLeafCategory ? activeLeafCategory.name : subCategory.name}
          </h1>
          {subCategory.description && !activeLeafCategory && (
            <p className="max-w-2xl text-muted-foreground">
              {subCategory.description}
            </p>
          )}
        </div>
      </div>

      <div className="container grid gap-8 pb-20 lg:grid-cols-[16rem_1fr]">
        {/* Sticky sidebar filters (desktop) */}
        {leaves.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-28">{FiltersPanel}</div>
          </aside>
        )}

        <div className={leaves.length === 0 ? "lg:col-span-2" : ""}>
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {leaves.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              )}
              {products.data && (
                <span className="text-sm text-muted-foreground">
                  {products.data.length}{" "}
                  {products.data.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-9 w-[170px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product grid */}
          {products.loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.error ? (
            <ErrorState error={products.error} onRetry={products.refetch} />
          ) : products.data && products.data.length > 0 ? (
            <ProductGrid products={products.data} />
          ) : (
            <EmptyState
              title="No products found"
              message="Try a different category or check back soon."
            />
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[82vw] max-w-xs overflow-y-auto bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {FiltersPanel}
          </div>
        </div>
      )}
    </>
  );
}
