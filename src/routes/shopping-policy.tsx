import { Seo } from "@/components/seo";

const items = [
  "Browse the catalog and add items to cart as usual.",
  "Cash on delivery is available for supported locations.",
  "Order confirmations are sent after checkout is complete.",
  "If a product is made to order or requires special handling, we show that on the product page.",
];

export default function ShoppingPolicyPage() {
  return (
    <>
      <Seo
        title="Shopping Policy"
        description="Shopping and ordering rules for Bedding World."
        path="/shopping-policy"
      />

      <div className="container max-w-4xl py-12 md:py-16">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Shopping Policy
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          These guidelines explain how shopping works on Bedding World so
          customers know what to expect before placing an order.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">How to order</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Pricing</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Prices shown on the site are the current prices unless a compare-at
              price or sale badge is displayed.
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Order support</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Need help choosing a product or size? Reach out on WhatsApp from
              any product page.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
