"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./utility.module.css";
import {
  LuRefreshCw,
  LuHouse,
  LuLifeBuoy,
  LuCopy,
  LuCheck,
  LuTriangleAlert,
} from "react-icons/lu";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to console and error reporting
    console.error("Unhandled App Error:", error);
  }, [error]);

  const handleCopyDigest = async () => {
    const traceInfo = `Error: ${error.message || "Unknown Application Fault"}${
      error.digest ? `\nDigest: ${error.digest}` : ""
    }`;
    try {
      await navigator.clipboard.writeText(traceInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Engineered Note Sheet with Diagnostic Fault Styling (§4.18) */}
        <section className={styles.sheet} aria-labelledby="error-heading">
          {/* Top-Right Dog-Ear / Torn Corner */}
          <div className={styles.tornCorner} aria-hidden="true">
            <div className={styles.tornCornerFold} />
          </div>

          {/* Technical Spec Eyebrow */}
          <div className={styles.specHeader}>
            <div className={styles.specEyebrow}>
              <span
                className={`${styles.statusIndicator} ${styles.statusIndicatorFault}`}
                aria-hidden="true"
              />
              <span>DIAGNOSTIC FAULT // RUNTIME_EXCEPTION</span>
            </div>
            <div className={styles.errorChip}>STATUS: 500 SERVER_FAULT</div>
          </div>

          {/* Large Monospace Error Numeral in Fault Red */}
          <span
            className={`${styles.errorCode} ${styles.errorCodeFault}`}
            aria-hidden="true"
          >
            500
          </span>

          {/* Display Headline with Highlighter */}
          <h1 id="error-heading" className={styles.title}>
            Something went wrong on{" "}
            <span className={styles.highlighter}>our side</span>.
          </h1>

          <p className={styles.description}>
            We ran into an unexpected problem while executing this resource.
            Our technical telemetry has captured this event for inspection.
          </p>

          {/* Diagnostic Trace Box */}
          <div className={styles.diagnosticBox} role="region" aria-label="Diagnostic error details">
            <div className={styles.diagnosticHeader}>
              <span className={styles.diagnosticLabel}>
                <LuTriangleAlert size={12} style={{ display: "inline", marginRight: "4px" }} />
                SYSTEM DIAGNOSTIC TRACE
              </span>
              <button
                type="button"
                onClick={handleCopyDigest}
                className={styles.copyDigestBtn}
                title="Copy error trace to clipboard"
                aria-label="Copy error trace"
              >
                {copied ? (
                  <>
                    <LuCheck size={12} color="#10B981" /> Copied Trace
                  </>
                ) : (
                  <>
                    <LuCopy size={12} /> Copy Trace
                  </>
                )}
              </button>
            </div>
            <code className={styles.digestCode}>
              {error.digest ? `Digest: ${error.digest}` : error.message || "An unexpected error occurred during execution."}
            </code>
          </div>

          {/* Action Row (§4.18) */}
          <div className={styles.actionsRow}>
            <button
              type="button"
              onClick={() => reset()}
              className={styles.primaryBtn}
            >
              <LuRefreshCw size={15} /> Try Again
            </button>
            <Link href="/" className={styles.secondaryBtn}>
              <LuHouse size={15} /> Return to Home
            </Link>
            <Link
              href="/contact?subject=Runtime+Error+Report"
              className={styles.secondaryBtn}
            >
              <LuLifeBuoy size={15} /> Report Issue
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
