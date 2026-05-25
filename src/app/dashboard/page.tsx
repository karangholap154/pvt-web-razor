import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import DashboardClient from "./DashboardClient";
import { Note } from "../../data/mockData";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get("session_email")?.value;

  // 1. Authentication check
  if (!sessionEmail) {
    redirect("/login");
  }

  // 2. Fetch purchases from Supabase database
  let purchasedNotes: Note[] = [];
  try {
    const { data: dbPurchases, error } = await supabase
      .from("purchases")
      .select("*, notes(*)")
      .eq("email", sessionEmail)
      .eq("status", "success");

    if (error) {
      console.error("Error fetching purchases for dashboard:", error);
    } else if (dbPurchases) {
      purchasedNotes = dbPurchases
        .filter((item) => item.notes !== null)
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
