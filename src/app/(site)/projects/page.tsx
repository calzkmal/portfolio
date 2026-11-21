import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";
import { SectionHead } from "@/components/home/Entry";
import { ProjectArt, artBackground } from "@/components/home/ProjectArt";
import { ScrollReveal } from "@/components/home/ScrollReveal";

export const metadata: Metadata = {
  title: "Works",
  alternates: { canonical: "/projects" },
};

/** Every project, newest first, each opening its case study. */
export default function WorksPage() {
  const works = [...projects].sort((a, b) => Number(b.year) - Number(a.year));
  return (
    <section className="works-index">
      <div className="home-col">
        <SectionHead title="Works" subtitle="Selected Projects" />
        <ul className="works-list">
          {works.map((p, n) => (
            <li key={p.slug} data-reveal data-reveal-delay={(0.05 * n).toFixed(2)}>
              <Link href={`/projects/${p.slug}`}>
                <span className="works-art" style={{ background: artBackground[p.slug] ?? "#f1efec" }} aria-hidden="true">
                  <ProjectArt slug={p.slug} title={p.title} />
                </span>
                <span className="works-copy">
                  <strong>{p.title.split(" — ")[0]}</strong>
                  <span className="meta">
                    {p.category} · {p.year}
                  </span>
                  <span className="sum">{p.summary}</span>
                </span>
                <span className="works-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ScrollReveal />
    </section>
  );
}
