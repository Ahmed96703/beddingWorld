import { useState } from "react";
import { Loader2, Phone, MapPin, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState, EmptyState } from "@/components/states";
import { useAsync } from "@/hooks/use-async";
import { fetchOrders, fetchOrder, setOrderStatus } from "@/lib/api";
import type { OrderStatus, OrderWithItems } from "@/integrations/supabase/types";
import { useCurrency } from "@/context/currency";
import { normalizeError } from "@/lib/utils";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "received", label: "Order Received" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusLabel = (s: OrderStatus) =>
  STATUSES.find((x) => x.value === s)?.label ?? s;

function StatusBadge({ status }: { status: OrderStatus }) {
  const variant =
    status === "delivered"
      ? "live"
      : status === "cancelled"
        ? "draft"
        : "secondary";
  return <Badge variant={variant}>{statusLabel(status)}</Badge>;
}

export default function AdminOrders() {
  const orders = useAsync(fetchOrders, []);
  const { format } = useCurrency();
  const [openId, setOpenId] = useState<string | null>(null);

  const detail = useAsync<OrderWithItems | null>(
    () => (openId ? fetchOrder(openId) : Promise.resolve(null)),
    [openId],
  );
  const [savingStatus, setSavingStatus] = useState(false);

  const changeStatus = async (status: OrderStatus) => {
    if (!openId) return;
    setSavingStatus(true);
    try {
      await setOrderStatus(openId, status);
      toast.success("Order status updated", {
        description: statusLabel(status),
      });
      detail.refetch();
      orders.refetch();
    } catch (err) {
      toast.error("Could not update status", {
        description: normalizeError(err).message,
      });
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Sales</p>
        <h1 className="mt-1 font-display text-3xl">Orders</h1>
      </header>

      {orders.error ? (
        <ErrorState error={orders.error} onRetry={orders.refetch} />
      ) : orders.loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (orders.data ?? []).length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          message="COD orders placed on the storefront will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden grid-cols-[8rem_1fr_8rem_8rem_9rem] gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          <ul className="divide-y divide-border">
            {(orders.data ?? []).map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => setOpenId(o.id)}
                  className="grid w-full grid-cols-1 gap-1 px-5 py-4 text-left transition-colors hover:bg-secondary/40 md:grid-cols-[8rem_1fr_8rem_8rem_9rem] md:items-center md:gap-4"
                >
                  <span className="font-medium">{o.order_ref}</span>
                  <span className="text-sm">
                    {o.customer_name}
                    <span className="ml-2 text-muted-foreground">{o.city}</span>
                  </span>
                  <span className="text-sm font-medium">{format(o.total)}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("en-GB")}
                  </span>
                  <span>
                    <StatusBadge status={o.status} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Order detail */}
      <Dialog open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-h-[92dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {detail.data ? `Order ${detail.data.order_ref}` : "Order"}
            </DialogTitle>
          </DialogHeader>

          {detail.loading || !detail.data ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Status control */}
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <div className="flex items-center gap-2">
                  <Select
                    value={detail.data.status}
                    onValueChange={(v) => changeStatus(v as OrderStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {savingStatus && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Setting “Cancelled” automatically returns the stock to
                  inventory.
                </p>
              </div>

              {/* Customer */}
              <div className="rounded-lg border border-border p-4 text-sm">
                <p className="font-medium">{detail.data.customer_name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {detail.data.phone}
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {detail.data.address}, {detail.data.city}
                </p>
                {detail.data.notes && (
                  <p className="mt-2 text-muted-foreground">
                    Note: {detail.data.notes}
                  </p>
                )}
              </div>

              {/* Items */}
              <ul className="divide-y divide-border rounded-lg border border-border">
                {detail.data.order_items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center justify-between gap-3 p-3 text-sm"
                  >
                    <span>
                      {it.product_name}
                      {it.variant_name && (
                        <span className="text-muted-foreground">
                          {" "}
                          · {it.variant_name}
                        </span>
                      )}
                      <span className="text-muted-foreground"> × {it.quantity}</span>
                    </span>
                    <span className="font-medium">{format(it.line_total)}</span>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{format(detail.data.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{format(detail.data.shipping)}</dd>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <dt>Total (COD)</dt>
                  <dd>{format(detail.data.total)}</dd>
                </div>
              </dl>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
