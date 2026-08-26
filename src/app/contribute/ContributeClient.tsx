"use client";

import { useState } from "react";
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
  FaFlask,
  FaCircleCheck,
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
    <div style={{ backgroundColor: "var(--bg-primary, #0a0a0c)", color: "var(--text-primary, #f9fafb)", minHeight: "100vh" }}>
      {/* ── BETA NOTICE STRIP (Full Edge-to-Edge Width touching left & right screen edges) ── */}
      <div style={{
        width: "100%",
        background: "linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
        borderBottom: "1px solid rgba(245, 158, 11, 0.3)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.55rem 1.5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem 0.75rem"
        }} className="contrib-beta-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem 0.65rem", flexWrap: "wrap", flex: "1 1 260px", minWidth: 0 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              backgroundColor: "rgba(245, 158, 11, 0.22)",
              color: "#f59e0b",
              border: "1px solid rgba(245, 158, 11, 0.45)",
              borderRadius: "20px",
              padding: "0.2rem 0.6rem",
              fontSize: "0.725rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              flexShrink: 0
            }}>
              <FaFlask style={{ fontSize: "0.8rem" }} /> Beta
            </span>

            <p style={{ margin: 0, fontSize: "clamp(0.775rem, 3.2vw, 0.825rem)", color: "var(--text-primary, #f9fafb)", lineHeight: 1.4, fontWeight: 500, flex: "1 1 200px", minWidth: 0 }}>
              The Contributor Program is in <strong>Beta</strong>, but fully functional! Note uploads, reviews, and UPI payouts are <strong>100% operational</strong>.
            </p>
          </div>

          <div 
            className="hide-on-mobile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.725rem",
              color: "#22c55e",
              fontWeight: 700,
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              borderRadius: "20px",
              padding: "0.2rem 0.6rem",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            <FaCircleCheck style={{ fontSize: "0.8rem" }} /> Fully Operational
          </div>
        </div>
      </div>

      <div className="contrib-page-container">
        <style>{`
          .contrib-beta-container {
            padding: 0 1.5rem;
          }
          .contrib-page-container {
            padding: 1.5rem 1rem 5rem 1rem;
            font-family: inherit;
          }
          .contrib-main-wrapper {
            max-width: 1100px;
            margin: 0 auto;
          }
          .contrib-hero-card {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 24px;
            padding: 3rem 2rem;
            text-align: center;
            margin-bottom: 3rem;
            box-shadow: 0 20px 50px -15px rgba(0,0,0,0.6);
            position: relative;
            overflow: hidden;
          }
          .contrib-hero-title {
            font-size: clamp(1.65rem, 5vw, 3.2rem);
            font-weight: 900;
            line-height: 1.18;
            margin: 0 0 1.25rem 0;
            background: linear-gradient(135deg, #ffffff 30%, var(--accent, #f59e0b) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .contrib-hero-subtitle {
            font-size: clamp(0.95rem, 3.5vw, 1.1rem);
            color: var(--text-secondary, #9ca3af);
            max-width: 750px;
            margin: 0 auto 2rem auto;
            line-height: 1.6;
          }
          .contrib-hero-btn-group {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
          }
          .contrib-section-margin {
            margin-bottom: 4rem;
          }
          .contrib-section-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .contrib-section-title {
            font-size: clamp(1.35rem, 4.5vw, 1.8rem);
            font-weight: 800;
            margin: 0 0 0.5rem 0;
          }
          .contrib-section-sub {
            color: var(--text-secondary);
            font-size: clamp(0.85rem, 3vw, 0.95rem);
          }
          .contrib-calc-box {
            background-color: rgba(0, 0, 0, 0.35);
            border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 4rem;
          }
          .contrib-calc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2rem;
          }
          .contrib-calc-output {
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 16px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .contrib-card-padding {
            padding: 1.5rem;
          }
          .contrib-faq-answer {
            padding: 0 1.3rem 1.1rem 2.6rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.6;
            border-top: 1px dashed rgba(255,255,255,0.06);
            padding-top: 0.85rem;
          }
          .contrib-cta-box {
            background-color: rgba(245, 158, 11, 0.08);
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 20px;
            padding: 2.5rem 2rem;
            text-align: center;
          }

          /* Mobile Breakpoints (< 640px) */
          @media (max-width: 640px) {
            .contrib-beta-inner {
              padding: 0.55rem 0.85rem !important;
            }
            .contrib-page-container {
              padding: 1rem 0.75rem 3.5rem 0.75rem !important;
            }
            .contrib-hero-card {
              padding: 1.75rem 1rem !important;
              border-radius: 18px !important;
              margin-bottom: 2rem !important;
            }
            .contrib-hero-btn-group {
              flex-direction: column !important;
              width: 100% !important;
            }
            .contrib-hero-btn-group > button,
            .contrib-hero-btn-group > a {
              width: 100% !important;
              justify-content: center !important;
            }
            .contrib-section-margin {
              margin-bottom: 2.5rem !important;
            }
            .contrib-section-header {
              margin-bottom: 1.25rem !important;
            }
            .contrib-card-padding {
              padding: 1.15rem 0.85rem !important;
              border-radius: 14px !important;
            }
            .contrib-calc-box {
              padding: 1.15rem 0.85rem !important;
              border-radius: 16px !important;
              margin-bottom: 2.5rem !important;
            }
            .contrib-calc-grid {
              gap: 1.25rem !important;
            }
            .contrib-calc-output {
              padding: 1.15rem 0.85rem !important;
            }
            .contrib-faq-answer {
              padding: 0.65rem 0.85rem 1rem 0.85rem !important;
            }
            .contrib-cta-box {
              padding: 1.5rem 1rem !important;
              border-radius: 16px !important;
            }
            .contrib-cta-box > button {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}</style>
        <div className="contrib-main-wrapper">
          
        {/* ── 1. HERO SECTION ────────────────────────────────────────────── */}
        <section className="contrib-hero-card">
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

          <h1 className="contrib-hero-title">
            Monetize Your University Notes &amp; Empower Peers
          </h1>

          <p className="contrib-hero-subtitle">
            Turn your semester revision guides into a continuous passive income stream. Earn up to <strong>90% revenue share</strong> with direct payouts straight to your UPI account!
          </p>

          <div className="contrib-hero-btn-group">
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
        <section className="contrib-section-margin">
          <div className="contrib-section-header">
            <h2 className="contrib-section-title">How It Works in 4 Simple Steps</h2>
            <p className="contrib-section-sub">A transparent process from note upload to instant UPI earnings</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem"
          }}>
            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px",
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

            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px"
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

            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px"
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

            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              borderRadius: "16px"
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
        <section id="calculator" className="contrib-calc-box">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "var(--accent, #f59e0b)",
              padding: "0.6rem",
              borderRadius: "10px",
              fontSize: "1.2rem",
              flexShrink: 0
            }}>
              <FaCalculator />
            </div>
            <div>
              <h2 className="contrib-section-title" style={{ fontSize: "clamp(1.2rem, 4vw, 1.4rem)" }}>Interactive Earnings Calculator</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0.2rem 0 0" }}>
                Estimate how much you can earn based on your uploaded notes and unlocks
              </p>
            </div>
          </div>

          <div className="contrib-calc-grid">
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
            <div className="contrib-calc-output">
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                  Estimated Contributor Tier
                </div>
                <div style={{ fontSize: "clamp(1.1rem, 4vw, 1.3rem)", fontWeight: 800, color: "var(--accent)", margin: "0.25rem 0 1rem 0" }}>
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
                <div style={{ fontSize: "clamp(1.75rem, 6vw, 2.2rem)", fontWeight: 900, color: "#22c55e", margin: "0.2rem 0" }}>
                  ₹{netEarnings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  💡 {nextTierGoal}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. GAMIFIED BADGE TIERS ─────────────────────────────────────── */}
        <section className="contrib-section-margin">
          <div className="contrib-section-header">
            <h2 className="contrib-section-title">Contributor Badge Tiers &amp; Revenue Splits</h2>
            <p className="contrib-section-sub">The more quality notes you contribute, the higher your revenue split becomes!</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(34, 197, 94, 0.05)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              borderRadius: "16px"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>🎓</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#22c55e", margin: "0 0 0.25rem" }}>Verified Contributor</h3>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>70% Share</div>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                Initial tier upon your first approved note submission.
              </p>
            </div>

            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(59, 130, 246, 0.05)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: "16px"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>⚡</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#3b82f6", margin: "0 0 0.25rem" }}>Rising Scholar</h3>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>75% Share</div>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                Unlocked at <strong>3+ Approved Notes</strong> AND <strong>25+ Purchases</strong>.
              </p>
            </div>

            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "16px"
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>🌟</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f59e0b", margin: "0 0 0.25rem" }}>Top Author</h3>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>82% Share</div>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                Unlocked at <strong>5+ Approved Notes</strong> AND <strong>50+ Purchases</strong>.
              </p>
            </div>

            <div className="contrib-card-padding" style={{
              backgroundColor: "rgba(236, 72, 153, 0.05)",
              border: "1px solid rgba(236, 72, 153, 0.25)",
              borderRadius: "16px"
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
        <section className="contrib-section-margin">
          <div className="contrib-section-header">
            <h2 className="contrib-section-title">Frequently Asked Questions</h2>
            <p className="contrib-section-sub">Everything you need to know about contributing notes</p>
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
                      padding: "1rem 1.15rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "clamp(0.85rem, 3.2vw, 0.95rem)",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "0.75rem"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <FaCircleQuestion style={{ color: "var(--accent)", flexShrink: 0 }} /> {faq.q}
                    </span>
                    {isOpen ? <FaChevronUp style={{ fontSize: "0.8rem", flexShrink: 0 }} /> : <FaChevronDown style={{ fontSize: "0.8rem", flexShrink: 0 }} />}
                  </button>

                  {isOpen && (
                    <div className="contrib-faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 6. BOTTOM CTA BOX ───────────────────────────────────────────── */}
        <section className="contrib-cta-box">
          <h2 className="contrib-section-title" style={{ fontSize: "clamp(1.3rem, 5vw, 1.6rem)" }}>Ready to Share Your Notes &amp; Earn?</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 1.5rem auto", fontSize: "0.95rem", lineHeight: 1.5 }}>
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
  </div>
);
}
