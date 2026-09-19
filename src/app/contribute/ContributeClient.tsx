"use client";

import { useState } from "react";
import ContributeModal from "@/components/contribute/ContributeModalDynamic";
import {
  calculateBadgeTier,
  getContributorShareRate,
  getPlatformCommissionRate,
} from "@/utils/badgeUtils";
import { Work_Sans, Caveat } from "next/font/google";
import {
  FaCloudArrowUp,
  FaShieldHalved,
  FaRocket,
  FaMoneyBillWave,
  FaCalculator,
  FaChevronDown,
  FaChevronUp,
  FaFlask,
} from "react-icons/fa6";

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
      a: "Any enrolled student, alumni, top ranker, or educator can contribute! If you have well-structured handwritten or digital PDF notes for university courses, you can upload them.",
    },
    {
      q: "What file formats and restrictions apply?",
      a: "Submissions must strictly be in PDF format (.pdf) with a maximum file size of 5 MB per document. Ensure notes are clear, legible, and accurate.",
    },
    {
      q: "How does the revenue split and pricing work?",
      a: "You set your note price anywhere from ₹0 (Free) up to ₹99. For paid notes, base contributors earn 70% of sales. As you publish more approved notes and get more unlocks, your Tier levels up to Rising (75%), Top Author (82%), and Legend (90%)!",
    },
    {
      q: "How and when do I get paid?",
      a: "Your net earnings accumulate live in your Contributor Dashboard. Once your available balance reaches ₹100, you can request a direct payout to your UPI ID (Google Pay, PhonePe, Paytm, BHIM).",
    },
    {
      q: "How long does Admin Approval take?",
      a: "Our admin team usually reviews submissions within 12–24 hours to check PDF quality, subject alignment, and legibility before publishing your note live.",
    },
    {
      q: "Can I manage or delete my notes later?",
      a: "Yes! You can manage, view sales stats, or delete your contributed notes anytime directly from your Contributor Dashboard.",
    },
  ];

  const steps = [
    {
      icon: <FaCloudArrowUp />,
      title: "1. Upload PDF",
      desc: "Select your University, Branch, Semester, upload your PDF (≤5MB), and set a price from ₹0 to ₹99.",
    },
    {
      icon: <FaShieldHalved />,
      title: "2. Quality review",
      desc: "Admins verify note accuracy, legibility, and subject alignment within 12–24 hours.",
    },
    {
      icon: <FaRocket />,
      title: "3. Go live",
      desc: (
        <>Your note is published on the marketplace with your profile link (<span style={{ color: "var(--nb-margin)" }}>@username</span>) &amp; badge.</>
      ),
    },
    {
      icon: <FaMoneyBillWave />,
      title: "4. Direct UPI payout",
      desc: "Collect your 70%–90% revenue share in your dashboard and request UPI payouts (min ₹100).",
    },
  ];

  const tiers = [
    { emoji: "🎓", name: "Verified Contributor", share: "70% Share", desc: "Initial tier upon your first approved note submission." },
    { emoji: "⚡", name: "Rising Scholar", share: "75% Share", desc: <>Unlocked at <strong>3+ approved notes</strong> and <strong>25+ purchases</strong>.</> },
    { emoji: "🌟", name: "Top Author", share: "82% Share", desc: <>Unlocked at <strong>5+ approved notes</strong> and <strong>50+ purchases</strong>.</> },
    { emoji: "👑", name: "Legend Author", share: "90% Share", desc: <>Unlocked at <strong>10+ approved notes</strong> and <strong>100+ purchases</strong>.</> },
  ];

  return (
    <div className={`${workSans.variable} ${caveat.variable} notebook-page-root`}>
      <style>{`
        .notebook-page-root {
          --nb-paper: #fbfaf4;
          --nb-rule: #dbe6ef;
          --nb-margin: #c94f4f;
          --nb-ink: #1d3557;
          --nb-ink-dim: #5c7089;
          --nb-yellow: #ffe98a;
          --nb-mint: #bfe3d0;
          --nb-pink: #f6c9d3;
          --nb-card-line: #d9d2bd;

          position: relative;
          width: 100%;
          background:
            repeating-linear-gradient(to bottom, transparent 0 31px, var(--nb-rule) 31px 32px),
            var(--nb-paper);
          color: var(--nb-ink);
          font-family: var(--font-body), sans-serif;
          overflow: hidden;
        }

        .notebook-page-root a { color: inherit; text-decoration: none; }

        .notebook-page-root a:focus-visible,
        .notebook-page-root button:focus-visible,
        .notebook-page-root input:focus-visible {
          outline: 2px solid var(--nb-margin);
          outline-offset: 3px;
        }

        .nb-spine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 58px;
          background:
            radial-gradient(circle at 50% 50%, var(--nb-paper) 0 5px, #c7cfd6 5px 6.5px, transparent 6.5px);
          background-size: 100% 34px;
          background-repeat: repeat-y;
          border-right: 1px solid var(--nb-rule);
        }

        .nb-margin-rule {
          position: absolute;
          top: 0;
          left: 92px;
          width: 2px;
          height: 100%;
          background: var(--nb-margin);
          opacity: 0.55;
          transform-origin: top;
          animation: nb-grow-line 1s ease-out both;
        }

        @keyframes nb-grow-line {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .nb-margin-rule { animation: none; transform: scaleY(1); }
        }

        .nb-shell {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding: 4.5rem 1.75rem 5rem 6.5rem;
        }

        /* ---------- beta tape banner ---------- */
        .nb-beta-tape {
          position: relative;
          background: var(--nb-yellow);
          border: 1px dashed var(--nb-card-line);
          padding: 0.75rem 1.25rem;
          margin-bottom: 2.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          transform: rotate(-0.6deg);
        }

        .nb-beta-icon {
          color: var(--nb-margin);
          flex: none;
          font-size: 1.1rem;
        }

        .nb-beta-text {
          font-size: 0.88rem;
          color: var(--nb-ink);
          line-height: 1.45;
          margin: 0;
        }

        /* ---------- header ---------- */
        .nb-tab {
          display: inline-block;
          font-family: var(--font-hand), cursive;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--nb-ink);
          background: var(--nb-yellow);
          padding: 0.2rem 0.9rem 0.35rem;
          transform: rotate(-2.5deg);
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
          margin-bottom: 1.4rem;
        }

        .notebook-page-root h1 {
          font-weight: 700;
          font-size: clamp(2.2rem, 4.6vw, 3.1rem);
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: var(--nb-ink);
        }

        .nb-tagline {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--nb-ink-dim);
          max-width: 68ch;
          margin-top: 1.2rem;
        }

        .nb-tagline strong { color: var(--nb-ink); }

        .nb-hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.75rem;
        }

        .nb-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--nb-ink);
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.92rem;
          padding: 0.75rem 1.5rem;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .nb-btn-primary:hover {
          background: var(--nb-margin);
          color: #ffffff !important;
          transform: translateY(-1px);
        }

        .nb-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          color: var(--nb-ink);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.92rem;
          padding: 0.72rem 1.4rem;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }

        .nb-btn-secondary:hover {
          border-color: var(--nb-ink);
          transform: translateY(-1px);
        }

        /* ---------- section heading ---------- */
        .nb-section-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--nb-ink);
        }

        .nb-section-title::before {
          content: "";
          width: 8px;
          height: 8px;
          background: var(--nb-margin);
          border-radius: 50%;
          flex: none;
        }

        section { margin-top: 3.5rem; }

        /* ---------- flashcards / steps ---------- */
        .nb-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.4rem;
        }

        .nb-flashcard {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.5rem;
          overflow: hidden;
          box-shadow: 0 3px 8px rgba(29, 53, 87, 0.05);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .nb-flashcard:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(29, 53, 87, 0.08);
        }

        .nb-flashcard::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 18px 18px 0;
          border-color: transparent var(--nb-paper) transparent transparent;
          filter: drop-shadow(-1px 1px 1px rgba(0,0,0,0.08));
        }

        .nb-step-icon {
          color: var(--nb-margin);
          font-size: 1.4rem;
          margin-bottom: 0.9rem;
          display: flex;
        }

        .nb-flashcard h3 {
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.4rem;
          color: var(--nb-ink);
        }

        .nb-flashcard p {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--nb-ink-dim);
          margin: 0;
        }

        /* ---------- calculator worksheet dossier ---------- */
        .nb-worksheet {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 2rem;
          box-shadow: 0 4px 14px rgba(29, 53, 87, 0.06);
        }

        .nb-worksheet::before {
          content: "";
          position: absolute;
          top: -8px;
          left: 36px;
          width: 54px;
          height: 18px;
          background: rgba(29, 53, 87, 0.12);
          transform: rotate(-2deg);
        }

        .nb-worksheet-desc {
          font-size: 0.92rem;
          color: var(--nb-ink-dim);
          margin-bottom: 1.75rem;
          line-height: 1.5;
        }

        .nb-calc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }

        .nb-slider-row { margin-bottom: 1.4rem; }

        .nb-slider-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--nb-ink);
        }

        .nb-slider-value {
          font-family: var(--font-hand), cursive;
          font-size: 1.15rem;
          color: var(--nb-margin);
        }

        .nb-slider-row input[type="range"] {
          width: 100%;
          cursor: pointer;
        }

        .nb-report-card {
          background: var(--nb-paper);
          border: 1px dashed var(--nb-card-line);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .nb-report-label {
          font-size: 0.78rem;
          color: var(--nb-ink-dim);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .nb-report-tier {
          font-family: var(--font-hand), cursive;
          font-size: 1.45rem;
          color: var(--nb-ink);
          margin: 0.25rem 0 1rem;
        }

        .nb-report-tier span {
          font-family: var(--font-body), sans-serif;
          font-size: 0.82rem;
          background: var(--nb-ink);
          color: #fff;
          padding: 0.1rem 0.4rem;
          margin-left: 0.4rem;
          vertical-align: middle;
        }

        .nb-report-rows {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          font-size: 0.87rem;
          border-top: 1px dashed var(--nb-card-line);
          padding-top: 0.9rem;
        }

        .nb-report-rows > div { display: flex; justify-content: space-between; }
        .nb-report-rows span:first-child { color: var(--nb-ink-dim); }
        .nb-report-rows .nb-commission { color: var(--nb-margin); }

        .nb-earnings-block {
          margin-top: 1.4rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--nb-card-line);
        }

        .nb-earnings-label {
          font-size: 0.8rem;
          color: var(--nb-margin);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .nb-earnings-num {
          font-family: var(--font-hand), cursive;
          font-size: clamp(2.2rem, 6vw, 2.7rem);
          color: var(--nb-ink);
          margin: 0.1rem 0;
          line-height: 1.1;
        }

        .nb-next-tier {
          font-size: 0.78rem;
          color: var(--nb-ink-dim);
          line-height: 1.5;
        }

        /* ---------- tiers cards ---------- */
        .nb-tiers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .nb-tier-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--nb-card-line);
          padding: 1.5rem 1.25rem;
          box-shadow: 0 3px 8px rgba(29, 53, 87, 0.05);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .nb-tier-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(29, 53, 87, 0.08);
        }

        .nb-tier-emoji {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .nb-tier-card h3 {
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
          color: var(--nb-ink);
        }

        .nb-tier-share {
          font-family: var(--font-hand), cursive;
          font-size: 1.5rem;
          color: var(--nb-margin);
          margin-bottom: 0.4rem;
        }

        .nb-tier-card p {
          font-size: 0.86rem;
          color: var(--nb-ink-dim);
          line-height: 1.55;
          margin: 0;
        }

        /* ---------- faq accordion (notebook style) ---------- */
        .nb-faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .nb-faq-card {
          background: #fff;
          border: 1px solid var(--nb-card-line);
          box-shadow: 0 2px 6px rgba(29, 53, 87, 0.04);
          overflow: hidden;
        }

        .nb-faq-btn {
          width: 100%;
          padding: 1rem 1.25rem;
          background: transparent;
          border: none;
          color: var(--nb-ink);
          font-weight: 700;
          font-size: 0.95rem;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          gap: 0.75rem;
          transition: background 0.15s ease;
        }

        .nb-faq-btn:hover {
          background: var(--nb-paper);
        }

        .nb-faq-btn-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nb-faq-q-mark {
          flex: none;
          font-family: var(--font-hand), cursive;
          font-size: 1.5rem;
          color: var(--nb-margin);
          line-height: 1;
        }

        .nb-faq-chevron {
          color: var(--nb-ink-dim);
          flex: none;
          font-size: 0.85rem;
        }

        .nb-faq-answer {
          padding: 0.85rem 1.25rem 1.15rem 2.75rem;
          font-size: 0.88rem;
          color: var(--nb-ink-dim);
          line-height: 1.6;
          border-top: 1px dashed var(--nb-card-line);
        }

        /* ---------- cta ticket ---------- */
        .nb-ticket {
          position: relative;
          background: #fff;
          border: 2px dashed var(--nb-card-line);
          padding: 2.25rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
        }

        .nb-ticket::before,
        .nb-ticket::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 24px;
          height: 24px;
          background: var(--nb-paper);
          border-radius: 50%;
          transform: translateY(-50%);
        }

        .nb-ticket::before { left: -12px; }
        .nb-ticket::after { right: -12px; }

        .nb-ticket h2 {
          font-weight: 700;
          font-size: 1.3rem;
          color: var(--nb-ink);
          margin: 0;
        }

        .nb-ticket p {
          font-size: 0.92rem;
          color: var(--nb-ink-dim);
          max-width: 480px;
          line-height: 1.6;
          margin: 0;
        }

        /* ---------- responsive ---------- */
        @media (max-width: 760px) {
          .nb-spine, .nb-margin-rule { display: none; }
          .nb-shell { padding: 3.25rem 1.25rem 3.5rem; }
          .nb-steps-grid, .nb-tiers-grid { grid-template-columns: 1fr; }
          .nb-worksheet { padding: 1.4rem 1.15rem; }
          .nb-calc-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .nb-faq-answer { padding: 0.85rem 1.15rem 1.1rem 1.15rem; }
          .nb-hero-actions { width: 100%; flex-direction: column; }
          .nb-btn-primary, .nb-btn-secondary { width: 100%; justify-content: center; }
          .nb-ticket button { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Decorative spine & red margin rule */}
      <div className="nb-spine" aria-hidden="true" />
      <div className="nb-margin-rule" aria-hidden="true" />

      <div className="nb-shell">
        {/* Beta Notice Tape */}
        <div className="nb-beta-tape">
          <FaFlask className="nb-beta-icon" aria-hidden="true" />
          <p className="nb-beta-text">
            The Contributor Program is in <strong>Beta</strong>, but fully functional! Note uploads, quality reviews, and UPI payouts are <strong>100% operational</strong>.
          </p>
        </div>

        {/* Hero Header (Left-aligned matching About, Careers, Contact, Projects) */}
        <header id="contribute-header">
          <span className="nb-tab">💰 Contribution service program</span>
          <h1>Monetize your university notes &amp; empower peers</h1>
          <p className="nb-tagline">
            Turn your semester revision guides into a continuous passive income stream. Earn up to <strong>90% revenue share</strong> with direct payouts straight to your UPI account!
          </p>
          <div className="nb-hero-actions">
            <button className="nb-btn-primary" onClick={() => setIsModalOpen(true)}>
              <FaCloudArrowUp /> Submit note now
            </button>
            <a className="nb-btn-secondary" href="#calculator">
              <FaCalculator /> Calculate earnings
            </a>
          </div>
        </header>

        {/* 4 Steps Section */}
        <section id="contribute-steps-section">
          <h2 className="nb-section-title">How it works in 4 simple steps</h2>
          <div className="nb-steps-grid">
            {steps.map((step, i) => (
              <div className="nb-flashcard" key={i}>
                <div className="nb-step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculator">
          <h2 className="nb-section-title">Interactive earnings calculator</h2>
          <div className="nb-worksheet">
            <p className="nb-worksheet-desc">Estimate how much you can earn based on your uploaded notes and expected student unlocks.</p>

            <div className="nb-calc-grid">
              <div>
                <div className="nb-slider-row">
                  <div className="nb-slider-label">
                    <span>Number of approved notes</span>
                    <span className="nb-slider-value">{numNotes} {numNotes === 1 ? "note" : "notes"}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={numNotes}
                    onChange={(e) => setNumNotes(Number(e.target.value))}
                    style={{ accentColor: "var(--nb-ink)" }}
                  />
                </div>

                <div className="nb-slider-row">
                  <div className="nb-slider-label">
                    <span>Average price per note (₹)</span>
                    <span className="nb-slider-value">₹{pricePerNote}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="99"
                    step="5"
                    value={pricePerNote}
                    onChange={(e) => setPricePerNote(Number(e.target.value))}
                    style={{ accentColor: "var(--nb-ink)" }}
                  />
                </div>

                <div className="nb-slider-row">
                  <div className="nb-slider-label">
                    <span>Expected unlocks / sales per note</span>
                    <span className="nb-slider-value">{salesPerNote} unlocks</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={salesPerNote}
                    onChange={(e) => setSalesPerNote(Number(e.target.value))}
                    style={{ accentColor: "var(--nb-ink)" }}
                  />
                </div>
              </div>

              <div className="nb-report-card">
                <div>
                  <div className="nb-report-label">Estimated contributor tier</div>
                  <div className="nb-report-tier">
                    {badgeTierLabel} <span>{(shareRate * 100).toFixed(0)}% share</span>
                  </div>

                  <div className="nb-report-rows">
                    <div><span>Total sales count:</span> <strong>{totalSalesCount} unlocks</strong></div>
                    <div><span>Gross note sales:</span> <strong>₹{grossRevenue.toLocaleString("en-IN")}</strong></div>
                    <div><span>Platform commission rate:</span> <strong className="nb-commission">{(commissionRate * 100).toFixed(0)}%</strong></div>
                  </div>
                </div>

                <div className="nb-earnings-block">
                  <div className="nb-earnings-label">Your net contributor earnings</div>
                  <div className="nb-earnings-num">₹{netEarnings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                  <div className="nb-next-tier">💡 {nextTierGoal}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tiers Section */}
        <section id="contribute-tiers-section">
          <h2 className="nb-section-title">Contributor badge tiers &amp; revenue splits</h2>
          <div className="nb-tiers-grid">
            {tiers.map((tier, i) => (
              <div className="nb-tier-card" key={i}>
                <div className="nb-tier-emoji">{tier.emoji}</div>
                <h3>{tier.name}</h3>
                <div className="nb-tier-share">{tier.share}</div>
                <p>{tier.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section id="contribute-faq-section">
          <h2 className="nb-section-title">Frequently asked questions</h2>
          <div className="nb-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div className="nb-faq-card" key={faq.q}>
                  <button className="nb-faq-btn" onClick={() => setOpenFaqIndex(isOpen ? null : index)}>
                    <span className="nb-faq-btn-label">
                      <span className="nb-faq-q-mark" aria-hidden="true">Q</span>
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? <FaChevronUp className="nb-faq-chevron" /> : <FaChevronDown className="nb-faq-chevron" />}
                  </button>
                  {isOpen && <div className="nb-faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Ticket CTA */}
        <section id="contribute-cta-section">
          <div className="nb-ticket">
            <h2>Ready to share your notes &amp; earn?</h2>
            <p>Join hundreds of university contributors turning study guides into income. Submit your first PDF note in under 2 minutes.</p>
            <button className="nb-btn-primary" onClick={() => setIsModalOpen(true)}>
              <FaCloudArrowUp /> Upload your first note
            </button>
          </div>
        </section>

        <ContributeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}