import { Link } from "react-router-dom";
import { House } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { CategoryNode } from "@/lib/categories";

/**
 * Slide-in mobile menu with collapsible accordion categories (sub and sub-sub).
 */
export function MobileNav({
  open,
  onClose,
  tree,
  isAdmin,
}: {
  open: boolean;
  onClose: () => void;
  tree: CategoryNode[];
  isAdmin: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="left-0 top-0 h-dvh max-w-[88vw] translate-x-0 translate-y-0 rounded-none border-l-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:rounded-none">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <div className="-mr-2 flex h-full flex-col overflow-y-auto pr-2">
          <Link
            to="/"
            onClick={onClose}
            className="mb-4 inline-flex items-center gap-2 font-display text-2xl tracking-tight"
          >
            <House className="h-5 w-5 text-clay" />
            Bedding World
          </Link>

          <div className="mb-5 rounded-lg border border-border bg-secondary/30 p-3">
            <Link
              to="/"
              onClick={onClose}
              className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-background"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              onClick={onClose}
              className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-background"
            >
              About Us
            </Link>
            <Link
              to="/privacy-policy"
              onClick={onClose}
              className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-background"
            >
              Privacy Policy
            </Link>
          </div>

          <Accordion type="multiple" className="flex-1">
            {tree.map((node) => (
              <AccordionItem key={node.id} value={node.id}>
                <AccordionTrigger className="font-display text-base">
                  {node.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-1">
                    <Link
                      to={`/category/${node.slug}`}
                      onClick={onClose}
                      className="block text-sm font-medium text-clay"
                    >
                      Shop all {node.name}
                    </Link>
                    {node.children.map((sub) => (
                      <div key={sub.id}>
                        <Link
                          to={`/category/${node.slug}/${sub.slug}`}
                          onClick={onClose}
                          className="block text-sm font-medium"
                        >
                          {sub.name}
                        </Link>
                        {sub.children.length > 0 && (
                          <ul className="mt-2 space-y-2 border-l border-border pl-3">
                            {sub.children.map((leaf) => (
                              <li key={leaf.id}>
                                <Link
                                  to={`/category/${node.slug}/${sub.slug}?cat=${leaf.slug}`}
                                  onClick={onClose}
                                  className="block text-sm text-muted-foreground"
                                >
                                  {leaf.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <Link to="/cart" onClick={onClose} className="block">
              Cart
            </Link>
            <Link to="/admin" onClick={onClose} className="block">
              {isAdmin ? "Admin Dashboard" : "Account"}
            </Link>
            <Link to="/shopping-policy" onClick={onClose} className="block">
              Shopping Policy
            </Link>
            <Link to="/return-exchange-policy" onClick={onClose} className="block">
              Return & Exchange
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
