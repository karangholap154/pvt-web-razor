"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Note } from "../../../data/mockData";
import { supabase } from "../../../utils/supabaseClient";
import { useToast } from "@/components/providers/ToastProvider";
import { loadRazorpayScript } from "@/utils/razorpay";
import styles from "./notes.module.css";
import NoteViewerDynamic from "@/components/NoteViewerDynamic";
import NoteCard from "@/components/cards/NoteCard";
import { 
  FaShieldHalved, 
  FaBolt, 
  FaCreditCard, 
  FaCircleCheck, 
  FaLock, 
  FaArrowDown, 
  FaShareNodes, 
  FaGraduationCap 
} from "react-icons/fa6";
import { Work_Sans, Caveat } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
});

interface NoteDetailsClientProps {
  note: Note;
}

export default function NoteDetailsClient({ note }: NoteDetailsClientProps) {
  // Consume global authentication state
  const { authState: contextAuthState, email: contextEmail } = useAuth();
  const toast = useToast();
  
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
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "verifying" | "paying" | "success" | "error">("idle");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
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

  const isPremium = typeof note.price === "number" && note.price > 0;

  // Sync purchase status on email availability
  useEffect(() => {
    let isActive = true;

    const checkStatus = async () => {
      if (authState === "loading") return;

      const activeEmail = contextEmail || "";
      if (!activeEmail) {
        if (isActive) {
          setHasPurchased(false);
          setCheckingPurchase(false);
        }
        return;
      }

      setCheckoutEmail(activeEmail);

      try {
        const { data, error } = await supabase
          .from("purchases")
          .select("id")
          .eq("email", activeEmail.trim().toLowerCase())
          .eq("note_id", note.id)
          .eq("status", "success")
          .maybeSingle();

        if (error) {
          console.error("Error checking note purchase verification:", error);
        }

        if (isActive) {
          setHasPurchased(!!data);
        }
      } catch (err) {
        console.error("Verification query error:", err);
      } finally {
        if (isActive) {
          setCheckingPurchase(false);
        }
      }
    };

    checkStatus();

    return () => {
      isActive = false;
    };
  }, [contextEmail, authState, note.id]);

  // Load recommended notes in the same branch/semester
  useEffect(() => {
    let isActive = true;

    const loadRecommendedNotes = async () => {
      try {
        setLoadingRecommendedNotes(true);
        const { data, error } = await supabase
          .from("notes")
          .select("id, title, branch, semester, download_url, video_url, price, university, contributor_id, is_community_contributed")
          .eq("branch", note.branch)
          .eq("semester", note.semester)
          .neq("id", note.id)
          .limit(4);

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
      const response = await fetch(`/api/proxy-pdf?id=${note.id}`);
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download fetch failed, opening in new tab fallback:", err);
      window.open(`/api/proxy-pdf?id=${note.id}`, "_blank");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Razorpay Checkout flow submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail.trim()) return;

    setCheckoutStatus("verifying");
    try {
      const cleanEmail = checkoutEmail.trim().toLowerCase();
      
      // Double check database logs for past purchase before charging
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("email", cleanEmail)
        .eq("note_id", note.id)
        .eq("status", "success")
        .maybeSingle();

      if (purchase) {
        setHasPurchased(true);
        setCheckoutStatus("success");
        return;
      }

      setCheckoutStatus("paying");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: note.id, email: cleanEmail }),
      });

      const orderData = await res.json();
      if (orderData.error) {
        toast.error(`Checkout order error: ${orderData.error}`);
        setCheckoutStatus("idle");
        return;
      }

      setActiveOrderId(orderData.orderId);

      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setCheckoutStatus("idle");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Private Academy",
        description: `Unlock Note: ${note.title}`,
        order_id: orderData.orderId,
        prefill: {
          email: cleanEmail,
        },
        theme: {
          color: "#1d3557",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            setCheckoutStatus("verifying");
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                noteId: note.id,
                email: cleanEmail,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setHasPurchased(true);
              setCheckoutStatus("success");
              toast.success("Payment verified! Full note reader unlocked.");
            } else {
              toast.error(verifyData.error || "Payment verification failed.");
              setCheckoutStatus("error");
            }
          } catch (err) {
            console.error("Verification fetch error:", err);
            toast.error("Network error during payment verification.");
            setCheckoutStatus("error");
          }
        },
        modal: {
          ondismiss: function () {
            setCheckoutStatus("idle");
          },
        },
      };

      const paymentObject = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Checkout initiation error:", err);
      toast.error("Failed to start checkout process.");
      setCheckoutStatus("idle");
    }
  };

  const handleSyncPayment = async () => {
    if (!activeOrderId) return;
    setCheckoutStatus("verifying");
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: activeOrderId,
          noteId: note.id,
          email: checkoutEmail.trim().toLowerCase(),
          syncOnly: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasPurchased(true);
        setCheckoutStatus("success");
        toast.success("Payment recovered and synced successfully!");
      } else {
        toast.error(data.error || "Could not find a successful payment for this order yet.");
        setCheckoutStatus("idle");
      }
    } catch (err) {
      console.error("Sync payment error:", err);
      toast.error("Failed to sync payment status.");
      setCheckoutStatus("idle");
    }
  };

  // Copy shareable link to clipboard
  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStudentNote = !!(note.is_community_contributed || note.contributor_id);

  return (
    <div className={`${styles.notebookPageRoot} ${workSans.variable} ${caveat.variable}`}>
      <div className={styles.nbSpine} aria-hidden="true" />
      <div className={styles.nbMarginRule} aria-hidden="true" />

      <div className={styles.container}>
        {/* Back Button */}
        <Link href="/" className={styles.backLink} id="back-to-library-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Library
        </Link>

      {/* Header Title Section */}
      <section className={styles.headerSection}>
        <div className={styles.badgeRow}>
          {isStudentNote ? (
            note.contributor_username ? (
              <Link href={`/u/${note.contributor_username}`} style={{ textDecoration: "none" }}>
                <span className={styles.badgeContributor}>
                  🎓 Contributed by @{note.contributor_username}
                </span>
              </Link>
            ) : (
              <span className={styles.badgeContributor}>
                🎓 Student Contribution
              </span>
            )
          ) : (
            <span className={styles.badgeOfficial}>
              🏛️ Official Platform Note
            </span>
          )}
          {isStudentNote ? (
            <span className={styles.tagBranchStudent}>
              {note.branch}
            </span>
          ) : (
            <span className={styles.tagBranch}>{note.branch}</span>
          )}
          <span className={styles.badgeSemester}>{note.semester}</span>
          {note.university && (
            <span className={styles.badgeUniversity}>{note.university}</span>
          )}
          {isPremium ? (
            <span className={isStudentNote ? styles.badgePriceStudent : styles.badgePricePaid}>
              ₹{note.price} (Premium)
            </span>
          ) : (
            <span className={styles.badgePriceFree}>Free</span>
          )}
        </div>
        <h1 className={styles.title} id="note-details-title">{note.title}</h1>
      </section>

      {/* Main Grid Content */}
      <div className={styles.layoutGrid}>
        
        {/* Left / Main Column */}
        <main className={styles.mainCol}>
          
          {/* PDF Viewer/Preview Section (Focal Point) */}
          {!checkingPurchase && (
            (!isPremium || hasPurchased) ? (
              <div className={styles.previewCard} id="note-pdf-viewer-card">
                <h2 className={styles.sectionTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isStudentNote ? "#7e22ce" : "var(--nb-ink)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    Study Note Reader
                  </span>
                  <button
                    onClick={toggleFullScreen}
                    className={styles.btnFullScreen}
                    title={isInlineFullscreen ? "Exit Full Screen" : "Read Full Screen"}
                    id="btn-toggle-fullscreen"
                  >
                    {isInlineFullscreen ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                        </svg>
                        <span>Minimize</span>
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                        </svg>
                        <span>Full Screen</span>
                      </>
                    )}
                  </button>
                </h2>
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
              </div>
            ) : (
              <div className={styles.previewCard} id="note-pdf-preview-card">
                <h2 className={styles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isStudentNote ? "#7e22ce" : "var(--nb-ink)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  Study Note Preview (First 3 Pages)
                </h2>
                <div className={styles.previewContainer} style={{ minHeight: 560 }}>
                  <NoteViewerDynamic url={`/api/proxy-pdf?id=${note.id}&preview=true`} previewMode={true} />
                  <div className={styles.previewOverlay}>
                    <div className={styles.previewOverlayContent}>
                      <h3>Want to read the rest?</h3>
                      <p>Unlock all pages of this premium study guide by completing the payment in the sidebar.</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Redesigned Overview Grid */}
          <div className={styles.overviewGrid}>
            {/* University Tile */}
            <div className={styles.overviewTile}>
              <div className={styles.overviewTileHeader}>
                <span className={styles.overviewIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                  </svg>
                </span>
                Target University
              </div>
              <div className={styles.overviewTileValue}>
                {note.university || "General Curriculum"}
              </div>
            </div>

            {/* Branch Tile */}
            <div className={styles.overviewTile}>
              <div className={styles.overviewTileHeader}>
                <span className={styles.overviewIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </span>
                Branch Specialty
              </div>
              <div className={styles.overviewTileValue}>
                {note.branch}
              </div>
            </div>

            {/* Semester Tile */}
            <div className={styles.overviewTile}>
              <div className={styles.overviewTileHeader}>
                <span className={styles.overviewIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </span>
                Semester Focus
              </div>
              <div className={styles.overviewTileValue}>
                Semester {note.semester}
              </div>
            </div>

            {/* Access/Cost Tile */}
            <div className={styles.overviewTile}>
              <div className={styles.overviewTileHeader}>
                <span className={styles.overviewIcon}>
                  {isPremium ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isStudentNote ? "#c084fc" : "#f59e0b"} strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                    </svg>
                  )}
                </span>
                Resource Cost
              </div>
              <div className={styles.overviewTileValue} style={{ color: isStudentNote ? "#c084fc" : isPremium ? "#f59e0b" : "#22c55e" }}>
                {isPremium ? `₹${note.price} INR` : "Free Access"}
              </div>
            </div>

            {/* Note Author & Origin Tile */}
            <div className={styles.overviewTile}>
              <div className={styles.overviewTileHeader}>
                <span className={styles.overviewIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isStudentNote ? "#7e22ce" : "var(--nb-ink)"} strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                Note Author & Origin
              </div>
              <div className={styles.overviewTileValue} style={{ fontSize: "0.875rem", fontWeight: 800, color: isStudentNote ? "#7e22ce" : "var(--nb-ink)" }}>
                {isStudentNote ? (
                  note.contributor_username ? (
                    <Link href={`/u/${note.contributor_username}`} style={{ color: "inherit", textDecoration: "underline" }}>
                      🎓 @{note.contributor_username}
                    </Link>
                  ) : (
                    "🎓 Student Contribution"
                  )
                ) : (
                  "🏛️ Official Platform Note"
                )}
              </div>
            </div>
          </div>


          {/* Video Lecture Section (If exists) */}
          {note.videoUrl && (
            <div className={styles.videoSection} id="note-video-section">
              <h2 className={styles.sectionTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Embedded Video Walkthrough
              </h2>
              <div className={styles.videoContainer}>
                <iframe
                  src={note.videoUrl}
                  title={`${note.title} video lecture tutorial`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </main>

        {/* Right / Sidebar Column */}
        <aside className={styles.sidebarCol}>
          
          {/* Access Control & Actions Card */}
          <div className={styles.actionSection}>
            <h3 className={styles.sidebarTitle}>Resource Access</h3>
            
            {checkingPurchase ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--nb-ink-dim, #5c7089)", padding: "1rem 0" }}>
                <div className={styles.spinner} />
                <span>Checking purchase status...</span>
              </div>
            ) : hasPurchased ? (
              // Unlocked / Free note: Allow immediate download
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className={styles.unlockedBadge}>
                  <FaCircleCheck />
                  <span>Note Access Unlocked</span>
                </div>
                <p style={{ color: "var(--nb-ink-dim, #5c7089)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  You have full authorized access to this study resource. Click below to download the PDF to your local device.
                </p>
                <div className={styles.actionGrid}>
                  <button
                    onClick={handleDownload}
                    className={`${styles.btnPrimary} ${styles.btnPrimaryGreen}`}
                    disabled={downloadingPdf}
                    id="btn-details-download-pdf"
                  >
                    {downloadingPdf ? (
                      <>
                        <div className={styles.spinner} />
                        Downloading PDF...
                      </>
                    ) : (
                      <>
                        <FaArrowDown />
                        Download PDF Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Locked Premium Note: Prompt Checkout
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className={`${styles.lockedBadge} ${isStudentNote ? styles.lockedBadgeStudent : ""}`}>
                  <FaLock />
                  <span>Premium Resource Locked</span>
                </div>
                
                {authState === "unauthenticated" ? (
                  // Logged out warning
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p className={styles.checkoutInfo}>
                      This is a premium resource. You must be signed in to purchase or access this syllabus guide.
                    </p>
                    <Link
                      href={`/login?redirect=/notes/${note.id}`}
                      className={styles.btnPrimary}
                      id="btn-details-login-to-unlock"
                    >
                      Sign in to unlock
                    </Link>
                  </div>
                ) : (
                  // Logged in: Render Payment Checkout Form
                  <form onSubmit={handleCheckoutSubmit} className={styles.checkoutForm} id="details-checkout-form">
                    <p className={styles.checkoutInfo}>
                      Unlock offline PDF copy of this premium guide for <strong className={styles.checkoutPrice}>₹{note.price} INR</strong>.
                    </p>
                    <div className={styles.formGroup}>
                      <label htmlFor="checkout-email" className={styles.formLabel}>Account Session Email</label>
                      <input
                        type="email"
                        id="checkout-email"
                        required
                        value={checkoutEmail}
                        disabled={true}
                        className={styles.formInput}
                        style={{ opacity: 0.7 }}
                      />
                      <span className={styles.formHelpText}>Prefilled from logged-in account profile</span>
                    </div>
                    <button
                      type="submit"
                      className={`${styles.btnPrimary} ${isStudentNote ? styles.btnPrimaryStudent : ""}`}
                      disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                      id="btn-details-trigger-payment"
                    >
                      {checkoutStatus === "verifying" && (
                        <>
                          <div className={styles.spinner} />
                          Checking payment ledger...
                        </>
                      )}
                      {checkoutStatus === "paying" && (
                        <>
                          <div className={styles.spinner} />
                          Opening Razorpay Gateway...
                        </>
                      )}
                      {checkoutStatus === "idle" && `Pay ₹${note.price} & Unlock`}
                    </button>
                    {activeOrderId && (
                      <div style={{ marginTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <button
                          type="button"
                          onClick={handleSyncPayment}
                          disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                          className={styles.btnSecondary}
                          style={{ width: "100%", border: isStudentNote ? "1px dashed #7e22ce" : "1.5px dashed var(--nb-ink)", color: isStudentNote ? "#7e22ce" : "var(--nb-ink)", justifyContent: "center" }}
                          id="btn-details-sync-payment"
                        >
                          {checkoutStatus === "verifying" ? (
                            <>
                              <div className={styles.spinner} />
                              Syncing...
                            </>
                          ) : (
                            "Already Paid? Sync Payment Status"
                          )}
                        </button>
                        <span style={{ fontSize: "0.75rem", color: "var(--nb-ink-dim)", textAlign: "center" }}>
                          Use this if your payment was deducted but the note did not unlock.
                        </span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* Trust & Guarantee Badges */}
            <div className={styles.trustList}>
              <div className={styles.trustItem}>
                <FaBolt className={styles.trustIcon} />
                <span>Instant PDF download & in-browser reader access</span>
              </div>
              <div className={styles.trustItem}>
                <FaCreditCard className={styles.trustIcon} />
                <span>Secure payments via UPI, Cards, NetBanking (Razorpay)</span>
              </div>
              <div className={styles.trustItem}>
                <FaShieldHalved className={styles.trustIcon} />
                <span>Verified syllabus matching university standards</span>
              </div>
            </div>

            {/* Shared Share Widget */}
            <div style={{ borderTop: "1.5px dashed var(--nb-card-line)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={handleCopyShareLink}
                className={styles.btnSecondary}
                id="btn-details-share-note"
                style={{ width: "100%" }}
              >
                {copied ? (
                  <>
                    <FaCircleCheck style={{ color: "#165b33" }} />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <FaShareNodes />
                    Share Note Details
                  </>
                )}
              </button>
            </div>

            {/* Contributor Spotlight & Invite Banner */}
            <div className={styles.earnBanner}>
              <div className={styles.earnBannerTag}>
                <FaGraduationCap />
                <span>Earn Up To 90% Revenue</span>
              </div>
              <div className={styles.earnBannerTitle}>
                Have study notes for your course?
              </div>
              <div className={styles.earnBannerText}>
                Publish your PDF revision guides & earn direct payouts to your UPI ID on every unlock.
              </div>
              <Link
                href="/contribute"
                className={styles.earnBannerBtn}
              >
                Learn How Contribution Works ➔
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <section className={styles.recommendedSection} aria-labelledby="recommended-notes-title">
        <div className={styles.recommendedHeader}>
          <div>
            <p className={styles.recommendedEyebrow}>Better picks for you</p>
            <h2 className={styles.recommendedTitle} id="recommended-notes-title">Recommended Notes</h2>
          </div>
          <p className={styles.recommendedSubtitle}>
              More notes from the same branch and semester, picked for you.
          </p>
        </div>

        {loadingRecommendedNotes ? (
          <div className={styles.recommendedState}>Loading related notes...</div>
        ) : recommendedNotes.length > 0 ? (
          <div className={styles.recommendedGrid}>
            {recommendedNotes.map((recommendedNote) => (
              <NoteCard
                key={recommendedNote.id}
                id={`recommended-${recommendedNote.id}`}
                note={recommendedNote}
                variant="catalog"
              />
            ))}
          </div>
        ) : (
          <div className={styles.recommendedState}>
            No other notes match this branch and semester yet.
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
