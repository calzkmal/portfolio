import Link from "next/link";
import { getProject } from "@/data/projects";
import { ProjectArt, artBackground } from "./ProjectArt";

/** Links selected work to its related experience or education entry. */
export function EntryProjects({ slugs }: { slugs: string[] }) {
  const projects = slugs.flatMap((slug) => {
    const project = getProject(slug);
    return project ? [project] : [];
  });
  if (!projects.length) return null;

  return (
    <div className="home-entry-projects">
      <h4>Related projects</h4>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`}>
              <span className="home-entry-art" style={{ background: artBackground[project.slug] }} aria-hidden="true">
                <ProjectArt slug={project.slug} title={project.title} />
              </span>
              <span className="home-entry-project-copy">
                <strong>{project.title}</strong>
                <span>{project.role} · {project.year}</span>
              </span>
              <span className="home-entry-arrow" aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
