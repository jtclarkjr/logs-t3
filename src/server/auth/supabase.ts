import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

import { authEnabled } from "@/lib/config/auth";

let supabaseServerClient: SupabaseClient | null = null;

function getSupabaseServerClient(): SupabaseClient | null {
  if (!authEnabled) return null;
  if (supabaseServerClient) return supabaseServerClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY when NEXT_PUBLIC_AUTH_ENABLED is true.",
    );
  }

  supabaseServerClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  return supabaseServerClient;
}

export async function getUserFromRequestHeaders(
  headers: Headers,
): Promise<User | null> {
  if (!authEnabled) return null;

  const authHeader =
    headers.get("authorization") ?? headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;

  return data.user ?? null;
}
