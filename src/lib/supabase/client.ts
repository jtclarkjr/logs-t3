import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // These environment variables should always be defined when auth is enabled
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createBrowserClient(url, key);
}
