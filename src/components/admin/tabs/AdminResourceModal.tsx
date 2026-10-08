"use client";

import styles from "@/app/admin/admin.module.css";
import BranchSelect from "@/components/ui/BranchSelect";
import { SEMESTERS } from "@/data/mockData";

interface AdminResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "notes" | "articles" | "projects";
  modalAction: "create" | "edit";
  loading: boolean;
  formError: string | null;
  handleFormSubmit: (e: React.FormEvent) => Promise<void>;

  // Note form state
  noteTitle: string;
  setNoteTitle: (val: string) => void;
  noteSubject: string;
  setNoteSubject: (val: string) => void;
  noteResourceType: string;
  setNoteResourceType: (val: string) => void;
  noteUniversity: string;
  setNoteUniversity: (val: string) => void;
  noteBranch: string;
  setNoteBranch: (val: string) => void;
  noteSemester: string;
  setNoteSemester: (val: string) => void;
  notePrice: string;
  setNotePrice: (val: string) => void;
  noteVideo: string;
  setNoteVideo: (val: string) => void;
  noteDownload: string;
  uploading: boolean;
  uploadSuccess: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

  // Article form state
  articleTitle: string;
  setArticleTitle: (val: string) => void;
  articleCategory: string;
  setArticleCategory: (val: string) => void;
  articleContent: string;
  setArticleContent: (val: string) => void;

  // Project form state
  projectTitle: string;
  setProjectTitle: (val: string) => void;
  projectBranch: string;
  setProjectBranch: (val: string) => void;
  projectGithub: string;
  setProjectGithub: (val: string) => void;
  projectTechStack: string;
  setProjectTechStack: (val: string) => void;
  projectDesc: string;
  setProjectDesc: (val: string) => void;
}

export default function AdminResourceModal({
  isOpen,
  onClose,
  activeTab,
  modalAction,
  loading,
  formError,
  handleFormSubmit,
  noteTitle,
  setNoteTitle,
  noteSubject,
  setNoteSubject,
  noteResourceType,
  setNoteResourceType,
  noteUniversity,
  setNoteUniversity,
  noteBranch,
  setNoteBranch,
  noteSemester,
  setNoteSemester,
  notePrice,
  setNotePrice,
  noteVideo,
  setNoteVideo,
  noteDownload,
  uploading,
  uploadSuccess,
  handleFileUpload,
  articleTitle,
  setArticleTitle,
  articleCategory,
  setArticleCategory,
  articleContent,
  setArticleContent,
  projectTitle,
  setProjectTitle,
  projectBranch,
  setProjectBranch,
  projectGithub,
  setProjectGithub,
  projectTechStack,
  setProjectTechStack,
  projectDesc,
  setProjectDesc,
}: AdminResourceModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {modalAction === "create" ? "Create New" : "Edit"} {activeTab === "notes" ? "Note" : activeTab === "articles" ? "Article" : "Project"}
          </h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className={styles.modalBody}>
            {formError && (
              <div
                className={styles.errorAlert}
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                {formError}
              </div>
            )}

            {/* NOTES FORM FIELDS */}
            {activeTab === "notes" && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    required
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Compiler Construction"
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Related Subject / Official Course</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={noteSubject}
                      onChange={(e) => setNoteSubject(e.target.value)}
                      placeholder="e.g. Amazon Web Services (AWS) Certification"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Material Classification</label>
                    <select
                      className={styles.select}
                      value={noteResourceType}
                      onChange={(e) => setNoteResourceType(e.target.value)}
                    >
                      <option value="official_subject">Official Subject Syllabus Note (Full Syllabus)</option>
                      <option value="supplementary_guide">Supplementary Topic Guide / Practical Reference</option>
                      <option value="chapter_module">Chapter / Unit Notes (Unit 1–2, etc.)</option>
                      <option value="cheatsheet">Quick Revision / Formula Sheet</option>
                      <option value="question_bank">Question Bank & PYQ Solutions</option>
                      <option value="lab_manual">Lab Manual / Practical Code Guide</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>University</label>
                  <select
                    className={styles.select}
                    value={noteUniversity}
                    onChange={(e) => setNoteUniversity(e.target.value)}
                  >
                    <option value="Mumbai University">Mumbai University</option>
                    <option value="Savitribai Phule Pune University">Savitribai Phule Pune University (SPPU)</option>
                    <option value="Nagpur University">Nagpur University</option>
                    <option value="Amravati University">Amravati University</option>
                    <option value="Dr. Babasaheb Ambedkar Technological University">Dr. Babasaheb Ambedkar Technological University (DBATU)</option>
                    <option value="Shivaji University">Shivaji University (SUK)</option>
                  </select>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Branch</label>
                    <BranchSelect value={noteBranch} onChange={setNoteBranch} required />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Semester</label>
                    <select
                      className={styles.select}
                      value={noteSemester}
                      onChange={(e) => setNoteSemester(e.target.value)}
                    >
                      {SEMESTERS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Price (INR)</label>
                    <input
                      type="number"
                      className={styles.input}
                      min="0"
                      required
                      value={notePrice}
                      onChange={(e) => setNotePrice(e.target.value)}
                      placeholder="0 for Free"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Video Embed URL</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={noteVideo}
                      onChange={(e) => setNoteVideo(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/embed/..."
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Note PDF Document</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      type="file"
                      accept=".pdf"
                      id="pdf-upload-file-input"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <label
                        htmlFor="pdf-upload-file-input"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          color: "var(--text-primary)",
                          padding: "0.6rem 1.25rem",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "var(--transition)",
                          display: "inline-block",
                        }}
                      >
                        {uploading ? "Uploading..." : "Select PDF File"}
                      </label>
                      {noteDownload && (
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "300px",
                          }}
                        >
                          <a
                            href={noteDownload}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "var(--accent)", textDecoration: "underline" }}
                          >
                            View PDF
                          </a>
                        </span>
                      )}
                    </div>
                    {uploadSuccess && (
                      <span style={{ fontSize: "0.8rem", color: "#4ade80" }}>✓ PDF Uploaded successfully!</span>
                    )}
                    {uploading && (
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <div className={styles.spinner} style={{ width: "14px", height: "14px" }}></div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Uploading to Supabase Storage...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ARTICLES FORM FIELDS */}
            {activeTab === "articles" && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    required
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="e.g. Dynamic Programming Study Guide"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                  >
                    <option value="Guidance">Guidance</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Project Ideas">Project Ideas</option>
                    <option value="Software Tips">Software Tips</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Content (Markdown / Text)</label>
                  <textarea
                    className={styles.textarea}
                    style={{ minHeight: "150px" }}
                    required
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Write article content here..."
                  />
                </div>
              </>
            )}

            {/* PROJECTS FORM FIELDS */}
            {activeTab === "projects" && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Project Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Smart Railway Tracking System"
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Branch</label>
                    <BranchSelect value={projectBranch} onChange={setProjectBranch} required />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>GitHub Link</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={projectGithub}
                      onChange={(e) => setProjectGithub(e.target.value)}
                      placeholder="e.g. https://github.com/..."
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Tech Stack (Comma-separated)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={projectTechStack}
                    onChange={(e) => setProjectTechStack(e.target.value)}
                    placeholder="e.g. React, Node.js, Arduino, CSS"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Describe project architecture and goals..."
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? <div className={styles.spinner}></div> : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
