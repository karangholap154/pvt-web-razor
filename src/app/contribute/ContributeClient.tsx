"use client";

import { useState } from "react";
import Link from "next/link";
import ContributeModal from "@/components/contribute/ContributeModal";
import {
  calculateBadgeTier,
  getContributorShareRate,
  getPlatformCommissionRate,
} from "@/utils/badgeUtils";
import {
  FaCloudArrowUp,
  FaShieldHalved,
  FaRocket,
  FaMoneyBillWave,
  FaCalculator,
  FaChevronDown,
  FaChevronUp,
  FaCircleQuestion,
  FaArrowLeft,
} from "react-icons/fa6";

export default function ContributeClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Interactive Earnings Calculator State
  const [numNotes, setNumNotes] = useState<number>(3);
  const [pricePerNote, setPricePerNote] = useState<number>(49);
  const [salesPerNote, setSalesPerNote] = useState<number>(25);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculate calculator metrics
  const totalNotes = Math.max(0, numNotes);
  const price = Math.max(0, pricePerNote);
  const salesPerNoteVal = Math.max(0, salesPerNote);
  const totalSalesCount = totalNotes * salesPerNoteVal;
  const grossRevenue = totalNotes * price * salesPerNoteVal;

  // Use authoritative badge utility functions from badgeUtils.ts
  const rawBadgeTier = calculateBadgeTier(totalNotes, totalSalesCount);
  const shareRate = getContributorShareRate(rawBadgeTier);
  const commissionRate = getPlatformCommissionRate(rawBadgeTier);
  const netEarnings = grossRevenue * shareRate;

  // Format Tier Display Name & Icon
  let badgeTierLabel = "🎓 Verified Contributor";
  if (rawBadgeTier === "legend") {
    badgeTierLabel = "👑 Legend Author";
  } else if (rawBadgeTier === "top_author") {
    badgeTierLabel = "🌟 Top Author";
  } else if (rawBadgeTier === "rising") {
    badgeTierLabel = "⚡ Rising Scholar";
  }

  // Calculate detailed progress towards the next tier
  let nextTierGoal = "";
  if (rawBadgeTier === "legend") {
    nextTierGoal = "🎉 Maximum Legend Tier Reached (90% Contributor Share)!";
  } else if (rawBadgeTier === "top_author") {
    const notesNeeded = Math.max(0, 10 - totalNotes);
    const salesNeeded = Math.max(0, 100 - totalSalesCount);
    nextTierGoal = `Next Tier: Legend (90% Share) — Needs ${notesNeeded > 0 ? `${notesNeeded} more note(s)` : ""}${notesNeeded > 0 && salesNeeded > 0 ? " & " : ""}${salesNeeded > 0 ? `${salesNeeded} more purchase(s)` : ""}`;
  } else if (rawBadgeTier === "rising") {
    const notesNeeded = Math.max(0, 5 - totalNotes);
    const salesNeeded = Math.max(0, 50 - totalSalesCount);
    nextTierGoal = `Next Tier: Top Author (82% Share) — Needs ${notesNeeded > 0 ? `${notesNeeded} more note(s)` : ""}${notesNeeded > 0 && salesNeeded > 0 ? " & " : ""}${salesNeeded > 0 ? `${salesNeeded} more purchase(s)` : ""}`;
  } else {
    const notesNeeded = Math.max(0, 3 - totalNotes);
    const salesNeeded = Math.max(0, 25 - totalSalesCount);
    nextTierGoal = `Next Tier: Rising Scholar (75% Share) — Needs ${notesNeeded > 0 ? `${notesNeeded} more note(s)` : ""}${notesNeeded > 0 && salesNeeded > 0 ? " & " : ""}${salesNeeded > 0 ? `${salesNeeded} more purchase(s)` : ""}`;
  }

  const faqs = [
    {
      q: "Who can contribute study notes on PrivateAcademy?",
      a: "Any enrolled student, alumni, top ranker, or educator can contribute! If you have well-structured handwritten or digital PDF notes for university courses, you can upload them."
    },
    {
      q: "What file formats and restrictions apply?",
      a: "Submissions must strictly be in PDF format (.pdf) with a maximum file size of 5 MB per document. Ensure notes are clear, legible, and accurate."
    },
    {
      q: "How does the revenue split and pricing work?",
      a: "You set your note price anywhere from ₹0 (Free) up to ₹99. For paid notes, base contributors earn 70% of sales. As you publish more approved notes and get more unlocks, your Tier levels up to Rising (75%), Top Author (82%), and Legend (90%)!"
    },
    {
      q: "How and when do I get paid?",
      a: "Your net earnings accumulate live in your Contributor Dashboard. Once your available balance reaches ₹100, you can request a direct payout to your UPI ID (Google Pay, PhonePe, Paytm, BHIM)."
    },
    {
      q: "How long does Admin Approval take?",
      a: "Our admin team usually reviews submissions within 12–24 hours to check PDF quality, subject alignment, and legibility before publishing your note live."
    },
    {
      q: "Can I manage or delete my notes later?",
      a: "Yes! You can manage, view sales stats, or delete your contributed notes anytime directly from your Contributor Dashboard."
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary, #0a0a0c)",
      color: "var(--text-primary, #f9fafb)",
      padding: "2rem 1rem 5rem 1rem",
      fontFamily: "inherit"
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            textDecoration: "none",
            marginBottom: "1.5rem",
            fontWeight: 600
          }}
        >
          <FaArrowLeft /> Back to Library
        </Link>

        {/* ── 1. HERO SECTION ────────────────────────────────────────────── */}
        <section style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "24px",
          padding: "3rem 2rem",
          textAlign: "center",
          marginBottom: "3rem",
          boxShadow: "0 20px 50px -15px rgba(0,0,0,0.6)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            color: "var(--accent, #f59e0b)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            borderRadius: "30px",
            padding: "0.35rem 1rem",
            fontSize: "0.825rem",
            fontWeight: 700,
            marginBottom: "1.25rem"
          }}>
            💰 Contribution Service Program
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            margin: "0 0 1.25rem 0",
            background: "linear-gradient(135deg, #ffffff 30%, var(--accent, #f59e0b) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Monetize Your University Notes &amp; Empower Peers
          </h1>

          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary, #9ca3af)",
            maxWidth: "750px",
            margin: "0 auto 2rem auto",
            lineHeight: 1.6
          }}>
            Turn your semester revision guides into a continuous passive income stream. Earn up to <strong>90% revenue share</strong> with direct payouts straight to your UPI account!
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                backgroundColor: "var(--accent, #f59e0b)",
                color: "#000",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "0.85rem 1.8rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
              }}
            >
              <FaCloudArrowUp style={{ fontSize: "1.2rem" }} /> Submit Note Now
            </button>
            <a
              href="#calculator"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.85rem 1.6rem",
                borderRadius: "12px",
                textDecoration: "none"
              }}
            >
              <FaCalculator /> Calculate Earnings
            </a>
          </div>
        </section>

        {/* ── 2. STEP-BY-STEP WORKFLOW ────────────────────────────────────── */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 0.5rem" }}>How It Works in 4 Simple Steps</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>A transparent process from note upload to instant UPI earnings</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1.25rem"
          }}>
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px",
              padding: "1.5rem",
              position: "relative"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                color: "var(--accent, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                marginBottom: "1rem"
              }}>
                <FaCloudArrowUp />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>1. Upload PDF</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Select your University, Branch, Semester, upload your PDF (≤5MB), and set a price from ₹0 to ₹99.
              </p>
            </div>

            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                marginBottom: "1rem"
              }}>
                <FaShieldHalved />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>2. Quality Review</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Admins verify note accuracy, legibility, and subject alignment within 12–24 hours.
              </p>
            </div>

            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(168, 85, 247, 0.15)",
                color: "#c084fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                marginBottom: "1rem"
              }}>
                <FaRocket />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>3. Go Live</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Your note is published on the marketplace with your profile link (<span style={{ color: "#c084fc" }}>@username</span>) &amp; badge.
              </p>
            </div>

            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(34, 197, 94, 0.15)",
                color: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                marginBottom: "1rem"
              }}>
                <FaMoneyBillWave />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>4. Direct UPI Payout</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Collect your 70%–90% revenue share in your dashboard and request UPI payouts (min ₹100).
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. INTERACTIVE EARNINGS CALCULATOR ──────────────────────────── */}
        <section id="calculator" style={{
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.12))",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "4rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "var(--accent, #f59e0b)",
              padding: "0.6rem",
              borderRadius: "10px",
              fontSize: "1.2rem"
            }}>
              <FaCalculator />
            </div>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>Interactive Earnings Calculator</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0.2rem 0 0" }}>
                Estimate how much you can earn based on your uploaded notes and unlocks
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {/* Input Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>
                  <span>Number of Approved Notes</span>
                  <span style={{ color: "var(--accent)" }}>{numNotes} {numNotes === 1 ? "Note" : "Notes"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={numNotes}
                  onChange={(e) => setNumNotes(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent, #f59e0b)", cursor: "pointer" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>
                  <span>Average Price per Note (₹)</span>
                  <span style={{ color: "var(--accent)" }}>₹{pricePerNote}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="99"
                  step="5"
                  value={pricePerNote}
                  onChange={(e) => setPricePerNote(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent, #f59e0b)", cursor: "pointer" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>
                  <span>Expected Unlocks / Sales per Note</span>
                  <span style={{ color: "var(--accent)" }}>{salesPerNote} Unlocks</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={salesPerNote}
                  onChange={(e) => setSalesPerNote(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent, #f59e0b)", cursor: "pointer" }}
                />
              </div>
            </div>

            {/* Calculated Output Card */}
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                  Estimated Contributor Tier
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent)", margin: "0.25rem 0 1rem 0" }}>
                  {badgeTierLabel} <span style={{ fontSize: "0.9rem", color: "#22c55e", fontWeight: 700 }}>({(shareRate * 100).toFixed(0)}% Share)</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Total Sales Count:</span>
                    <strong>{totalSalesCount} Unlocks</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Gross Note Sales:</span>
                    <strong>₹{grossRevenue.toLocaleString("en-IN")}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Platform Commission Rate:</span>
                    <strong style={{ color: "#ef4444" }}>{(commissionRate * 100).toFixed(0)}%</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "0.825rem", color: "#22c55e", fontWeight: 700 }}>Your Net Contributor Earnings</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#22c55e", margin: "0.2rem 0" }}>
                  ₹{netEarnings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  💡 {nextTierGoal}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. GAMIFIED BADGE TIERS ─────────────────────────────────────── */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Contributor Badge Tiers &amp; Revenue Splits</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>The more quality notes you contribute, the higher your revenue split becomes!</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.25rem" }}>
            <div style={{
              backgroundColor: "rgba(34, 197, 94, 0.05)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>🎓</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#22c55e", margin: "0 0 0.25rem" }}>Verified Contributor</h3>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>70% Share</div>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                Initial tier upon your first approved note submission.
              </p>
            </div>

            <div style={{
              backgroundColor: "rgba(59, 130, 246, 0.05)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>⚡</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#3b82f6", margin: "0 0 0.25rem" }}>Rising Scholar</h3>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>75% Share</div>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                Unlocked at <strong>3+ Approved Notes</strong> AND <strong>25+ Purchases</strong>.
              </p>
            </div>

            <div style={{
              backgroundColor: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>🌟</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f59e0b", margin: "0 0 0.25rem" }}>Top Author</h3>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>82% Share</div>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                Unlocked at <strong>5+ Approved Notes</strong> AND <strong>50+ Purchases</strong>.
              </p>
            </div>

            <div style={{
              backgroundColor: "rgba(236, 72, 153, 0.05)",
              border: "1px solid rgba(236, 72, 153, 0.25)",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>👑</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ec4899", margin: "0 0 0.25rem" }}>Legend Author</h3>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>90% Share</div>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                Unlocked at <strong>10+ Approved Notes</strong> AND <strong>100+ Purchases</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. FAQ ACCORDION ───────────────────────────────────────────── */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Frequently Asked Questions</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Everything you need to know about contributing notes</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "850px", margin: "0 auto" }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
                    borderRadius: "12px",
                    overflow: "hidden"
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    style={{
                      width: "100%",
                      padding: "1.1rem 1.3rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "1rem"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <FaCircleQuestion style={{ color: "var(--accent)" }} /> {faq.q}
                    </span>
                    {isOpen ? <FaChevronUp style={{ fontSize: "0.8rem" }} /> : <FaChevronDown style={{ fontSize: "0.8rem" }} />}
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: "0 1.3rem 1.1rem 2.6rem",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      borderTop: "1px dashed rgba(255,255,255,0.06)",
                      paddingTop: "0.85rem"
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 6. BOTTOM CTA BOX ───────────────────────────────────────────── */}
        <section style={{
          backgroundColor: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 0.6rem" }}>Ready to Share Your Notes &amp; Earn?</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 1.5rem auto", fontSize: "0.95rem" }}>
            Join hundreds of university contributors turning study guides into income. Submit your first PDF note in under 2 minutes.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              backgroundColor: "var(--accent, #f59e0b)",
              color: "#000",
              fontWeight: 800,
              fontSize: "1rem",
              padding: "0.85rem 2rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
            }}
          >
            <FaCloudArrowUp style={{ fontSize: "1.2rem" }} /> Upload Your First Note
          </button>
        </section>

        {/* Modal Instance */}
        <ContributeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </div>
    </div>
  );
}
