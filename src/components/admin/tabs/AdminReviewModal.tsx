"use client";

import styles from "@/app/admin/admin.module.css";
import { AdminSubmission } from "@/types/admin";

interface AdminReviewModalProps {
  isOpen: boolean;
  sub: AdminSubmission | null;
  approvedPrice: number;
  feedback: string;
  subject: string;
  resourceType: string;
  onClose: () => void;
  onApprovedPriceChange: (price: number) => void;
  onFeedbackChange: (feedback: string) => void;
  onSubjectChange: (subject: string) => void;
  onResourceTypeChange: (type: string) => void;
  onDelete: (id: string, title: string) => void;
  onReject: (id: string, feedback: string) => void;
  onApprove: (id: string, price: number, feedback: string, subject?: string, resourceType?: string) => void;
}

export default function AdminReviewModal({
  isOpen,
  sub,
  approvedPrice,
  feedback,
  subject,
  resourceType,
  onClose,
  onApprovedPriceChange,
  onFeedbackChange,
  onSubjectChange,
  onResourceTypeChange,
  onDelete,
  onReject,
  onApprove,
}: AdminReviewModalProps) {
  if (!isOpen || !sub) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px" }}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Review Student Note</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <h4 style={{ margin: "0 0 0.25rem", color: "var(--text-primary)" }}>{sub.title}</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1rem" }}>
            {sub.university} • {sub.branch} • {sub.semester}
          </p>

          {/* Classification & Target Subject Binding */}
          <div
            style={{
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "8px",
              padding: "0.85rem",
              marginBottom: "1rem",
              fontSize: "0.825rem",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#f59e0b",
                fontWeight: 700,
                marginBottom: "0.4rem",
              }}
            >
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
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Which syllabus course does this supplement? (Leave blank to use note title)
            </span>
          </div>

          <div className={styles.inputGroup} style={{ marginBottom: "1rem" }}>
            <label className={styles.label}>Material Classification</label>
            <select
              className={styles.input}
              value={resourceType}
              onChange={(e) => onResourceTypeChange(e.target.value)}
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
              value={approvedPrice}
              onChange={(e) => onApprovedPriceChange(Math.min(99, Math.max(0, Number(e.target.value) || 0)))}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Feedback / Rejection Reason</label>
            <textarea
              className={styles.textarea}
              placeholder="Optional notes or feedback for student..."
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.modalFooter} style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onDelete(sub.id, sub.title)}
            className={styles.btnSecondary}
            style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.4)" }}
          >
            Delete Permanently
          </button>
          <button
            type="button"
            onClick={() => onReject(sub.id, feedback)}
            className={styles.btnDelete}
            style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
          >
            Reject Note
          </button>
          <button
            type="button"
            onClick={() => onApprove(sub.id, approvedPrice, feedback, subject, resourceType)}
            className={styles.btnSave}
            style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }}
          >
            Approve & Publish Live
          </button>
        </div>
      </div>
    </div>
  );
}
