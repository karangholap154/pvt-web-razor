import { Metadata } from "next";
import DiscussionsClient from "./DiscussionsClient";

export const metadata: Metadata = {
  title: "Student Community Discussions & Doubts | Private Academy",
  description:
    "Ask exam doubts, share past year question solutions, and collaborate with university peers on Private Academy.",
};

export default function DiscussionsPage() {
  return <DiscussionsClient />;
}
