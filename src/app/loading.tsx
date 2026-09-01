export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(70vh - 120px)",
        gap: "1rem",
        color: "var(--text-secondary, #cbd5e1)",
        fontSize: "0.95rem",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid rgba(251, 191, 36, 0.15)",
          borderTopColor: "var(--accent, #fbbf24)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span>Loading content…</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
