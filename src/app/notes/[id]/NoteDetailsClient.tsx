"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Note } from "../../../data/mockData";
import { supabase } from "../../../utils/supabaseClient";
import { downloadNotePdf } from "@/utils/download";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import styles from "./notes.module.css";
import NoteViewerDynamic from "@/components/NoteViewerDynamic";
import NoteCard from "@/components/cards/NoteCard";
import { 
  LuArrowLeft, 
  LuCheck, 
  LuLock, 
  LuDownload, 
  LuShare2, 
  LuFileText, 
  LuPlay, 
  LuShieldCheck, 
  LuSparkles, 
  LuMaximize2, 
  LuMinimize2, 
  LuGraduationCap, 
  LuBookOpen, 
  LuLayers, 
  LuCalendar,
  LuCircleAlert
} from "react-icons/lu";

interface NoteDetailsClientProps {
  note: Note;
}

export default function NoteDetailsClient({ note }: NoteDetailsClientProps) {
  // Consume global authentication state
  const { authState: contextAuthState, email: contextEmail } = useAuth();
  
  const authState = (contextAuthState === "ready" || contextAuthState === "no-university")
    ? "authenticated"
    : contextAuthState === "loading"
    ? "loading"
    : "unauthenticated";

  // Purchase verification state
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  
  // Checkout & Download states
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "video" | "related">("overview");

  const {
    checkoutStatus,
    activeOrderId,
    startCheckout,
    syncPayment,
  } = useRazorpayCheckout({
    onSuccess: () => setHasPurchased(true),
  });

  const [recommendedNotes, setRecommendedNotes] = useState<Note[]>([]);
  const [loadingRecommendedNotes, setLoadingRecommendedNotes] = useState(true);
  const [isInlineFullscreen, setIsInlineFullscreen] = useState(false);

  useEffect(() => {
    if (isInlineFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isInlineFullscreen]);

  const toggleFullScreen = () => {
    setIsInlineFullscreen((prev) => !prev);
  };

  const isPremium = note.price && note.price > 0;
  const isStudentNote = !!(note.is_community_contributed || note.contributor_id);

  // Verify purchase dynamically based on global auth state loading
  useEffect(() => {
    if (contextAuthState === "loading") {
      setCheckingPurchase(true);
      return;
    }

    if (contextAuthState === "unauthenticated") {
      setCheckoutEmail("");
      setCheckingPurchase(false);
      if (!isPremium) {
        setHasPurchased(true);
      } else {
        setHasPurchased(false);
      }
      return;
    }

    // Authenticated (ready or no-university)
    if (contextEmail) {
      setCheckoutEmail(contextEmail);
      if (!isPremium) {
        setHasPurchased(true);
        setCheckingPurchase(false);
      } else {
        const verifyUserPurchase = async (email: string) => {
          setCheckingPurchase(true);
          try {
            const cleanEmail = email.trim().toLowerCase();
            const { data: purchase, error } = await supabase
              .from("purchases")
              .select("id")
              .eq("email", cleanEmail)
              .eq("note_id", note.id)
              .eq("status", "success")
              .maybeSingle();

            if (purchase && !error) {
              setHasPurchased(true);
            } else {
              setHasPurchased(false);
            }
          } catch (err) {
            console.error("Error verifying purchase:", err);
          } finally {
            setCheckingPurchase(false);
          }
        };
        verifyUserPurchase(contextEmail);
      }
    }
  }, [contextAuthState, contextEmail, note.id, isPremium]);

  // Load notes from the same branch and semester for the recommendation section
  useEffect(() => {
    let isActive = true;

    const loadRecommendedNotes = async () => {
      setLoadingRecommendedNotes(true);

      if (!note.branch || !note.semester) {
        if (isActive) {
          setRecommendedNotes([]);
          setLoadingRecommendedNotes(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("branch", note.branch)
          .eq("semester", note.semester)
          .neq("id", note.id)
          .order("title", { ascending: true })
          .limit(3);

        if (error) {
          throw error;
        }

        const items = (data || []).map((item) => ({
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
        }));

        if (isActive) {
          setRecommendedNotes(items);
        }
      } catch (err) {
        console.error("Error loading recommended notes:", err);
        if (isActive) {
          setRecommendedNotes([]);
        }
      } finally {
        if (isActive) {
          setLoadingRecommendedNotes(false);
        }
      }
    };

    loadRecommendedNotes();

    return () => {
      isActive = false;
    };
  }, [note.branch, note.semester, note.id]);

  // Download PDF file
  const handleDownload = async () => {
    if (!note.downloadUrl) return;
    setDownloadingPdf(true);
    try {
      await downloadNotePdf(note.id, note.title);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Razorpay Checkout flow submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail.trim()) return;
    await startCheckout(note, checkoutEmail);
  };

  // Synchronize payment status manually (fallback if client gets out of sync)
  const handleSyncPayment = async () => {
    await syncPayment();
  };

  // Copy shareable link to clipboard
  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine back navigation destination
  const backDestination = isStudentNote ? "/community-notes" : "/notes";
  const backLabel = isStudentNote ? "Community Notes" : "Official Notes";

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* --- Top Breadcrumb Path & Back Button --- */}
        <div className={styles.navHeader}>
          <div className={styles.breadcrumbPath} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href={backDestination} className={styles.breadcrumbLink}>{backLabel}</Link>
            {note.university && (
              <>
                <span className={styles.breadcrumbSep}>/</span>
                <span className={styles.breadcrumbLink}>{note.university}</span>
              </>
            )}
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbLink}>{note.branch}</span>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbActive}>Sem {note.semester}</span>
          </div>

          <Link href={backDestination} className={styles.btnBackMinimal}>
            <LuArrowLeft size={14} />
            <span>Back to {backLabel}</span>
          </Link>
        </div>

        {/* --- Note Title & Tags Header Section --- */}
        <section className={styles.headerSection}>
          <div className={styles.badgeRow}>
            {isStudentNote ? (
              note.contributor_username ? (
                <Link href={`/u/${note.contributor_username}`} className={styles.tagContributor}>
                  <LuGraduationCap size={13} style={{ color: "var(--blue-500, #2447F5)" }} />
                  <span>By @{note.contributor_username}</span>
                </Link>
              ) : (
                <span className={styles.tagContributor}>
                  <LuGraduationCap size={13} />
                  <span>Student Contributed</span>
                </span>
              )
            ) : (
              <span className={styles.tagOfficial}>
                <LuShieldCheck size={13} style={{ color: "#0F7B4F" }} />
                <span>Official Private Academy Note</span>
              </span>
            )}

            <span className={styles.tagBranch}>{note.branch}</span>
            <span className={styles.tagSemester}>Sem {note.semester}</span>
            
            {note.university && (
              <span className={styles.tagUniversity}>{note.university}</span>
            )}

            {isPremium ? (
              <span className={styles.tagPricePaid}>₹{note.price}</span>
            ) : (
              <span className={styles.tagPriceFree}>Free Note</span>
            )}
          </div>

          <h1 className={styles.noteTitle} id="note-details-title">{note.title}</h1>
          
          <p className={styles.noteSubtitle}>
            Comprehensive semester study guide with step-by-step problem derivations, full syllabus coverage, and offline PDF access.
          </p>

          {/* Verification Notice Banner */}
          {isStudentNote ? (
            <div className={styles.noticeSupplementary}>
              <LuSparkles size={18} style={{ color: "var(--ink-900, #0B1020)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "var(--ink-900, #0B1020)" }}>Supplementary Study Resource: </strong>
                This document is a student-prepared supplementary learning resource. It is NOT an official university syllabus note and covers specific topics or practical exercises rather than the entire course curriculum. Please inspect the PDF preview below before unlocking.
              </div>
            </div>
          ) : (
            <div className={styles.noticeOfficial}>
              <LuShieldCheck size={18} style={{ color: "#0F7B4F", flexShrink: 0 }} />
              <div>
                <strong style={{ color: "var(--ink-900, #0B1020)" }}>Verified Curriculum Note: </strong>
                Reviewed and published by Private Academy. Full syllabus coverage and aligned with university curriculum.
              </div>
            </div>
          )}
        </section>

        {/* ==================================================================
            MAIN 7 / 5 DESKTOP GRID LAYOUT
            ================================================================== */}
        <div className={styles.layoutGrid}>
          
          {/* --- Left Column: PDF Preview / Full Reader + Tabbed Panels --- */}
          <main className={styles.mainCol}>
            
            {/* PDF Viewer / Preview Card (Focal Point) */}
            {!checkingPurchase && (
              <div className={styles.previewCard} id="note-pdf-viewer-card">
                <div className={styles.previewHeader}>
                  <div className={styles.previewHeaderTitle}>
                    <LuFileText size={15} style={{ color: "var(--blue-500, #2447F5)" }} />
                    <span>
                      {(!isPremium || hasPurchased) ? "Study Note Reader" : "First 3 Pages Free Preview"}
                    </span>
                  </div>

                  {(!isPremium || hasPurchased) && (
                    <button
                      type="button"
                      onClick={toggleFullScreen}
                      className={styles.btnFullScreen}
                      title={isInlineFullscreen ? "Exit Full Screen" : "Read Full Screen"}
                      id="btn-toggle-fullscreen"
                    >
                      {isInlineFullscreen ? (
                        <>
                          <LuMinimize2 size={13} />
                          <span>Minimize</span>
                        </>
                      ) : (
                        <>
                          <LuMaximize2 size={13} />
                          <span>Full Screen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {(!isPremium || hasPurchased) ? (
                  /* Full Unlocked Reader */
                  <div
                    className={`${styles.previewContainer} ${isInlineFullscreen ? styles.previewContainerFullscreen : ""}`}
                    id="note-pdf-container"
                    style={{ minHeight: 560, height: isInlineFullscreen ? "100vh" : undefined }}
                  >
                    <NoteViewerDynamic
                      url={`/api/proxy-pdf?id=${note.id}&inline=true`}
                      isFullscreen={isInlineFullscreen}
                      onToggleFullscreen={toggleFullScreen}
                    />
                  </div>
                ) : (
                  /* 3-Page Locked Preview */
                  <div className={styles.previewContainer} style={{ minHeight: 560 }}>
                    <NoteViewerDynamic url={`/api/proxy-pdf?id=${note.id}&preview=true`} previewMode={true} />
                    
                    {/* Page Lock Overlay (Pages 4+) */}
                    <div className={styles.previewOverlay}>
                      <div className={styles.previewOverlayContent}>
                        <h3 className={styles.previewOverlayTitle}>
                          <LuLock size={16} style={{ color: "var(--blue-500, #2447F5)" }} />
                          <span>Want to read the full note?</span>
                        </h3>
                        <p className={styles.previewOverlayDesc}>
                          Unlock all pages and get instant offline PDF access via UPI checkout in the sidebar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- Tabs Container (Overview, Video Walkthrough, Related) --- */}
            <div className={styles.tabsContainer}>
              <div className={styles.tabsBar}>
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`}
                >
                  <LuBookOpen size={15} />
                  <span>Syllabus &amp; Overview</span>
                </button>

                {note.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("video")}
                    className={`${styles.tabBtn} ${activeTab === "video" ? styles.tabBtnActive : ""}`}
                  >
                    <LuPlay size={15} />
                    <span>Video Walkthrough</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab("related")}
                  className={`${styles.tabBtn} ${activeTab === "related" ? styles.tabBtnActive : ""}`}
                >
                  <LuLayers size={15} />
                  <span>Related Notes ({recommendedNotes.length})</span>
                </button>
              </div>

              {/* Tab 1: Overview & Syllabus Coverage */}
              {activeTab === "overview" && (
                <div className={styles.tabPanel}>
                  <div className={styles.overviewGrid}>
                    <div className={styles.overviewTile}>
                      <span className={styles.overviewTileLabel}>
                        <LuGraduationCap size={13} />
                        Target University
                      </span>
                      <span className={styles.overviewTileValue}>
                        {note.university || "General Engineering Curriculum"}
                      </span>
                    </div>

                    <div className={styles.overviewTile}>
                      <span className={styles.overviewTileLabel}>
                        <LuBookOpen size={13} />
                        Engineering Branch
                      </span>
                      <span className={styles.overviewTileValue}>
                        {note.branch}
                      </span>
                    </div>

                    <div className={styles.overviewTile}>
                      <span className={styles.overviewTileLabel}>
                        <LuCalendar size={13} />
                        Semester Scheme
                      </span>
                      <span className={styles.overviewTileValue}>
                        Semester {note.semester}
                      </span>
                    </div>

                    <div className={styles.overviewTile}>
                      <span className={styles.overviewTileLabel}>
                        <LuSparkles size={13} />
                        Access &amp; Pricing
                      </span>
                      <span className={styles.overviewTileValue}>
                        {isPremium ? `₹${note.price} INR (Lifetime)` : "Free Study Access"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Video Walkthrough */}
              {activeTab === "video" && note.videoUrl && (
                <div className={styles.tabPanel}>
                  <div className={styles.videoCard}>
                    <div className={styles.videoWrapper}>
                      <iframe
                        src={note.videoUrl}
                        title={`${note.title} Video Tutorial Walkthrough`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Related Notes */}
              {activeTab === "related" && (
                <div className={styles.tabPanel}>
                  {loadingRecommendedNotes ? (
                    <div className={styles.recommendedState}>Loading related notes...</div>
                  ) : recommendedNotes.length > 0 ? (
                    <div className={styles.recommendedGrid}>
                      {recommendedNotes.map((rec) => (
                        <NoteCard key={rec.id} note={rec} variant="catalog" />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.recommendedState}>
                      No other notes found for {note.branch} Sem {note.semester} yet.
                    </div>
                  )}
                </div>
              )}
            </div>

          </main>

          {/* --- Right Column: 5 Cols Sticky Purchase Card & Contributor Dossier --- */}
          <aside className={styles.sidebarCol}>
            
            {/* Purchase & Unlock Card */}
            <div className={styles.purchaseCard}>
              <div className={styles.priceDisplayGroup}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.priceValue}>
                    {isPremium ? `₹${note.price}` : "FREE"}
                  </span>
                  <span className={styles.priceCaption}>
                    {isPremium ? "One-time unlock · Instant download" : "Open Educational Resource"}
                  </span>
                </div>
                
                {hasPurchased && (
                  <span className={styles.tagPriceFree} style={{ alignSelf: "flex-start" }}>
                    ✓ Unlocked
                  </span>
                )}
              </div>

              {/* What's Included Checklist */}
              <ul className={styles.includedList}>
                <li className={styles.includedItem}>
                  <LuCheck size={16} className={styles.includedIconCheck} />
                  <span>Instant offline PDF copy download</span>
                </li>
                <li className={styles.includedItem}>
                  <LuCheck size={16} className={styles.includedIconCheck} />
                  <span>Handwritten &amp; digital derivations included</span>
                </li>
                {note.videoUrl && (
                  <li className={styles.includedItem}>
                    <LuCheck size={16} className={styles.includedIconCheck} />
                    <span>High-definition video walkthrough</span>
                  </li>
                )}
                <li className={styles.includedItem}>
                  <LuCheck size={16} className={styles.includedIconCheck} />
                  <span>Full syllabus coverage aligned with university curriculum</span>
                </li>
                <li className={styles.includedItem}>
                  <LuCheck size={16} className={styles.includedIconCheck} />
                  <span>Read on mobile, tablet, or print to paper</span>
                </li>
              </ul>

              {/* Action Buttons depending on state */}
              {checkingPurchase ? (
                <button type="button" className={styles.btnUnlockPrimary} disabled>
                  <div className={styles.spinner} />
                  <span>Checking status...</span>
                </button>
              ) : hasPurchased ? (
                /* Unlocked / Free Note Download */
                <button
                  type="button"
                  onClick={handleDownload}
                  className={styles.btnDownloadGreen}
                  disabled={downloadingPdf}
                  id="btn-details-download-pdf"
                >
                  <LuDownload size={18} />
                  <span>{downloadingPdf ? "Downloading note..." : "Download PDF File"}</span>
                </button>
              ) : authState === "unauthenticated" ? (
                /* Unauthenticated Visitor: Prompts Sign In */
                <Link
                  href={`/login?redirect=/notes/${note.id}`}
                  className={styles.btnUnlockPrimary}
                  id="btn-details-login-to-unlock"
                >
                  <span>Sign in to unlock for ₹{note.price}</span>
                </Link>
              ) : (
                /* Authenticated Visitor: Triggers Razorpay Checkout */
                <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    type="submit"
                    className={styles.btnUnlockPrimary}
                    disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                    id="btn-details-trigger-payment"
                  >
                    {checkoutStatus === "verifying" && (
                      <>
                        <div className={styles.spinner} />
                        <span>Verifying access...</span>
                      </>
                    )}
                    {checkoutStatus === "paying" && (
                      <>
                        <div className={styles.spinner} />
                        <span>Opening Razorpay gateway...</span>
                      </>
                    )}
                    {checkoutStatus === "idle" && (
                      <>
                        <LuLock size={16} />
                        <span>Unlock for ₹{note.price} via UPI / Card</span>
                      </>
                    )}
                  </button>

                  {/* Payment Sync Fallback */}
                  {activeOrderId && (
                    <button
                      type="button"
                      onClick={handleSyncPayment}
                      disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                      className={styles.btnSyncFallback}
                      id="btn-details-sync-payment"
                    >
                      {checkoutStatus === "verifying" ? "Syncing..." : "Already paid? Reconnect access"}
                    </button>
                  )}
                </form>
              )}

              {/* Trust Footer */}
              <div className={styles.trustFooter}>
                <div className={styles.trustItem}>
                  <LuShieldCheck size={15} style={{ color: "#0F7B4F", flexShrink: 0 }} />
                  <span>Secure 256-bit encrypted checkout via Razorpay</span>
                </div>
                <div className={styles.trustItem}>
                  <LuSparkles size={15} style={{ color: "var(--blue-500, #2447F5)", flexShrink: 0 }} />
                  <span>Instant access across mobile, tablet & desktop</span>
                </div>
              </div>
            </div>

            {/* Contributor or Official Author Card */}
            <div className={styles.authorCard}>
              <div className={styles.authorCardHeader}>
                <span className={styles.authorLabel}>
                  {isStudentNote ? "Author & Contributor" : "Publisher"}
                </span>
                {isStudentNote && (
                  <span className={styles.tagBranch} style={{ fontSize: "10px" }}>Verified</span>
                )}
              </div>

              <div className={styles.authorIdentity}>
                <div className={styles.authorAvatar}>
                  {isStudentNote ? (note.contributor_username?.charAt(0).toUpperCase() || "S") : "PA"}
                </div>
                <div className={styles.authorInfoGroup}>
                  <span className={styles.authorName}>
                    {isStudentNote ? (note.contributor_name || `@${note.contributor_username || "student"}`) : "Private Academy Official"}
                  </span>
                  {isStudentNote && note.contributor_username && (
                    <Link href={`/u/${note.contributor_username}`} className={styles.authorHandle}>
                      @{note.contributor_username} ↗
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary Actions Card (Share & Support) */}
            <div className={styles.actionsBarCard}>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className={styles.btnSecondaryAction}
                id="btn-details-share-note"
              >
                {copied ? (
                  <>
                    <LuCheck size={15} style={{ color: "#0F7B4F" }} />
                    <span style={{ color: "#0F7B4F" }}>Link copied!</span>
                  </>
                ) : (
                  <>
                    <LuShare2 size={15} />
                    <span>Share Note</span>
                  </>
                )}
              </button>

              <Link href="/contact" className={styles.btnSecondaryAction}>
                <LuCircleAlert size={15} />
                <span>Report Discrepancy</span>
              </Link>
            </div>

            {/* Become Contributor Pitch Card */}
            <div className={styles.earnCalloutCard}>
              <h4 className={styles.earnCalloutTitle}>Have good study notes?</h4>
              <p className={styles.earnCalloutDesc}>
                Upload your clean handwritten notes once. Earn up to 90% revenue share on every student unlock with direct UPI transfers.
              </p>
              <Link href="/contribute" className={styles.earnCalloutLink}>
                Learn how to contribute notes →
              </Link>
            </div>

          </aside>

        </div>

        {/* ==================================================================
            RECOMMENDED NOTES BOTTOM SECTION
            ================================================================== */}
        {recommendedNotes.length > 0 && (
          <section className={styles.recommendedSection} aria-labelledby="recommended-notes-title">
            <div className={styles.recommendedHeader}>
              <span className={styles.recommendedEyebrow}>Explore Related Study Sheets</span>
              <h2 className={styles.recommendedTitle} id="recommended-notes-title">
                More notes for {note.branch} Sem {note.semester}
              </h2>
            </div>

            <div className={styles.recommendedGrid}>
              {recommendedNotes.map((rec) => (
                <NoteCard key={rec.id} note={rec} variant="catalog" />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ==================================================================
          MOBILE STICKY BOTTOM CHECKOUT BAR
          ================================================================== */}
      <div className={styles.mobileStickyBar}>
        <div className={styles.mobileStickyPriceGroup}>
          <span className={styles.mobileStickyPrice}>
            {isPremium ? `₹${note.price}` : "FREE"}
          </span>
          <span className={styles.mobileStickyLabel}>
            {hasPurchased ? "Unlocked" : isPremium ? "Instant unlock" : "Free note"}
          </span>
        </div>

        <div className={styles.mobileStickyAction}>
          {checkingPurchase ? (
            <button type="button" className={styles.btnUnlockPrimary} style={{ height: "42px", fontSize: "14px" }} disabled>
              <div className={styles.spinner} />
            </button>
          ) : hasPurchased ? (
            <button
              type="button"
              onClick={handleDownload}
              className={styles.btnDownloadGreen}
              style={{ height: "42px", fontSize: "14px" }}
              disabled={downloadingPdf}
            >
              <LuDownload size={15} />
              <span>{downloadingPdf ? "Downloading..." : "Download PDF"}</span>
            </button>
          ) : authState === "unauthenticated" ? (
            <Link
              href={`/login?redirect=/notes/${note.id}`}
              className={styles.btnUnlockPrimary}
              style={{ height: "42px", fontSize: "14px" }}
            >
              <span>Unlock for ₹{note.price}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleCheckoutSubmit}
              disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
              className={styles.btnUnlockPrimary}
              style={{ height: "42px", fontSize: "14px" }}
            >
              <LuLock size={15} />
              <span>Unlock Note</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
