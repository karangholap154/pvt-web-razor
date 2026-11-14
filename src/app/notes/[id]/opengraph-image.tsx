import { ImageResponse } from "next/og";
import { createSupabaseServerClient } from "@/utils/supabaseServer";

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

  let title = "Engineering Study Note";
  let branch = "Engineering";
  let semester = "Semester";
  let university = "University Curriculum";
  let author = "Private Academy Contributor";

  try {
    const supabase = await createSupabaseServerClient();
    const { data: item } = await supabase
      .from("notes")
      .select("title, branch, semester, university, users:contributor_id(username, full_name)")
      .eq("id", id)
      .maybeSingle();

    if (item) {
      if (item.title) title = item.title;
      if (item.branch) branch = item.branch;
      if (item.semester) semester = item.semester;
      if (item.university) university = item.university;
      const user = item.users as { username?: string | null; full_name?: string | null } | null;
      if (user?.full_name) author = user.full_name;
      else if (user?.username) author = `@${user.username}`;
    }
  } catch (err) {
    console.error("Error generating OG image for note:", err);
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
          backgroundColor: "#090D1A",
          backgroundImage: "radial-gradient(circle at 90% 10%, #1E3A8A 0%, transparent 45%), radial-gradient(circle at 10% 90%, #172554 0%, transparent 40%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Top Bar: Brand & University */}
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
                fontSize: "22px",
                fontWeight: "bold",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(36, 71, 245, 0.4)",
              }}
            >
              PA
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "#F8FAFC",
              }}
            >
              Private Academy
            </span>
          </div>

          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(36, 71, 245, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#93C5FD",
            }}
          >
            {university}
          </div>
        </div>

        {/* Center: Badges & Title */}
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
              gap: "12px",
            }}
          >
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                backgroundColor: "#2447F5",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.5px",
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
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {semester}
            </span>
          </div>

          <div
            style={{
              fontSize: title.length > 50 ? "46px" : "56px",
              fontWeight: 800,
              lineHeight: 1.15,
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

        {/* Bottom Bar: Contributor attribution & CTA */}
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
              fontSize: "18px",
              color: "#94A3B8",
            }}
          >
            <span>Verified Study Resource</span>
            <span style={{ color: "#475569" }}>•</span>
            <span style={{ color: "#E2E8F0", fontWeight: 500 }}>Shared by {author}</span>
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#60A5FA",
            }}
          >
            privateacademy.in/notes
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
