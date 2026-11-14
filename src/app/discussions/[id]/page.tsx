import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDiscussionThread } from "@/utils/discussionsData";
import DiscussionThreadClient from "./DiscussionThreadClient";

interface DiscussionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DiscussionPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getDiscussionThread(id);

  if (!data || !data.discussion) {
    return {
      title: "Discussion Topic Not Found | Private Academy",
      description: "The requested engineering doubt or discussion topic could not be found.",
      robots: { index: false },
    };
  }

  const { discussion } = data;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const url = `${baseUrl}/discussions/${id}`;
  const title = `${discussion.title} | Private Academy Discussions`;
  const cleanContent = discussion.content.replace(/\s+/g, " ").trim();
  const descText = cleanContent.length > 155
    ? `${cleanContent.slice(0, 155)}...`
    : cleanContent || `Discussion about ${discussion.branch || "engineering"} - ${discussion.university || "Private Academy"}.`;

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
      type: "article",
      siteName: "Private Academy Discussions",
      images: [
        {
          url: `${baseUrl}/pvtimg.png`,
          width: 1200,
          height: 630,
          alt: discussion.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descText,
      images: [`${baseUrl}/pvtimg.png`],
    },
  };
}

export default async function DiscussionThreadPage({ params }: DiscussionPageProps) {
  const { id } = await params;
  const data = await getDiscussionThread(id);

  if (!data || !data.discussion) {
    notFound();
  }

  const { discussion, replies } = data;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.privateacademy.in";
  const url = `${baseUrl}/discussions/${id}`;

  const authorName = discussion.author?.full_name || discussion.author?.username || "Student";
  const authorUrl = discussion.author?.username ? `${baseUrl}/u/${discussion.author.username}` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DiscussionForumPosting",
        "@id": `${url}#discussion`,
        headline: discussion.title,
        articleBody: discussion.content,
        datePublished: discussion.created_at,
        url,
        inLanguage: "en",
        author: {
          "@type": "Person",
          name: authorName,
          url: authorUrl,
        },
        publisher: {
          "@type": "EducationalOrganization",
          name: "Private Academy Engineering",
          url: baseUrl,
          logo: `${baseUrl}/pvtimg.png`,
        },
        about: [
          ...(discussion.university ? [{ "@type": "Thing", name: discussion.university }] : []),
          ...(discussion.branch ? [{ "@type": "Thing", name: discussion.branch }] : []),
          ...(discussion.tags ? discussion.tags.map((t) => ({ "@type": "Thing", name: t })) : []),
        ],
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/CommentAction",
            userInteractionCount: discussion.replies_count || replies.length,
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: discussion.upvotes_count || 0,
          },
        ],
        comment: replies.map((r) => ({
          "@type": "Comment",
          "@id": `${url}#reply-${r.id}`,
          text: r.content,
          datePublished: r.created_at,
          upvoteCount: r.upvotes_count || 0,
          author: {
            "@type": "Person",
            name: r.author?.full_name || r.author?.username || "Student",
            url: r.author?.username ? `${baseUrl}/u/${r.author.username}` : undefined,
          },
        })),
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
            name: "Discussions",
            item: `${baseUrl}/discussions`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: discussion.title,
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
      <DiscussionThreadClient
        initialDiscussion={discussion}
        initialReplies={replies}
      />
    </>
  );
}
