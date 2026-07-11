import { isSupabaseConfigured } from "@/integrations/supabase/client";

/**
 * Thin banner shown only when Supabase env vars are missing, so the app stays
 * usable for a first run while making the setup step obvious.
 */
export function SupabaseSetupBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="relative z-50 bg-clay text-clay-foreground">
      <div className="container py-2 text-center text-[0.78rem]">
        <strong className="font-semibold">Preview mode</strong> — showing demo
        products. Connect Supabase (add{" "}
        <code className="rounded bg-black/15 px-1.5 py-0.5">
          VITE_SUPABASE_URL
        </code>{" "}
        +{" "}
        <code className="rounded bg-black/15 px-1.5 py-0.5">
          VITE_SUPABASE_ANON_KEY
        </code>{" "}
        to <code className="rounded bg-black/15 px-1.5 py-0.5">.env</code> and
        run the SQL in{" "}
        <code className="rounded bg-black/15 px-1.5 py-0.5">supabase/</code>) to
        enable the admin dashboard &amp; live data.
      </div>
    </div>
  );
}
