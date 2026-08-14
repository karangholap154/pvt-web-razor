/**
 * Local Profanity & Hate Speech Filter (Zero API Dependency)
 * Serves as an instant 0ms pre-check and zero-downtime fallback
 * when Gemini API keys are unconfigured, rate-limited, or offline.
 */

// Regex patterns for vulgarity, severe slurs, and abusive terms (English & Hinglish)
const PROFANITY_PATTERNS: RegExp[] = [
  // English vulgarity & abuse
  /\b(fuck|fucker|fucking|bitch|bastard|asshole|motherfucker|cunt|dick|pussy|whore|slut|bullshit)\b/i,
  
  // Hinglish / Transliterated Hindi & Marathi slurs & vulgarity
  /\b(bhosdike|bhosdi|bhosdika|madarchod|bhenchod|behenchod|gand|gaand|gandu|gandmarike|chutiya|chutiye|chut|chutiyapa|randi|mc|bc|bkl|bsdk|harami|harambzada|bhadwa|bhadwe|kutta|saala|kamina|lauda|laude|lodu|chaddar|bhenke|terimaa|gaali|chutmarike)\b/i,

  // Common obfuscation (e.g., f*ck, b*tch, b**shodike, b.c, m.c)
  /\b(f[*@!$]ck|b[*@!$]tch|m[*@!$]darchod|bh[*@!$]sdike|bh[*@!$]nchod|g[*@!$]ndu)\b/i,

  // Severe religious hate speech & community targeting keywords
  /\b(terrorist|katla|mulla|jihadi|conversion|sanghi|libtard|katuya|ricebag|mulle|nazi|infidel|kafir)\b/i,
];

// Common phrases indicating religious/community targeting or hate speech
const HATE_SPEECH_PATTERNS: RegExp[] = [
  /(kill|destroy|hate|attack|kick|remove|ban)\s+(all|these|those)\s+(hindus|muslims|christians|sikhs|jains|buddhists|islam|hinduism|christianity)/i,
  /(hindus|muslims|christians|sikhs)\s+(are|should be)\s+(killed|destroyed|targeted|banned|removed|hated)/i,
  /(anti[- ]hindu|anti[- ]muslim|anti[- ]christian|anti[- ]sikh|anti[- ]national|deshdrohi)/i,
  /(dharma|religion|mazhab)\s+ko\s+(khatam|gali|tabah)/i,
];

export interface LocalFilterResult {
  isClean: boolean;
  reason?: string;
}

/**
 * Checks text against local profanity, abuse, and religious hate speech patterns.
 */
export function checkLocalProfanity(text: string): LocalFilterResult {
  if (!text || !text.trim()) {
    return { isClean: true };
  }

  const normalized = text.toLowerCase().trim();

  // Check profanity patterns
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isClean: false,
        reason: "Content contains inappropriate or offensive language.",
      };
    }
  }

  // Check religious hate speech patterns
  for (const pattern of HATE_SPEECH_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isClean: false,
        reason: "Content violates community standards regarding religious or hate speech.",
      };
    }
  }

  return { isClean: true };
}
