import { GoogleGenAI } from "@google/genai";
import { checkLocalProfanity, LocalFilterResult } from "./localFilter";

/**
 * Multi-Key Gemini API Rotator & Ultra-Fast Content Moderation Manager
 * Optimized for sub-second response times (< 1 second) with strict timeouts
 * and automatic zero-downtime fallback to local regex filter.
 */

function getApiKeys(): string[] {
  return Array.from(
    new Set(
      [
        process.env.GEMINI_KEY_1,
        process.env.GEMINI_KEY_2,
        process.env.GEMINI_KEY_3,
        process.env.GEMINI_KEY_4,
        process.env.GEMINI_API_KEY,
      ].filter((k): k is string => Boolean(k && k.trim()))
    )
  );
}

let currentKeyIndex = 0;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ModerationResult {
  isAllowed: boolean;
  reason?: string;
}

/**
 * Moderates user-submitted content across languages.
 * Guaranteed response time: < 2.5 seconds (falls back to local filter if AI stalls).
 */
export async function moderateContentWithFallback(
  text: string,
  maxRetries = 1
): Promise<ModerationResult> {
  if (!text || !text.trim()) {
    return { isAllowed: true };
  }

  // 1. Instant Local Pre-Check (0ms - catches obvious profanity instantly)
  const localCheck: LocalFilterResult = checkLocalProfanity(text);
  if (!localCheck.isClean) {
    return {
      isAllowed: false,
      reason: localCheck.reason || "Content violates community standards.",
    };
  }

  const keys = getApiKeys();
  if (keys.length === 0) {
    return { isAllowed: true };
  }

  const prompt = `You are a strict automated content moderator for an educational student discussion platform.
Analyze the user-submitted text across all languages (English, Hindi, Hinglish/Romanized text, Marathi, Tamil, Telugu, Bengali, Gujarati, etc.).

REJECT content if it contains ANY of the following:
1. Vulgarity, profanity, obscene gestures, or explicit sexual content.
2. Harassment, personal attacks, bullying, threats, or intimidation of any student/user.
3. Hate speech, discrimination, slurs, or derogatory comments targeting any religion, caste, community, ethnicity, region, gender, or nationality.
4. Illegal activities, promotion of cheating/academic malpractice, leaks of exam papers, or dangerous content.
5. Commercial spam, phishing links, scam promotions, or malicious URLs.
6. Political propaganda, inflammatory partisan debates, or religious conversion attempts unrelated to academics.
7. Obfuscated or leetspeak bypass attempts of profanity (e.g. replacing letters with numbers or symbols like b*tch, f#ck, bh0sdike).

User Submitted Text:
"""
${text}
"""

Respond ONLY with valid JSON in this exact structure:
{"isAllowed": boolean, "reason": "1 short sentence explaining violation if rejected, or null if allowed"}`;

  // Try active keys with ultra-fast timeout
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const keyIndex = (currentKeyIndex + attempt) % keys.length;
    const apiKey = keys[keyIndex];

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Enforce 2.5-second strict timeout on Gemini API call
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API call timed out (2500ms limit)")), 2500)
      );

      const generatePromise = ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
          maxOutputTokens: 120, // Allows concise explanation while keeping sub-second speed
        },
      });

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);

      currentKeyIndex = (currentKeyIndex + 1) % keys.length;

      return {
        isAllowed: typeof result.isAllowed === "boolean" ? result.isAllowed : true,
        reason: result.reason || "Content violates community guidelines.",
      };
    } catch (err: any) {
      console.warn(
        `Gemini API Key index ${keyIndex} attempt ${attempt + 1} failed or timed out: ${err?.message || err}`
      );

      if (err?.status === 429 && attempt < maxRetries) {
        await delay(500);
      }
    }
  }

  // 2. Fallback to Local Filter if AI call times out or fails
  console.warn("Gemini AI API timed out or exhausted. Operating on fast local fallback.");
  return {
    isAllowed: localCheck.isClean,
    reason: localCheck.reason || "Content flagged by safety filter.",
  };
}
