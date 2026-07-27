import { useMemo, useState } from "react";
import { AlertTriangle, PackageOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ErrorState, EmptyState } from "@/components/states";
import { useAsync } from "@/hooks/use-async";
import { fetchInventoryReport } from "@/lib/api";
import { cn } from "@/lib/utils";

const LOW_STOCK = 5;

export default function AdminInventory() {
  const report = useAsync(fetchInventoryReport, []);
  const [lowOnly, setLowOnly] = useState(false);

  const rows = useMemo(() => {
    const list = report.data ?? [];
    return lowOnly ? list.filter((r) => r.stock <= LOW_STOCK) : list;
  }, [report.data, lowOnly]);

  const summary = useMemo(() => {
    const list = report.data ?? [];
    return {
      lines: list.length,
      sold: list.reduce((s, r) => s + r.sold, 0),
      inStock: list.reduce((s, r) => s + r.stock, 0),
      low: list.filter((r) => r.stock > 0 && r.stock <= LOW_STOCK).length,
      out: list.filter((r) => r.stock <= 0).length,
    };
  }, [report.data]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1 className="mt-1 font-display text-3xl">Stock Report</h1>
        </div>
        <Button
          variant={lowOnly ? "clay" : "outline"}
          size="sm"
          onClick={() => setLowOnly((v) => !v)}
        >
          <AlertTriangle className="h-4 w-4" />
          {lowOnly ? "Showing low stock" : "Low stock only"}
        </Button>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total sold", value: summary.sold },
          { label: "Units in stock", value: summary.inStock },
          { label: "Low stock", value: summary.low },
          { label: "Out of stock", value: summary.out },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-3xl">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {report.error ? (
        <ErrorState error={report.error} onRetry={report.refetch} />
      ) : report.loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title={lowOnly ? "No low-stock items" : "No products yet"}
          message={
            lowOnly
              ? "Everything is comfortably stocked."
              : "Add products to see their inventory here."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden grid-cols-[1fr_6rem_6rem_7rem] gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
            <span>Product</span>
            <span>Sold</span>
            <span>In stock</span>
            <span>Status</span>
          </div>
          <ul className="divide-y divide-border">
            {rows.map((r, i) => {
              const out = r.stock <= 0;
              const low = !out && r.stock <= LOW_STOCK;
              return (
                <li
                  key={`${r.product_id}-${r.variant_name ?? ""}-${i}`}
                  className="grid grid-cols-2 gap-2 px-5 py-3 text-sm md:grid-cols-[1fr_6rem_6rem_7rem] md:items-center md:gap-4"
                >
                  <span className="font-medium">
                    {r.product_name}
                    {r.variant_name && (
                      <span className="text-muted-foreground"> · {r.variant_name}</span>
                    )}
                  </span>
                  <span className="text-muted-foreground">{r.sold}</span>
                  <span
                    className={cn(
                      "font-medium",
                      out && "text-destructive",
                      low && "text-clay",
                    )}
                  >
                    {r.stock}
                  </span>
                  <span>
                    {out ? (
                      <Badge variant="draft">Out of stock</Badge>
                    ) : low ? (
                      <Badge variant="clay">Low</Badge>
                    ) : (
                      <Badge variant="live">In stock</Badge>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
