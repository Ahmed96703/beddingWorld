import { Link } from "react-router-dom";
import {
  Package,
  Eye,
  FileEdit,
  FolderTree,
  Star,
  ArrowRight,
  Plus,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/states";
import { useAuth } from "@/context/auth";
import { useAsync } from "@/hooks/use-async";
import { fetchAdminStats, fetchProducts } from "@/lib/api";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/currency";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { formatBase } = useCurrency();
  const stats = useAsync(fetchAdminStats, []);
  const recent = useAsync(
    () => fetchProducts({ status: "all", sort: "newest", limit: 5 }),
    [],
  );

  const cards = [
    { label: "Total products", value: stats.data?.totalProducts, icon: Package },
    { label: "Live", value: stats.data?.liveProducts, icon: Eye },
    { label: "Drafts", value: stats.data?.draftProducts, icon: FileEdit },
    { label: "Categories", value: stats.data?.totalCategories, icon: FolderTree },
    { label: "Featured", value: stats.data?.featuredProducts, icon: Star },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
        </div>
        <Button asChild>
          <Link to="/admin/products?new=1">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </header>

      {stats.error ? (
        <ErrorState error={stats.error} onRetry={stats.refetch} />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {cards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <Icon className="h-5 w-5 text-clay" />
              {stats.loading ? (
                <Skeleton className="mt-3 h-8 w-12" />
              ) : (
                <p className="mt-3 font-display text-3xl">{value ?? 0}</p>
              )}
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions — plain-language shortcuts for common tasks */}
      <section>
        <h2 className="mb-4 font-display text-lg">Quick actions</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              to: "/admin/products?new=1",
              icon: Plus,
              title: "Add a product",
              desc: "Naya item add karein",
            },
            {
              to: "/admin/categories",
              icon: FolderTree,
              title: "Categories",
              desc: "Categories manage karein",
            },
            {
              to: "/admin/team",
              icon: Users,
              title: "Add an admin",
              desc: "Dost ko admin banayein",
            },
            {
              to: "/admin/settings",
              icon: Settings,
              title: "Settings",
              desc: "Currency & shipping",
            },
          ].map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lift"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clay/15 text-clay">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-1 font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent products */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg">Recently added</h2>
          <Link
            to="/admin/products"
            className="flex items-center gap-1 text-sm text-clay hover:underline"
          >
            Manage all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : recent.data && recent.data.length > 0 ? (
          <ul className="divide-y divide-border">
            {recent.data.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/40"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-secondary">
                  <ProductImage src={p.images?.[0]} alt={p.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBase(p.price)}
                  </p>
                </div>
                <Badge variant={p.status === "live" ? "live" : "draft"}>
                  {p.status}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No products yet. Add your first one to get started.
          </p>
        )}
      </section>
    </div>
  );
}
