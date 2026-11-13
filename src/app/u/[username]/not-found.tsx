import Link from "next/link";
import styles from "@/app/utility.module.css";
import { LuUserX, LuArrowLeft, LuUsers } from "react-icons/lu";

export default function UserNotFound() {
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <section className={styles.sheet} aria-labelledby="user-not-found-heading">
          {/* Top-Right Dog-Ear / Torn Corner */}
          <div className={styles.tornCorner} aria-hidden="true">
            <div className={styles.tornCornerFold} />
          </div>

          {/* Technical Spec Eyebrow */}
          <div className={styles.specHeader}>
            <div className={styles.specEyebrow}>
              <span className={styles.statusIndicator} aria-hidden="true" />
              <span>SPEC // CONTRIBUTOR_DOSSIER</span>
            </div>
            <div className={styles.errorChip}>STATUS: USER_NOT_FOUND</div>
          </div>

          {/* Large Icon / Monospace Error Indicator */}
          <div style={{ color: "var(--blue-500, #2447F5)", marginBottom: "16px" }}>
            <LuUserX size={54} strokeWidth={1.75} />
          </div>

          {/* Display Headline with Highlighter */}
          <h1 id="user-not-found-heading" className={styles.title}>
            Contributor profile{" "}
            <span className={styles.highlighter}>not found</span>.
          </h1>

          <p className={styles.description}>
            This student contributor handle does not exist, was changed, or has not published verified study material yet.
          </p>

          {/* Action Row */}
          <div className={styles.actionsRow}>
            <Link href="/" className={styles.primaryBtn}>
              <LuArrowLeft size={16} /> Back to Library
            </Link>
            <Link href="/community-notes" className={styles.secondaryBtn}>
              <LuUsers size={16} /> Browse Community Notes
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
