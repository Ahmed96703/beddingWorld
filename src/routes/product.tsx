import { useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
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
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/currency";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const { flat } = useCatalog();
  const addItem = useCart((s) => s.addItem);
  const { format } = useCurrency();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<"single" | "double">("single");

  const { data: product, loading, error, refetch } = useAsync(
    () => fetchProductBySlug(slug),
    [slug],
  );

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
  const onSale =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;
  const needsSizeSelection = !!category && category.slug.includes("sheet");
  const selectedVariant = needsSizeSelection
    ? size === "single"
      ? "Single"
      : "Double"
    : undefined;
  const whatsappUrl = `https://wa.me/923054788662?text=${encodeURIComponent(
    `Hi Bedding World, I want to order ${product.name}${selectedVariant ? ` (${selectedVariant})` : ""}.`,
  )}`;

  // Build breadcrumb trail from the deepest known ancestor down.
  const topCat = grandparent ?? parent ?? category;
  const midCat = grandparent ? parent : category?.parent_id ? parent : undefined;
  const crumbs = [
    topCat && {
      label: topCat.name,
      to: `/category/${topCat.slug}`,
    },
    midCat &&
      topCat && {
        label: midCat.name,
        to: `/category/${topCat.slug}/${midCat.slug}`,
      },
    { label: product.name },
  ].filter(Boolean) as { label: string; to?: string }[];

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0] ?? null,
        variant: selectedVariant,
      },
      qty,
    );
    toast.success("Added to cart", {
      description: `${qty} × ${product.name}${selectedVariant ? ` • ${selectedVariant}` : ""}`,
    });
  };

  const relatedProducts = (related.data ?? []).filter(
    (p) => p.id !== product.id,
  );

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
            <span className="font-display text-2xl">
              {format(product.price)}
            </span>
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

          {needsSizeSelection && (
            <div className="mt-6">
              <p className="text-sm font-medium">Choose size</p>
              <div className="mt-3 inline-flex rounded-lg border border-border bg-secondary/40 p-1">
                {[
                  { key: "single", label: "Single" },
                  { key: "double", label: "Double" },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setSize(option.key as "single" | "double")}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      size === option.key
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Available for bed sheet styles.
              </p>
            </div>
          )}

          <Separator className="my-8" />

          {/* Quantity + add to cart */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button size="lg" className="flex-1" onClick={handleAdd}>
              <ShoppingBag className="h-4 w-4" />
              Add to Cart · {format(product.price * qty)}
            </Button>
            <Button asChild variant="outline" size="lg" className="sm:min-w-44">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          {product.stock <= 0 && (
            <p className="mt-3 text-sm text-clay">
              Currently made to order — ships within 2 weeks.
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
