"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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
  onPageMeasure?: (pageNumber: number, aspectRatio: number) => void;
}

function VirtualPage({
  pageNumber,
  scale,
  savedAspectRatio,
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

  const handlePageLoadSuccess = useCallback((page: { width: number; height: number }) => {
    const ratio = page.width / page.height;
    setMeasuredAspectRatio(ratio);
    if (onPageMeasure) {
      onPageMeasure(pageNumber, ratio);
    }
  }, [pageNumber, onPageMeasure]);

  return (
    <div
      ref={containerRef}
      className="nv-page-wrapper"
      style={{
        width: "100%",
        maxWidth: "800px",
        aspectRatio: `${currentAspectRatio}`,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      {isVisible ? (
        <>
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading={null}
            onLoadSuccess={handlePageLoadSuccess}
          />
          <span className="nv-page-number-label">Page {pageNumber}</span>
        </>
      ) : (
        <div
          className="nv-page-placeholder"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        >
          <div className="nv-spinner" style={{ width: "20px", height: "20px", borderWidth: "2px" }} />
          <span>Loading Page {pageNumber}…</span>
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
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Compute scale from container width so PDF always fits without horizontal scroll
  // A standard PDF page is 595 pts wide at scale=1.0
  const PDF_NATURAL_WIDTH = 595;
  const scale = containerWidth > 0
    ? Math.min(containerWidth / PDF_NATURAL_WIDTH, isFullscreen ? 1.8 : 1.3)
    : 1.15;

  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      // subtract padding (1rem each side = ~32px)
      setContainerWidth(Math.max(w - 32, 100));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isFullscreen]);

  // In preview mode, render at most PREVIEW_MAX_PAGES
  const maxPage = previewMode ? Math.min(numPages, PREVIEW_MAX_PAGES) : numPages;

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    setError("Failed to load the PDF. Please try again.");
    setLoading(false);
    console.error("react-pdf error:", err);
  }, []);

  const handlePageMeasure = useCallback((pageNo: number, aspectRatio: number) => {
    setPageAspectRatios((prev) => {
      if (prev[pageNo] === aspectRatio) return prev;
      return { ...prev, [pageNo]: aspectRatio };
    });
  }, []);

  return (
    <div className="nv-wrapper">
      {/* ─── Toolbar ─── */}
      <div className="nv-toolbar">
        {/* Document Info / Status Badge */}
        <div className="nv-group">
          {previewMode ? (
            <div className="nv-preview-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Preview Mode (3 Pages)</span>
            </div>
          ) : (
            <span className="nv-doc-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>{maxPage ? `${maxPage} Pages` : "Loading..."}</span>
            </span>
          )}
        </div>

        {/* Full Screen Toggle (Minimize / Maximize) */}
        <div className="nv-group">
          {onToggleFullscreen && (
            <button
              className="nv-btn"
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
              aria-label={isFullscreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullscreen ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ─── Canvas area (Vertically Scrollable) ─── */}
      <div ref={canvasAreaRef} className="nv-canvas-area">
        {loading && (
          <div className="nv-loading">
            <div className="nv-spinner" />
            <span>Loading document…</span>
          </div>
        )}
        {error && (
          <div className="nv-error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
        >
          <div className="nv-pages-container">
            {Array.from({ length: maxPage }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <VirtualPage
                  key={pageNumber}
                  pageNumber={pageNumber}
                  scale={scale}
                  savedAspectRatio={pageAspectRatios[pageNumber]}
                  onPageMeasure={handlePageMeasure}
                />
              );
            })}
          </div>
        </Document>
      </div>

      {/* ─── Scoped styles ─── */}
      <style>{`
        .nv-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          min-height: 500px;
          background: #0f0f11;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }

        .nv-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          background: #18181b;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .nv-group {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .nv-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .nv-btn:hover:not(:disabled) {
          background: rgba(251,191,36,0.12);
          border-color: rgba(251,191,36,0.35);
          color: #fbbf24;
        }

        .nv-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .nv-doc-info {
          display: inline-flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: #fbbf24;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.25);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          user-select: none;
        }

        .nv-scale-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #a1a1aa;
          padding: 0 0.5rem;
          height: 32px;
          display: inline-flex;
          align-items: center;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          transition: all 0.15s ease;
          min-width: 52px;
          justify-content: center;
          font-variant-numeric: tabular-nums;
        }

        .nv-scale-label:hover {
          background: rgba(251,191,36,0.1);
          border-color: rgba(251,191,36,0.3);
          color: #fbbf24;
        }

        .nv-preview-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.25);
          color: #fbbf24;
          font-size: 0.72rem;
          font-weight: 700;
          border-radius: 6px;
          padding: 0.35rem 0.75rem;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          user-select: none;
        }

        .nv-canvas-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 1.5rem 1rem;
          background: #0f0f11;
          position: relative;
          min-height: 480px;
        }

        .nv-pages-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          width: 100%;
        }

        .nv-page-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
        }

        .nv-page-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
          color: #71717a;
          font-size: 0.85rem;
          font-weight: 500;
          user-select: none;
        }

        .nv-page-number-label {
          font-size: 0.75rem;
          color: #71717a;
          font-weight: 600;
          background: rgba(24, 24, 27, 0.6);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          user-select: none;
        }

        .nv-canvas-area .react-pdf__Page {
          box-shadow: 0 8px 40px rgba(0,0,0,0.6);
          border-radius: 6px;
          overflow: hidden;
        }

        .nv-canvas-area .react-pdf__Page canvas {
          display: block;
          max-width: 100%;
          height: auto !important;
        }

        .nv-loading {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #71717a;
          font-size: 0.9rem;
        }

        .nv-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(251,191,36,0.15);
          border-top-color: #fbbf24;
          border-radius: 50%;
          animation: nv-spin 0.8s linear infinite;
        }

        @keyframes nv-spin {
          to { transform: rotate(360deg); }
        }

        .nv-error {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #ef4444;
          font-size: 0.9rem;
          text-align: center;
          padding: 2rem;
        }

        @media (max-width: 480px) {
          .nv-toolbar {
            padding: 0.5rem 0.75rem;
            gap: 0.4rem;
          }
          .nv-canvas-area {
            padding: 0.5rem 0; /* Zero side padding to maximize reading space on narrow viewports */
          }
          .nv-doc-info, .nv-preview-badge {
            font-size: 0.72rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
