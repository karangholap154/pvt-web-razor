"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import styles from "../../app/page.module.css";
import { Note } from "../../data/mockData";
import { downloadNotePdf } from "@/utils/download";
import { mapDbRowToNote, RawNoteRow } from "@/utils/noteMapper";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import LoginGate from "../landing/LoginGate";
import UniversityGate from "../landing/UniversityGate";
import UsernameGate from "../landing/UsernameGate";
import BannedGate from "../landing/BannedGate";
import NotesCatalog from "./NotesCatalog";
import { FaChevronRight } from "react-icons/fa6";

interface HomeContentProps {
  initialNotes?: Note[];
  initialMeta?: { id: string; title: string; branch: string; semester: string; university?: string }[];
  catalogMode?: "official" | "community" | "all";
}

export default function HomeContent({ initialNotes = [], initialMeta = [], catalogMode = "all" }: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unlockNoteId = searchParams.get("unlock");

  // Consume global authentication state
  const { authState, email: userEmail, username: userUsername, university: userUniversity, defaultBranch, defaultSemester, refreshAuth } = useAuth();

  // Live database states
  const [metaNotes, setMetaNotes] = useState<{ id: string; title: string; branch: string; semester: string; university?: string }[]>(initialMeta);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUniv, setSelectedUniv] = useState("All universities");

  const availableUniversities = useMemo(() => {
    const set = new Set<string>();
    metaNotes.forEach((m) => {
      if (m.university) set.add(m.university);
    });
    if (set.size === 0) {
      ["Mumbai University", "SPPU (Pune)", "DBATU", "RTMNU (Nagpur)"].forEach((u) => set.add(u));
    }
    return Array.from(set).sort();
  }, [metaNotes]);

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
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const {
    checkoutStatus,
    setCheckoutStatus,
    activeOrderId,
    startCheckout,
    syncPayment,
  } = useRazorpayCheckout({
    onSuccess: (noteId) => {
      setShowCheckoutPrompt(false);
      const target = checkoutNote || notes.find((n) => n.id === noteId);
      if (target) openModal(target, "pdf");
    },
  });

  // Sync URL search params into filter state on load if present
  useEffect(() => {
    const b = searchParams.get("branch");
    const s = searchParams.get("semester");
    const q = searchParams.get("q");
    const u = searchParams.get("university");
    if (b) setSelectedBranch(b);
    if (s) setSelectedSemester(s);
    if (u) setSelectedUniv(u);
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
    // For unauthenticated visitors on default initial load, use pre-rendered initialNotes to preserve Supabase free tier bandwidth
    if (
      authState === "unauthenticated" &&
      selectedUniv === "All universities" &&
      selectedBranch === "All branches" &&
      selectedSemester === "All semesters" &&
      !debouncedSearchQuery &&
      initialNotes.length > 0
    ) {
      setNotes(initialNotes);
      setMetaNotes(initialMeta);
      return;
    }

    if (authState === "loading") return;
    if (authState === "ready" && !userUniversity) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const activeUniv = userUniversity || (selectedUniv !== "All universities" ? selectedUniv : "");

        if (activeUniv) {
          queryParams.set("university", activeUniv);
        }
        if (selectedBranch && selectedBranch !== "All branches") {
          queryParams.set("branch", selectedBranch);
        }
        if (selectedSemester && selectedSemester !== "All semesters") {
          queryParams.set("semester", selectedSemester);
        }
        if (debouncedSearchQuery && debouncedSearchQuery.trim() !== "") {
          queryParams.set("q", debouncedSearchQuery.trim());
        }
        if (catalogMode && catalogMode !== "all") {
          queryParams.set("source", catalogMode);
        }

        const res = await fetch(`/api/notes?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch notes: ${res.statusText}`);
        }

        const data = await res.json();

        const formattedNotes: Note[] = (data.notes || []).map((item: RawNoteRow) =>
          mapDbRowToNote(item)
        );

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
  }, [authState, userUniversity, selectedUniv, selectedBranch, selectedSemester, debouncedSearchQuery, initialNotes, initialMeta, catalogMode]);

  // Server pre-filters notes, so filteredNotes simply references state notes
  const filteredNotes = notes;

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedBranch("All branches");
    setSelectedSemester("All semesters");
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
      await downloadNotePdf(noteId, title);
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
  }, [userEmail, openModal, setCheckoutStatus]);

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
    await startCheckout(checkoutNote, checkoutEmail);
  };

  const handleSyncPayment = async () => {
    const success = await syncPayment();
    if (success && checkoutNote) {
      setShowCheckoutPrompt(false);
      openModal(checkoutNote, "pdf");
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

  const renderModals = () => (
    <>
      {/* Checkout Modal */}
      {showCheckoutPrompt && checkoutNote && (
        <div className={styles.modalBackdrop} onClick={() => setShowCheckoutPrompt(false)} id="checkout-backdrop">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} id="checkout-modal-content">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ maxWidth: "85%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Unlock: {checkoutNote.title}
              </h3>
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
                    Sign in with your account to purchase or access your unlocked study materials.
                  </p>
                  <Link
                    href={`/login?redirect=/?unlock=${checkoutNote.id}`}
                    className={styles.btnPrimary}
                    style={{ justifyContent: "center", textDecoration: "none" }}
                    id="btn-login-to-purchase"
                  >
                    Sign in to unlock
                  </Link>
                </div>
              ) : (
                <>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    This is a premium resource. Verify your past purchase or unlock instant access for <strong>₹{checkoutNote.price}</strong>.
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
                      {checkoutStatus === "verifying" && "Checking your purchase..."}
                      {checkoutStatus === "paying" && "Opening payment..."}
                      {checkoutStatus === "idle" && `Unlock for ₹${checkoutNote.price}`}
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
                          {checkoutStatus === "verifying" ? "Connecting..." : "Already paid? Recover access"}
                        </button>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center" }}>
                          Paid but can&apos;t access? This will reconnect your payment.
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
    </>
  );

  if (authState === "unauthenticated") {
    return (
      <>
        <LoginGate
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedUniv={selectedUniv}
          setSelectedUniv={setSelectedUniv}
          availableUniversities={availableUniversities}
          resultsCount={filteredNotes.length}
        >

          <NotesCatalog
            notes={filteredNotes}
            metaNotes={metaNotes}
            isLoading={isLoading}
            catalogMode={catalogMode}
            selectedUniv={selectedUniv}
            onSelectUniv={setSelectedUniv}
            availableUniversities={availableUniversities}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            debouncedSearchQuery={debouncedSearchQuery}
            searchOpen={searchOpen}
            onToggleSearchOpen={() => {
              setSearchOpen((v) => !v);
              if (searchOpen) setSearchQuery("");
            }}
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
            selectedSemester={selectedSemester}
            onSelectSemester={setSelectedSemester}
            onClearFilters={handleClearFilters}
            onOpenVideoModal={(n) => openModal(n, "video")}
            onNoteAction={(n) => router.push(`/notes/${n.id}`)}
            variant="unauth"
            searchIdPrefix="unauth"
          />


        {/* High Conversion Callout Banner */}
        <section style={{
          background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 146, 60, 0.08) 100%)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          borderRadius: "16px",
          padding: "1.75rem 2rem",
          margin: "2.5rem 0 1rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem"
        }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.35rem" }}>
              Found the study guide for your exam? 🎓
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
              Sign up in 15 seconds to download offline PDF copies, access visual video walkthroughs, and unlock full guides.
            </p>
          </div>
          <Link href="/login" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "var(--accent)",
            color: "#000",
            fontWeight: 800,
            fontSize: "0.9rem",
            padding: "0.75rem 1.75rem",
            borderRadius: "10px",
            textDecoration: "none",
          }}>
            Sign Up / Log In to Unlock <FaChevronRight style={{ fontSize: "0.75rem" }} />
          </Link>
        </section>
      </LoginGate>
        {renderModals()}
      </>
    );
  }

  if (authState === "banned") {
    return <BannedGate email={userEmail} onSignOut={async () => { await refreshAuth(); }} />;
  }

  if (authState === "no-username") {
    return <UsernameGate email={userEmail} onComplete={async () => { await refreshAuth(); }} />;
  }

  if (authState === "no-university") {
    return <UniversityGate onSelect={async () => { await refreshAuth(); }} />;
  }

  return (
    <main className={styles.main}>
      {/* Compact Logged-In Student Header */}
      <section style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
        padding: "1rem 1.25rem",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Welcome back, <span style={{ color: "var(--accent)" }}>{userUsername ?? "Student"}</span> 👋
          </span>
          <span style={{
            fontSize: "0.775rem",
            fontWeight: 700,
            background: "rgba(251, 191, 36, 0.12)",
            color: "var(--accent)",
            padding: "0.25rem 0.65rem",
            borderRadius: "999px",
            border: "1px solid rgba(251, 191, 36, 0.25)"
          }}>
            🎓 {userUniversity}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/contribute"
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            Contribute study notes
          </Link>
        </div>
      </section>

      {/* Featured Notes Catalog Section via centralized NotesCatalog */}
      <NotesCatalog
        notes={filteredNotes}
        metaNotes={metaNotes}
        isLoading={isLoading}
        catalogMode={catalogMode}
        userUniversity={userUniversity}
        selectedUniv={selectedUniv}
        onSelectUniv={setSelectedUniv}
        availableUniversities={availableUniversities}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        debouncedSearchQuery={debouncedSearchQuery}
        searchOpen={searchOpen}
        onToggleSearchOpen={() => {
          setSearchOpen((v) => !v);
          if (searchOpen) setSearchQuery("");
        }}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        selectedSemester={selectedSemester}
        onSelectSemester={setSelectedSemester}
        onClearFilters={handleClearFilters}
        onOpenVideoModal={(n) => openModal(n, "video")}
        onNoteAction={(n) => handleDownloadClick(n)}
        variant="catalog"
      />

      {renderModals()}
    </main>
  );
}
