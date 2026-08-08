"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaThumbsUp, FaCheck, FaMessage, FaFilePdf, FaShareNodes } from "react-icons/fa6";
import styles from "../../app/discussions/discussions.module.css";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import type { DiscussionPost } from "@/types/discussions";

interface DiscussionCardProps {
  post: DiscussionPost;
  onVoteToggle?: (postId: string, newCount: number, voted: boolean) => void;
}

export default function DiscussionCard({ post, onVoteToggle }: DiscussionCardProps) {
  const router = useRouter();
  const toast = useToast();
  const { authState } = useAuth();

  const [upvotes, setUpvotes] = useState(post.upvotes_count || 0);
  const [hasVoted, setHasVoted] = useState(post.has_user_voted || false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authState !== "ready") {
      toast.warning("Please sign in to upvote discussions. 🔒");
      router.push("/login");
      return;
    }
    if (isVoting) return;

    // Optimistic UI update
    const nextVoted = !hasVoted;
    const nextCount = nextVoted ? upvotes + 1 : Math.max(0, upvotes - 1);
    setHasVoted(nextVoted);
    setUpvotes(nextCount);
    setIsVoting(true);

    try {
      const res = await fetch(`/api/discussions/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setUpvotes(data.upvotes_count);
        setHasVoted(data.voted);
        if (onVoteToggle) onVoteToggle(post.id, data.upvotes_count, data.voted);
      } else {
        setHasVoted(!nextVoted);
        setUpvotes(upvotes);
      }
    } catch {
      setHasVoted(!nextVoted);
      setUpvotes(upvotes);
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/discussions/${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Discussion link copied to clipboard! 🔗");
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked interactive inner elements like note link or author profile, don't trigger card router push
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    router.push(`/discussions/${post.id}`);
  };

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "";

  const authorInitial = (post.author?.username || "S").charAt(0).toUpperCase();

  return (
    <article className={styles.twitterCard} onClick={handleCardClick}>
      {/* Left Author Avatar Circle */}
      <div className={styles.avatarCircle}>
        {authorInitial}
      </div>

      {/* Main Content Area */}
      <div className={styles.cardContent}>
        {/* Top Header Row */}
        <div className={styles.cardHeader}>
          <div className={styles.authorMeta}>
            <span className={styles.authorName}>
              {post.author?.full_name || post.author?.username || "Student"}
            </span>
            <span className={styles.authorHandle}>
              @{post.author?.username || "student"}
            </span>
            <span className={styles.metaDot}>•</span>
            <span className={styles.badgePill}>{post.branch} • {post.semester}</span>
            <span className={styles.metaDot}>•</span>
            <span className={styles.metaTime}>{formattedDate}</span>
          </div>

          {post.is_resolved && (
            <span className={styles.solvedBadge}>
              <FaCheck /> Solved
            </span>
          )}
        </div>

        {/* Post Title */}
        <h3 className={styles.cardTitle}>
          <Link href={`/discussions/${post.id}`} className={styles.cardTitleLink}>
            {post.title}
          </Link>
        </h3>

        {/* Content Snippet */}
        <p className={styles.cardTextSnippet}>{post.content}</p>

        {/* Linked Note Pill & Tags */}
        {(post.linked_note || (post.tags && post.tags.length > 0)) && (
          <div className={styles.tagsRow}>
            {post.linked_note && (
              <Link
                href={`/notes/${post.linked_note.id}`}
                className={styles.noteLinkPill}
                onClick={(e) => e.stopPropagation()}
                title={`View linked note: ${post.linked_note.title}`}
              >
                <FaFilePdf /> Note: {post.linked_note.title}
              </Link>
            )}

            {post.tags && post.tags.map((t, idx) => (
              <span key={idx} className={styles.tagPill}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Horizontal Twitter / X Style Action Bar */}
        <div className={styles.twitterActionBar}>
          {/* Comment / Reply Action */}
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionComment}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/discussions/${post.id}`);
            }}
            title="View discussion thread & replies"
          >
            <FaMessage style={{ fontSize: "0.85rem" }} />
            <span>{post.replies_count || 0}</span>
          </button>

          {/* Upvote Action */}
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionUpvote} ${hasVoted ? styles.actionUpvoted : ""}`}
            onClick={handleVote}
            disabled={isVoting}
            title="Upvote post"
          >
            <FaThumbsUp style={{ fontSize: "0.85rem" }} />
            <span>{upvotes}</span>
          </button>

          {/* Share Action */}
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionShare}`}
            onClick={handleShare}
            title="Copy discussion link"
          >
            <FaShareNodes style={{ fontSize: "0.85rem" }} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}
