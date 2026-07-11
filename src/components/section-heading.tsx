import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  to,
  ctaLabel = "View all",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  to?: string;
  ctaLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-balance font-display text-3xl leading-tight md:text-[2.5rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground"
        >
          <span className="link-underline">{ctaLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
