import { Metadata } from "next";
import DiscussionsClient from "./DiscussionsClient";
import { getInitialDiscussions } from "@/utils/discussionsData";

export const revalidate = 60; // ISR cache every 60 seconds

export const metadata: Metadata = {
  title: "Student Community Discussions & Doubts | Private Academy",
  description:
    "Ask exam doubts, share past year question solutions, and collaborate with university peers on Private Academy.",
  alternates: {
    canonical: "/discussions",
  },
  openGraph: {
    title: "Student Community Discussions & Doubts | Private Academy",
    description:
      "Ask exam doubts, share past year question solutions, and collaborate with university peers on Private Academy.",
    url: "/discussions",
  },
};

export default async function DiscussionsPage() {
  const { discussions, totalPages } = await getInitialDiscussions();

  return (
    <DiscussionsClient
      initialDiscussions={discussions}
      initialTotalPages={totalPages}
    />
  );
}
