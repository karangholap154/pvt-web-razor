"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "../../app/page.module.css";
import { Note } from "../../data/mockData";
import { supabase } from "../../utils/supabaseClient";
import { loadRazorpayScript } from "../../utils/razorpay";
import LoginGate from "../landing/LoginGate";
import UniversityGate from "../landing/UniversityGate";
import UsernameGate from "../landing/UsernameGate";
import { FaFolder, FaFolderOpen, FaGraduationCap, FaChevronRight, FaArrowLeft } from "react-icons/fa6";

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
  const { authState, email: userEmail, username: userUsername, university: userUniversity, defaultBranch, defaultSemester, refreshAuth } = useAuth();

  // Live database states
  const [metaNotes, setMetaNotes] = useState<{ id: string; title: string; branch: string; semester: string }[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search state (initialized in useEffect based on preferences)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedSemester, setSelectedSemester] = useState("All semesters");
  const [searchOpen, setSearchOpen] = useState(false);

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

  // Sync URL search params into filter state on load if present
  useEffect(() => {
    const b = searchParams.get("branch");
    const s = searchParams.get("semester");
    const q = searchParams.get("q");
    if (b) setSelectedBranch(b);
    if (s) setSelectedSemester(s);
    if (q) {
      setSearchQuery(q);
      setDebouncedSearchQuery(q);
    }
  }, [searchParams]);

  // Set default filters when auth state is ready or preferences change (if not overridden by URL params)
  useEffect(() => {
    if (authState === "ready") {
      if (defaultBranch && !searchParams.get("branch")) setSelectedBranch(defaultBranch);
      if (defaultSemester && !searchParams.get("semester")) setSelectedSemester(defaultSemester);
    }
  }, [authState, defaultBranch, defaultSemester, searchParams]);

  // ── Fetch server-side filtered notes via /api/notes ─────────────────────
  useEffect(() => {
    if (authState !== "ready" || !userUniversity) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          university: userUniversity!,
        });

        if (selectedBranch && selectedBranch !== "All branches") {
          queryParams.set("branch", selectedBranch);
        }
        if (selectedSemester && selectedSemester !== "All semesters") {
          queryParams.set("semester", selectedSemester);
        }
        if (debouncedSearchQuery && debouncedSearchQuery.trim() !== "") {
          queryParams.set("q", debouncedSearchQuery.trim());
        }

        const res = await fetch(`/api/notes?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch notes: ${res.statusText}`);
        }

        const data = await res.json();

        const formattedNotes: Note[] = (data.notes || []).map((item: {
          id: string;
          title: string;
          branch: string;
          semester: string;
          download_url?: string;
          video_url?: string;
          price?: number | string;
          university?: string;
          is_community_contributed?: boolean;
          contributor_id?: string;
          contributor_username?: string;
          contributor_name?: string;
        }) => ({
          id: item.id,
          title: item.title,
          branch: item.branch as Note["branch"],
          semester: item.semester as Note["semester"],
          description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
          downloadUrl: item.download_url || "",
          videoUrl: item.video_url || "",
          price: item.price ? Number(item.price) : 0,
          university: item.university || undefined,
          is_community_contributed: item.is_community_contributed,
          contributor_id: item.contributor_id,
          contributor_username: item.contributor_username,
          contributor_name: item.contributor_name,
        }));

        setNotes(formattedNotes);
        if (data.meta) {
          setMetaNotes(data.meta);
        }
      } catch (err) {
        console.error("Error loading notes from API:", err);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [authState, userUniversity, selectedBranch, selectedSemester, debouncedSearchQuery]);

  // Server pre-filters notes, so filteredNotes simply references state notes
  const filteredNotes = notes;

  // ── Folder grouping computed states (computed from metaNotes) ─────────────
  const activeBranches = useMemo(() => {
    const branches = new Set<string>();
    metaNotes.forEach((note) => {
      if (note.branch) branches.add(note.branch);
    });
    return Array.from(branches).sort();
  }, [metaNotes]);

  const branchSemestersMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    metaNotes.forEach((note) => {
      if (!note.branch || !note.semester) return;
      if (!map[note.branch]) {
        map[note.branch] = [];
      }
      if (!map[note.branch].includes(note.semester)) {
        map[note.branch].push(note.semester);
      }
    });
    Object.keys(map).forEach((br) => {
      map[br].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    });
    return map;
  }, [metaNotes]);

  const branchNotesCount = useMemo(() => {
    const count: Record<string, number> = {};
    metaNotes.forEach((note) => {
      if (!note.branch) return;
      count[note.branch] = (count[note.branch] || 0) + 1;
    });
    return count;
  }, [metaNotes]);

  const semesterNotesCount = useMemo(() => {
    const count: Record<string, number> = {};
    metaNotes.forEach((note) => {
      if (!note.branch || !note.semester) return;
      const key = `${note.branch}-${note.semester}`;
      count[key] = (count[key] || 0) + 1;
    });
    return count;
  }, [metaNotes]);

  const folderPreviewsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    metaNotes.forEach((note) => {
      if (!note.branch || !note.semester) return;
      const key = `${note.branch}-${note.semester}`;
      if (!map[key]) {
        map[key] = [];
      }
      if (map[key].length < 3) {
        map[key].push(note.title);
      }
    });
    return map;
  }, [metaNotes]);

  const getBranchFolderClass = useCallback((branch: string) => {
    switch (branch) {
      case "Computer Engineering": return styles.folderComputer;
      case "Information Technology": return styles.folderIT;
      case "AIML": return styles.folderAIML;
      case "Mechanical": return styles.folderMechanical;
      case "Chemical": return styles.folderChemical;
      default: return styles.folderDefault;
    }
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const openModal = useCallback((note: Note, type: "video" | "pdf") => {
    setSelectedNote(note);
    setModalType(type);
  }, []);

  const closeModal = () => {
    setSelectedNote(null);
    setModalType(null);
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

      // Load Razorpay script dynamically
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay payment gateway. Please check your internet connection.");
        setCheckoutStatus("idle");
        return;
      }

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
                noteId: checkoutNote.id,
                email: cleanEmail,
                amount: orderData.amount,
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

  if (authState === "unauthenticated") return <LoginGate />;

  if (authState === "no-username") {
    return <UsernameGate email={userEmail} onComplete={async () => { await refreshAuth(); }} />;
  }

  if (authState === "no-university") {
    return <UniversityGate onSelect={async () => { await refreshAuth(); }} />;
  }

  return (
    <main className={styles.main}>
      {/* Personalized Welcome Banner */}
      <section className={styles.welcomeBanner} id="dashboard-welcome-banner">
        <div className={styles.welcomeLeft}>
          <div className={styles.welcomeUnivBadge}>
            🎓 {userUniversity} Library
          </div>
          <h1 className={styles.welcomeTitle} id="welcome-title">
            Welcome back,{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--accent) 30%, #fb923c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              {userUsername ?? "Student"}
            </span>{" "}👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            Your branch folders, semester filters, and exam materials are ready below.
          </p>
        </div>
        <div className={styles.welcomeActions}>
          <Link
            href="/dashboard"
            className={styles.btnSecondary}
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem" }}
            id="btn-go-to-dashboard"
          >
            Open My Library 
          </Link>
        </div>
      </section>

      {/* Featured Notes Section */}
      <section className={styles.notesSection} id="featured-notes-section">
        <div className={styles.catalogHeader}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Study notes catalog</h2>

          </div>

          {/* Desktop: inline search */}
          <div className={styles.catalogSearchDesktop}>
            <div className={styles.inputGroup} style={{ minWidth: "260px" }}>
              <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="search-notes-input"
                style={{ fontSize: "0.875rem", padding: "0.65rem 1rem 0.65rem 2.5rem" }}
              />
            </div>
            {searchQuery && (
              <button onClick={handleClearFilters} className={styles.btnClearMinimal} aria-label="Clear search">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Mobile: icon toggle */}
          <div className={styles.catalogSearchMobile}>
            <button
              className={styles.searchIconBtn}
              onClick={() => { setSearchOpen(v => !v); if (searchOpen) setSearchQuery(""); }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              id="btn-toggle-search"
            >
              {searchOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile expanded search input */}
        {searchOpen && (
          <div className={styles.mobileSearchExpanded} id="mobile-search-expanded">
            <div className={styles.inputGroup}>
              <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="search-notes-input-mobile"
                autoFocus
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-secondary)" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(255,255,255,0.06)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1.25rem" }} />
            <h3>Syncing notes with database...</h3>
          </div>
        ) : debouncedSearchQuery !== "" || (selectedBranch === "All branches" && selectedSemester !== "All semesters") ? (
          /* Flat list mode for Search or Semester-only filtering */
          <div>
            {/* Context-aware Breadcrumbs Navigation for search or semester filtering */}
            <div className={styles.breadcrumbsContainer}>
              <div className={styles.breadcrumbs}>
                <span 
                  className={styles.breadcrumbLink} 
                  onClick={() => {
                    setSelectedBranch("All branches");
                    setSelectedSemester("All semesters");
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, () => {
                    setSelectedBranch("All branches");
                    setSelectedSemester("All semesters");
                  })}
                >
                  <FaGraduationCap style={{ fontSize: "1.1rem" }} /> Library
                </span>
                
                {selectedBranch !== "All branches" && (
                  <>
                    <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                    <span 
                      className={selectedSemester === "All semesters" ? styles.breadcrumbActive : styles.breadcrumbLink}
                      onClick={() => {
                        if (selectedSemester !== "All semesters") {
                          setSelectedSemester("All semesters");
                        }
                      }}
                      role={selectedSemester !== "All semesters" ? "button" : undefined}
                      tabIndex={selectedSemester !== "All semesters" ? 0 : undefined}
                      onKeyDown={selectedSemester !== "All semesters" ? (e) => handleKeyDown(e, () => setSelectedSemester("All semesters")) : undefined}
                    >
                      {selectedBranch}
                    </span>
                  </>
                )}
                
                {selectedSemester !== "All semesters" && (
                  <>
                    <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                    <span className={styles.breadcrumbActive}>
                      {selectedSemester}
                    </span>
                  </>
                )}
              </div>

              {(selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
                <button 
                  className={styles.btnBreadcrumbBack}
                  onClick={() => {
                    if (selectedSemester !== "All semesters") {
                      setSelectedSemester("All semesters");
                    } else {
                      setSelectedBranch("All branches");
                    }
                  }}
                >
                  <FaArrowLeft /> Back
                </button>
              )}
            </div>

            {debouncedSearchQuery !== "" && (
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
                Search Results for &quot;{debouncedSearchQuery}&quot;
                {selectedBranch !== "All branches" && ` in ${selectedBranch}`}
                {selectedSemester !== "All semesters" && ` (Semester ${selectedSemester})`}
              </h3>
            )}
            {selectedBranch === "All branches" && selectedSemester !== "All semesters" && debouncedSearchQuery === "" && (
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
                Showing all {selectedSemester} notes
              </h3>
            )}
            {filteredNotes.length > 0 ? (
              <div className={styles.grid}>
                {filteredNotes.map((note) => {
                  const hasVideo = !!note.videoUrl;
                  const isStudentNote = !!(note.is_community_contributed || note.contributor_id);
                  return (
                    <article 
                      key={note.id} 
                      className={`${styles.noteCard} ${styles.noteCardGlow}`} 
                      id={note.id}
                      style={{ 
                        cursor: "pointer",
                        borderColor: isStudentNote ? "rgba(168, 85, 247, 0.3)" : undefined
                      }}
                      onClick={() => router.push(`/notes/${note.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => router.push(`/notes/${note.id}`))}
                      onMouseEnter={(e) => {
                        if (isStudentNote) {
                          e.currentTarget.style.borderColor = "#c084fc";
                          e.currentTarget.style.boxShadow = "0 10px 24px -10px rgba(168, 85, 247, 0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isStudentNote) {
                          e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      <div className={styles.noteCardHeader}>
                        <h3 className={styles.noteCardTitle}>
                          <Link 
                            href={`/notes/${note.id}`} 
                            style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = isStudentNote ? "#c084fc" : "var(--accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                          >
                            {note.title}
                          </Link>
                        </h3>
                      </div>
                      <div className={styles.badgeRow}>
                        {isStudentNote ? (
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(168, 85, 247, 0.12)", color: "#c084fc", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                            {note.branch}
                          </span>
                        ) : (
                          <span className={styles.tagBranch}>{note.branch}</span>
                        )}
                        <span className={styles.badgeSemester}>{note.semester}</span>
                        {note.price && note.price > 0 ? (
                          <span style={{ fontSize: "0.725rem", fontWeight: 700, backgroundColor: isStudentNote ? "rgba(168, 85, 247, 0.15)" : "rgba(245, 158, 11, 0.12)", color: isStudentNote ? "#c084fc" : "#f59e0b", padding: "0.2rem 0.5rem", borderRadius: "4px", border: isStudentNote ? "1px solid rgba(168, 85, 247, 0.3)" : "1px solid rgba(245, 158, 11, 0.2)" }}>
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
                          style={{ 
                            gridColumn: hasVideo ? "auto" : "span 2",
                            background: isStudentNote && note.price && note.price > 0 ? "rgba(168, 85, 247, 0.15)" : undefined,
                            color: isStudentNote && note.price && note.price > 0 ? "#c084fc" : undefined,
                            borderColor: isStudentNote && note.price && note.price > 0 ? "rgba(168, 85, 247, 0.3)" : undefined,
                          }}
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

                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.15rem" }}>
                        {note.is_community_contributed || note.contributor_id ? (
                          note.contributor_username ? (
                            <Link
                              href={`/u/${note.contributor_username}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ textDecoration: "none" }}
                            >
                              <span style={{ 
                                fontSize: "0.68rem", 
                                fontWeight: 700, 
                                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(147, 51, 234, 0.28))", 
                                color: "#c084fc", 
                                padding: "0.15rem 0.5rem", 
                                borderRadius: "4px", 
                                border: "1px solid rgba(168, 85, 247, 0.4)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                cursor: "pointer"
                              }}>
                                🎓 By @{note.contributor_username}
                              </span>
                            </Link>
                          ) : (
                            <span style={{ 
                              fontSize: "0.68rem", 
                              fontWeight: 700, 
                              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(147, 51, 234, 0.28))", 
                              color: "#c084fc", 
                              padding: "0.15rem 0.5rem", 
                              borderRadius: "4px", 
                              border: "1px solid rgba(168, 85, 247, 0.4)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem"
                            }}>
                              🎓 Student Contribution
                            </span>
                          )
                        ) : (
                          <span style={{ 
                            fontSize: "0.68rem", 
                            fontWeight: 700, 
                            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.28))", 
                            color: "#fbbf24", 
                            padding: "0.15rem 0.5rem", 
                            borderRadius: "4px", 
                            border: "1px solid rgba(245, 158, 11, 0.4)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem"
                          }}>
                            🏛️ Official Platform Note
                          </span>
                        )}
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
          </div>
        ) : (
          /* Folder navigation mode */
          <div>
            <div className={styles.breadcrumbsContainer}>
              <div className={styles.breadcrumbs}>
                <span 
                  className={styles.breadcrumbLink} 
                  onClick={() => {
                    setSelectedBranch("All branches");
                    setSelectedSemester("All semesters");
                  }}
                >
                  <FaGraduationCap style={{ fontSize: "1.1rem" }} /> Library
                </span>
                
                {selectedBranch !== "All branches" && (
                  <>
                    <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                    <span 
                      className={selectedSemester === "All semesters" ? styles.breadcrumbActive : styles.breadcrumbLink}
                      onClick={() => {
                        if (selectedSemester !== "All semesters") {
                          setSelectedSemester("All semesters");
                        }
                      }}
                    >
                      {selectedBranch}
                    </span>
                  </>
                )}
                
                {selectedSemester !== "All semesters" && (
                  <>
                    <span className={styles.breadcrumbSeparator}><FaChevronRight style={{ fontSize: "0.7rem" }} /></span>
                    <span className={styles.breadcrumbActive}>
                      {selectedSemester}
                    </span>
                  </>
                )}
              </div>

              {(selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
                <button 
                  className={styles.btnBreadcrumbBack}
                  onClick={() => {
                    if (selectedSemester !== "All semesters") {
                      setSelectedSemester("All semesters");
                    } else {
                      setSelectedBranch("All branches");
                    }
                  }}
                >
                  <FaArrowLeft /> Back
                </button>
              )}
            </div>

            {notes.length === 0 ? (
              <div className={styles.noResults} id="no-results-alert">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "1rem" }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>No study notes found for {userUniversity}</h3>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Our contributors have not uploaded notes for this specific branch filter yet. Try adjusting or clearing search parameters.</p>
              </div>
            ) : selectedBranch === "All branches" ? (
              /* Level 1: Branch Folders */
              activeBranches.length > 0 ? (
                <div className={styles.folderGrid}>
                  {activeBranches.map((branch) => {
                    const semesters = branchSemestersMap[branch] || [];
                    const count = branchNotesCount[branch] || 0;
                    return (
                      <div 
                        key={branch} 
                        className={`${styles.folderCard} ${getBranchFolderClass(branch)}`}
                        onClick={() => setSelectedBranch(branch)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, () => setSelectedBranch(branch))}
                      >
                        <div className={styles.folderIconContainer}>
                          <FaFolder className={styles.folderClosedIcon} />
                          <FaFolderOpen className={styles.folderOpenedIcon} />
                        </div>
                        <div className={styles.folderHeaderInfo}>
                          <h3 className={styles.folderTitle}>{branch}</h3>
                          <span className={styles.folderStats}>{count} study {count === 1 ? "sheet" : "sheets"} available</span>
                        </div>
                        <div className={styles.folderBadges}>
                          {semesters.map((sem) => (
                            <span key={sem} className={styles.folderMiniBadge}>{sem}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <p>No active folders found for {userUniversity}.</p>
                </div>
              )
            ) : selectedSemester === "All semesters" ? (
              /* Level 2: Semester Folders */
              (branchSemestersMap[selectedBranch] || []).length > 0 ? (
                <div className={styles.folderGrid}>
                  {(branchSemestersMap[selectedBranch] || []).map((sem) => {
                    const key = `${selectedBranch}-${sem}`;
                    const count = semesterNotesCount[key] || 0;
                    const previews = folderPreviewsMap[key] || [];
                    return (
                      <div 
                        key={sem} 
                        className={`${styles.folderCard} ${getBranchFolderClass(selectedBranch)}`}
                        onClick={() => setSelectedSemester(sem)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, () => setSelectedSemester(sem))}
                      >
                        <div className={styles.folderIconContainer}>
                          <FaFolder className={styles.folderClosedIcon} />
                          <FaFolderOpen className={styles.folderOpenedIcon} />
                        </div>
                        <div className={styles.folderHeaderInfo}>
                          <h3 className={styles.folderTitle}>{sem} Folder</h3>
                          <span className={styles.folderStats}>{count} study {count === 1 ? "sheet" : "sheets"} inside</span>
                        </div>
                        {previews.length > 0 && (
                          <ul className={styles.folderPreviewList}>
                            {previews.map((title, idx) => (
                              <li key={idx}>{title}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <p>No semesters active under {selectedBranch} Engineering.</p>
                </div>
              )
            ) : (
              /* Level 3: Notes Grid for selected branch & semester */
              filteredNotes.length > 0 ? (
                <div className={styles.grid}>
                  {filteredNotes.map((note) => {
                    const hasVideo = !!note.videoUrl;
                    const isStudentNote = !!(note.is_community_contributed || note.contributor_id);
                    return (
                      <article 
                        key={note.id} 
                        className={`${styles.noteCard} ${styles.noteCardGlow}`} 
                        id={note.id}
                        style={{ 
                          cursor: "pointer",
                          borderColor: isStudentNote ? "rgba(168, 85, 247, 0.3)" : undefined
                        }}
                        onClick={() => router.push(`/notes/${note.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, () => router.push(`/notes/${note.id}`))}
                        onMouseEnter={(e) => {
                          if (isStudentNote) {
                            e.currentTarget.style.borderColor = "#c084fc";
                            e.currentTarget.style.boxShadow = "0 10px 24px -10px rgba(168, 85, 247, 0.35)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isStudentNote) {
                            e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        <div className={styles.noteCardHeader}>
                          <h3 className={styles.noteCardTitle}>
                            <Link 
                              href={`/notes/${note.id}`} 
                              style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = isStudentNote ? "#c084fc" : "var(--accent)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                            >
                              {note.title}
                            </Link>
                          </h3>
                        </div>
                        <div className={styles.badgeRow}>
                          {isStudentNote ? (
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(168, 85, 247, 0.12)", color: "#c084fc", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                              {note.branch}
                            </span>
                          ) : (
                            <span className={styles.tagBranch}>{note.branch}</span>
                          )}
                          <span className={styles.badgeSemester}>{note.semester}</span>
                          {note.price && note.price > 0 ? (
                            <span style={{ fontSize: "0.725rem", fontWeight: 700, backgroundColor: isStudentNote ? "rgba(168, 85, 247, 0.15)" : "rgba(245, 158, 11, 0.12)", color: isStudentNote ? "#c084fc" : "#f59e0b", padding: "0.2rem 0.5rem", borderRadius: "4px", border: isStudentNote ? "1px solid rgba(168, 85, 247, 0.3)" : "1px solid rgba(245, 158, 11, 0.2)" }}>
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
                            style={{ 
                              gridColumn: hasVideo ? "auto" : "span 2",
                              background: isStudentNote && note.price && note.price > 0 ? "rgba(168, 85, 247, 0.15)" : undefined,
                              color: isStudentNote && note.price && note.price > 0 ? "#c084fc" : undefined,
                              borderColor: isStudentNote && note.price && note.price > 0 ? "rgba(168, 85, 247, 0.3)" : undefined,
                            }}
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

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.15rem" }}>
                          {note.is_community_contributed || note.contributor_id ? (
                            note.contributor_username ? (
                              <Link
                                href={`/u/${note.contributor_username}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{ textDecoration: "none" }}
                              >
                                <span style={{ 
                                  fontSize: "0.68rem", 
                                  fontWeight: 700, 
                                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(147, 51, 234, 0.28))", 
                                  color: "#c084fc", 
                                  padding: "0.15rem 0.5rem", 
                                  borderRadius: "4px", 
                                  border: "1px solid rgba(168, 85, 247, 0.4)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  cursor: "pointer"
                                }}>
                                  🎓 By @{note.contributor_username}
                                </span>
                              </Link>
                            ) : (
                              <span style={{ 
                                fontSize: "0.68rem", 
                                fontWeight: 700, 
                                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(147, 51, 234, 0.28))", 
                                color: "#c084fc", 
                                padding: "0.15rem 0.5rem", 
                                borderRadius: "4px", 
                                border: "1px solid rgba(168, 85, 247, 0.4)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem"
                              }}>
                                🎓 Student Contribution
                              </span>
                            )
                          ) : (
                            <span style={{ 
                              fontSize: "0.68rem", 
                              fontWeight: 700, 
                              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.28))", 
                              color: "#fbbf24", 
                              padding: "0.15rem 0.5rem", 
                              borderRadius: "4px", 
                              border: "1px solid rgba(245, 158, 11, 0.4)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem"
                            }}>
                              🏛️ Official Platform Note
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <p>No study sheets found inside {selectedBranch} Engineering {selectedSemester}.</p>
                </div>
              )
            )}
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
