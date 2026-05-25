import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("session_email");

  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  return NextResponse.redirect(`${origin}/`);
}
