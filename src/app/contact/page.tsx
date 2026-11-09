import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Private Academy Engineering",
  description: "Get in touch with Private Academy Engineering. Request specific study notes, report issues, suggest improvements, or join our community groups.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Private Academy Engineering",
    description: "Get in touch with Private Academy Engineering. Request specific study notes, report issues, suggest improvements, or join our community groups.",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Private Academy Engineering",
    description: "Get in touch with Private Academy Engineering.",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Private Academy Engineering",
    "description": "Support for engineering students across all academic queries and study material needs.",
    "url": "https://www.privateacademy.in/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Private Academy Engineering",
      "email": "info@privateacademy.in",
      "location": {
        "@type": "Place",
        "name": "Maharashtra, India"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
