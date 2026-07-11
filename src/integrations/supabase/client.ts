import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

/**
 * Whether the Supabase environment variables are present. The UI uses this to
 * render a friendly setup notice instead of crashing when `.env` is missing.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[LINÉA] Supabase env vars missing. Copy .env.example → .env and add " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

/**
 * Single shared Supabase client. When env vars are absent we still create a
 * client against harmless placeholders so imports never throw at module load —
 * callers should gate network calls behind `isSupabaseConfigured`.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "public-anon-placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
