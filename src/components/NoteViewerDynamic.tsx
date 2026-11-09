import dynamic from "next/dynamic";
import type NoteViewer from "./NoteViewer";
import type { ComponentProps } from "react";

/**
 * Lazy client-only wrapper around NoteViewer.
 * react-pdf uses browser Canvas APIs — it must NEVER run on the server.
 * `ssr: false` prevents hydration mismatches in Next.js App Router.
 */
const NoteViewerDynamic = dynamic<ComponentProps<typeof NoteViewer>>(
  () => import("./NoteViewer"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          minHeight: "440px",
          color: "var(--slate-600, #4A5468)",
          fontFamily: "var(--font-jetbrains), var(--font-mono), monospace",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          background: "var(--paper, #F7F8FB)",
          backgroundImage: "radial-gradient(#CDD4E2 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          borderRadius: "0 0 16px 16px",
          borderTop: "1px solid var(--line-300, #CDD4E2)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            border: "3px solid rgba(36, 71, 245, 0.15)",
            borderTopColor: "var(--blue-500, #2447F5)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span>Initializing Document Viewer…</span>
      </div>
    ),
  }
);

export default NoteViewerDynamic;
