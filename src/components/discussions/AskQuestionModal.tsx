"use client";

import { useState, useEffect } from "react";
import { LuX, LuSend } from "react-icons/lu";
import styles from "../../app/discussions/discussions.module.css";
import { useToast } from "@/components/providers/ToastProvider";
import BranchSelect from "@/components/ui/BranchSelect";

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

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-question-title"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            <h2 id="ask-question-title" className={styles.modalTitle}>
              <span>Ask a Question</span>
              <span aria-hidden="true" style={{ fontSize: "16px" }}>💬</span>
            </h2>
            <p className={styles.modalSubtitle}>
              Post a doubt, share code snippets, or start an academic discussion with peers.
            </p>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <LuX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            {/* Title */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <span>Question Title</span>
                <span style={{ color: "#E02424" }}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g., How to solve differential equations in Page 12 of notes?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
              <span className={styles.formHint}>
                Keep it clear and specific so classmates can recognize the topic immediately.
              </span>
            </div>

            {/* Branch & Semester */}
            <div className={styles.formGridTwoCol}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  <span>Branch</span>
                  <span style={{ color: "#E02424" }}>*</span>
                </label>
                <BranchSelect
                  value={branch}
                  onChange={setBranch}
                  variant="light"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  <span>Semester</span>
                  <span style={{ color: "#E02424" }}>*</span>
                </label>
                <select
                  className={styles.formSelect}
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
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

            {/* Content / Details */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <span>Doubt Details & Context</span>
                <span style={{ color: "#E02424" }}>*</span>
              </label>
              <textarea
                className={styles.formTextarea}
                placeholder="Explain what concept, question, or step you need help with. You can include problem statements, what you've tried, or paste code snippets..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
              <span className={styles.formHint}>
                Detailed context yields faster, higher quality answers from peers.
              </span>
            </div>

            {/* Link Note (Optional) */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <span>Link Note from Library</span>
                <span className={styles.formLabelOptional}>Optional</span>
              </label>
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
              <span className={styles.formHint}>
                Associates your question directly with a syllabus resource in your university.
              </span>
            </div>

            {/* Tags */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <span>Tags</span>
                <span className={styles.formLabelOptional}>Optional</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. calculus, assignment, midterms, lab"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              <span className={styles.formHint}>
                Comma-separated keywords to help index your question in search filters.
              </span>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnSecondary}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <LuSend size={14} />
                  <span>Post Discussion</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
