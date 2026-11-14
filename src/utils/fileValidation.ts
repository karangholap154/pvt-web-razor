import crypto from "crypto";
import { slugify } from "@/utils/text";

/**
 * Validates that a buffer starts with the PDF magic bytes (%PDF- => 0x25 0x50 0x44 0x46).
 */
export function isValidPdfBuffer(buffer: Buffer | Uint8Array): boolean {
  if (!buffer || buffer.length < 4) return false;
  return (
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46    // F
  );
}

/**
 * Generates a clean, unique filename safe for cloud storage buckets.
 */
export function generateSafePdfFileName(originalName: string, prefix?: string): string {
  const baseName = originalName.toLowerCase().endsWith(".pdf")
    ? originalName.substring(0, originalName.length - 4)
    : originalName;
  const cleanBase = slugify(baseName) || "document";
  const timestamp = Math.floor(Date.now() / 1000);
  const rand = crypto.randomBytes(3).toString("hex");

  const fileName = `${cleanBase}-${timestamp}-${rand}.pdf`;
  return prefix ? `${prefix.replace(/\/+$/, "")}/${fileName}` : fileName;
}
