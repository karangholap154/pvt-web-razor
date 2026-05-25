import { createSupabaseServerClient } from "./supabaseServer";

/**
 * Checks if the currently logged-in user (via Supabase Auth session) is an admin.
 * Admin emails are defined in the ADMIN_EMAILS environment variable (comma-separated).
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return false;

    const adminEmailsStr = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsStr
      .split(",")
      .map((e) => e.trim().toLowerCase());

    return adminEmails.includes(user.email.trim().toLowerCase());
  } catch {
    return false;
  }
}
