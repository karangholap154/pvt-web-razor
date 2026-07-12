import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { Database } from "../types/supabase";

/**
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Reads/writes auth session cookies automatically and
 * forwards the client IP and User-Agent headers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const headersList = await headers();

  const userAgent = headersList.get("user-agent") || "";
  let clientIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "";
  if (clientIp.includes(",")) {
    clientIp = clientIp.split(",")[0].trim();
  }

  const globalHeaders: Record<string, string> = {};
  if (userAgent) {
    globalHeaders["user-agent"] = userAgent;
  }
  if (clientIp) {
    globalHeaders["x-forwarded-for"] = clientIp;
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: globalHeaders,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll can be called from a Server Component where cookies
            // cannot be set (e.g. during RSC rendering).
          }
        },
      },
    }
  );
}
