"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import styles from "./HomeContent.module.css";
import { Note } from "../../data/mockData";
import { downloadNotePdf } from "@/utils/download";
import { useNotesFilter, NoteMeta } from "@/hooks/useNotesFilter";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import UniversityGate from "../landing/UniversityGate";
import UsernameGate from "../landing/UsernameGate";
import BannedGate from "../landing/BannedGate";
import NotesCatalog from "./NotesCatalog";
import { 
  LuSearch, 
  LuArrowRight, 
  LuPlay, 
  LuFileText, 
  LuDownload, 
  LuSparkles, 
  LuUsers, 
  LuX, 
  LuShieldCheck, 
  LuZap, 
  LuBookOpen,
  LuLock,
  LuCheck,
  LuMessageSquare
} from "react-icons/lu";

interface HomeContentProps {
  initialNotes?: Note[];
  initialMeta?: NoteMeta[];
  catalogMode?: "official" | "community" | "all";
}

export default function HomeContent({ 
  initialNotes = [], 
  initialMeta = [], 
  catalogMode = "all" 
}: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unlockNoteId = searchParams.get("unlock");

  // Consume global authentication state
  const { 
    authState, 
    email: userEmail, 
    username: userUsername, 
    university: userUniversity, 
    defaultBranch, 
    defaultSemester, 
    refreshAuth 
  } = useAuth();

  // Unified notes filtering, debouncing & API synchronization hook
  const {
    notes,
    metaNotes,
    isLoading,
    selectedUniv,
    setSelectedUniv,
    availableUniversities,
    selectedBranch,
    setSelectedBranch,
    selectedSemester,
    setSelectedSemester,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    setDebouncedSearchQuery,
    clearFilters: handleClearFilters,
  } = useNotesFilter({
    initialNotes,
    initialMeta,
    catalogMode,
    userUniversity,
    defaultBranch,
    defaultSemester,
    authState,
  });

  const [searchOpen, setSearchOpen] = useState(false);

  // Modal states
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

  const filteredNotes = notes;

  const scrollToCatalog = () => {
    const el = document.getElementById("notes-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
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


  // Finder Card university selection options as per DESIGN.md Section 4.1
  const finderUniversities = useMemo(() => {
    return [
      { label: "ALL", value: "All universities" },
      { label: "MU", value: "Mumbai University" },
      { label: "SPPU", value: "SPPU (Pune)" },
      { label: "DBATU", value: "DBATU" },
      { label: "RTMNU", value: "RTMNU (Nagpur)" },
      { label: "AU", value: "Amravati University" },
      { label: "SUK", value: "Shivaji University" },
    ];
  }, []);

  // Auth gate fallbacks
  if (authState === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid var(--line-300, #CDD4E2)", borderTopColor: "var(--blue-500, #2447F5)", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <p style={{ color: "var(--slate-600, #4A5468)", fontSize: "0.9rem", fontFamily: "var(--font-mono), monospace" }}>Loading Private Academy...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
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

  // Common Modals (Checkout & PDF / Video)
  const renderModals = () => (
    <>
      {/* Checkout Modal */}
      {showCheckoutPrompt && checkoutNote && (
        <div className={styles.modalBackdrop} onClick={() => setShowCheckoutPrompt(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Unlock Study Note</h3>
              <button 
                onClick={() => setShowCheckoutPrompt(false)} 
                className={styles.modalCloseBtn}
                aria-label="Close unlock modal"
              >
                <LuX size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-900, #0B1020)", margin: 0 }}>
                {checkoutNote.title}
              </h4>
              {!userEmail ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <p style={{ color: "var(--slate-600, #4A5468)", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
                    Sign in with your account to purchase and permanently access this note.
                  </p>
                  <Link
                    href={`/login?redirect=/?unlock=${checkoutNote.id}`}
                    className={styles.btnBannerDark}
                    style={{ justifyContent: "center", textDecoration: "none" }}
                  >
                    Sign in to unlock
                  </Link>
                </div>
              ) : (
                <>
                  <p style={{ color: "var(--slate-600, #4A5468)", fontSize: "14px", margin: 0 }}>
                    Instant unlock for <strong style={{ color: "var(--ink-900, #0B1020)" }}>₹{checkoutNote.price}</strong> via UPI or Card.
                  </p>
                  <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label htmlFor="checkout-email" style={{ fontSize: "12px", fontFamily: "var(--font-mono), monospace", fontWeight: 600, textTransform: "uppercase", color: "var(--slate-600, #4A5468)" }}>
                        Session Account Email
                      </label>
                      <input
                        type="email"
                        id="checkout-email"
                        required
                        value={checkoutEmail}
                        disabled={true}
                        style={{
                          width: "100%",
                          backgroundColor: "var(--paper, #F7F8FB)",
                          border: "1px solid var(--line-300, #CDD4E2)",
                          borderRadius: "var(--radius-md, 10px)",
                          color: "var(--ink-900, #0B1020)",
                          padding: "10px 14px",
                          fontFamily: "var(--font-sans), sans-serif",
                          fontSize: "14px",
                          outline: "none",
                          opacity: 0.85
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className={styles.btnBannerDark}
                      disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                      style={{ justifyContent: "center", marginTop: "4px" }}
                    >
                      {checkoutStatus === "verifying" && "Checking previous purchase..."}
                      {checkoutStatus === "paying" && "Connecting to payment gateway..."}
                      {checkoutStatus === "idle" && `Unlock for ₹${checkoutNote.price}`}
                    </button>
                    {activeOrderId && (
                      <button
                        type="button"
                        onClick={handleSyncPayment}
                        disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                        className={styles.btnBannerWhite}
                        style={{ width: "100%", justifyContent: "center", fontSize: "13px" }}
                      >
                        {checkoutStatus === "verifying" ? "Connecting..." : "Already paid? Reconnect access"}
                      </button>
                    )}
                  </form>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowCheckoutPrompt(false)} className={styles.btnBannerWhite}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video / PDF Download Modal */}
      {modalType && selectedNote && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalType === "video" && "Video Tutorial Walkthrough"}
                {modalType === "pdf" && "Download PDF Study Sheet"}
              </h3>
              <button onClick={closeModal} className={styles.modalCloseBtn} aria-label="Close modal">
                <LuX size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: "flex", gap: "8px" }}>
                <span className={styles.bentoMiniTag}>{selectedNote.branch}</span>
                <span className={styles.bentoMiniTag}>{selectedNote.semester}</span>
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--ink-900, #0B1020)", margin: 0 }}>
                {selectedNote.title}
              </h4>

              {modalType === "video" && selectedNote.videoUrl && (
                <div className={styles.videoWrapper}>
                  <iframe
                    src={selectedNote.videoUrl}
                    title={`${selectedNote.title} Video Walkthrough`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {modalType === "pdf" && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "32px 20px", 
                  backgroundColor: "var(--paper, #F7F8FB)", 
                  borderRadius: "var(--radius-lg, 14px)", 
                  border: "1px dashed var(--line-300, #CDD4E2)" 
                }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    backgroundColor: "#FFFFFF", 
                    border: "1px solid var(--line-200, #E3E8F1)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--blue-500, #2447F5)",
                    marginBottom: "12px"
                  }}>
                    <LuFileText size={24} />
                  </div>
                  <h5 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>{selectedNote.title}.pdf</h5>
                  <p style={{ fontSize: "13px", color: "var(--slate-600, #4A5468)", marginTop: "4px", marginBottom: "20px" }}>
                    Verified PDF · Instant High-Speed CDN Delivery
                  </p>
                  <button
                    onClick={() => handleDownload(selectedNote.id, selectedNote.title)}
                    className={styles.btnFinderSubmit}
                    style={{ width: "100%", justifyContent: "center" }}
                    disabled={downloadingPdf}
                  >
                    <LuDownload size={16} />
                    {downloadingPdf ? "Downloading note..." : "Download PDF File"}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnBannerWhite}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Focused Experience for Logged-In Students (Zero Distraction, Pure Educational & Notes Focus)
  if (authState === "ready") {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container} style={{ paddingTop: "24px", paddingBottom: "72px" }}>
          {/* Focused Student Portal Header */}
          <div className={styles.userWelcomeBanner}>
            <div className={styles.userWelcomeText}>
              <span>Welcome back, <strong>{userUsername || "Student"}</strong> 👋</span>
              {userUniversity && (
                <span className={styles.userUnivPill}>🎓 {userUniversity}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link 
                href="/dashboard" 
                style={{ 
                  color: "var(--ink-900, #0B1020)", 
                  fontFamily: "var(--font-mono), monospace", 
                  fontSize: "12px", 
                  fontWeight: 600, 
                  textDecoration: "none" 
                }}
              >
                DASHBOARD
              </Link>
              <Link 
                href="/contribute" 
                style={{ 
                  color: "var(--blue-500, #2447F5)", 
                  fontFamily: "var(--font-mono), monospace", 
                  fontSize: "12px", 
                  fontWeight: 700, 
                  textDecoration: "none" 
                }}
              >
                CONTRIBUTE NOTES →
              </Link>
            </div>
          </div>

          {/* Centralized Notes Catalog — Direct, Uncluttered Study Focus */}
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
        </div>

        {renderModals()}
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* ====================================================================
          1. HERO SECTION (Graph Paper + 2-Column Split + Finder Card)
          ==================================================================== */}
      <section className={styles.heroWrapper}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            
            {/* Left: Headline & Finder Card */}
            <div className={styles.heroLeft}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroEyebrowDot} />
                Free &amp; Paid Notes · ₹0–₹99
              </div>

              <h1 className={styles.heroTitle}>
                Engineering notes aligned to <mark className="hl">your syllabus</mark>.
              </h1>

              <p className={styles.heroIntro}>
                Mumbai University, SPPU, DBATU and more. Verified handwritten &amp; digital notes, solved semester question sets, and video tutorials.
              </p>

              {/* The Finder Card */}
              <div className={styles.finderCard}>
                <div className={styles.finderLabel}>
                  <span>Select your university</span>
                  <span style={{ color: "var(--blue-500, #2447F5)" }}>Step 1 of 2</span>
                </div>

                {/* University Chips */}
                <div className={styles.finderChipsScroll}>
                  {finderUniversities.map((uni) => {
                    const isSelected = selectedUniv === uni.value || (uni.value === "All universities" && selectedUniv === "All universities");
                    return (
                      <button
                        key={uni.label}
                        type="button"
                        onClick={() => {
                          setSelectedUniv(uni.value);
                          setTimeout(() => scrollToCatalog(), 100);
                        }}
                        className={`${styles.finderChip} ${isSelected ? styles.finderChipActive : ""}`}
                      >
                        {uni.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search Input Row with Clear Button */}
                <div className={styles.finderInputRow}>
                  <div className={styles.finderInputWrapper}>
                    <LuSearch className={styles.finderInputIcon} size={16} />
                    <input
                      type="text"
                      placeholder="Search subject, module title, or topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          scrollToCatalog();
                        }
                      }}
                      className={styles.finderSearchInput}
                    />
                    {searchQuery.trim() !== "" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setDebouncedSearchQuery("");
                        }}
                        className={styles.finderClearBtn}
                        aria-label="Clear search input"
                      >
                        <LuX size={14} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={scrollToCatalog}
                    className={styles.btnFinderSubmit}
                  >
                    <span>Find notes</span>
                    <LuArrowRight size={16} />
                  </button>
                </div>

                {/* Live Feedback */}
                <div className={styles.finderFeedback}>
                  <LuSparkles size={13} style={{ color: "var(--blue-500, #2447F5)" }} />
                  <span>
                    Showing <strong className={styles.finderFeedbackHighlight}>{filteredNotes.length}</strong> verified study sheets
                    {selectedUniv !== "All universities" ? ` for ${selectedUniv}` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Stacked Note Sheets Art */}
            <div className={styles.heroRight}>
              <div className={styles.sheetsStack}>
                {/* Floating "First 3 pages free" Pill */}
                <div className={styles.previewPill}>
                  First 3 pages free to preview
                </div>

                {/* Back Ruled Sheet */}
                <div className={styles.sheetBack}>
                  <div className={styles.sheetMarginLine} />
                  <div className={styles.sheetRuledLines} />
                </div>

                {/* Front White Notebook Sheet */}
                <div className={styles.sheetFront}>
                  <div className={styles.sheetMarginLine} />
                  <div className={styles.sheetHeaderLabel}>
                    MU · SEM 4 · COMP / IT
                  </div>
                  <h3 className={styles.sheetSubjectTitle}>
                    Engineering Mathematics IV: Module 3 Complex Integration
                  </h3>

                  {/* Skeleton Ruled Lines with Highlighter */}
                  <div className={styles.skeletonLines}>
                    <div className={styles.skeletonBar} style={{ width: "95%" }} />
                    <div className={`${styles.skeletonBar} ${styles.skeletonBarHighlight}`} style={{ width: "75%" }} />
                    <div className={styles.skeletonBar} style={{ width: "88%" }} />
                    <div className={styles.skeletonBar} style={{ width: "65%" }} />
                    <div className={styles.skeletonBar} style={{ width: "92%" }} />
                    <div className={`${styles.skeletonBar} ${styles.skeletonBarHighlight}`} style={{ width: "80%" }} />
                    <div className={styles.skeletonBar} style={{ width: "70%" }} />
                    <div className={styles.skeletonBar} style={{ width: "84%" }} />
                  </div>
                </div>

                {/* Floating Video Walkthrough Chip */}
                <div className={styles.videoChip}>
                  <div className={styles.playCircle}>
                    <LuPlay />
                  </div>
                  <span>12m video walkthrough included</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ====================================================================
          3. INTERACTIVE NOTES CATALOG EXPLORER (Step 3 Preserved)
          ==================================================================== */}
      <section id="notes-catalog" className={styles.catalogSection}>
        <div className={styles.container}>
          
          {/* Section Header for Catalog */}
          <div className={styles.sectionHeader} style={{ marginBottom: "28px" }}>
            <span className={styles.sectionEyebrow}>Syllabus Notes Catalog</span>
            <h2 className={styles.sectionTitle}>Explore study sheets &amp; question banks.</h2>
            <p className={styles.sectionSubtitle}>
              Filter by university, branch, or semester to find instant PDF downloads and video solutions.
            </p>
          </div>


          {/* Centralized Notes Catalog */}
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
            onNoteAction={(n) => {
              if (authState === "unauthenticated") {
                router.push(`/notes/${n.id}`);
              } else {
                handleDownloadClick(n);
              }
            }}
            variant="catalog"
          />

          {/* Unauthenticated Visitor Conversion Banner */}
          {authState === "unauthenticated" && (
            <div className={styles.unauthCallout}>
              <div className={styles.unauthCalloutText}>
                <h3 className={styles.unauthCalloutTitle}>
                  Found the notes for your upcoming semester exam? 🎓
                </h3>
                <p className={styles.unauthCalloutDesc}>
                  Sign up in 15 seconds to download offline PDF copies, track your unlocked study materials, and access visual video walkthroughs.
                </p>
              </div>
              <Link href="/login" className={styles.btnBannerDark}>
                <span>Sign Up / Log In to Unlock</span>
                <LuArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* ====================================================================
          5. BUILT FOR EXAM WEEK (Bento Grid)
          ==================================================================== */}
      <section className={styles.bentoSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Why Private Academy</span>
            <h2 className={styles.sectionTitle}>Built for the night before your exam.</h2>
            <p className={styles.sectionSubtitle}>
              No filler, no 500-page textbooks. Just syllabus-exact study notes and solved problem sets.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Cell 1 (3-Col): Preview Before Unlock */}
            <div className={`${styles.bentoCard} ${styles.bentoCardCol3}`}>
              <div style={{ color: "var(--blue-500, #2447F5)" }}>
                <LuBookOpen size={24} />
              </div>
              <h3 className={styles.bentoCardTitle}>Preview before unlock.</h3>
              <p className={styles.bentoCardDesc}>
                Never buy blind. Read the first 3 pages of any handwritten or digital study note completely free to verify handwriting, handwriting clarity, and module coverage.
              </p>
              
              {/* Mini 3-Page Preview Mockup */}
              <div className={styles.previewSheetsMock}>
                <div className={styles.previewMiniSheet}>
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono), monospace", color: "var(--blue-500, #2447F5)", fontWeight: 700 }}>PG 1 · FREE</span>
                  <div className={styles.skeletonBar} style={{ width: "90%", height: "5px" }} />
                  <div className={styles.skeletonBar} style={{ width: "70%", height: "5px" }} />
                </div>
                <div className={styles.previewMiniSheet}>
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono), monospace", color: "var(--blue-500, #2447F5)", fontWeight: 700 }}>PG 2 · FREE</span>
                  <div className={`${styles.skeletonBar} ${styles.skeletonBarHighlight}`} style={{ width: "85%", height: "5px" }} />
                  <div className={styles.skeletonBar} style={{ width: "60%", height: "5px" }} />
                </div>
                <div className={styles.previewMiniSheet}>
                  <span style={{ fontSize: "9px", fontFamily: "var(--font-mono), monospace", color: "var(--blue-500, #2447F5)", fontWeight: 700 }}>PG 3 · FREE</span>
                  <div className={styles.skeletonBar} style={{ width: "75%", height: "5px" }} />
                  <div className={styles.skeletonBar} style={{ width: "80%", height: "5px" }} />
                </div>
                <div className={styles.previewLockedSheet}>
                  <LuLock size={14} />
                  <span>PAGE 4+</span>
                </div>
              </div>
            </div>

            {/* Cell 2 (3-Col): PDF + Video Walkthrough */}
            <div className={`${styles.bentoCard} ${styles.bentoCardCol3}`}>
              <div style={{ color: "var(--blue-500, #2447F5)" }}>
                <LuPlay size={24} />
              </div>
              <h3 className={styles.bentoCardTitle}>PDF + Video on one screen.</h3>
              <p className={styles.bentoCardDesc}>
                Complex derivations and numerical solutions come paired with high-definition video walkthroughs explaining every single step.
              </p>

              {/* Split Video Mockup */}
              <div className={styles.splitVideoMock}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div className={styles.playCircle} style={{ width: "22px", height: "22px" }}>
                    <LuPlay size={9} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-900, #0B1020)" }}>Module 3 Video Walkthrough</span>
                </div>
                <span className={styles.bentoMiniTag} style={{ marginLeft: "auto", fontSize: "10px" }}>1080p HD</span>
              </div>
            </div>

            {/* Cell 3 (2-Col): Set University Once */}
            <div className={`${styles.bentoCard} ${styles.bentoCardCol2}`}>
              <div style={{ color: "var(--blue-500, #2447F5)" }}>
                <LuSparkles size={22} />
              </div>
              <h3 className={styles.bentoCardTitle}>Set your university once.</h3>
              <p className={styles.bentoCardDesc}>
                Whether Mumbai University, SPPU, or DBATU, the catalog automatically aligns with your university credit scheme.
              </p>
              <div className={styles.bentoMockBox}>
                <span className={styles.bentoMiniTag}>MU SCHEME</span>
                <span className={styles.bentoMiniTag}>SPPU 2024</span>
              </div>
            </div>

            {/* Cell 4 (2-Col): Reviewed Against Syllabus */}
            <div className={`${styles.bentoCard} ${styles.bentoCardCol2}`}>
              <div style={{ color: "var(--blue-500, #2447F5)" }}>
                <LuShieldCheck size={22} />
              </div>
              <h3 className={styles.bentoCardTitle}>Reviewed against syllabus.</h3>
              <p className={styles.bentoCardDesc}>
                Every study guide is audited against official university question blueprints and past 5 years question papers.
              </p>
              <div className={styles.bentoMockBox}>
                <span className={styles.bentoMiniTag} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <LuCheck size={12} color="#0F7B4F" /> BLUEPRINT AUDITED
                </span>
              </div>
            </div>

            {/* Cell 5 (2-Col): Instant UPI Download */}
            <div className={`${styles.bentoCard} ${styles.bentoCardCol2}`}>
              <div style={{ color: "var(--blue-500, #2447F5)" }}>
                <LuZap size={22} />
              </div>
              <h3 className={styles.bentoCardTitle}>Instant UPI checkout.</h3>
              <p className={styles.bentoCardDesc}>
                Zero subscription traps. Pay seamlessly using Google Pay, PhonePe, or Paytm and download pristine PDFs directly to your device.
              </p>
              <div className={styles.bentoMockBox}>
                <span className={styles.bentoMiniTag}>₹0 TO ₹99</span>
                <span className={styles.bentoMiniTag}>INSTANT CDN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. CONTRIBUTOR NETWORK & EARNINGS STAIRCASE (Dark Section)
          ==================================================================== */}
      <section className={styles.darkSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionEyebrow} ${styles.darkEyebrow}`}>Contributor Network</span>
            <h2 className={`${styles.sectionTitle} ${styles.darkTitle}`}>
              Turn your semester notes into <mark className="hl">recurring income</mark>.
            </h2>
            <p className={`${styles.sectionSubtitle} ${styles.darkSubtitle}`}>
              Upload your clean handwritten or typed notes once. Earn up to 90% revenue share on every student unlock with direct UPI transfers.
            </p>
          </div>

          <div className={styles.staircaseContainer}>
            {/* The 4-Tier Visual Staircase */}
            <div className={styles.staircaseGrid}>
              
              {/* Tier 1: 70% */}
              <div className={styles.stairCol}>
                <div className={`${styles.stairBar} ${styles.stairBar70}`}>
                  <span className={styles.stairPercentage}>70%</span>
                  <div className={styles.stairTierBadge}>Verified Contributor</div>
                </div>
                <div className={styles.stairReq}>1st Approved Note Published</div>
              </div>

              {/* Tier 2: 75% */}
              <div className={styles.stairCol}>
                <div className={`${styles.stairBar} ${styles.stairBar75}`}>
                  <span className={styles.stairPercentage}>75%</span>
                  <div className={styles.stairTierBadge}>Rising Scholar</div>
                </div>
                <div className={styles.stairReq}>3+ Notes &amp; 25 Unlocks</div>
              </div>

              {/* Tier 3: 82% */}
              <div className={styles.stairCol}>
                <div className={`${styles.stairBar} ${styles.stairBar82}`}>
                  <span className={styles.stairPercentage}>82%</span>
                  <div className={styles.stairTierBadge}>Top Author</div>
                </div>
                <div className={styles.stairReq}>5+ Notes &amp; 50 Unlocks</div>
              </div>

              {/* Tier 4: 90% (Highlighter Yellow) */}
              <div className={styles.stairCol}>
                <div className={`${styles.stairBar} ${styles.stairBar90}`}>
                  <span className={styles.stairPercentage}>90%</span>
                  <div className={styles.stairTierBadge}>Legend Author</div>
                </div>
                <div className={styles.stairReq}>10+ Notes &amp; 100 Unlocks</div>
              </div>

            </div>

            {/* CTAs */}
            <div className={styles.darkActions}>
              <Link href="/contribute" className={styles.btnHighlighter}>
                <span>Upload your first note</span>
                <LuArrowRight size={16} />
              </Link>
              <Link href="/contribute" className={styles.btnDarkGhost}>
                Calculate your earnings
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ====================================================================
          8. COMMUNITY BANNER (Highlighter Yellow, Section 3.14)
          ==================================================================== */}
      <div className={styles.container}>
        <div className={styles.communityBanner}>
          <div className={styles.bannerLeft}>
            <div className={styles.bannerNumber}>2,500+</div>
            <div className={styles.bannerTextGroup}>
              <h3 className={styles.bannerTitle}>Join the student community.</h3>
              <p className={styles.bannerDesc}>
                Get instant notifications when new question paper solutions, syllabus revisions, or community notes go live.
              </p>
            </div>
          </div>

          <div className={styles.bannerActions}>
            <a 
              href="https://t.me" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.btnBannerDark}
            >
              <LuUsers size={16} />
              <span>Join Telegram Group</span>
            </a>
            <Link href="/discussions" className={styles.btnBannerWhite}>
              <LuMessageSquare size={16} />
              <span>Explore Discussions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Render modals */}
      {renderModals()}
    </div>
  );
}
