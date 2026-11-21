import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Projects",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        title="Projects"
        description="Each project opens into a case study: what it set out to do, how it works, my part in it and what it achieved."
      />
      <div className="container pb-24">
        <ProjectIndex projects={projects} />
      </div>
    </>
  );
}
