/**
 * Site-wide configuration: pages for the sitemap and SEO defaults.
 * Personal details live in `profile.ts`.
 */

export const siteConfig = {
  /** Site title everywhere: browser tab, link previews ("Page | Calzy Portfolio" on inner pages). */
  siteName: "Calzy Portfolio",
  keywords: [
    "portfolio",
    "Calzy Akmal Indyramdhani",
    "software engineer",
    "AI automation",
    "LLM",
    "data pipeline",
    "machine learning",
    "n8n",
    "Python",
    "iOS developer",
  ],
  /**
   * Canonical URL. Set NEXT_PUBLIC_SITE_URL on your host (see .env.example).
   * Falls back to the Vercel production URL, then localhost.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
};

export interface NavItem {
  label: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/projects" },
];
