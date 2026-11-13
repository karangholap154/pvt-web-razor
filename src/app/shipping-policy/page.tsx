import React from "react";
import type { Metadata } from "next";
import styles from "@/components/legal/legal.module.css";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Private Academy Engineering",
  description: "Read the Shipping and Delivery Policy for digital study note deliveries and instant access unlocks on Private Academy Engineering.",
  alternates: {
    canonical: "/shipping-policy",
  },
  openGraph: {
    title: "Shipping & Delivery Policy | Private Academy Engineering",
    description: "Read the Shipping and Delivery Policy for digital study note deliveries on Private Academy Engineering.",
    url: "/shipping-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Delivery Policy | Private Academy Engineering",
    description: "Read the Shipping and Delivery Policy for digital study note deliveries on Private Academy Engineering.",
  },
};

const TOC = [
  { id: "digital-fulfillment", label: "Electronic Access & Fulfillment", num: "01" },
  { id: "delivery-timeline", label: "Instant Delivery Timelines", num: "02" },
  { id: "shipping-charges", label: "Zero Shipping & Handling Fees", num: "03" },
  { id: "access-issues", label: "Delivery Troubleshooting & Support", num: "04" },
];

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Shipping & Delivery Policy"
      lastUpdated="AUGUST 18, 2026"
      documentSpec="FULFILLMENT_TERMS_SPEC_04"
      summaryTitle="Digital Delivery Overview"
      summaryContent={
        <p style={{ margin: 0 }}>
          All study materials, engineering question banks, and project blueprints available on <strong>Private Academy Engineering</strong> are 100% digital. No physical goods or paper hardcopies are shipped or delivered to your postal address.
        </p>
      }
      toc={TOC}
      currentRoute="/shipping-policy"
    >
      {/* Section 1 */}
      <section id="digital-fulfillment" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>01.</span> Electronic Access &amp; Delivery Method
        </h2>
        <p>
          Private Academy Engineering operates exclusively as a digital educational resource platform:
        </p>
        <ul>
          <li><strong>Digital Files</strong>: All notes, exam guides, subject modules, and study packages are provided as downloadable digital Portable Document Format (PDF) files or viewable web documents.</li>
          <li><strong>Fulfillment Channel</strong>: Upon completing a successful transaction through our official payment gateway (Razorpay), document unlocks are tied immediately to your authenticated user account profile.</li>
          <li><strong>Access Portals</strong>: You can access and download your unlocked materials directly through the platform dashboard or note view page while logged into your registered profile.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section id="delivery-timeline" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>02.</span> Delivery Timelines
        </h2>
        <p>
          We prioritize instantaneous access so engineering students can start studying immediately:
        </p>
        <ul>
          <li><strong>Instant Delivery</strong>: Under normal server operating conditions, delivery occurs <strong>instantly (within seconds)</strong> upon payment authorization webhook confirmation from Razorpay.</li>
          <li><strong>Maximum Fulfillment SLA</strong>: In rare cases of database sync delays or network latencies, access confirmation will complete within a maximum of <strong>24 hours</strong>.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="shipping-charges" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>03.</span> Shipping &amp; Handling Fees
        </h2>
        <p>
          Because our services involve zero physical dispatch:
        </p>
        <ul>
          <li><strong>No Shipping Charges</strong>: There are <strong>₹0 (Zero) shipping, courier, or delivery fees</strong> associated with any product or digital unlock on Private Academy Engineering.</li>
          <li><strong>No Physical Products</strong>: We do not offer physical textbooks, printed spiral notes, or hardware flash drives. Please do not provide physical mailing addresses expectantly for postal delivery.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="access-issues" className={styles.legalSection}>
        <h2>
          <span className={styles.sectionNum}>04.</span> Delivery Troubleshooting &amp; Support
        </h2>
        <p>
          If you encounter any issues receiving your digital files after a successful payment:
        </p>
        <ul>
          <li>Ensure you are logged into the exact account profile email used during checkout.</li>
          <li>Refresh your browser session or clear your session cache.</li>
          <li>If access is still locked after payment deduction, please email our support team at <a href="mailto:info@privateacademy.in" style={{ color: "var(--blue-500, #2447F5)", fontWeight: 600 }}>info@privateacademy.in</a> with your Payment ID. We will manually verify the payment webhook and grant document permissions within <strong>12 to 24 hours</strong>.</li>
        </ul>
      </section>
    </LegalLayout>
  );
}
