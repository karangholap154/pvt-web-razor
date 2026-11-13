"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "../discussions.module.css";
import {
  LuArrowLeft,
  LuThumbsUp,
  LuCheck,
  LuFileText,
  LuSend,
  LuMessageSquare,
  LuShare2,
  LuLock,
  LuTrash2,
  LuCircleCheck,
} from "react-icons/lu";
import type { DiscussionPost, DiscussionReply } from "@/types/discussions";
import { IS_DISCUSSIONS_COMING_SOON } from "@/config/featureFlags";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DiscussionThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const discussionId = resolvedParams.id;
  const router = useRouter();
  const toast = useToast();
  const { authState, username } = useAuth();

  const [discussion, setDiscussion] = useState<DiscussionPost | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [isOriginalPoster, setIsOriginalPoster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
  const [showDeletePostConfirm, setShowDeletePostConfirm] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null);

  // New reply state
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (authState === "loading") return;
    let isCancelled = false;

    async function fetchThread() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/discussions/${discussionId}`);
        const data = await res.json();

        if (!isCancelled) {
          if (res.ok && data.discussion) {
            setDiscussion(data.discussion);
            setReplies(data.replies || []);
            setIsOriginalPoster(Boolean(data.isOriginalPoster));
          } else {
            toast.error(data.error || "Discussion topic not found");
            router.push("/discussions");
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error loading thread:", err);
          toast.error("Failed to load discussion topic");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchThread();
    return () => {
      isCancelled = true;
    };
  }, [authState, discussionId, router, toast]);

  // Handle upvote main post
  const handlePostVote = async () => {
    if (authState !== "ready") {
      toast.warning("Please sign in to upvote discussions. 🔒");
      router.push("/login");
      return;
    }
    if (!discussion) return;

    const nextVoted = !discussion.has_user_voted;
    const nextCount = nextVoted ? discussion.upvotes_count + 1 : Math.max(0, discussion.upvotes_count - 1);

    setDiscussion((prev) => prev ? { ...prev, has_user_voted: nextVoted, upvotes_count: nextCount } : null);

    try {
      const res = await fetch(`/api/discussions/${discussion.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setDiscussion((prev) => prev ? { ...prev, has_user_voted: data.voted, upvotes_count: data.upvotes_count } : null);
      }
    } catch {
      setDiscussion((prev) => prev ? { ...prev, has_user_voted: !nextVoted, upvotes_count: discussion.upvotes_count } : null);
    }
  };

  // Handle upvote reply
  const handleReplyVote = async (replyId: string) => {
    if (authState !== "ready") {
      toast.warning("Please sign in to upvote answers. 🔒");
      router.push("/login");
      return;
    }
    const targetReply = replies.find((r) => r.id === replyId);
    if (!targetReply) return;

    const nextVoted = !targetReply.has_user_voted;
    const nextCount = nextVoted ? targetReply.upvotes_count + 1 : Math.max(0, targetReply.upvotes_count - 1);

    setReplies((prev) =>
      prev.map((r) => (r.id === replyId ? { ...r, has_user_voted: nextVoted, upvotes_count: nextCount } : r))
    );

    try {
      const res = await fetch(`/api/discussions/${discussionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      });
      const data = await res.json();
      if (data.success) {
        setReplies((prev) =>
          prev.map((r) => (r.id === replyId ? { ...r, has_user_voted: data.voted, upvotes_count: data.upvotes_count } : r))
        );
      }
    } catch {
      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? { ...r, has_user_voted: !nextVoted, upvotes_count: targetReply.upvotes_count } : r))
      );
    }
  };

  // OP-Only: Mark Best Answer
  const handleMarkSolved = async (replyId: string) => {
    if (!isOriginalPoster) return;

    try {
      const res = await fetch(`/api/discussions/${discussionId}/mark-solved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Marked reply as Best Answer!");
        setDiscussion((prev) => prev ? { ...prev, is_resolved: true } : null);
        setReplies((prev) =>
          prev.map((r) => ({ ...r, is_accepted_answer: r.id === replyId }))
        );
      } else {
        toast.error(data.error || "Failed to mark best answer.");
      }
    } catch {
      toast.error("An error occurred while marking best answer.");
    }
  };

  // Share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Discussion link copied to clipboard! 🔗");
    }
  };

  // OP-Only Delete Doubt
  const handleConfirmDeletePost = async () => {
    if (!isOriginalPoster || isDeletingPost) return;

    setIsDeletingPost(true);
    try {
      const res = await fetch(`/api/discussions/${discussionId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Doubt deleted successfully!");
        setShowDeletePostConfirm(false);
        router.push("/discussions");
      } else {
        toast.error(data.error || "Failed to delete doubt.");
      }
    } catch {
      toast.error("An error occurred while deleting doubt.");
    } finally {
      setIsDeletingPost(false);
    }
  };

  // Delete Reply
  const handleConfirmDeleteReply = async () => {
    if (!replyToDelete || deletingReplyId) return;

    const replyId = replyToDelete;
    setDeletingReplyId(replyId);
    try {
      const res = await fetch(`/api/discussions/${discussionId}?replyId=${replyId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Answer deleted successfully!");
        setReplies((prev) => prev.filter((r) => r.id !== replyId));
        setDiscussion((prev) =>
          prev ? { ...prev, replies_count: Math.max(0, (prev.replies_count || 1) - 1) } : null
        );
        setReplyToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete answer.");
      }
    } catch {
      toast.error("An error occurred while deleting answer.");
    } finally {
      setDeletingReplyId(null);
    }
  };

  // Submit Text Reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authState !== "ready") {
      toast.warning("Please sign in to post an answer. 🔒");
      router.push("/login");
      return;
    }
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);

    try {
      const res = await fetch(`/api/discussions/${discussionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.reply) {
        toast.success("Reply submitted!");
        setReplies((prev) => [...prev, data.reply]);
        setDiscussion((prev) => prev ? { ...prev, replies_count: (prev.replies_count || 0) + 1 } : null);
        setReplyText("");
      } else {
        toast.error(data.error || "Failed to submit reply.");
      }
    } catch {
      toast.error("Error submitting reply.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (IS_DISCUSSIONS_COMING_SOON) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.threadDetailContainer}>
          <div className={styles.guestPromptCard}>
            <LuMessageSquare size={36} style={{ color: "var(--blue-500, #2447F5)" }} />
            <h1 className={styles.bannerTitle}>Discussions Under Maintenance</h1>
            <p className={styles.bannerSubtitle}>
              This discussion thread is currently hidden while we upgrade our student community features.
            </p>
            <Link href="/discussions" className={styles.btnPrimary} style={{ marginTop: 12 }}>
              Return to Discussions Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (authState === "loading" || isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid var(--line-300, #CDD4E2)", borderTopColor: "var(--blue-500, #2447F5)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "var(--slate-600, #4A5468)", fontSize: "0.9rem", fontFamily: "var(--font-inter), sans-serif" }}>
            Loading discussion thread...
          </p>
        </div>
      </div>
    );
  }

  if (!discussion) return null;

  const authorInitial = (discussion.author?.username || "S").charAt(0).toUpperCase();

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.threadDetailContainer}>
        {/* ── Back Navigation Link ── */}
        <button
          onClick={() => router.push("/discussions")}
          className={styles.backLink}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
        >
          <LuArrowLeft size={16} />
          <span>Back to Discussions Feed</span>
        </button>

        {/* ================================================================
            QUESTION HERO CARD
            ================================================================ */}
        <article className={styles.questionHeroCard}>
          <div className={styles.cardHeader}>
            <div className={styles.authorMeta}>
              <div className={styles.avatarCircle}>{authorInitial}</div>
              <span className={styles.authorName}>
                {discussion.author?.full_name || discussion.author?.username || "Student"}
              </span>
              <span className={styles.authorHandle}>
                @{discussion.author?.username || "student"}
              </span>
              <span className={styles.postDate}>
                • {new Date(discussion.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            {discussion.is_resolved && (
              <span className={styles.solvedBadge}>
                <LuCircleCheck size={13} /> Solved
              </span>
            )}
          </div>

          <h1 className={styles.questionTitle}>{discussion.title}</h1>

          <div className={styles.questionBody}>{discussion.content}</div>

          {/* Tags & Linked Note */}
          <div className={styles.monoTagsRow}>
            {discussion.university && (
              <span className={styles.monoTag}>{discussion.university}</span>
            )}
            {discussion.branch && (
              <span className={styles.monoTag}>{discussion.branch}</span>
            )}
            {discussion.semester && (
              <span className={styles.monoTag}>{discussion.semester}</span>
            )}

            {discussion.linked_note && (
              <Link
                href={`/notes/${discussion.linked_note.id}`}
                className={styles.attachedNotePill}
              >
                <LuFileText size={14} />
                <span>Linked Note: {discussion.linked_note.title}</span>
              </Link>
            )}

            {discussion.tags && discussion.tags.map((t, idx) => (
              <span key={idx} className={styles.monoTag}>
                #{t}
              </span>
            ))}
          </div>

          {/* Action Bar */}
          <div className={styles.cardFooter} style={{ borderTop: "1px solid var(--line-200, #E3E8F1)", paddingTop: 14 }}>
            <span className={styles.repliesCount}>
              <LuMessageSquare size={15} />
              <span>{discussion.replies_count || 0} {discussion.replies_count === 1 ? "answer" : "answers"}</span>
            </span>

            <div className={styles.cardActionBtns}>
              <button
                type="button"
                className={`${styles.btnActionIcon} ${discussion.has_user_voted ? styles.votePillActive : ""}`}
                onClick={handlePostVote}
                title="Upvote discussion"
                aria-label={`Upvote question, current ${discussion.upvotes_count}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px solid var(--line-300, #CDD4E2)" }}
              >
                <LuThumbsUp size={14} />
                <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontWeight: 700, fontSize: 12 }}>
                  {discussion.upvotes_count}
                </span>
              </button>

              <button
                type="button"
                className={styles.btnActionIcon}
                onClick={handleShare}
                title="Share link"
                aria-label="Share discussion link"
              >
                <LuShare2 size={15} />
              </button>

              {isOriginalPoster && (
                <button
                  type="button"
                  className={`${styles.btnActionIcon} ${styles.btnActionDanger}`}
                  onClick={() => setShowDeletePostConfirm(true)}
                  disabled={isDeletingPost}
                  title="Delete doubt"
                  aria-label="Delete question"
                >
                  <LuTrash2 size={15} />
                </button>
              )}
            </div>
          </div>
        </article>

        {/* ================================================================
            ANSWERS & REPLIES SECTION
            ================================================================ */}
        <section className={styles.answersSection}>
          <div className={styles.answersHeader}>
            <h2 className={styles.answersHeading}>
              Answers &amp; Peer Solutions ({replies.length})
            </h2>
          </div>

          {replies.length === 0 ? (
            <div style={{ padding: "36px 20px", background: "#FFFFFF", borderRadius: "14px", border: "1px solid var(--line-300, #CDD4E2)", textAlign: "center", color: "var(--slate-600, #4A5468)", fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}>
              No answers posted yet. Be the first student to help!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {replies.map((reply) => {
                const replyInitial = (reply.author?.username || "S").charAt(0).toUpperCase();
                const isReplyAuthor = Boolean(
                  username &&
                    reply.author?.username &&
                    username.toLowerCase() === reply.author.username.toLowerCase()
                );

                return (
                  <div
                    key={reply.id}
                    className={reply.is_accepted_answer ? styles.acceptedAnswerCard : styles.answerCard}
                  >
                    <div className={styles.avatarCircle} style={{ width: 30, height: 30, fontSize: 12 }}>
                      {replyInitial}
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <div className={styles.authorMeta}>
                          <span className={styles.authorName}>
                            {reply.author?.full_name || reply.author?.username || "Student"}
                          </span>
                          <span className={styles.authorHandle}>
                            @{reply.author?.username || "student"}
                          </span>
                          <span className={styles.postDate}>
                            • {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {reply.is_accepted_answer && (
                          <span className={styles.bestAnswerBadge}>
                            <LuCheck size={12} /> Best Answer
                          </span>
                        )}
                      </div>

                      <div className={styles.answerBody}>{reply.content}</div>

                      <div className={styles.cardFooter} style={{ marginTop: 8 }}>
                        <button
                          type="button"
                          className={`${styles.btnActionIcon} ${reply.has_user_voted ? styles.votePillActive : ""}`}
                          onClick={() => handleReplyVote(reply.id)}
                          title="Upvote answer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--line-300, #CDD4E2)" }}
                        >
                          <LuThumbsUp size={13} />
                          <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontWeight: 700, fontSize: 11 }}>
                            {reply.upvotes_count}
                          </span>
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          {/* OP-Only Mark Best Answer Button */}
                          {isOriginalPoster && !reply.is_accepted_answer && (
                            <button
                              type="button"
                              onClick={() => handleMarkSolved(reply.id)}
                              className={styles.btnMarkSolved}
                            >
                              <LuCheck size={13} />
                              <span>Mark as Best Answer</span>
                            </button>
                          )}

                          {/* Delete Answer Action (Reply author only) */}
                          {isReplyAuthor && (
                            <button
                              type="button"
                              className={`${styles.btnActionIcon} ${styles.btnActionDanger}`}
                              onClick={() => setReplyToDelete(reply.id)}
                              disabled={deletingReplyId === reply.id}
                              title="Delete answer"
                            >
                              <LuTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================
            REPLY COMPOSER OR LOGIN PROMPT
            ================================================================ */}
        {authState === "ready" ? (
          <section className={styles.composerCard}>
            <h3 className={styles.composerTitle}>Your Answer / Solution</h3>

            <form onSubmit={handleSubmitReply} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <textarea
                className={styles.replyTextarea}
                placeholder="Write your solution, explanation, or code snippet here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmittingReply}>
                  <LuSend size={15} />
                  <span>{isSubmittingReply ? "Posting..." : "Post Answer"}</span>
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className={styles.guestPromptCard}>
            <LuLock size={28} style={{ color: "var(--blue-500, #2447F5)" }} />
            <h3 className={styles.composerTitle}>Sign in to join the discussion</h3>
            <p className={styles.bannerSubtitle}>
              Please sign in to post your answer, help university peers, and upvote discussions.
            </p>
            <button onClick={() => router.push("/login")} className={styles.btnPrimary} style={{ marginTop: 8 }}>
              Sign In to Reply
            </button>
          </section>
        )}

        {/* Confirmation Dialogs */}
        {isOriginalPoster && (
          <ConfirmDialog
            isOpen={showDeletePostConfirm}
            title="Delete this doubt?"
            description="This will permanently delete this doubt topic and all of its answers. This action cannot be undone."
            confirmText="Delete Doubt"
            cancelText="Cancel"
            variant="danger"
            isLoading={isDeletingPost}
            onConfirm={handleConfirmDeletePost}
            onClose={() => setShowDeletePostConfirm(false)}
          />
        )}

        <ConfirmDialog
          isOpen={Boolean(replyToDelete)}
          title="Delete this answer?"
          description="Your answer will be permanently deleted from this discussion. This action cannot be undone."
          confirmText="Delete Answer"
          cancelText="Cancel"
          variant="danger"
          isLoading={Boolean(deletingReplyId)}
          onConfirm={handleConfirmDeleteReply}
          onClose={() => setReplyToDelete(null)}
        />
      </main>
    </div>
  );
}
