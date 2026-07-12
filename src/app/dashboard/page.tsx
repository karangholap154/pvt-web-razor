import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../utils/supabaseServer";
import DashboardClient from "./DashboardClient";
import { Note } from "../../data/mockData";

interface PurchasedItem {
  notes: {
    id: string;
    title: string;
    branch: Note["branch"];
    semester: string;
    download_url: string | null;
    video_url: string | null;
    price: number | null;
    university: string | null;
  } | null;
}

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

  // Fetch username from users table
  const { data: userData } = await supabase
    .from("users")
    .select("username")
    .eq("email", sessionEmail)
    .maybeSingle();

  const username = userData?.username ?? sessionEmail.split("@")[0];

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
      purchasedNotes = (dbPurchases as unknown as PurchasedItem[])
        .filter((item) => item.notes !== null)
        .map((item) => {
          const noteData = item.notes!;
          return {
            id: noteData.id,
            title: noteData.title,
            branch: noteData.branch,
            semester: noteData.semester as Note["semester"],
            description: `${noteData.title} - ${noteData.branch} Engineering, ${noteData.semester} | ${noteData.university || ""}`,
            downloadUrl: noteData.download_url || "",
            videoUrl: noteData.video_url || "",
            price: noteData.price ? Number(noteData.price) : 0,
          };
        });
    }
  } catch (err) {
    console.error("Failed to query purchases:", err);
  }

  return <DashboardClient username={username} notes={purchasedNotes} />;
}
