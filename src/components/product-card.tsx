import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductRow } from "@/integrations/supabase/types";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/currency";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ProductRow }) {
  const addItem = useCart((s) => s.addItem);
  const { format } = useCurrency();
  const onSale =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0] ?? null,
    });
    toast.success("Added to cart", { description: product.name });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            <ProductImage
              src={product.images?.[0]}
              alt={product.name}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.featured && <Badge variant="clay">Editor's Pick</Badge>}
            {onSale && <Badge variant="secondary">Sale</Badge>}
          </div>

          {/* Add-to-cart reveal on hover (always tappable on touch) */}
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
            <button
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary/95 px-4 py-3 text-sm font-medium text-primary-foreground backdrop-blur transition-colors hover:bg-primary"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-pretty font-display text-[1.05rem] leading-snug text-foreground transition-colors group-hover:text-clay">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">
              {format(product.price)}
            </span>
            {onSale && (
              <span className="text-muted-foreground line-through">
                {format(product.compare_at_price!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: ProductRow[];
  columns?: 3 | 4;
}) {
  return (
    <div
      className={
        columns === 3
          ? "grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3"
          : "grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
      }
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
