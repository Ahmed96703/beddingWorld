/** Currency helpers shared by the storefront and admin. */

export interface CurrencyOption {
  code: string;
  label: string;
}

/** Currencies offered in the manual switcher (extend freely). */
export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", label: "US Dollar" },
  { code: "PKR", label: "Pakistani Rupee" },
  { code: "INR", label: "Indian Rupee" },
  { code: "GBP", label: "British Pound" },
  { code: "EUR", label: "Euro" },
  { code: "AED", label: "UAE Dirham" },
  { code: "SAR", label: "Saudi Riyal" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
];

/** Format an amount already expressed in `currency`. */
export function formatMoney(amount: number, currency = "USD"): string {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: zeroDecimal(currency) ? 0 : 2,
      minimumFractionDigits: zeroDecimal(currency) ? 0 : 2,
    }).format(value);
  } catch {
    // Unknown currency code → fall back to a plain prefixed number.
    return `${currency} ${value.toFixed(2)}`;
  }
}

/** Currencies that conventionally show no decimal places. */
function zeroDecimal(currency: string): boolean {
  return ["JPY", "KRW", "VND", "CLP", "ISK", "HUF"].includes(currency);
}
