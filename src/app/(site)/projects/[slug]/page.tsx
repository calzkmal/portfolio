import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";
import { projectField } from "@/data/scenes";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { MetaList } from "@/components/ui/Meta";
import { Plate } from "@/components/ui/Plate";
import { TagList } from "@/components/ui/Tag";
import { ProjectGallery } from "@/components/projects/ProjectGallery";

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
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { type: "article", url, title: project.title, description: project.summary },
    twitter: { title: project.title, description: project.summary },
  };
}

/** Article section. Rendered only when it has content. */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 border-t border-rule pt-8">
      <h2 id={id} className="font-serif text-h2 text-ink">
        {title}
      </h2>
      <div className="mt-6 max-w-measure space-y-4 text-ink-2">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="relative pl-5">
          <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full bg-ink-3" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const adjacent = getAdjacentProjects(project.slug);
  const field = projectField[project.slug];

  return (
    <article>
      <header className="container pt-10 sm:pt-16">
        <Link href="/projects" className="link-draw inline-flex min-h-11 items-center text-small text-ink-2 hover:text-ink">
          All projects
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8">
            <p className="font-mono text-meta text-ink-3">
              {project.category}, {project.year}
            </p>
            <Headline as="h1" size="h1" intro className="mt-4">
              {project.title}
            </Headline>
            <p className="mt-8 max-w-lead text-lead text-ink-2">{project.overview}</p>

            {(project.github || project.demo) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {project.demo && <Button href={project.demo}>Open the live demo</Button>}
                {project.github && (
                  <Button href={project.github} variant="text">
                    View the code on GitHub
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mt-14 sm:mt-20">
        {project.gallery.length > 0 ? (
          <ProjectGallery images={project.gallery} />
        ) : (
          field && (
            <Plate
              src={`/field/${field.state}.svg`}
              alt=""
              caption={field.caption}
              illustrative
              ratio="aspect-[16/9]"
              priority
              className="[&>div]:bg-sage/25"
            />
          )
        )}
      </div>

      <div className="container mt-16 grid gap-14 pb-24 lg:mt-24 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 space-y-16 lg:col-span-7">
          {project.problem.length > 0 && (
            <Section id="problem" title="The problem">
              {project.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Section>
          )}

          {project.objectives.length > 0 && (
            <Section id="objectives" title="What it set out to do">
              <Bullets items={project.objectives} />
            </Section>
          )}

          {project.solution.length > 0 && (
            <Section id="solution" title="How it works">
              {project.solution.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Section>
          )}

          {project.features.length > 0 && (
            <Section id="features" title="Key parts">
              <dl className="space-y-5">
                {project.features.map((f) => (
                  <div key={f.title}>
                    <dt className="font-semibold text-ink">{f.title}</dt>
                    <dd className="mt-1">{f.description}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {project.contributions.length > 0 && (
            <Section id="contributions" title="My part">
              <p className="font-medium text-ink">{project.role}</p>
              <Bullets items={project.contributions} />
            </Section>
          )}

          {(project.outcomes.length > 0 || project.outcomeSummary) && (
            <Section id="outcomes" title="Outcome">
              {project.outcomes.length > 0 && (
                <dl className="grid gap-6 sm:grid-cols-2">
                  {project.outcomes.map((o) => (
                    <div key={o.label} className="flex flex-col-reverse">
                      <dt className="mt-1 text-small text-ink-2">{o.label}</dt>
                      <dd className="font-serif text-h2 text-ink">{o.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {project.outcomeSummary && <p>{project.outcomeSummary}</p>}
            </Section>
          )}
        </div>

        <aside aria-label="Project facts" className="lg:col-span-4 lg:col-start-9">
          <div className="space-y-8 lg:sticky lg:top-24">
            <MetaList
              items={[
                { label: "Role", value: project.role },
                { label: "Period", value: project.duration },
                { label: "Year", value: project.year },
                project.team ? { label: "Team", value: project.team } : null,
              ]}
            />
            <div className="border-t border-rule pt-6">
              <h2 className="text-meta text-ink-3">Stack</h2>
              <TagList items={project.technologies} className="mt-3" />
            </div>
          </div>
        </aside>
      </div>

      {adjacent && (
        <nav aria-label="More projects" className="container grid border-t border-rule sm:grid-cols-2">
          <Link href={`/projects/${adjacent.previous.slug}`} className="group py-10 sm:pr-6">
            <span className="text-meta text-ink-3">Previous project</span>
            <span className="link-draw mt-2 block w-fit font-serif text-h3 text-ink group-hover:[background-size:100%_1px]">{adjacent.previous.title}</span>
          </Link>
          <Link href={`/projects/${adjacent.next.slug}`} className="group border-t border-rule py-10 sm:border-l sm:border-t-0 sm:pl-6 sm:text-right">
            <span className="text-meta text-ink-3">Next project</span>
            <span className="link-draw mt-2 block w-fit font-serif text-h3 text-ink group-hover:[background-size:100%_1px] sm:ml-auto">{adjacent.next.title}</span>
          </Link>
        </nav>
      )}
    </article>
  );
}
