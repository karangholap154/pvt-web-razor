"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Note } from "@/data/mockData";
import styles from "./NoteCard.module.css";

export interface NoteCardProps {
  note: Note;
  variant?: "catalog" | "unauth" | "purchased";
  onWatchVideo?: (note: Note) => void;
  onAction?: (note: Note) => void;
  actionLabel?: string;
  id?: string;
}

export default function NoteCard({
  note,
  variant = "catalog",
  onWatchVideo,
  onAction,
  actionLabel,
  id,
}: NoteCardProps) {
  const router = useRouter();
  const isStudentNote = !!(note.is_community_contributed || note.contributor_id);
  const hasVideo = !!note.videoUrl && !!onWatchVideo;
  const isPaid = typeof note.price === "number" && note.price > 0;

  const handleCardClick = () => {
    router.push(`/notes/${note.id}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) {
      onAction(note);
    } else {
      router.push(`/notes/${note.id}`);
    }
  };

  const handleWatchVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWatchVideo) {
      onWatchVideo(note);
    }
  };

  return (
    <article
      className={`${styles.noteCard} ${isStudentNote ? styles.studentCard : ""}`}
      id={id || note.id}
      onClick={handleCardClick}
      role="article"
      aria-label={note.title}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <Link
            href={`/notes/${note.id}`}
            className={styles.titleLink}
            onClick={(e) => e.stopPropagation()}
          >
            {note.title}
          </Link>
        </h3>
      </div>

      <div className={styles.badgeRow}>
        <span
          className={`${styles.badge} ${
            isStudentNote ? styles.tagBranchStudent : styles.tagBranch
          }`}
        >
          {note.branch}
        </span>

        <span className={`${styles.badge} ${styles.badgeSemester}`}>
          Sem {note.semester}
        </span>

        {variant === "purchased" ? (
          <span className={`${styles.badge} ${styles.badgeUnlocked}`}>
            Unlocked
          </span>
        ) : isPaid ? (
          <span
            className={`${styles.badge} ${
              isStudentNote ? styles.badgePricePaidStudent : styles.badgePricePaid
            }`}
          >
            ₹{note.price}
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgePriceFree}`}>
            Free
          </span>
        )}
      </div>

      <p className={styles.cardDesc}>{note.description}</p>

      <div
        className={`${styles.cardActions} ${
          hasVideo ? styles.cardActionsWithVideo : ""
        }`}
      >
        {hasVideo && (
          <button
            type="button"
            onClick={handleWatchVideoClick}
            className={`${styles.btnAction} ${styles.btnWatch}`}
            id={`btn-watch-${note.id}`}
            aria-label={`Watch video walkthrough for ${note.title}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Watch Video
          </button>
        )}

        {variant === "purchased" ? (
          <button
            type="button"
            onClick={handleActionClick}
            className={`${styles.btnAction} ${styles.btnSecondaryAction}`}
            id={`btn-download-${note.id}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {actionLabel || "Download PDF"}
          </button>
        ) : variant === "unauth" ? (
          <button
            type="button"
            onClick={handleActionClick}
            className={`${styles.btnAction} ${styles.btnSecondaryAction}`}
            id={`btn-preview-${note.id}`}
          >
            {actionLabel || "Preview & details"}
          </button>
        ) : isPaid ? (
          <button
            type="button"
            onClick={handleActionClick}
            className={`${styles.btnAction} ${
              isStudentNote ? styles.btnUnlockStudent : styles.btnUnlock
            }`}
            id={`btn-unlock-${note.id}`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {actionLabel || "Unlock PDF"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleActionClick}
            className={`${styles.btnAction} ${styles.btnDownloadFree}`}
            id={`btn-download-free-${note.id}`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {actionLabel || "Free PDF"}
          </button>
        )}
      </div>

      <div className={styles.contributorRow}>
        {isStudentNote ? (
          note.contributor_username ? (
            <Link
              href={`/u/${note.contributor_username}`}
              onClick={(e) => e.stopPropagation()}
              className={styles.contributorBadgeStudent}
            >
              By @{note.contributor_username}
            </Link>
          ) : (
            <span className={styles.contributorBadgeStudent}>
              Student Contribution
            </span>
          )
        ) : (
          <span className={styles.contributorBadgePlatform}>
            Official Note
          </span>
        )}
      </div>
    </article>
  );
}
