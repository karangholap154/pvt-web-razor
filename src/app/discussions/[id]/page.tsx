"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Work_Sans, Caveat } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "../discussions.module.css";
import { FaArrowLeft, FaThumbsUp, FaCheck, FaFilePdf, FaPaperPlane, FaMessage, FaShareNodes, FaLock, FaTrash, FaComments } from "react-icons/fa6";
import type { DiscussionPost, DiscussionReply } from "@/types/discussions";
import { IS_DISCUSSIONS_COMING_SOON } from "@/config/featureFlags";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
});

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
      <div className={`${workSans.variable} ${caveat.variable} ${styles.notebookPageRoot}`}>
        <div className={styles.nbSpine} aria-hidden="true" />
        <div className={styles.nbMarginRule} aria-hidden="true" />
        <main className={styles.mainContainer}>
          <div className={styles.comingSoonWrapper}>
            <div className={styles.comingSoonCard}>
              <div className={styles.comingSoonBadge}>
                <FaComments style={{ color: "var(--nb-ink)" }} /> Community Discussions • Coming Soon 🚀
              </div>
              <h1 className={styles.comingSoonTitle}>
                Discussions Feature Under Maintenance
              </h1>
              <p className={styles.comingSoonSubtitle}>
                This discussion thread is currently hidden while we upgrade our student community features.
              </p>
              <Link href="/discussions" className={styles.comingSoonBtn}>
                Return to Discussions Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (authState === "loading" || isLoading) {
    return (
      <div className={`${workSans.variable} ${caveat.variable} ${styles.notebookPageRoot}`}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh", flexDirection: "column", gap: "1rem" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid #dbe6ef", borderTopColor: "#1d3557", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
          <p style={{ color: "var(--nb-ink-dim, #5c7089)", fontSize: "0.92rem", fontWeight: 500 }}>Loading discussion thread...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!discussion) return null;

  const authorInitial = (discussion.author?.username || "S").charAt(0).toUpperCase();

  return (
    <div className={`${workSans.variable} ${caveat.variable} ${styles.notebookPageRoot}`}>
      <div className={styles.nbSpine} aria-hidden="true" />
      <div className={styles.nbMarginRule} aria-hidden="true" />

      <main className={styles.mainContainer}>
        <button
          onClick={() => router.push("/discussions")}
          className={styles.threadBackBtn}
        >
          <FaArrowLeft /> Back to Discussions Feed
        </button>

        {/* Main Topic Card */}
        <article className={`${styles.twitterCard} ${styles.mainTopicCard}`} style={{ cursor: "default" }}>
          <div className={styles.avatarCircle}>
            {authorInitial}
          </div>

          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.authorMeta}>
                <span className={styles.authorName}>
                  {discussion.author?.full_name || discussion.author?.username || "Student"}
                </span>
                <span className={styles.authorHandle}>
                  @{discussion.author?.username || "student"}
                </span>
                <span className={styles.badgePill}>{discussion.branch}</span>
                <span className={styles.badgePill}>{discussion.semester}</span>
                <span className={styles.metaTime}>{new Date(discussion.created_at).toLocaleDateString()}</span>
              </div>

              {discussion.is_resolved && (
                <span className={styles.solvedBadge}>
                  <FaCheck /> Solved
                </span>
              )}
            </div>

            <h1 className={styles.cardTitle} style={{ fontSize: "1.35rem" }}>
              {discussion.title}
            </h1>

            <div className={styles.topicBody}>
              {discussion.content}
            </div>

            <div className={styles.tagsRow}>
              {discussion.linked_note && (
                <Link
                  href={`/notes/${discussion.linked_note.id}`}
                  className={styles.noteLinkPill}
                  style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
                >
                  <FaFilePdf /> View Linked Note: {discussion.linked_note.title}
                </Link>
              )}

              {discussion.tags && discussion.tags.map((t, idx) => (
                <span key={idx} className={styles.tagPill}>
                  #{t}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div className={styles.twitterActionBar}>
              <span className={`${styles.actionBtn} ${styles.actionComment}`} style={{ cursor: "default" }}>
                <FaMessage style={{ fontSize: "0.85rem" }} />
                <span>{discussion.replies_count || 0} replies</span>
              </span>

              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionUpvote} ${discussion.has_user_voted ? styles.actionUpvoted : ""}`}
                onClick={handlePostVote}
                title="Upvote discussion"
              >
                <FaThumbsUp style={{ fontSize: "0.85rem" }} />
                <span>{discussion.upvotes_count}</span>
              </button>

              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionShare}`}
                onClick={handleShare}
                title="Share link"
              >
                <FaShareNodes style={{ fontSize: "0.85rem" }} />
                <span>Share</span>
              </button>

              {isOriginalPoster && (
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionDelete}`}
                  onClick={() => setShowDeletePostConfirm(true)}
                  disabled={isDeletingPost}
                  title="Delete your doubt"
                >
                  <FaTrash style={{ fontSize: "0.85rem" }} />
                  <span>{isDeletingPost ? "Deleting..." : "Delete"}</span>
                </button>
              )}
            </div>
          </div>
        </article>

        {/* Answers & Replies Section */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className={styles.repliesSectionTitle}>
            Answers & Peer Solutions ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <div className={styles.noRepliesCard}>
              No answers posted yet. Be the first student to help!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                    className={`${styles.twitterCard} ${styles.replyCard} ${reply.is_accepted_answer ? styles.replyAcceptedCard : ""}`}
                    style={{ cursor: "default" }}
                  >
                    <div className={styles.avatarCircle} style={{ width: "38px", height: "38px", fontSize: "0.95rem" }}>
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
                          <span className={styles.metaDot}>•</span>
                          <span className={styles.metaTime}>{new Date(reply.created_at).toLocaleDateString()}</span>
                        </div>

                        {reply.is_accepted_answer && (
                          <span className={styles.solvedBadge}>
                            <FaCheck /> Best Answer (Selected by OP)
                          </span>
                        )}
                      </div>

                      <div className={styles.replyBody}>
                        {reply.content}
                      </div>

                      <div className={styles.twitterActionBar} style={{ borderTop: "none", paddingTop: 0, marginTop: "0.4rem" }}>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.actionUpvote} ${reply.has_user_voted ? styles.actionUpvoted : ""}`}
                          onClick={() => handleReplyVote(reply.id)}
                          title="Upvote answer"
                        >
                          <FaThumbsUp style={{ fontSize: "0.8rem" }} />
                          <span>{reply.upvotes_count}</span>
                        </button>

                        {/* OP-Only Mark Best Answer Button */}
                        {isOriginalPoster && !reply.is_accepted_answer && (
                          <button
                            type="button"
                            onClick={() => handleMarkSolved(reply.id)}
                            className={styles.markBestBtn}
                          >
                            <FaCheck /> Mark as Best Answer
                          </button>
                        )}

                        {/* Delete Answer Action (Reply author only) */}
                        {isReplyAuthor && (
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionDelete}`}
                            onClick={() => setReplyToDelete(reply.id)}
                            disabled={deletingReplyId === reply.id}
                            title="Delete your answer"
                          >
                            <FaTrash style={{ fontSize: "0.8rem" }} />
                            <span>{deletingReplyId === reply.id ? "Deleting..." : "Delete"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Post a Text Reply Form or Sign-in Prompt */}
        {authState === "ready" ? (
          <section className={styles.replyFormSection}>
            <h3 className={styles.replyFormTitle}>
              Your Answer / Solution
            </h3>

            <form onSubmit={handleSubmitReply} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <textarea
                className={styles.formTextarea}
                placeholder="Write your text or markdown solution here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
                style={{ minHeight: "100px" }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmittingReply}>
                  <FaPaperPlane /> {isSubmittingReply ? "Posting..." : "Post Answer"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className={styles.replyLoginCard}>
            <h3 className={styles.replyLoginTitle}>
              <FaLock style={{ color: "var(--nb-margin)" }} /> Sign in to join the discussion
            </h3>
            <p className={styles.replyLoginText}>
              Please sign in or create an account to post answers, help your peers, and upvote discussions.
            </p>
            <button onClick={() => router.push("/login")} className={styles.btnPrimary}>
              Sign In to Reply
            </button>
          </section>
        )}

        {isOriginalPoster && (
          <ConfirmDialog
            isOpen={showDeletePostConfirm}
            title="Delete this doubt?"
            description="This will permanently delete this doubt and all of its answers. This action cannot be undone."
            confirmText="Delete doubt"
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
          confirmText="Delete answer"
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
