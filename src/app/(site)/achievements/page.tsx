import type { Metadata } from "next";
import { achievements } from "@/data/achievements";
import { AchievementsList } from "@/components/achievements/AchievementsGrid";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Achievements",
  alternates: { canonical: "/achievements" },
};

export default function AchievementsPage() {
  return (
    <>
      <PageIntro title="Achievements" description="Competitions, leadership roles and programmes, newest first." />
      <div className="container pb-24">
        <AchievementsList items={achievements} />
      </div>
    </>
  );
}
