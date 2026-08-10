import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { checkIsAdmin } from "@/utils/auth";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profile & Settings | Private Academy",
  description: "Manage your profile, preferences, and view purchase history.",
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfileSettingsPage({ params }: PageProps) {
  const { username: paramUsername } = await params;
  const supabase = await createSupabaseServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  // Fetch the logged in user's profile
  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, university, default_branch, default_semester, created_at, avatar_url, username")
    .eq("id", user.id)
    .single();

  if (!profile?.username) {
    // Force choice of username first
    redirect("/");
  }

  // If the user tries to access someone else's settings page, redirect them to their own settings page
  if (profile.username.toLowerCase() !== paramUsername.toLowerCase()) {
    redirect(`/u/${profile.username}/profile`);
  }

  const isUserAdmin = checkIsAdmin(user.email);

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
      initialUsername={profile?.username || ""}
      email={user.email}
      purchases={purchases}
      createdAt={profile?.created_at || null}
      avatarUrl={profile?.avatar_url || null}
      isAdmin={isUserAdmin}
    />
  );
}
