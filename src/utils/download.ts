/**
 * Utility to download note PDFs via the proxy endpoint safely in browser context.
 */
export async function downloadNotePdf(noteId: string, title: string): Promise<void> {
  if (!noteId) return;

  try {
    const response = await fetch(`/api/proxy-pdf?id=${encodeURIComponent(noteId)}`);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    const cleanFilename = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.download = `${cleanFilename || "study_note"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("PDF download fetch failed, opening in new tab fallback:", err);
    window.open(`/api/proxy-pdf?id=${encodeURIComponent(noteId)}`, "_blank");
  }
}
