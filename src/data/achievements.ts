import type { Achievement } from "@/types";

/**
 * Awards, certifications, competitions and more. Order does not matter:
 * items are sorted by `year`. Add certifications here as you earn them.
 */
export const achievements: Achievement[] = [
  {
    id: "very-disco-game-jam",
    category: "Competition",
    title: "3rd Place — Very Disco Local Game Jam",
    organization: "Apple Developer Academy @ UC Jakarta",
    date: "2026",
    year: 2026,
    description: "Won 3rd place at the Academy-level game jam with the StackHouse team.",
  },
  {
    id: "tsdn-2024",
    category: "Competition",
    title: "1st Place — Turnamen Sains Data Nasional (TSDN) 2024",
    organization: "Data Academy",
    date: "2024",
    year: 2024,
    description:
      "Won first place with Hiroop, a respiration audio classifier that predicts five respiratory sound classes from WAV recordings.",
  },
  {
    id: "iisma-alumni-club",
    category: "Organization",
    title: "Record Keeper — IISMA Alumni Club",
    organization: "IISMA Alumni Club",
    date: "Jan 2025 – Dec 2025",
    year: 2025,
    description:
      "Integrated three platforms to streamline data collection and keep records reliable and accessible, and delivered 3+ actionable monthly reports for stakeholders.",
  },
  {
    id: "himarpl",
    category: "Organization",
    title: "Executive Lead — Himpunan Mahasiswa Rekayasa Perangkat Lunak",
    organization: "Universitas Pendidikan Indonesia",
    date: "Jan 2023 – Dec 2023",
    year: 2023,
    description:
      "Led eight departments and coordinated development initiatives for 50+ members, reaching 90% stakeholder satisfaction across 20+ work programs.",
  },
  {
    id: "western-exchange",
    category: "Other",
    title: "Student Exchange — University of Western Ontario",
    organization: "University of Western Ontario",
    date: "Sep 2023 – Dec 2023",
    year: 2023,
    description: "One-semester student exchange in London, Canada, in the Faculty of Social Sciences.",
  },
];
