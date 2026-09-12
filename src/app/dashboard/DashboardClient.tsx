"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import pageStyles from "../page.module.css";
import { Note } from "../../data/mockData";
import ContributeModal from "@/components/contribute/ContributeModalDynamic";
import { useToast } from "@/components/providers/ToastProvider";
import { 
  FaBookOpen, 
  FaCloudArrowUp, 
  FaWallet, 
  FaClock, 
  FaCircleCheck, 
  FaCircleXmark, 
  FaTrashCan,
  FaArrowRightFromBracket 
} from "react-icons/fa6";
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
  const router = useRouter();
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
        <div className={styles.headerActions}>
          <button
            onClick={() => setIsContributeOpen(true)}
            className={styles.btnContribute}
            id="btn-dashboard-contribute"
          >
            <FaCloudArrowUp style={{ fontSize: "1rem" }} />
            <span>Contribute Note</span>
          </button>
          <a href="/api/auth/logout" className={styles.btnLogout} id="btn-dashboard-logout">
            <FaArrowRightFromBracket style={{ fontSize: "0.85rem" }} />
            <span>Sign Out</span>
          </a>
        </div>
      </div>

      {/* Quick Metrics Summary Bar */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Unlocked Resources</span>
            <FaBookOpen className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{notes.length}</div>
          <div className={styles.metricDesc}>Study guides ready for offline download</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Notes Contributed</span>
            <FaCloudArrowUp className={styles.metricIcon} />
          </div>
          <div className={styles.metricValue}>{submissions.length}</div>
          <div className={styles.metricDesc}>
            {submissions.filter((s) => s.status === "approved").length} approved &amp; live
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Wallet Balance</span>
            <FaWallet className={styles.metricIcon} />
          </div>
          <div className={`${styles.metricValue} ${walletData.availableBalance > 0 ? styles.walletStatValueAmber : ""}`}>
            ₹{walletData.availableBalance.toFixed(0)}
          </div>
          <div className={styles.metricDesc}>Available for direct UPI payout</div>
        </div>
      </div>

      {/* Segmented Tabs Navigation */}
      <div className={styles.tabsNav} role="tablist" aria-label="Dashboard sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "library"}
          onClick={() => setActiveTab("library")}
          className={`${styles.tabBtn} ${activeTab === "library" ? styles.tabBtnActive : ""}`}
          id="tab-btn-library"
        >
          <span>Unlocked Library</span>
          <span className={styles.tabBadge}>{notes.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "submissions"}
          onClick={() => setActiveTab("submissions")}
          className={`${styles.tabBtn} ${activeTab === "submissions" ? styles.tabBtnActive : ""}`}
          id="tab-btn-submissions"
        >
          <span>My Submissions</span>
          {submissions.length > 0 && (
            <span className={styles.tabBadge}>{submissions.length}</span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "earnings"}
          onClick={() => setActiveTab("earnings")}
          className={`${styles.tabBtn} ${activeTab === "earnings" ? styles.tabBtnActive : ""}`}
          id="tab-btn-earnings"
        >
          <span>Earnings &amp; Wallet</span>
          {walletData.availableBalance >= 100 && (
            <span className={styles.tabBadge} style={{ color: "#22c55e", background: "rgba(34, 197, 94, 0.15)" }}>
              Ready
            </span>
          )}
        </button>
      </div>

      {/* ── TAB 1: UNLOCKED LIBRARY ───────────────────────────────────── */}
      {activeTab === "library" && (
        <div>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionHeading}>Your Unlocked Library</h2>
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
              <p className={styles.emptyText}>Explore the main catalog to unlock premium study notes.</p>
              <Link href="/" className={styles.btnExplore}>Browse Notes</Link>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: MY SUBMISSIONS ────────────────────────────────────── */}
      {activeTab === "submissions" && (
        <div>
          <div className={styles.sectionHeaderRow}>
            <div>
              <h2 className={styles.sectionHeading}>My Contributed Notes</h2>
              <p className={styles.sectionSubtitle}>
                Track the approval status and admin feedback for your uploaded study materials.
              </p>
            </div>
            <button
              onClick={() => setIsContributeOpen(true)}
              className={styles.btnContribute}
            >
              <FaCloudArrowUp /> Submit New Note
            </button>
          </div>

          {loadingSubmissions ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <p>Loading your submissions...</p>
            </div>
          ) : submissions.length > 0 ? (
            <div className={styles.submissionsList}>
              {submissions.map((sub) => (
                <div key={sub.id} className={styles.submissionCard}>
                  <div className={styles.submissionHeader}>
                    <div className={styles.submissionTitleWrap}>
                      <div className={styles.titleRow}>
                        <h3 className={styles.submissionTitle}>{sub.title}</h3>
                        <span className={styles.tagStudentNote}>
                          Contributed by You
                        </span>
                      </div>
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
                          <FaClock /> Pending Admin Review
                        </span>
                      )}
                      {sub.status === "approved" && (
                        <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
                          <FaCircleCheck /> Published Live (₹{sub.suggested_price})
                        </span>
                      )}
                      {sub.status === "rejected" && (
                        <span className={`${styles.statusBadge} ${styles.statusRejected}`}>
                          <FaCircleXmark /> Submission Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {sub.admin_feedback && (
                    <div className={styles.adminFeedbackBox}>
                      <strong>Admin Feedback:</strong> {sub.admin_feedback}
                    </div>
                  )}

                  <div className={styles.submissionFooter}>
                    <span className={styles.submissionDate}>
                      Submitted on {new Date(sub.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => setSubmissionToDelete({ id: sub.id, title: sub.title })}
                      className={styles.btnDeleteSubmission}
                      title="Delete this submission and file"
                    >
                      <FaTrashCan /> Delete Submission
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
          <div className={styles.sectionHeaderRow}>
            <div>
              <h2 className={styles.sectionHeading}>Contributor Earnings & UPI Wallet</h2>
              <p className={styles.sectionSubtitle}>
                Request instant payouts directly to your UPI ID once you reach the ₹100 threshold.
              </p>
            </div>
          </div>

          {loadingWallet ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <p>Loading earnings wallet...</p>
            </div>
          ) : (
            <div>
              {/* Stat Cards Grid */}
              <div className={styles.walletStatsGrid}>
                <div className={styles.walletStatCard}>
                  <div className={styles.walletStatLabel}>Total Sales Count</div>
                  <div className={styles.walletStatValue}>{walletData.totalSalesCount} sales</div>
                </div>

                <div className={styles.walletStatCard}>
                  <div className={styles.walletStatLabel}>Gross Note Sales</div>
                  <div className={styles.walletStatValue}>₹{walletData.grossSales.toFixed(2)}</div>
                </div>

                <div className={styles.walletStatCard}>
                  <div className={styles.walletStatLabel}>Net Contributor Share (80%)</div>
                  <div className={`${styles.walletStatValue} ${styles.walletStatValueGreen}`}>₹{walletData.netEarnings.toFixed(2)}</div>
                </div>

                <div className={`${styles.walletStatCard} ${styles.walletStatCardHighlight}`}>
                  <div className={styles.walletStatLabel}>Available Balance</div>
                  <div className={`${styles.walletStatValue} ${styles.walletStatValueAmber}`}>₹{walletData.availableBalance.toFixed(2)}</div>
                </div>
              </div>

              {/* UPI Payout Request Form */}
              <div className={styles.payoutCard}>
                <h3 className={styles.payoutTitle}>Request Payout to UPI</h3>
                <p className={styles.payoutDesc}>
                  Payouts are transferred directly via Google Pay / PhonePe / Paytm to your UPI ID (Min threshold: ₹100).
                </p>

                <form onSubmit={handleRequestPayoutSubmit} className={styles.payoutForm}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>
                      UPI ID <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. username@upi or 9876543210@ybl"
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
                    {payoutLoading ? "Submitting..." : "Submit Payout Request"}
                  </button>
                </form>
              </div>

              {/* Payout History Table */}
              <div>
                <h3 className={styles.sectionHeading} style={{ marginBottom: "1rem" }}>Payout History</h3>
                {walletData.payoutRequests.length > 0 ? (
                  <div className={styles.payoutTableContainer}>
                    <table className={styles.payoutTable}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>UPI ID</th>
                          <th>Status</th>
                          <th>UTR Ref</th>
                        </tr>
                      </thead>
                      <tbody>
                        {walletData.payoutRequests.map((p) => (
                          <tr key={p.id}>
                            <td>
                              {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{p.amount}</td>
                            <td style={{ color: "var(--text-secondary)" }}>{p.upi_id}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${p.status === "completed" ? styles.statusApproved : styles.statusPending}`}>
                                {p.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>
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

              {modalType === "video" && (
                selectedNote.videoUrl ? (
                  <div className={pageStyles.videoWrapper} id="dashboard-video-iframe-wrap">
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
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "8px",
                    border: "1px dashed var(--border)",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem"
                  }}>
                    <p style={{ margin: 0 }}>No video lecture URL is attached to this note yet.</p>
                  </div>
                )
              )}

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
