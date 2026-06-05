import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-role-key-for-build-phase";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Supabase Admin client initialized with missing SUPABASE_SERVICE_ROLE_KEY env variable!"
  );
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
