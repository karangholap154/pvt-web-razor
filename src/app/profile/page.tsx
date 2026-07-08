import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { isAdmin } from "@/utils/auth";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Profile & Settings | PrivateAcademy",
  description: "Manage your profile, preferences, and view purchase history.",
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  // Fetch the user's profile from the public.users table
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, university, default_branch, default_semester, created_at, avatar_url")
    .eq("id", user.id)
    .single();

  const isUserAdmin = await isAdmin();

  // Fetch purchases
  const { data: dbPurchases } = await supabase
    .from("purchases")
    .select("id, amount, created_at, razorpay_order_id, status, notes(title)")
    .eq("email", user.email)
    .order("created_at", { ascending: false });

  // Map purchases to a clean format
  type PurchaseRow = {
    id: string;
    amount: number;
    created_at: string;
    razorpay_order_id: string;
    status: string;
    notes: { title: string } | null;
  };

  const purchases = ((dbPurchases as unknown as PurchaseRow[]) || []).map((p) => ({
    id: p.id,
    amount: p.amount,
    date: p.created_at,
    orderId: p.razorpay_order_id,
    status: p.status,
    noteTitle: p.notes?.title || "Unknown Note",
  }));

  return (
    <ProfileClient
      initialFullName={profile?.full_name || ""}
      initialUniversity={profile?.university || ""}
      initialBranch={profile?.default_branch || ""}
      initialSemester={profile?.default_semester || ""}
      email={user.email}
      purchases={purchases}
      createdAt={profile?.created_at || null}
      avatarUrl={profile?.avatar_url || null}
      isAdmin={isUserAdmin}
    />
  );
}
