"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error("Unhandled App Error:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(80vh - 120px)",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 1rem",
          borderRadius: "9999px",
          background: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ef4444",
          fontSize: "0.875rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
        }}
      >
        <span style={{ fontSize: "1rem" }}>⚡</span> Something went wrong
      </div>

      <h1
        style={{
          fontSize: "clamp(2rem, 4vw, 3.25rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          marginBottom: "1rem",
          color: "var(--text-primary, #f8fafc)",
        }}
      >
        An unexpected error occurred
      </h1>

      <p
        style={{
          fontSize: "1.05rem",
          color: "var(--text-secondary, #cbd5e1)",
          maxWidth: "520px",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}
      >
        We ran into a problem loading this page. You can try refreshing or returning to the homepage.
      </p>

      {error.digest && (
        <code
          style={{
            display: "inline-block",
            fontSize: "0.8rem",
            color: "#94a3b8",
            background: "#18181b",
            border: "1px solid #27272a",
            padding: "0.3rem 0.75rem",
            borderRadius: "6px",
            marginBottom: "2rem",
            fontFamily: "monospace",
          }}
        >
          Error Digest: {error.digest}
        </code>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          type="button"
          onClick={() => reset()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.75rem",
            borderRadius: "var(--radius, 12px)",
            background: "var(--accent, #fbbf24)",
            color: "#09090b",
            fontWeight: 700,
            fontSize: "0.95rem",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 14px rgba(251, 191, 36, 0.3)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Try Again
        </button>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "var(--radius, 12px)",
            background: "var(--card-bg, #18181b)",
            border: "1px solid var(--border, #27272a)",
            color: "var(--text-primary, #f8fafc)",
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
