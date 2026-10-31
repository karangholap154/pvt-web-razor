import Link from "next/link";
import Logo from "@/components/brand/Logo";
import styles from "./Footer.module.css";

// Clean SVG Icons for Social Channels
const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const PeerlistIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 16H9V8h4.5c1.38 0 2.5 1.12 2.5 2.5S14.88 13 13.5 13H12v3z" />
  </svg>
);

const socialChannels = [
  { name: "Telegram", url: "https://t.me/mumcomputer", icon: TelegramIcon, primary: true },
  { name: "WhatsApp", url: "https://chat.whatsapp.com/EYeOgxDw8qp6oRMlnTjlfI", icon: WhatsAppIcon },
  { name: "YouTube", url: "https://www.youtube.com/@pvtacademy", icon: YouTubeIcon },
  { name: "Instagram", url: "https://www.instagram.com/privateacademy.in", icon: InstagramIcon },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/privateacademy/", icon: LinkedInIcon },
  { name: "X", url: "https://x.com/PVTAcademyEdu", icon: TwitterIcon },
  { name: "Peerlist", url: "https://peerlist.io/company/privateacademy", icon: PeerlistIcon },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="main-footer">
      <div className={styles.container}>
        {/* Social Channels Strip */}
        <div className={styles.socialStrip}>
          <div className={styles.socialLabel}>Community Channels</div>
          <div className={styles.socialPills}>
            {socialChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialPill} ${channel.primary ? styles.socialPillDark : ""}`}
                >
                  <Icon />
                  <span>{channel.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* 3 Main Link Columns Grid */}
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <Logo />
            <p className={styles.brandTagline}>
              Engineering study hub built by a student, for students. Syllabus-aligned notes, derivations, and question guides.
            </p>
            <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
              <span className="label-mono" style={{ color: "var(--slate-600)", fontSize: "11px" }}>
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className={styles.linksCol}>
            <span className={styles.colHeader}>Explore</span>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}><Link href="/notes">Official Notes</Link></li>
              <li className={styles.linkItem}><Link href="/community-notes">Community Notes</Link></li>
              <li className={styles.linkItem}><Link href="/discussions">Discussions</Link></li>
              <li className={styles.linkItem}><Link href="/projects">Projects</Link></li>
              <li className={styles.linkItem}><Link href="/contribute">Contribute</Link></li>
              <li className={styles.linkItem}><Link href="/articles">Articles</Link></li>
              <li className={styles.linkItem}><Link href="/about">About Us</Link></li>
              <li className={styles.linkItem}><Link href="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div className={styles.linksCol}>
            <span className={styles.colHeader}>Legal</span>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li className={styles.linkItem}><Link href="/terms-and-condition">Terms & Conditions</Link></li>
              <li className={styles.linkItem}><Link href="/refund-policy">Refund Policy</Link></li>
              <li className={styles.linkItem}><Link href="/shipping-policy">Shipping Policy</Link></li>
              <li className={styles.linkItem}><Link href="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className={styles.linksColWide}>
            <span className={styles.colHeader}>Support</span>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a href="mailto:info@privateacademy.in" style={{ fontWeight: 600, color: "var(--ink-900)" }}>
                  info@privateacademy.in
                </a>
              </li>
              <li className={styles.linkItem}>
                <Link href="/contact">Contact Form</Link>
              </li>
              <li className={styles.linkItem} style={{ color: "var(--slate-600)", fontSize: "14px", marginTop: "4px" }}>
                Mumbai, Maharashtra, India
              </li>
              <li className={styles.linkItem} style={{ marginTop: "8px" }}>
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono"
                  style={{ color: "var(--blue-500)", textDecoration: "underline" }}
                >
                  RSS 2.0 Feed ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Signature Giant Cropped Wordmark */}
        <div className={styles.wordmarkWrapper} aria-hidden="true">
          <span className={styles.giantWordmark}>Private Academy</span>
        </div>

        {/* Copyright Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>
            Built with dedication by{" "}
            <a href="https://www.karangholap.com/" target="_blank" rel="noopener noreferrer" className={styles.bottomLink}>
              Karan Gholap
            </a>
          </div>
          <div>© {new Date().getFullYear()} Private Academy. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
