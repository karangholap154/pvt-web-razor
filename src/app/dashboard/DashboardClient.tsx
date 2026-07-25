"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import pageStyles from "../page.module.css";
import { Note } from "../../data/mockData";
import ContributeModal from "@/components/contribute/ContributeModal";
import { useToast } from "@/components/providers/ToastProvider";
import { FaCloudUploadAlt, FaClock, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";

interface SubmissionItem {
  id: string;
  title: string;
  university: string;
  branch: string;
  semester: string;
  suggested_price: number;
  status: "pending" | "approved" | "rejected";
  admin_feedback?: string | null;
  created_at: string;
}

interface PayoutRequestItem {
  id: string;
  amount: number;
  upi_id: string;
  status: "pending" | "processing" | "completed" | "rejected";
  utr_reference?: string | null;
  created_at: string;
}

interface DashboardClientProps {
  username: string;
  notes: Note[];
}

export default function DashboardClient({ username, notes }: DashboardClientProps) {
  const router = useRouter();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<"library" | "submissions" | "earnings">("library");

  // Modal states
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalType, setModalType] = useState<"video" | "pdf" | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Contribute modal state
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Wallet / Earnings state
  const [walletData, setWalletData] = useState<{
    upi_id: string;
    payout_name: string;
    badge_tier: string;
    grossSales: number;
    totalSalesCount: number;
    netEarnings: number;
    totalPaidOut: number;
    availableBalance: number;
    payoutRequests: PayoutRequestItem[];
  }>({
    upi_id: "",
    payout_name: "",
    badge_tier: "contributor",
    grossSales: 0,
    totalSalesCount: 0,
    netEarnings: 0,
    totalPaidOut: 0,
    availableBalance: 0,
    payoutRequests: [],
  });
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Payout request form states
  const [upiInput, setUpiInput] = useState("");
  const [payoutAmountInput, setPayoutAmountInput] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);

  // Fetch Submissions
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch("/api/contribute");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to fetch user submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Fetch Wallet & Earnings Data
  const fetchWallet = async () => {
    setLoadingWallet(true);
    try {
      const res = await fetch("/api/payouts/request");
      if (res.ok) {
        const data = await res.json();
        setWalletData({
          upi_id: data.upi_id || "",
          payout_name: data.payout_name || "",
          badge_tier: data.badge_tier || "contributor",
          grossSales: data.grossSales || 0,
          totalSalesCount: data.totalSalesCount || 0,
          netEarnings: data.netEarnings || 0,
          totalPaidOut: data.totalPaidOut || 0,
          availableBalance: data.availableBalance || 0,
          payoutRequests: data.payoutRequests || [],
        });
        setUpiInput(data.upi_id || "");
      }
    } catch (err) {
      console.error("Failed to fetch wallet info:", err);
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    if (activeTab === "submissions") {
      fetchSubmissions();
    } else if (activeTab === "earnings") {
      fetchWallet();
    }
  }, [activeTab]);

  const handleDeleteStudentSubmission = async (submissionId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will permanently delete the submission and its PDF file.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/contribute?id=${submissionId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete submission");
      }

      toast.success("Submission deleted successfully!");
      fetchSubmissions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed";
      toast.error(msg);
    }
  };

  const handleRequestPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiInput.trim() || !upiInput.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }

    const reqAmt = Number(payoutAmountInput) || walletData.availableBalance;
    if (reqAmt < 100) {
      toast.error("Minimum payout amount is ₹100");
      return;
    }

    if (reqAmt > walletData.availableBalance) {
      toast.error(`Requested amount (₹${reqAmt}) exceeds available balance (₹${walletData.availableBalance.toFixed(2)})`);
      return;
    }

    setPayoutLoading(true);
    try {
      const res = await fetch("/api/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId: upiInput.trim(), amount: reqAmt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit payout request");
      }

      toast.success(data.message || "Payout request submitted successfully!");
      setPayoutAmountInput("");
      fetchWallet();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payout request failed";
      toast.error(msg);
    } finally {
      setPayoutLoading(false);
    }
  };

  const openModal = (note: Note, type: "video" | "pdf") => {
    setSelectedNote(note);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setModalType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    if (!normalizedQuery) return true;
    return note.title.toLowerCase().includes(normalizedQuery);
  });

  const handleDownload = async (noteId: string, title: string) => {
    if (!noteId) return;
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/proxy-pdf?id=${noteId}`);
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download fetch failed, fallback opening in tab:", err);
      window.open(`/api/proxy-pdf?id=${noteId}`, "_blank");
    } finally {
      setDownloadingPdf(false);
      closeModal();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Area */}
      <div className={styles.headerArea}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome back, <span className={styles.username}>{username}</span> 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            Manage your unlocked notes, track your note submissions, and collect earnings.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={() => setIsContributeOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--accent, #f59e0b)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            <FaCloudUploadAlt style={{ fontSize: "1.1rem" }} /> + Contribute Note
          </button>
          <a href="/api/auth/logout" className={styles.btnLogout}>
            Sign Out
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--border, rgba(255,255,255,0.1))",
          paddingBottom: "0.5rem",
        }}
      >
        <button
          onClick={() => setActiveTab("library")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeTab === "library" ? "var(--accent, #f59e0b)" : "transparent",
            color: activeTab === "library" ? "#000" : "var(--text-secondary)",
            fontWeight: activeTab === "library" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Unlocked Library ({notes.length})
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeTab === "submissions" ? "var(--accent, #f59e0b)" : "transparent",
            color: activeTab === "submissions" ? "#000" : "var(--text-secondary)",
            fontWeight: activeTab === "submissions" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          My Submissions
        </button>

        <button
          onClick={() => setActiveTab("earnings")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeTab === "earnings" ? "var(--accent, #f59e0b)" : "transparent",
            color: activeTab === "earnings" ? "#000" : "var(--text-secondary)",
            fontWeight: activeTab === "earnings" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Earnings & UPI Wallet
        </button>
      </div>

      {/* ── TAB 1: UNLOCKED LIBRARY ───────────────────────────────────── */}
      {activeTab === "library" && (
        <div>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionHeading}>Your Unlocked Library</h2>
            <button
              type="button"
              className={styles.mobileSearchToggle}
              aria-label={isSearchExpanded ? "Collapse search" : "Expand search"}
              aria-expanded={isSearchExpanded}
              onClick={() => setIsSearchExpanded((prev) => !prev)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <div className={styles.searchDesktopWrap} role="search">
              <div className={styles.searchInputGroup}>
                <span className={styles.searchInputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  placeholder="Search notes"
                  className={styles.searchInput}
                  aria-label="Search unlocked notes"
                />
              </div>
            </div>
          </div>

          {filteredNotes.length > 0 ? (
            <div className={styles.grid}>
              {filteredNotes.map((note) => (
                <article
                  className={styles.noteCard}
                  key={note.id}
                  id={`purchased-${note.id}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/notes/${note.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, () => router.push(`/notes/${note.id}`))}
                >
                  <div className={styles.noteCardHeader}>
                    <h3 className={styles.noteCardTitle}>
                      <Link
                        href={`/notes/${note.id}`}
                        style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                      >
                        {note.title}
                      </Link>
                    </h3>
                  </div>
                  <div className={styles.badgeRow}>
                    <span className={styles.tagBranch}>{note.branch}</span>
                    <span className={styles.badgeSemester}>{note.semester}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                      Unlocked
                    </span>
                  </div>
                  <p className={styles.noteCardDesc}>{note.description}</p>

                  <div className={styles.noteCardActions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(note, "video");
                      }}
                      className={`${styles.btnAction} ${styles.btnActionVideo}`}
                    >
                      Watch Video
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(note, "pdf");
                      }}
                      className={`${styles.btnAction} ${styles.btnActionPdf}`}
                    >
                      Download PDF
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Your library is empty</h3>
              <p className={styles.emptyText}>Explore the main catalog to unlock premium study notes.</p>
              <Link href="/" className={styles.btnExplore}>Browse Notes</Link>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: MY SUBMISSIONS ────────────────────────────────────── */}
      {activeTab === "submissions" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 className={styles.sectionHeading}>My Contributed Notes</h2>
            <button
              onClick={() => setIsContributeOpen(true)}
              style={{
                backgroundColor: "var(--accent, #f59e0b)",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "0.55rem 1rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              + Submit New Note
            </button>
          </div>

          {loadingSubmissions ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              Loading your submissions...
            </div>
          ) : submissions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{sub.title}</h3>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "0.15rem 0.45rem", borderRadius: "4px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                          🎓 Contributed by You
                        </span>
                      </div>
                      <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                        {sub.university} • {sub.branch} • {sub.semester}
                      </div>
                    </div>

                    <div>
                      {sub.status === "pending" && (
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <FaClock /> Pending Admin Review
                        </span>
                      )}
                      {sub.status === "approved" && (
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid rgba(34, 197, 94, 0.3)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <FaCheckCircle /> Published Live (₹{sub.suggested_price})
                        </span>
                      )}
                      {sub.status === "rejected" && (
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.3)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <FaTimesCircle /> Submission Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {sub.admin_feedback && (
                    <div style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: "8px", padding: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)", borderLeft: "3px solid var(--accent)" }}>
                      <strong>Admin Feedback:</strong> {sub.admin_feedback}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      Submitted on {new Date(sub.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <button
                      onClick={() => handleDeleteStudentSubmission(sub.id, sub.title)}
                      style={{
                        background: "none",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#ef4444",
                        borderRadius: "6px",
                        padding: "0.3rem 0.65rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                      title="Delete this submission and file"
                    >
                      <FaTrash /> Delete Submission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No notes submitted yet</h3>
              <p className={styles.emptyText}>Share your study notes with peers & earn 80% revenue per sale!</p>
              <button
                onClick={() => setIsContributeOpen(true)}
                className={styles.btnExplore}
              >
                Submit Your First Note
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: EARNINGS & UPI WALLET ─────────────────────────────── */}
      {activeTab === "earnings" && (
        <div>
          <h2 className={styles.sectionHeading} style={{ marginBottom: "1rem" }}>Contributor Earnings & UPI Wallet</h2>

          {loadingWallet ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              Loading earnings wallet...
            </div>
          ) : (
            <div>
              {/* Stat Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Sales Count</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.3rem" }}>{walletData.totalSalesCount} sales</div>
                </div>

                <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Gross Note Sales</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.3rem" }}>₹{walletData.grossSales.toFixed(2)}</div>
                </div>

                <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Net Contributor Share (80%)</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#22c55e", marginTop: "0.3rem" }}>₹{walletData.netEarnings.toFixed(2)}</div>
                </div>

                <div style={{ backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 600 }}>Available Balance</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f59e0b", marginTop: "0.3rem" }}>₹{walletData.availableBalance.toFixed(2)}</div>
                </div>
              </div>

              {/* UPI Payout Request Form */}
              <div style={{ backgroundColor: "rgba(0, 0, 0, 0.25)", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.5rem", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Request Payout to UPI</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                  Payouts are transferred directly via Google Pay / PhonePe / Paytm to your UPI ID (Min threshold: ₹100).
                </p>

                <form onSubmit={handleRequestPayoutSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                      UPI ID <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. username@upi or 9876543210@ybl"
                      value={upiInput}
                      onChange={(e) => setUpiInput(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Payout Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max={walletData.availableBalance}
                      placeholder={`Max ₹${walletData.availableBalance.toFixed(0)}`}
                      value={payoutAmountInput}
                      onChange={(e) => setPayoutAmountInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={payoutLoading || walletData.availableBalance < 100}
                    style={{
                      padding: "0.68rem 1.4rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: walletData.availableBalance >= 100 ? "var(--accent, #f59e0b)" : "rgba(255,255,255,0.1)",
                      color: walletData.availableBalance >= 100 ? "#000" : "var(--text-secondary)",
                      fontWeight: 700,
                      cursor: walletData.availableBalance >= 100 ? "pointer" : "not-allowed",
                      fontSize: "0.875rem",
                    }}
                  >
                    {payoutLoading ? "Submitting..." : "Submit Payout Request"}
                  </button>
                </form>
              </div>

              {/* Payout History Table */}
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Payout History</h3>
                {walletData.payoutRequests.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", textAlign: "left" }}>
                          <th style={{ padding: "0.75rem" }}>Date</th>
                          <th style={{ padding: "0.75rem" }}>Amount</th>
                          <th style={{ padding: "0.75rem" }}>UPI ID</th>
                          <th style={{ padding: "0.75rem" }}>Status</th>
                          <th style={{ padding: "0.75rem" }}>UTR Ref</th>
                        </tr>
                      </thead>
                      <tbody>
                        {walletData.payoutRequests.map((p) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "0.75rem" }}>
                              {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>₹{p.amount}</td>
                            <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>{p.upi_id}</td>
                            <td style={{ padding: "0.75rem" }}>
                              <span style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                backgroundColor: p.status === "completed" ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                color: p.status === "completed" ? "#22c55e" : "#f59e0b",
                              }}>
                                {p.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: "0.75rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>
                              {p.utr_reference || "Pending"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>No payout requests logged yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video / PDF Modals */}
      {modalType && selectedNote && (
        <div className={pageStyles.modalBackdrop} onClick={closeModal} id="dashboard-modal-backdrop">
          <div className={pageStyles.modalContent} onClick={(e) => e.stopPropagation()} id="dashboard-modal-content">
            <div className={pageStyles.modalHeader}>
              <h3 className={pageStyles.modalTitle}>
                {modalType === "video" && "Video Tutorial"}
                {modalType === "pdf" && "PDF Download Link"}
              </h3>
              <button onClick={closeModal} className={pageStyles.modalCloseBtn} id="btn-dashboard-close-modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className={pageStyles.modalBody}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className={styles.tagBranch}>{selectedNote.branch}</span>
                <span className={styles.badgeSemester}>{selectedNote.semester}</span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{selectedNote.title}</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{selectedNote.description}</p>

              {modalType === "pdf" && (
                <div style={{ textAlign: "center", padding: "2rem 1rem", backgroundColor: "var(--background)", borderRadius: "8px", border: "1px dashed var(--border)" }} id="dashboard-pdf-pane">
                  <h5>{selectedNote.title}.pdf</h5>
                  <button
                    onClick={() => handleDownload(selectedNote.id, selectedNote.title)}
                    className={pageStyles.btnPrimary}
                    style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
                    disabled={downloadingPdf}
                  >
                    {downloadingPdf ? "Downloading..." : "Confirm Download"}
                  </button>
                </div>
              )}
            </div>

            <div className={pageStyles.modalFooter}>
              <button onClick={closeModal} className={pageStyles.btnSecondary}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Contribute Modal */}
      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSuccess={() => {
          if (activeTab === "submissions") fetchSubmissions();
        }}
      />
    </div>
  );
}
