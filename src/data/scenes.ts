import type { Step } from "@/components/ui/StepList";
import { education } from "./education";
import { experience } from "./experience";

/**
 * Copy and figures for the home page scenes.
 *
 * Every number here comes from the CV (public/resume.pdf). Each one carries a
 * comment naming its source so the visuals can never drift from the facts.
 */

export const hero = {
  // Paraphrase of the CV summary: "turning complex workflows into practical solutions".
  statement: "I turn complex workflows into systems that run on their own.",
  // First line of the CV work history (Apple Developer Academy @ UC Jakarta, Mar 2026 – Present).
  now: `${experience[0].role}, ${experience[0].company}`,
};

/** Scene 1: one production system, told as its real sequence of stages. */
export const method = {
  company: experience.find((e) => e.id === "senja-solusi")!,
  headline: ["Four workflows, twenty-plus agents,", "and half the scraping bill."],
  intro:
    "At PT Senja Solusi I architected an AI-powered financial content platform. This is how its production workflows are put together.",
  /**
   * Stage names are an interpretation of the CV bullets for PT Senja Solusi;
   * every figure is quoted from them.
   */
  steps: [
    {
      title: "Collect",
      detail: "Web scraping brings in the source material the platform writes about.",
    },
    {
      title: "Filter",
      // CV: "Reduced web scraping costs by ~50% through relevance filtering and deduplication"
      detail: "Relevance filtering and deduplication drop what isn't needed, cutting web scraping costs by about 50%.",
    },
    {
      title: "Generate",
      // CV: "4 production workflows and 20+ AI agents", "18+ reusable prompt modules", "optimizing LLM token usage"
      detail: "Four production workflows run 20+ AI agents built from 18+ reusable prompt modules, with LLM token usage kept in check.",
    },
    {
      title: "Review",
      // CV: "10+ quality assurance reviewers"
      detail: "More than 10 quality assurance reviewers check the output.",
    },
  ] satisfies Step[],
  /** CV: "Reduced web scraping costs by ~50%". */
  scrapingCostCut: 50,
};

/** Scene 2: which field state illustrates each project (see src/components/field/targets.ts). */
export const projectField: Record<string, { state: FieldState; caption: string }> = {
  seagis: {
    state: "seagis",
    caption: "IoT readings and regional data aligned hour by hour",
  },
  hiroop: {
    state: "hiroop-classes",
    // CV: "predictions across five respiratory sound classes"
    caption: "Audio features separated into five respiratory sound classes",
  },
  emodu: {
    state: "emodu",
    // CV: "Evaluated the model on 112 test examples, improving BERTScore F1 from 0.6878 to 0.7238"
    caption: "112 evaluation examples; BERTScore F1 0.6878 to 0.7238",
  },
};

/** Scene 3: experience and education as one chronological sequence (oldest first). */
export interface TrajectoryEntry {
  id: string;
  kind: "Work" | "Study";
  title: string;
  place: string;
  period: string;
  href: string;
  current: boolean;
}

function startYear(period: string) {
  const match = period.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function startMonth(period: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months.findIndex((name) => period.startsWith(name));
  return m === -1 ? 0 : m;
}

export const trajectory: TrajectoryEntry[] = [
  ...experience.map((e) => ({
    id: e.id,
    kind: "Work" as const,
    title: e.role,
    place: e.company,
    period: e.period,
    href: `/experience#${e.id}`,
    current: /present/i.test(e.period),
  })),
  ...education.map((e) => ({
    id: e.id,
    kind: "Study" as const,
    title: `${e.degree}, ${e.field}`,
    place: e.institution,
    period: e.period,
    href: `/education#${e.id}`,
    current: false,
  })),
].sort(
  (a, b) => startYear(a.period) - startYear(b.period) || startMonth(a.period) - startMonth(b.period),
);

export const contact = {
  headline: ["Working on something that", "should run itself? Let's talk."],
};

/** Names of the 3D field's target layouts. Order matters: it is the scroll order. */
export const FIELD_STATES = [
  "arrival",
  "pipeline",
  "seagis",
  "hiroop",
  "hiroop-classes",
  "emodu",
  "trajectory",
  "contact",
] as const;
export type FieldState = (typeof FIELD_STATES)[number];
