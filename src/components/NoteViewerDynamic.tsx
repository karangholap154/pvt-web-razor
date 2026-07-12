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
          gap: "1rem",
          minHeight: "400px",
          color: "#71717a",
          fontSize: "0.9rem",
          background: "#0f0f11",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(251,191,36,0.15)",
            borderTopColor: "#fbbf24",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        Loading document…
      </div>
    ),
  }
);

export default NoteViewerDynamic;
