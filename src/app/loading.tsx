// Skeleton loading screen — replaces the generic spinner.
// Mirrors the real page layout so the transition from loading → loaded is seamless.
// No library needed: uses a pure CSS shimmer keyframe.
export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .pvt-skel {
          background: linear-gradient(
            90deg,
            #18181b 25%,
            #27272a 50%,
            #18181b 75%
          );
          background-size: 800px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
          border-radius: 6px;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "3.5rem",
        }}
      >
        {/* Hero skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="pvt-skel" style={{ height: "28px", width: "180px" }} />
            <div className="pvt-skel" style={{ height: "56px", width: "90%" }} />
            <div className="pvt-skel" style={{ height: "56px", width: "70%" }} />
            <div className="pvt-skel" style={{ height: "20px", width: "85%", marginTop: "0.5rem" }} />
            <div className="pvt-skel" style={{ height: "20px", width: "65%" }} />
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <div className="pvt-skel" style={{ height: "48px", width: "140px", borderRadius: "12px" }} />
              <div className="pvt-skel" style={{ height: "48px", width: "140px", borderRadius: "12px" }} />
            </div>
          </div>
          <div className="pvt-skel" style={{ height: "320px", borderRadius: "16px" }} />
        </div>

        {/* Search section skeleton */}
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div className="pvt-skel" style={{ height: "24px", width: "200px" }} />
          <div className="pvt-skel" style={{ height: "16px", width: "300px" }} />
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const }}>
            <div className="pvt-skel" style={{ height: "44px", flex: "1 1 200px", borderRadius: "8px" }} />
            <div className="pvt-skel" style={{ height: "44px", flex: "0 0 150px", borderRadius: "8px" }} />
            <div className="pvt-skel" style={{ height: "44px", flex: "0 0 150px", borderRadius: "8px" }} />
          </div>
        </div>

        {/* Notes grid skeleton — 6 cards matching real noteCard shape */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
            gap: "2rem",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {/* Title row */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <div className="pvt-skel" style={{ height: "20px", flex: 1 }} />
                <div className="pvt-skel" style={{ height: "20px", width: "60px", borderRadius: "4px" }} />
              </div>
              {/* Tag badges */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div className="pvt-skel" style={{ height: "24px", width: "80px", borderRadius: "4px" }} />
                <div className="pvt-skel" style={{ height: "24px", width: "60px", borderRadius: "4px" }} />
              </div>
              {/* Description lines */}
              <div className="pvt-skel" style={{ height: "14px", width: "100%" }} />
              <div className="pvt-skel" style={{ height: "14px", width: "80%" }} />
              {/* Action buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #27272a",
                  marginTop: "auto",
                }}
              >
                <div className="pvt-skel" style={{ height: "36px", borderRadius: "8px" }} />
                <div className="pvt-skel" style={{ height: "36px", borderRadius: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

