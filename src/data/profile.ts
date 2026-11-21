import type { Profile } from "@/types";

/**
 * Personal details, based on the CV in /public/resume.pdf.
 */
export const profile: Profile = {
  name: "Calzy Akmal Indyramdhani",
  initials: "C",
  title: "Software Engineer — AI Automation & Data",
  tagline: "I turn complex ideas into practical solution through comprehensive research.",
  intro:
    "Software Engineering graduate with experience building AI-powered automation, data pipelines and LLM applications. Skilled in Python, n8n and API integration.",
  about: [
    "I build AI-powered automation, data pipelines and LLM applications, with a focus on turning complex workflows into practical solutions.",
    "I've architected an AI-powered financial content platform with production workflows and 20+ AI agents, automated API-based data collection and dashboards during my data science internship, fine-tuned LLMs with LoRA, and I'm currently building iOS apps at the Apple Developer Academy @ UC Jakarta.",
  ],
  location: "Bandung, Indonesia",
  avatar: "/images/avatar.jpeg",
  avatarAlt: "Portrait of Calzy Akmal Indyramdhani",
  resume: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/calzkmal", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/calzkmal", icon: "linkedin" },
    { label: "Email", href: "mailto:calzkmal@gmail.com", icon: "mail" },
  ],
  stats: [
    { value: "20+", label: "AI agents in production workflows" },
    { value: "~50%", label: "Web scraping cost reduction" },
    { value: "100+", label: "TestFlight testers reached" },
  ],
  skills: [
    {
      group: "AI & Machine Learning",
      items: ["LLM Fine-Tuning", "LoRA", "TensorFlow", "Keras"],
    },
    {
      group: "Automation & APIs",
      items: ["n8n", "FastAPI", "Flask", "REST APIs"],
    },
    {
      group: "Programming",
      items: ["Python", "Swift", "SQL"],
    },
    {
      group: "Data & Platforms",
      items: ["PostgreSQL", "Supabase", "Git", "Spec-Driven Development"],
    },
    {
      group: "Languages",
      items: ["Indonesian (Native)", "English (Professional Proficiency)"],
    },
  ],
};
