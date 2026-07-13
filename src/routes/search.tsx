import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { Seo } from "@/components/seo";
import { ProductGrid } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { useAsync } from "@/hooks/use-async";
import { fetchProducts } from "@/lib/api";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();

  const products = useAsync(
    () =>
      query
        ? fetchProducts({ search: query, status: "live", sort: "newest" })
        : fetchProducts({ status: "live", sort: "newest", limit: 12 }),
    [query],
  );

  return (
    <>
      <Seo
        title={query ? `Search · ${query}` : "Search"}
        description={`Search results for ${query || "all products"} at Bedding World.`}
        path="/search"
        noindex
      />

      <div className="container py-12 md:py-16">
        <p className="eyebrow">Search</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">
          {query ? (
            <>
              Results for <span className="italic text-clay">“{query}”</span>
            </>
          ) : (
            "Explore the collection"
          )}
        </h1>

        <div className="mt-10">
          {products.loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.error ? (
            <ErrorState error={products.error} onRetry={products.refetch} />
          ) : products.data && products.data.length > 0 ? (
            <ProductGrid products={products.data} />
          ) : (
            <EmptyState
              icon={SearchIcon}
              title={`No results for “${query}”`}
              message="Try a broader term, or browse the collections from the menu."
            />
          )}
        </div>
      </div>
    </>
  );
}
