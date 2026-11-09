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
            <th className={styles.th}>Submitted Time</th>
            <th className={styles.th}>Title & Classification</th>
            <th className={styles.th}>Contributor</th>
            <th className={styles.th}>University & Branch</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminSubmissions.length > 0 ? (
            adminSubmissions.map((sub) => (
              <tr key={sub.id} className={styles.tr}>
                {/* Submitted Time in Mono */}
                <td className={styles.td}>
                  <span className={styles.tagMono}>
                    {sub.created_at
                      ? new Date(sub.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </td>

                {/* Title & Classification */}
                <td className={styles.td} style={{ maxWidth: "260px" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{sub.title}</div>
                  <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.2rem", flexWrap: "wrap" }}>
                    <span
                      className={styles.badge}
                      style={{
                        fontSize: "0.68rem",
                        backgroundColor:
                          sub.resource_type === "official_subject"
                            ? "#ECFDF5"
                            : "var(--accent-light, #E6EBFF)",
                        color:
                          sub.resource_type === "official_subject" ? "#059669" : "var(--accent, #2447F5)",
                        border:
                          sub.resource_type === "official_subject"
                            ? "1px solid rgba(5, 150, 105, 0.25)"
                            : "1px solid rgba(36, 71, 245, 0.25)",
                      }}
                    >
                      {sub.resource_type === "official_subject" ? "Official Course" : "Supplementary Guide"}
                    </span>
                    {sub.subject && (
                      <span className={styles.tagMono} style={{ fontSize: "0.68rem" }}>
                        {sub.subject}
                      </span>
                    )}
                  </div>
                  {/* Audit Trail Line */}
                  {sub.status !== "pending" && (
                    <div className={styles.auditTrailLine}>
                      <span
                        className={styles.auditBadge}
                        style={{
                          backgroundColor:
                            sub.status === "approved" ? "#ECFDF5" : "#FEF2F2",
                          color: sub.status === "approved" ? "#059669" : "#DC2626",
                        }}
                      >
                        {sub.status}
                      </span>
                      {sub.admin_feedback ? `"${sub.admin_feedback.slice(0, 45)}..."` : "Audit logged"}
                    </div>
                  )}
                </td>

                {/* Contributor */}
                <td className={styles.td}>
                  <span style={{ fontWeight: 600 }}>@{sub.user_profile?.username || "student"}</span>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-secondary)" }}>
                    {sub.user_profile?.email || "No email"}
                  </div>
                </td>

                {/* University & Branch */}
                <td className={styles.td}>
                  <div style={{ fontWeight: 500, fontSize: "0.825rem" }}>
                    {sub.university
                      ? sub.university
                          .replace("University", "Univ.")
                          .replace("Savitribai Phule Pune", "SPPU")
                          .replace("Dr. Babasaheb Ambedkar Technological", "DBATU")
                      : "—"}
                  </div>
                  <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.15rem" }}>
                    <span className={`${styles.badge} ${styles.tagBranch}`} style={{ fontSize: "0.68rem" }}>
                      {sub.branch}
                    </span>
                    <span className={`${styles.badge} ${styles.tagSemester}`} style={{ fontSize: "0.68rem" }}>
                      Sem {sub.semester}
                    </span>
                  </div>
                </td>

                {/* Price in Mono */}
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.tagPrice}`}>
                    ₹{sub.suggested_price}
                  </span>
                </td>

                {/* Status Tag */}
                <td className={styles.td}>
                  <span
                    className={
                      sub.status === "approved"
                        ? styles.tagStatusApproved
                        : sub.status === "rejected"
                        ? styles.tagStatusRejected
                        : styles.tagStatusPending
                    }
                    style={{ fontSize: "0.725rem", padding: "0.2rem 0.5rem", borderRadius: "4px" }}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </td>

                {/* Actions */}
                <td className={styles.td} style={{ textAlign: "right" }}>
                  <div className={styles.actionsCell} style={{ justifyContent: "flex-end" }}>
                    <button
                      onClick={() => window.open(sub.file_url, "_blank")}
                      className={styles.btnSecondary}
                      title="Open source PDF in browser"
                    >
                      PDF ↗
                    </button>
                    {sub.status === "pending" ? (
                      <button
                        onClick={() =>
                          setReviewModal({
                            open: true,
                            sub,
                            approvedPrice: sub.suggested_price,
                            feedback: "",
                            subject: sub.subject || "",
                            resourceType: sub.resource_type || "supplementary_guide",
                          })
                        }
                        className={styles.btnCreate}
                        style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                      >
                        Review Inspector
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setReviewModal({
                            open: true,
                            sub,
                            approvedPrice: sub.suggested_price,
                            feedback: sub.admin_feedback || "",
                            subject: sub.subject || "",
                            resourceType: sub.resource_type || "supplementary_guide",
                          })
                        }
                        className={styles.btnAction}
                        title="Re-inspect past decision"
                      >
                        Inspect
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSubmission(sub.id, sub.title)}
                      className={`${styles.btnAction} ${styles.btnDelete}`}
                      title="Permanently delete submission"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2.5rem" }}>
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
          onClose={() =>
            setReviewModal({
              open: false,
              sub: null,
              approvedPrice: 0,
              feedback: "",
              subject: "",
              resourceType: "supplementary_guide",
            })
          }
          onApprovedPriceChange={(price) => setReviewModal((prev) => ({ ...prev, approvedPrice: price }))}
          onFeedbackChange={(feedback) => setReviewModal((prev) => ({ ...prev, feedback }))}
          onSubjectChange={(subject) => setReviewModal((prev) => ({ ...prev, subject }))}
          onResourceTypeChange={(resourceType) => setReviewModal((prev) => ({ ...prev, resourceType }))}
          onDelete={(id, title) => handleDeleteSubmission(id, title)}
          onReject={(id, feedback) => handleRejectSubmissionSubmit(id, feedback)}
          onApprove={(id, price, feedback, subject, resourceType) =>
            handleApproveSubmissionSubmit(id, price, feedback, subject, resourceType)
          }
        />
      )}
    </>
  );
}
