import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { cookies } from "next/headers";
import { isAdmin } from "../utils/auth";
import Navbar from "./Navbar";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Private Academy | Engineering Study Hub",
  description: "Study smarter — faster access to notes and guides. A unified library for branch-wise engineering notes, semester filters, and tutorials.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get("session_email")?.value;
  const isUserAdmin = await isAdmin();

  return (
    <html lang="en">
      <body className="page-container">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        {/* Sticky Header / Navbar */}
        <header className={styles.header} id="main-header">
          <div className={styles.navContainer}>
            <a href="/" className={styles.logo} id="nav-logo">
              Private<span className={styles.logoAccent}>Academy</span>
            </a>
            <Navbar sessionEmail={sessionEmail} isUserAdmin={isUserAdmin} />
          </div>
        </header>

        {/* Content Wrapper */}
        <div style={{ flex: 1, width: "100%" }}>{children}</div>

        {/* Shared Footer */}
        <footer className={styles.footer} id="main-footer">
          <div className={styles.navContainer}>
            <div className={styles.footerGrid}>
              
              {/* Brand Col */}
              <div className={styles.footerBrand}>
                <div className={styles.footerLogo}>Private Academy</div>
                <div className={styles.footerTagline}>Engineering Excellence Hub</div>
                <p className={styles.footerDesc}>
                  Empowering engineering students with comprehensive study materials, important questions, and video tutorials. Quality education accessible to all.
                </p>
              </div>

              {/* Quick Links Col */}
              <div>
                <h3 className={styles.footerTitle}>Quick Links</h3>
                <ul className={styles.footerLinks}>
                  <li><Link href="/" className={styles.footerLink}>Home</Link></li>
                  <li><Link href="/articles" className={styles.footerLink}>Articles</Link></li>
                  <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
                  <li><Link href="/projects" className={styles.footerLink}>Projects</Link></li>
                  <li><Link href="/careers" className={styles.footerLink}>Careers</Link></li>
                  <li><Link href="/contact" className={styles.footerLink}>Contact</Link></li>
                </ul>
              </div>

              {/* Legal Col */}
              <div>
                <h3 className={styles.footerTitle}>Legal</h3>
                <ul className={styles.footerLinks}>
                  <li><Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link></li>
                  <li><Link href="/terms-and-condition" className={styles.footerLink}>Terms & Conditions</Link></li>
                  <li><Link href="/disclaimer" className={styles.footerLink}>Disclaimer</Link></li>
                </ul>
              </div>

              {/* Connect / Info Col */}
              <div>
                <h3 className={styles.footerTitle}>Connect</h3>
                <div className={styles.footerContact}>
                  <div className={styles.contactItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <a href="mailto:privateacademy.in@gmail.com" className={styles.contactLink}>
                      privateacademy.in@gmail.com
                    </a>
                  </div>
                  <div className={styles.contactItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>India</span>
                  </div>
                </div>

                <div className={styles.socialGrid} id="social-grid">
                  {/* Telegram */}
                  <a href="https://t.me" className={styles.socialIcon} title="Telegram" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a href="https://wa.me" className={styles.socialIcon} title="WhatsApp" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href="https://youtube.com" className={styles.socialIcon} title="YouTube" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://instagram.com" className={styles.socialIcon} title="Instagram" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="https://linkedin.com" className={styles.socialIcon} title="LinkedIn" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  {/* X (Twitter) */}
                  <a href="https://x.com" className={styles.socialIcon} title="X (Twitter)" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                    </svg>
                  </a>
                  {/* Peerlist (Custom P icon) */}
                  <a href="https://peerlist.io" className={styles.socialIcon} title="Peerlist" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 16H9V8h4.5c1.38 0 2.5 1.12 2.5 2.5S14.88 13 13.5 13H12v3z"></path>
                    </svg>
                  </a>
                </div>
              </div>

            </div>

            <div className={styles.footerBottom}>
              <div>Made with ❤️ by Karan Gholap</div>
              <div>© 2026 Private Academy. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
