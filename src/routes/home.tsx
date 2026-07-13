import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Sparkles, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Seo } from "@/components/seo";
import { SectionHeading } from "@/components/section-heading";
import { ProductGrid } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { useCatalog } from "@/hooks/use-catalog";
import { fetchProducts } from "@/lib/api";

const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function HomePage() {
  const featured = useAsync(
    () => fetchProducts({ featured: true, status: "live", limit: 8 }),
    [],
  );
  const newest = useAsync(
    () => fetchProducts({ status: "live", sort: "newest", limit: 4 }),
    [],
  );
  const { tree } = useCatalog();

  return (
    <>
      <Seo
        title="Bedding World — Premium Bedding & Home"
        description="Discover premium bedding, bath, and home textiles at Bedding World. Sheets, comforters, quilts, towels and more — with cash on delivery."
        path="/"
      />

      {/* ---------------------------------- Hero --------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <motion.div {...fade}>
            <p className="eyebrow">New · The Linen Collection</p>
            <h1 className="mt-4 text-balance font-display text-[2.7rem] font-light leading-[1.04] tracking-tight md:text-6xl">
              Dress your home in{" "}
              <span className="italic text-clay">quiet luxury.</span>
            </h1>
            <p className="mt-6 max-w-md text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
              Considered bedding and home textiles, woven from the finest
              natural fibers. Made to soften with every wash, to last for years.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/category/bedding">
                  Shop Bedding
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/category/summer">Explore Summer</Link>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { k: "30-night", v: "Comfort promise" },
                { k: "OEKO-TEX", v: "Certified fabrics" },
                { k: "COD", v: "Pay on delivery" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-xl">{s.k}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-soft">
              <ProductImage
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
                alt="Layered linen bedding in warm neutral tones"
                eager
              />
              <div className="full-bleed-shadow pointer-events-none absolute inset-0" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-border bg-card/95 p-4 shadow-lift backdrop-blur sm:block">
              <p className="font-display text-lg">Stonewashed Linen</p>
              <p className="text-sm text-muted-foreground">From $89 · 6 shades</p>
            </div>
          </motion.div>
        </div>

        {/* trust strip */}
        <div className="border-y border-border bg-secondary/40">
          <div className="container grid grid-cols-2 gap-4 py-5 text-sm md:grid-cols-4">
            {[
              { icon: Truck, label: "Free shipping over $120" },
              { icon: ShieldCheck, label: "30-night comfort promise" },
              { icon: Leaf, label: "Responsibly sourced fibers" },
              { icon: Sparkles, label: "Cash on delivery" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0 text-clay" />
                <span className="text-foreground/80">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Category cards --------------------------- */}
      {tree.length > 0 && (
        <section className="container py-16 md:py-24">
          <SectionHeading
            eyebrow="Shop by room & ritual"
            title="Collections for every corner"
            description="From summer-light spreads to plush winter quilts — find your category."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {tree.slice(0, 6).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={i === 0 ? "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2" : ""}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group relative block h-full overflow-hidden rounded-xl bg-secondary"
                >
                  <div
                    className={
                      i === 0
                        ? "aspect-square lg:aspect-[1/1]"
                        : "aspect-[4/5]"
                    }
                  >
                    <ProductImage
                      src={cat.image_url}
                      alt={cat.name}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent p-4">
                    <h3 className="font-display text-lg text-background md:text-xl">
                      {cat.name}
                    </h3>
                    <span className="mt-1 flex items-center gap-1 text-xs text-background/85">
                      Shop now
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------- Featured ------------------------------- */}
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow="Editor's selection"
          title="Pieces we're loving"
          description="A curated edit of our most-loved bedding and home textiles."
          to="/search?q="
          ctaLabel="Shop all"
        />
        <div className="mt-10">
          {featured.loading ? (
            <ProductGridSkeleton count={8} />
          ) : featured.error ? (
            <ErrorState error={featured.error} onRetry={featured.refetch} />
          ) : featured.data && featured.data.length > 0 ? (
            <ProductGrid products={featured.data} />
          ) : (
            <EmptyState
              title="No featured products yet"
              message="Mark products as Featured in the admin dashboard to showcase them here."
            />
          )}
        </div>
      </section>

      {/* --------------------------- Editorial banner --------------------------- */}
      <section className="container py-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
          <div className="grid items-center gap-8 p-10 md:grid-cols-2 md:p-16">
            <div>
              <p className="text-[0.72rem] uppercase tracking-widest2 text-primary-foreground/70">
                The art of rest
              </p>
              <h2 className="mt-4 text-balance font-display text-3xl leading-tight md:text-4xl">
                A bed worth returning to, night after night.
              </h2>
              <p className="mt-4 max-w-md text-primary-foreground/80">
                Layer breathable sheets, a cloud-soft comforter, and the right
                pillows. We'll help you build the set.
              </p>
              <Button asChild variant="clay" size="lg" className="mt-8">
                <Link to="/category/bedding">
                  Build your bed
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative hidden aspect-[5/4] overflow-hidden rounded-xl md:block">
              <ProductImage
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80"
                alt="Neatly made bed with layered neutral bedding"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ New arrivals ---------------------------- */}
      {newest.data && newest.data.length > 0 && (
        <section className="container py-16 md:py-20">
          <SectionHeading eyebrow="Just landed" title="New arrivals" />
          <div className="mt-10">
            <ProductGrid products={newest.data} />
          </div>
        </section>
      )}
    </>
  );
}
