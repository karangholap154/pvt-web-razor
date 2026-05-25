import crypto from "crypto";

/**
 * Hashes a password with a salt using PBKDF2.
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

/**
 * Generates a random cryptographic salt.
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Checks if the current session is an admin session.
 */
import { cookies } from "next/headers";

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get("session_email")?.value;
  if (!sessionEmail) return false;

  const adminEmailsStr = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsStr.split(",").map((e) => e.trim().toLowerCase());
  return adminEmails.includes(sessionEmail.trim().toLowerCase());
}

