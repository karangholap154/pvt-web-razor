import type { Metadata } from "next";
import ContributeClient from "./ContributeClient";

export const metadata: Metadata = {
  title: "Contribute Engineering Notes & Earn | Private Academy",
  description: "Upload your university study notes, earn up to 90% revenue share with direct UPI payouts, and build your verified contributor profile on Private Academy.",
  alternates: {
    canonical: "/contribute",
  },
  openGraph: {
    title: "Contribute Engineering Notes & Earn | Private Academy",
    description: "Upload your university study notes, earn up to 90% revenue share with direct UPI payouts, and build your verified contributor profile.",
    url: "/contribute",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contribute Engineering Notes & Earn | Private Academy",
    description: "Monetize your university notes and earn up to 90% revenue share with direct UPI payouts.",
  },
};

export default function ContributePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contribution Service Program",
    "description": "Monetize your engineering study notes and earn passive income with up to 90% revenue share.",
    "url": "https://www.privateacademy.in/contribute",
    "publisher": {
      "@type": "Organization",
      "name": "Private Academy Engineering",
      "logo": "https://www.privateacademy.in/pvtimg.png"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContributeClient />
    </>
  );
}
