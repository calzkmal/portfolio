import type { Experience } from "@/types";

/**
 * Work experience, newest first.
 */
export const experience: Experience[] = [
  {
    id: "apple-developer-academy",
    company: "Apple Developer Academy @ UC Jakarta",
    role: "iOS Developer Learner",
    period: "Mar 2026 – Present",
    location: "Jakarta, Indonesia",
    type: "Contract",
    summary: "Building iOS applications end to end through challenge-based learning.",
    responsibilities: [
      "Led end-to-end development across 4 challenges, transforming ideas into functional iOS applications.",
      "Developed interactive applications integrating motion sensing, device connectivity and haptic feedback.",
    ],
    achievements: [
      "Reached 100+ TestFlight testers.",
      "Won 3rd place at the Academy-level Very Disco Local Game Jam with StackHouse.",
    ],
    technologies: ["Swift", "iOS", "TestFlight"],
    logoSrc: "/images/organizations/apple-developer-academy.svg",
    highlights: [
      { title: "End-to-end ownership.", text: "Led development across 4 challenges, turning ideas into working iOS applications." },
      { title: "Hardware-aware interaction.", text: "Built apps that use motion sensing, device connectivity and haptic feedback." },
    ],
    result: "Reached 100+ TestFlight testers and won 3rd place at the Very Disco Local Game Jam with StackHouse.",
  },
  {
    id: "senja-solusi",
    company: "PT Senja Solusi",
    role: "Software Automation",
    period: "Nov 2025 – Aug 2026",
    location: "Bandung, Indonesia",
    type: "Contract",
    summary: "Architected and built an AI-powered financial content platform.",
    responsibilities: [
      "Architected an AI-powered financial content platform with 4 production workflows and 20+ AI agents.",
      "Engineered scalable AI workflows with 18+ reusable prompt modules and 10+ quality assurance reviewers.",
      "Optimized LLM token usage across the workflows.",
    ],
    achievements: [
      "Reduced web scraping costs by ~50% through relevance filtering and deduplication.",
    ],
    technologies: ["Python", "n8n", "LLMs", "AI Agents", "Web Scraping", "REST APIs"],
    logoSrc: "/images/organizations/senja-solusi.svg",
    highlights: [
      { title: "Agent architecture.", text: "Designed a financial content platform running 4 production workflows and 20+ AI agents." },
      { title: "Reusable building blocks.", text: "Built 18+ reusable prompt modules and 10+ quality-assurance reviewers to keep the workflows scalable." },
      { title: "Token budget.", text: "Optimized LLM token usage across every workflow." },
    ],
    result: "Cut web scraping costs by about 50% through relevance filtering and deduplication.",
  },
  {
    id: "kalbe-nutritionals",
    company: "Kalbe Nutritionals (PT Sanghiang Perkasa)",
    role: "Business Insight and Data Scientist Intern",
    period: "Mar 2025 – Sep 2025",
    location: "Jakarta, Indonesia",
    type: "Internship",
    summary: "Managed macroeconomic data and built dashboards to support business decisions.",
    responsibilities: [
      "Managed 10+ macroeconomic data categories, ensuring consistency, accuracy and quality.",
      "Automated API-based data collection.",
      "Developed dashboards integrating internal and external data.",
    ],
    achievements: [
      "Reduced data collection processing time to under 1 minute.",
      "Delivered 5+ dashboards to support business decisions.",
    ],
    technologies: ["Python", "REST APIs", "Data Dashboards"],
    logoSrc: "/images/organizations/kalbe-nutritionals.svg",
    highlights: [
      { title: "Data quality.", text: "Kept 10+ macroeconomic data categories consistent and accurate." },
      { title: "Automated collection.", text: "Moved data gathering to automated, API-based collection." },
      { title: "Decision dashboards.", text: "Combined internal and external data into dashboards for the business." },
    ],
    result: "Collection time dropped to under 1 minute, and 5+ dashboards went to the business.",
  },
];
