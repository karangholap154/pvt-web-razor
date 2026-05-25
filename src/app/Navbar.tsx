"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

interface NavbarProps {
  sessionEmail?: string;
  isUserAdmin?: boolean;
}

export default function Navbar({ sessionEmail, isUserAdmin }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu whenever route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className={styles.nav} id="desktop-nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ""}`}
            id={`nav-link-${link.label.toLowerCase()}`}
          >
            {link.label}
          </Link>
        ))}
        {sessionEmail ? (
          <>
            {isUserAdmin && (
              <Link
                href="/admin"
                className={`${styles.navLink} ${isActive("/admin") ? styles.navLinkActive : ""}`}
                id="nav-link-admin"
                style={{ border: "1px dashed var(--accent)", color: "var(--accent)" }}
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/dashboard"
              className={`${styles.navLink} ${isActive("/dashboard") ? styles.navLinkActive : ""}`}
              id="nav-link-dashboard"
            >
              Dashboard
            </Link>
            <a href="/api/auth/logout" className={styles.navLink} id="nav-link-logout" style={{ color: "#ef4444" }}>
              Logout
            </a>
          </>
        ) : (
          <Link href="/login" className={styles.navLinkAuth} id="nav-link-login">
            Login
          </Link>
        )}
      </nav>

      {/* Hamburger Button */}
      <button
        className={styles.mobileMenuBtn}
        id="btn-mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-drawer"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? (
          /* X icon */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Hamburger icon */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <nav
        id="mobile-nav-drawer"
        className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ""}`}
        aria-label="Mobile navigation"
      >
        <div className={styles.mobileDrawerHeader}>
          <Link href="/" className={styles.logo} id="mobile-nav-logo" onClick={() => setMenuOpen(false)}>
            Private<span className={styles.logoAccent}>Academy</span>
          </Link>
          <button
            className={styles.mobileCloseBtn}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileNavLinkActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {sessionEmail ? (
            <>
              {isUserAdmin && (
                <Link
                  href="/admin"
                  className={`${styles.mobileNavLink} ${isActive("/admin") ? styles.mobileNavLinkActive : ""}`}
                  style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  ⚙ Admin Panel
                </Link>
              )}
              <Link
                href="/dashboard"
                className={`${styles.mobileNavLink} ${isActive("/dashboard") ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <a
                href="/api/auth/logout"
                className={styles.mobileNavLink}
                style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
                onClick={() => setMenuOpen(false)}
              >
                Logout
              </a>
            </>
          ) : (
            <Link
              href="/login"
              className={styles.mobileNavLinkAuth}
              onClick={() => setMenuOpen(false)}
            >
              Login / Sign Up
            </Link>
          )}
        </div>

        {sessionEmail && (
          <div className={styles.mobileDrawerFooter}>
            <span className={styles.mobileUserEmail}>Signed in as {sessionEmail}</span>
          </div>
        )}
      </nav>
    </>
  );
}
