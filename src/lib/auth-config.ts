// Central auth redirect configuration
// Supports GitHub Pages, Capacitor mobile, and local dev

const GITHUB_PAGES_URL = "https://credomandlhazi.github.io/snk_rewards/";

/**
 * Determines the correct redirect URL based on the current platform
 */
export const getRedirectUrl = (path: string = ""): string => {
  const origin = window.location.origin;
  
  // Capacitor app
  if (origin.includes("capacitor://") || origin.includes("localhost")) {
    return `${origin}${path}`;
  }
  
  // GitHub Pages
  if (origin.includes("github.io")) {
    return `${GITHUB_PAGES_URL}${path}`;
  }
  
  // Lovable preview / production
  return `${origin}${path}`;
};

export const SITE_URL = GITHUB_PAGES_URL;
