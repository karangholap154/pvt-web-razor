import Link from "next/link";

export default function UserNotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3rem 1.5rem",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(251, 191, 36, 0.07)",
          border: "1px solid rgba(251, 191, 36, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.5rem",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <line x1="18" y1="11" x2="22" y2="15" />
          <line x1="22" y1="11" x2="18" y2="15" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "-0.02em",
        }}
      >
        User not found
      </h1>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.95rem",
          maxWidth: "360px",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        This username doesn&apos;t exist or may have been changed. Double-check the handle and try again.
      </p>

      <Link
        href="/"
        style={{
          marginTop: "0.75rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.7rem 1.5rem",
          background: "rgba(251, 191, 36, 0.08)",
          border: "1px solid rgba(251, 191, 36, 0.25)",
          borderRadius: "var(--radius-sm)",
          color: "var(--accent)",
          fontWeight: 700,
          fontSize: "0.88rem",
          textDecoration: "none",
        }}
      >
        ← Back to Library
      </Link>
    </div>
  );
}
