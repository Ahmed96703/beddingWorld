import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
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
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/beddingworldnet?igsh=MTRhYXdibDJvZW9pcg==" },
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/194CGdkMD9/?mibextid=wwXIfr" },
  { Icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@beddingworld2?is_from_webapp=1&sender_device=pc" },
];

export function Footer() {
  const whatsappUrl = "https://wa.me/923054788662";

  return (
    <footer className="relative z-10 mt-24 border-t border-border bg-card">
      <Newsletter />

      <div className="container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link to="/" className="font-display text-2xl tracking-tight">
            Bedding World<span className="text-clay">.</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Premium bedding and home textiles, designed to make the everyday
            feel considered. Woven for comfort, made to last.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
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
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4 text-clay" />
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[0.72rem] font-medium uppercase tracking-widest2 text-muted-foreground">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                Cart
              </Link>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                WhatsApp
              </a>
            </li>
            <li>
              <Link to="/about-us" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.72rem] font-medium uppercase tracking-widest2 text-muted-foreground">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/about-us" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/shopping-policy" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                Shopping Policy
              </Link>
            </li>
            <li>
              <Link to="/return-exchange-policy" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                Return & Exchange
              </Link>
            </li>
            <li>
              <Link to="/care-instructions" className="text-sm text-foreground/75 link-underline hover:text-foreground">
                Care Instructions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.72rem] font-medium uppercase tracking-widest2 text-muted-foreground">
            Support
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-foreground/75">
            <li>Cash on delivery</li>
            <li>WhatsApp support</li>
            <li>Free delivery on bulk orders</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Bedding World. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Cash on Delivery</span>
            <span aria-hidden>·</span>
            <Link to="/privacy-policy" className="hover:text-foreground">
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link to="/shopping-policy" className="hover:text-foreground">
              Shop Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
