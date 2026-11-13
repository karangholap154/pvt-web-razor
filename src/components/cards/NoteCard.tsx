"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Note } from "@/data/mockData";
import { Tag, PriceChip, TierBadge } from "@/components/ui/PillsAndBadges";
import Button from "@/components/ui/Button";
import { LuPlay, LuDownload, LuFileText } from "react-icons/lu";
import styles from "./NoteCard.module.css";

export interface NoteCardProps {
  note: Note;
  variant?: "catalog" | "unauth" | "purchased";
  onWatchVideo?: (note: Note) => void;
  onAction?: (note: Note) => void;
  actionLabel?: string;
  id?: string;
}

/**
 * Shorten university name for compact spec metadata
 */
function getShortUniversity(uni?: string): string {
  if (!uni) return "MU";
  const upper = uni.toUpperCase();
  if (upper.includes("MUMBAI")) return "MU";
  if (upper.includes("PUNE") || upper.includes("SPPU")) return "SPPU";
  if (upper.includes("NAGPUR")) return "NU";
  if (upper.includes("AMRAVATI")) return "AU";
  if (upper.includes("BATU")) return "DBATU";
  if (upper.includes("SHIVAJI")) return "SUK";
  return upper.length > 6 ? upper.slice(0, 5) : upper;
}

/**
 * Shorten branch name for compact spec metadata (e.g. COMP, IT, EXTC)
 */
function getShortBranch(branch?: string): string {
  if (!branch) return "ENGINEERING";
  const b = branch.toUpperCase();
  if (b.includes("COMPUTER") || b.includes("CSE")) return "COMP";
  if (b.includes("INFORMATION") || b.includes("IT")) return "IT";
  if (b.includes("AIML")) return "AIML";
  if (b.includes("AIDS") || b.includes("DATA SCIENCE")) return "AIDS";
  if (b.includes("EXTC") || b.includes("TELECOMMUNICATION")) return "EXTC";
  if (b.includes("MECHANICAL")) return "MECH";
  if (b.includes("ELECTRICAL")) return "ELEC";
  if (b.includes("CIVIL")) return "CIVIL";
  if (b.includes("ROBOTICS")) return "ROBOTICS";
  if (b.includes("AUTOMOBILE")) return "AUTO";
  if (b.includes("CHEMICAL")) return "CHEM";
  if (b.includes("BIOMEDICAL")) return "BIOMED";
  return branch.split(" ")[0].toUpperCase();
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

  const isSupplementary =
    note.resource_type === "supplementary_guide" ||
    note.resource_type === "chapter_module" ||
    note.resource_type === "cheatsheet" ||
    note.resource_type === "question_bank" ||
    note.resource_type === "lab_manual" ||
    (note.is_community_contributed && note.resource_type !== "official_subject");

  const isCommunity = !!(note.is_community_contributed || note.contributor_id || isSupplementary);
  const hasVideo = !!note.videoUrl;
  const isPaid = typeof note.price === "number" && note.price > 0;
  const priceValue = isPaid ? note.price! : 0;
  const shortUni = getShortUniversity(note.university);
  const shortBranch = getShortBranch(note.branch);

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
    } else if (note.videoUrl) {
      window.open(note.videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const getResourceTypeShortLabel = (type?: string | null) => {
    switch (type) {
      case "supplementary_guide":
        return "Guide";
      case "chapter_module":
        return "Module";
      case "cheatsheet":
        return "Revision";
      case "question_bank":
        return "PYQs";
      case "lab_manual":
        return "Lab";
      default:
        return null;
    }
  };

  const resourceTag = getResourceTypeShortLabel(note.resource_type);

  return (
    <article
      className={styles.card}
      id={id || note.id}
      onClick={handleCardClick}
      role="article"
      aria-label={note.title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 1. Proportional Note Preview Canvas */}
      <div className={styles.previewCanvas}>
        <div className={styles.ruledPattern} aria-hidden="true" />
        <div className={styles.marginLine} aria-hidden="true" />

        {/* Note cover snippet */}
        <div className={styles.previewContent}>
          <span className={styles.previewTopic}>
            {shortBranch} · SEM {note.semester}
          </span>
          <div className={styles.previewHeader}>
            <span className={styles.previewHighlight}>
              {note.title}
            </span>
          </div>
          <div className={styles.derivationLine} style={{ width: "70%" }} aria-hidden="true" />
          <div className={styles.derivationLine} style={{ width: "45%" }} aria-hidden="true" />
        </div>

        {/* Top-Left Tags */}
        <div className={styles.overlayTags}>
          {!isCommunity ? (
            <Tag label="Official" variant="ink" />
          ) : (
            <Tag label="Community" variant="blue" />
          )}
          {resourceTag && <Tag label={resourceTag} variant="yellow" />}
          <Tag label="PDF" variant="default" />
        </div>

        {/* Video Chip if available */}
        {hasVideo && (
          <button
            type="button"
            className={styles.videoChip}
            onClick={handleWatchVideoClick}
            aria-label={`Watch video walkthrough for ${note.title}`}
          >
            <LuPlay size={10} fill="currentColor" />
            <span>Video</span>
          </button>
        )}
      </div>

      {/* 2. Card Content Body */}
      <div className={styles.body}>
        {/* Mono Spec Metadata Line (MU · SEM 5 · COMP) */}
        <div className={styles.metaRow}>
          {shortUni} · SEM {note.semester} · {shortBranch}
        </div>

        {/* Display Title (Bricolage Grotesque) */}
        <h3 className={styles.title} title={note.title}>
          {note.title}
        </h3>

        {/* Subtitle / Subject */}
        <div className={styles.subtitle}>
          <LuFileText size={13} className="opacity-70" />
          <span>{note.subject && note.subject !== note.title ? note.subject : "Syllabus Notes"}</span>
        </div>

        {/* Purchased Action Button (Only shown when purchased) */}
        {variant === "purchased" && (
          <div className={styles.actionBtnWrapper}>
            <Button
              size="sm"
              variant="primary"
              style={{ width: "100%" }}
              leftIcon={<LuDownload size={15} />}
              onClick={handleActionClick}
            >
              {actionLabel || "Download PDF"}
            </Button>
          </div>
        )}

        {/* 3. Footer Row: Contributor + Price */}
        <div className={styles.footer}>
          {isCommunity && note.contributor_username ? (
            <div className={styles.contributorInfo}>
              <Link
                href={`/u/${note.contributor_username}`}
                onClick={(e) => e.stopPropagation()}
                className={styles.contributorHandle}
              >
                @{note.contributor_username}
              </Link>
              <TierBadge tier="rising" />
            </div>
          ) : (
            <span className={styles.officialLabel}>
              Verified Syllabus
            </span>
          )}

          <PriceChip price={priceValue} />
        </div>
      </div>
    </article>
  );
}
