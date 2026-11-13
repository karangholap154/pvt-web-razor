"use client";

import { useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { AdminPayoutRequest } from "@/types/admin";
import { useToast } from "@/components/providers/ToastProvider";

interface AdminPayoutsTabProps {
  adminPayouts: AdminPayoutRequest[];
  loadingPayouts: boolean;
  fetchAdminPayouts: () => Promise<void>;
}

export default function AdminPayoutsTab({
  adminPayouts,
  loadingPayouts,
  fetchAdminPayouts,
}: AdminPayoutsTabProps) {
  const toast = useToast();
  const [payoutModal, setPayoutModal] = useState<{
    open: boolean;
    payout: AdminPayoutRequest | null;
    utr: string;
    notes: string;
  }>({
    open: false,
    payout: null,
    utr: "",
    notes: "",
  });

  const handleCopyUTR = (utr: string) => {
    navigator.clipboard.writeText(utr);
    toast.success("UTR Reference copied to clipboard!");
  };

  const handleCompletePayoutSubmit = async (requestId: string, utrReference: string, adminNotes: string) => {
    if (!utrReference.trim()) {
      toast.error("UTR Transaction reference is required to mark payout as completed.");
      return;
    }

    try {
      const res = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "complete", utrReference: utrReference.trim(), adminNotes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to complete payout");

      toast.success("Payout marked as completed!");
      setPayoutModal({ open: false, payout: null, utr: "", notes: "" });
      fetchAdminPayouts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update payout";
      toast.error(msg);
    }
  };

  if (loadingPayouts) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
        Loading payout requests...
      </div>
    );
  }

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Contributor</th>
            <th className={styles.th}>UPI ID</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>UTR Reference</th>
            <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminPayouts.length > 0 ? (
            adminPayouts.map((p) => (
              <tr key={p.id} className={styles.tr}>
                {/* Date */}
                <td className={styles.td}>
                  <span className={styles.tagMono}>
                    {new Date(p.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                </td>

                {/* Contributor */}
                <td className={styles.td}>
                  <div style={{ fontWeight: 600 }}>@{p.user_profile?.username || "student"}</div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-secondary)" }}>
                    {p.user_profile?.email || "No email"}
                  </div>
                </td>

                {/* UPI ID */}
                <td className={styles.td}>
                  <span className={styles.tagMono} style={{ color: "var(--accent, #f59e0b)", fontWeight: 600 }}>
                    {p.upi_id}
                  </span>
                </td>

                {/* Amount */}
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.tagPrice}`} style={{ fontSize: "0.85rem" }}>
                    ₹{p.amount}
                  </span>
                </td>

                {/* Status */}
                <td className={styles.td}>
                  <span
                    className={
                      p.status === "completed"
                        ? styles.tagStatusCompleted
                        : p.status === "rejected"
                        ? styles.tagStatusRejected
                        : styles.tagStatusPending
                    }
                    style={{ fontSize: "0.725rem", padding: "0.2rem 0.5rem", borderRadius: "4px" }}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </td>

                {/* UTR Reference with Copy Button */}
                <td className={styles.td}>
                  {p.utr_reference ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span className={styles.tagMono} style={{ fontSize: "0.75rem" }}>
                        {p.utr_reference}
                      </span>
                      <button
                        onClick={() => handleCopyUTR(p.utr_reference!)}
                        className={styles.btnAction}
                        style={{ padding: "0.15rem 0.35rem", fontSize: "0.68rem" }}
                        title="Copy UTR Reference"
                      >
                        Copy
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.775rem" }}>Awaiting UTR</span>
                  )}
                  {p.admin_notes && (
                    <div className={styles.auditTrailLine}>
                      <span>Note: {p.admin_notes}</span>
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className={styles.td} style={{ textAlign: "right" }}>
                  {p.status === "pending" ? (
                    <button
                      onClick={() => setPayoutModal({ open: true, payout: p, utr: "", notes: "" })}
                      className={styles.btnCreate}
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Settled</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2.5rem" }}>
                No payout requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAYOUT MARK PAID MODAL */}
      {payoutModal.open && payoutModal.payout && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setPayoutModal({ open: false, payout: null, utr: "", notes: "" })}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Complete UPI Payout</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setPayoutModal({ open: false, payout: null, utr: "", notes: "" })}
                aria-label="Close payout modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  padding: "0.85rem",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Payout Recipient:</div>
                <div style={{ fontWeight: 600 }}>@{payoutModal.payout.user_profile?.username || "student"}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span>UPI ID:</span>
                  <strong style={{ color: "var(--accent, #f59e0b)", fontFamily: "var(--font-mono, monospace)" }}>
                    {payoutModal.payout.upi_id}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                  <span>Amount to Disburse:</span>
                  <strong style={{ color: "#22c55e", fontFamily: "var(--font-mono, monospace)" }}>
                    ₹{payoutModal.payout.amount}
                  </strong>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Bank UTR Reference Number <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 429810842918"
                  className={styles.input}
                  required
                  value={payoutModal.utr}
                  onChange={(e) => setPayoutModal({ ...payoutModal, utr: e.target.value })}
                />
                <span style={{ fontSize: "0.725rem", color: "var(--text-secondary)" }}>
                  Mandatory transaction reference ID provided by your UPI or banking app.
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Admin Audit Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Disbursed via ICICI Business UPI"
                  className={styles.input}
                  value={payoutModal.notes}
                  onChange={(e) => setPayoutModal({ ...payoutModal, notes: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setPayoutModal({ open: false, payout: null, utr: "", notes: "" })}
                className={styles.btnCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleCompletePayoutSubmit(payoutModal.payout!.id, payoutModal.utr, payoutModal.notes)
                }
                className={styles.btnSave}
              >
                Confirm Payout Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
