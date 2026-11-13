"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import styles from "./BannedGate.module.css";
import {
  LuShieldAlert,
  LuLogOut,
  LuMail,
} from "react-icons/lu";

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
          <LuShieldAlert size={28} />
        </div>

        <h1 className={styles.title}>Account Access Suspended</h1>
        
        <p className={styles.subtitle}>
          Your account access has been revoked due to community guidelines or terms of service violation.
        </p>

        {email && (
          <span className={styles.emailBadge}>
            <LuMail size={13} />
            <span>{email}</span>
          </span>
        )}

        <div className={styles.noticeBox}>
          <strong>ACCESS RESTRICTED</strong>
          You cannot access the student portal, participate in community discussions, or upload study resources with this account.
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className={styles.btnSignOut}
          disabled={signingOut}
        >
          <LuLogOut size={16} />
          <span>{signingOut ? "Signing out..." : "Acknowledge & Sign Out"}</span>
        </button>

        <p className={styles.contactSupport}>
          If you believe this ban is a mistake, contact our desk at
          <a href="mailto:support@privateacademy.in" className={styles.supportLink}>
            support@privateacademy.in
          </a>
        </p>
      </div>
    </div>
  );
}
