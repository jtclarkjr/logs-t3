"use client";

import type { User } from "@supabase/supabase-js";
import { authEnabled } from "@/lib/config/auth";
import { createClient } from "@/lib/supabase/client";

export async function signInWithGitHub(redirectPath?: string) {
  if (!authEnabled) {
    return { data: null, error: new Error("Authentication is disabled") };
  }

  const supabase = createClient();
  if (!supabase) {
    return { data: null, error: new Error("Supabase client not initialized") };
  }

  const callbackUrl =
    process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL ||
    `${window.location.origin}/auth/callback`;

  // Append the redirect path as a query parameter
  const redirectTo = redirectPath
    ? `${callbackUrl}?redirect=${encodeURIComponent(redirectPath)}`
    : callbackUrl;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
    },
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  if (!authEnabled) {
    return { data: null, error: new Error("Authentication is disabled") };
  }

  const supabase = createClient();
  if (!supabase) {
    return { data: null, error: new Error("Supabase client not initialized") };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string) {
  if (!authEnabled) {
    return { data: null, error: new Error("Authentication is disabled") };
  }

  const supabase = createClient();
  if (!supabase) {
    return { data: null, error: new Error("Supabase client not initialized") };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL ||
        `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  if (!authEnabled) {
    return { error: null };
  }

  const supabase = createClient();
  if (!supabase) {
    return { error: new Error("Supabase client not initialized") };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!authEnabled) {
    return null;
  }

  const supabase = createClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!authEnabled) {
    // Return a dummy subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }

  return supabase.auth.onAuthStateChange(
    (_event: string, session: { user: User | null } | null) => {
      callback(session?.user || null);
    },
  );
}
