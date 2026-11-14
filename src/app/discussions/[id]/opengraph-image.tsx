import { ImageResponse } from "next/og";
import { getDiscussionThread } from "@/utils/discussionsData";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let title = "Engineering Discussion Topic";
  let branch = "Engineering";
  let university = "Student Community";
  let repliesCount = 0;
  let upvotesCount = 0;
  let author = "Student";

  try {
    const data = await getDiscussionThread(id);
    if (data?.discussion) {
      const d = data.discussion;
      if (d.title) title = d.title;
      if (d.branch) branch = d.branch;
      if (d.university) university = d.university;
      repliesCount = d.replies_count || 0;
      upvotesCount = d.upvotes_count || 0;
      if (d.author?.full_name) author = d.author.full_name;
      else if (d.author?.username) author = `@${d.author.username}`;
    }
  } catch (err) {
    console.error("Error generating OG image for discussion:", err);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#0B0F19",
          backgroundImage: "radial-gradient(circle at 85% 15%, #1E3A8A 0%, transparent 45%), radial-gradient(circle at 15% 85%, #064E3B 0%, transparent 40%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "#2447F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              PA
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#F8FAFC" }}>
                Private Academy
              </span>
              <span style={{ fontSize: "14px", color: "#93C5FD", fontWeight: 500 }}>
                Student Q&amp;A &amp; Discussions
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: "999px",
              backgroundColor: "rgba(36, 71, 245, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              fontSize: "15px",
              fontWeight: 600,
              color: "#93C5FD",
            }}
          >
            {university}
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "1050px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                backgroundColor: "#2447F5",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {branch}
            </span>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#E2E8F0",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {repliesCount} {repliesCount === 1 ? "Peer Answer" : "Peer Answers"}
            </span>
          </div>

          <div
            style={{
              fontSize: title.length > 55 ? "44px" : "54px",
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: "-1.5px",
              color: "#FFFFFF",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "17px",
              color: "#94A3B8",
            }}
          >
            <span>Asked by {author}</span>
            <span style={{ color: "#475569" }}>•</span>
            <span style={{ color: "#E2E8F0", fontWeight: 500 }}>{upvotesCount} Student Upvotes</span>
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#60A5FA",
            }}
          >
            privateacademy.in/discussions
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
