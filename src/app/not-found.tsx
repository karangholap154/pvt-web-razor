import type { Metadata } from "next";
import Link from "next/link";
import styles from "./utility.module.css";
import {
  LuSearch,
  LuArrowRight,
  LuFileText,
  LuUsers,
  LuMessageSquare,
  LuCode,
  LuHouse,
  LuLifeBuoy,
} from "react-icons/lu";

export const metadata: Metadata = {
  title: "404 - Not in Syllabus | Private Academy",
  description: "The page or engineering study module you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Engineered Torn-Corner Note Sheet (§2.5, §4.18) */}
        <section className={styles.sheet} aria-labelledby="not-found-heading">
          {/* Top-Right Dog-Ear / Torn Corner */}
          <div className={styles.tornCorner} aria-hidden="true">
            <div className={styles.tornCornerFold} />
          </div>

          {/* Technical Spec Eyebrow */}
          <div className={styles.specHeader}>
            <div className={styles.specEyebrow}>
              <span className={styles.statusIndicator} aria-hidden="true" />
              <span>SPEC // UNMAPPED_RESOURCE</span>
            </div>
            <div className={styles.errorChip}>STATUS: 404 NOT_FOUND</div>
          </div>

          {/* Large Monospace Error Numeral (§4.18) */}
          <span className={styles.errorCode} aria-hidden="true">
            404
          </span>

          {/* Display Headline with Highlighter */}
          <h1 id="not-found-heading" className={styles.title}>
            This page isn&apos;t in the{" "}
            <span className={styles.highlighter}>syllabus</span>.
          </h1>

          <p className={styles.description}>
            The schematic, unit note, or reference route you requested does not exist,
            was removed, or has been relocated to another semester module.
          </p>

          {/* Fast Search Desk (§4.18) */}
          <form action="/" method="GET" className={styles.searchForm} role="search">
            <LuSearch className={styles.searchIcon} size={18} aria-hidden="true" />
            <input
              type="text"
              name="q"
              placeholder="Search engineering notes, subjects, or topics..."
              className={styles.searchInput}
              aria-label="Search study notes and syllabus"
              autoComplete="off"
            />
            <button type="submit" className={styles.searchSubmitBtn}>
              Find <LuArrowRight size={14} aria-hidden="true" />
            </button>
          </form>

          {/* Section 3.11 Quick Directory Shortcuts */}
          <div className={styles.directoryDesk}>
            <div className={styles.directoryHeader}>
              <span className={styles.directoryLabel}>CORE DIRECTORIES & ARCHIVES</span>
              <span className={styles.directoryLabel}>INDEX: 04 ROUTES</span>
            </div>

            <nav className={styles.indexList} aria-label="Syllabus recovery links">
              <Link href="/" className={styles.indexRow}>
                <div className={styles.indexRowContent}>
                  <div className={styles.indexIconBox}>
                    <LuFileText size={16} />
                  </div>
                  <div>
                    <div className={styles.indexTitle}>Notes Library</div>
                    <div className={styles.indexMeta}>Official MU & SPPU verified study modules</div>
                  </div>
                </div>
                <LuArrowRight className={styles.indexArrow} size={16} />
              </Link>

              <Link href="/community-notes" className={styles.indexRow}>
                <div className={styles.indexRowContent}>
                  <div className={styles.indexIconBox}>
                    <LuUsers size={16} />
                  </div>
                  <div>
                    <div className={styles.indexTitle}>Community Notes</div>
                    <div className={styles.indexMeta}>Student ranker uploads & handwritten guides</div>
                  </div>
                </div>
                <LuArrowRight className={styles.indexArrow} size={16} />
              </Link>

              <Link href="/discussions" className={styles.indexRow}>
                <div className={styles.indexRowContent}>
                  <div className={styles.indexIconBox}>
                    <LuMessageSquare size={16} />
                  </div>
                  <div>
                    <div className={styles.indexTitle}>Discussions & Doubts</div>
                    <div className={styles.indexMeta}>Peer troubleshooting & engineering queries</div>
                  </div>
                </div>
                <LuArrowRight className={styles.indexArrow} size={16} />
              </Link>

              <Link href="/projects" className={styles.indexRow}>
                <div className={styles.indexRowContent}>
                  <div className={styles.indexIconBox}>
                    <LuCode size={16} />
                  </div>
                  <div>
                    <div className={styles.indexTitle}>Engineering Projects</div>
                    <div className={styles.indexMeta}>Final year blueprints & IEEE source code</div>
                  </div>
                </div>
                <LuArrowRight className={styles.indexArrow} size={16} />
              </Link>
            </nav>
          </div>

          {/* Action Row */}
          <div className={styles.actionsRow}>
            <Link href="/" className={styles.primaryBtn}>
              <LuHouse size={16} /> Return to Home
            </Link>
            <Link href="/contact" className={styles.secondaryBtn}>
              <LuLifeBuoy size={16} /> Contact Support Desk
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
