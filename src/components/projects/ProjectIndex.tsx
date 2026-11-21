"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/types";
import { projectField } from "@/data/scenes";
import { cn } from "@/lib/utils";

/** /projects: one row per project, filterable by category. */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const visible = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {categories.map((category) => {
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
              {category}
            </button>
          );
        })}
      </div>

      <ul className="mt-10 border-b border-rule" aria-live="polite">
        {visible.map((project) => {
          const field = projectField[project.slug];
          return (
            <li key={project.slug} className="border-t border-rule">
              <Link
                href={`/projects/${project.slug}`}
                className="group grid gap-6 py-8 md:grid-cols-12 md:items-center md:gap-6"
              >
                <span className="font-mono text-meta tabular-nums text-ink-3 md:col-span-1">{project.year}</span>
                <span className="md:col-span-6">
                  <span className="block font-serif text-h2 text-ink transition-transform duration-settle ease-out group-hover:translate-x-1">
                    {project.title}
                  </span>
                  <span className="mt-3 block max-w-lead text-ink-2">{project.summary}</span>
                </span>
                <span className="grid gap-1 font-mono text-meta text-ink-3 md:col-span-2">
                  <span>{project.category}</span>
                  <span className="text-ink">{project.role}</span>
                </span>
                {field && (
                  <span className="relative hidden aspect-[4/3] overflow-hidden rounded-plate bg-sage/30 md:col-span-3 md:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/field/${field.state}.svg`}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-contain opacity-80 transition-opacity duration-settle group-hover:opacity-100"
                    />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-mono text-meta text-ink-3">Project visuals are illustrative, not real data.</p>
    </div>
  );
}
