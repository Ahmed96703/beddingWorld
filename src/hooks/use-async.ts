import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  /** Imperatively re-run the async function. */
  refetch: () => void;
}

/**
 * Tiny data-fetching primitive — runs `fn` on mount and whenever `deps`
 * change, with loading/error states and a `refetch`. Avoids pulling in a
 * heavier data library while still giving us robust UX states everywhere.
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
): AsyncState<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fn()
      .then((result) => {
        if (active && mounted.current) setData(result);
      })
      .catch((err: unknown) => {
        if (active && mounted.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (active && mounted.current) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, refetch };
}
