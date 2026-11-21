import type { Metadata } from "next";
import { experience } from "@/data/experience";
import { ExperienceEntry } from "@/components/experience/ExperienceCard";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work in AI automation, data science and iOS development: what each role involved and what it delivered.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <PageIntro
        title="Experience"
        description="Roles across AI-powered automation, business insight and data science, and iOS development, with what I delivered in each."
      />
      <div className="container pb-24">
        {experience.map((item) => (
          <ExperienceEntry key={item.id} item={item} current={/present/i.test(item.period)} />
        ))}
      </div>
    </>
  );
}
