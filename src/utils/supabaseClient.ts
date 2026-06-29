import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing! Local mock data will be used as a fallback."
  );
}

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
