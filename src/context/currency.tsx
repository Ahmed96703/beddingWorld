import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchSettings } from "@/lib/api";
import {
  formatMoney,
  CURRENCY_OPTIONS,
  type CurrencyOption,
} from "@/lib/money";

interface CurrencyContextValue {
  baseCode: string;
  displayCode: string;
  /** Conversion factor: 1 unit of base currency = `rate` units of display. */
  rate: number;
  ready: boolean;
  autoDetected: boolean;
  options: CurrencyOption[];
  setDisplay: (code: string) => void;
  /** Format an amount stored in the base currency, converted for display. */
  format: (baseAmount: number) => string;
  /** Format an amount already in the base currency (admin views). */
  formatBase: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);

const OVERRIDE_KEY = "linea-currency";
const RATES_TTL = 1000 * 60 * 60 * 12; // 12h

const withTimeout = (ms: number) => {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
};

/** Best-effort detection of the visitor's currency from their IP region. */
async function detectCurrency(): Promise<string | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: withTimeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.currency === "string") return data.currency;
    }
  } catch {
    /* ignore and fall through */
  }
  try {
    const res = await fetch("https://ipwho.is/", { signal: withTimeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data?.currency?.code) return data.currency.code as string;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Fetch base→other exchange rates, cached in localStorage for 12h. */
async function getRates(base: string): Promise<Record<string, number>> {
  const cacheKey = `linea-rates-${base}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as {
        t: number;
        rates: Record<string, number>;
      };
      if (Date.now() - parsed.t < RATES_TTL) return parsed.rates;
    }
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      signal: withTimeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.rates) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ t: Date.now(), rates: data.rates }),
        );
        return data.rates;
      }
    }
  } catch {
    /* ignore */
  }
  return { [base]: 1 };
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [baseCode, setBaseCode] = useState("USD");
  const [displayCode, setDisplayCode] = useState("USD");
  const [rate, setRate] = useState(1);
  const [ready, setReady] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const ratesRef = useRef<Record<string, number>>({ USD: 1 });

  // Resolve display currency + load rates on first mount.
  useEffect(() => {
    let active = true;
    (async () => {
      const settings = await fetchSettings().catch(() => null);
      const base = settings?.base_currency || "USD";
      const autoDetect = settings?.auto_detect_currency ?? true;
      if (!active) return;
      setBaseCode(base);

      const override = localStorage.getItem(OVERRIDE_KEY);
      let display = override || base;
      let detected = false;
      if (!override && autoDetect) {
        const found = await detectCurrency();
        if (found) {
          display = found;
          detected = true;
        }
      }

      const rates = await getRates(base);
      if (!active) return;
      ratesRef.current = rates;
      setDisplayCode(display);
      setRate(rates[display] ?? 1);
      setAutoDetected(detected && !override);
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const setDisplay = useCallback((code: string) => {
    localStorage.setItem(OVERRIDE_KEY, code);
    setDisplayCode(code);
    setRate(ratesRef.current[code] ?? 1);
    setAutoDetected(false);
  }, []);

  const options = useMemo(() => {
    // Ensure the active display currency is always selectable.
    if (CURRENCY_OPTIONS.some((o) => o.code === displayCode))
      return CURRENCY_OPTIONS;
    return [{ code: displayCode, label: displayCode }, ...CURRENCY_OPTIONS];
  }, [displayCode]);

  const format = useCallback(
    (baseAmount: number) => formatMoney(baseAmount * rate, displayCode),
    [rate, displayCode],
  );
  const formatBase = useCallback(
    (amount: number) => formatMoney(amount, baseCode),
    [baseCode],
  );

  return (
    <CurrencyContext.Provider
      value={{
        baseCode,
        displayCode,
        rate,
        ready,
        autoDetected,
        options,
        setDisplay,
        format,
        formatBase,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx)
    throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
