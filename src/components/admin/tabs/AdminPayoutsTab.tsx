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
            <th className={styles.th}>Contributor</th>
            <th className={styles.th}>UPI ID</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>UTR Reference</th>
            <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminPayouts.length > 0 ? (
            adminPayouts.map((p) => (
              <tr key={p.id} className={styles.tr}>
                <td className={styles.td} style={{ fontWeight: 600 }}>
                  @{p.user_profile?.username || "student"}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{p.user_profile?.email}</div>
                </td>
                <td className={styles.td} style={{ fontWeight: 600, color: "var(--accent)" }}>{p.upi_id}</td>
                <td className={styles.td} style={{ fontWeight: 700, color: "#22c55e" }}>₹{p.amount}</td>
                <td className={styles.td}>
                  {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className={styles.td}>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.55rem",
                    borderRadius: "4px",
                    backgroundColor: p.status === "completed" ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: p.status === "completed" ? "#22c55e" : "#f59e0b",
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td className={styles.td} style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>
                  {p.utr_reference || "N/A"}
                </td>
                <td className={styles.td} style={{ textAlign: "right" }}>
                  {p.status === "pending" && (
                    <button
                      onClick={() => setPayoutModal({ open: true, payout: p, utr: "", notes: "" })}
                      className={styles.btnCreate}
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                No payout requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAYOUT MARK PAID MODAL */}
      {payoutModal.open && payoutModal.payout && (
        <div className={styles.modalBackdrop} onClick={() => setPayoutModal({ open: false, payout: null, utr: "", notes: "" })}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Complete UPI Payout</h3>
              <button className={styles.modalCloseBtn} onClick={() => setPayoutModal({ open: false, payout: null, utr: "", notes: "" })}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Transfer <strong>₹{payoutModal.payout.amount}</strong> to UPI ID: <strong style={{ color: "var(--accent)" }}>{payoutModal.payout.upi_id}</strong>
              </p>

              <div className={styles.inputGroup} style={{ marginTop: "1rem" }}>
                <label className={styles.label}>Bank UTR Reference Number <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="e.g. UTR1234567890"
                  className={styles.input}
                  required
                  value={payoutModal.utr}
                  onChange={(e) => setPayoutModal({ ...payoutModal, utr: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup} style={{ marginTop: "1rem" }}>
                <label className={styles.label}>Admin Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Payment notes..."
                  className={styles.input}
                  value={payoutModal.notes}
                  onChange={(e) => setPayoutModal({ ...payoutModal, notes: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.modalFooter} style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setPayoutModal({ open: false, payout: null, utr: "", notes: "" })}
                className={styles.btnCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCompletePayoutSubmit(payoutModal.payout!.id, payoutModal.utr, payoutModal.notes)}
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
