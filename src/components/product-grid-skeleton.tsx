import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
}: {
  count?: number;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={
        columns === 3
          ? "grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3"
          : "grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
