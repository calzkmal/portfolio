/**
 * Home page copy shared with the link-preview image (src/app/opengraph-image.tsx),
 * so the preview always shows what the page shows.
 */

/** The name shown on the page (the full legal name stays in profile.name). */
export const displayName = "Calzy Indyramdhani";

export const focusAreas = [
  "AI/ML Engineer",
  "Data Engineer",
  "Software Automation",
  "iOS Development",
  "Game Development",
  "Product Research",
];

/** Project detail links grouped by the entry that gives them context on the home page. */
export const entryProjects: Partial<Record<string, string[]>> = {
  "apple-developer-academy": ["seagis"],
  upi: ["emodu", "hiroop"],
};
