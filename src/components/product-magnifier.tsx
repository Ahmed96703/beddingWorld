import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";

interface ProductMagnifierProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  eager?: boolean;
}

export function ProductMagnifier({
  src,
  alt,
  className,
  eager = false,
}: ProductMagnifierProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [point, setPoint] = useState({ x: 50, y: 50, pxX: 0, pxY: 0 });

  const zoomStyle = useMemo(
    () => ({
      backgroundImage: src ? `url(${src})` : undefined,
      backgroundRepeat: "no-repeat",
      backgroundSize: "240%",
      backgroundPosition: `${point.x}% ${point.y}%`,
    }),
    [point.x, point.y, src],
  );

  if (!src) {
    return (
      <ProductImage
        src={src}
        alt={alt}
        eager={eager}
        className={cn("h-full w-full", className)}
      />
    );
  }

  const updatePoint = (clientX: number, clientY: number) => {
    const node = wrapRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 0), 100);
    setPoint({
      x,
      y,
      pxX: Math.min(Math.max(clientX - rect.left, 0), rect.width),
      pxY: Math.min(Math.max(clientY - rect.top, 0), rect.height),
    });
  };

  return (
    <div
      ref={wrapRef}
      className={cn("group relative h-full w-full overflow-hidden", className)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={(e) => updatePoint(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (touch) updatePoint(touch.clientX, touch.clientY);
        setActive(true);
      }}
      onTouchEnd={() => setActive(false)}
    >
      <ProductImage
        src={src}
        alt={alt}
        eager={eager}
        className={cn(
          "h-full w-full transition-transform duration-500 group-hover:scale-[1.03]",
          className,
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_35%,hsl(25_24%_12%/0.12)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          active && "opacity-100",
        )}
      />

      <div
        className={cn(
          "pointer-events-none absolute hidden rounded-full border border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.08)] md:block",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{
          width: "130px",
          height: "130px",
          left: point.pxX - 65,
          top: point.pxY - 65,
          backdropFilter: "blur(1px)",
        }}
      >
        <span className="absolute inset-0 rounded-full border border-white/45" />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute right-4 top-4 hidden h-40 w-40 overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-soft backdrop-blur md:block",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-0" style={zoomStyle} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/25 to-transparent p-2 text-[0.62rem] uppercase tracking-widest text-white/90">
          Zoom
        </div>
      </div>
    </div>
  );
}
