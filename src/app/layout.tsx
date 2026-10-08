import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

// Inter loaded via next/font — self-hosted, zero FOUT, no blocking network request
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


import Footer from "@/components/layout/Footer";


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
    other: {
      "msvalidate.01": "371830F3B362C11D41A8C0409EE7E41B",
    },
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
        "description": "Comprehensive engineering study resource platform built for students across Mumbai University, SPPU, DBATU, and leading technical universities.",
        "founder": {
          "@type": "Person",
          "name": "Karan Gholap",
          "url": "https://www.karangholap.com/"
        },
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
        "description": "Syllabus-aligned engineering study notes, semester question guides, project source code, and video tutorials.",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Articles",
            "item": `${siteUrl}/articles`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Projects",
            "item": `${siteUrl}/projects`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Discussions",
            "item": `${siteUrl}/discussions`
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={inter.className}>
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
            <Footer />
          </FooterWrapper>

          </ToastProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
