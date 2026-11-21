import type { Project } from "@/types";
import { projectField } from "@/data/scenes";
import { Button } from "@/components/ui/Button";
import { MetaList } from "@/components/ui/Meta";
import { Plate } from "@/components/ui/Plate";
import { TagList } from "@/components/ui/Tag";

/** One project as a chapter of the Selected work scene. Shows only real data. */
export function ProjectChapter({ project }: { project: Project }) {
  const field = projectField[project.slug];
  const outcome = project.outcomes[0];
  const shortTitle = project.title.split(" — ")[0];

  return (
    <article
      id={`work-${project.slug}`}
      data-chapter={project.slug}
      aria-labelledby={`${project.slug}-title`}
      className="grid gap-10 py-16 lg:min-h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-24"
    >
      <div className="lg:col-span-5">
        <p className="font-mono text-meta text-ink-3">
          {project.category}, {project.year}
        </p>
        <h3 id={`${project.slug}-title`} className="mt-3 font-serif text-h1 text-ink">
          {project.title}
        </h3>
        <p className="mt-6 max-w-lead text-lead text-ink-2">{project.summary}</p>

        {outcome && (
          <p className="mt-8 flex items-baseline gap-3 border-t border-rule pt-4">
            <span className="font-serif text-h2 text-ink">{outcome.value}</span>
            <span className="text-small text-ink-2">{outcome.label}</span>
          </p>
        )}

        <MetaList
          className="mt-8"
          items={[
            { label: "Role", value: project.role },
            { label: "Period", value: project.duration },
          ]}
        />
        <TagList items={project.technologies} max={5} className="mt-6" />

        <Button href={`/projects/${project.slug}`} variant="quiet" className="mt-10">
          Read the {shortTitle} case study
        </Button>
      </div>

      {field && (
        <div className="lg:col-span-6 lg:col-start-7">
          <Plate
            src={`/field/${field.state}.svg`}
            alt=""
            caption={field.caption}
            illustrative
            poster
            ratio="aspect-[4/3]"
          />
        </div>
      )}
    </article>
  );
}
