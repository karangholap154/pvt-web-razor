"use client";

import { useState } from "react";
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

const TEMPLATE_REASONS = [
  { label: "-- Select a templated response --", value: "" },
  { label: "High scan clarity & verified curriculum (Approved)", value: "Approved: Content verified for syllabus alignment and scan legibility." },
  { label: "Blurry / unreadable scan quality (Reject)", value: "Rejected: Scan is illegible or has low contrast. Please re-scan clearly and resubmit." },
  { label: "Does not follow university syllabus (Reject)", value: "Rejected: Content does not align with current university syllabus requirements." },
  { label: "Copyrighted publisher or textbook scan (Reject)", value: "Rejected: Infringes copyright policy (contains copyrighted publisher pages or unauthorized reprints)." },
  { label: "Incomplete document / missing key units (Reject)", value: "Rejected: Notes are incomplete or missing major chapters/units." },
  { label: "Duplicate resource exists in catalog (Reject)", value: "Rejected: Similar comprehensive note already exists for this subject." },
];

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
  const [checklist, setChecklist] = useState({
    legible: true,
    syllabusMatch: true,
    noCopyright: true,
    scanQuality: true,
  });

  if (!isOpen || !sub) return null;

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      onFeedbackChange(val);
    }
  };

  const handleRejectClick = () => {
    if (!feedback.trim()) {
      alert("Please provide a rejection reason or select a templated reason before rejecting.");
      return;
    }
    onReject(sub.id, feedback);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.splitModalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className={styles.systemBadge}>SUBMISSION REVIEW INSPECTOR</span>
            <h3 className={styles.modalTitle} style={{ fontSize: "1.05rem" }}>
              {sub.title}
            </h3>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close review inspector">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Split Body: PDF Viewer Left, Verification Right */}
        <div className={styles.splitModalBody}>
          {/* Left Pane: PDF Viewer */}
          <div className={styles.pdfViewerPane}>
            <div className={styles.pdfToolbar}>
              <span>DOCUMENT SOURCE PREVIEW</span>
              <a
                href={sub.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--accent, #f59e0b)",
                  textDecoration: "none",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                Open in external window ↗
              </a>
            </div>
            <iframe
              src={sub.file_url}
              className={styles.pdfIframe}
              title={`Preview: ${sub.title}`}
            />
          </div>

          {/* Right Pane: Inspector & Verification Console */}
          <div className={styles.inspectorPane}>
            {/* Meta Summary Card */}
            <div className={styles.metaCard}>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaItemLabel}>Contributor</span>
                  <span className={styles.metaItemVal}>@{sub.user_profile?.username || "student"}</span>
                  <span style={{ fontSize: "0.725rem", color: "var(--text-secondary)" }}>
                    {sub.user_profile?.email || "No email available"}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaItemLabel}>Submitted Date</span>
                  <span className={styles.metaItemVal}>
                    {sub.created_at
                      ? new Date(sub.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaItemLabel}>University</span>
                  <span className={styles.metaItemVal}>{sub.university || "—"}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaItemLabel}>Branch & Semester</span>
                  <span className={styles.metaItemVal}>
                    {sub.branch} • Sem {sub.semester}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaItemLabel}>Contributor Price</span>
                  <span className={styles.metaItemVal} style={{ color: "#22c55e", fontWeight: 700 }}>
                    ₹{sub.suggested_price}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaItemLabel}>Status</span>
                  <span
                    className={
                      sub.status === "approved"
                        ? styles.tagStatusApproved
                        : sub.status === "rejected"
                        ? styles.tagStatusRejected
                        : styles.tagStatusPending
                    }
                    style={{ padding: "0.1rem 0.4rem", borderRadius: "3px", width: "fit-content" }}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Verification Checklist per DESIGN.md §4.16 */}
            <div className={styles.checklistSection}>
              <div className={styles.checklistTitle}>
                <span>✓</span> Verification & Quality Checklist
              </div>
              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={checklist.legible}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, legible: e.target.checked }))}
                />
                <span>Content is clear, legible & readable</span>
              </label>
              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={checklist.syllabusMatch}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, syllabusMatch: e.target.checked }))}
                />
                <span>Matches university syllabus & curriculum topics</span>
              </label>
              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={checklist.noCopyright}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, noCopyright: e.target.checked }))}
                />
                <span>No copyrighted publisher scans or pirated materials</span>
              </label>
              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={checklist.scanQuality}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, scanQuality: e.target.checked }))}
                />
                <span>High scan clarity, contrast & complete pages</span>
              </label>
            </div>

            {/* Classification & Subject Binding */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Related Subject / Official Course</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Database Management Systems (DBMS)"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
              />
              <span style={{ fontSize: "0.725rem", color: "var(--text-secondary)" }}>
                Which syllabus course does this supplement? (Leave blank to use note title)
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Material Classification</label>
              <select
                className={styles.select}
                value={resourceType}
                onChange={(e) => onResourceTypeChange(e.target.value)}
              >
                <option value="supplementary_guide">Supplementary Topic Guide / Practical Reference</option>
                <option value="chapter_module">Chapter / Unit Notes (Unit 1–2, etc.)</option>
                <option value="cheatsheet">Quick Revision / Formula Sheet</option>
                <option value="question_bank">Question Bank & PYQ Solutions</option>
                <option value="lab_manual">Lab Manual / Practical Code Guide</option>
                <option value="official_subject">Official Subject Syllabus Note (Full Syllabus)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
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

            {/* Templated Reasons Preset */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Templated Reason Preset</label>
              <select className={styles.select} onChange={handleTemplateSelect} defaultValue="">
                {TEMPLATE_REASONS.map((t, idx) => (
                  <option key={idx} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Admin Feedback / Rejection Reason</label>
              <textarea
                className={styles.textarea}
                placeholder="Detailed feedback or rejection reason for student contributor..."
                value={feedback}
                onChange={(e) => onFeedbackChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={() => onDelete(sub.id, sub.title)}
            className={styles.btnSecondary}
            style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.35)", marginRight: "auto" }}
          >
            Delete Permanently
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.btnCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRejectClick}
            className={styles.btnDelete}
            style={{ padding: "0.5rem 1.15rem", fontWeight: 700 }}
          >
            Reject Note
          </button>
          <button
            type="button"
            onClick={() => onApprove(sub.id, approvedPrice, feedback, subject, resourceType)}
            className={styles.btnSave}
            disabled={!checklist.noCopyright}
            title={!checklist.noCopyright ? "Cannot approve copyrighted materials" : "Approve and publish"}
          >
            Approve & Publish Live
          </button>
        </div>
      </div>
    </div>
  );
}
