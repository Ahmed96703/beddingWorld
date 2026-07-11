import { LoadingSpinner } from "@/components/states";

/** Suspense fallback shown while a lazily-loaded route chunk downloads. */
export function RouteFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <LoadingSpinner label="Loading…" />
    </div>
  );
}
