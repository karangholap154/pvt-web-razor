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

  const isPremium = note.price && note.price > 0;

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

      // Load Razorpay script dynamically
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay payment gateway. Please check your internet connection.");
        setCheckoutStatus("idle");
        return;
      }

      interface RazorpayResponse {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }

      interface RazorpayWindow extends Window {
        Razorpay?: new (options: unknown) => { open: () => void };
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_StVqhHUbbFc4bs",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Private Academy",
        description: `Unlock ${note.title}`,
        order_id: orderData.orderId,
        prefill: { email: cleanEmail },
        handler: async function (response: RazorpayResponse) {
          try {
            setCheckoutStatus("verifying");
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                noteId: note.id,
                email: cleanEmail,
                amount: orderData.amount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Payment verified successfully! Access granted.");
              setHasPurchased(true);
              setCheckoutStatus("success");
            } else {
              toast.error(`Verification failed: ${verifyData.error}`);
              setCheckoutStatus("idle");
            }
          } catch (err) {
            console.error("Verification callback failed:", err);
            toast.error("Verification check failed.");
            setCheckoutStatus("idle");
          }
        },
        modal: { ondismiss: function () { setCheckoutStatus("idle"); } },
        theme: { color: "#fbbf24" },
      };

      const rzpWindow = window as unknown as RazorpayWindow;
      if (rzpWindow.Razorpay) {
        const rzp = new rzpWindow.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Checkout flow failed:", err);
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
        setHasPurchased(true);
        setCheckoutStatus("success");
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

  // Copy shareable link to clipboard
  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStudentNote = !!(note.is_community_contributed || note.contributor_id);

  return (
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
                <span style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: 700, 
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.3))", 
                  color: "#c084fc", 
                  padding: "0.25rem 0.65rem", 
                  borderRadius: "6px", 
                  border: "1px solid rgba(168, 85, 247, 0.4)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  cursor: "pointer"
                }}>
                  🎓 Contributed by @{note.contributor_username}
                </span>
              </Link>
            ) : (
              <span style={{ 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.3))", 
                color: "#c084fc", 
                padding: "0.25rem 0.65rem", 
                borderRadius: "6px", 
                border: "1px solid rgba(168, 85, 247, 0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}>
                🎓 Student Contribution
              </span>
            )
          ) : (
            <span style={{ 
              fontSize: "0.75rem", 
              fontWeight: 700, 
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.3))", 
              color: "#fbbf24", 
              padding: "0.25rem 0.65rem", 
              borderRadius: "6px", 
              border: "1px solid rgba(245, 158, 11, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}>
              🏛️ Official Platform Note
            </span>
          )}
          {isStudentNote ? (
            <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "0.25rem 0.6rem", borderRadius: "6px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
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
            <span 
              className={isStudentNote ? undefined : styles.badgePricePaid} 
              style={isStudentNote ? { fontSize: "0.75rem", fontWeight: 700, backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "0.25rem 0.6rem", borderRadius: "6px", border: "1px solid rgba(168, 85, 247, 0.3)" } : undefined}
            >
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isStudentNote ? "#c084fc" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isStudentNote ? "#c084fc" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isStudentNote ? "#c084fc" : "var(--accent)"} strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                Note Author & Origin
              </div>
              <div className={styles.overviewTileValue} style={{ fontSize: "0.875rem", fontWeight: 700, color: isStudentNote ? "#c084fc" : "#fbbf24" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", padding: "1rem 0" }}>
                <div className={styles.spinner} />
                <span>Checking payment ledger status...</span>
              </div>
            ) : hasPurchased ? (
              // Unlocked / Free note: Allow immediate download
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#22c55e", fontWeight: 700, fontSize: "0.95rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Note Access Unlocked
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  You have full authorized access to this study resource. Click below to download the PDF to your local device.
                </p>
                <div className={styles.actionGrid}>
                  <button
                    onClick={handleDownload}
                    className={styles.btnPrimary}
                    disabled={downloadingPdf}
                    id="btn-details-download-pdf"
                    style={{ backgroundColor: "#22c55e", boxShadow: "0 4px 14px rgba(34, 197, 94, 0.25)" }}
                  >
                    {downloadingPdf ? (
                      <>
                        <div className={styles.spinner} />
                        Downloading PDF...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download PDF Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Locked Premium Note: Prompt Checkout
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: isStudentNote ? "#c084fc" : "#f59e0b", fontWeight: 700, fontSize: "0.95rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Premium Resource Locked
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
                      Log In / Sign Up to Unlock
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
                      className={styles.btnPrimary}
                      disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                      id="btn-details-trigger-payment"
                      style={isStudentNote ? { background: "linear-gradient(135deg, #a855f7, #9333ea)", borderColor: "#a855f7", boxShadow: "0 4px 14px rgba(168, 85, 247, 0.3)" } : undefined}
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
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={handleSyncPayment}
                          disabled={checkoutStatus === "verifying" || checkoutStatus === "paying"}
                          className={styles.btnSecondary}
                          style={{ width: "100%", border: isStudentNote ? "1px dashed #c084fc" : "1px dashed var(--accent)", color: isStudentNote ? "#c084fc" : undefined, justifyContent: "center" }}
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
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center" }}>
                          Use this if your payment was deducted but the note did not unlock.
                        </span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* Shared Share Widget */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={handleCopyShareLink}
                className={styles.btnSecondary}
                id="btn-details-share-note"
                style={{ width: "100%" }}
              >
                {copied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Link Copied!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share Note Details
                  </>
                )}
              </button>
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
            {recommendedNotes.map((recommendedNote) => {
              const recommendedPrice = recommendedNote.price ?? 0;

              return (
                <Link
                  key={recommendedNote.id}
                  href={`/notes/${recommendedNote.id}`}
                  className={styles.recommendedCard}
                >
                  <div className={styles.recommendedCardTop}>
                    <div className={styles.recommendedBadges}>
                      {recommendedNote.is_community_contributed || recommendedNote.contributor_id ? (
                        <span style={{ fontSize: "0.675rem", fontWeight: 700, backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc", padding: "0.15rem 0.4rem", borderRadius: "4px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                          🎓 Student
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.675rem", fontWeight: 700, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "0.15rem 0.4rem", borderRadius: "4px", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                          🏛️ Official
                        </span>
                      )}
                      <span className={styles.recommendedBranch}>{recommendedNote.branch}</span>
                      <span className={styles.recommendedSemester}>{recommendedNote.semester}</span>
                    </div>
                    <span className={recommendedPrice > 0 ? styles.recommendedPaid : styles.recommendedFree}>
                      {recommendedPrice > 0 ? `₹${recommendedPrice}` : "Free"}
                    </span>
                  </div>

                  <h3 className={styles.recommendedCardTitle}>{recommendedNote.title}</h3>
                  <p className={styles.recommendedCardDesc}>
                    {recommendedNote.description}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.recommendedState}>
            No other notes match this branch and semester yet.
          </div>
        )}
      </section>
    </div>
  );
}
