"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import styles from "./BannedGate.module.css";

interface BannedGateProps {
  email: string | null;
  onSignOut: () => Promise<void>;
}

export default function BannedGate({ email, onSignOut }: BannedGateProps) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      await onSignOut();
    } catch (err) {
      console.error("Error signing out banned user:", err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconBadge}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className={styles.title}>Account Banned</h1>
        <p className={styles.subtitle}>
          Your account access has been revoked due to community guidelines or terms of service violation.
        </p>

        {email && <span className={styles.emailBadge}>{email}</span>}

        <div className={styles.noticeBox}>
          <strong>🚫 Access Restricted:</strong> You cannot access the student portal, community discussions, or upload study resources with this account.
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className={styles.btnSignOut}
          disabled={signingOut}
        >
          {signingOut ? "Signing out..." : "Acknowledge & Sign Out"}
        </button>

        <p className={styles.contactSupport}>
          If you believe this ban is a mistake, contact support at{" "}
          <a href="mailto:support@privateacademy.in" className={styles.supportLink}>
            support@privateacademy.in
          </a>
        </p>
      </div>
    </div>
  );
}
