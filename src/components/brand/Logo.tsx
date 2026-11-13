import React from "react";
import Link from "next/link";
import styles from "./Logo.module.css";

export interface LogoProps {
  href?: string;
  onDark?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Logo({
  href = "/",
  onDark = false,
  className = "",
  onClick,
}: LogoProps) {
  const content = (
    <span className={`${styles.logoLink} ${onDark ? styles.onDark : ""} ${className}`.trim()}>
      <span className={styles.logoMark} aria-hidden="true">
        <span className={styles.highlighterBar} />
      </span>
      <span className={styles.wordmark}>Private Academy</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} aria-label="Private Academy Home">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
