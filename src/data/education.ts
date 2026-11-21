import type { Education } from "@/types";

/**
 * Education history, newest first.
 */
export const education: Education[] = [
  {
    id: "upi",
    institution: "Universitas Pendidikan Indonesia",
    degree: "Bachelor's Degree",
    field: "Software Engineering",
    location: "Bandung, Indonesia",
    period: "Aug 2021 – Jan 2025",
    graduationYear: "2025",
    grade: "GPA 3.90 / 4.00",
    summary: "Bachelor's degree in Software Engineering.",
    highlights: [
      "1st place, Turnamen Sains Data Nasional (TSDN) 2024.",
      "Executive Lead of Himpunan Mahasiswa Rekayasa Perangkat Lunak (2023).",
    ],
    coursework: ["Data Structures and Algorithm", "Machine Learning", "Artificial Intelligence"],
  },
  {
    id: "western-exchange",
    institution: "University of Western Ontario",
    degree: "Student Exchange",
    field: "Social Sciences",
    location: "London, Canada",
    period: "Sep 2023 – Dec 2023",
    graduationYear: "2023",
    summary: "One-semester student exchange in the Faculty of Social Sciences.",
    highlights: [],
    coursework: ["Computer Science", "Earth Science", "History", "Sociology"],
  },
];
