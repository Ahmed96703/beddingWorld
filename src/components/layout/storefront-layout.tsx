import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { SupabaseSetupBanner } from "@/components/supabase-setup-banner";

/** Shared chrome for all storefront pages: header, page outlet, footer. */
export function StorefrontLayout() {
  return (
    <div className="grain flex min-h-dvh flex-col">
      <SupabaseSetupBanner />
      <Header />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
