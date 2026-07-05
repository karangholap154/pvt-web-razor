"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Note } from "../../../data/mockData";
import { supabase } from "../../../utils/supabaseClient";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "./notes.module.css";

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
          <span className={styles.tagBranch}>{note.branch}</span>
          <span className={styles.badgeSemester}>{note.semester}</span>
          {note.university && (
            <span className={styles.badgeUniversity}>{note.university}</span>
          )}
          {isPremium ? (
            <span className={styles.badgePricePaid}>₹{note.price} (Premium)</span>
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
          
          {/* Overview & Info Card */}
          <div className={styles.infoCard}>
            <h2 className={styles.sectionTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Overview Details
            </h2>
            <div className={styles.detailsList}>
              <div className={styles.detailsItem}>
                <span className={styles.detailsLabel}>Course/Subject Name</span>
                <span className={styles.detailsValue}>{note.title}</span>
              </div>
              <div className={styles.detailsItem}>
                <span className={styles.detailsLabel}>Target University</span>
                <span className={styles.detailsValue}>{note.university || "General Curriculum"}</span>
              </div>
              <div className={styles.detailsItem}>
                <span className={styles.detailsLabel}>Branch Specialty</span>
                <span className={styles.detailsValue}>{note.branch} Engineering</span>
              </div>
              <div className={styles.detailsItem}>
                <span className={styles.detailsLabel}>Recommended Semester</span>
                <span className={styles.detailsValue}>{note.semester}</span>
              </div>
              <div className={styles.detailsItem}>
                <span className={styles.detailsLabel}>Cost Options</span>
                <span className={styles.detailsValue} style={{ color: isPremium ? "#f59e0b" : "#22c55e" }}>
                  {isPremium ? `₹${note.price} INR` : "Free Access"}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className={styles.infoCard}>
            <h2 className={styles.sectionTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Syllabus Description
            </h2>
            <p className={styles.descriptionText} id="note-details-description">
              {note.description || `${note.title} study notes formatted specifically for ${note.university || "leading engineering universities"}. This guide compiles important algorithms, detailed explanations, and syllabus-aligned questions.`}
            </p>
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f59e0b", fontWeight: 700, fontSize: "0.95rem" }}>
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
                          style={{ width: "100%", border: "1px dashed var(--accent)", justifyContent: "center" }}
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
    </div>
  );
}
