"use client";

import { useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { AdminSubmission } from "@/types/admin";
import { useToast } from "@/components/providers/ToastProvider";
import AdminReviewModalDynamic from "./AdminReviewModalDynamic";

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

      {/* Code-split Review Modal */}
      {reviewModal.open && reviewModal.sub && (
        <AdminReviewModalDynamic
          isOpen={reviewModal.open}
          sub={reviewModal.sub}
          approvedPrice={reviewModal.approvedPrice}
          feedback={reviewModal.feedback}
          subject={reviewModal.subject}
          resourceType={reviewModal.resourceType}
          onClose={() => setReviewModal({ open: false, sub: null, approvedPrice: 0, feedback: "", subject: "", resourceType: "supplementary_guide" })}
          onApprovedPriceChange={(price) => setReviewModal((prev) => ({ ...prev, approvedPrice: price }))}
          onFeedbackChange={(feedback) => setReviewModal((prev) => ({ ...prev, feedback }))}
          onSubjectChange={(subject) => setReviewModal((prev) => ({ ...prev, subject }))}
          onResourceTypeChange={(resourceType) => setReviewModal((prev) => ({ ...prev, resourceType }))}
          onDelete={(id, title) => handleDeleteSubmission(id, title)}
          onReject={(id, feedback) => handleRejectSubmissionSubmit(id, feedback)}
          onApprove={(id, price, feedback, subject, resourceType) => handleApproveSubmissionSubmit(id, price, feedback, subject, resourceType)}
        />
      )}
    </>
  );
}
