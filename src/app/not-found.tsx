import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Private Academy",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
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
          background: "var(--accent-light, rgba(251, 191, 36, 0.15))",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          color: "var(--accent, #fbbf24)",
          fontSize: "0.875rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
        }}
      >
        <span style={{ fontSize: "1rem" }}>⚠️</span> Error 404
      </div>

      <h1
        style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: "1rem",
          color: "var(--text-primary, #f8fafc)",
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          fontSize: "1.1rem",
          color: "var(--text-secondary, #cbd5e1)",
          maxWidth: "480px",
          lineHeight: 1.6,
          marginBottom: "2.5rem",
        }}
      >
        Sorry, the page or resource you are looking for doesn&apos;t exist, was removed, or has moved to a new address.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Link
          href="/"
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
            textDecoration: "none",
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Home
        </Link>

        <Link
          href="/articles"
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
          Browse Articles
        </Link>

        <Link
          href="/discussions"
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
          Community Discussions
        </Link>
      </div>
    </div>
  );
}
