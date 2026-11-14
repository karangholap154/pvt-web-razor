import { cache } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "../../../utils/supabaseServer";
import NoteDetailsClient from "./NoteDetailsClient";
import { Note } from "../../../data/mockData";
import { mapDbRowToNote } from "@/utils/noteMapper";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

const getNote = cache(async (id: string) => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: item } = await supabase
      .from("notes")
      .select("*, users:contributor_id(username, full_name)")
      .eq("id", id)
      .maybeSingle();

    return item;
  } catch (err) {
    console.error("Error fetching note by id:", err);
    return null;
  }
});

export async function generateMetadata({ params }: NotePageProps) {
  const { id } = await params;
  const item = await getNote(id);

  if (!item) {
    return {
      title: "Study Note Not Found | Private Academy",
      description: "The requested engineering study resource could not be found.",
      robots: { index: false },
    };
  }

  const title = `${item.title} | Private Academy Notes`;
  const descText = `${item.title} - ${item.branch} Engineering, ${item.semester} study note ${item.university ? `for ${item.university}` : ""}. Download PDF & watch video explanations.`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const url = `${baseUrl}/notes/${id}`;

  return {
    title,
    description: descText,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: descText,
      url,
      type: "website",
      siteName: "Private Academy",
      images: [{ url: `${baseUrl}/pvtimg.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descText,
      images: [`${baseUrl}/pvtimg.png`],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const item = await getNote(id);

  if (!item) {
    notFound();
  }

  // Format to client Note structure
  const note: Note = mapDbRowToNote(item);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const url = `${baseUrl}/notes/${id}`;
  const isFree = !item.price || Number(item.price) === 0;

  const contributor = item.users as { username?: string | null; full_name?: string | null } | null;
  const authorEntity = contributor?.full_name || contributor?.username
    ? {
        "@type": "Person",
        name: contributor.full_name || contributor.username,
        url: contributor.username ? `${baseUrl}/u/${contributor.username}` : undefined,
      }
    : {
        "@type": "EducationalOrganization",
        name: "Private Academy Engineering",
        url: baseUrl,
      };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        "@id": `${url}#learning-resource`,
        name: item.title,
        description: `${item.title} - ${item.branch} Engineering, ${item.semester} study note ${item.university ? `for ${item.university}` : ""}.`,
        educationalLevel: "Higher Education / Undergraduate Engineering",
        learningResourceType: "Study Note & Lecture Guide",
        inLanguage: "en",
        url,
        dateCreated: item.created_at || undefined,
        thumbnailUrl: `${baseUrl}/pvtimg.png`,
        provider: {
          "@type": "EducationalOrganization",
          name: "Private Academy Engineering",
          url: baseUrl,
          logo: `${baseUrl}/pvtimg.png`,
        },
        author: authorEntity,
        about: [
          { "@type": "Thing", name: item.branch },
          ...(item.subject ? [{ "@type": "Thing", name: item.subject }] : []),
        ],
        educationalAlignment: item.university
          ? {
              "@type": "AlignmentObject",
              alignmentType: "educationalSubject",
              educationalFramework: item.university,
              targetName: `${item.branch} - ${item.semester}`,
            }
          : undefined,
        isAccessibleForFree: isFree,
        ...(!isFree
          ? {
              offers: {
                "@type": "Offer",
                price: Number(item.price),
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url,
                seller: {
                  "@type": "Organization",
                  name: "Private Academy",
                },
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: item.branch ? `${item.branch} Notes` : "Notes",
            item: `${baseUrl}/?branch=${encodeURIComponent(item.branch || "")}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: item.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoteDetailsClient note={note} />
    </>
  );
}
