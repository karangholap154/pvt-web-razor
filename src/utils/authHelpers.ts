import { NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabaseServer";
import { isAdmin } from "./auth";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type AuthResult =
  | { user: User; supabase: SupabaseServerClient; errorResponse?: never }
  | { user?: never; supabase?: never; errorResponse: NextResponse };

/**
 * Ensures the requesting user has an active session and administrator privileges.
 * Returns { user, supabase } if authorized, or { errorResponse } if unauthorized (401) or forbidden (403).
 */
export async function requireAdmin(): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      errorResponse: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const userIsAdmin = await isAdmin(user.email);
  if (!userIsAdmin) {
    return {
      errorResponse: NextResponse.json(
        { error: "Access denied: Administrator privileges required" },
        { status: 403 }
      ),
    };
  }

  return { user, supabase };
}

/**
 * Ensures the requesting user has an active session.
 * Returns { user, supabase } if authorized, or { errorResponse } (401) if not logged in.
 */
export async function requireUser(): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      errorResponse: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  return { user, supabase };
}
