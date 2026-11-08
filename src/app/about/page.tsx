import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Private Academy Engineering",
  description: "Learn about Private Academy Engineering — a student-first engineering study platform built to provide branch-wise notes, exam preparation guides, and video walkthroughs.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Private Academy Engineering",
    description: "A comprehensive study resource platform built for engineering students across leading universities.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Private Academy Engineering",
    description: "A comprehensive study resource platform built for engineering students across leading universities.",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Private Academy Engineering",
    "description": "A comprehensive study resource platform built for engineering students across leading universities.",
    "url": "https://www.privateacademy.in/about",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Private Academy Engineering",
      "founder": {
        "@type": "Person",
        "name": "Karan Gholap",
        "jobTitle": "Founder & Software Developer",
        "sameAs": [
          "https://linkedin.com/in/karangholap",
          "https://x.com/TheKaranGholap",
          "https://peerlist.io/karangholap",
          "https://www.karangholap.com/"
        ]
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}

