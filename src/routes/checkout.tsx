import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Banknote, ArrowRight, Lock } from "lucide-react";
import { Seo } from "@/components/seo";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart, selectSubtotal } from "@/store/cart";
import { estimatedDelivery, makeOrderRef } from "@/lib/utils";
import { useCurrency } from "@/context/currency";
import { shippingFor, saveLastOrder, type PlacedOrder } from "@/lib/order";
import { useStoreSettings } from "@/hooks/use-settings";

interface FormState {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);
  const { format } = useCurrency();
  const settings = useStoreSettings();
  const shipping = shippingFor(
    subtotal,
    settings.free_shipping_threshold,
    settings.shipping_flat,
  );
  const total = subtotal + shipping;

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[\d\s()+-]{7,}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number.";
    if (form.address.trim().length < 6)
      next.address = "Please enter your delivery address.";
    if (form.city.trim().length < 2) next.city = "Please enter your city.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const order: PlacedOrder = {
      ref: makeOrderRef(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      notes: form.notes.trim() || undefined,
      items,
      subtotal,
      shipping,
      total,
      placedAt: new Date().toISOString(),
      deliveryEstimate: estimatedDelivery(4),
    };

    // Simulate a brief network round-trip for the confirmation.
    setTimeout(() => {
      saveLastOrder(order);
      clear();
      navigate("/order/success", { replace: true });
    }, 650);
  };

  return (
    <>
      <Seo title="Checkout" description="Complete your Bedding World order with cash on delivery." path="/checkout" noindex />

      <div className="container py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Cash on delivery — pay when your order arrives.
        </p>

        <form
          onSubmit={placeOrder}
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]"
        >
          {/* Left: details */}
          <div className="space-y-8">
            <section>
              <h2 className="font-display text-xl">Delivery details</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  error={errors.name}
                  className="sm:col-span-2"
                >
                  <Input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Amelia Hart"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Phone number" error={errors.phone}>
                  <Input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+1 555 012 3456"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="City" error={errors.city}>
                  <Input
                    value={form.city}
                    onChange={set("city")}
                    placeholder="Portland"
                    autoComplete="address-level2"
                  />
                </Field>
                <Field
                  label="Delivery address"
                  error={errors.address}
                  className="sm:col-span-2"
                >
                  <Textarea
                    value={form.address}
                    onChange={set("address")}
                    placeholder="Street address, apartment, landmark…"
                    autoComplete="street-address"
                  />
                </Field>
                <Field
                  label="Order notes (optional)"
                  className="sm:col-span-2"
                >
                  <Textarea
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Delivery instructions, preferred time…"
                  />
                </Field>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl">Payment</h2>
              <div className="mt-4 flex items-start gap-4 rounded-lg border-2 border-clay bg-clay/5 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay text-clay-foreground">
                  <Banknote className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pay in cash to the courier when your order is delivered. No
                    cards or online payment required.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: sticky summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl">Order summary</h2>

              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li key={`${item.id}-${item.variant ?? "default"}`} className="flex gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-secondary">
                      <ProductImage src={item.image} alt={item.name} />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.62rem] font-semibold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="line-clamp-2 text-sm">{item.name}</span>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            Size: {item.variant}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {format(item.price * item.quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <Separator className="my-5" />

              <dl className="space-y-3 text-sm">
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
                  <dt>Total due on delivery</dt>
                  <dd>{format(total)}</dd>
                </div>
              </dl>

              <Button
                type="submit"
                size="lg"
                className="mt-6 w-full"
                disabled={submitting}
              >
                {submitting ? "Placing order…" : "Place COD Order"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Your details are used only to fulfil this order.
              </p>
              <Link
                to="/cart"
                className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Back to cart
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
