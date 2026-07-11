import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { useDebounced } from "@/hooks/use-debounced";
import { fetchProducts } from "@/lib/api";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { ProductRow } from "@/integrations/supabase/types";
import { ProductImage } from "@/components/product-image";
import { useCurrency } from "@/context/currency";

/**
 * Live search overlay with debounced queries against Supabase. Opens as a
 * dropdown panel anchored under the header; results update as you type.
 */
export function SearchCommand({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const debounced = useDebounced(term.trim(), 250);
  const [results, setResults] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { format } = useCurrency();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else setTerm("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    let active = true;
    if (!debounced || debounced.length < 2 || !isSupabaseConfigured) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProducts({ search: debounced, status: "live", limit: 6 })
      .then((res) => active && setResults(res))
      .catch(() => active && setResults([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debounced]);

  const hasQuery = debounced.length >= 2;
  const showEmpty = useMemo(
    () => hasQuery && !loading && results.length === 0,
    [hasQuery, loading, results],
  );

  if (!open) return null;

  const goToResults = () => {
    if (!term.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
    onClose();
  };

  return (
    <>
      <button
        aria-label="Close search"
        className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-full z-50 border-t border-border bg-card shadow-soft animate-fade-up">
        <div className="container py-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToResults();
            }}
            className="flex items-center gap-3 border-b border-border pb-4"
          >
            <Search className="h-5 w-5 shrink-0 text-clay" />
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search sheets, quilts, towels…"
              className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-4">
            {!hasQuery && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Start typing to search the collection.
              </p>
            )}

            {showEmpty && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No matches for “{debounced}”. Try another term.
              </p>
            )}

            {results.length > 0 && (
              <ul className="grid gap-1">
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        navigate(`/product/${p.slug}`);
                        onClose();
                      }}
                      className="flex w-full items-center gap-4 rounded-md p-2 text-left transition-colors hover:bg-secondary"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-secondary">
                        <ProductImage src={p.images?.[0]} alt={p.name} />
                      </div>
                      <span className="flex-1 font-medium">{p.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(p.price)}
                      </span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={goToResults}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    View all results for “{debounced}”
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
