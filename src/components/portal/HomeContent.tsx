"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "../../app/page.module.css";
import { Note, Article } from "../../data/mockData";
import { supabase } from "../../utils/supabaseClient";
import LoginGate from "../landing/LoginGate";
import UniversityGate from "../landing/UniversityGate";

// Define Razorpay window type interfaces
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayWindow extends Window {
  Razorpay?: new (options: unknown) => { open: () => void };
}

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const unlockNoteId = searchParams.get("unlock");

  // Consume global authentication state
  const { authState, email: userEmail, university: userUniversity, refreshAuth } = useAuth();

  // Live database states
  const [notes, setNotes] = useState<Note[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedSemester, setSelectedSemester] = useState("All semesters");

  // Modal state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalType, setModalType] = useState<"video" | "pdf" | null>(null);

  // Checkout states
  const [showCheckoutPrompt, setShowCheckoutPrompt] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState<Note | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "verifying" | "paying" | "success" | "error">("idle");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // ── Fetch articles on mount ───────────────────────────────────────────
  useEffect(() => {
    async function loadArticles() {
      try {
        const { data: dbArticles, error: articlesError } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!articlesError && dbArticles) {
          const finalArticles = dbArticles.map((item) => ({
            id: item.id,
            title: item.title,
            readTime: `${Math.max(1, Math.ceil((item.content || "").trim().split(/\s+/).filter(Boolean).length / 200))} min read`,
            category: item.category as Article["category"],
            summary: item.summary || "",
            content: item.content || "",
          }));
          setArticles(finalArticles);
        }
      } catch (err) {
        console.error("Error loading articles:", err);
      }
    }
    loadArticles();
  }, []);

  // ── Fetch notes filtered by university ─────────────────────────────────
  useEffect(() => {
    if (authState !== "ready" || !userUniversity) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const { data: dbNotes, error: notesError } = await supabase
          .from("notes")
          .select("*")
          .eq("university", userUniversity!)
          .order("title", { ascending: true });

        let finalNotes: Note[] = [];

        if (!notesError && dbNotes) {
          finalNotes = dbNotes.map((item) => ({
            id: item.id,
            title: item.title,
            branch: item.branch as Note["branch"],
            semester: item.semester,
            description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
            downloadUrl: item.download_url || "",
            videoUrl: item.video_url || "",
            price: item.price ? Number(item.price) : 0,
            university: item.university || undefined,
          }));
        }

        setNotes(finalNotes);
      } catch (err) {
        console.error("Error loading data:", err);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [authState, userUniversity]);

  // ── Filtered Notes memo ─────────────────────────────────────────────────
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch =
        selectedBranch === "All branches" || note.branch === selectedBranch;
      const matchesSemester =
        selectedSemester === "All semesters" || note.semester === selectedSemester;
      return matchesSearch && matchesBranch && matchesSemester;
    });
  }, [notes, searchQuery, selectedBranch, selectedSemester]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBranch("All branches");
    setSelectedSemester("All semesters");
  };

  const openModal = useCallback((note: Note, type: "video" | "pdf") => {
    setSelectedNote(note);
    setModalType(type);
  }, []);

  const closeModal = () => {
    setSelectedNote(null);
    setModalType(null);
  };

  const applyQuickFilter = (search: string, branch: string, semester: string) => {
    setSearchQuery(search);
    setSelectedBranch(branch);
    setSelectedSemester(semester);
  };

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

  const handleDownloadClick = useCallback((note: Note) => {
    if (note.price && note.price > 0) {
      setCheckoutNote(note);
      setCheckoutEmail(userEmail || "");
      setCheckoutStatus("idle");
      setShowCheckoutPrompt(true);
    } else {
      openModal(note, "pdf");
    }
  }, [userEmail, openModal]);

  // Automatic purchase recovery on redirect
  useEffect(() => {
    if (authState === "ready" && notes.length > 0 && unlockNoteId) {
      const targetNote = notes.find((n) => n.id === unlockNoteId);
      if (targetNote) {
        const timer = setTimeout(() => {
          handleDownloadClick(targetNote);
        }, 0);
        const url = new URL(window.location.href);
        url.searchParams.delete("unlock");
        window.history.replaceState({}, "", url.toString());
        return () => clearTimeout(timer);
      }
    }
  }, [authState, notes, unlockNoteId, handleDownloadClick]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail.trim() || !checkoutNote) return;

    setCheckoutStatus("verifying");

    try {
      const cleanEmail = checkoutEmail.trim().toLowerCase();

      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("email", cleanEmail)
        .eq("note_id", checkoutNote.id)
        .eq("status", "success")
        .maybeSingle();

      if (purchase) {
        setCheckoutStatus("success");
        setShowCheckoutPrompt(false);
        openModal(checkoutNote, "pdf");
        return;
      }

      setCheckoutStatus("paying");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: checkoutNote.id, email: cleanEmail }),
      });

      const orderData = await res.json();
      if (orderData.error) {
        toast.error(`Checkout order creation error: ${orderData.error}`);
        setCheckoutStatus("idle");
        return;
      }

      setActiveOrderId(orderData.orderId);

      const rpayWindow = window as RazorpayWindow;
      if (!rpayWindow.Razorpay) {
        toast.warning("Razorpay payment checkout script failed to load. Please refresh the page.");
        setCheckoutStatus("idle");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Private Academy",
        description: `Unlock Note: ${checkoutNote.title}`,
        order_id: orderData.orderId,
        prefill: {
          email: cleanEmail,
        },
        handler: async function (response: RazorpayResponse) {
          setCheckoutStatus("verifying");
          try {
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setCheckoutStatus("success");
              setShowCheckoutPrompt(false);
              openModal(checkoutNote, "pdf");
              toast.success("Payment verified successfully! Access granted.");
            } else {
              toast.error(verifyData.error || "Payment verification failed.");
              setCheckoutStatus("idle");
            }
          } catch (err) {
            console.error("Verification endpoint post failed:", err);
            toast.error("Connection error during verification. Try syncing your payment.");
            setCheckoutStatus("idle");
          }
        },
        modal: { ondismiss: function () { setCheckoutStatus("idle"); } },
        theme: {
          color: "#fbbf24",
        },
      };

      const paymentObject = new rpayWindow.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Checkout submission failed:", err);
      toast.error("Error starting checkout process.");
      setCheckoutStatus("idle");
    }
  };

  // Synchronize payment status manually (fallback if client gets out of sync)
  const handleSyncPayment = async () => {
    if (!activeOrderId) return;
    
    setCheckoutStatus("verifying");
    try {
      const res = await fetch("/api/verify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: activeOrderId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payment sync successful! Access granted.");
        setCheckoutStatus("success");
        setShowCheckoutPrompt(false);
        if (checkoutNote) {
          openModal(checkoutNote, "pdf");
        }
      } else {
        toast.warning(data.message || "Payment sync failed. No successful transaction found yet.");
        setCheckoutStatus("idle");
      }
    } catch (err) {
      console.error("Manual sync failed:", err);
      toast.error("Error checking payment status.");
      setCheckoutStatus("idle");
    }
  };

  if (authState === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading Private Academy...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (authState === "unauthenticated") return <LoginGate articles={articles} />;

  if (authState === "no-university") {
    return <UniversityGate onSelect={async () => { await refreshAuth(); }} />;
  }

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.heroSection} id="hero-section">
        <div className={styles.heroLeft}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(251, 191, 36, 0.08)",
            border: "1px solid rgba(251, 191, 36, 0.25)",
            borderRadius: "999px",
            padding: "0.4rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#facc15",
            alignSelf: "flex-start"
          }}>
            {userUniversity} Syllabus notes
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="hero-title">
            Study Smarter — <br />
            <span style={{
              background: "linear-gradient(135deg, var(--accent) 30%, #fb923c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Personalized Notes Library
            </span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "580px" }} id="hero-subtext">
            Access branch-wise folders, check semester filters, download exam materials, or watch tutorial walkthroughs — personalized for your university.
          </p>
          
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }} id="hero-actions">
            <a href="#search-section" className={styles.btnPrimary} style={{ padding: "0.8rem 1.5rem", fontWeight: 700, borderRadius: "var(--radius)" }} id="btn-explore-notes">
              Search Notes
            </a>
            <Link href="/projects" className={styles.btnSecondary} style={{ padding: "0.8rem 1.5rem", fontWeight: 600, borderRadius: "var(--radius)" }} id="btn-see-projects">
              Explore Projects
            </Link>
            <Link href="/careers" className={styles.btnSecondary} style={{ padding: "0.8rem 1.5rem", fontWeight: 600, borderRadius: "var(--radius)" }} id="btn-see-careers">
              We&apos;re Hiring
            </Link>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }} id="hero-chips">
            <div className={styles.chip} onClick={() => applyQuickFilter("Structures", "All branches", "All semesters")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--accent)" }}>✓</span> Search instantly
            </div>
            <div className={styles.chip} onClick={() => applyQuickFilter("", "Computer", "Sem 3")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--accent)" }}>✓</span> Branch filters
            </div>
            <div className={styles.chip} onClick={() => applyQuickFilter("", "All branches", "Sem 5")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--accent)" }}>✓</span> Offline PDF access
            </div>
          </div>
        </div>

        {/* Hero Right Widget - Recent Feeds */}
        <aside style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "var(--shadow-lg)"
        }} id="recent-articles-widget">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>Recent Feeds</span>
            <Link href="/articles" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>
              View All →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {isLoading ? (
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "1.5rem 0", textAlign: "center" }}>Loading feeds...</div>
            ) : (
              articles.slice(0, 3).map((art) => (
                <Link href={`/articles/${art.id}`} key={art.id} className={styles.customWidgetCard}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{art.category}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{art.title}</span>
                  <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    <span>{art.readTime}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </section>

      {/* Search & Filter Panel */}
      <section className={styles.searchSection} style={{ padding: "2.5rem 2rem", borderRadius: "var(--radius-lg)" }} id="search-section">
        <div className={styles.sectionHeader} style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Search the library</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Narrow your syllabus search quickly by choosing branch, semester, and key topics.
          </p>
        </div>

        <div className={styles.filterForm}>
          <div className={styles.inputGroup}>
            <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search notes by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              id="search-notes-input"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className={styles.selectInput}
            id="filter-branch-select"
            aria-label="Filter by Branch"
          >
            <option value="All branches">All branches</option>
            <option value="Computer">Computer</option>
            <option value="IT">IT</option>
            <option value="AIML">AIML</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Chemical">Chemical</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className={styles.selectInput}
            id="filter-semester-select"
            aria-label="Filter by Semester"
          >
            <option value="All semesters">All semesters</option>
            <option value="Sem 1">Sem 1</option>
            <option value="Sem 2">Sem 2</option>
            <option value="Sem 3">Sem 3</option>
            <option value="Sem 4">Sem 4</option>
            <option value="Sem 5">Sem 5</option>
            <option value="Sem 6">Sem 6</option>
            <option value="Sem 7">Sem 7</option>
            <option value="Sem 8">Sem 8</option>
          </select>

          <button onClick={handleClearFilters} className={styles.btnClear} id="btn-clear-filters">
            Clear Filters
          </button>
        </div>

        <div className={styles.resultsMeta}>
          <span id="results-count" style={{ fontWeight: 600 }}>
            {isLoading ? "Syncing..." : `Found ${filteredNotes.length} matching study ${filteredNotes.length === 1 ? "sheet" : "sheets"}`}
          </span>
          {(searchQuery || selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
            <span style={{ 
              fontSize: "0.75rem", 
              fontWeight: 700, 
              padding: "0.2rem 0.5rem", 
              borderRadius: "4px", 
              background: "var(--accent-light)", 
              color: "var(--accent)", 
              border: "1px solid rgba(251,191,36,0.2)" 
            }}>
              Active Search Filters
            </span>
          )}
        </div>
      </section>

      {/* Featured Notes Section */}
      <section className={styles.notesSection} id="featured-notes-section">
        <div className={styles.sectionHeader} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Study notes catalog</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Select folders to download offline copy PDFs or review visual explanations.
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-secondary)" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(255,255,255,0.06)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1.25rem" }} />
            <h3>Syncing notes with database...</h3>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className={styles.grid}>
            {filteredNotes.map((note) => {
              const hasVideo = !!note.videoUrl;
              return (
                <article 
                  key={note.id} 
                  className={`${styles.noteCard} ${styles.noteCardGlow}`} 
                  id={note.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/notes/${note.id}`)}
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
                    {note.price && note.price > 0 ? (
                      <span style={{ fontSize: "0.725rem", fontWeight: 700, backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                        ₹{note.price}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.725rem", fontWeight: 700, backgroundColor: "rgba(34, 197, 94, 0.12)", color: "#22c55e", padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                        Free
                      </span>
                    )}
                  </div>
                  <p className={styles.noteCardDesc}>{note.description}</p>

                  <div className={styles.noteCardActions} style={{ 
                    display: "grid", 
                    gridTemplateColumns: hasVideo ? "1fr 1fr" : "1fr",
                    gap: "0.5rem" 
                  }}>
                    {hasVideo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(note, "video");
                        }}
                        className={`${styles.btnNoteAction} ${styles.btnNoteWatch}`}
                        id={`btn-watch-video-${note.id}`}
                      >
                        Watch Video
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadClick(note);
                      }}
                      className={`${styles.btnNoteAction} ${note.price && note.price > 0 ? styles.btnNoteDownload : styles.btnNoteDownloadFree}`}
                      id={`btn-download-${note.id}`}
                      style={{ gridColumn: hasVideo ? "auto" : "span 2" }}
                    >
                      {note.price && note.price > 0 ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Unlock PDF
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.noResults} id="no-results-alert">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "1rem" }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3>No study notes found for {userUniversity}</h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Our contributors have not uploaded notes for this specific branch filter yet. Try adjusting or clearing search parameters.</p>
          </div>
        )}
      </section>

      {/* Checkout Modal */}
      {showCheckoutPrompt && checkoutNote && (
        <div className={styles.modalBackdrop} onClick={() => setShowCheckoutPrompt(false)} id="checkout-backdrop">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} id="checkout-modal-content">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Unlock Study Resource</h3>
              <button onClick={() => setShowCheckoutPrompt(false)} className={styles.modalCloseBtn} id="btn-close-checkout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{checkoutNote.title}</h4>
              {!userEmail ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                    You need to be signed in to purchase or access premium study guides.
                  </p>
                  <Link
                    href={`/login?redirect=/?unlock=${checkoutNote.id}`}
                    className={styles.btnPrimary}
                    style={{ justifyContent: "center", textDecoration: "none" }}
                    id="btn-login-to-purchase"
                  >
                    Log In / Sign Up
                  </Link>
                </div>
              ) : (
                <>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    This is a premium resource. Proceed to verify your past purchase or buy now for <strong>₹{checkoutNote.price}</strong>.
                  </p>
                  <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }} id="checkout-form">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label htmlFor="checkout-email" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Account Profile Email</label>
                      <input
                        type="email"
                        id="checkout-email"
                        required
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        disabled={true}
                        style={{ 
                          width: "100%", 
                          backgroundColor: "var(--background)", 
                          border: "1px solid var(--border)", 
                          borderRadius: "var(--radius-sm)", 
                          color: "var(--text-primary)", 
                          padding: "0.75rem 1rem", 
                          fontFamily: "var(--font-sans)", 
                          outline: "none", 
                          opacity: 0.75 
                        }}
                      />
                      <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600 }}>Logged in session email</span>
                    </div>
                    <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                      style={{ justifyContent: "center", marginTop: "0.25rem" }}
                      id="btn-trigger-payment-flow"
                    >
                      {checkoutStatus === "verifying" && "Checking database logs..."}
                      {checkoutStatus === "paying" && "Accessing secure Razorpay checkout..."}
                      {checkoutStatus === "idle" && "Proceed to Unlock"}
                    </button>
                    {activeOrderId && (
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={handleSyncPayment}
                          disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                          className={styles.btnSecondary}
                          style={{ width: "100%", border: "1px dashed var(--accent)", justifyContent: "center" }}
                          id="btn-sync-payment"
                        >
                          {checkoutStatus === "verifying" ? "Syncing..." : "Already Paid? Sync Payment Status"}
                        </button>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center" }}>
                          Use this if your payment was deducted but the note did not unlock.
                        </span>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowCheckoutPrompt(false)} className={styles.btnSecondary} id="btn-close-checkout-footer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Video / PDF Modal */}
      {modalType && selectedNote && (
        <div className={styles.modalBackdrop} onClick={closeModal} id="modal-backdrop">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} id="modal-content-container">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalType === "video" && "Video Walkthrough"}
                {modalType === "pdf" && "Download PDF File"}
              </h3>
              <button onClick={closeModal} className={styles.modalCloseBtn} id="btn-close-modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span className={styles.tagBranch}>{selectedNote.branch}</span>
                <span className={styles.badgeSemester}>{selectedNote.semester}</span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{selectedNote.title}</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>{selectedNote.description}</p>

              {modalType === "video" && (
                <div className={styles.videoWrapper} id="video-preview-iframe">
                  <iframe
                    src={selectedNote.videoUrl}
                    title={`${selectedNote.title} Video Walkthrough`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {modalType === "pdf" && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "2.5rem 1.5rem", 
                  backgroundColor: "var(--background)", 
                  borderRadius: "var(--radius)", 
                  border: "1px dashed var(--border)" 
                }} id="pdf-download-pane">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" style={{ marginBottom: "1.25rem" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <polyline points="9 15 12 18 15 15"></polyline>
                  </svg>
                  <h5 style={{ fontSize: "1rem", fontWeight: 700 }}>{selectedNote.title}.pdf</h5>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>File extension: PDF | Instant CDN Delivery</p>
                  <button
                    onClick={() => handleDownload(selectedNote.id, selectedNote.title)}
                    className={styles.btnPrimary}
                    style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
                    disabled={downloadingPdf}
                    id="btn-trigger-pdf-download"
                  >
                    {downloadingPdf ? "Downloading file..." : "Download PDF File"}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnSecondary} id="btn-close-modal-footer">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
