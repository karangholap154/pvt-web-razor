"use client";

import { Suspense } from "react";
import HomeContent from "../components/portal/HomeContent";

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "var(--text-secondary)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }}></div>
          <h3>Loading Private Academy Library...</h3>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
