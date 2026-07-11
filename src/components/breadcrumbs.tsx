import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <Fragment key={i}>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <li>
              {item.to ? (
                <Link to={item.to} className="hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
