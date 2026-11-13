"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./legal.module.css";
import {
  LuArrowRight,
  LuLifeBuoy,
  LuBookmark,
} from "react-icons/lu";

export interface TocItem {
  id: string;
  label: string;
  num?: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  documentSpec?: string;
  summaryTitle?: string;
  summaryContent: React.ReactNode;
  toc: TocItem[];
  currentRoute: string;
  children: React.ReactNode;
}

const LEGAL_DIRECTIVES = [
  { code: "SPEC-01", title: "Privacy Policy", path: "/privacy-policy", category: "Data Protection" },
  { code: "SPEC-02", title: "Terms & Conditions", path: "/terms-and-condition", category: "Usage Agreement" },
  { code: "SPEC-03", title: "Cancellation & Refund Policy", path: "/refund-policy", category: "Payment Terms" },
  { code: "SPEC-04", title: "Shipping & Delivery Policy", path: "/shipping-policy", category: "Digital Fulfillment" },
  { code: "SPEC-05", title: "Academic Non-Affiliation Disclaimer", path: "/disclaimer", category: "Legal Notice" },
];

export default function LegalLayout({
  title,
  lastUpdated,
  documentSpec = "REGULATORY_COMPLIANCE",
  summaryTitle = "Summary Statement",
  summaryContent,
  toc,
  currentRoute,
  children,
}: LegalLayoutProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = toc.length - 1; i >= 0; i--) {
        const element = document.getElementById(toc[i].id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(toc[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Document Header (§4.17) */}
        <header className={styles.header}>
          <div className={styles.specEyebrow}>
            <span className={styles.specIndicator} aria-hidden="true" />
            <span>LEGAL SPECIFICATION // {documentSpec}</span>
          </div>

          <h1 className={styles.title}>{title}</h1>

          {/* Monospace "LAST UPDATED [DATE]" directly under title (§4.17) */}
          <div className={styles.lastUpdated}>
            <LuBookmark size={14} aria-hidden="true" />
            <span>LAST UPDATED {lastUpdated}</span>
          </div>
        </header>

        {/* Two-Column Grid: Sticky Table of Contents + 680px Reading Column (§4.17) */}
        <div className={styles.layoutGrid}>
          {/* Desktop Sticky Table of Contents */}
          <aside className={styles.tocSidebar} aria-label="Table of contents">
            <div className={styles.tocHeader}>
              <span className={styles.tocTitle}>TABLE OF CONTENTS</span>
              <span className={styles.tocTitle}>[{toc.length} CLAUSES]</span>
            </div>

            <nav className={styles.tocNav}>
              {toc.map((item, index) => {
                const isActive = activeId === item.id;
                const displayNum = item.num || String(index + 1).padStart(2, "0");
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`${styles.tocItem} ${isActive ? styles.tocItemActive : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(item.id);
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                        setActiveId(item.id);
                      }
                    }}
                  >
                    <span className={styles.tocNum}>{displayNum}.</span>
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* 680px Reading Column (§4.17) */}
          <main className={styles.readingColumn}>
            {/* Summary Callout Box */}
            <div className={styles.calloutBox} role="region" aria-label="Executive summary">
              <div className={styles.calloutTitle}>{summaryTitle}</div>
              <div className={styles.calloutText}>{summaryContent}</div>
            </div>

            {/* Legal Clauses & Content */}
            {children}

            {/* Section 3.11 Hairline Cross-Links Index Table (§4.17) */}
            <section className={styles.crossLinksDesk} aria-labelledby="cross-links-heading">
              <div className={styles.crossLinksHeader}>
                <span id="cross-links-heading" className={styles.crossLinksEyebrow}>
                  ACADEMIC COMPLIANCE FRAMEWORK // SIBLING DIRECTIVES
                </span>
                <span className={styles.crossLinksEyebrow}>INDEX: 05 POLICIES</span>
              </div>

              <div className={styles.crossLinksList}>
                {LEGAL_DIRECTIVES.map((directive) => {
                  const isCurrent = currentRoute === directive.path;
                  return (
                    <Link
                      key={directive.path}
                      href={directive.path}
                      className={`${styles.crossLinkRow} ${isCurrent ? styles.crossLinkRowActive : ""}`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      <div className={styles.crossLinkContent}>
                        <span className={styles.crossLinkCode}>{directive.code}</span>
                        <span className={styles.crossLinkTitle}>{directive.title}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          className={`${styles.crossLinkTag} ${
                            isCurrent ? styles.crossLinkTagActive : ""
                          }`}
                        >
                          {isCurrent ? "ACTIVE SPEC" : directive.category}
                        </span>
                        {!isCurrent && <LuArrowRight size={15} color="var(--slate-600)" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Support & Contact Desk Link (§4.17) */}
            <section className={styles.supportDesk} aria-labelledby="support-desk-heading">
              <div className={styles.supportDeskText}>
                <div id="support-desk-heading" style={{ fontWeight: 700, color: "var(--ink-900)" }}>
                  Have questions regarding our legal guidelines or academic terms?
                </div>
                <div>
                  Our compliance team reviews student inquiries, copyright verification, and billing clarifications within 24–48 hours.
                </div>
              </div>

              <Link
                href="/contact?subject=Legal+Policy+Inquiry"
                className={styles.contactBtn}
              >
                <LuLifeBuoy size={15} /> Contact Support Desk
              </Link>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
