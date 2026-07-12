import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabaseServer";

export default async function ProfileRedirectPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  // Fetch the user's username to redirect
  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profile?.username) {
    redirect("/"); // Will trigger the Username Gate on homepage
  }

  redirect(`/u/${profile.username}/profile`);
}
