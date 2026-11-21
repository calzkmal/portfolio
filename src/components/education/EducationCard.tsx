import type { Education } from "@/types";
import { MetaList } from "@/components/ui/Meta";

/** One period of study, set as an editorial entry. */
export function EducationEntry({ item }: { item: Education }) {
  return (
    <article id={item.id} aria-labelledby={`${item.id}-title`} className="grid scroll-mt-24 gap-8 border-t border-rule py-12 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-4">
        <p className="font-mono text-meta tabular-nums text-ink-3">{item.period}</p>
        <h2 id={`${item.id}-title`} className="mt-3 font-serif text-h2 text-ink">
          {item.institution}
        </h2>
        <p className="mt-2 font-medium text-ink">
          {item.degree}, {item.field}
        </p>
        <MetaList
          className="mt-6"
          items={[
            { label: "Location", value: item.location },
            item.grade ? { label: "Grade", value: item.grade } : null,
          ]}
        />
      </div>

      <div className="space-y-8 lg:col-span-7 lg:col-start-6">
        <p className="max-w-lead text-lead text-ink-2">{item.summary}</p>

        {item.highlights.length > 0 && (
          <div>
            <h3 className="text-meta text-ink-3">Highlights</h3>
            <ul className="mt-3 max-w-measure space-y-2.5 text-ink-2">
              {item.highlights.map((h) => (
                <li key={h} className="relative pl-5">
                  <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full bg-ink-3" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.coursework && item.coursework.length > 0 && (
          <div>
            <h3 className="text-meta text-ink-3">Relevant coursework</h3>
            <p className="mt-3 max-w-measure text-ink-2">{item.coursework.join(", ")}</p>
          </div>
        )}
      </div>
    </article>
  );
}
