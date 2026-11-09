import type { Metadata } from "next";
import CareersClient, { JobRole } from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers & Internships | Private Academy",
  description: "Join the Private Academy Engineering team! Explore remote internships for Content Creators, Educational Specialists, and Marketing Interns.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers & Internships | Private Academy",
    description: "Join the Private Academy Engineering team! Remote internships with competitive stipends.",
    url: "/careers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers & Internships | Private Academy",
    description: "Join the Private Academy Engineering team! Remote internships with competitive stipends.",
  },
};

const jobOpenings: JobRole[] = [
  {
    id: 1,
    title: "Content Creator & Educational Specialist",
    badge: "Featured",
    department: "Content",
    type: "Internship",
    location: "Remote",
    experience: "0-1 years",
    salary: "₹5k–₹7k/mo",
    description: "Create high-quality educational content, semester summaries, and study materials for engineering students across state universities.",
    requirements: [
      "Engineering degree in progress or completed (Computer/IT/AIML/AIDS preferred)",
      "Strong command of university syllabus patterns and diagram explanations",
      "Experience in technical content writing, peer tutoring, or student documentation",
      "Knowledge of Mumbai University, SPPU, or DBATU engineering curricula",
      "Basic diagramming or markdown formatting skills",
    ],
    responsibilities: [
      "Curate and review high-yield semester study notes and formula cheatsheets",
      "Develop chapter walkthroughs and past year question paper solutions",
      "Review and verify student contributor submissions for academic accuracy",
      "Collaborate with faculty and subject matter student contributors",
      "Ensure consistent note legibility, diagram clarity, and syllabus alignment",
    ],
    benefits: [
      "Direct positive impact on 50,000+ engineering students during finals",
      "100% remote flexible hours calibrated around your college timetable",
      "Competitive monthly stipend with milestone completion incentives",
      "Official Letter of Recommendation (LOR) & verified LinkedIn credential",
      "Fast-track consideration for core engineering coordinator positions",
    ],
  },
  {
    id: 2,
    title: "Marketing & Community Intern",
    department: "Marketing",
    type: "Internship",
    location: "Remote",
    experience: "0-1 years",
    salary: "₹5k–₹7k/mo",
    description: "Help expand our student community hubs and coordinate college campus representative networks across Maharashtra universities.",
    requirements: [
      "Currently pursuing an engineering or management degree",
      "Active presence in college engineering WhatsApp groups and Discord/Telegram channels",
      "Creative thinking and social storytelling capabilities",
      "Excellent written communication and outreach skills",
      "Self-driven approach to community engagement and student growth",
    ],
    responsibilities: [
      "Manage academic announcements across WhatsApp and Telegram channels",
      "Coordinate university-wise study groups during pre-exam crunch weeks",
      "Design engaging academic updates and syllabus revision schedules",
      "Analyze student engagement metrics to identify in-demand branch notes",
      "Support campus ambassador initiatives across engineering colleges",
    ],
    benefits: [
      "Hands-on growth marketing and community management experience",
      "1-on-1 mentorship with platform founders and senior engineers",
      "Flexible schedule that respects college submissions and practicals",
      "Competitive monthly stipend and campus representation incentives",
      "Official internship certificate and recommendation letter",
    ],
  },
];

export default function CareersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Active Careers & Internships at Private Academy",
    "itemListElement": jobOpenings.map((job, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "employmentType": "INTERN",
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Private Academy Engineering",
          "logo": "https://www.privateacademy.in/pvtimg.png",
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Maharashtra",
            "addressCountry": "IN",
          },
        },
        "applicantLocationRequirements": {
          "@type": "Country",
          "name": "India",
        },
        "jobLocationType": "TELECOMMUTE",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CareersClient jobOpenings={jobOpenings} />
    </>
  );
}
