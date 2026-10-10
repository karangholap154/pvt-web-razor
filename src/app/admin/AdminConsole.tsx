"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "./admin.module.css";
import { Note, Article } from "../../data/mockData";
import ConfirmDialogDynamic from "@/components/ui/ConfirmDialogDynamic";
import { Project, User, AdminSubmission, AdminPayoutRequest, AdminConsoleProps } from "@/types/admin";
import AdminAnalyticsTab from "@/components/admin/tabs/AdminAnalyticsTab";
import AdminNotesTab from "@/components/admin/tabs/AdminNotesTab";
import AdminArticlesTab from "@/components/admin/tabs/AdminArticlesTab";
import AdminProjectsTab from "@/components/admin/tabs/AdminProjectsTab";
import AdminUsersTab from "@/components/admin/tabs/AdminUsersTab";
import AdminSubmissionsTab from "@/components/admin/tabs/AdminSubmissionsTab";
import AdminPayoutsTab from "@/components/admin/tabs/AdminPayoutsTab";
import AdminResourceModalDynamic from "@/components/admin/tabs/AdminResourceModalDynamic";

export default function AdminConsole({
  initialNotes,
  initialArticles,
  initialProjects,
  initialPurchases = [],
  initialUsers = [],
}: AdminConsoleProps) {
  const toast = useToast();
  // Active Tab
  const [activeTab, setActiveTab] = useState<"analytics" | "notes" | "articles" | "projects" | "users" | "submissions" | "payouts">("analytics");

  // Admin Submissions State
  const [adminSubmissions, setAdminSubmissions] = useState<AdminSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Admin Payouts State
  const [adminPayouts, setAdminPayouts] = useState<AdminPayoutRequest[]>([]);
  const [loadingPayouts, setLoadingPayouts] = useState(false);

  // Custom Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: "danger" | "warning" | "default";
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  // Dynamic state for resources
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Users list state
  const [usersList, setUsersList] = useState<User[]>(initialUsers);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"create" | "edit">("create");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Note form states
  const [noteId, setNoteId] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBranch, setNoteBranch] = useState("Computer Engineering");
  const [noteSemester, setNoteSemester] = useState("1");
  const [noteUniversity, setNoteUniversity] = useState("Mumbai University");
  const [noteDownload, setNoteDownload] = useState("");
  const [noteVideo, setNoteVideo] = useState("");
  const [notePrice, setNotePrice] = useState("0");
  const [noteSubject, setNoteSubject] = useState("");
  const [noteResourceType, setNoteResourceType] = useState("official_subject");
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
  const [projectBranch, setProjectBranch] = useState("Computer Engineering");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectGithub, setProjectGithub] = useState("");

  // Fetch Submissions
  const fetchAdminSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = await res.json();
        setAdminSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Fetch Payout Requests
  const fetchAdminPayouts = async () => {
    setLoadingPayouts(true);
    try {
      const res = await fetch("/api/admin/payouts");
      if (res.ok) {
        const data = await res.json();
        setAdminPayouts(data.payoutRequests || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin payouts:", err);
    } finally {
      setLoadingPayouts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "submissions") {
      fetchAdminSubmissions();
    } else if (activeTab === "payouts") {
      fetchAdminPayouts();
    }
  }, [activeTab]);

  // Reset form states
  const resetForms = () => {
    setFormError(null);
    setUploadSuccess(false);
    setUploading(false);
    setNoteId("");
    setNoteTitle("");
    setNoteBranch("Computer Engineering");
    setNoteSemester("1");
    setNoteUniversity("Mumbai University");
    setNoteDownload("");
    setNoteVideo("");
    setNotePrice("0");
    setNoteSubject("");
    setNoteResourceType("official_subject");

    setArticleId("");
    setArticleTitle("");
    setArticleCategory("Guidance");
    setArticleContent("");

    setProjectId("");
    setProjectTitle("");
    setProjectBranch("Computer Engineering");
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
    setNoteSubject(note.subject || note.title);
    setNoteResourceType(note.resource_type || (note.is_community_contributed ? "supplementary_guide" : "official_subject"));
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
      toast.warning("Please select a PDF file.");
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
          subject: (noteSubject || noteTitle).trim(),
          resourceType: noteResourceType,
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
          const newNote: Note = {
            id: data.note.id,
            title: data.note.title,
            branch: data.note.branch,
            semester: data.note.semester,
            university: data.note.university,
            subject: data.note.subject || data.note.title,
            resource_type: data.note.resource_type || "official_subject",
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
                    subject: data.note.subject || data.note.title,
                    resource_type: data.note.resource_type || "official_subject",
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
  const handleDeleteItem = (id: string) => {
    const itemType = activeTab === "notes" ? "note" : activeTab === "articles" ? "article" : "project";
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
      message: `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        setIsConfirmLoading(true);
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
          toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          toast.error(`Delete error: ${errorMessage}`);
        } finally {
          setIsConfirmLoading(false);
        }
      },
    });
  };

  const handleDeleteSubmission = (submissionId: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Submission",
      message: `Are you sure you want to permanently delete "${title}"? This will remove the submission record, published note, and PDF file from storage.`,
      confirmLabel: "Delete Permanently",
      variant: "danger",
      onConfirm: async () => {
        setIsConfirmLoading(true);
        try {
          const res = await fetch("/api/admin/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submissionId, action: "delete" }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Deletion failed");

          toast.success("Submission and associated files deleted permanently!");
          fetchAdminSubmissions();
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Delete failed";
          toast.error(errorMessage);
        } finally {
          setIsConfirmLoading(false);
        }
      },
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Control Center</h1>
          <p className={styles.subtitle}>Superuser management console for Study Portal resources and student access.</p>
        </div>
      </header>

      {/* Tabs Control */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "analytics" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics & Insights
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "notes" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes ({notes.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "submissions" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("submissions")}
        >
          Review Submissions
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "payouts" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("payouts")}
        >
          Payouts Manager
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
        <button
          className={`${styles.tabBtn} ${activeTab === "users" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({initialUsers.length})
        </button>
      </div>

      {/* Actions header (Only show for notes, articles, projects, users) */}
      {activeTab !== "analytics" && activeTab !== "submissions" && activeTab !== "payouts" && (
        <div className={styles.actionHeader}>
          <h2 className={styles.sectionTitle}>
            {activeTab === "notes" && "Library Notes"}
            {activeTab === "articles" && "Editorial Articles"}
            {activeTab === "projects" && "Capstone Projects"}
            {activeTab === "users" && "User Access Management"}
          </h2>
          {activeTab === "users" ? (
            <input
              type="text"
              placeholder="Search users..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className={styles.select}
              style={{
                maxWidth: "240px",
                background: "rgba(9, 9, 11, 0.4)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.55rem 0.75rem",
                fontSize: "0.9rem",
              }}
            />
          ) : (
            <button className={styles.btnCreate} onClick={openCreateModal}>
              + Create {activeTab === "notes" ? "Note" : activeTab === "articles" ? "Article" : "Project"}
            </button>
          )}
        </div>
      )}

      {/* TAB CONTENTS */}
      {activeTab === "analytics" && (
        <AdminAnalyticsTab
          initialPurchases={initialPurchases}
          initialUsers={initialUsers}
          notes={notes}
        />
      )}

      {activeTab !== "analytics" && (
        <div className={styles.tableContainer}>
          {activeTab === "notes" && (
            <AdminNotesTab
              notes={notes}
              openEditNote={openEditNote}
              handleDeleteItem={handleDeleteItem}
            />
          )}

          {activeTab === "articles" && (
            <AdminArticlesTab
              articles={articles}
              openEditArticle={openEditArticle}
              handleDeleteItem={handleDeleteItem}
            />
          )}

          {activeTab === "projects" && (
            <AdminProjectsTab
              projects={projects}
              openEditProject={openEditProject}
              handleDeleteItem={handleDeleteItem}
            />
          )}

          {activeTab === "users" && (
            <AdminUsersTab
              usersList={usersList}
              setUsersList={setUsersList}
              userSearchQuery={userSearchQuery}
            />
          )}

          {activeTab === "submissions" && (
            <AdminSubmissionsTab
              adminSubmissions={adminSubmissions}
              loadingSubmissions={loadingSubmissions}
              fetchAdminSubmissions={fetchAdminSubmissions}
              handleDeleteSubmission={handleDeleteSubmission}
            />
          )}

          {activeTab === "payouts" && (
            <AdminPayoutsTab
              adminPayouts={adminPayouts}
              loadingPayouts={loadingPayouts}
              fetchAdminPayouts={fetchAdminPayouts}
            />
          )}
        </div>
      )}

      {/* POPUP MODAL OVERLAY */}
      <AdminResourceModalDynamic
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab === "notes" || activeTab === "articles" || activeTab === "projects" ? activeTab : "notes"}
        modalAction={modalAction}
        loading={loading}
        formError={formError}
        handleFormSubmit={handleFormSubmit}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        noteSubject={noteSubject}
        setNoteSubject={setNoteSubject}
        noteResourceType={noteResourceType}
        setNoteResourceType={setNoteResourceType}
        noteUniversity={noteUniversity}
        setNoteUniversity={setNoteUniversity}
        noteBranch={noteBranch}
        setNoteBranch={setNoteBranch}
        noteSemester={noteSemester}
        setNoteSemester={setNoteSemester}
        notePrice={notePrice}
        setNotePrice={setNotePrice}
        noteVideo={noteVideo}
        setNoteVideo={setNoteVideo}
        noteDownload={noteDownload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        handleFileUpload={handleFileUpload}
        articleTitle={articleTitle}
        setArticleTitle={setArticleTitle}
        articleCategory={articleCategory}
        setArticleCategory={setArticleCategory}
        articleContent={articleContent}
        setArticleContent={setArticleContent}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        projectBranch={projectBranch}
        setProjectBranch={setProjectBranch}
        projectGithub={projectGithub}
        setProjectGithub={setProjectGithub}
        projectTechStack={projectTechStack}
        setProjectTechStack={setProjectTechStack}
        projectDesc={projectDesc}
        setProjectDesc={setProjectDesc}
      />

      <ConfirmDialogDynamic
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.message}
        confirmText={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        isLoading={isConfirmLoading}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => {
          if (!isConfirmLoading) {
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          }
        }}
      />
    </div>
  );
}
