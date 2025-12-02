import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authEnabled } from "@/lib/config/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  // If auth is disabled, just redirect to home
  if (!authEnabled) {
    return NextResponse.redirect(requestUrl.origin);
  }

  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
