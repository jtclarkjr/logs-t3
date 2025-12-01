import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authEnabled } from "@/lib/config/auth";

export function createClient(): SupabaseClient | null {
  // Only create a real client if auth is enabled
  if (!authEnabled) {
    // Return null when auth is disabled - callers should check authEnabled first
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY when NEXT_PUBLIC_AUTH_ENABLED is true.",
    );
  }

  return createBrowserClient(url, key);
}
