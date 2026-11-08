"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./UserProfile.module.css";
import { Note } from "@/data/mockData";
import NoteCard from "@/components/cards/NoteCard";
import {
  LuArrowLeft,
  LuShare2,
  LuCheck,
  LuPencil,
  LuGraduationCap,
  LuBookOpen,
  LuCalendar,
  LuCrown,
  LuAward,
  LuTrendingUp,
  LuBanknote,
  LuCloudUpload,
} from "react-icons/lu";

interface UserProfileClientProps {
  username: string;
  fullName: string | null;
  university: string | null;
  branch: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  isOwn: boolean;
  isAdmin: boolean;
  badgeTier?: string | null;
  approvedNotesCount?: number;
  totalDownloadsCount?: number;
  notes: Note[];
}

function getInitial(name: string | null, username: string) {
  return (name || username || "?").charAt(0).toUpperCase();
}

function formatJoinDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function getRevenueSharePercentage(tier?: string | null): string {
  switch (tier) {
    case "legend":
      return "90%";
    case "top_author":
      return "82%";
    case "rising":
      return "75%";
    case "contributor":
    default:
      return "70%";
  }
}

function getNextTierProgress(approved: number, downloads: number, currentTier: string | null) {
  if (currentTier === "legend") {
    return {
      nextTierName: "Maximum Tier",
      percent: 100,
      description: "You have unlocked Legend Author — the highest academic tier with 90% contributor revenue share.",
      targetLabel: "MAX LEVEL REACHED",
    };
  }

  if (currentTier === "top_author" || (approved >= 5 && downloads >= 50)) {
    const targetApproved = 10;
    const targetDownloads = 100;
    const remApproved = Math.max(0, targetApproved - approved);
    const remDownloads = Math.max(0, targetDownloads - downloads);
    const pctApproved = Math.min(1, approved / targetApproved);
    const pctDownloads = Math.min(1, downloads / targetDownloads);
    const percent = Math.round(((pctApproved + pctDownloads) / 2) * 100);

    return {
      nextTierName: "Legend Author",
      percent,
      description: `${remApproved > 0 ? `${remApproved} more approved notes` : "Approved notes target met"}${remApproved > 0 && remDownloads > 0 ? " and " : ""}${remDownloads > 0 ? `${remDownloads} more unlocks` : ""} to reach Legend Author (90% share).`,
      targetLabel: "NEXT: LEGEND (90%)",
    };
  }

  if (currentTier === "rising" || (approved >= 3 && downloads >= 25)) {
    const targetApproved = 5;
    const targetDownloads = 50;
    const remApproved = Math.max(0, targetApproved - approved);
    const remDownloads = Math.max(0, targetDownloads - downloads);
    const pctApproved = Math.min(1, approved / targetApproved);
    const pctDownloads = Math.min(1, downloads / targetDownloads);
    const percent = Math.round(((pctApproved + pctDownloads) / 2) * 100);

    return {
      nextTierName: "Top Author",
      percent,
      description: `${remApproved > 0 ? `${remApproved} more approved notes` : "Approved notes target met"}${remApproved > 0 && remDownloads > 0 ? " and " : ""}${remDownloads > 0 ? `${remDownloads} more unlocks` : ""} to reach Top Author (82% share).`,
      targetLabel: "NEXT: TOP AUTHOR (82%)",
    };
  }

  if (currentTier === "contributor" || (approved >= 1 && downloads >= 1)) {
    const targetApproved = 3;
    const targetDownloads = 25;
    const remApproved = Math.max(0, targetApproved - approved);
    const remDownloads = Math.max(0, targetDownloads - downloads);
    const pctApproved = Math.min(1, approved / targetApproved);
    const pctDownloads = Math.min(1, downloads / targetDownloads);
    const percent = Math.round(((pctApproved + pctDownloads) / 2) * 100);

    return {
      nextTierName: "Rising Scholar",
      percent,
      description: `${remApproved > 0 ? `${remApproved} more approved notes` : "Approved notes target met"}${remApproved > 0 && remDownloads > 0 ? " and " : ""}${remDownloads > 0 ? `${remDownloads} more unlocks` : ""} to reach Rising Scholar (75% share).`,
      targetLabel: "NEXT: RISING SCHOLAR (75%)",
    };
  }

  // Base tier -> Contributor (1 approved + 1 purchase)
  const targetApproved = 1;
  const targetDownloads = 1;
  const remApproved = Math.max(0, targetApproved - approved);
  const remDownloads = Math.max(0, targetDownloads - downloads);
  const percent = Math.round(((Math.min(1, approved / 1) + Math.min(1, downloads / 1)) / 2) * 100);

  return {
    nextTierName: "Verified Contributor",
    percent,
    description: `${remApproved > 0 ? `${remApproved} approved note upload` : "Upload target met"}${remApproved > 0 && remDownloads > 0 ? " and " : ""}${remDownloads > 0 ? `${remDownloads} student unlock` : ""} to activate Verified Contributor status (70% share).`,
    targetLabel: "NEXT: VERIFIED CONTRIBUTOR (70%)",
  };
}

export default function UserProfileClient({
  username,
  fullName,
  university,
  branch,
  avatarUrl,
  createdAt,
  isOwn,
  isAdmin,
  badgeTier,
  approvedNotesCount,
  totalDownloadsCount,
  notes = [],
}: UserProfileClientProps) {
  const [copied, setCopied] = useState(false);

  const effectiveApprovedNotes = approvedNotesCount !== undefined ? approvedNotesCount : notes.length;
  const effectiveDownloads = totalDownloadsCount !== undefined ? totalDownloadsCount : 0;
  const progressInfo = getNextTierProgress(effectiveApprovedNotes, effectiveDownloads, badgeTier || null);

  const handleCopy = () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/u/${username}`
        : `https://privateacademy.in/u/${username}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        {/* ── Back Navigation Link ── */}
        <Link href="/" className={styles.backLink}>
          <LuArrowLeft size={16} />
          <span>Back to Library</span>
        </Link>

        {/* ================================================================
            PROFILE HERO CARD (HEADER BAND WITH GRAPH PAPER)
            ================================================================ */}
        <section className={styles.profileHeroCard}>
          <div className={styles.heroCover} />

          <div className={styles.heroContent}>
            <div className={styles.heroTopRow}>
              {/* Scholar Avatar */}
              <div className={styles.avatarContainer}>
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${fullName || username}'s avatar`}
                    width={88}
                    height={88}
                    className={styles.avatarImg}
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {getInitial(fullName, username)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={styles.heroActions}>
                {isOwn && (
                  <Link href={`/u/${username}/profile`} className={styles.btnEdit}>
                    <LuPencil size={15} />
                    <span>Edit Profile</span>
                  </Link>
                )}
                <button
                  type="button"
                  className={`${styles.btnShare} ${copied ? styles.btnShareCopied : ""}`}
                  onClick={handleCopy}
                  title="Copy profile link"
                  id="btn-copy-profile-link"
                >
                  {copied ? (
                    <>
                      <LuCheck size={15} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <LuShare2 size={15} />
                      <span>Share Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Identity & Details */}
            <div className={styles.profileDetails}>
              <div className={styles.nameRow}>
                <h1 className={styles.displayName}>{fullName || username}</h1>
                <span className={styles.handlePill}>@{username}</span>
                {isOwn && <span className={styles.ownBadge}>You</span>}
                {isAdmin && <span className={styles.adminBadge}>Admin</span>}

                {/* Contributor Tier Badges */}
                {badgeTier === "legend" && (
                  <span className={`${styles.tierBadge} ${styles.tierBadgeLegend}`}>
                    <LuCrown size={12} /> Legend Author (90% Share)
                  </span>
                )}
                {badgeTier === "top_author" && (
                  <span className={`${styles.tierBadge} ${styles.tierBadgeTop}`}>
                    <LuAward size={12} /> Top Author (82% Share)
                  </span>
                )}
                {badgeTier === "rising" && (
                  <span className={`${styles.tierBadge} ${styles.tierBadgeRising}`}>
                    <LuAward size={12} /> Rising Scholar (75% Share)
                  </span>
                )}
                {badgeTier === "contributor" && (
                  <span className={`${styles.tierBadge} ${styles.tierBadgeContributor}`}>
                    <LuGraduationCap size={12} /> Verified Contributor (70% Share)
                  </span>
                )}
              </div>

              {/* Academic Metadata Chips */}
              <div className={styles.metaRow}>
                {university && (
                  <span className={styles.metaItem}>
                    <LuGraduationCap size={15} className={styles.metaIcon} />
                    <span>{university}</span>
                  </span>
                )}
                {branch && (
                  <span className={styles.metaItem}>
                    <LuBookOpen size={15} className={styles.metaIcon} />
                    <span>{branch}</span>
                  </span>
                )}
                {createdAt && (
                  <span className={styles.metaItem}>
                    <LuCalendar size={15} className={styles.metaIcon} />
                    <span>Joined {formatJoinDate(createdAt)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SCHOLAR STAT CELLS (HAIRLINE BENTO)
            ================================================================ */}
        <section className={styles.statsGrid} aria-label="Author impact statistics">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Approved Notes</span>
              <LuBookOpen className={styles.statIcon} size={18} />
            </div>
            <div className={styles.statValue}>{effectiveApprovedNotes}</div>
            <div className={styles.statDesc}>Verified engineering study resources published</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Copies Unlocked</span>
              <LuTrendingUp className={styles.statIcon} size={18} />
            </div>
            <div className={styles.statValue}>{effectiveDownloads}</div>
            <div className={styles.statDesc}>Downloads by university engineering peers</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Contributor Royalty</span>
              <LuBanknote className={styles.statIcon} size={18} />
            </div>
            <div className={styles.statValue}>{getRevenueSharePercentage(badgeTier)}</div>
            <div className={styles.statDesc}>Direct payout rate per student purchase</div>
          </div>
        </section>

        {/* ================================================================
            TIER PROGRESS STAIRCASE (DESIGN.md 4.5)
            ================================================================ */}
        <section className={styles.tierProgressCard} aria-label="Author tier progress">
          <div className={styles.progressHeader}>
            <div className={styles.progressTitleWrap}>
              <LuAward size={18} style={{ color: "var(--blue-500, #2447F5)" }} />
              <h2 className={styles.progressTitle}>Contributor Tier Standing</h2>
            </div>
            <span className={styles.progressTarget}>{progressInfo.targetLabel}</span>
          </div>

          <div className={styles.progressBarTrack} role="progressbar" aria-valuenow={progressInfo.percent} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${Math.max(5, Math.min(100, progressInfo.percent))}%` }}
            />
          </div>

          <p className={styles.progressDesc}>{progressInfo.description}</p>
        </section>

        {/* ================================================================
            PUBLISHED NOTES WORKSPACE
            ================================================================ */}
        <section className={styles.notesSection} aria-label="Published study notes">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Uploaded Study Resources</h2>
            <span className={styles.notesCountBadge}>
              {notes.length} {notes.length === 1 ? "Resource" : "Resources"} Published
            </span>
          </div>

          {notes.length > 0 ? (
            <div className={styles.notesGrid}>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  variant="catalog"
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <div className={styles.emptyIconWrap}>
                <LuBookOpen size={24} />
              </div>
              <h3 className={styles.emptyTitle}>No published notes yet</h3>
              <p className={styles.emptyText}>
                {isOwn
                  ? "Share your lecture notes, formula sheets, or lab practical guides with engineering peers and earn up to 90% per unlock."
                  : `@${username} hasn't published any public notes yet.`}
              </p>
              {isOwn && (
                <Link href="/contribute" className={styles.btnContribute}>
                  <LuCloudUpload size={16} />
                  <span>Contribute Your First Note</span>
                </Link>
              )}
            </div>
          )}
        </section>

        {/* ================================================================
            BOTTOM SHARE BAR
            ================================================================ */}
        <div className={styles.bottomShareBar}>
          <div className={styles.shareBarLeft}>
            <span className={styles.shareBarLabel}>Shareable profile handle</span>
            <span className={styles.shareBarUrl}>privateacademy.in/u/{username}</span>
          </div>
          <button
            type="button"
            className={`${styles.btnShare} ${copied ? styles.btnShareCopied : ""}`}
            onClick={handleCopy}
            id="btn-copy-profile-link-bottom"
          >
            {copied ? (
              <>
                <LuCheck size={14} />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <LuShare2 size={14} />
                <span>Copy Profile Link</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
