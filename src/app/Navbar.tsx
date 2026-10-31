"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import UniversityChips from "@/components/ui/UniversityChips";
import { LuMenu, LuX, LuLogOut, LuLayoutDashboard, LuUser, LuShield } from "react-icons/lu";
import styles from "@/components/layout/Navbar.module.css";

interface NavbarProps {
  sessionEmail?: string;
  isUserAdmin?: boolean;
  avatarUrl?: string;
  userName?: string;
}

export default function Navbar({
  sessionEmail: initialEmail,
  isUserAdmin: initialIsAdmin,
  avatarUrl,
  userName,
}: NavbarProps) {
  const {
    email: contextEmail,
    username: contextUsername,
    isAdmin: contextIsAdmin,
    authState,
  } = useAuth();

  const isLoaded = authState !== "loading";
  const sessionEmail = isLoaded ? contextEmail ?? undefined : initialEmail;
  const isUserAdmin = isLoaded ? contextIsAdmin : initialIsAdmin;
  const displayUsername = isLoaded ? contextUsername : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUni, setCurrentUni] = useState("MU");

  const pathname = usePathname();
  const router = useRouter();

  // Scroll detection for navbar shadow/border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Handle outside click for dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [dropdownOpen]);

  // Lock body scroll when mobile menu is open
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

  // Read cookie or query for selected university if present
  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )selected_university=([^;]*)/);
      if (match && match[1]) {
        setCurrentUni(decodeURIComponent(match[1]));
      }
    }
  }, []);

  const handleUniversityChange = (uni: string) => {
    setCurrentUni(uni);
    if (typeof document !== "undefined") {
      document.cookie = `selected_university=${encodeURIComponent(uni)}; path=/; max-age=31536000`;
    }
    // If on catalog, update route
    if (pathname === "/notes" || pathname === "/community-notes") {
      router.push(`${pathname}?university=${uni}`);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // 5 primary navigation tabs per DESIGN.md Section 3.5
  const primaryLinks = [
    { href: "/notes", label: "Official Notes" },
    { href: "/community-notes", label: "Community Notes" },
    { href: "/discussions", label: "Discussions" },
    { href: "/projects", label: "Projects" },
    { href: "/contribute", label: "Contribute" },
  ];

  // Secondary links for mobile drawer
  const secondaryLinks = [
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`} id="main-header">
      <div className={styles.container}>
        {/* Left: Brand mark + wordmark */}
        <Logo />

        {/* Center: Desktop Navigation Links */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Login / Avatar + Hamburger) */}
        <div className={styles.headerActions}>
          {sessionEmail ? (
            <div className={styles.profileContainer}>
              <button
                type="button"
                className={styles.avatarBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                }}
                aria-label="User account menu"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    className={styles.avatarImg}
                    referrerPolicy="no-referrer"
                    width={38}
                    height={38}
                    unoptimized
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {(userName || sessionEmail || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    {userName && <div className={styles.dropdownUserName}>{userName}</div>}
                    {displayUsername && (
                      <div className={styles.dropdownHandle}>@{displayUsername}</div>
                    )}
                    <div className={styles.dropdownEmail}>{sessionEmail}</div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link
                    href="/dashboard"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LuLayoutDashboard size={16} aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href={displayUsername ? `/u/${displayUsername}/profile` : "/profile"}
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LuUser size={16} aria-hidden="true" />
                    <span>Profile & Settings</span>
                  </Link>
                  {isUserAdmin && (
                    <Link
                      href="/admin"
                      className={styles.dropdownItem}
                      style={{ color: "var(--blue-500)" }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LuShield size={16} aria-hidden="true" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <a href="/api/auth/logout" className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}>
                    <LuLogOut size={16} aria-hidden="true" />
                    <span>Log out</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <Button href="/login" variant="dark" size="sm">
              Log in
            </Button>
          )}

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            className={styles.mobileMenuBtn}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {menuOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Full-Screen Mobile Drawer */}
      {menuOpen && (
        <aside
          className={styles.mobileDrawer}
          id="mobile-nav-drawer"
          aria-label="Mobile Navigation"
        >
          <div className={styles.mobileDrawerHeader}>
            <Logo onClick={() => setMenuOpen(false)} />
            <button
              type="button"
              className={styles.mobileCloseBtn}
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <LuX size={22} />
            </button>
          </div>

          <div className={styles.mobileDrawerBody}>
            {/* University quick selector */}
            <div className={styles.mobileUniSection}>
              <div className={styles.mobileUniLabel}>Your University</div>
              <UniversityChips value={currentUni} onChange={handleUniversityChange} />
            </div>

            {/* Primary Large Links (26px Display Font) */}
            <nav className={styles.mobileNavGroup} aria-label="Mobile links">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileNavLinkActive : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Secondary Links Below Divider */}
            <div className={styles.mobileSubLinks}>
              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.mobileSubLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileSubLink}
              >
                RSS Feed
              </a>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className={styles.mobileDrawerFooter}>
            {sessionEmail ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Button href="/dashboard" variant="secondary" size="md" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Button>
                {isUserAdmin && (
                  <Button href="/admin" variant="ghost" size="md" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Button>
                )}
                <Button href="/api/auth/logout" variant="ghost" size="md" style={{ color: "var(--error)" }}>
                  Log out
                </Button>
              </div>
            ) : (
              <Button href="/login" variant="dark" size="lg" style={{ width: "100%" }} onClick={() => setMenuOpen(false)}>
                Log in / Sign up
              </Button>
            )}
          </div>
        </aside>
      )}
    </header>
  );
}
