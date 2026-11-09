"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { BRANCHES, SEMESTERS } from "@/data/mockData";
import { UNIVERSITIES } from "@/utils/constants";
import BranchSelect from "@/components/ui/BranchSelect";
import styles from "./ContributeModal.module.css";
import {
  LuCloudUpload,
  LuFileText,
  LuX,
  LuCheck,
  LuSparkles,
  LuShieldCheck,
  LuIndianRupee,
} from "react-icons/lu";

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultUniversity?: string;
  defaultBranch?: string;
}

export default function ContributeModal({
  isOpen,
  onClose,
  onSuccess,
  defaultUniversity = "",
  defaultBranch = "",
}: ContributeModalProps) {
  const toast = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [resourceType, setResourceType] = useState("supplementary_guide");
  const [isSupplementaryConfirmed, setIsSupplementaryConfirmed] = useState(true);
  const [university, setUniversity] = useState<string>(defaultUniversity || UNIVERSITIES[0].value);
  const [branch, setBranch] = useState<string>(defaultBranch || BRANCHES[0]);
  const [semester, setSemester] = useState<string>(SEMESTERS[0]);
  const [price, setPrice] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateFile = (selectedFile: File): boolean => {
    // 1. Check PDF Extension & MIME type
    if (
      !selectedFile.name.toLowerCase().endsWith(".pdf") &&
      selectedFile.type !== "application/pdf"
    ) {
      toast.error("Invalid file format. Only PDF files are allowed.");
      return false;
    }

    // 2. Check File Size (Max 5 MB)
    const MAX_SIZE_MB = 5;
    const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (selectedFile.size > MAX_BYTES) {
      toast.error(
        `File is too large (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      } else {
        e.target.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Please upload a PDF study note file.");
      return;
    }

    if (!title.trim()) {
      toast.warning("Please enter a note title.");
      return;
    }

    // Enforce price range 0 to 99
    if (price < 0 || price > 99) {
      toast.error("Price must be between ₹0 (Free) and maximum ₹99.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("subject", subject.trim());
      formData.append("resourceType", resourceType);
      formData.append("university", university);
      formData.append("branch", branch);
      formData.append("semester", semester);
      formData.append("suggestedPrice", price.toString());

      const res = await fetch("/api/contribute", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit study note.");
      }

      toast.success("Study note submitted successfully! Pending admin verification.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const authorNetEarnings = price === 0 ? 0 : Math.round(price * 0.8);

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribute-modal-title"
    >
      <div
        className={styles.modalSheet}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (§3.6) */}
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.headerEyebrow}>
              <LuSparkles size={13} aria-hidden="true" />
              <span>THE SUPPLY ENGINE // NOTE SUBMISSION</span>
            </div>
            <h2 id="contribute-modal-title" className={styles.modalTitle}>
              Upload Study Notes
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close modal"
          >
            <LuX size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* File Dropzone */}
          <div className={styles.formGroup}>
            <div className={styles.dropzoneLabel}>
              <label className={styles.specLabel}>
                PDF Document File <span className={styles.reqStar}>*</span>
              </label>
              <span className={styles.optionalTag}>MAX 5 MB • PDF ONLY</span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""}`}
              onClick={() => document.getElementById("pdf-file-input")?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  document.getElementById("pdf-file-input")?.click();
                }
              }}
            >
              <input
                type="file"
                id="pdf-file-input"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {file ? (
                <div className={styles.fileReadyCard}>
                  <div className={styles.fileIconBox}>
                    <LuFileText size={20} />
                  </div>
                  <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
                    <div className={styles.fileName}>{file.name}</div>
                    <div className={styles.fileMeta}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR DISPATCH
                    </div>
                  </div>
                  <div className={styles.readyBadge}>
                    <LuCheck size={12} /> Ready
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.dropzoneIconBox}>
                    <LuCloudUpload size={24} />
                  </div>
                  <div className={styles.dropzonePrompt}>
                    Drag &amp; drop your PDF study guide here
                  </div>
                  <div className={styles.dropzoneHint}>
                    or click to browse local files (Strictly .pdf under 5 MB)
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Note Title */}
          <div className={styles.formGroup}>
            <label htmlFor="note-title-input" className={styles.fieldLabel}>
              <span>Note Title <span className={styles.reqStar}>*</span></span>
            </label>
            <input
              id="note-title-input"
              type="text"
              placeholder="e.g. Distributed Computing Systems: Unit 1–3 Complete Derivations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.textInput}
            />
          </div>

          {/* Subject & Material Classification */}
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label htmlFor="contribute-subject-input" className={styles.fieldLabel}>
                <span>Related Subject</span>
                <span className={styles.optionalTag}>(Optional)</span>
              </label>
              <input
                id="contribute-subject-input"
                type="text"
                placeholder="e.g. Computer Networks (CN)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.textInput}
              />
              <span className={styles.inputHelper}>
                Curriculum subject or course code
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contribute-resource-type" className={styles.fieldLabel}>
                <span>Classification</span>
              </label>
              <select
                id="contribute-resource-type"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className={styles.selectInput}
              >
                <option value="supplementary_guide">Supplementary Topic Guide / Practical Reference</option>
                <option value="chapter_module">Chapter / Unit Notes (Unit 1–2, etc.)</option>
                <option value="cheatsheet">Quick Revision / Formula Sheet</option>
                <option value="question_bank">Question Bank &amp; PYQ Solutions</option>
                <option value="lab_manual">Lab Manual / Practical Code Guide</option>
              </select>
              <span className={styles.inputHelper}>
                Defines display taxonomy for students
              </span>
            </div>
          </div>

          {/* University & Branch */}
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label htmlFor="contribute-univ-select" className={styles.fieldLabel}>
                <span>University</span>
              </label>
              <select
                id="contribute-univ-select"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className={styles.selectInput}
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.value} ({u.abbr})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contribute-branch-select" className={styles.fieldLabel}>
                <span>Engineering Branch</span>
              </label>
              <BranchSelect
                id="contribute-branch-select"
                value={branch}
                onChange={setBranch}
                variant="light"
                required
              />
            </div>
          </div>

          {/* Semester & Price */}
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label htmlFor="contribute-sem-select" className={styles.fieldLabel}>
                <span>Semester</span>
              </label>
              <select
                id="contribute-sem-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className={styles.selectInput}
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contribute-price-input" className={styles.fieldLabel}>
                <span>Unlock Price (₹0–₹99)</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  id="contribute-price-input"
                  type="number"
                  min="0"
                  max="99"
                  value={price}
                  onChange={(e) => setPrice(Math.min(99, Math.max(0, Number(e.target.value) || 0)))}
                  className={styles.textInput}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Revenue Share Ledger Box */}
          <div className={styles.revenueBox}>
            <div className={styles.revenueText}>
              <strong>Author Payout Ledger:</strong> You keep up to <strong>80%–90%</strong> net revenue directly to your UPI ID upon approval.
            </div>
            <div className={`${styles.revenueBadge} ${price === 0 ? styles.revenueBadgeFree : ""}`}>
              {price === 0 ? "FREE COMMUNITY NOTE" : `₹${authorNetEarnings} NET PAYOUT / UNLOCK`}
            </div>
          </div>

          {/* Supplementary Disclaimer Checkbox */}
          <label className={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={isSupplementaryConfirmed}
              onChange={(e) => setIsSupplementaryConfirmed(e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxText}>
              I confirm this is a <strong>self-prepared supplementary study resource</strong> authored to assist engineering students, and does not misrepresent itself as an official university publication.
            </span>
          </label>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>Transmitting Note...</>
              ) : (
                <>
                  <LuCloudUpload size={16} /> Submit for Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
