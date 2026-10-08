import { Note } from "@/data/mockData";

export interface RawNoteRow {
  id: string | number;
  title: string;
  branch: string;
  semester: string;
  download_url?: string | null;
  downloadUrl?: string | null;
  video_url?: string | null;
  videoUrl?: string | null;
  price?: number | string | null;
  university?: string | null;
  subject?: string | null;
  resource_type?: string | null;
  coverage_scope?: string | null;
  is_community_contributed?: boolean | null;
  contributor_id?: string | null;
  contributor_username?: string | null;
  contributor_name?: string | null;
  users?:
    | { username?: string | null; full_name?: string | null }
    | { username?: string | null; full_name?: string | null }[]
    | null;
}

export interface MapNoteOptions {
  /** If true, clears downloadUrl for notes with price > 0 (for public listings) */
  hidePaidDownloadUrl?: boolean;
}

/**
 * Normalizes database rows and API note responses into the standard application Note structure.
 */
export function mapDbRowToNote(
  item: RawNoteRow,
  contributorProfile?: { username?: string | null; full_name?: string | null },
  options?: MapNoteOptions
): Note {
  const userProfile =
    contributorProfile ||
    (Array.isArray(item.users) ? item.users[0] : item.users);

  const price = item.price ? Number(item.price) : 0;
  const rawDownloadUrl = item.download_url || item.downloadUrl || "";
  const finalDownloadUrl =
    options?.hidePaidDownloadUrl && price > 0 ? "" : rawDownloadUrl;

  return {
    id: String(item.id),
    title: item.title,
    branch: item.branch as Note["branch"],
    semester: String(item.semester) as Note["semester"],
    description: `${item.title} - ${item.branch} Engineering, ${item.semester} | ${item.university || ""}`,
    downloadUrl: finalDownloadUrl,
    videoUrl: item.video_url || item.videoUrl || "",
    price,
    university: item.university || undefined,
    subject: item.subject || item.title,
    resource_type:
      item.resource_type ||
      (item.is_community_contributed ? "supplementary_guide" : "official_subject"),
    coverage_scope: item.coverage_scope || null,
    is_community_contributed: item.is_community_contributed,
    contributor_id: item.contributor_id || null,
    contributor_username:
      item.contributor_username ?? userProfile?.username ?? null,
    contributor_name:
      item.contributor_name ?? userProfile?.full_name ?? null,
  };
}
