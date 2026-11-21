import type { Experience } from "@/types";
import { MetaList } from "@/components/ui/Meta";
import { TagList } from "@/components/ui/Tag";

/** One role, set as an editorial entry: facts on the left, story on the right. */
export function ExperienceEntry({ item, current }: { item: Experience; current: boolean }) {
  return (
    <article id={item.id} aria-labelledby={`${item.id}-title`} className="grid scroll-mt-24 gap-8 border-t border-rule py-12 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-4">
        <p className="font-mono text-meta tabular-nums text-ink-3">
          {item.period}
          {current && <span className="ml-2 text-signal-ink">Now</span>}
        </p>
        <h2 id={`${item.id}-title`} className="mt-3 font-serif text-h2 text-ink">
          {item.role}
        </h2>
        <p className="mt-2 font-medium text-ink">{item.company}</p>
        <MetaList
          className="mt-6"
          items={[
            { label: "Type", value: item.type },
            { label: "Location", value: item.location },
          ]}
        />
      </div>

      <div className="space-y-8 lg:col-span-7 lg:col-start-6">
        <p className="max-w-lead text-lead text-ink-2">{item.summary}</p>

        <div>
          <h3 className="text-meta text-ink-3">What I did</h3>
          <ul className="mt-3 max-w-measure space-y-2.5 text-ink-2">
            {item.responsibilities.map((r) => (
              <li key={r} className="relative pl-5">
                <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full bg-ink-3" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {item.achievements.length > 0 && (
          <div className="border-l-2 border-ink pl-5">
            <h3 className="text-meta text-ink-3">Results</h3>
            <ul className="mt-3 max-w-measure space-y-2.5 text-ink">
              {item.achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        <TagList items={item.technologies} />
      </div>
    </article>
  );
}
