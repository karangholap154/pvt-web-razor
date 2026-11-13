"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuThumbsUp,
  LuMessageSquare,
  LuFileText,
  LuShare2,
  LuTrash2,
  LuCircleCheck,
} from "react-icons/lu";
import styles from "../../app/discussions/discussions.module.css";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import type { DiscussionPost } from "@/types/discussions";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface DiscussionCardProps {
  post: DiscussionPost;
  onVoteToggle?: (postId: string, newCount: number, voted: boolean) => void;
  onDelete?: (postId: string) => void;
}

export default function DiscussionCard({ post, onVoteToggle, onDelete }: DiscussionCardProps) {
  const router = useRouter();
  const toast = useToast();
  const { authState, username } = useAuth();

  const [upvotes, setUpvotes] = useState(post.upvotes_count || 0);
  const [hasVoted, setHasVoted] = useState(post.has_user_voted || false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAuthor = Boolean(
    username &&
      post.author?.username &&
      username.toLowerCase() === post.author.username.toLowerCase()
  );

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/discussions/${post.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Doubt deleted successfully!");
        setShowDeleteConfirm(false);
        if (onDelete) onDelete(post.id);
      } else {
        toast.error(data.error || "Failed to delete doubt.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("An error occurred while deleting doubt.");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <>
      <article className={styles.threadCard} onClick={handleCardClick} role="article">
        {/* Left Upvote Pill */}
        <button
          type="button"
          onClick={handleVote}
          className={`${styles.votePill} ${hasVoted ? styles.votePillActive : ""}`}
          title={hasVoted ? "Remove upvote" : "Upvote this question"}
          aria-label={`Upvote question, current count ${upvotes}`}
        >
          <LuThumbsUp size={15} />
          <span className={styles.voteCount}>{upvotes}</span>
        </button>

        {/* Main Content Area */}
        <div className={styles.cardContent}>
          {/* Top Header Row */}
          <div className={styles.cardHeader}>
            <div className={styles.authorMeta}>
              <div className={styles.avatarCircle}>{authorInitial}</div>
              <span className={styles.authorName}>
                {post.author?.full_name || post.author?.username || "Student"}
              </span>
              <span className={styles.authorHandle}>
                @{post.author?.username || "student"}
              </span>
              <span className={styles.postDate}>• {formattedDate}</span>
            </div>

            {post.is_resolved && (
              <span className={styles.solvedBadge}>
                <LuCircleCheck size={12} /> Solved
              </span>
            )}
          </div>

          {/* Question Title */}
          <h3 className={styles.cardTitle}>{post.title}</h3>

          {/* Question Excerpt */}
          {post.content && (
            <p className={styles.cardText}>{post.content}</p>
          )}

          {/* Tags & Note Link Row */}
          <div className={styles.monoTagsRow}>
            {post.university && (
              <span className={styles.monoTag}>{post.university}</span>
            )}
            {post.branch && (
              <span className={styles.monoTag}>{post.branch}</span>
            )}
            {post.semester && (
              <span className={styles.monoTag}>{post.semester}</span>
            )}

            {/* Attached Study Note Link */}
            {post.linked_note && (
              <Link
                href={`/notes/${post.linked_note.id}`}
                className={styles.attachedNotePill}
                onClick={(e) => e.stopPropagation()}
                title={`Study note: ${post.linked_note.title}`}
              >
                <LuFileText size={13} />
                <span>Note: {post.linked_note.title}</span>
              </Link>
            )}
          </div>

          {/* Card Footer: Replies count, share, delete */}
          <div className={styles.cardFooter}>
            <span className={styles.repliesCount}>
              <LuMessageSquare size={14} />
              <span>{post.replies_count || 0} {post.replies_count === 1 ? "answer" : "answers"}</span>
            </span>

            <div className={styles.cardActionBtns}>
              <button
                type="button"
                className={styles.btnActionIcon}
                onClick={handleShare}
                title="Share discussion"
                aria-label="Share discussion link"
              >
                <LuShare2 size={14} />
              </button>

              {isAuthor && (
                <button
                  type="button"
                  className={`${styles.btnActionIcon} ${styles.btnActionDanger}`}
                  onClick={handleDeleteClick}
                  title="Delete discussion"
                  aria-label="Delete discussion"
                >
                  <LuTrash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete this discussion?"
        description="Are you sure you want to permanently delete your doubt topic and all its responses? This action cannot be undone."
        confirmText="Delete Doubt"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
