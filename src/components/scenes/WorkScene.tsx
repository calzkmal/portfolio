import { projects } from "@/data/projects";
import { Button } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { ProjectChapter } from "./ProjectChapter";

/** Scene 2: selected projects as chapters. */
export function WorkScene() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="work" aria-labelledby="work-heading" data-scene="work" className="container scroll-mt-16 pt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Headline id="work-heading">Selected work</Headline>
        <Button href="/projects" variant="text">
          See every project
        </Button>
      </div>
      {featured.map((project) => (
        <ProjectChapter key={project.slug} project={project} />
      ))}
    </section>
  );
}
