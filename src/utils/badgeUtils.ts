/**
 * Contributor Badge Tiers & Tiered Revenue Shares Utility
 * 
 * Rules:
 * - legend: 10+ Approved Notes AND 100+ Purchases -> 90% Contributor Share (10% Platform)
 * - top_author: 5+ Approved Notes AND 50+ Purchases -> 82% Contributor Share (18% Platform)
 * - rising: 3+ Approved Notes AND 25+ Purchases -> 75% Contributor Share (25% Platform)
 * - contributor: 1+ Approved Note AND 1+ Purchase -> 70% Contributor Share (30% Platform)
 * - null / New Author: 0 Purchases -> 70% Base Contributor Share (30% Platform)
 */

export function calculateBadgeTier(
  approvedNotesCount: number,
  purchasesCount: number
): string | null {
  const approved = Math.max(0, approvedNotesCount || 0);
  const purchases = Math.max(0, purchasesCount || 0);

  if (approved >= 10 && purchases >= 100) {
    return "legend";
  }
  if (approved >= 5 && purchases >= 50) {
    return "top_author";
  }
  if (approved >= 3 && purchases >= 25) {
    return "rising";
  }
  if (approved >= 1 && purchases >= 1) {
    return "contributor";
  }

  return null;
}

export function getContributorShareRate(badgeTier?: string | null): number {
  switch (badgeTier) {
    case "legend":
      return 0.90;
    case "top_author":
      return 0.82;
    case "rising":
      return 0.75;
    case "contributor":
    default:
      return 0.70;
  }
}

export function getPlatformCommissionRate(badgeTier?: string | null): number {
  return Number((1 - getContributorShareRate(badgeTier)).toFixed(2));
}

/**
 * Recalculates and updates a contributor's badge_tier and total_downloads_count
 * in Supabase `users` table based on current approved notes count and successful purchases.
 * Returns the updated badgeTier and platform commission rate.
 */
export async function syncContributorBadgeTier(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseAdmin: any,
  contributorId: string
): Promise<{ badgeTier: string | null; commissionRate: number }> {
  if (!contributorId) {
    return { badgeTier: null, commissionRate: 0.30 };
  }

  // 1. Fetch contributor profile
  const { data: userProfile } = await supabaseAdmin
    .from("users")
    .select("approved_notes_count, total_downloads_count, badge_tier")
    .eq("id", contributorId)
    .maybeSingle();

  const approvedCount = userProfile?.approved_notes_count || 0;

  // 2. Fetch all notes created by this contributor
  const { data: contributorNotes } = await supabaseAdmin
    .from("notes")
    .select("id")
    .eq("contributor_id", contributorId);

  const contributorNoteIds = (contributorNotes || []).map((n: { id: string }) => n.id);
  let purchasesCount = 0;

  if (contributorNoteIds.length > 0) {
    const { count: dbPurchasesCount } = await supabaseAdmin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .in("note_id", contributorNoteIds)
      .eq("status", "success");

    purchasesCount = dbPurchasesCount || 0;
  }

  const badgeTier = calculateBadgeTier(approvedCount, purchasesCount);
  const commissionRate = getPlatformCommissionRate(badgeTier);

  // 3. Update profile in Supabase users table
  await supabaseAdmin
    .from("users")
    .update({
      badge_tier: badgeTier,
      total_downloads_count: purchasesCount,
    })
    .eq("id", contributorId);

  return { badgeTier, commissionRate };
}

