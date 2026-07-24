import { createSupabaseServerClient } from "./supabaseServer";

/**
 * Synchronously checks if a given email belongs to an admin.
 * Admin emails are defined in the ADMIN_EMAILS environment variable (comma-separated).
 */
export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false;
  const adminEmailsStr = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsStr
    .split(",")
    .map((e) => e.trim().toLowerCase());

  return adminEmails.includes(email.trim().toLowerCase());
}

/**
 * Checks if the currently logged-in user (via Supabase Auth session or provided email) is an admin.
 */
export async function isAdmin(userEmail?: string | null): Promise<boolean> {
  if (userEmail !== undefined) {
    return checkIsAdmin(userEmail);
  }
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return checkIsAdmin(user?.email);
  } catch {
    return false;
  }
}

