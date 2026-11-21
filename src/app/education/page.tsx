import type { Metadata } from "next";
import { education } from "@/data/education";
import { EducationEntry } from "@/components/education/EducationCard";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Education",
  description: "Software Engineering at Universitas Pendidikan Indonesia and a student exchange at the University of Western Ontario.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return (
    <>
      <PageIntro
        title="Education"
        description="A degree in Software Engineering, and a semester abroad that widened it."
      />
      <div className="container pb-24">
        {education.map((item) => (
          <EducationEntry key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
