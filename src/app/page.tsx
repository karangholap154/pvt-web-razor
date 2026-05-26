"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Note, Article } from "../data/mockData";
import { supabase } from "../utils/supabaseClient";

// ─── University Constants ─────────────────────────────────────────────────────
const UNIVERSITIES = [
  { value: "Mumbai University", abbr: "MU", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.05)" },
  { value: "Savitribai Phule Pune University", abbr: "SPPU", color: "#e879f9", bg: "rgba(232, 121, 249, 0.05)" },
  { value: "Nagpur University", abbr: "NU", color: "#34d399", bg: "rgba(52, 211, 153, 0.05)" },
  { value: "Amravati University", abbr: "AU", color: "#fb7185", bg: "rgba(251, 113, 133, 0.05)" },
  { value: "Dr. Babasaheb Ambedkar Technological University", abbr: "DBATU", color: "#fb923c", bg: "rgba(251, 146, 60, 0.05)" },
  { value: "Shivaji University", abbr: "SUK", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.05)" },
];

// ─── Login Gate Screen (Rich Landing Page) ───────────────────────────────────
function LoginGate() {
  return (
    <main style={{ 
      background: "var(--background)", 
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden" 
    }}>
      {/* Radiant Background Glows */}
      <div style={{
        position: "absolute",
        top: "-150px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <style>{`
        @keyframes floatUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes pulse { 
          0%, 100% { opacity: 0.6; } 
          50% { opacity: 1; } 
        }
        .gate-animate {
          animation: floatUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .gate-feature-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.75rem;
          transition: var(--transition);
          cursor: default;
        }
        .gate-feature-card:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 10px 24px -10px rgba(99, 102, 241, 0.3); 
          border-color: var(--accent); 
        }
        .gate-step {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.5rem;
          background: rgba(30, 41, 59, 0.2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: var(--transition);
        }
        .gate-step:hover {
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.02);
        }
        .gate-step:hover .gate-step-num { 
          background: var(--accent) !important; 
          color: #ffffff !important; 
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
        }
        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2.25rem;
          background: var(--accent);
          color: #ffffff;
          border-radius: var(--radius);
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }
        .cta-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
        }
        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2.25rem;
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: var(--transition);
        }
        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.07);
          transform: translateY(-2px);
          border-color: var(--text-secondary);
        }
        .branch-card {
          background: rgba(30, 41, 59, 0.15);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          transition: var(--transition);
        }
        .branch-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.02);
        }
        .testimonial-card {
          background: rgba(30, 41, 59, 0.15);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: var(--transition);
        }
        .testimonial-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.02);
          box-shadow: 0 8px 24px -12px rgba(99, 102, 241, 0.2);
        }
        .faq-item {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
          transition: var(--transition);
        }
        .faq-item:hover {
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.01);
        }
      `}</style>

      {/* Hero Section */}
      <section className="gate-animate" style={{
        padding: "6rem 1.5rem 4rem",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1
      }}>
        {/* Pulse Trust Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "rgba(99, 102, 241, 0.08)",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          borderRadius: "999px",
          padding: "0.45rem 1.2rem",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#818cf8",
          marginBottom: "2rem",
          letterSpacing: "0.01em",
        }}>
          <span style={{ 
            width: "7px", 
            height: "7px", 
            borderRadius: "50%", 
            background: "#22c55e", 
            boxShadow: "0 0 8px #22c55e",
            animation: "pulse 2s ease infinite" 
          }} />
          Trusted Engineering Study Platform
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginBottom: "1.5rem",
        }}>
          Ace Your Exams with{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent) 30%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Private Academy Engineering
          </span>
        </h1>

        <p style={{
          fontSize: "1.15rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          maxWidth: "600px",
          margin: "0 auto 2.75rem",
        }}>
          A curated hub for branch-wise engineering notes, semester guides, and video walkthroughs personalized for your university.
        </p>

        {/* Action Portal */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" className="cta-primary" id="gate-login-btn">
            Get Started Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/login" className="cta-secondary" id="gate-signup-btn">
            Log In
          </Link>
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="gate-animate" style={{
        display: "flex",
        justifyContent: "center",
        gap: "3rem",
        flexWrap: "wrap",
        padding: "0 1.5rem 4rem",
        position: "relative",
        zIndex: 1
      }}>
        {[
          { num: "6+", label: "Universities" },
          { num: "100+", label: "Study Guides" },
          { num: "2.5K+", label: "Active Students" },
        ].map((stat, idx) => (
          <div key={idx} style={{ 
            textAlign: "center", 
            minWidth: "120px", 
            padding: "1rem", 
            background: "rgba(255,255,255,0.01)", 
            border: "1px solid var(--border)", 
            borderRadius: "var(--radius)" 
          }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>
              {stat.num}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600, marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* Academic Resource Catalog */}
      <section className="gate-animate" style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "4.5rem 1.5rem",
        position: "relative",
        zIndex: 1
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Academic Resource Catalog
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "3rem", maxWidth: "520px", margin: "0 auto 3rem" }}>
          We provide various types of supplementary guides to help you understand engineering concepts and prepare for exams.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}>
          {[
            {
              title: "Chapter-Wise Revision Notes",
              desc: "Summarized explanation sheets compiled by top students, covering core theoretical concepts and definitions.",
              icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
            },
            {
              title: "Solved University Papers",
              desc: "Step-by-step mathematical steps, derivations, and solutions to past years' university exam questions.",
              icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e879f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
            },
            {
              title: "Last-Minute Revision Sheets",
              desc: "High-yield summary sheets highlighting repeating exam questions, important formulas, and quick checklists.",
              icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
            },
            {
              title: "Visual Video Explainers",
              desc: "Short video walkthrough tutorials embedded alongside notes to explain complex algorithms and derivations.",
              icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`
            },
            {
              title: "Mini & Micro Project Files",
              desc: "Practical developer project templates including full clean source codes, README setups, and documentation files.",
              icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`
            }
          ].map((item, idx) => (
            <div key={idx} className="branch-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ display: "flex" }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>{item.title}</h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* Features Overview */}
      <section className="gate-animate" style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "4.5rem 1.5rem",
        position: "relative",
        zIndex: 1
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Everything you need to study smarter
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "3rem", maxWidth: "520px", margin: "0 auto 3rem" }}>
          Designed around the way engineering students actually learn, review, and prepare.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}>
          {[
            {
              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
              title: "Branch-wise Notes",
              desc: "Computer, IT, AIML, Mechanical, and Chemical — organized neatly by department so you save time.",
            },
            {
              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
              title: "Video Walkthroughs",
              desc: "Difficult code, math equations, and concept proofs are accompanied by visual YouTube explainers.",
            },
            {
              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
              title: "Direct PDF Downloads",
              desc: "Instant file storage downloads directly to your device. No redirections, zero ads, no waiting.",
            },
            {
              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
              title: "University Personalization",
              desc: "Select your curriculum once (Mumbai, Pune, Nagpur, DBATU) and see notes matching your exact syllabus.",
            },
            {
              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
              title: "Intelligent Filters",
              desc: "Locate materials instantly. Filter by branch, search key terms, and sort by semester in milliseconds.",
            },
            {
              icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
              title: "Secure Account Portal",
              desc: "Access note unlock histories, secure transactions with Razorpay, and manage settings privately.",
            },
          ].map((f, idx) => (
            <div key={idx} className="gate-feature-card">
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(99, 102, 241, 0.12)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }} dangerouslySetInnerHTML={{ __html: f.icon }} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>{f.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* Onboarding Steps */}
      <section style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "4.5rem 1.5rem",
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Simple 3-Step Process
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "3rem" }}>
          Get immediate access to customized engineering study folders.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { num: "01", title: "Create Your Account", desc: "Sign up with your credentials in 15 seconds to access the notes dashboard." },
            { num: "02", title: "Set Your Active University", desc: "Choose your university so we can filter and arrange guides matching your syllabus." },
            { num: "03", title: "Unlock & Learn", desc: "Instantly download PDF books, review past papers, and watch visual walk-through tutorials." },
          ].map((step, idx) => (
            <div key={idx} className="gate-step">
              <div className="gate-step-num" style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(99, 102, 241, 0.12)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.95rem",
                flexShrink: 0,
                transition: "var(--transition)",
              }}>
                {step.num}
              </div>
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>{step.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* Student Testimonials (NEW) */}
      <section className="gate-animate" style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "4.5rem 1.5rem",
        position: "relative",
        zIndex: 1
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          What Engineering Students Say
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "3.5rem", maxWidth: "520px", margin: "0 auto 3.5rem" }}>
          Real feedback from engineering colleges across Maharashtra.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "1.25rem",
        }}>
          {[
            {
              name: "Rahul Mehta",
              branch: "Computer Engineering, Semester 6",
              quote: "Private Academy saved my semesters. The reference sheets and code explanations for Cryptography are super detailed and formatted cleanly. Highly recommended!"
            },
            {
              name: "Priya Patil",
              branch: "Information Technology, Semester 5",
              quote: "I love the university customization. Selecting my specific university filtered out all the other syllabus variations. Watching the short video tutorials next to the PDF files helped clear doubts fast."
            },
            {
              name: "Aditya Shinde",
              branch: "Computer Engineering, Semester 7",
              quote: "Compiler design and machine learning math were a struggle until I opened the solved papers on here. The step-by-step algorithms are verified and very clear."
            }
          ].map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div style={{ display: "flex", gap: "0.2rem" }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.65, fontStyle: "italic", flexGrow: 1, margin: 0 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                <h4 style={{ fontSize: "0.925rem", fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</h4>
                <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600 }}>{t.branch}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* Frequently Asked Questions (NEW) */}
      <section className="gate-animate" style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "4.5rem 1.5rem",
        position: "relative",
        zIndex: 1
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Frequently Asked Questions
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "3.5rem" }}>
          Quick answers to common student inquiries about our platform.
        </p>

        <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            {
              q: "Are the notes aligned with the latest syllabus?",
              a: "Yes. All uploaded notes are periodically checked and updated by senior contributors and academic coordinators to align with the active syllabus guidelines of the selected university."
            },
            {
              q: "Do I have to pay to download PDF guides?",
              a: "Our premium study folders and solved university question papers carry a nominal fee to support our student editors and maintain hosting costs."
            },
            {
              q: "Can I request notes for a specific topic?",
              a: "Absolutely. Head to our Contact page and use the 'Need Specific Notes?' Quick Action. Our team will look up your request and try to compile and upload the PDF file within 48 hours."
            },
            {
              q: "How do video tutorials help?",
              a: "We believe in multi-sensory learning. Difficult chapters feature brief video walk-through embeds alongside PDFs so you can review theories and calculations visually."
            },
            {
              q: "Is the checkout transaction secure?",
              a: "Yes. We use Razorpay to process payments securely. Razorpay complies with PCI-DSS tokenized protocols, meaning we never capture or store your debit/credit card details on our database."
            },
            {
              q: "Can I upload my own study notes?",
              a: "We welcome contributor submissions. Send us a message via the suggestion action on our Contact Page or join our Telegram channel to upload study materials and join the team."
            }
          ].map((faq, idx) => (
            <div key={idx} className="faq-item">
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", display: "flex", gap: "0.4rem" }}>
                <span style={{ color: "var(--accent)" }}>Q:</span> {faq.q}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* Bottom CTA Block */}
      <section style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "1.5rem 1.5rem 5rem",
        textAlign: "center",
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(167, 139, 250, 0.04) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2.5rem",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, var(--accent), #a78bfa)"
          }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
            Ace your semesters with Private Academy
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem", maxWidth: "440px", margin: "0 auto 2rem" }}>
            Get started immediately. Personalize your library resources to make study prep effortless.
          </p>
          <Link href="/login" className="cta-primary" id="gate-bottom-cta">
            Access Notes Catalog
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─── University Selection Screen ──────────────────────────────────────────────
function UniversityGate({ onSelect }: { onSelect: (u: string) => void }) {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [countsLoaded, setCountsLoaded] = useState(false);
  const [comingSoonUniv, setComingSoonUniv] = useState("");

  useEffect(() => {
    async function fetchCounts() {
      try {
        const counts: Record<string, number> = {};
        for (const u of UNIVERSITIES) {
          const { count } = await (supabase
            .from("notes")
            .select("*", { count: "exact", head: true }) as any)
            .eq("university", u.value);
          counts[u.value] = count ?? 0;
        }
        setNoteCounts(counts);
      } catch (err) {
        console.error("Failed to load note counts:", err);
      } finally {
        setCountsLoaded(true);
      }
    }
    fetchCounts();
  }, []);

  const selectedHasNotes = selected ? (noteCounts[selected] ?? 0) > 0 : false;

  const handleCardClick = (univValue: string) => {
    const count = noteCounts[univValue] ?? 0;
    if (count === 0 && countsLoaded) {
      setComingSoonUniv(univValue);
      setSelected("");
    } else {
      setComingSoonUniv("");
      setSelected(univValue);
    }
  };

  const handleConfirm = async () => {
    if (!selected || !selectedHasNotes) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/university", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save university");
      onSelect(selected);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--background)",
      padding: "3rem 1.5rem",
      position: "relative"
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "500px",
        height: "300px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ width: "100%", maxWidth: "700px", position: "relative", zIndex: 1 }} className="animate-fade">
        <style>{`
          .univ-card {
            padding: 1.5rem 1.25rem;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            background: var(--card-bg);
            cursor: pointer;
            text-align: left;
            transition: var(--transition);
            position: relative;
          }
          .univ-card:hover {
            transform: translateY(-2px);
            border-color: var(--brand-color);
            background: var(--brand-bg);
            box-shadow: 0 8px 24px -10px var(--brand-color);
          }
        `}</style>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Select Your University
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "460px", margin: "0 auto" }}>
            Choose your university to customize your study notes board. This helps filter syllabus guides directly.
          </p>

          {/* Action Warn Alert */}
          <div style={{
            marginTop: "1.25rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: "var(--radius-sm)",
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            color: "#f59e0b",
            fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            This selection is permanent and customizes your dashboard settings
          </div>
        </div>

        {/* Coming Soon Notice */}
        {comingSoonUniv && (
          <div style={{
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "var(--radius)",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            animation: "floatIn 0.3s ease",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(99, 102, 241, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>
                Notes Library Coming Soon
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Our team is currently compiling branch-wise study notes for {comingSoonUniv}. We will release the study folders for download shortly.
              </p>
            </div>
            <button
              onClick={() => setComingSoonUniv("")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                flexShrink: 0
              }}
              aria-label="Dismiss"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Grid cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: "0.875rem",
          marginBottom: "2rem",
        }}>
          {UNIVERSITIES.map((u) => {
            const isSelected = selected === u.value;
            const noteCount = noteCounts[u.value] ?? 0;
            const isEmpty = countsLoaded && noteCount === 0;
            return (
              <button
                key={u.value}
                onClick={() => handleCardClick(u.value)}
                className="univ-card"
                id={`univ-card-${u.abbr.toLowerCase()}`}
                style={{
                  // Pass dynamic vars for hover class styling
                  "--brand-color": u.color,
                  "--brand-bg": u.bg,
                  border: isSelected ? `2px solid ${u.color}` : isEmpty ? "1px solid rgba(255,255,255,0.04)" : "1px solid var(--border)",
                  background: isSelected ? u.bg : isEmpty ? "rgba(255,255,255,0.01)" : "var(--card-bg)",
                  transform: isSelected ? "translateY(-3px)" : "none",
                  boxShadow: isSelected ? `0 8px 24px -10px ${u.color}` : "none",
                  opacity: isEmpty ? 0.5 : 1,
                } as React.CSSProperties}
              >
                {/* Selected Checkmark badge */}
                {isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: u.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2 2 5-5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                {/* Empty label badge */}
                {isEmpty && !isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: "4px",
                    padding: "0.15rem 0.4rem",
                  }}>
                    Soon
                  </div>
                )}
                <div style={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: isSelected ? u.color : isEmpty ? "var(--text-secondary)" : "var(--text-primary)",
                  marginBottom: "0.25rem",
                }}>
                  {u.abbr}
                </div>
                <div style={{
                  fontSize: "0.8rem",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                  marginBottom: "0.5rem"
                }}>
                  {u.value}
                </div>
                {countsLoaded && (
                  <div style={{
                    fontSize: "0.725rem",
                    fontWeight: 600,
                    color: noteCount > 0 ? "#22c55e" : "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: noteCount > 0 ? "#22c55e" : "var(--border)" }} />
                    {noteCount > 0 ? `${noteCount} study folders` : "Compiling files"}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171",
            borderRadius: "var(--radius)",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            marginBottom: "1.25rem",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={!selected || !selectedHasNotes || saving}
          id="btn-confirm-university"
          style={{
            width: "100%",
            padding: "0.95rem",
            background: selected && selectedHasNotes ? "var(--accent)" : "rgba(255,255,255,0.03)",
            color: selected && selectedHasNotes ? "#ffffff" : "var(--text-secondary)",
            border: selected && selectedHasNotes ? "none" : "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: selected && selectedHasNotes ? "pointer" : "not-allowed",
            transition: "var(--transition)",
            boxShadow: selected && selectedHasNotes ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none"
          }}
        >
          {saving ? "Saving Selection..." : selected ? `Unlock Library — ${selected}` : "Select University to Unlock Content"}
        </button>
      </div>
    </main>
  );
}

// ─── Main HomeContent (Notes Library) ────────────────────────────────────────
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unlockNoteId = searchParams.get("unlock");

  // Auth / gate state
  const [authState, setAuthState] = useState<"loading" | "unauthenticated" | "no-university" | "ready">("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userUniversity, setUserUniversity] = useState<string | null>(null);

  // Live database states
  const [notes, setNotes] = useState<Note[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedSemester, setSelectedSemester] = useState("All semesters");

  // Modal state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalType, setModalType] = useState<"video" | "pdf" | null>(null);

  // Checkout states
  const [showCheckoutPrompt, setShowCheckoutPrompt] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState<Note | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "verifying" | "paying" | "success" | "error">("idle");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // ── Check authentication + university on mount ──────────────────────────
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.authenticated) {
          setAuthState("unauthenticated");
          return;
        }
        setUserEmail(data.email);
        if (!data.university) {
          setAuthState("no-university");
        } else {
          setUserUniversity(data.university);
          setAuthState("ready");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthState("unauthenticated");
      }
    }
    checkAuth();
  }, []);

  // ── Fetch notes filtered by university ─────────────────────────────────
  useEffect(() => {
    if (authState !== "ready" || !userUniversity) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const { data: dbNotes, error: notesError } = await (supabase
          .from("notes")
          .select("*") as any)
          .eq("university", userUniversity)
          .order("title", { ascending: true });

        const { data: dbArticles, error: articlesError } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        let finalNotes: Note[] = [];
        let finalArticles: Article[] = [];

        if (!notesError && dbNotes) {
          finalNotes = dbNotes.map((item: any) => ({
            id: item.id,
            title: item.title,
            branch: item.branch as any,
            semester: item.semester,
            description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
            downloadUrl: item.download_url || "",
            videoUrl: item.video_url || "",
            price: item.price ? Number(item.price) : 0,
            university: item.university,
          }));
        }

        if (!articlesError && dbArticles) {
          finalArticles = dbArticles.map((item) => ({
            id: item.id,
            title: item.title,
            readTime: `${Math.max(1, Math.ceil((item.content || "").trim().split(/\s+/).filter(Boolean).length / 200))} min read`,
            category: item.category as any,
            summary: item.summary || "",
            content: item.content || "",
          }));
        }

        setNotes(finalNotes);
        setArticles(finalArticles);
      } catch (err) {
        console.error("Error loading data:", err);
        setNotes([]);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [authState, userUniversity]);

  // ── Filtered Notes memo ─────────────────────────────────────────────────
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch =
        selectedBranch === "All branches" || note.branch === selectedBranch;
      const matchesSemester =
        selectedSemester === "All semesters" || note.semester === selectedSemester;
      return matchesSearch && matchesBranch && matchesSemester;
    });
  }, [notes, searchQuery, selectedBranch, selectedSemester]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBranch("All branches");
    setSelectedSemester("All semesters");
  };

  const openModal = (note: Note, type: "video" | "pdf") => {
    setSelectedNote(note);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedNote(null);
    setModalType(null);
  };

  const applyQuickFilter = (search: string, branch: string, semester: string) => {
    setSearchQuery(search);
    setSelectedBranch(branch);
    setSelectedSemester(semester);
  };

  const handleDownload = async (url: string, title: string) => {
    if (!url) return;
    setDownloadingPdf(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download fetch failed, fallback opening in tab:", err);
      window.open(url, "_blank");
    } finally {
      setDownloadingPdf(false);
      closeModal();
    }
  };

  const handleDownloadClick = (note: Note) => {
    if (note.price && note.price > 0) {
      setCheckoutNote(note);
      setCheckoutEmail(userEmail || "");
      setCheckoutStatus("idle");
      setShowCheckoutPrompt(true);
    } else {
      openModal(note, "pdf");
    }
  };

  // Automatic purchase recovery on redirect
  useEffect(() => {
    if (authState === "ready" && notes.length > 0 && unlockNoteId) {
      const targetNote = notes.find((n) => n.id === unlockNoteId);
      if (targetNote) {
        handleDownloadClick(targetNote);
        const url = new URL(window.location.href);
        url.searchParams.delete("unlock");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [authState, notes, unlockNoteId]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail.trim() || !checkoutNote) return;

    setCheckoutStatus("verifying");

    try {
      const cleanEmail = checkoutEmail.trim().toLowerCase();

      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("email", cleanEmail)
        .eq("note_id", checkoutNote.id)
        .eq("status", "success")
        .maybeSingle();

      if (purchase) {
        setCheckoutStatus("success");
        setShowCheckoutPrompt(false);
        openModal(checkoutNote, "pdf");
        return;
      }

      setCheckoutStatus("paying");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: checkoutNote.id, email: cleanEmail }),
      });

      const orderData = await res.json();
      if (orderData.error) {
        alert(`Checkout order creation error: ${orderData.error}`);
        setCheckoutStatus("idle");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_StVqhHUbbFc4bs",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Private Academy",
        description: `Unlock ${checkoutNote.title}`,
        order_id: orderData.orderId,
        prefill: { email: cleanEmail },
        handler: async function (response: any) {
          try {
            setCheckoutStatus("verifying");
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                noteId: checkoutNote.id,
                email: cleanEmail,
                amount: orderData.amount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment verified successfully! Access granted.");
              setCheckoutStatus("success");
              setShowCheckoutPrompt(false);
              openModal(checkoutNote, "pdf");
            } else {
              alert(`Verification failed: ${verifyData.error}`);
              setCheckoutStatus("idle");
            }
          } catch (err) {
            console.error("Verification callback failed:", err);
            alert("Verification check failed.");
            setCheckoutStatus("idle");
          }
        },
        modal: { ondismiss: function () { setCheckoutStatus("idle"); } },
        theme: { color: "#6366f1" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout submission failed:", err);
      alert("Error starting checkout process.");
      setCheckoutStatus("idle");
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

  if (authState === "unauthenticated") return <LoginGate />;

  if (authState === "no-university") {
    return <UniversityGate onSelect={(u) => { setUserUniversity(u); setAuthState("ready"); }} />;
  }

  return (
    <main className={styles.main} style={{ display: "flex", flexDirection: "column", gap: "4.5rem", width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem" }}>
      <style>{`
        .custom-widget-card {
          border: 1px solid var(--border);
          background: rgba(30, 41, 59, 0.2);
          border-radius: var(--radius);
          padding: 1rem 1.25rem;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-decoration: none;
        }
        .custom-widget-card:hover {
          border-color: var(--accent);
          background: rgba(99, 102, 241, 0.04);
          transform: translateY(-2px);
        }
        .note-card-glow {
          transition: var(--transition);
        }
        .note-card-glow:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 10px 24px -10px rgba(99, 102, 241, 0.25);
        }
        .btn-note-action {
          padding: 0.65rem 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          border: 1px solid var(--border);
          text-decoration: none;
        }
        .btn-note-watch {
          background-color: rgba(239, 68, 68, 0.06);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }
        .btn-note-watch:hover {
          background-color: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
        }
        .btn-note-download {
          background-color: var(--accent-light);
          color: var(--accent);
          border-color: rgba(99, 102, 241, 0.2);
        }
        .btn-note-download:hover {
          background-color: var(--accent);
          color: #ffffff;
          border-color: var(--accent);
        }
        .btn-note-download-free {
          background-color: rgba(34, 197, 94, 0.06);
          color: #22c55e;
          border-color: rgba(34, 197, 94, 0.25);
        }
        .btn-note-download-free:hover {
          background-color: #22c55e;
          color: #ffffff;
          border-color: #22c55e;
        }
      `}</style>

      {/* Hero Section */}
      <section className={styles.heroSection} style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: "3.5rem", alignItems: "center" }} id="hero-section">
        <div className={styles.heroLeft} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            borderRadius: "999px",
            padding: "0.4rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#818cf8",
            alignSelf: "flex-start"
          }}>
            {userUniversity} Syllabus notes
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }} id="hero-title">
            Study Smarter — <br />
            <span style={{
              background: "linear-gradient(135deg, var(--accent) 30%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Personalized Notes Library
            </span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "580px" }} id="hero-subtext">
            Access branch-wise folders, check semester filters, download exam materials, or watch tutorial walkthroughs — personalized for your university.
          </p>
          
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }} id="hero-actions">
            <a href="#search-section" className={styles.btnPrimary} style={{ padding: "0.8rem 1.5rem", fontWeight: 700, borderRadius: "var(--radius)" }} id="btn-explore-notes">
              Search Notes
            </a>
            <Link href="/projects" className={styles.btnSecondary} style={{ padding: "0.8rem 1.5rem", fontWeight: 600, borderRadius: "var(--radius)" }} id="btn-see-projects">
              Explore Projects
            </Link>
            <Link href="/careers" className={styles.btnSecondary} style={{ padding: "0.8rem 1.5rem", fontWeight: 600, borderRadius: "var(--radius)" }} id="btn-see-careers">
              We&apos;re Hiring
            </Link>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }} id="hero-chips">
            <div className={styles.chip} onClick={() => applyQuickFilter("Structures", "All branches", "All semesters")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--accent)" }}>✓</span> Search instantly
            </div>
            <div className={styles.chip} onClick={() => applyQuickFilter("", "Computer", "Sem 3")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--accent)" }}>✓</span> Branch filters
            </div>
            <div className={styles.chip} onClick={() => applyQuickFilter("", "All branches", "Sem 5")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--accent)" }}>✓</span> Offline PDF access
            </div>
          </div>
        </div>

        {/* Hero Right Widget - Recent Feeds */}
        <aside style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "var(--shadow-lg)"
        }} id="recent-articles-widget">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>Recent Feeds</span>
            <Link href="/articles" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>
              View All →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {isLoading ? (
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "1.5rem 0", textAlign: "center" }}>Loading feeds...</div>
            ) : (
              articles.slice(0, 3).map((art) => (
                <Link href={`/articles#${art.id}`} key={art.id} className="custom-widget-card">
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{art.category}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{art.title}</span>
                  <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    <span>{art.readTime}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </section>

      {/* Search & Filter Panel */}
      <section className={styles.searchSection} style={{ padding: "2.5rem 2rem", borderRadius: "var(--radius-lg)" }} id="search-section">
        <div className={styles.sectionHeader} style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Search the library</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Narrow your syllabus search quickly by choosing branch, semester, and key topics.
          </p>
        </div>

        <div className={styles.filterForm}>
          <div className={styles.inputGroup}>
            <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search notes by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              id="search-notes-input"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className={styles.selectInput}
            id="filter-branch-select"
            aria-label="Filter by Branch"
          >
            <option value="All branches">All branches</option>
            <option value="Computer">Computer</option>
            <option value="IT">IT</option>
            <option value="AIML">AIML</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Chemical">Chemical</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className={styles.selectInput}
            id="filter-semester-select"
            aria-label="Filter by Semester"
          >
            <option value="All semesters">All semesters</option>
            <option value="Sem 1">Sem 1</option>
            <option value="Sem 2">Sem 2</option>
            <option value="Sem 3">Sem 3</option>
            <option value="Sem 4">Sem 4</option>
            <option value="Sem 5">Sem 5</option>
            <option value="Sem 6">Sem 6</option>
            <option value="Sem 7">Sem 7</option>
            <option value="Sem 8">Sem 8</option>
          </select>

          <button onClick={handleClearFilters} className={styles.btnClear} id="btn-clear-filters">
            Clear Filters
          </button>
        </div>

        <div className={styles.resultsMeta}>
          <span id="results-count" style={{ fontWeight: 600 }}>
            {isLoading ? "Syncing..." : `Found ${filteredNotes.length} matching study ${filteredNotes.length === 1 ? "sheet" : "sheets"}`}
          </span>
          {(searchQuery || selectedBranch !== "All branches" || selectedSemester !== "All semesters") && (
            <span style={{ 
              fontSize: "0.75rem", 
              fontWeight: 700, 
              padding: "0.2rem 0.5rem", 
              borderRadius: "4px", 
              background: "var(--accent-light)", 
              color: "var(--accent)", 
              border: "1px solid rgba(99,102,241,0.2)" 
            }}>
              Active Search Filters
            </span>
          )}
        </div>
      </section>

      {/* Featured Notes Section */}
      <section className={styles.notesSection} id="featured-notes-section">
        <div className={styles.sectionHeader} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Study notes catalog</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Select folders to download offline copy PDFs or review visual explanations.
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-secondary)" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(255,255,255,0.06)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1.25rem" }} />
            <h3>Syncing notes with database...</h3>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className={styles.grid}>
            {filteredNotes.map((note) => {
              const hasVideo = !!note.videoUrl;
              return (
                <article 
                  key={note.id} 
                  className={`${styles.noteCard} note-card-glow`} 
                  id={note.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/notes/${note.id}`)}
                >
                  <div className={styles.noteCardHeader}>
                    <h3 className={styles.noteCardTitle}>
                      <Link 
                        href={`/notes/${note.id}`} 
                        style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                      >
                        {note.title}
                      </Link>
                    </h3>
                  </div>
                  <div className={styles.badgeRow}>
                    <span className={styles.tagBranch}>{note.branch}</span>
                    <span className={styles.badgeSemester}>{note.semester}</span>
                    {note.price && note.price > 0 ? (
                      <span style={{ fontSize: "0.725rem", fontWeight: 700, backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                        ₹{note.price}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.725rem", fontWeight: 700, backgroundColor: "rgba(34, 197, 94, 0.12)", color: "#22c55e", padding: "0.2rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                        Free
                      </span>
                    )}
                  </div>
                  <p className={styles.noteCardDesc}>{note.description}</p>

                  <div className={styles.noteCardActions} style={{ 
                    display: "grid", 
                    gridTemplateColumns: hasVideo ? "1fr 1fr" : "1fr",
                    gap: "0.5rem" 
                  }}>
                    {hasVideo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(note, "video");
                        }}
                        className="btn-note-action btn-note-watch"
                        id={`btn-watch-video-${note.id}`}
                      >
                        Watch Video
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadClick(note);
                      }}
                      className={`btn-note-action ${note.price && note.price > 0 ? "btn-note-download" : "btn-note-download-free"}`}
                      id={`btn-download-${note.id}`}
                      style={{ gridColumn: hasVideo ? "auto" : "span 2" }}
                    >
                      {note.price && note.price > 0 ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Unlock PDF
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.noResults} id="no-results-alert">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "1rem" }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3>No study notes found for {userUniversity}</h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Our contributors have not uploaded notes for this specific branch filter yet. Try adjusting or clearing search parameters.</p>
          </div>
        )}
      </section>

      {/* Checkout Modal */}
      {showCheckoutPrompt && checkoutNote && (
        <div className={styles.modalBackdrop} onClick={() => setShowCheckoutPrompt(false)} id="checkout-backdrop">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} id="checkout-modal-content">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Unlock Study Resource</h3>
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
                    You need to be signed in to purchase or access premium study guides.
                  </p>
                  <Link
                    href={`/login?redirect=/?unlock=${checkoutNote.id}`}
                    className={styles.btnPrimary}
                    style={{ justifyContent: "center", textDecoration: "none" }}
                    id="btn-login-to-purchase"
                  >
                    Log In / Sign Up
                  </Link>
                </div>
              ) : (
                <>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    This is a premium resource. Proceed to verify your past purchase or buy now for <strong>₹{checkoutNote.price}</strong>.
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
                      {checkoutStatus === "verifying" && "Checking database logs..."}
                      {checkoutStatus === "paying" && "Accessing secure Razorpay checkout..."}
                      {checkoutStatus === "idle" && "Proceed to Unlock"}
                    </button>
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
                    onClick={() => handleDownload(selectedNote.downloadUrl, selectedNote.title)}
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
    </main>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "var(--text-secondary)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
          <h3>Loading Private Academy Library...</h3>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
