export interface ParsedUA {
  browser: string;
  os: string;
  device: "Desktop" | "Mobile" | "Tablet" | "Unknown";
}

/**
 * Parses user agent string to extract basic browser name, OS name, and device category.
 * Lightweight, safe to use on server-side Next.js APIs.
 */
export function parseUserAgent(userAgent: string): ParsedUA {
  if (!userAgent) {
    return {
      browser: "Unknown Browser",
      os: "Unknown OS",
      device: "Unknown",
    };
  }

  const ua = userAgent.toLowerCase();

  // Handle server-side requests or specific HTTP client libraries
  if (ua === "node" || ua.includes("node-fetch") || ua.includes("axios") || ua.includes("postman")) {
    return {
      browser: "Server Client",
      os: "Node.js",
      device: "Desktop",
    };
  }

  // 1. Determine Browser
  let browser = "Unknown Browser";
  if (ua.includes("edg/")) {
    browser = "Edge";
  } else if (ua.includes("opr/") || ua.includes("opera")) {
    browser = "Opera";
  } else if (ua.includes("chrome") && !ua.includes("chromium")) {
    browser = "Chrome";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")) {
    browser = "Safari";
  } else if (ua.includes("chromium")) {
    browser = "Chromium";
  }

  // 2. Determine OS
  let os = "Unknown OS";
  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("macintosh") || ua.includes("mac os x")) {
    os = "macOS";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    os = "iOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  }

  // 3. Determine Device Category
  let device: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Desktop";
  if (ua.includes("ipad") || ua.includes("tablet")) {
    device = "Tablet";
  } else if (
    ua.includes("mobile") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    (ua.includes("android") && !ua.includes("tablet"))
  ) {
    device = "Mobile";
  }

  return { browser, os, device };
}
