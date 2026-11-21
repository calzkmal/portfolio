import type { Project } from "@/types";

/**
 * Portfolio projects, based on the "Projects" section of the CV.
 *
 * To add a project: copy one entry and change the `slug` (it becomes the URL:
 * /projects/<slug>). Images live in /public/images/projects/<folder>/.
 * Add real screenshots to `gallery` (recommended 1600×1000). Sections whose
 * list is empty (problem, features, outcomes…) are hidden on the detail page.
 */

const cover = (folder: string) => `/images/projects/${folder}/cover.svg`;

/** Every project, including archived ones. Use `projects` below for anything shown on the site. */
export const allProjects: Project[] = [
  {
    slug: "seagis",
    featured: true,
    title: "Seagis iOS App",
    category: "Data Engineering",
    year: "2026",
    summary:
      "An environmental data pipeline for an iOS app that integrates IoT temperature readings with regional data, with data contracts and quality checks for traceable, hourly alignment.",
    overview:
      "Seagis is an iOS app backed by an environmental data pipeline. As Data Orchestrator, I built the pipeline that brings IoT temperature readings and regional data together, and used Spec-Driven Development to define the implementation scope and testable requirements.",
    thumbnail: cover("seagis"),
    thumbnailAlt: "Seagis iOS App project cover",
    gallery: [],
    technologies: ["Swift", "Python", "PostgreSQL", "Supabase", "GitHub", "Spec-Driven Development"],
    role: "Data Orchestrator",
    duration: "Oct 2026 – Present",
    problem: [],
    objectives: [
      "Integrate IoT temperature readings with regional data.",
      "Keep data traceable and aligned on an hourly basis.",
      "Define a clear implementation scope with testable requirements.",
    ],
    solution: [
      "I built an environmental data pipeline that integrates IoT temperature readings and regional data, and designed data contracts and quality checks so the data stays traceable and aligned hour by hour.",
      "I applied Spec-Driven Development (SDD) to define the implementation scope and testable requirements.",
    ],
    features: [
      { title: "IoT + regional data", description: "Temperature readings from IoT devices joined with regional data." },
      { title: "Data contracts", description: "Defined contracts describe what each data source must provide." },
      { title: "Quality checks", description: "Checks keep the data traceable and aligned hour by hour." },
    ],
    contributions: [
      "Built the environmental data pipeline.",
      "Designed the data contracts and quality checks.",
      "Applied Spec-Driven Development to scope the implementation and its requirements.",
    ],
    outcomes: [],
  },
  {
    slug: "hiroop",
    featured: true,
    title: "Hiroop — Respiration Audio Classifier",
    category: "Machine Learning",
    year: "2024",
    summary:
      "A Flask API that processes WAV recordings and predicts five respiratory sound classes. Won 1st place at Turnamen Sains Data Nasional (TSDN) 2024.",
    overview:
      "Hiroop classifies respiratory sounds from audio recordings. I built the audio feature extraction pipeline and the Flask API that serves the model's predictions. The project won first place at Turnamen Sains Data Nasional (TSDN) 2024.",
    thumbnail: cover("hiroop"),
    thumbnailAlt: "Hiroop respiration audio classifier project cover",
    gallery: [],
    technologies: ["Python", "Flask", "TensorFlow", "Keras", "Librosa", "NumPy", "REST API"],
    role: "Machine Learning Engineer",
    duration: "Nov 2024 – Dec 2024",
    problem: [],
    objectives: [
      "Classify WAV recordings into five respiratory sound classes.",
      "Serve predictions through a REST API.",
    ],
    solution: [
      "I developed an audio feature extraction pipeline using MFCC, Mel spectrograms and chroma features, and trained the classifier with TensorFlow and Keras.",
      "A Flask API accepts WAV recordings, runs them through the pipeline and returns a prediction across the five classes.",
    ],
    features: [
      { title: "Audio feature extraction", description: "MFCC, Mel spectrogram and chroma features extracted with Librosa." },
      { title: "Five-class prediction", description: "Each recording is classified into one of five respiratory sound classes." },
      { title: "REST API", description: "A Flask endpoint takes a WAV file and returns the prediction." },
    ],
    contributions: [
      "Built the audio feature extraction pipeline.",
      "Built the Flask API that processes recordings and returns predictions.",
    ],
    outcomes: [
      { value: "1st", label: "Place at TSDN 2024" },
      { value: "5", label: "Respiratory sound classes" },
    ],
    outcomeSummary: "Hiroop won first place at Turnamen Sains Data Nasional (TSDN) 2024, organized by Data Academy.",
  },
  {
    slug: "emodu",
    featured: true,
    title: "Emodu — LLM Fine-Tuning for Affective Text Generation",
    category: "AI Engineering",
    year: "2025",
    summary:
      "Llama 3.2 1B fine-tuned with LoRA to generate emotion-aware motivational text for students, improving BERTScore F1 from 0.6878 to 0.7238 over the base model.",
    overview:
      "Emodu generates motivational text for students that responds to how they feel. I fine-tuned Llama 3.2 1B with LoRA and evaluated it against the base model.",
    thumbnail: cover("emodu"),
    thumbnailAlt: "Emodu LLM fine-tuning project cover",
    gallery: [],
    technologies: [
      "Python",
      "Llama 3.2 1B",
      "Unsloth",
      "PEFT/LoRA",
      "Ollama",
      "FastAPI",
      "Hugging Face",
      "ROUGE",
      "BERTScore",
    ],
    role: "AI Engineer",
    duration: "Dec 2024 – Jan 2025",
    problem: [],
    objectives: [
      "Generate emotion-aware motivational text for students.",
      "Measure the improvement over the base model.",
    ],
    solution: [
      "I fine-tuned Llama 3.2 1B with LoRA (PEFT, Unsloth) and evaluated it with ROUGE and BERTScore on 112 test examples.",
    ],
    features: [
      { title: "LoRA fine-tuning", description: "Parameter-efficient fine-tuning of Llama 3.2 1B." },
      { title: "Affective generation", description: "Motivational text that takes the student's emotion into account." },
      { title: "Evaluation", description: "Compared against the base model with ROUGE and BERTScore." },
    ],
    contributions: [
      "Fine-tuned Llama 3.2 1B using LoRA.",
      "Evaluated the model against the base model on 112 test examples.",
    ],
    outcomes: [
      { value: "0.7238", label: "BERTScore F1 (base model: 0.6878)" },
      { value: "112", label: "Test examples evaluated" },
    ],
    outcomeSummary: "The fine-tuned model improved BERTScore F1 from 0.6878 to 0.7238 compared with the base model.",
  },
];

/** Projects shown on the site. Set `archived: true` on an entry to hide it everywhere. */
export const projects: Project[] = allProjects.filter((p) => !p.archived);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { previous: Project; next: Project } | null {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
