"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/components/providers/ToastProvider";
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

interface Purchase {
  id: string;
  email: string;
  note_id: string | null;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  status: string;
  created_at: string | null;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  university: string | null;
  created_at: string | null;
}

interface AdminConsoleProps {
  initialNotes: Note[];
  initialArticles: Article[];
  initialProjects: Project[];
  initialPurchases: Purchase[];
  initialUsers: User[];
}

export default function AdminConsole({
  initialNotes,
  initialArticles,
  initialProjects,
  initialPurchases = [],
  initialUsers = [],
}: AdminConsoleProps) {
  const toast = useToast();
  // Active Tab
  const [activeTab, setActiveTab] = useState<"analytics" | "notes" | "articles" | "projects" | "users">("analytics");

  // User search filtering state
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Filtered users for user management tab
  const filteredUsersList = useMemo(() => {
    if (!userSearchQuery.trim()) return initialUsers;
    const query = userSearchQuery.toLowerCase();
    return initialUsers.filter(
      (u) =>
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.full_name && u.full_name.toLowerCase().includes(query)) ||
        (u.university && u.university.toLowerCase().includes(query))
    );
  }, [initialUsers, userSearchQuery]);

  // Password reset modal states
  const [resetPasswordUser, setResetPasswordUser] = useState<{ id: string; email: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Dynamic state for resources
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Hovered data point for SVG Line Chart tooltip
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; revenue: number; x: number; y: number; index: number } | null>(null);

  // Analytics filter states
  const [analyticsDateRange, setAnalyticsDateRange] = useState<"7days" | "30days" | "alltime">("30days");
  const [analyticsBranch, setAnalyticsBranch] = useState<string>("All branches");

  // Filtered successful purchases based on selected branch and timeframe
  const filteredPurchasesForAnalytics = useMemo(() => {
    let list = initialPurchases.filter((p) => p.status === "success");
    
    // 1. Filter by branch
    if (analyticsBranch !== "All branches") {
      list = list.filter((p) => {
        if (!p.note_id) return false;
        const matchingNote = notes.find((n) => n.id === p.note_id);
        return matchingNote?.branch === analyticsBranch;
      });
    }

    // 2. Filter by timeframe
    if (analyticsDateRange !== "alltime") {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const limitDays = analyticsDateRange === "7days" ? 7 : 30;

      list = list.filter((p) => {
        if (!p.created_at) return false;
        const purchaseDate = new Date(p.created_at);
        const purchaseDateStart = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), purchaseDate.getDate());
        const diffTime = todayStart.getTime() - purchaseDateStart.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < limitDays;
      });
    }

    return list;
  }, [initialPurchases, analyticsBranch, analyticsDateRange, notes]);

  // Filtered users based on selected timeframe
  const filteredUsersForAnalytics = useMemo(() => {
    if (analyticsDateRange === "alltime") {
      return initialUsers;
    }
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limitDays = analyticsDateRange === "7days" ? 7 : 30;

    return initialUsers.filter((u) => {
      if (!u.created_at) return false;
      const regDate = new Date(u.created_at);
      const regDateStart = new Date(regDate.getFullYear(), regDate.getMonth(), regDate.getDate());
      const diffTime = todayStart.getTime() - regDateStart.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < limitDays;
    });
  }, [initialUsers, analyticsDateRange]);

  // Compute metrics based on filtered purchases and users
  const metrics = useMemo(() => {
    const totalRev = filteredPurchasesForAnalytics.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalSales = filteredPurchasesForAnalytics.length;
    const totalUsers = filteredUsersForAnalytics.length;
    const avgOrderValue = totalSales > 0 ? totalRev / totalSales : 0;
    return { totalRev, totalSales, totalUsers, avgOrderValue };
  }, [filteredPurchasesForAnalytics, filteredUsersForAnalytics]);

  // Aggregate daily sales with dynamic timeframe length
  const dailySales = useMemo(() => {
    const data = [];
    const now = new Date();
    
    let daysToLoop = 30;
    if (analyticsDateRange === "7days") {
      daysToLoop = 7;
    } else if (analyticsDateRange === "30days") {
      daysToLoop = 30;
    } else if (analyticsDateRange === "alltime") {
      if (filteredPurchasesForAnalytics.length > 0) {
        const timestamps = filteredPurchasesForAnalytics.map((p) => new Date(p.created_at || "").getTime());
        const earliestTimestamp = Math.min(...timestamps);
        const earliestDate = new Date(earliestTimestamp);
        const diffTime = Math.abs(now.getTime() - earliestDate.getTime());
        daysToLoop = Math.max(7, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
      }
    }

    for (let i = daysToLoop - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const revenue = filteredPurchasesForAnalytics
        .filter((p) => {
          if (!p.created_at) return false;
          const pD = new Date(p.created_at);
          const pYear = pD.getFullYear();
          const pMonth = String(pD.getMonth() + 1).padStart(2, "0");
          const pDay = String(pD.getDate()).padStart(2, "0");
          const pDate = `${pYear}-${pMonth}-${pDay}`;
          return pDate === dateKey;
        })
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      data.push({ date: dateStr, key: dateKey, revenue });
    }
    return data;
  }, [filteredPurchasesForAnalytics, analyticsDateRange]);

  // Find max revenue for line chart scaling
  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...dailySales.map((d) => d.revenue));
    return maxVal > 0 ? maxVal : 100;
  }, [dailySales]);

  // Top Performing Notes
  const topNotes = useMemo(() => {
    const noteCounts: Record<string, { count: number; revenue: number }> = {};

    filteredPurchasesForAnalytics.forEach((p) => {
      if (!p.note_id) return;
      if (!noteCounts[p.note_id]) {
        noteCounts[p.note_id] = { count: 0, revenue: 0 };
      }
      noteCounts[p.note_id].count += 1;
      noteCounts[p.note_id].revenue += Number(p.amount) || 0;
    });

    return Object.entries(noteCounts)
      .map(([noteId, stats]) => {
        const matchingNote = notes.find((n) => n.id === noteId);
        return {
          id: noteId,
          title: matchingNote ? matchingNote.title : noteId,
          branch: matchingNote ? matchingNote.branch : "Unknown",
          ...stats,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredPurchasesForAnalytics, notes]);

  // Find max note revenue for note bar chart scaling
  const maxNoteRevenue = useMemo(() => {
    const maxVal = Math.max(...topNotes.map((n) => n.revenue));
    return maxVal > 0 ? maxVal : 100;
  }, [topNotes]);

  // University Registration Distribution
  const universityDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    filteredUsersForAnalytics.forEach((u) => {
      const univ = u.university || "General / Unknown";
      dist[univ] = (dist[univ] || 0) + 1;
    });

    const totalUsers = filteredUsersForAnalytics.length || 1;

    return Object.entries(dist)
      .map(([university, count]) => ({
        university,
        count,
        percentage: (count / totalUsers) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredUsersForAnalytics]);

  // Chart configuration constants
  const svgWidth = 800;
  const svgHeight = 250;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const chartPoints = useMemo(() => {
    const totalPoints = dailySales.length;
    const divisor = totalPoints > 1 ? totalPoints - 1 : 1;
    return dailySales.map((d, idx) => {
      const x = paddingLeft + (idx / divisor) * chartWidth;
      const y = (svgHeight - paddingBottom) - (d.revenue / maxRevenue) * chartHeight;
      return { x, y, date: d.date, revenue: d.revenue, index: idx };
    });
  }, [dailySales, maxRevenue, chartWidth, chartHeight]);

  const linePath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    return `M ${chartPoints[0].x} ${chartPoints[0].y} ` + chartPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }, [chartPoints]);

  const areaPath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    const startX = chartPoints[0].x;
    const startY = svgHeight - paddingBottom;
    const endX = chartPoints[chartPoints.length - 1].x;
    const endY = svgHeight - paddingBottom;
    return `${linePath} L ${endX} ${endY} L ${startX} ${startY} Z`;
  }, [chartPoints, linePath]);

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

  // Open modal helper for password reset
  const openResetPasswordModal = (userId: string, email: string) => {
    setResetPasswordUser({ id: userId, email });
    setNewPassword("");
    setConfirmNewPassword("");
    setResetError(null);
  };

  // Submit handler for password reset
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    setResetError(null);

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetLoading(true);

    try {
      const res = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: resetPasswordUser.id, password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset password failed");

      toast.success(`Password for ${resetPasswordUser.email} has been updated successfully!`);
      setResetPasswordUser(null);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Reset failed.";
      setResetError(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

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
      toast.error(`Delete error: ${errorMessage}`);
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
          className={`${styles.tabBtn} ${activeTab === "analytics" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics Dashboard
        </button>
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
        <button
          className={`${styles.tabBtn} ${activeTab === "users" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({initialUsers.length})
        </button>
      </div>

      {/* Actions header (Only show for notes, articles, projects, users) */}
      {activeTab !== "analytics" && (
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
                fontSize: "0.9rem"
              }}
            />
          ) : (
            <button className={styles.btnCreate} onClick={openCreateModal}>
              + Create {activeTab === "notes" ? "Note" : activeTab === "articles" ? "Article" : "Project"}
            </button>
          )}
        </div>
      )}

      {/* Analytics Dashboard Content */}
      {activeTab === "analytics" && (
        <div className={styles.analyticsContainer}>
          {/* Analytics Filters Control Bar */}
          <div className={styles.analyticsFilterBar}>
            <div className={styles.filterGroup}>
              <label htmlFor="analytics-date-range-select" className={styles.filterLabel}>Timeframe</label>
              <select
                id="analytics-date-range-select"
                value={analyticsDateRange}
                onChange={(e) => setAnalyticsDateRange(e.target.value as "7days" | "30days" | "alltime")}
                className={styles.select}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="alltime">All Time</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="analytics-branch-select" className={styles.filterLabel}>Branch Specialty</label>
              <select
                id="analytics-branch-select"
                value={analyticsBranch}
                onChange={(e) => setAnalyticsBranch(e.target.value)}
                className={styles.select}
              >
                <option value="All branches">All branches</option>
                <option value="Computer">Computer</option>
                <option value="IT">IT</option>
                <option value="AIML">AIML</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Total Revenue</span>
                <span className={styles.metricIconWrapper} style={{ color: "var(--accent)", backgroundColor: "rgba(251, 191, 36, 0.1)" }}>
                  ₹
                </span>
              </div>
              <div className={styles.metricValue}>₹{metrics.totalRev}</div>
              <div className={styles.metricSubtext}>Earnings from successful purchases</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Successful Sales</span>
                <span className={styles.metricIconWrapper} style={{ color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.1)" }}>
                  🛒
                </span>
              </div>
              <div className={styles.metricValue}>{metrics.totalSales}</div>
              <div className={styles.metricSubtext}>Completed orders volume</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>
                  {analyticsDateRange === "alltime" ? "Enrolled Students" : "New Registrations"}
                </span>
                <span className={styles.metricIconWrapper} style={{ color: "#4ade80", backgroundColor: "rgba(74, 222, 128, 0.1)" }}>
                  👥
                </span>
              </div>
              <div className={styles.metricValue}>{metrics.totalUsers}</div>
              <div className={styles.metricSubtext}>
                {analyticsDateRange === "alltime" ? "Registered user profiles" : `Signups in ${analyticsDateRange === "7days" ? "last 7 days" : "last 30 days"}`}
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>Avg. Order Value</span>
                <span className={styles.metricIconWrapper} style={{ color: "#f472b6", backgroundColor: "rgba(244, 114, 182, 0.1)" }}>
                  📈
                </span>
              </div>
              <div className={styles.metricValue}>₹{metrics.avgOrderValue.toFixed(2)}</div>
              <div className={styles.metricSubtext}>Average cart size per unlock</div>
            </div>
          </div>

          {/* Charts Area */}
          <div className={styles.chartsGrid}>
            
            {/* SVG Line Chart */}
            <div className={styles.chartCard} style={{ gridColumn: "span 2", position: "relative" }}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>
                  Revenue Trend ({analyticsDateRange === "7days" ? "Last 7 Days" : analyticsDateRange === "30days" ? "Last 30 Days" : "All Time"})
                </h3>
                {hoveredPoint && (
                  <span className={styles.chartHoverValue}>
                    {hoveredPoint.date}: <strong style={{ color: "var(--accent)" }}>₹{hoveredPoint.revenue}</strong>
                  </span>
                )}
              </div>
              
              <div className={styles.chartWrapper} style={{ position: "relative" }}>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.33, 0.66, 1].map((ratio, index) => {
                    const y = (svgHeight - paddingBottom) - ratio * chartHeight;
                    const val = Math.round(maxRevenue * ratio);
                    return (
                      <g key={index}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={svgWidth - paddingRight}
                          y2={y}
                          stroke="var(--border)"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={paddingLeft - 8}
                          y={y + 4}
                          fill="var(--text-secondary)"
                          fontSize="10"
                          textAnchor="end"
                        >
                          ₹{val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Filled Area */}
                  {areaPath && (
                    <path d={areaPath} fill="url(#chartGradient)" />
                  )}

                  {/* Chart Line */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Dotted indicator line on hover */}
                  {hoveredPoint && (
                    <line
                      x1={hoveredPoint.x}
                      y1={paddingTop}
                      x2={hoveredPoint.x}
                      y2={svgHeight - paddingBottom}
                      stroke="var(--accent)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Interactive Circles */}
                  {chartPoints.map((p) => {
                    const isHovered = hoveredPoint?.index === p.index;
                    return (
                      <g key={p.index}>
                        {/* Visible circle marker */}
                        {p.revenue > 0 && (
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? 6 : 4}
                            fill={isHovered ? "var(--accent)" : "var(--background)"}
                            stroke="var(--accent)"
                            strokeWidth={isHovered ? 3 : 2}
                            style={{ transition: "all 0.15s ease" }}
                          />
                        )}
                        {/* Transparent touch/hover target */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="12"
                          fill="transparent"
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() => setHoveredPoint(p)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    );
                  })}

                  {/* X-axis labels */}
                  {chartPoints.map((p, idx) => {
                    const total = chartPoints.length;
                    let show = false;
                    if (total <= 7) {
                      show = true;
                    } else if (total <= 31) {
                      show = idx % 5 === 0 || idx === total - 1;
                    } else {
                      show = idx % 10 === 0 || idx === total - 1;
                    }
                    
                    if (show) {
                      return (
                        <text
                          key={idx}
                          x={p.x}
                          y={svgHeight - paddingBottom + 20}
                          fill="var(--text-secondary)"
                          fontSize="10"
                          textAnchor="middle"
                        >
                          {p.date}
                        </text>
                      );
                    }
                    return null;
                  })}
                </svg>

                {/* Inline HTML Tooltip */}
                {hoveredPoint && (
                  <div
                    className={styles.chartTooltip}
                    style={{
                      left: hoveredPoint.x - 65,
                      top: hoveredPoint.y - 70,
                      position: "absolute",
                    }}
                  >
                    <div className={styles.tooltipDate}>{hoveredPoint.date}</div>
                    <div className={styles.tooltipValue}>₹{hoveredPoint.revenue}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Performing Notes Card */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle} style={{ marginBottom: "1rem" }}>Top Performing Notes</h3>
              <div className={styles.barList}>
                {topNotes.length > 0 ? (
                  topNotes.map((note) => {
                    const widthPercent = maxNoteRevenue > 0 ? (note.revenue / maxNoteRevenue) * 100 : 0;
                    return (
                      <div key={note.id} className={styles.barItem}>
                        <div className={styles.barItemLabels}>
                          <span className={styles.barItemTitle} title={note.title}>{note.title}</span>
                          <span className={styles.barItemValue}>₹{note.revenue}</span>
                        </div>
                        <div className={styles.barItemTrack}>
                          <div
                            className={styles.barItemFill}
                            style={{
                              width: `${widthPercent}%`,
                              background: "linear-gradient(90deg, var(--accent), #fb923c)"
                            }}
                          />
                        </div>
                        <div className={styles.barItemMeta}>
                          <span>{note.branch} Engineering</span>
                          <span>{note.count} {note.count === 1 ? "purchase" : "purchases"}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>No notes sales data found yet.</div>
                )}
              </div>
            </div>

            {/* University Registration Breakdown Card */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle} style={{ marginBottom: "1rem" }}>University Enrollment</h3>
              <div className={styles.barList}>
                {universityDistribution.length > 0 ? (
                  universityDistribution.map((univ) => {
                    return (
                      <div key={univ.university} className={styles.barItem}>
                        <div className={styles.barItemLabels}>
                          <span className={styles.barItemTitle} title={univ.university}>{univ.university}</span>
                          <span className={styles.barItemValue}>{univ.count} {univ.count === 1 ? "student" : "students"}</span>
                        </div>
                        <div className={styles.barItemTrack}>
                          <div
                            className={styles.barItemFill}
                            style={{
                              width: `${univ.percentage}%`,
                              background: "linear-gradient(90deg, #38bdf8, #60a5fa)"
                            }}
                          />
                        </div>
                        <div className={styles.barItemMeta}>
                          <span>{univ.percentage.toFixed(1)}% Share</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>No user registration data found.</div>
                )}
              </div>
            </div>

          </div>

          {/* Recent Transactions List */}
          <div className={styles.transactionsSection}>
            <h3 className={styles.chartTitle} style={{ marginBottom: "1rem" }}>Recent Transactions Log</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Note Resource</th>
                    <th>Razorpay Payment ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchasesForAnalytics.length > 0 ? (
                    filteredPurchasesForAnalytics.map((purchase) => {
                      const matchingNote = notes.find((n) => n.id === purchase.note_id);
                      return (
                        <tr key={purchase.id}>
                          <td style={{ fontWeight: 600 }}>{purchase.email}</td>
                          <td>{matchingNote ? matchingNote.title : purchase.note_id || "Unknown note"}</td>
                          <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            {purchase.razorpay_payment_id || "—"}
                          </td>
                          <td style={{ fontWeight: 700, color: purchase.status === "success" ? "#4ade80" : "inherit" }}>
                            ₹{purchase.amount}
                          </td>
                          <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            {purchase.created_at ? new Date(purchase.created_at).toLocaleString() : "—"}
                          </td>
                          <td>
                            <span
                              className={styles.badge}
                              style={{
                                backgroundColor: purchase.status === "success" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                                color: purchase.status === "success" ? "#22c55e" : "#ef4444",
                                border: purchase.status === "success" ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
                              }}
                            >
                              {purchase.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                        No transactions recorded in the logs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Resource Lists Tables */}
      {activeTab !== "analytics" && (
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
        {activeTab === "users" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Full Name</th>
                <th>University</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsersList.length > 0 ? (
                filteredUsersList.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>{user.email}</td>
                    <td>{user.full_name || "—"}</td>
                    <td>
                      <span className={styles.badge} style={{ backgroundColor: "rgba(251,191,36,0.12)", color: "#fde047", border: "1px solid rgba(251,191,36,0.25)", fontSize: "0.72rem" }}>
                        {user.university || "—"}
                      </span>
                    </td>
                    <td>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          className={`${styles.btnAction} ${styles.btnEdit}`}
                          onClick={() => openResetPasswordModal(user.id, user.email)}
                          title="Change Password"
                          style={{ backgroundColor: "rgba(251, 191, 36, 0.15)", color: "var(--accent)", border: "1px solid rgba(251, 191, 36, 0.2)" }}
                        >
                          Change Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {resetPasswordUser && (
        <div className={styles.modalBackdrop} onClick={() => {
          setResetPasswordUser(null);
          setNewPassword("");
          setConfirmNewPassword("");
          setResetError(null);
        }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Change Password</h3>
              <button className={styles.modalCloseBtn} onClick={() => {
                setResetPasswordUser(null);
                setNewPassword("");
                setConfirmNewPassword("");
                setResetError(null);
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handlePasswordResetSubmit} className={styles.form}>
              <div className={styles.modalBody}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: "1.4" }}>
                  Set a new password for <strong style={{ color: "var(--text-primary)" }}>{resetPasswordUser.email}</strong>.
                </p>

                {resetError && <div className={styles.errorAlert} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" }}>{resetError}</div>}

                <div className={styles.inputGroup} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>New Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={resetLoading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={resetLoading}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setResetError(null);
                  }}
                  className={styles.btnCancel}
                  disabled={resetLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnSave}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
