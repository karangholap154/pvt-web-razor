import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next"; 
import { SpeedInsights } from "@vercel/speed-insights/next";
import { checkIsAdmin } from "../utils/auth";
import { createSupabaseServerClient } from "../utils/supabaseServer";
import Navbar from "./Navbar";
import FooterWrapper from "./FooterWrapper";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";
import styles from "./layout.module.css";

// SVG Icon components for the socials
const FaTelegram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const FaWhatsapp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const FaYoutube = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const FaInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FaLinkedin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FaTwitter = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const SiPeerlist = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 16H9V8h4.5c1.38 0 2.5 1.12 2.5 2.5S14.88 13 13.5 13H12v3z" />
  </svg>
);

const socialLinks = [
  {
    name: 'Telegram',
    url: 'https://t.me/mumcomputer',
    icon: FaTelegram,
    description: 'Join 2.5K+ members',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.08)'
  },
  {
    name: 'WhatsApp',
    url: 'https://chat.whatsapp.com/EYeOgxDw8qp6oRMlnTjlfI',
    icon: FaWhatsapp,
    description: 'Study group chat',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.08)'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@pvtacademy',
    icon: FaYoutube,
    description: 'Video tutorials',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.08)'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/privateacademy.in',
    icon: FaInstagram,
    description: 'Updates & posts',
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.08)'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/privateacademy/',
    icon: FaLinkedin,
    description: 'Professional network',
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.08)'
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com/PVTAcademyEdu',
    icon: FaTwitter,
    description: 'Latest updates',
    color: '#e2e8f0',
    bg: 'rgba(226, 232, 240, 0.06)'
  },
  {
    name: 'Peerlist',
    url: 'https://peerlist.io/company/privateacademy',
    icon: SiPeerlist,
    description: 'Professional community',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.08)'
  },
];


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Private Academy | Engineering Study Hub & Notes Library",
    template: "%s | Private Academy",
  },
  description: "Syllabus-aligned engineering study notes, semester question guides, project source code, and video tutorials for Mumbai University, SPPU, DBATU, and leading universities.",
  keywords: [
    "engineering notes",
    "mumbai university notes",
    "sppu notes",
    "dbatu notes",
    "computer engineering notes",
    "IT engineering notes",
    "engineering study materials",
    "private academy",
    "engineering projects",
    "exam guides",
    "video tutorials",
  ],
  authors: [{ name: "Karan Gholap", url: "https://www.karangholap.com/" }],
  creator: "Private Academy Engineering",
  publisher: "Private Academy Engineering",
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/pvtimg.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Private Academy | Engineering Study Hub & Notes Library",
    description: "Syllabus-aligned engineering study notes, semester question guides, project source code, and video tutorials.",
    siteName: "Private Academy",
    images: [
      {
        url: "/pvtimg.png",
        width: 1200,
        height: 630,
        alt: "Private Academy Engineering Study Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Academy | Engineering Study Hub & Notes Library",
    description: "Syllabus-aligned engineering study notes, semester question guides, project source code, and video tutorials.",
    creator: "@PVTAcademyEdu",
    images: ["/pvtimg.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevent user-zoom on form inputs (common mobile annoyance)
  userScalable: false,
  viewportFit: "cover", // Enable safe-area-inset env() support on notched iPhones
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const sessionEmail = user?.email ?? undefined;
  const isUserAdmin = checkIsAdmin(sessionEmail);

  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? undefined;
  const userName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}/#organization`,
        "name": "Private Academy Engineering",
        "url": siteUrl,
        "logo": `${siteUrl}/pvtimg.png`,
        "description": "Comprehensive study resource platform built for engineering students across leading universities.",
        "sameAs": [
          "https://t.me/mumcomputer",
          "https://www.youtube.com/@pvtacademy",
          "https://www.instagram.com/privateacademy.in",
          "https://www.linkedin.com/company/privateacademy/",
          "https://x.com/PVTAcademyEdu",
          "https://peerlist.io/company/privateacademy"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Private Academy",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="page-container" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            {/* Sticky Header / Navbar */}
          <header className={styles.header} id="main-header">
            <div className={styles.navContainer}>
              <Link href="/" className={styles.logo} id="nav-logo">
                Private<span className={styles.logoAccent}>Academy</span>
              </Link>
              <Navbar 
                sessionEmail={sessionEmail} 
                isUserAdmin={isUserAdmin} 
                avatarUrl={avatarUrl}
                userName={userName}
              />
            </div>
          </header>

          {/* Content Wrapper */}
          <div style={{ flex: 1, width: "100%" }}>{children}</div>

          {/* Shared Footer wrapped to conditionally hide it */}
          <FooterWrapper>
            <footer className={styles.footer} id="main-footer">
              <div className={styles.navContainer} style={{ flexDirection: "column", alignItems: "stretch" }}>
                
                {/* Social Links Badge Grid */}
                <div className={styles.socialSection}>
                  <h3 className={`${styles.socialSectionTitle} ${styles.footerHideOnMobile}`}>Connect with Our Community</h3>
                  <div className={styles.socialCardGrid}>
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          className={styles.socialCard}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div 
                            className={styles.socialCardIconWrapper} 
                            style={{ color: social.color, backgroundColor: social.bg }}
                          >
                            <Icon />
                          </div>
                          <div className={styles.socialCardContent}>
                            <div className={styles.socialCardName}>{social.name}</div>
                            <div className={styles.socialCardDesc}>{social.description}</div>
                          </div>
                          <div className={styles.socialCardArrow}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className={`${styles.footerGrid} ${styles.footerHideOnMobile}`}>
                  
                  {/* Brand Col */}
                  <div className={styles.footerBrand}>
                    <Link href="/" className={styles.logo} style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>
                      Private<span className={styles.logoAccent}>Academy</span>
                    </Link>
                    <div className={`${styles.footerTagline} ${styles.footerHideOnMobile}`}>Engineering Excellence Hub</div>
                    <p className={styles.footerDesc}>
                      Empowering engineering students with comprehensive study materials, important questions, and video tutorials. Quality education accessible to all.
                    </p>
                    <div className={styles.footerHideOnMobile} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)" }} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>All Systems Operational</span>
                    </div>
                  </div>

                  {/* Quick Links Col */}
                  <div className={styles.footerHideOnMobile}>
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
                  <div className={styles.footerHideOnMobile}>
                    <h3 className={styles.footerTitle}>Legal</h3>
                    <ul className={styles.footerLinks}>
                      <li><Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link></li>
                      <li><Link href="/terms-and-condition" className={styles.footerLink}>Terms & Conditions</Link></li>
                      <li><Link href="/refund-policy" className={styles.footerLink}>Refund Policy</Link></li>
                      <li><Link href="/shipping-policy" className={styles.footerLink}>Shipping Policy</Link></li>
                      <li><Link href="/disclaimer" className={styles.footerLink}>Disclaimer</Link></li>
                    </ul>
                  </div>

                  {/* Support Col */}
                  <div>
                    <h3 className={`${styles.footerTitle} ${styles.footerHideOnMobile}`}>Support</h3>
                    <div className={styles.footerContact}>
                      <div className={styles.contactItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <a href="mailto:privateacademy.in@gmail.com" className={styles.contactLink}>
                          privateacademy.in@gmail.com
                        </a>
                      </div>
                      <div className={`${styles.contactItem} ${styles.footerHideOnMobile}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>Mumbai, Maharashtra, India</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Mobile-only: just email */}
                <div className={styles.footerMobileContact}>
                  <a href="mailto:privateacademy.in@gmail.com" className={styles.contactLink}>
                    privateacademy.in@gmail.com
                  </a>
                </div>

                <div className={styles.footerBottom}>
                  <div>Made with ❤️ by <a href="https://www.karangholap.com/" target="_blank" rel="noopener noreferrer" className={styles.footerAuthorLink}>Karan Gholap</a></div>
                  <div>© {new Date().getFullYear()} Private Academy. All rights reserved.</div>
                </div>
              </div>
            </footer>
          </FooterWrapper>
          </ToastProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
