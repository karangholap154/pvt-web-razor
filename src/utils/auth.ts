import { createSupabaseServerClient } from "./supabaseServer";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Synchronously checks if a user is an admin based on role or ADMIN_EMAILS environment variable fallback.
 */
export function checkIsAdmin(email?: string | null, role?: string | null): boolean {
  if (role === "admin") return true;
  if (!email) return false;

  const adminEmailsStr = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsStr
    .split(",")
    .map((e) => e.trim().toLowerCase());

  return adminEmails.includes(email.trim().toLowerCase());
}

/**
 * Asynchronously checks if a user is an admin using DB role with ADMIN_EMAILS fallback.
 * Uses service role client to ensure RLS policies do not block role evaluation.
 */
export async function isAdmin(userEmail?: string | null): Promise<boolean> {
  try {
    let email = userEmail;

    if (!email) {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      email = user?.email || null;
    }

    if (!email) return false;

    const cleanEmail = email.trim().toLowerCase();

    // Query DB role using admin client (bypasses RLS restrictions)
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (userData?.role === "admin") {
      return true;
    }

    // Fall back to environment variable configuration for backwards compatibility
    return checkIsAdmin(cleanEmail);
  } catch (err) {
    console.error("Error in isAdmin evaluation:", err);
    return false;
  }
}

/**
 * Returns the effective role of a user ('admin' | 'contributor' | 'user').
 */
export async function getUserRole(email?: string | null): Promise<"admin" | "contributor" | "user"> {
  if (!email) return "user";

  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (userData?.role === "admin" || checkIsAdmin(cleanEmail)) {
      return "admin";
    }

    if (userData?.role === "contributor") {
      return "contributor";
    }

    return "user";
  } catch {
    return checkIsAdmin(email) ? "admin" : "user";
  }
}
