import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  FolderTree,
  Users,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart, end: false },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes, end: false },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, end: false },
  { to: "/admin/team", label: "Team & Admins", icon: Users, end: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, end: false },
];

/** Chrome for the protected admin area: sidebar nav + content outlet. */
export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-secondary/30">
      <Seo title="Admin" description="Bedding World admin dashboard" noindex />

      <div className="flex min-h-dvh flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="flex shrink-0 flex-col border-b border-border bg-card lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between p-5 lg:block">
            <Link to="/" className="font-display text-2xl tracking-tight">
              Bedding World<span className="text-clay">.</span>
            </Link>
            <p className="hidden text-xs uppercase tracking-widest2 text-muted-foreground lg:mt-1 lg:block">
              Admin Console
            </p>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-2 lg:flex-col lg:overflow-visible lg:px-3">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto hidden space-y-3 border-t border-border p-4 lg:block">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/">
                <Store className="h-4 w-4" />
                View store
              </Link>
            </Button>
            <p className="truncate text-xs text-muted-foreground" title={user?.email ?? ""}>
              {user?.email}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 px-5 py-8 md:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
