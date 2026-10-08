import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { syncContributorBadgeTier } from "@/utils/badgeUtils";
import { sendOrderReceiptEmail } from "@/utils/resend";

export interface FulfillPurchaseParams {
  supabaseAdmin: SupabaseClient<Database>;
  orderId: string;
  paymentId: string;
  email: string;
  noteId: string;
  grossAmount: number;
  noteTitleFallback?: string;
}

export interface FulfillPurchaseResult {
  success: boolean;
  isAlreadyRecorded: boolean;
  noteTitle: string;
  error?: string;
}

/**
 * Centralized purchase fulfillment and ledger registration.
 * Safely computes contributor commission splits, idempotently upserts
 * purchase records, and triggers receipt emails.
 */
export async function fulfillPurchase({
  supabaseAdmin,
  orderId,
  paymentId,
  email,
  noteId,
  grossAmount,
  noteTitleFallback,
}: FulfillPurchaseParams): Promise<FulfillPurchaseResult> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Fetch note info to check if community contributed and calculate earnings split
  const { data: noteItem, error: noteError } = await supabaseAdmin
    .from("notes")
    .select("title, is_community_contributed, contributor_id, platform_commission_rate")
    .eq("id", noteId)
    .maybeSingle();

  if (noteError) {
    console.error("Error retrieving note details for fulfillment:", noteError);
  }

  const resolvedNoteTitle =
    noteTitleFallback || noteItem?.title || "Study Notes";

  let contributorId: string | null = null;
  let contributorEarnings = 0;
  let platformCommission = grossAmount;

  if (noteItem?.is_community_contributed && noteItem.contributor_id) {
    contributorId = noteItem.contributor_id;
    try {
      const { commissionRate } = await syncContributorBadgeTier(
        supabaseAdmin,
        contributorId
      );
      platformCommission = Number((grossAmount * commissionRate).toFixed(2));
      contributorEarnings = Number((grossAmount - platformCommission).toFixed(2));
    } catch (err) {
      console.error("Error calculating contributor commission split:", err);
    }
  }

  // 2. Check if purchase was already recorded to avoid duplicate receipt emails
  const { data: existingPurchase } = await supabaseAdmin
    .from("purchases")
    .select("id")
    .eq("razorpay_order_id", orderId)
    .eq("status", "success")
    .maybeSingle();

  const isAlreadyRecorded = !!existingPurchase;

  // 3. Register / Upsert transaction into Purchases ledger
  const { error: upsertError } = await supabaseAdmin.from("purchases").upsert(
    {
      email: cleanEmail,
      note_id: noteId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      amount: grossAmount,
      contributor_id: contributorId,
      contributor_earnings: contributorEarnings,
      platform_commission: platformCommission,
      status: "success",
    },
    { onConflict: "razorpay_order_id" }
  );

  if (upsertError) {
    console.error("Failed to upsert purchase record in Supabase:", upsertError);
    return {
      success: false,
      isAlreadyRecorded,
      noteTitle: resolvedNoteTitle,
      error: "Database transaction logging failed",
    };
  }

  // 4. Trigger purchase receipt email via Resend if not previously sent
  if (!isAlreadyRecorded) {
    sendOrderReceiptEmail({
      to: cleanEmail,
      orderId,
      noteTitle: resolvedNoteTitle,
      amount: grossAmount,
    }).catch((err) => console.error("Error triggering receipt email:", err));
  }

  return {
    success: true,
    isAlreadyRecorded,
    noteTitle: resolvedNoteTitle,
  };
}
