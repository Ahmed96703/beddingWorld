import emailjs from "@emailjs/browser";
import type { PlacedOrder } from "@/lib/order";

/**
 * Client-side order email via EmailJS — sends an "order received" email to the
 * store admin the moment a COD order is placed. No backend required; the
 * recipient address is configured in the EmailJS template, not in code.
 *
 * Configure with three env vars (see .env.example). If they're missing this
 * becomes a graceful no-op so checkout still works.
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as
  | string
  | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export const isEmailConfigured = Boolean(
  SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY,
);

/** Send the admin order-notification email. Never throws (fire-and-forget). */
export async function sendOrderEmail(
  order: PlacedOrder,
  formatMoney: (n: number) => string,
): Promise<void> {
  if (!isEmailConfigured) return;
  try {
    const items = order.items
      .map(
        (i) =>
          `• ${i.name}${i.variant ? ` (${i.variant})` : ""} × ${i.quantity} — ${formatMoney(
            i.price * i.quantity,
          )}`,
      )
      .join("\n");

    const params: Record<string, string> = {
      order_ref: order.ref,
      order_date: new Date(order.placedAt).toLocaleString(),
      customer_name: order.name,
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: order.notes ?? "—",
      items,
      subtotal: formatMoney(order.subtotal),
      shipping: order.shipping ? formatMoney(order.shipping) : "Free",
      total: formatMoney(order.total),
      payment_method: "Cash on Delivery",
    };

    await emailjs.send(SERVICE_ID!, TEMPLATE_ID!, params, {
      publicKey: PUBLIC_KEY!,
    });
  } catch (err) {
    // Never block the customer's checkout on a notification failure.
    // eslint-disable-next-line no-console
    console.warn("[Bedding World] order email failed", err);
  }
}
