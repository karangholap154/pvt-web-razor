"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { Note } from "../../data/mockData";
import ContributeModal from "@/components/contribute/ContributeModalDynamic";
import { useToast } from "@/components/providers/ToastProvider";
import { downloadNotePdf } from "@/utils/download";
import { 
  LuBookOpen, 
  LuCloudUpload, 
  LuWallet, 
  LuClock, 
  LuCircleCheck, 
  LuCircleAlert, 
  LuTrash2, 
  LuLogOut, 
  LuSearch, 
  LuBanknote,
  LuX
} from "react-icons/lu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import NoteCard from "@/components/cards/NoteCard";

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
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<"library" | "submissions" | "earnings">("library");
  const [submissionToDelete, setSubmissionToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingSubmission, setIsDeletingSubmission] = useState(false);

  // Modal states
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalType, setModalType] = useState<"video" | "pdf" | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleConfirmDeleteSubmission = async () => {
    if (!submissionToDelete || isDeletingSubmission) return;

    setIsDeletingSubmission(true);
    try {
      const res = await fetch(`/api/contribute?id=${submissionToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete submission");
      }

      toast.success("Submission deleted successfully!");
      setSubmissionToDelete(null);
      fetchSubmissions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed";
      toast.error(msg);
    } finally {
      setIsDeletingSubmission(false);
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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    if (!normalizedQuery) return true;
    return note.title.toLowerCase().includes(normalizedQuery);
  });

  const handleDownload = async (noteId: string, title: string) => {
    if (!noteId) return;
    setDownloadingPdf(true);
    try {
      await downloadNotePdf(noteId, title);
    } finally {
      setDownloadingPdf(false);
      closeModal();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.dashboardLayout}>
          {/* ================================================================
              240px STICKY SIDEBAR (DESKTOP)
              ================================================================ */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarTitle}>Workspace</div>
            <nav className={styles.navGroup} role="tablist" aria-label="Dashboard sections">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "library"}
                onClick={() => setActiveTab("library")}
                className={`${styles.navBtn} ${activeTab === "library" ? styles.navBtnActive : ""}`}
                id="tab-btn-library"
              >
                <span className={styles.navBtnContent}>
                  <LuBookOpen size={16} />
                  <span>Library</span>
                </span>
                <span className={styles.navBadge}>{notes.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "submissions"}
                onClick={() => setActiveTab("submissions")}
                className={`${styles.navBtn} ${activeTab === "submissions" ? styles.navBtnActive : ""}`}
                id="tab-btn-submissions"
              >
                <span className={styles.navBtnContent}>
                  <LuCloudUpload size={16} />
                  <span>Submissions</span>
                </span>
                {submissions.length > 0 && (
                  <span className={styles.navBadge}>{submissions.length}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "earnings"}
                onClick={() => setActiveTab("earnings")}
                className={`${styles.navBtn} ${activeTab === "earnings" ? styles.navBtnActive : ""}`}
                id="tab-btn-earnings"
              >
                <span className={styles.navBtnContent}>
                  <LuWallet size={16} />
                  <span>Earnings</span>
                </span>
                {walletData.availableBalance >= 100 ? (
                  <span className={`${styles.navBadge} ${styles.navBadgeReady}`}>Ready</span>
                ) : (
                  <span className={styles.navBadge}>₹{walletData.availableBalance.toFixed(0)}</span>
                )}
              </button>
            </nav>

            <div className={styles.sidebarDivider} />

            <button
              type="button"
              onClick={() => setIsContributeOpen(true)}
              className={styles.btnContributeSidebar}
              id="btn-dashboard-contribute"
            >
              <LuCloudUpload size={16} />
              <span>Contribute Note</span>
            </button>

            <div className={styles.sidebarProfile}>
              <div className={styles.userDossier}>
                <div className={styles.userAvatar}>
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
                <div className={styles.userHandle} title={`@${username}`}>
                  @{username}
                </div>
              </div>
              <a
                href="/api/auth/logout"
                className={styles.btnLogoutSidebar}
                title="Sign out"
                id="btn-dashboard-logout"
              >
                <LuLogOut size={16} />
              </a>
            </div>
          </aside>

          {/* ================================================================
              MAIN CONTENT WORKSPACE
              ================================================================ */}
          <main className={styles.mainContent}>
            {/* Welcome Banner */}
            <div className={styles.welcomeHeader}>
              <div className={styles.eyebrowTag}>
                <span className={styles.pulseDot} />
                <span>STUDENT &amp; CONTRIBUTOR WORKSPACE</span>
              </div>
              <h1 className={styles.welcomeTitle}>
                Welcome back, <span className={styles.usernameHighlight}>{username}</span>
              </h1>
              <p className={styles.welcomeSubtitle}>
                Manage your unlocked study library, track contributor peer submissions, and collect earnings.
              </p>
            </div>

            {/* 4-Stat Bento Grid */}
            <div className={styles.bentoGrid}>
              <div className={styles.bentoCard}>
                <div className={styles.bentoHeader}>
                  <span className={styles.bentoLabel}>Unlocked Library</span>
                  <LuBookOpen className={styles.bentoIcon} size={18} />
                </div>
                <div className={styles.bentoValue}>{notes.length}</div>
                <div className={styles.bentoDesc}>Verified study notes ready for download</div>
              </div>

              <div className={styles.bentoCard}>
                <div className={styles.bentoHeader}>
                  <span className={styles.bentoLabel}>Notes Contributed</span>
                  <LuCloudUpload className={styles.bentoIcon} size={18} />
                </div>
                <div className={styles.bentoValue}>{submissions.length}</div>
                <div className={styles.bentoDesc}>
                  {submissions.filter((s) => s.status === "approved").length} approved &amp; live in catalog
                </div>
              </div>

              <div className={styles.bentoCard}>
                <div className={styles.bentoHeader}>
                  <span className={styles.bentoLabel}>Total Sales</span>
                  <LuBanknote className={styles.bentoIcon} size={18} />
                </div>
                <div className={styles.bentoValue}>{walletData.totalSalesCount}</div>
                <div className={styles.bentoDesc}>Copies unlocked by peer students</div>
              </div>

              <div className={styles.bentoCard}>
                <div className={styles.bentoHeader}>
                  <span className={styles.bentoLabel}>Available Balance</span>
                  <LuWallet className={styles.bentoIcon} size={18} />
                </div>
                <div className={`${styles.bentoValue} ${walletData.availableBalance > 0 ? styles.bentoValueGreen : ""}`}>
                  ₹{walletData.availableBalance.toFixed(0)}
                </div>
                <div className={styles.bentoDesc}>
                  {walletData.availableBalance >= 100 ? "Ready for direct UPI payout" : "Min ₹100 threshold"}
                </div>
              </div>
            </div>

            {/* ── TAB 1: UNLOCKED LIBRARY ───────────────────────────────── */}
            {activeTab === "library" && (
              <div className={styles.panelCard}>
                <div className={styles.sectionHeaderRow}>
                  <div>
                    <h2 className={styles.sectionHeading}>Unlocked Study Library</h2>
                    <p className={styles.sectionSubtitle}>
                      Instant access to verified semester materials unlocked by you.
                    </p>
                  </div>
                  <div className={styles.searchWrap} role="search">
                    <LuSearch className={styles.searchIcon} size={16} />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by title..."
                      className={styles.searchInput}
                      aria-label="Search unlocked notes"
                    />
                  </div>
                </div>

                {filteredNotes.length > 0 ? (
                  <div className={styles.libraryGrid}>
                    {filteredNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        id={`purchased-${note.id}`}
                        note={note}
                        variant="purchased"
                        onWatchVideo={note.videoUrl ? (n) => openModal(n, "video") : undefined}
                        onAction={(n) => openModal(n, "pdf")}
                        actionLabel="Download PDF"
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <h3 className={styles.emptyTitle}>Your library is empty</h3>
                    <p className={styles.emptyText}>
                      Explore the catalog to unlock peer-reviewed notes, practical sheets, and semester blueprints.
                    </p>
                    <Link href="/" className={styles.btnExplore}>Browse Notes</Link>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: MY SUBMISSIONS ────────────────────────────────── */}
            {activeTab === "submissions" && (
              <div className={styles.panelCard}>
                <div className={styles.sectionHeaderRow}>
                  <div>
                    <h2 className={styles.sectionHeading}>My Contributed Notes</h2>
                    <p className={styles.sectionSubtitle}>
                      Track moderation status, editorial feedback, and live catalog performance for your uploads.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsContributeOpen(true)}
                    className={styles.btnExplore}
                  >
                    <LuCloudUpload size={16} />
                    <span>Upload New Note</span>
                  </button>
                </div>

                {loadingSubmissions ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner} />
                    <p>Loading your submissions ledger...</p>
                  </div>
                ) : submissions.length > 0 ? (
                  <div className={styles.submissionsList}>
                    {submissions.map((sub) => (
                      <div key={sub.id} className={styles.submissionCard}>
                        <div className={styles.submissionHeader}>
                          <div className={styles.submissionTitleWrap}>
                            <h3 className={styles.submissionTitle}>{sub.title}</h3>
                            <div className={styles.submissionMeta}>
                              <span>{sub.university}</span>
                              <span>•</span>
                              <span>{sub.branch}</span>
                              <span>•</span>
                              <span>{sub.semester}</span>
                            </div>
                          </div>

                          <div>
                            {sub.status === "pending" && (
                              <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                                <LuClock size={12} /> Pending Moderation
                              </span>
                            )}
                            {sub.status === "approved" && (
                              <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
                                <LuCircleCheck size={12} /> Published Live (₹{sub.suggested_price})
                              </span>
                            )}
                            {sub.status === "rejected" && (
                              <span className={`${styles.statusBadge} ${styles.statusRejected}`}>
                                <LuCircleAlert size={12} /> Needs Revision
                              </span>
                            )}
                          </div>
                        </div>

                        {sub.admin_feedback && (
                          <div className={styles.adminFeedbackBox}>
                            <strong>Editorial Feedback:</strong> {sub.admin_feedback}
                          </div>
                        )}

                        <div className={styles.submissionFooter}>
                          <span>
                            Uploaded on {new Date(sub.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSubmissionToDelete({ id: sub.id, title: sub.title })}
                            className={styles.btnDeleteSubmission}
                            title="Delete this submission and file"
                          >
                            <LuTrash2 size={13} />
                            <span>Delete Submission</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <h3 className={styles.emptyTitle}>No notes submitted yet</h3>
                    <p className={styles.emptyText}>
                      Help engineering peers ace their exams while earning 80% revenue share on every unlock!
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsContributeOpen(true)}
                      className={styles.btnExplore}
                    >
                      Contribute Your First Note
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: EARNINGS & UPI WALLET ─────────────────────────── */}
            {activeTab === "earnings" && (
              <div className={styles.panelCard}>
                <div className={styles.sectionHeaderRow}>
                  <div>
                    <h2 className={styles.sectionHeading}>Contributor Earnings &amp; UPI Wallet</h2>
                    <p className={styles.sectionSubtitle}>
                      Direct payouts via Google Pay, PhonePe, or Paytm once your balance reaches the ₹100 threshold.
                    </p>
                  </div>
                </div>

                {loadingWallet ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner} />
                    <p>Loading earnings &amp; wallet ledger...</p>
                  </div>
                ) : (
                  <div>
                    <div className={styles.walletStatsGrid}>
                      <div className={styles.walletStatCard}>
                        <div className={styles.walletStatLabel}>Total Sales Count</div>
                        <div className={styles.walletStatValue}>{walletData.totalSalesCount} units</div>
                      </div>

                      <div className={styles.walletStatCard}>
                        <div className={styles.walletStatLabel}>Gross Note Sales</div>
                        <div className={styles.walletStatValue}>₹{walletData.grossSales.toFixed(2)}</div>
                      </div>

                      <div className={styles.walletStatCard}>
                        <div className={styles.walletStatLabel}>Net Contributor Share (80%)</div>
                        <div className={styles.walletStatValue} style={{ color: "#0F7B4F" }}>
                          ₹{walletData.netEarnings.toFixed(2)}
                        </div>
                      </div>

                      <div className={styles.walletStatCard}>
                        <div className={styles.walletStatLabel}>Available Balance</div>
                        <div className={`${styles.walletStatValue} ${styles.walletStatValueHighlight}`}>
                          ₹{walletData.availableBalance.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* UPI Payout Request Form */}
                    <div className={styles.payoutCard}>
                      <h3 className={styles.payoutTitle}>Request Direct UPI Payout</h3>
                      <p className={styles.payoutDesc}>
                        Transfers are initiated directly to your UPI VPA handle. Payout requests are verified and credited within 24-48 business hours.
                      </p>

                      <form onSubmit={handleRequestPayoutSubmit} className={styles.payoutForm}>
                        <div className={styles.formField}>
                          <label className={styles.formLabel}>
                            UPI ID / VPA <span style={{ color: "#ef4444" }}>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. scholar@okaxis or 9876543210@ybl"
                            value={upiInput}
                            onChange={(e) => setUpiInput(e.target.value)}
                            required
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>
                            Payout Amount (₹)
                          </label>
                          <input
                            type="number"
                            min="100"
                            max={walletData.availableBalance}
                            placeholder={`Max ₹${walletData.availableBalance.toFixed(0)}`}
                            value={payoutAmountInput}
                            onChange={(e) => setPayoutAmountInput(e.target.value)}
                            className={styles.formInput}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={payoutLoading || walletData.availableBalance < 100}
                          className={styles.btnSubmitPayout}
                        >
                          {payoutLoading ? "Submitting..." : walletData.availableBalance < 100 ? "Min ₹100 Required" : "Request Payout"}
                        </button>
                      </form>
                    </div>

                    {/* Payout History Ledger */}
                    <div>
                      <h3 className={styles.sectionHeading} style={{ marginBottom: "1rem", fontSize: 16 }}>
                        Payout History
                      </h3>
                      {walletData.payoutRequests.length > 0 ? (
                        <div className={styles.payoutTableContainer}>
                          <table className={styles.payoutTable}>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>UPI Handle</th>
                                <th>Status</th>
                                <th>UTR Reference</th>
                              </tr>
                            </thead>
                            <tbody>
                              {walletData.payoutRequests.map((p) => (
                                <tr key={p.id}>
                                  <td>
                                    {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </td>
                                  <td style={{ fontWeight: 700, fontFamily: "var(--font-jetbrains), monospace" }}>
                                    ₹{p.amount}
                                  </td>
                                  <td style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--slate-600)" }}>
                                    {p.upi_id}
                                  </td>
                                  <td>
                                    <span className={`${styles.statusBadge} ${p.status === "completed" ? styles.statusApproved : styles.statusPending}`}>
                                      {p.status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--slate-600)" }}>
                                    {p.utr_reference || "Processing"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p style={{ fontSize: "0.875rem", color: "var(--slate-600, #4A5468)", margin: 0 }}>
                          No payout disbursements recorded yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* ================================================================
            MOBILE BOTTOM NAVIGATION BAR (< 1024px)
            ================================================================ */}
        <nav className={styles.mobileTabBar} aria-label="Mobile navigation">
          <button
            type="button"
            className={`${styles.mobileTabItem} ${activeTab === "library" ? styles.mobileTabItemActive : ""}`}
            onClick={() => setActiveTab("library")}
          >
            <LuBookOpen size={18} />
            <span>Library</span>
          </button>
          <button
            type="button"
            className={`${styles.mobileTabItem} ${activeTab === "submissions" ? styles.mobileTabItemActive : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            <LuCloudUpload size={18} />
            <span>Submissions</span>
          </button>
          <button
            type="button"
            className={`${styles.mobileTabItem} ${activeTab === "earnings" ? styles.mobileTabItemActive : ""}`}
            onClick={() => setActiveTab("earnings")}
          >
            <LuWallet size={18} />
            <span>Earnings</span>
          </button>
        </nav>
      </div>

      {/* ================================================================
          MODALS & OVERLAYS
          ================================================================ */}
      {modalType && selectedNote && (
        <div className={styles.modalBackdrop} onClick={closeModal} id="dashboard-modal-backdrop">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} id="dashboard-modal-content">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalType === "video" && "Video Tutorial"}
                {modalType === "pdf" && "Download Study Note PDF"}
              </h3>
              <button onClick={closeModal} className={styles.modalCloseBtn} id="btn-dashboard-close-modal" aria-label="Close modal">
                <LuX size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                <span className={styles.tagBranch}>{selectedNote.branch}</span>
                <span className={styles.badgeSemester}>{selectedNote.semester}</span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--ink-900, #0B1020)" }}>
                {selectedNote.title}
              </h4>
              <p style={{ color: "var(--slate-600, #4A5468)", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
                {selectedNote.description}
              </p>

              {modalType === "video" && (
                selectedNote.videoUrl ? (
                  <div className={styles.videoWrapper} id="dashboard-video-iframe-wrap">
                    <iframe
                      src={selectedNote.videoUrl}
                      title={`${selectedNote.title} Video Tutorial`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "2.5rem 1rem",
                    backgroundColor: "var(--paper, #F7F8FB)",
                    borderRadius: "10px",
                    border: "1px dashed var(--line-300, #CDD4E2)",
                    color: "var(--slate-600, #4A5468)",
                    fontSize: "0.9rem"
                  }}>
                    <p style={{ margin: 0 }}>No video lecture URL is attached to this note yet.</p>
                  </div>
                )
              )}

              {modalType === "pdf" && (
                <div style={{
                  textAlign: "center",
                  padding: "2rem 1rem",
                  backgroundColor: "var(--paper, #F7F8FB)",
                  borderRadius: "10px",
                  border: "1px dashed var(--line-300, #CDD4E2)"
                }} id="dashboard-pdf-pane">
                  <h5 style={{ margin: "0 0 1rem 0", fontSize: "14px", fontFamily: "var(--font-jetbrains), monospace" }}>
                    {selectedNote.title}.pdf
                  </h5>
                  <button
                    onClick={() => handleDownload(selectedNote.id, selectedNote.title)}
                    className={styles.btnExplore}
                    style={{ margin: "0 auto", width: "100%", maxWidth: "260px" }}
                    disabled={downloadingPdf}
                  >
                    {downloadingPdf ? "Downloading..." : "Confirm & Download PDF"}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnModalSecondary}>
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

      {/* Delete Submission Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(submissionToDelete)}
        title="Delete submission?"
        description={
          submissionToDelete
            ? `Are you sure you want to delete "${submissionToDelete.title}"? This will permanently delete the submission and its uploaded PDF file.`
            : ""
        }
        confirmText="Delete submission"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingSubmission}
        onConfirm={handleConfirmDeleteSubmission}
        onClose={() => setSubmissionToDelete(null)}
      />
    </div>
  );
}
