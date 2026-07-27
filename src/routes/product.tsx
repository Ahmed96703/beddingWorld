import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductImage } from "@/components/product-image";
import { ProductMagnifier } from "@/components/product-magnifier";
import { ProductGrid } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner, ErrorState } from "@/components/states";
import { useAsync } from "@/hooks/use-async";
import { useCatalog } from "@/hooks/use-catalog";
import { fetchProductBySlug, fetchProducts, fetchProductVariants } from "@/lib/api";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/currency";

const LOW_STOCK = 5;

export default function ProductPage() {
  const { slug = "" } = useParams();
  const { flat } = useCatalog();
  const addItem = useCart((s) => s.addItem);
  const { format } = useCurrency();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(null);

  const { data: product, loading, error, refetch } = useAsync(
    () => fetchProductBySlug(slug),
    [slug],
  );

  // Variants for this product (empty = sold with the product's own price/stock).
  const variantsState = useAsync(
    () => (product?.id ? fetchProductVariants(product.id) : Promise.resolve([])),
    [product?.id],
  );
  const variants = useMemo(() => variantsState.data ?? [], [variantsState.data]);

  // Default the selection to the first in-stock variant (or the first).
  useEffect(() => {
    if (variants.length === 0) {
      setVariantId(null);
      return;
    }
    const inStock = variants.find((v) => v.stock > 0);
    setVariantId((inStock ?? variants[0]).id);
    setQty(1);
  }, [variants]);

  const category = useMemo(
    () => flat.find((c) => c.id === product?.category_id),
    [flat, product],
  );
  const parent = useMemo(
    () => flat.find((c) => c.id === category?.parent_id),
    [flat, category],
  );
  const grandparent = useMemo(
    () => flat.find((c) => c.id === parent?.parent_id),
    [flat, parent],
  );

  const related = useAsync(
    () =>
      product?.category_id
        ? fetchProducts({
            categoryIds: [product.category_id],
            status: "live",
            limit: 5,
          })
        : Promise.resolve([]),
    [product?.category_id],
  );

  if (loading) return <LoadingSpinner label="Loading product…" />;
  if (error)
    return (
      <div className="container py-16">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  if (!product) return <Navigate to="/" replace />;

  const images =
    product.images && product.images.length > 0 ? product.images : [null];
  const hasVariants = variants.length > 0;
  const activeVariant = hasVariants
    ? variants.find((v) => v.id === variantId) ?? variants[0]
    : null;

  // Active price / stock come from the selected variant, or the product itself.
  const activePrice = activeVariant ? activeVariant.price : product.price;
  const activeStock = activeVariant ? activeVariant.stock : product.stock;
  const outOfStock = activeStock <= 0;
  const lowStock = !outOfStock && activeStock <= LOW_STOCK;

  const onSale =
    !hasVariants &&
    product.compare_at_price != null &&
    product.compare_at_price > product.price;

  const selectedVariantName = activeVariant?.name;
  const whatsappUrl = `https://wa.me/923054788662?text=${encodeURIComponent(
    `Hi Bedding World, I want to order ${product.name}${
      selectedVariantName ? ` (${selectedVariantName})` : ""
    }.`,
  )}`;

  const topCat = grandparent ?? parent ?? category;
  const midCat = grandparent ? parent : category?.parent_id ? parent : undefined;
  const crumbs = [
    topCat && { label: topCat.name, to: `/category/${topCat.slug}` },
    midCat &&
      topCat && {
        label: midCat.name,
        to: `/category/${topCat.slug}/${midCat.slug}`,
      },
    { label: product.name },
  ].filter(Boolean) as { label: string; to?: string }[];

  const selectVariant = (id: string) => {
    setVariantId(id);
    setQty(1);
  };

  const changeQty = (delta: number) =>
    setQty((q) => Math.min(Math.max(1, q + delta), Math.max(1, activeStock)));

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: activePrice,
        image: product.images?.[0] ?? null,
        variant: selectedVariantName,
        variantId: activeVariant?.id,
        maxStock: activeStock,
      },
      qty,
    );
    toast.success("Added to cart", {
      description: `${qty} × ${product.name}${
        selectedVariantName ? ` • ${selectedVariantName}` : ""
      }`,
    });
  };

  const relatedProducts = (related.data ?? []).filter((p) => p.id !== product.id);

  return (
    <>
      <Seo
        title={product.name}
        description={
          product.description?.slice(0, 160) ??
          `${product.name} — premium home textiles from Bedding World.`
        }
        image={product.images?.[0]}
        path={`/product/${product.slug}`}
        type="product"
      />

      <div className="container py-6 md:py-8">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className="container grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          {images.length > 1 && (
            <div className="flex gap-3 md:flex-col">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors md:h-24 md:w-20",
                    activeImage === i
                      ? "border-clay"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <ProductImage src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
          <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-secondary">
            <ProductMagnifier
              src={images[activeImage]}
              alt={product.name}
              eager
              className="absolute inset-0"
            />
            {onSale && (
              <Badge variant="clay" className="absolute left-4 top-4">
                Sale
              </Badge>
            )}
            {outOfStock && (
              <Badge className="absolute left-4 top-4 bg-foreground/80">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:pt-4">
          {category && (
            <Link
              to={
                parent
                  ? `/category/${(grandparent ?? parent).slug}`
                  : `/category/${category.slug}`
              }
              className="eyebrow hover:underline"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 text-balance font-display text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl">{format(activePrice)}</span>
            {onSale && (
              <span className="text-lg text-muted-foreground line-through">
                {format(product.compare_at_price!)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {/* Variant / size selector — only enabled options are shown */}
          {hasVariants && (
            <div className="mt-6">
              <p className="text-sm font-medium">
                Size:{" "}
                <span className="text-muted-foreground">
                  {selectedVariantName}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v) => {
                  const selected = v.id === activeVariant?.id;
                  const soldOut = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => selectVariant(v.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors",
                        selected
                          ? "border-clay bg-clay/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                        soldOut && "opacity-60",
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5 text-clay" />}
                      {v.name}
                      {soldOut && (
                        <span className="text-xs text-muted-foreground">
                          · Out
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div className="mt-5 text-sm">
            {outOfStock ? (
              <span className="inline-flex items-center gap-2 font-medium text-destructive">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Out of Stock
              </span>
            ) : lowStock ? (
              <span className="inline-flex items-center gap-2 font-medium text-clay">
                <span className="h-2 w-2 rounded-full bg-clay" />
                Only {activeStock} {activeStock === 1 ? "piece" : "pieces"} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                In Stock · {activeStock} available
              </span>
            )}
          </div>

          <Separator className="my-8" />

          {/* Quantity + add to cart */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => changeQty(-1)}
                className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                disabled={qty <= 1 || outOfStock}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => changeQty(1)}
                className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                disabled={outOfStock || qty >= activeStock}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              onClick={handleAdd}
              disabled={outOfStock}
            >
              <ShoppingBag className="h-4 w-4" />
              {outOfStock
                ? "Out of Stock"
                : `Add to Cart · ${format(activePrice * qty)}`}
            </Button>
            <Button asChild variant="outline" size="lg" className="sm:min-w-44">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          {qty >= activeStock && !outOfStock && (
            <p className="mt-3 text-xs text-muted-foreground">
              Maximum available quantity selected.
            </p>
          )}

          {/* Assurances */}
          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground">
            {[
              { icon: Truck, text: "Free delivery on bulk orders across Pakistan" },
              { icon: RotateCcw, text: "30-night comfort promise & easy returns" },
              { icon: ShieldCheck, text: "Cash on delivery available nationwide" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-clay" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="container border-t border-border py-16">
          <h2 className="mb-8 font-display text-2xl md:text-3xl">
            You may also like
          </h2>
          <ProductGrid products={relatedProducts.slice(0, 4)} />
        </section>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-white shadow-lift transition-transform hover:scale-[1.02]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>
    </>
  );
}
