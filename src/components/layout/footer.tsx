import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useCatalog } from "@/hooks/use-catalog";
import { Newsletter } from "@/components/newsletter";

export function Footer() {
  const { tree } = useCatalog();
  const shopCols = tree.slice(0, 4);

  return (
    <footer className="relative z-10 mt-24 border-t border-border bg-card">
      <Newsletter />

      <div className="container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Link to="/" className="font-display text-2xl tracking-tight">
            Bedding World<span className="text-clay">.</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Premium bedding and home textiles, designed to make the everyday
            feel considered. Woven for comfort, made to last.
          </p>
          <div className="mt-6 flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media"
                className="rounded-full border border-border p-2.5 text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {shopCols.map((col) => (
          <div key={col.id}>
            <h4 className="text-[0.72rem] font-medium uppercase tracking-widest2 text-muted-foreground">
              {col.name}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.children.slice(0, 5).map((sub) => (
                <li key={sub.id}>
                  <Link
                    to={`/category/${col.slug}/${sub.slug}`}
                    className="text-sm text-foreground/75 link-underline hover:text-foreground"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={`/category/${col.slug}`}
                  className="text-sm text-clay link-underline"
                >
                  Shop all
                </Link>
              </li>
            </ul>
          </div>
        ))}

        {shopCols.length === 0 && (
          <div className="lg:col-span-4">
            <h4 className="text-[0.72rem] font-medium uppercase tracking-widest2 text-muted-foreground">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/75">
              <li>About</li>
              <li>Contact</li>
              <li>Shipping & Returns</li>
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-border/70">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Bedding World. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Cash on Delivery</span>
            <span aria-hidden>·</span>
            <span>Privacy</span>
            <span aria-hidden>·</span>
            <span>Terms</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
