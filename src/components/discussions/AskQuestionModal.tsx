"use client";

import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import styles from "../../app/discussions/discussions.module.css";
import { useToast } from "@/components/providers/ToastProvider";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBranch?: string, newSemester?: string) => void;
  userUniversity: string;
  defaultBranch?: string;
  defaultSemester?: string;
}

export default function AskQuestionModal({
  isOpen,
  onClose,
  onSuccess,
  userUniversity,
  defaultBranch = "Computer Engineering",
  defaultSemester = "Semester 1",
}: AskQuestionModalProps) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [branch, setBranch] = useState(defaultBranch);
  const [semester, setSemester] = useState(defaultSemester);
  const [tagsInput, setTagsInput] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available notes for dropdown
  const [availableNotes, setAvailableNotes] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (isOpen && userUniversity) {
      fetch(`/api/notes?university=${encodeURIComponent(userUniversity)}&limit=100`)
        .then((res) => res.json())
        .then((data) => {
          if (data.notes) {
            setAvailableNotes(data.notes.map((n: { id: string; title: string }) => ({ id: n.id, title: n.title })));
          }
        })
        .catch((err) => console.error("Error loading notes dropdown:", err));
    }
  }, [isOpen, userUniversity]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a question title.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please provide description/details for your doubt.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          university: userUniversity,
          branch,
          semester,
          tags: formattedTags,
          note_id: selectedNoteId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to post question.");
        return;
      }

      toast.success("Question posted successfully!");
      setTitle("");
      setContent("");
      setTagsInput("");
      setSelectedNoteId("");
      onSuccess(branch, semester);
      onClose();
    } catch (err) {
      console.error("Ask question error:", err);
      toast.error("An error occurred while posting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Ask a Doubt / Start Discussion 💬</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <FaXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Question Title *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g., How to solve Page 12 Differential Equation in Data Structures?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGridTwoCol}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Branch *</label>
              <select className={styles.formSelect} value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AIML">AIML</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Semester *</label>
              <select className={styles.formSelect} value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Doubt Details & Context (Text / Code) *</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Explain what concept or question you are stuck on. You can paste code snippets or math formulas..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Link a Note from Library (Optional)</label>
            <select
              className={styles.formSelect}
              value={selectedNoteId}
              onChange={(e) => setSelectedNoteId(e.target.value)}
            >
              <option value="">-- No Note Linked --</option>
              {availableNotes.map((n) => (
                <option key={n.id} value={n.id}>
                  📄 {n.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tags (Comma separated, optional)</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. pyq, exam, math, lab"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.65rem 1.25rem",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                color: "#94a3b8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Discussion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
