import React from "react";
import { LuCheck, LuClock, LuX, LuCircleAlert } from "react-icons/lu";
import styles from "./PillsAndBadges.module.css";

/* --- 1. Filter Pill --- */
export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  label: string;
  count?: number;
}

export function FilterPill({
  selected = false,
  label,
  count,
  className = "",
  ...props
}: FilterPillProps) {
  return (
    <button
      type="button"
      className={`${styles.filterPill} ${selected ? styles.filterPillSelected : ""} ${className}`.trim()}
      aria-pressed={selected}
      {...props}
    >
      {selected && <LuCheck size={16} strokeWidth={2.5} aria-hidden="true" />}
      <span>{label}</span>
      {count !== undefined && (
        <span className="tabular text-xs opacity-75">({count})</span>
      )}
    </button>
  );
}

/* --- 2. Tag --- */
export interface TagProps {
  label: string;
  variant?: "default" | "ink" | "blue" | "yellow";
  className?: string;
}

export function Tag({ label, variant = "default", className = "" }: TagProps) {
  const variantClass = {
    default: "",
    ink: styles.tagInk,
    blue: styles.tagBlue,
    yellow: styles.tagYellow,
  }[variant];

  return (
    <span className={`${styles.tag} ${variantClass} ${className}`.trim()}>
      {label}
    </span>
  );
}

/* --- 3. Price Chip --- */
export interface PriceChipProps {
  price: number;
  className?: string;
}

export function PriceChip({ price, className = "" }: PriceChipProps) {
  const isFree = price === 0;
  return (
    <span
      className={`${styles.priceChip} ${isFree ? styles.priceFree : styles.pricePaid} ${className}`.trim()}
    >
      {isFree ? "FREE" : `₹${price}`}
    </span>
  );
}

/* --- 4. Contributor Tier Badge --- */
export type ContributorTier = "verified" | "rising" | "top" | "legend";

export interface TierBadgeProps {
  tier: ContributorTier;
  className?: string;
}

const TIER_LABELS: Record<ContributorTier, string> = {
  verified: "Verified",
  rising: "Rising Scholar",
  top: "Top Author",
  legend: "Legend Author",
};

export function TierBadge({ tier, className = "" }: TierBadgeProps) {
  const tierClass = {
    verified: styles.tierVerified,
    rising: styles.tierRising,
    top: styles.tierTop,
    legend: styles.tierLegend,
  }[tier];

  return (
    <span
      className={`${styles.tierBadge} ${tierClass} ${className}`.trim()}
      title={TIER_LABELS[tier]}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}

/* --- 5. Status Badge --- */
export type SubmissionStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "rejected"
  | "payout_requested"
  | "paid"
  | "failed";

export interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  switch (status) {
    case "draft":
      return (
        <span className={`${styles.statusBadge} ${styles.statusDraft} ${className}`.trim()}>
          Draft
        </span>
      );
    case "in_review":
      return (
        <span className={`${styles.statusBadge} ${styles.statusInReview} ${className}`.trim()}>
          <LuClock size={13} aria-hidden="true" />
          <span>In Review</span>
        </span>
      );
    case "approved":
    case "paid":
      return (
        <span className={`${styles.statusBadge} ${styles.statusSuccess} ${className}`.trim()}>
          <LuCheck size={13} strokeWidth={2.5} aria-hidden="true" />
          <span>{status === "paid" ? "Paid" : "Live"}</span>
        </span>
      );
    case "rejected":
    case "failed":
      return (
        <span className={`${styles.statusBadge} ${styles.statusError} ${className}`.trim()}>
          <LuX size={13} strokeWidth={2.5} aria-hidden="true" />
          <span>{status === "failed" ? "Failed" : "Rejected"}</span>
        </span>
      );
    case "payout_requested":
      return (
        <span className={`${styles.statusBadge} ${styles.statusInfo} ${className}`.trim()}>
          <LuCircleAlert size={13} aria-hidden="true" />
          <span>Payout Requested</span>
        </span>
      );
  }
}
