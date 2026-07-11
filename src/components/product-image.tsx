import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** Pass true for above-the-fold hero imagery to skip lazy loading. */
  eager?: boolean;
  sizes?: string;
}

/**
 * Lazy-loaded image with a graceful fade-in and a tasteful fallback when an
 * image is missing or fails to load. Keeps a fixed aspect via the parent.
 */
export function ProductImage({
  src,
  alt,
  className,
  eager = false,
  sizes,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-secondary text-muted-foreground/50",
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <span className="font-display text-3xl italic opacity-60">LINÉA</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn(
        "h-full w-full object-cover transition-all duration-700 ease-out",
        loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-sm",
        className,
      )}
    />
  );
}
