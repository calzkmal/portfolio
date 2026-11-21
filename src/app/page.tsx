import type { Metadata } from "next";
import { ArrivalScene } from "@/components/scenes/ArrivalScene";
import { MethodScene } from "@/components/scenes/MethodScene";
import { WorkScene } from "@/components/scenes/WorkScene";
import { TrajectoryScene } from "@/components/scenes/TrajectoryScene";
import { RecognitionScene } from "@/components/scenes/RecognitionScene";
import { ContactScene } from "@/components/scenes/ContactScene";
import { HomeDirector } from "@/components/motion/HomeDirector";
import { FieldStage } from "@/components/field/FieldStage";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: `${profile.name} — ${profile.title}` },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.intro,
    url: siteConfig.url,
    email: profile.email,
    sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FieldStage />
      <div className="relative z-[1]">
        <ArrivalScene />
        <MethodScene />
        <WorkScene />
        <TrajectoryScene />
        <RecognitionScene />
        <ContactScene />
      </div>
      <HomeDirector />
    </>
  );
}
