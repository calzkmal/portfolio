"use client";

import { useState } from "react";
import type { Achievement, AchievementCategory } from "@/types";
import { cn } from "@/lib/utils";

const plural: Record<AchievementCategory, string> = {
  Award: "Awards",
  Certification: "Certifications",
  Competition: "Competitions",
  Organization: "Organizations",
  Other: "Other",
};

/** Achievements archive: a filterable list, newest first. */
export function AchievementsList({ items }: { items: Achievement[] }) {
  const [active, setActive] = useState<AchievementCategory | "All">("All");
  const sorted = [...items].sort((a, b) => b.year - a.year);
  const categories = (Object.keys(plural) as AchievementCategory[]).filter((c) => items.some((i) => i.category === c));
  const visible = active === "All" ? sorted : sorted.filter((i) => i.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter achievements by type" className="flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((category) => {
          const selected = category === active;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(category)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-small transition-colors duration-instant",
                selected ? "border-ink bg-ink text-paper" : "border-rule text-ink-2 hover:border-ink/40 hover:text-ink",
              )}
            >
              {category === "All" ? "All" : plural[category]}
            </button>
          );
        })}
      </div>

      <ol className="mt-10 border-b border-rule" aria-live="polite">
        {visible.map((item) => (
          <li key={item.id} className="grid gap-3 border-t border-rule py-8 lg:grid-cols-12 lg:gap-6">
            <p className="font-mono text-meta text-ink-3 lg:col-span-2">{item.date}</p>
            <div className="lg:col-span-6">
              <h2 className="font-serif text-h3 text-ink">{item.title}</h2>
              <p className="mt-1 text-ink-2">{item.organization}</p>
              <p className="mt-4 max-w-measure text-ink-2">{item.description}</p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-line mt-4 inline-block text-small font-medium">
                  View the credential
                </a>
              )}
            </div>
            <p className="font-mono text-meta text-ink-3 lg:col-span-3 lg:col-start-10 lg:text-right">{item.category}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
