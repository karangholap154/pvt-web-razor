import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../utils/supabaseServer";
import { supabase as dbClient } from "../../utils/supabaseClient";
import DashboardClient from "./DashboardClient";
import { Note } from "../../data/mockData";

export default async function DashboardPage() {
  // 1. Authentication check via Supabase Auth
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const sessionEmail = user.email;

  // 2. Fetch purchases from Supabase database
  let purchasedNotes: Note[] = [];
  try {
    const { data: dbPurchases, error } = await (dbClient as any)
      .from("purchases")
      .select("*, notes(*)")
      .eq("email", sessionEmail)
      .eq("status", "success");

    if (error) {
      console.error("Error fetching purchases for dashboard:", error);
    } else if (dbPurchases) {
      purchasedNotes = dbPurchases
        .filter((item: any) => item.notes !== null)
        .map((item: any) => ({
          id: item.notes.id,
          title: item.notes.title,
          branch: item.notes.branch,
          semester: item.notes.semester,
          description: item.notes.description || "",
          downloadUrl: item.notes.download_url || "",
          videoUrl: item.notes.video_url || "",
          price: item.notes.price ? Number(item.notes.price) : 0,
        }));
    }
  } catch (err) {
    console.error("Failed to query purchases:", err);
  }

  return <DashboardClient email={sessionEmail} notes={purchasedNotes} />;
}
