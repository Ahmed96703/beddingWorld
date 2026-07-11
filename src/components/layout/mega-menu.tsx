import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { CategoryNode } from "@/lib/categories";
import { ProductImage } from "@/components/product-image";

/**
 * Mega-dropdown panel for a single top-level category. Shows each sub-category
 * as a column heading with its sub-sub categories listed beneath, plus a
 * featured image rail on the right.
 */
export function MegaMenu({
  node,
  onNavigate,
}: {
  node: CategoryNode;
  onNavigate: () => void;
}) {
  const columns = node.children;

  return (
    <div className="grid grid-cols-[1fr_18rem] gap-10">
      <div
        className="grid gap-x-8 gap-y-6"
        style={{
          gridTemplateColumns: `repeat(${Math.min(
            Math.max(columns.length, 1),
            4,
          )}, minmax(0, 1fr))`,
        }}
      >
        {columns.length === 0 && (
          <Link
            to={`/category/${node.slug}`}
            onClick={onNavigate}
            className="text-sm text-muted-foreground hover:text-clay"
          >
            Shop all {node.name}
          </Link>
        )}
        {columns.map((sub) => (
          <div key={sub.id} className="min-w-0">
            <Link
              to={`/category/${node.slug}/${sub.slug}`}
              onClick={onNavigate}
              className="group/sub flex items-center gap-1 font-display text-[0.95rem] text-foreground hover:text-clay"
            >
              {sub.name}
              <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover/sub:translate-x-0 group-hover/sub:opacity-100" />
            </Link>
            <ul className="mt-3 space-y-2">
              {sub.children.map((leaf) => (
                <li key={leaf.id}>
                  <Link
                    to={`/category/${node.slug}/${sub.slug}?cat=${leaf.slug}`}
                    onClick={onNavigate}
                    className="text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {leaf.name}
                  </Link>
                </li>
              ))}
              {sub.children.length === 0 && (
                <li>
                  <Link
                    to={`/category/${node.slug}/${sub.slug}`}
                    onClick={onNavigate}
                    className="text-[0.85rem] text-muted-foreground hover:text-foreground"
                  >
                    Shop all
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <Link
        to={`/category/${node.slug}`}
        onClick={onNavigate}
        className="group relative hidden overflow-hidden rounded-lg bg-secondary lg:block"
      >
        <div className="aspect-[4/5] transition-transform duration-700 group-hover:scale-105">
          <ProductImage src={node.image_url} alt={node.name} />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/70 to-transparent p-5">
          <p className="text-[0.7rem] uppercase tracking-widest2 text-background/80">
            Featured
          </p>
          <p className="font-display text-lg text-background">
            The {node.name} Edit
          </p>
        </div>
      </Link>
    </div>
  );
}
