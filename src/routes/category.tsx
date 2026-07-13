import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { EmptyState, ErrorState, LoadingSpinner } from "@/components/states";
import { ProductImage } from "@/components/product-image";
import { useCatalog } from "@/hooks/use-catalog";
import { useAsync } from "@/hooks/use-async";
import { fetchProducts } from "@/lib/api";
import { childrenOf, collectDescendantIds } from "@/lib/categories";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const { flat, loading: catLoading, error: catError } = useCatalog();

  const category = useMemo(
    () => flat.find((c) => c.slug === slug),
    [flat, slug],
  );
  const subCategories = useMemo(
    () => (category ? childrenOf(flat, category.id) : []),
    [flat, category],
  );
  const descendantIds = useMemo(
    () => (category ? collectDescendantIds(flat, category.id) : []),
    [flat, category],
  );

  const products = useAsync(
    () =>
      descendantIds.length
        ? fetchProducts({ categoryIds: descendantIds, status: "live" })
        : Promise.resolve([]),
    [descendantIds.join(",")],
  );

  if (catLoading) return <LoadingSpinner label="Loading collection…" />;
  if (catError)
    return (
      <div className="container py-16">
        <ErrorState error={catError} />
      </div>
    );
  if (!category && flat.length > 0) return <Navigate to="/" replace />;
  if (!category) return null;

  return (
    <>
      <Seo
        title={`${category.name} Collection`}
        description={
          category.description ??
          `Shop premium ${category.name.toLowerCase()} at Bedding World — crafted for comfort and made to last.`
        }
        image={category.image_url ?? undefined}
        path={`/category/${category.slug}`}
      />

      {/* Category hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        <div className="container py-10 md:py-14">
          <Breadcrumbs items={[{ label: category.name }]} />
          <div className="mt-6 max-w-2xl">
            <p className="eyebrow">Collection</p>
            <h1 className="mt-2 text-balance font-display text-4xl leading-tight md:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 text-pretty text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        {/* Sub-category cards */}
        {subCategories.length > 0 && (
          <div className="mb-14">
            <h2 className="mb-6 font-display text-2xl">Shop by category</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {subCategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/category/${category.slug}/${sub.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-secondary"
                >
                  <div className="aspect-[5/4] transition-transform duration-700 group-hover:scale-105">
                    <ProductImage src={sub.image_url} alt={sub.name} />
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/60 to-transparent p-4">
                    <span className="flex items-center gap-1.5 font-display text-lg text-background">
                      {sub.name}
                      <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All products in this category */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">
            {subCategories.length > 0 ? `All ${category.name}` : "Products"}
          </h2>
          {products.data && (
            <span className="text-sm text-muted-foreground">
              {products.data.length}{" "}
              {products.data.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        <div className="mt-8">
          {products.loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.error ? (
            <ErrorState error={products.error} onRetry={products.refetch} />
          ) : products.data && products.data.length > 0 ? (
            <ProductGrid products={products.data} />
          ) : (
            <EmptyState
              title="No products yet"
              message="Products added to this category will appear here."
            />
          )}
        </div>
      </div>
    </>
  );
}
