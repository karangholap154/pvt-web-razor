"use client";

import { useState } from "react";
import styles from "./contribute.module.css";
import ContributeModal from "@/components/contribute/ContributeModalDynamic";
import {
  calculateBadgeTier,
  getContributorShareRate,
  getPlatformCommissionRate,
} from "@/utils/badgeUtils";
import {
  LuCloudUpload,
  LuShieldCheck,
  LuSparkles,
  LuBanknote,
  LuCalculator,
  LuChevronDown,
  LuCheck,
  LuGraduationCap,
  LuCrown,
  LuZap,
  LuArrowRight,
  LuFileText,
} from "react-icons/lu";

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

  // Authoritative badge utility functions
  const rawBadgeTier = calculateBadgeTier(totalNotes, totalSalesCount);
  const shareRate = getContributorShareRate(rawBadgeTier);
  const commissionRate = getPlatformCommissionRate(rawBadgeTier);
  const netEarnings = grossRevenue * shareRate;

  // Format Tier Display Name & Icon
  let badgeTierLabel = "Verified Contributor";
  let tierIcon = <LuGraduationCap size={15} />;
  if (rawBadgeTier === "legend") {
    badgeTierLabel = "Legend Author";
    tierIcon = <LuCrown size={15} />;
  } else if (rawBadgeTier === "top_author") {
    badgeTierLabel = "Top Author";
    tierIcon = <LuSparkles size={15} />;
  } else if (rawBadgeTier === "rising") {
    badgeTierLabel = "Rising Scholar";
    tierIcon = <LuZap size={15} />;
  }

  // Calculate detailed progress towards the next tier
  let nextTierGoal = "";
  if (rawBadgeTier === "legend") {
    nextTierGoal = "🎉 Maximum Legend Tier Reached (90% Contributor Revenue Share)!";
  } else if (rawBadgeTier === "top_author") {
    const notesNeeded = Math.max(0, 10 - totalNotes);
    const salesNeeded = Math.max(0, 100 - totalSalesCount);
    nextTierGoal = `Next Tier: Legend (90% Share) — Needs ${notesNeeded > 0 ? `${notesNeeded} more approved note(s)` : ""}${notesNeeded > 0 && salesNeeded > 0 ? " & " : ""}${salesNeeded > 0 ? `${salesNeeded} more purchase(s)` : ""}.`;
  } else if (rawBadgeTier === "rising") {
    const notesNeeded = Math.max(0, 5 - totalNotes);
    const salesNeeded = Math.max(0, 50 - totalSalesCount);
    nextTierGoal = `Next Tier: Top Author (82% Share) — Needs ${notesNeeded > 0 ? `${notesNeeded} more approved note(s)` : ""}${notesNeeded > 0 && salesNeeded > 0 ? " & " : ""}${salesNeeded > 0 ? `${salesNeeded} more purchase(s)` : ""}.`;
  } else {
    const notesNeeded = Math.max(0, 3 - totalNotes);
    const salesNeeded = Math.max(0, 25 - totalSalesCount);
    nextTierGoal = `Next Tier: Rising Scholar (75% Share) — Needs ${notesNeeded > 0 ? `${notesNeeded} more approved note(s)` : ""}${notesNeeded > 0 && salesNeeded > 0 ? " & " : ""}${salesNeeded > 0 ? `${salesNeeded} more purchase(s)` : ""}.`;
  }

  // Calculate percentage to next tier
  let tierProgressPercent = 100;
  if (rawBadgeTier === "legend") {
    tierProgressPercent = 100;
  } else if (rawBadgeTier === "top_author") {
    const notesProgress = Math.min(1, totalNotes / 10);
    const salesProgress = Math.min(1, totalSalesCount / 100);
    tierProgressPercent = Math.min(99, Math.round((notesProgress * 0.5 + salesProgress * 0.5) * 100));
  } else if (rawBadgeTier === "rising") {
    const notesProgress = Math.min(1, totalNotes / 5);
    const salesProgress = Math.min(1, totalSalesCount / 50);
    tierProgressPercent = Math.min(99, Math.round((notesProgress * 0.5 + salesProgress * 0.5) * 100));
  } else {
    const notesProgress = Math.min(1, totalNotes / 3);
    const salesProgress = Math.min(1, totalSalesCount / 25);
    tierProgressPercent = Math.min(99, Math.round((notesProgress * 0.5 + salesProgress * 0.5) * 100));
  }

  const faqs = [
    {
      q: "Who can contribute study notes on Private Academy?",
      a: "Any enrolled engineering student, university alumni, top ranker, or educator can contribute! If you have well-structured handwritten or digital notes for university courses, you can upload them to share with peers.",
    },
    {
      q: "What file formats and restrictions apply?",
      a: "Submissions must strictly be in PDF format (.pdf) with a maximum file size of 5 MB per document. Ensure notes are clear, high-resolution, legible, and directly relevant to the curriculum.",
    },
    {
      q: "How does the revenue split and pricing work?",
      a: "You set your note price anywhere from ₹0 (Free) up to ₹99. Base contributors earn 70% of gross sales. As you publish more approved notes and gain unlocks, your tier levels up to Rising Scholar (75%), Top Author (82%), and Legend Author (90%)!",
    },
    {
      q: "How and when do I get paid?",
      a: "Your net earnings accumulate live in your Contributor Dashboard. Once your available balance reaches ₹100, you can request a direct payout to your UPI ID (Google Pay, PhonePe, Paytm, or BHIM) with zero hidden fees.",
    },
    {
      q: "How long does Admin Approval take?",
      a: "Our editorial team usually reviews submissions within 12–24 hours to check PDF quality, subject alignment, and legibility before publishing your note live on the platform.",
    },
    {
      q: "Can I manage or delete my notes later?",
      a: "Yes! You can manage, update suggested pricing, view download metrics, or unpublish your notes at any time directly from your Contributor Dashboard.",
    },
  ];

  return (
    <div className={styles.pageWrapper}>

      {/* ==================================================================
          1. HERO SECTION (GRAPH PAPER BACKGROUND)
          ================================================================== */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            
            <div className={styles.specBadge}>
              <LuSparkles size={14} />
              <span>Contributor Program // 70%–90% Revenue Share</span>
            </div>

            <h1 className={styles.heroTitle}>
              Turn your semester notes into{" "}
              <span className={styles.highlightText}>income.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Upload your clean engineering handwritten or digital notes once. Earn up to 90% revenue share on every student unlock with direct UPI transfers.
            </p>

            <div className={styles.heroBtnGroup}>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={styles.btnPrimary}
                id="btn-hero-upload-note"
              >
                <LuCloudUpload size={18} />
                <span>Upload your first note</span>
              </button>

              <a
                href="#calculator"
                className={styles.btnSecondary}
                id="btn-hero-calc-earnings"
              >
                <LuCalculator size={17} />
                <span>Calculate earnings</span>
              </a>
            </div>

            {/* Operational Trust Strip */}
            <div className={styles.trustStrip}>
              <div className={styles.trustItem}>
                <span className={styles.trustDotGreen} />
                <span>Direct UPI Settlements Active</span>
              </div>
              <div className={styles.trustItem}>
                <LuShieldCheck size={16} style={{ color: "#0F7B4F" }} />
                <span>12–24h Review Turnaround</span>
              </div>
              <div className={styles.trustItem}>
                <LuBanknote size={16} style={{ color: "var(--blue-500, #2447F5)" }} />
                <span>Min ₹100 Payout Threshold</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================
          2. HOW IT WORKS (4-STEP INDEX ROW)
          ================================================================== */}
      <section className={styles.sectionPadding}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>TRANSPARENT WORKFLOW</span>
            <h2 className={styles.sectionTitle}>How it works in 4 simple steps</h2>
            <p className={styles.sectionSubtitle}>
              A seamless, audit-checked pipeline from PDF upload to continuous student earnings.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            
            {/* Step 1 */}
            <div className={styles.stepCard}>
              <div className={styles.stepTopRow}>
                <span className={styles.stepNumber}>01</span>
                <LuFileText size={20} className={styles.stepIcon} />
              </div>
              <h3 className={styles.stepTitle}>Upload PDF</h3>
              <p className={styles.stepDesc}>
                Select University, Branch &amp; Semester. Upload your clean PDF (≤5MB) and set your unlock price from ₹0 to ₹99.
              </p>
            </div>

            {/* Step 2 */}
            <div className={styles.stepCard}>
              <div className={styles.stepTopRow}>
                <span className={styles.stepNumber}>02</span>
                <LuShieldCheck size={20} className={styles.stepIcon} />
              </div>
              <h3 className={styles.stepTitle}>Quality Review</h3>
              <p className={styles.stepDesc}>
                Admins audit clarity, legibility, and syllabus alignment within 12–24 hours to ensure high quality.
              </p>
            </div>

            {/* Step 3 */}
            <div className={styles.stepCard}>
              <div className={styles.stepTopRow}>
                <span className={styles.stepNumber}>03</span>
                <LuSparkles size={20} className={styles.stepIcon} />
              </div>
              <h3 className={styles.stepTitle}>Go Live</h3>
              <p className={styles.stepDesc}>
                Your note is published across the marketplace with your verified author profile link (@username) and tier badge.
              </p>
            </div>

            {/* Step 4 */}
            <div className={styles.stepCard}>
              <div className={styles.stepTopRow}>
                <span className={styles.stepNumber}>04</span>
                <LuBanknote size={20} className={styles.stepIcon} />
              </div>
              <h3 className={styles.stepTitle}>Direct UPI Payout</h3>
              <p className={styles.stepDesc}>
                Accumulate 70% to 90% revenue share in your dashboard and request payouts directly to your UPI ID (min ₹100).
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================================
          3. INTERACTIVE EARNINGS CALCULATOR
          ================================================================== */}
      <section id="calculator" className={styles.sectionPadding}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>REVENUE ESTIMATOR</span>
            <h2 className={styles.sectionTitle}>Interactive Earnings Calculator</h2>
            <p className={styles.sectionSubtitle}>
              Estimate how much you can earn based on your uploaded notes, price, and student unlocks.
            </p>
          </div>

          <div className={styles.calcCard}>
            
            {/* Left Controls Column */}
            <div className={styles.calcControlsCol}>
              
              {/* Slider 1: Number of Notes */}
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <label htmlFor="range-notes" className={styles.sliderLabel}>
                    Approved Study Notes
                  </label>
                  <span className={styles.sliderValueTag}>
                    {numNotes} {numNotes === 1 ? "Note" : "Notes"}
                  </span>
                </div>
                <input
                  id="range-notes"
                  type="range"
                  min="1"
                  max="20"
                  value={numNotes}
                  onChange={(e) => setNumNotes(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <div className={styles.rangeLimits}>
                  <span>1 Note</span>
                  <span>20 Notes</span>
                </div>
              </div>

              {/* Slider 2: Price per Note */}
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <label htmlFor="range-price" className={styles.sliderLabel}>
                    Average Price per Note (₹)
                  </label>
                  <span className={styles.sliderValueTag}>
                    ₹{pricePerNote}
                  </span>
                </div>
                <input
                  id="range-price"
                  type="range"
                  min="10"
                  max="99"
                  step="5"
                  value={pricePerNote}
                  onChange={(e) => setPricePerNote(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <div className={styles.rangeLimits}>
                  <span>₹10 (Affordable)</span>
                  <span>₹99 (Premium)</span>
                </div>
              </div>

              {/* Slider 3: Expected Unlocks per Note */}
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <label htmlFor="range-unlocks" className={styles.sliderLabel}>
                    Expected Unlocks per Note
                  </label>
                  <span className={styles.sliderValueTag}>
                    {salesPerNote} Unlocks
                  </span>
                </div>
                <input
                  id="range-unlocks"
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={salesPerNote}
                  onChange={(e) => setSalesPerNote(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <div className={styles.rangeLimits}>
                  <span>5 Unlocks</span>
                  <span>200 Unlocks</span>
                </div>
              </div>

              {/* Quick Milestone Presets */}
              <div className={styles.presetsRow}>
                <span className={styles.presetsLabel}>QUICK MILESTONES:</span>
                <div className={styles.presetButtons}>
                  <button
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => {
                      setNumNotes(1);
                      setPricePerNote(49);
                      setSalesPerNote(10);
                    }}
                  >
                    1 Note (70%)
                  </button>
                  <button
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => {
                      setNumNotes(3);
                      setPricePerNote(49);
                      setSalesPerNote(25);
                    }}
                  >
                    Rising (75%)
                  </button>
                  <button
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => {
                      setNumNotes(5);
                      setPricePerNote(49);
                      setSalesPerNote(50);
                    }}
                  >
                    Top Author (82%)
                  </button>
                  <button
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => {
                      setNumNotes(10);
                      setPricePerNote(49);
                      setSalesPerNote(100);
                    }}
                  >
                    Legend (90%)
                  </button>
                </div>
              </div>

            </div>

            {/* Right Output Column */}
            <div className={styles.calcOutputCol}>
              
              <div className={styles.outputHeader}>
                <div className={styles.outputTierTag}>
                  {tierIcon}
                  <span>{badgeTierLabel}</span>
                </div>
                <h3 className={styles.outputTierTitle}>
                  {(shareRate * 100).toFixed(0)}% Contributor Revenue Share
                </h3>
              </div>

              {/* Progress to Next Milestone Track */}
              <div className={styles.tierProgressBarWrap}>
                <div className={styles.tierProgressHeader}>
                  <span className={styles.tierProgressLabel}>TIER PROGRESS</span>
                  <span className={styles.tierProgressVal}>{tierProgressPercent}%</span>
                </div>
                <div className={styles.tierProgressTrack} role="progressbar" aria-valuenow={tierProgressPercent} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className={styles.tierProgressFill}
                    style={{ width: `${tierProgressPercent}%` }}
                  />
                </div>
              </div>

              <div className={styles.metricsList}>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Total Lifetime Sales</span>
                  <span className={styles.metricValue}>{totalSalesCount} Unlocks</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Gross Note Sales</span>
                  <span className={styles.metricValue}>₹{grossRevenue.toLocaleString("en-IN")}</span>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Platform Fee</span>
                  <span className={styles.metricValue}>{(commissionRate * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className={styles.earningsBox}>
                <span className={styles.earningsLabel}>Your Net Estimated Earnings</span>
                <div className={styles.earningsValue}>
                  ₹{netEarnings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className={styles.nextTierGoalNotice}>
                {nextTierGoal}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================================
          4. TIER STAIRCASE (SIGNATURE DARK SECTION)
          ================================================================== */}
      <section className={styles.tiersDarkSection}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionEyebrow} ${styles.darkEyebrow}`}>
              REVENUE SPLIT TIERS
            </span>
            <h2 className={`${styles.sectionTitle} ${styles.darkTitle}`}>
              Contributor Tiers &amp; Revenue Splits
            </h2>
            <p className={`${styles.sectionSubtitle} ${styles.darkSubtitle}`}>
              The more quality notes you publish and the more students unlock them, the higher your commission climbs.
            </p>
          </div>

          <div className={styles.tiersGrid}>
            
            {/* Tier 1 */}
            <div className={styles.tierDarkCard}>
              <div className={styles.tierCardTop}>
                <span className={styles.tierBadgePill} style={{ backgroundColor: "rgba(15, 123, 79, 0.2)", color: "#34D399" }}>
                  Level 1
                </span>
                <h3 className={styles.tierName}>Verified Contributor</h3>
                <div className={styles.tierSharePercent}>70%</div>
              </div>
              <p className={styles.tierCriteria}>
                Initial tier unlocked upon your first approved note publication.
              </p>
            </div>

            {/* Tier 2 */}
            <div className={styles.tierDarkCard}>
              <div className={styles.tierCardTop}>
                <span className={styles.tierBadgePill} style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#60A5FA" }}>
                  Level 2
                </span>
                <h3 className={styles.tierName}>Rising Scholar</h3>
                <div className={styles.tierSharePercent}>75%</div>
              </div>
              <p className={styles.tierCriteria}>
                Unlocked at <strong>3+ Approved Notes</strong> AND <strong>25+ Purchases</strong>.
              </p>
            </div>

            {/* Tier 3 */}
            <div className={styles.tierDarkCard}>
              <div className={styles.tierCardTop}>
                <span className={styles.tierBadgePill} style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#FBBF24" }}>
                  Level 3
                </span>
                <h3 className={styles.tierName}>Top Author</h3>
                <div className={styles.tierSharePercent}>82%</div>
              </div>
              <p className={styles.tierCriteria}>
                Unlocked at <strong>5+ Approved Notes</strong> AND <strong>50+ Purchases</strong>.
              </p>
            </div>

            {/* Tier 4 */}
            <div className={styles.tierDarkCard}>
              <div className={styles.tierCardTop}>
                <span className={styles.tierBadgePill} style={{ backgroundColor: "rgba(236, 72, 153, 0.2)", color: "#F472B6" }}>
                  Level 4
                </span>
                <h3 className={styles.tierName}>Legend Author</h3>
                <div className={styles.tierSharePercent}>90%</div>
              </div>
              <p className={styles.tierCriteria}>
                Unlocked at <strong>10+ Approved Notes</strong> AND <strong>100+ Purchases</strong>.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================================
          5. FAQ ACCORDION SECTION
          ================================================================== */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>COMMON QUESTIONS</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to know about publishing notes, copyright, and getting paid.
            </p>
          </div>

          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.q} className={styles.faqItem}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className={styles.faqQuestionBtn}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <LuChevronDown
                      size={18}
                      className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================================
          6. FINAL CTA BANNER
          ================================================================== */}
      <section className={styles.finalCtaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>
              Ready to turn your study notes into income?
            </h2>
            <p className={styles.ctaSubtitle}>
              Join university contributors earning every semester. Submit your first PDF note in under 2 minutes.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={styles.btnPrimary}
              id="btn-footer-upload-note"
            >
              <LuCloudUpload size={18} />
              <span>Upload your first note</span>
            </button>
          </div>
        </div>
      </section>

      {/* Upload Modal Instance */}
      <ContributeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
