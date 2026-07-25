"use client";

import { useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { BRANCHES, SEMESTERS } from "@/data/mockData";
import { UNIVERSITIES } from "@/utils/constants";
import { FaCloudArrowUp, FaFilePdf, FaXmark, FaCheck } from "react-icons/fa6";

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
  const [university, setUniversity] = useState<string>(defaultUniversity || UNIVERSITIES[0].value);
  const [branch, setBranch] = useState<string>(defaultBranch || BRANCHES[0]);
  const [semester, setSemester] = useState<string>(SEMESTERS[0]);
  const [price, setPrice] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

      toast.success("Study note submitted successfully! Pending admin approval.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-secondary, #121216)",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.12))",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "1.75rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          color: "var(--text-primary, #f9fafb)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Contribute Study Note</h2>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary, #9ca3af)", margin: "0.25rem 0 0" }}>
              Share your high-quality PDF notes & earn 80%+ revenue!
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary, #9ca3af)",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            <FaXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* File Dropzone */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              PDF Document <span style={{ color: "#ef4444" }}>*</span> (PDF only, Max 5MB)
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              style={{
                border: dragActive ? "2px dashed var(--accent, #f59e0b)" : "2px dashed var(--border, rgba(255, 255, 255, 0.15))",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "center",
                backgroundColor: dragActive ? "rgba(245, 158, 11, 0.05)" : "rgba(255, 255, 255, 0.02)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => document.getElementById("pdf-file-input")?.click()}
            >
              <input
                type="file"
                id="pdf-file-input"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {file ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", color: "#22c55e" }}>
                  <FaFilePdf style={{ fontSize: "1.8rem" }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{file.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </div>
                  </div>
                  <FaCheck style={{ marginLeft: "auto" }} />
                </div>
              ) : (
                <div>
                  <FaCloudArrowUp style={{ fontSize: "2.2rem", color: "var(--accent, #f59e0b)", marginBottom: "0.5rem" }} />
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Drag & drop your PDF file here</div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    or click to browse files (Strictly PDF under 5 MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Note Title */}
          <div>
            <label htmlFor="note-title-input" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
              Note Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="note-title-input"
              type="text"
              placeholder="e.g. Data Structures & Algorithms Revision Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid var(--border, rgba(255, 255, 255, 0.15))",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* University & Branch */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="contribute-univ-select" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                University
              </label>
              <select
                id="contribute-univ-select"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border, rgba(255, 255, 255, 0.15))",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                }}
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.value} value={u.value}>{u.value}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contribute-branch-select" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                Branch
              </label>
              <select
                id="contribute-branch-select"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border, rgba(255, 255, 255, 0.15))",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                }}
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester & Price */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="contribute-sem-select" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                Semester
              </label>
              <select
                id="contribute-sem-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border, rgba(255, 255, 255, 0.15))",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                }}
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contribute-price-input" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                Price (₹0 - Max ₹99)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  id="contribute-price-input"
                  type="number"
                  min="0"
                  max="99"
                  value={price}
                  onChange={(e) => setPrice(Math.min(99, Math.max(0, Number(e.target.value) || 0)))}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border, rgba(255, 255, 255, 0.15))",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: price === 0 ? "#22c55e" : "var(--accent)", fontWeight: 700, minWidth: "45px" }}>
                  {price === 0 ? "FREE" : `₹${price}`}
                </span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>
            💡 You will earn <strong>80% of net sales</strong> directly to your saved UPI ID upon admin approval.
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "8px",
                border: "1px solid var(--border, rgba(255, 255, 255, 0.15))",
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.65rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--accent, #f59e0b)",
                color: "#000",
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? "Submitting..." : "Submit Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
