import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabaseServer";

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  return NextResponse.redirect(`${origin}/`);
}
