"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./UserProfile.module.css";

interface Note {
  id: string;
  title: string;
  branch: string;
  semester: string;
  description: string;
  price: number;
  videoUrl: string;
  downloadUrl: string;
  university: string;
  is_community_contributed?: boolean | null;
  contributor_id?: string | null;
}

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
  notes = [],
}: UserProfileClientProps) {
  const [copied, setCopied] = useState(false);

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
    <div className={styles.page}>
      {/* Ambient background glows */}
      <div className={styles.glowA} />
      <div className={styles.glowB} />

      <div className={styles.container}>

        {/* ── Back link ── */}
        <Link href="/" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Library
        </Link>

        {/* ── Profile Hero Card ── */}
        <div className={styles.heroCard}>
          {/* Decorative top stripe */}
          <div className={styles.heroStripe} />

          <div className={styles.heroBody}>
            {/* Avatar */}
            <div className={styles.avatarRing}>
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${fullName || username}'s avatar`}
                  width={96}
                  height={96}
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

            {/* Info */}
            <div className={styles.heroInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.displayName}>
                  {fullName || username}
                </h1>
                {isOwn && (
                  <span className={styles.ownBadge}>You</span>
                )}
                {isAdmin && (
                  <span className={styles.adminBadge}>Admin</span>
                )}
                {badgeTier === "legend" && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "12px", backgroundColor: "rgba(236, 72, 153, 0.2)", color: "#ec4899", border: "1px solid rgba(236, 72, 153, 0.4)" }}>
                    👑 Legend (90% Share)
                  </span>
                )}
                {badgeTier === "top_author" && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "12px", backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.4)" }}>
                    🌟 Top Author (82% Share)
                  </span>
                )}
                {badgeTier === "rising" && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "12px", backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.4)" }}>
                    ⚡ Rising Scholar (75% Share)
                  </span>
                )}
                {badgeTier === "contributor" && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "12px", backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.4)" }}>
                    🎓 Verified Contributor (70% Share)
                  </span>
                )}
              </div>

              <p className={styles.handleLine}>
                <span className={styles.atSymbol}>@</span>
                <span className={styles.handleText}>{username}</span>
              </p>

              {/* Meta chips */}
              <div className={styles.chipRow}>
                {university && (
                  <span className={styles.chip}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    {university}
                  </span>
                )}
                {branch && (
                  <span className={styles.chip}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    {branch}
                  </span>
                )}
                {createdAt && (
                  <span className={styles.chip}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Joined {formatJoinDate(createdAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.heroActions}>
              {isOwn ? (
                <Link href={`/u/${username}/profile`} className={styles.btnEdit}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Profile
                </Link>
              ) : null}
              <button
                className={`${styles.btnShare} ${copied ? styles.btnShareCopied : ""}`}
                onClick={handleCopy}
                title="Copy profile link"
                id="btn-copy-profile-link"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Share Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Gamified Contributor Badges Showcase ── */}
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🏆 Academic Badges & Achievements
          </h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "0.35rem 0.75rem", borderRadius: "20px", backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.3)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              🎓 Verified Contributor (70% Share)
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "0.35rem 0.75rem", borderRadius: "20px", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              ⚡ Rising Scholar (75% Share)
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "0.35rem 0.75rem", borderRadius: "20px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              🌟 Top Author (82% Share)
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "0.35rem 0.75rem", borderRadius: "20px", backgroundColor: "rgba(236, 72, 153, 0.15)", color: "#ec4899", border: "1px solid rgba(236, 72, 153, 0.3)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              👑 Legend (90% Share)
            </span>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <div className={styles.statValue}>{notes.length}</div>
              <div className={styles.statLabel}>Notes Contributed</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <div className={styles.statValue}>80%</div>
              <div className={styles.statLabel}>Revenue Share</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className={styles.statValue}>{isAdmin ? "Platform Admin" : "Active"}</div>
              <div className={styles.statLabel}>{isAdmin ? "System Role" : "Member"}</div>
            </div>
          </div>
        </div>

        {/* ── Published Notes & Study Guides Section ── */}
        {notes.length > 0 ? (
          <div className={styles.notesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Uploaded Notes & Study Guides</h2>
              <span className={styles.notesCount}>{notes.length} {notes.length === 1 ? "Note" : "Notes"}</span>
            </div>
            
            <div className={styles.notesGrid}>
              {notes.slice(0, 6).map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className={styles.noteCardItem}
                >
                  <div className={styles.noteHeader}>
                    <h3 className={styles.noteTitle}>{note.title}</h3>
                  </div>
                  
                  <div className={styles.badgeRowItem}>
                    {note.is_community_contributed || note.contributor_id ? (
                      <span style={{ fontSize: "0.675rem", fontWeight: 700, backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "0.15rem 0.45rem", borderRadius: "4px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                        🎓 By @{username}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.675rem", fontWeight: 700, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "0.15rem 0.45rem", borderRadius: "4px", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                        🏛️ Official Platform Note
                      </span>
                    )}
                    <span className={styles.tagBranchItem}>{note.branch}</span>
                    <span className={styles.badgeSemesterItem}>{note.semester}</span>
                    {note.price && note.price > 0 ? (
                      <span className={styles.badgePaidItem}>₹{note.price}</span>
                    ) : (
                      <span className={styles.badgeFreeItem}>Free</span>
                    )}
                  </div>
                  
                  <p className={styles.noteDesc}>{note.description}</p>
                  
                  <div className={styles.noteFooter}>
                    <span className={styles.learnMore}>
                      View details
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.learnMoreArrow}>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {notes.length > 6 && (
              <div className={styles.viewAllWrapper}>
                <Link href="/" className={styles.btnViewAll}>
                  View All Uploaded Notes
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.comingSoonCard}>
            <div className={styles.comingSoonIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h2 className={styles.comingSoonTitle}>Contributions coming soon</h2>
            <p className={styles.comingSoonDesc}>
              {isOwn
                ? "Once the contribution feature launches, your submitted notes and reviews will appear here — visible to the entire community."
                : `Once the contribution feature launches, notes and reviews submitted by @${username} will appear here.`}
            </p>
            <div className={styles.comingSoonBadge}>🚀 In Development</div>
          </div>
        )}

        {/* ── Share card at bottom ── */}
        <div className={styles.shareCard}>
          <div className={styles.shareCardLeft}>
            <span className={styles.shareCardLabel}>Profile link</span>
            <span className={styles.shareCardUrl}>privateacademy.in/u/{username}</span>
          </div>
          <button
            className={`${styles.btnShareSmall} ${copied ? styles.btnShareSmallCopied : ""}`}
            onClick={handleCopy}
            id="btn-copy-profile-link-bottom"
          >
            {copied ? "✓ Copied" : "Copy Link"}
          </button>
        </div>

      </div>
    </div>
  );
}
