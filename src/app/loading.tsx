import styles from "./loading.module.css";

// Engineer's Notebook Global Loading Screen
// Mirrors real catalog pages with paper cards, graph grid, and hairline shimmers
export default function Loading() {
  return (
    <div className={styles.loadingContainer} aria-busy="true" aria-label="Loading content">
      <div className={styles.graphGrid} aria-hidden="true" />

      <div className={styles.contentWrapper}>
        {/* Spec Status Indicator */}
        <div className={styles.statusRibbon}>
          <div className={styles.statusDot} aria-hidden="true" />
          <span className={styles.statusLabel}>SPEC // COMPILING_CANVAS • INITIALIZING…</span>
        </div>

        {/* Hero Section Skeleton */}
        <div className={styles.heroSkeleton}>
          <div className={`${styles.eyebrowBar} ${styles.shimmer}`} />
          <div className={`${styles.titleBarMajor} ${styles.shimmer}`} />
          <div className={`${styles.titleBarMinor} ${styles.shimmer}`} />
          <div className={`${styles.descriptionBar} ${styles.shimmer}`} />
        </div>

        {/* 3-Tap Filter Desk Skeleton */}
        <div className={styles.filterDeskSkeleton}>
          <div className={styles.filterDeskHeader}>
            <div className={styles.filterChipRow}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={styles.shimmer}
                  style={{ height: "30px", width: i === 0 ? "70px" : "60px", borderRadius: "9999px" }}
                />
              ))}
            </div>
            <div className={styles.shimmer} style={{ height: "16px", width: "110px", display: "none" }} />
          </div>

          <div className={styles.filterInputRow}>
            <div className={styles.shimmer} style={{ height: "46px", borderRadius: "8px" }} />
            <div className={styles.shimmer} style={{ height: "46px", borderRadius: "8px" }} />
            <div className={styles.shimmer} style={{ height: "46px", borderRadius: "8px" }} />
            <div className={styles.shimmer} style={{ height: "46px", borderRadius: "8px" }} />
          </div>
        </div>

        {/* Notes Grid Skeleton — 6 cards matching real NoteCard shape */}
        <div className={styles.cardsGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.cardSkeleton}>
              {/* Drafting Header Thumbnail */}
              <div className={styles.cardHeaderPreview}>
                <div
                  className={styles.shimmer}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    height: "18px",
                    width: "75px",
                    borderRadius: "4px",
                  }}
                />
              </div>

              {/* Tag Chips Row */}
              <div className={styles.tagRow}>
                <div className={styles.shimmer} style={{ height: "20px", width: "70px", borderRadius: "4px" }} />
                <div className={styles.shimmer} style={{ height: "20px", width: "50px", borderRadius: "4px" }} />
                <div className={styles.shimmer} style={{ height: "20px", width: "60px", borderRadius: "4px" }} />
              </div>

              {/* Title and Subject Bar */}
              <div className={`${styles.cardTitleBar} ${styles.shimmer}`} />
              <div className={`${styles.cardSubBar} ${styles.shimmer}`} />

              {/* Card Footer with Price and Unlock Button */}
              <div className={styles.cardFooter}>
                <div className={styles.shimmer} style={{ height: "24px", width: "65px", borderRadius: "4px" }} />
                <div className={styles.shimmer} style={{ height: "36px", width: "110px", borderRadius: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

