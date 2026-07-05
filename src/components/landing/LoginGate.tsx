"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "../../data/mockData";
import { supabase } from "../../utils/supabaseClient";
import styles from "./LoginGate.module.css";

export default function LoginGate() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function loadArticles() {
      try {
        const { data: dbArticles, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        if (!error && dbArticles) {
          setArticles(dbArticles.map((item) => ({
            id: item.id,
            title: item.title,
            readTime: `${Math.max(1, Math.ceil((item.content || "").trim().split(/\s+/).filter(Boolean).length / 200))} min read`,
            category: item.category as Article["category"],
            summary: item.summary || "",
            content: item.content || "",
          })));
        }
      } catch (err) {
        console.error("LoginGate: failed to load articles:", err);
      }
    }
    loadArticles();
  }, []);
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
        background: "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Hero Section */}
      <section className={styles["gate-animate"]} style={{
        padding: "6rem 1.5rem 4rem",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "3.5rem",
        alignItems: "center"
      }}>
        {/* Left Column Content */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "flex-start",
          textAlign: "left"
        }}>
          {/* Pulse Trust Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(251, 191, 36, 0.08)",
            border: "1px solid rgba(251, 191, 36, 0.25)",
            borderRadius: "999px",
            padding: "0.45rem 1.2rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#facc15",
            letterSpacing: "0.01em",
          }}>
            <span 
              className={styles["pulse-dot"]}
              style={{ 
                width: "7px", 
                height: "7px", 
                borderRadius: "50%", 
                background: "#22c55e", 
                boxShadow: "0 0 8px #22c55e"
              }} 
            />
            Trusted Engineering Study Platform
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}>
            Ace Your Exams with{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--accent) 30%, #fb923c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Private Academy Engineering
            </span>
          </h1>

          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0,
          }}>
            A curated hub for branch-wise engineering notes, semester guides, and video walkthroughs personalized for your university.
          </p>

          {/* Action Portal */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/login" className={styles["cta-primary"]} id="gate-login-btn">
              Get Started Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/login" className={styles["cta-secondary"]} id="gate-signup-btn">
              Log In
            </Link>
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
          boxShadow: "var(--shadow-lg)",
          width: "100%"
        }} id="gate-recent-articles-widget">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>Recent Feeds</span>
            <Link href="/articles" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>
              View All →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {articles && articles.length > 0 ? (
              articles.slice(0, 3).map((art) => (
                <Link href={`/articles/${art.id}`} key={art.id} className={styles["custom-widget-card"]}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{art.category}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{art.title}</span>
                  <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    <span>{art.readTime}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "1.5rem 0", textAlign: "center" }}>Loading feeds...</div>
            )}
          </div>
        </aside>
      </section>

      {/* Stats Counter Row */}
      <section className={styles["gate-animate"]} style={{
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
      <section className={styles["gate-animate"]} style={{
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
            <div key={idx} className={styles["branch-card"]} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
      <section className={styles["gate-animate"]} style={{
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
            <div key={idx} className={styles["gate-feature-card"]}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(251, 191, 36, 0.12)",
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
            <div key={idx} className={styles["gate-step"]}>
              <div className={styles["gate-step-num"]}>
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

      {/* Student Testimonials */}
      <section className={styles["gate-animate"]} style={{
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
            <div key={idx} className={styles["testimonial-card"]}>
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

      {/* Frequently Asked Questions */}
      <section className={styles["gate-animate"]} style={{
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
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
            <div key={idx} className={styles["faq-item"]}>
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
          background: "linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 146, 60, 0.04) 100%)",
          border: "1px solid rgba(251, 191, 36, 0.2)",
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
            background: "linear-gradient(90deg, var(--accent), #fb923c)"
          }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
            Ace your semesters with Private Academy
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem", maxWidth: "440px", margin: "0 auto 2rem" }}>
            Get started immediately. Personalize your library resources to make study prep effortless.
          </p>
          <Link href="/login" className={styles["cta-primary"]} id="gate-bottom-cta">
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
