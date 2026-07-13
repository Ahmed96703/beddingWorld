import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { CheckCircle2, Truck, Package, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product-image";
import { loadLastOrder } from "@/lib/order";
import { useCurrency } from "@/context/currency";

export default function OrderSuccessPage() {
  const order = useMemo(() => loadLastOrder(), []);
  const { format } = useCurrency();

  if (!order) return <Navigate to="/" replace />;

  return (
    <>
      <Seo title="Order Confirmed" description="Your Bedding World order is confirmed." path="/order/success" noindex />

      <div className="container max-w-3xl py-16 md:py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clay text-clay-foreground"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>

        <div className="mt-6 text-center">
          <p className="eyebrow">Thank you, {order.name.split(" ")[0]}</p>
          <h1 className="mt-2 text-balance font-display text-4xl leading-tight md:text-5xl">
            Your order is confirmed.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Order reference{" "}
            <span className="font-medium text-foreground">{order.ref}</span> ·
            We'll call {order.phone} to confirm delivery.
          </p>
        </div>

        {/* Delivery + total highlight */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-clay" />
              Estimated delivery
            </div>
            <p className="mt-2 font-display text-xl">{order.deliveryEstimate}</p>
          </div>
          <div className="rounded-xl border-2 border-clay bg-clay/5 p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 text-clay" />
              Total due on delivery
            </div>
            <p className="mt-2 font-display text-xl">
              {format(order.total)}
            </p>
          </div>
        </div>

        {/* Order detail */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg">Order details</h2>

          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-secondary">
                  <ProductImage src={item.image} alt={item.name} />
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity} · {format(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {format(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Separator className="my-5" />

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{format(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>
                {order.shipping === 0 ? (
                  <span className="text-clay">Free</span>
                ) : (
                  format(order.shipping)
                )}
              </dd>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-medium">
              <dt>Total</dt>
              <dd>{format(order.total)}</dd>
            </div>
          </dl>

          <Separator className="my-5" />

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
            <span>
              Delivering to <strong className="text-foreground">{order.name}</strong>
              , {order.address}, {order.city}.
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link to="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
