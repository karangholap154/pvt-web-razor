"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Image from "next/image";
import styles from "./layout.module.css";

interface NavbarProps {
  sessionEmail?: string;
  isUserAdmin?: boolean;
  avatarUrl?: string;
  userName?: string;
}

export default function Navbar({ sessionEmail: initialEmail, isUserAdmin: initialIsAdmin, avatarUrl, userName }: NavbarProps) {
  const { email: contextEmail, username: contextUsername, isAdmin: contextIsAdmin, authState } = useAuth();
  
  const isLoaded = authState !== "loading";
  const sessionEmail = isLoaded ? contextEmail ?? undefined : initialEmail;
  const isUserAdmin = isLoaded ? contextIsAdmin : initialIsAdmin;
  const displayUsername = isLoaded ? contextUsername : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Close menu and dropdown whenever route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuOpen(false);
      setDropdownOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle click outside dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [dropdownOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

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
          <div className={styles.profileContainer}>
            <button 
              type="button"
              className={styles.avatarBtn} 
              onClick={toggleDropdown}
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" className={styles.avatarImg} referrerPolicy="no-referrer" width={38} height={38} unoptimized />
              ) : (
                <div className={styles.avatarFallback}>
                  {(userName || sessionEmail || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            
            {dropdownOpen && (
              <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dropdownHeader}>
                  {userName && <div className={styles.dropdownName}>{userName}</div>}
                  {displayUsername && (
                    <Link
                      href={`/u/${displayUsername}`}
                      style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.2rem", textDecoration: "none", display: "block" }}
                      onClick={() => setDropdownOpen(false)}
                    >@{displayUsername}</Link>
                  )}
                  <div className={styles.dropdownEmail}>{sessionEmail}</div>
                </div>
                <div className={styles.dropdownDivider} />
                <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  Dashboard
                </Link>
                <Link 
                  href={displayUsername ? `/u/${displayUsername}/profile` : "/profile"} 
                  className={styles.dropdownItem} 
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile & Settings
                </Link>
                {isUserAdmin && (
                  <Link href="/admin" className={styles.dropdownItem} style={{ color: "var(--accent)" }} onClick={() => setDropdownOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <div className={styles.dropdownDivider} />
                <a href="/api/auth/logout" className={styles.dropdownItemLogout}>
                  Logout
                </a>
              </div>
            )}
          </div>
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
              <Link
                href={displayUsername ? `/u/${displayUsername}/profile` : "/profile"}
                className={`${styles.mobileNavLink} ${
                  pathname.endsWith("/profile") ? styles.mobileNavLinkActive : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Profile & Settings
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
            <div className={styles.mobileUserContainer}>
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" className={styles.mobileAvatarImg} referrerPolicy="no-referrer" width={42} height={42} unoptimized />
              ) : (
                <div className={styles.mobileAvatarFallback}>
                  {(userName || sessionEmail || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className={styles.mobileUserInfo}>
                {userName && <span className={styles.mobileUserName}>{userName}</span>}
                {displayUsername && (
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)" }}>@{displayUsername}</span>
                )}
                <span className={styles.mobileUserEmail}>{sessionEmail}</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
