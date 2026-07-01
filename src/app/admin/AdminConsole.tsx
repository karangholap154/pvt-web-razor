"use client";

import { useState } from "react";
import styles from "./admin.module.css";
import { Note, Article } from "../../data/mockData";

interface Project {
  id: string;
  title: string;
  branch: string;
  tech_stack: string[] | null;
  description: string | null;
  github_url: string | null;
}

interface AdminConsoleProps {
  initialNotes: Note[];
  initialArticles: Article[];
  initialProjects: Project[];
}

export default function AdminConsole({
  initialNotes,
  initialArticles,
  initialProjects,
}: AdminConsoleProps) {
  // Active Tab
  const [activeTab, setActiveTab] = useState<"notes" | "articles" | "projects">("notes");

  // Dynamic state for resources
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"create" | "edit">("create");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Note form states
  const [noteId, setNoteId] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBranch, setNoteBranch] = useState("Computer");
  const [noteSemester, setNoteSemester] = useState("Sem 1");
  const [noteUniversity, setNoteUniversity] = useState("Mumbai University");

  const [noteDownload, setNoteDownload] = useState("");
  const [noteVideo, setNoteVideo] = useState("");
  const [notePrice, setNotePrice] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);


  // Article form states
  const [articleId, setArticleId] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleCategory, setArticleCategory] = useState("Guidance");
  const [articleContent, setArticleContent] = useState("");

  // Project form states
  const [projectId, setProjectId] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectBranch, setProjectBranch] = useState("Computer");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectGithub, setProjectGithub] = useState("");

  // Reset form states
  const resetForms = () => {
    setFormError(null);
    setUploadSuccess(false);
    setUploading(false);
    // Reset Note
    setNoteId("");
    setNoteTitle("");
    setNoteBranch("Computer");
    setNoteSemester("Sem 1");
    setNoteUniversity("Mumbai University");
    setNoteDownload("");
    setNoteVideo("");
    setNotePrice("0");
    // Reset Article
    setArticleId("");
    setArticleTitle("");
    setArticleCategory("Guidance");
    setArticleContent("");
    // Reset Project
    setProjectId("");
    setProjectTitle("");
    setProjectBranch("Computer");
    setProjectTechStack("");
    setProjectDesc("");
    setProjectGithub("");
  };

  // Open Create Modal
  const openCreateModal = () => {
    resetForms();
    setModalAction("create");
    setIsModalOpen(true);
  };

  // Open Edit Modal for Note
  const openEditNote = (note: Note) => {
    resetForms();
    setModalAction("edit");
    setNoteId(note.id);
    setNoteTitle(note.title);
    setNoteBranch(note.branch);
    setNoteSemester(note.semester);
    setNoteUniversity(note.university || "Mumbai University");
    setNoteDownload(note.downloadUrl || "");
    setNoteVideo(note.videoUrl || "");
    setNotePrice(note.price?.toString() || "0");
    setIsModalOpen(true);
  };

  // Open Edit Modal for Article
  const openEditArticle = (art: Article) => {
    resetForms();
    setModalAction("edit");
    setArticleId(art.id);
    setArticleTitle(art.title);
    setArticleCategory(art.category);
    setArticleContent(art.content || "");
    setIsModalOpen(true);
  };

  // Open Edit Modal for Project
  const openEditProject = (proj: Project) => {
    resetForms();
    setModalAction("edit");
    setProjectId(proj.id);
    setProjectTitle(proj.title);
    setProjectBranch(proj.branch);
    setProjectTechStack(proj.tech_stack ? proj.tech_stack.join(", ") : "");
    setProjectDesc(proj.description || "");
    setProjectGithub(proj.github_url || "");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setFormError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload file");

      setNoteDownload(data.url);
      setUploadSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "File upload failed.";
      setFormError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Handle Submit Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      if (activeTab === "notes") {
        if (!noteTitle.trim()) throw new Error("Title is required");
        const body = {
          id: noteId,
          title: noteTitle,
          branch: noteBranch,
          semester: noteSemester,
          university: noteUniversity,
          downloadUrl: noteDownload,
          videoUrl: noteVideo,
          price: Number(notePrice) || 0,
        };

        const res = await fetch("/api/admin/notes", {
          method: modalAction === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save note");

        if (modalAction === "create") {
          // Map DB snake_case columns back to camelCase
          const newNote: Note = {
            id: data.note.id,
            title: data.note.title,
            branch: data.note.branch,
            semester: data.note.semester,
            university: data.note.university,
            description: `${data.note.title} - ${data.note.branch} Engineering, ${data.note.semester} | ${data.note.university || ""}`,
            downloadUrl: data.note.download_url,
            videoUrl: data.note.video_url,
            price: Number(data.note.price),
          };
          setNotes((prev) => [...prev, newNote]);
        } else {
          setNotes((prev) =>
            prev.map((n) =>
              n.id === noteId
                ? {
                    id: data.note.id,
                    title: data.note.title,
                    branch: data.note.branch,
                    semester: data.note.semester,
                    university: data.note.university,
                    description: `${data.note.title} - ${data.note.branch} Engineering, ${data.note.semester} | ${data.note.university || ""}`,
                    downloadUrl: data.note.download_url,
                    videoUrl: data.note.video_url,
                    price: Number(data.note.price),
                  }
                : n
            )
          );
        }
      } else if (activeTab === "articles") {
        if (!articleTitle.trim() || !articleContent.trim()) {
          throw new Error("Title and Content are required");
        }
        const body = {
          id: articleId,
          title: articleTitle,
          category: articleCategory,
          content: articleContent,
        };

        const res = await fetch("/api/admin/articles", {
          method: modalAction === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save article");

        if (modalAction === "create") {
          const newArticle: Article = {
            id: data.article.id,
            title: data.article.title,
            author: data.article.author || undefined,
            date: data.article.date || undefined,
            readTime: data.article.read_time,
            category: data.article.category,
            summary: data.article.summary,
            content: data.article.content,
          };
          setArticles((prev) => [newArticle, ...prev]);
        } else {
          setArticles((prev) =>
            prev.map((a) =>
              a.id === articleId
                ? {
                    id: data.article.id,
                    title: data.article.title,
                    author: data.article.author || undefined,
                    date: data.article.date || undefined,
                    readTime: data.article.read_time,
                    category: data.article.category,
                    summary: data.article.summary,
                    content: data.article.content,
                  }
                : a
            )
          );
        }
      } else if (activeTab === "projects") {
        if (!projectTitle.trim()) throw new Error("Title is required");
        const body = {
          id: projectId,
          title: projectTitle,
          branch: projectBranch,
          techStack: projectTechStack,
          description: projectDesc,
          githubUrl: projectGithub,
        };

        const res = await fetch("/api/admin/projects", {
          method: modalAction === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save project");

        if (modalAction === "create") {
          const newProj: Project = {
            id: data.project.id,
            title: data.project.title,
            branch: data.project.branch,
            tech_stack: data.project.tech_stack,
            description: data.project.description,
            github_url: data.project.github_url,
          };
          setProjects((prev) => [...prev, newProj]);
        } else {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === projectId
                ? {
                    id: data.project.id,
                    title: data.project.title,
                    branch: data.project.branch,
                    tech_stack: data.project.tech_stack,
                    description: data.project.description,
                    github_url: data.project.github_url,
                  }
                : p
            )
          );
        }
      }

      setIsModalOpen(false);
      resetForms();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete resource
  const handleDeleteItem = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

    try {
      const res = await fetch(`/api/admin/${activeTab}?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deletion failed");

      if (activeTab === "notes") {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else if (activeTab === "articles") {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else if (activeTab === "projects") {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Delete error: ${errorMessage}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div>
          <h1 className={styles.title}>Admin Panel Console</h1>
          <p className={styles.subtitle}>Manage Engineering Notes, Articles, and Capstone Projects.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === "notes" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes ({notes.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "articles" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("articles")}
        >
          Articles ({articles.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "projects" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Projects ({projects.length})
        </button>
      </div>

      {/* Actions header */}
      <div className={styles.actionHeader}>
        <h2 className={styles.sectionTitle}>
          {activeTab === "notes" && "Library Notes"}
          {activeTab === "articles" && "Editorial Articles"}
          {activeTab === "projects" && "Capstone Projects"}
        </h2>
        <button className={styles.btnCreate} onClick={openCreateModal}>
          + Create {activeTab === "notes" ? "Note" : activeTab === "articles" ? "Article" : "Project"}
        </button>
      </div>

      {/* Resource Lists Tables */}
      <div className={styles.tableContainer}>
        {activeTab === "notes" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>University</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <td style={{ fontWeight: 600 }}>{note.title}</td>
                  <td>
                    <span className={styles.badge} style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#fde047", border: "1px solid rgba(251,191,36,0.25)", fontSize: "0.72rem" }}>
                      {note.university ? note.university.replace("University", "Univ.").replace("Savitribai Phule Pune", "SPPU").replace("Dr. Babasaheb Ambedkar Technological", "DBATU").replace("Shivaji", "SUK") : "—"}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.tagBranch}`}>{note.branch}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.tagSemester}`}>{note.semester}</span>
                  </td>
                  <td>
                    {note.price && note.price > 0 ? (
                      <span className={`${styles.badge} ${styles.tagPrice}`}>₹{note.price}</span>
                    ) : (
                      <span className={styles.badge} style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>Free</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={() => openEditNote(note)} title="Edit">
                        Edit
                      </button>
                      <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => handleDeleteItem(note.id)} title="Delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "articles" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art.id}>
                  <td style={{ fontWeight: 600 }}>{art.title}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.tagBranch}`}>{art.category}</span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={() => openEditArticle(art)} title="Edit">
                        Edit
                      </button>
                      <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => handleDeleteItem(art.id)} title="Delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "projects" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Branch</th>
                <th>Tech Stack</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id}>
                  <td style={{ fontWeight: 600 }}>{proj.title}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.tagBranch}`}>{proj.branch}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                      {proj.tech_stack ? (
                        proj.tech_stack.map((t, idx) => (
                          <span key={idx} className={styles.badge} style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: "0.7rem" }}>
                            {t}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>None</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button className={`${styles.btnAction} ${styles.btnEdit}`} onClick={() => openEditProject(proj)} title="Edit">
                        Edit
                      </button>
                      <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => handleDeleteItem(proj.id)} title="Delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* POPUP MODAL OVERLAY */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalAction === "create" ? "Create New" : "Edit"} {activeTab === "notes" ? "Note" : activeTab === "articles" ? "Article" : "Project"}
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className={styles.modalBody}>
                {formError && <div className={styles.errorAlert} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem" }}>{formError}</div>}

                {/* NOTES FORM FIELDS */}
                {activeTab === "notes" && (
                  <>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Title</label>
                      <input type="text" className={styles.input} required value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="e.g. Compiler Construction" />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>University</label>
                      <select className={styles.select} value={noteUniversity} onChange={(e) => setNoteUniversity(e.target.value)}>
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
                        <select className={styles.select} value={noteBranch} onChange={(e) => setNoteBranch(e.target.value)}>
                          <option value="Computer">Computer</option>
                          <option value="IT">IT</option>
                          <option value="AIML">AIML</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Chemical">Chemical</option>
                        </select>
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Semester</label>
                        <select className={styles.select} value={noteSemester} onChange={(e) => setNoteSemester(e.target.value)}>
                          <option value="Sem 1">Sem 1</option>
                          <option value="Sem 2">Sem 2</option>
                          <option value="Sem 3">Sem 3</option>
                          <option value="Sem 4">Sem 4</option>
                          <option value="Sem 5">Sem 5</option>
                          <option value="Sem 6">Sem 6</option>
                          <option value="Sem 7">Sem 7</option>
                          <option value="Sem 8">Sem 8</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Price (INR)</label>
                        <input type="number" className={styles.input} min="0" required value={notePrice} onChange={(e) => setNotePrice(e.target.value)} placeholder="0 for Free" />
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Video Embed URL</label>
                        <input type="text" className={styles.input} value={noteVideo} onChange={(e) => setNoteVideo(e.target.value)} placeholder="e.g. https://www.youtube.com/embed/..." />
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
                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
                              <a href={noteDownload} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>View PDF</a>
                            </span>
                          )}
                        </div>
                        {uploadSuccess && (
                          <span style={{ fontSize: "0.8rem", color: "#4ade80" }}>✓ PDF Uploaded successfully!</span>
                        )}
                        {uploading && (
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <div className={styles.spinner} style={{ width: "14px", height: "14px" }}></div>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Uploading to Supabase Storage...</span>
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
                      <input type="text" className={styles.input} required value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="e.g. Dynamic Programming Study Guide" />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Category</label>
                      <select className={styles.select} value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)}>
                        <option value="Guidance">Guidance</option>
                        <option value="Tutorial">Tutorial</option>
                        <option value="Project Ideas">Project Ideas</option>
                        <option value="Software Tips">Software Tips</option>
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Content (Markdown / Text)</label>
                      <textarea className={styles.textarea} style={{ minHeight: "150px" }} required value={articleContent} onChange={(e) => setArticleContent(e.target.value)} placeholder="Write article content here..." />
                    </div>
                  </>
                )}

                {/* PROJECTS FORM FIELDS */}
                {activeTab === "projects" && (
                  <>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Project Title</label>
                      <input type="text" className={styles.input} required value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Smart Railway Tracking System" />
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Branch</label>
                        <select className={styles.select} value={projectBranch} onChange={(e) => setProjectBranch(e.target.value)}>
                          <option value="Computer">Computer</option>
                          <option value="IT">IT</option>
                          <option value="AIML">AIML</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Chemical">Chemical</option>
                        </select>
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>GitHub Link</label>
                        <input type="text" className={styles.input} value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} placeholder="e.g. https://github.com/..." />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Tech Stack (Comma-separated)</label>
                      <input type="text" className={styles.input} value={projectTechStack} onChange={(e) => setProjectTechStack(e.target.value)} placeholder="e.g. React, Node.js, Arduino, CSS" />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Describe project architecture and goals..." />
                    </div>

                  </>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnCancel} onClick={() => setIsModalOpen(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnSave} disabled={loading}>
                  {loading ? <div className={styles.spinner}></div> : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
