"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  LuLock,
  LuFileText,
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuMinimize2,
  LuCircleAlert,
  LuRefreshCw,
} from "react-icons/lu";
import styles from "./NoteViewer.module.css";

// Configure PDF.js worker — uses the bundled worker from react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface NoteViewerProps {
  /** The URL of the PDF to render — pass /api/proxy-pdf?id=... */
  url: string;
  /**
   * When true:
   * - Caps page rendering at 3 pages max
   * - Shows a "Preview" lock badge in the toolbar
   * Pass `?preview=true` in the URL to get the server-trimmed 3-page PDF.
   */
  previewMode?: boolean;
  /** Whether the viewer is currently rendered in fullscreen mode */
  isFullscreen?: boolean;
  /** Callback to toggle/exit fullscreen mode */
  onToggleFullscreen?: () => void;
}

const PREVIEW_MAX_PAGES = 3;

interface VirtualPageProps {
  pageNumber: number;
  scale: number;
  savedAspectRatio?: number;
  isFullscreen?: boolean;
  totalPages: number;
  onPageMeasure?: (pageNumber: number, aspectRatio: number) => void;
}

function VirtualPage({
  pageNumber,
  scale,
  savedAspectRatio,
  isFullscreen = false,
  totalPages,
  onPageMeasure,
}: VirtualPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredAspectRatio, setMeasuredAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "650px 0px", // Preload pages 650px before entering viewport
        threshold: 0.01,
      }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, []);

  // Standard A4 aspect ratio (width / height = 0.707)
  const currentAspectRatio = savedAspectRatio || measuredAspectRatio || 0.707;

  const handlePageLoadSuccess = useCallback(
    (page: { width: number; height: number }) => {
      const ratio = page.width / page.height;
      setMeasuredAspectRatio(ratio);
      if (onPageMeasure) {
        onPageMeasure(pageNumber, ratio);
      }
    },
    [pageNumber, onPageMeasure]
  );

  return (
    <div
      ref={containerRef}
      className={styles.nvPageWrapper}
      style={{
        width: "100%",
        maxWidth: "840px",
        aspectRatio: `${currentAspectRatio}`,
        height: "auto",
        position: "relative",
      }}
    >
      {isVisible ? (
        <>
          <div
            className={`${styles.nvPdfPage} ${
              isFullscreen ? styles.nvPdfPageFullscreen : ""
            }`}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={null}
              onLoadSuccess={handlePageLoadSuccess}
            />
          </div>
          <span
            className={`${styles.nvPageNumberLabel} ${
              isFullscreen ? styles.nvPageNumberLabelFullscreen : ""
            }`}
          >
            Sheet {pageNumber} of {totalPages}
          </span>
        </>
      ) : (
        <div
          className={`${styles.nvPagePlaceholder} ${
            isFullscreen ? styles.nvPagePlaceholderFullscreen : ""
          }`}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        >
          <div className={styles.nvPlaceholderShimmer} />
          <div
            className={styles.nvSpinner}
            style={{ width: "22px", height: "22px", borderWidth: "2.5px" }}
          />
          <span>Sheet {pageNumber} • Loading Preview…</span>
        </div>
      )}
    </div>
  );
}

export default function NoteViewer({
  url,
  previewMode = false,
  isFullscreen = false,
  onToggleFullscreen,
}: NoteViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageAspectRatios, setPageAspectRatios] = useState<Record<number, number>>({});
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [zoomMultiplier, setZoomMultiplier] = useState<number>(1.0);
  const [retryKey, setRetryKey] = useState<number>(0);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Compute base scale from container width so PDF fits comfortably
  // A standard PDF page is 595 pts wide at scale=1.0
  const PDF_NATURAL_WIDTH = 595;
  const baseScale =
    containerWidth > 0
      ? Math.min(containerWidth / PDF_NATURAL_WIDTH, isFullscreen ? 1.8 : 1.3)
      : 1.15;

  const scale = Number((baseScale * zoomMultiplier).toFixed(2));

  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      // subtract padding
      setContainerWidth(Math.max(w - 32, 100));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isFullscreen]);

  // Zoom handlers (clamped between 0.70x and 1.75x)
  const handleZoomIn = () => {
    setZoomMultiplier((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 1.75));
  };

  const handleZoomOut = () => {
    setZoomMultiplier((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.7));
  };

  const handleZoomReset = () => {
    setZoomMultiplier(1.0);
  };

  // In preview mode, render at most PREVIEW_MAX_PAGES
  const maxPage = previewMode ? Math.min(numPages, PREVIEW_MAX_PAGES) : numPages;

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setLoading(false);
      setError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback((err: Error) => {
    setError("Unable to render note sheets. Please verify connection or retry.");
    setLoading(false);
    console.error("react-pdf error:", err);
  }, []);

  const handlePageMeasure = useCallback((pageNo: number, aspectRatio: number) => {
    setPageAspectRatios((prev) => {
      if (prev[pageNo] === aspectRatio) return prev;
      return { ...prev, [pageNo]: aspectRatio };
    });
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryKey((prev) => prev + 1);
  };

  return (
    <div
      className={`${styles.nvWrapper} ${
        isFullscreen ? styles.nvWrapperFullscreen : ""
      }`}
    >
      {/* ─── Drafting Ruler Toolbar ─── */}
      <div
        className={`${styles.nvToolbar} ${
          isFullscreen ? styles.nvToolbarFullscreen : ""
        }`}
      >
        {/* Left: Document Spec Status */}
        <div className={styles.nvGroup}>
          {previewMode ? (
            <div
              className={`${styles.nvPreviewBadge} ${
                isFullscreen ? styles.nvPreviewBadgeFullscreen : ""
              }`}
            >
              <LuLock size={12} />
              <span>Preview Mode (3 Pages)</span>
            </div>
          ) : (
            <span
              className={`${styles.nvDocInfo} ${
                isFullscreen ? styles.nvDocInfoFullscreen : ""
              }`}
            >
              <LuFileText size={13} />
              <span>{maxPage ? `${maxPage} Sheets Available` : "Compiling Sheets…"}</span>
            </span>
          )}
        </div>

        {/* Center: Zoom Controls */}
        <div className={styles.nvGroup}>
          <div
            className={`${styles.nvZoomGroup} ${
              isFullscreen ? styles.nvZoomGroupFullscreen : ""
            }`}
          >
            <button
              type="button"
              className={`${styles.nvBtnZoom} ${
                isFullscreen ? styles.nvBtnZoomFullscreen : ""
              }`}
              onClick={handleZoomOut}
              disabled={zoomMultiplier <= 0.7}
              title="Zoom Out (Ctrl -)"
              aria-label="Zoom Out"
            >
              <LuZoomOut size={14} />
            </button>

            <button
              type="button"
              className={`${styles.nvZoomReadout} ${
                isFullscreen ? styles.nvZoomReadoutFullscreen : ""
              }`}
              onClick={handleZoomReset}
              title="Click to reset zoom (100%)"
              aria-label="Reset zoom"
            >
              {Math.round(zoomMultiplier * 100)}%
            </button>

            <button
              type="button"
              className={`${styles.nvBtnZoom} ${
                isFullscreen ? styles.nvBtnZoomFullscreen : ""
              }`}
              onClick={handleZoomIn}
              disabled={zoomMultiplier >= 1.75}
              title="Zoom In (Ctrl +)"
              aria-label="Zoom In"
            >
              <LuZoomIn size={14} />
            </button>
          </div>

          {/* Full Screen Toggle (Minimize / Maximize) */}
          {onToggleFullscreen && (
            <button
              type="button"
              className={`${styles.nvBtn} ${
                isFullscreen ? styles.nvBtnFullscreen : ""
              }`}
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Full Screen (Esc)" : "Full Screen Reader"}
              aria-label={isFullscreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullscreen ? (
                <LuMinimize2 size={14} />
              ) : (
                <LuMaximize2 size={14} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ─── Canvas Drafting Area (Vertically Scrollable) ─── */}
      <div
        ref={canvasAreaRef}
        className={`${styles.nvCanvasArea} ${
          isFullscreen ? styles.nvCanvasAreaFullscreen : ""
        }`}
      >
        {loading && (
          <div
            className={`${styles.nvLoading} ${
              isFullscreen ? styles.nvLoadingFullscreen : ""
            }`}
          >
            <div className={styles.nvSpinner} />
            <span>Rendering Engineer's Notes…</span>
          </div>
        )}

        {error && (
          <div className={styles.nvError}>
            <div className={styles.nvErrorCard}>
              <LuCircleAlert size={28} className={styles.nvErrorIcon} />
              <h4 className={styles.nvErrorTitle}>Failed to Load PDF</h4>
              <p className={styles.nvErrorText}>{error}</p>
              <button
                type="button"
                className={styles.nvRetryBtn}
                onClick={handleRetry}
              >
                <LuRefreshCw size={12} />
                <span>Retry Loading</span>
              </button>
            </div>
          </div>
        )}

        {!error && (
          <Document
            key={`pdf-${retryKey}-${url}`}
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={null}
          >
            <div className={styles.nvPagesContainer}>
              {Array.from({ length: maxPage }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <VirtualPage
                    key={pageNumber}
                    pageNumber={pageNumber}
                    scale={scale}
                    savedAspectRatio={pageAspectRatios[pageNumber]}
                    isFullscreen={isFullscreen}
                    totalPages={maxPage}
                    onPageMeasure={handlePageMeasure}
                  />
                );
              })}
            </div>
          </Document>
        )}
      </div>
    </div>
  );
}

