"use client";

import { useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { AdminSubmission } from "@/types/admin";
import { useToast } from "@/components/providers/ToastProvider";

interface AdminSubmissionsTabProps {
  adminSubmissions: AdminSubmission[];
  loadingSubmissions: boolean;
  fetchAdminSubmissions: () => Promise<void>;
  handleDeleteSubmission: (submissionId: string, submissionTitle: string) => void;
}

export default function AdminSubmissionsTab({
  adminSubmissions,
  loadingSubmissions,
  fetchAdminSubmissions,
  handleDeleteSubmission,
}: AdminSubmissionsTabProps) {
  const toast = useToast();
  const [subActionLoading, setSubActionLoading] = useState<boolean>(false);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    sub: AdminSubmission | null;
    approvedPrice: number;
    feedback: string;
    subject: string;
    resourceType: string;
  }>({
    open: false,
    sub: null,
    approvedPrice: 0,
    feedback: "",
    subject: "",
    resourceType: "supplementary_guide",
  });

  const handleApproveSubmissionSubmit = async (
    submissionId: string,
    finalPrice: number,
    adminFeedback: string,
    finalSubject?: string,
    finalResourceType?: string
  ) => {
    if (subActionLoading) return;
    setSubActionLoading(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          action: "approve",
          finalPrice,
          adminFeedback,
          finalSubject,
          finalResourceType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      toast.success("Note approved and published to live catalog!");
      setReviewModal({
        open: false,
        sub: null,
        approvedPrice: 0,
        feedback: "",
        subject: "",
        resourceType: "supplementary_guide",
      });
      fetchAdminSubmissions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Approval failed";
      toast.error(msg);
    } finally {
      setSubActionLoading(false);
    }
  };

  const handleRejectSubmissionSubmit = async (submissionId: string, adminFeedback: string) => {
    if (subActionLoading) return;
    setSubActionLoading(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, action: "reject", adminFeedback }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection failed");

      toast.success("Submission marked as rejected.");
      setReviewModal({
        open: false,
        sub: null,
        approvedPrice: 0,
        feedback: "",
        subject: "",
        resourceType: "supplementary_guide",
      });
      fetchAdminSubmissions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Rejection failed";
      toast.error(msg);
    } finally {
      setSubActionLoading(false);
    }
  };

  if (loadingSubmissions) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
        Loading student submissions queue...
      </div>
    );
  }

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Contributor</th>
            <th className={styles.th}>Univ / Branch / Sem</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminSubmissions.length > 0 ? (
            adminSubmissions.map((sub) => (
              <tr key={sub.id} className={styles.tr}>
                <td className={styles.td} style={{ fontWeight: 600 }}>{sub.title}</td>
                <td className={styles.td}>
                  @{sub.user_profile?.username || "student"}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{sub.user_profile?.email}</div>
                </td>
                <td className={styles.td}>
                  {sub.university}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{sub.branch} • {sub.semester}</div>
                </td>
                <td className={styles.td}>₹{sub.suggested_price}</td>
                <td className={styles.td}>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.55rem",
                    borderRadius: "4px",
                    backgroundColor: sub.status === "approved" ? "rgba(34, 197, 94, 0.15)" : sub.status === "rejected" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: sub.status === "approved" ? "#22c55e" : sub.status === "rejected" ? "#ef4444" : "#f59e0b",
                  }}>
                    {sub.status.toUpperCase()}
                  </span>
                </td>
                <td className={styles.td} style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => window.open(sub.file_url, "_blank")}
                      className={styles.btnSecondary}
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                    >
                      View PDF
                    </button>
                    {sub.status === "pending" && (
                      <button
                        onClick={() => setReviewModal({
                          open: true,
                          sub,
                          approvedPrice: sub.suggested_price,
                          feedback: "",
                          subject: sub.subject || "",
                          resourceType: sub.resource_type || "supplementary_guide",
                        })}
                        className={styles.btnCreate}
                        style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                      >
                        Review & Action
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSubmission(sub.id, sub.title)}
                      className={styles.btnSecondary}
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.4)" }}
                      title="Permanently delete submission and purge PDF file"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                No student submissions found in queue.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* SUBMISSION REVIEW MODAL */}
      {reviewModal.open && reviewModal.sub && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setReviewModal({ open: false, sub: null, approvedPrice: 0, feedback: "", subject: "", resourceType: "supplementary_guide" })}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Review Student Note</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setReviewModal({ open: false, sub: null, approvedPrice: 0, feedback: "", subject: "", resourceType: "supplementary_guide" })}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <h4 style={{ margin: "0 0 0.25rem", color: "var(--text-primary)" }}>{reviewModal.sub.title}</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1rem" }}>
                {reviewModal.sub.university} • {reviewModal.sub.branch} • {reviewModal.sub.semester}
              </p>

              {/* Classification & Target Subject Binding */}
              <div style={{
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                borderRadius: "8px",
                padding: "0.85rem",
                marginBottom: "1rem",
                fontSize: "0.825rem",
                color: "var(--text-secondary)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#f59e0b", fontWeight: 700, marginBottom: "0.4rem" }}>
                  <span>🛡️</span> Content Classification & Curriculum Integrity
                </div>
                <div>
                  Student-created resources are partitioned under supplementary materials so they are never misrepresented as official course syllabus notes.
                </div>
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: "1rem" }}>
                <label className={styles.label}>Related Subject / Official Course</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Amazon Web Services (AWS) Certification"
                  value={reviewModal.subject}
                  onChange={(e) => setReviewModal({ ...reviewModal, subject: e.target.value })}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Which syllabus course does this supplement? (Leave blank to use note title)
                </span>
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: "1rem" }}>
                <label className={styles.label}>Material Classification</label>
                <select
                  className={styles.input}
                  value={reviewModal.resourceType}
                  onChange={(e) => setReviewModal({ ...reviewModal, resourceType: e.target.value })}
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                >
                  <option value="supplementary_guide">Supplementary Topic Guide / Practical Reference</option>
                  <option value="chapter_module">Chapter / Unit Notes (Unit 1–2, etc.)</option>
                  <option value="cheatsheet">Quick Revision / Formula Sheet</option>
                  <option value="question_bank">Question Bank & PYQ Solutions</option>
                  <option value="lab_manual">Lab Manual / Practical Code Guide</option>
                  <option value="official_subject">Official Subject Syllabus Note (Full Syllabus)</option>
                </select>
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: "1rem" }}>
                <label className={styles.label}>Approved Price (₹0 - Max ₹99)</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  className={styles.input}
                  value={reviewModal.approvedPrice}
                  onChange={(e) => setReviewModal({ ...reviewModal, approvedPrice: Math.min(99, Math.max(0, Number(e.target.value) || 0)) })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Admin Feedback / Rejection Reason</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Optional notes or feedback for student..."
                  value={reviewModal.feedback}
                  onChange={(e) => setReviewModal({ ...reviewModal, feedback: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.modalFooter} style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleDeleteSubmission(reviewModal.sub!.id, reviewModal.sub!.title)}
                className={styles.btnSecondary}
                style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.4)" }}
              >
                Delete Permanently
              </button>
              <button
                type="button"
                onClick={() => handleRejectSubmissionSubmit(reviewModal.sub!.id, reviewModal.feedback)}
                className={styles.btnDelete}
                style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
              >
                Reject Note
              </button>
              <button
                type="button"
                onClick={() => handleApproveSubmissionSubmit(
                  reviewModal.sub!.id,
                  reviewModal.approvedPrice,
                  reviewModal.feedback,
                  reviewModal.subject,
                  reviewModal.resourceType
                )}
                className={styles.btnSave}
                style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }}
              >
                Approve & Publish Live
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
