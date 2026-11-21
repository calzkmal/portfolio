import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { Parallax } from "@/components/home/Parallax";
import { ProjectArt, artBackground } from "@/components/home/ProjectArt";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { BackLink } from "@/components/page/BackLink";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every project at build time. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = `${siteConfig.url}/projects/${project.slug}`;
  return {
    title: project.title,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { type: "article", url, title: project.title },
    twitter: { title: project.title },
  };
}

/** One numbered chapter of the case study: label on the left, content on the right. */
function Chapter({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="case-chapter">
      <h2 data-reveal>
        <em>{String(n).padStart(2, "0")}</em> {title}
      </h2>
      <div className="case-chapter-body" data-reveal data-reveal-delay="0.08">
        {children}
      </div>
    </section>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ol className="home-points case-points">
      {items.map((item, i) => (
        <li key={item}>
          <em>#{i + 1}</em> {item}
        </li>
      ))}
    </ol>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const [name, subtitle] = project.title.split(" — ");
  const facts = [
    { label: "Role", value: project.role },
    { label: "Period", value: project.duration },
    { label: "Year", value: project.year },
    project.team ? { label: "Team", value: project.team } : null,
  ].filter((f) => f !== null);

  // Chapters appear only when they have content; numbering follows what is shown.
  const chapters: { title: string; body: React.ReactNode }[] = [];
  if (project.problem.length)
    chapters.push({ title: "The problem", body: project.problem.map((p) => <p key={p}>{p}</p>) });
  if (project.objectives.length)
    chapters.push({ title: "What it set out to do", body: <Points items={project.objectives} /> });
  if (project.solution.length)
    chapters.push({ title: "How it works", body: project.solution.map((p) => <p key={p}>{p}</p>) });
  if (project.features.length)
    chapters.push({
      title: "Key parts",
      body: (
        <dl className="case-features">
          {project.features.map((f) => (
            <div key={f.title}>
              <dt>{f.title}</dt>
              <dd>{f.description}</dd>
            </div>
          ))}
        </dl>
      ),
    });
  if (project.contributions.length)
    chapters.push({
      title: "My part",
      body: (
        <>
          <p className="case-role">{project.role}</p>
          <Points items={project.contributions} />
        </>
      ),
    });
  if (project.outcomes.length || project.outcomeSummary)
    chapters.push({
      title: "Outcome",
      body: (
        <>
          {project.outcomes.length > 0 && (
            <dl className="case-outcomes">
              {project.outcomes.map((o) => (
                <div key={o.label}>
                  <dd>{o.value}</dd>
                  <dt>{o.label}</dt>
                </div>
              ))}
            </dl>
          )}
          {project.outcomeSummary && <p>{project.outcomeSummary}</p>}
        </>
      ),
    });

  return (
    <article className="case">
      <header className="case-hero home-col">
        <BackLink />
        <p className="case-kicker">
          {project.category} · {project.year}
        </p>
        <h1 className="case-title" data-reveal="head">
          {name}
        </h1>
        {subtitle && <p className="case-subtitle">{subtitle}</p>}
        <p className="case-lead">{project.overview}</p>
        {(project.demo || project.github) && (
          <p className="case-links">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                Live demo ↗
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                Code on GitHub ↗
              </a>
            )}
          </p>
        )}
      </header>

      <figure className="case-visual" style={{ background: artBackground[project.slug] ?? "#f1efec" }} data-reveal>
        <Parallax strength={-24}>
          <ProjectArt slug={project.slug} title={project.title} />
        </Parallax>
      </figure>

      <div className="home-col">
        <dl className="case-facts" data-reveal>
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="home-chips case-stack" aria-label="Stack" data-reveal>
          {project.technologies.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        {project.gallery.length > 0 && (
          <div className="case-gallery">
            {project.gallery.map((img) => (
              <figure key={img.src} data-reveal>
                <div className="case-gallery-frame">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 820px) 100vw, 780px"
                    style={{ objectFit: img.fit ?? "cover" }}
                  />
                </div>
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}

        {chapters.map((c, i) => (
          <Chapter key={c.title} n={i + 1} title={c.title}>
            {c.body}
          </Chapter>
        ))}
      </div>

      <ScrollReveal />
    </article>
  );
}
