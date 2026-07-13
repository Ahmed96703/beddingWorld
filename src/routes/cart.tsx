import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Seo } from "@/components/seo";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/states";
import { useCart, selectSubtotal } from "@/store/cart";
import { useCurrency } from "@/context/currency";
import { shippingFor } from "@/lib/order";
import { useStoreSettings } from "@/hooks/use-settings";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart(selectSubtotal);
  const { format } = useCurrency();
  const settings = useStoreSettings();
  const shipping = shippingFor(
    subtotal,
    settings.free_shipping_threshold,
    settings.shipping_flat,
  );
  const total = subtotal + shipping;
  const remaining = Math.max(0, settings.free_shipping_threshold - subtotal);

  return (
    <>
      <Seo title="Your Cart" description="Review your Bedding World cart." path="/cart" noindex />

      <div className="container py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-12 max-w-xl">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              message="Add a few pieces you love and they'll appear here."
            />
            <div className="mt-6 flex justify-center">
              <Button asChild variant="outline">
                <Link to="/">Continue shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
            {/* Items */}
            <div>
              {remaining > 0 ? (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm">
                  <Truck className="h-4 w-4 text-clay" />
                  <span>
                    You're <strong>{format(remaining)}</strong> away from
                    free shipping.
                  </span>
                </div>
              ) : (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm">
                  <Truck className="h-4 w-4 text-clay" />
                  <span>You've unlocked free shipping.</span>
                </div>
              )}

              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-6">
                    <Link
                      to={`/product/${item.slug}`}
                      className="h-28 w-24 shrink-0 overflow-hidden rounded-md bg-secondary"
                    >
                      <ProductImage src={item.image} alt={item.name} />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-display text-lg leading-snug hover:text-clay"
                        >
                          {item.name}
                        </Link>
                        <span className="font-medium">
                          {format(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {format(item.price)} each
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => decrement(item.id)}
                            className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increment(item.id)}
                            className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-xl">Order Summary</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{format(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>
                      {shipping === 0 ? (
                        <span className="text-clay">Free</span>
                      ) : (
                        format(shipping)
                      )}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-medium">
                    <dt>Total</dt>
                    <dd>{format(total)}</dd>
                  </div>
                </dl>

                <Button asChild size="lg" className="mt-6 w-full">
                  <Link to="/checkout">
                    Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Cash on delivery · No card required
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
