import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";
import { ALLOWED_DOMAINS } from "../../../../utils/constants";

/**
 * Supabase Auth email confirmation & OAuth callback.
 * Exchanges the callback `code` for a session, verifies that the user's
 * email domain is allowed, then redirects to the home page.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const email = data.user.email;
      if (email) {
        const cleanEmail = email.trim().toLowerCase();
        const domain = cleanEmail.split("@").pop() || "";

        if (!ALLOWED_DOMAINS.includes(domain)) {
          // Immediately revoke session and log out the user
          await supabase.auth.signOut();
          return NextResponse.redirect(
            `${origin}/login?error=domain_restricted`
          );
        }
      }
      // Confirmation successful — send to home page
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Fallback: code missing or invalid — send to login with error hint
  return NextResponse.redirect(
    `${origin}/login?error=confirmation_failed`
  );
}
