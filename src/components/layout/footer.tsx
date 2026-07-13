import { Link } from "react-router-dom";
import { Instagram, Facebook, Phone } from "lucide-react";
import { useCatalog } from "@/hooks/use-catalog";
import { Newsletter } from "@/components/newsletter";

/** TikTok mark (lucide has no brand icon for it). */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 3c.32 2.1 1.6 3.79 3.7 4.06v2.55c-1.3 0-2.53-.42-3.7-1.13v6.83a6.06 6.06 0 1 1-6.06-6.06c.3 0 .6.02.9.07v2.7a3.36 3.36 0 1 0 2.36 3.22V3h2.8z" />
    </svg>
  );
}

const SOCIALS: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}[] = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: TikTokIcon, label: "TikTok", href: "#" },
];

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
          {/* Contact */}
          <div className="mt-6 space-y-1 text-sm">
            <p className="font-medium text-foreground">Mohsin Khan</p>
            <p className="text-muted-foreground">Owner · Bedding World</p>
            <a
              href="tel:+923054788662"
              className="mt-1 inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-clay"
            >
              <Phone className="h-4 w-4 text-clay" />
              +92 305 4788662
            </a>
          </div>

          <div className="mt-6 flex gap-2">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
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
