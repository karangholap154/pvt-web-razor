import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";

/**
 * Supabase Auth email confirmation callback.
 * When a user clicks the confirmation link in their email, Supabase redirects
 * them here with a one-time `code` query parameter. We exchange this code
 * for a session, then redirect to the dashboard.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Confirmation successful — send to dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Fallback: code missing or invalid — send to login with error hint
  return NextResponse.redirect(
    `${origin}/login?error=confirmation_failed`
  );
}
