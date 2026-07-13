import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCatalog } from "@/hooks/use-catalog";
import { useCart, selectCount } from "@/store/cart";
import { useAuth } from "@/context/auth";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { SearchCommand } from "@/components/search-command";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { cn } from "@/lib/utils";

const ANNOUNCEMENTS = [
  "Free delivery on bulk orders across Pakistan",
  "Cash on delivery available nationwide",
  "Sleep on it — 30-night comfort promise",
];

export function Header() {
  const { tree } = useCatalog();
  const count = useCart(selectCount);
  const { isAdmin } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = (id: string) => {
    window.clearTimeout(closeTimer.current);
    setActiveId(id);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveId(null), 140);
  };

  const activeNode = tree.find((n) => n.id === activeId) ?? null;

  return (
    <header className="sticky top-0 z-40">
      {/* Rotating announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-9 items-center justify-center overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={scrolled ? "scrolled" : "top"}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[0.72rem] uppercase tracking-widest2"
            >
              {ANNOUNCEMENTS[scrolled ? 1 : 0]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div
        className={cn(
          "relative border-b border-border/70 bg-background/85 backdrop-blur-md transition-shadow",
          scrolled && "shadow-[0_8px_30px_-24px_hsl(25_24%_12%/0.5)]",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          {/* Left: mobile menu + logo */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="-ml-2 p-2 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              to="/"
              className="font-display text-2xl leading-none tracking-tight lg:text-[1.7rem]"
            >
              Bedding World
              <span className="ml-0.5 align-super text-clay">.</span>
            </Link>
          </div>

          {/* Center: primary nav */}
          <nav className="mx-auto hidden min-w-0 items-center gap-0.5 lg:flex">
            {tree.map((node) => (
              <Link
                key={node.id}
                to={`/category/${node.slug}`}
                onMouseEnter={() => openMenu(node.id)}
                onFocus={() => openMenu(node.id)}
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeId === node.id
                    ? "text-clay"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {node.name}
                {node.children.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      activeId === node.id && "rotate-180",
                    )}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex shrink-0 items-center gap-1">
            <CurrencySwitcher className="mr-1 hidden sm:flex" />
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2.5 transition-colors hover:bg-secondary"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" />
            </button>
            <Link
              to="/admin"
              aria-label="Account"
              className="rounded-md p-2.5 transition-colors hover:bg-secondary"
            >
              <User className="h-[1.15rem] w-[1.15rem]" />
            </Link>
            <Link
              to="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative rounded-md p-2.5 transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[0.62rem] font-semibold text-clay-foreground">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mega-menu panel */}
        <AnimatePresence>
          {activeNode && activeNode.children.length > 0 && (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => openMenu(activeNode.id)}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full hidden border-t border-border bg-card shadow-soft backdrop-blur lg:block"
            >
              <div className="container py-8">
                <MegaMenu node={activeNode} onNavigate={() => setActiveId(null)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        tree={tree}
        isAdmin={isAdmin}
      />
    </header>
  );
}
