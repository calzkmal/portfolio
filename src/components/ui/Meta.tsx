import { cn } from "@/lib/utils";

export interface MetaItem {
  label: string;
  value: string;
}

/**
 * Label/value pairs as a real definition list. Replaces "A · B" strings.
 * Values are set in the metadata face; labels in the interface face.
 */
export function MetaList({
  items,
  className,
  columns = 1,
}: {
  items: (MetaItem | null | undefined | false)[];
  className?: string;
  columns?: 1 | 2;
}) {
  const rows = items.filter(Boolean) as MetaItem[];
  return (
    <dl
      className={cn(
        "grid gap-x-8 gap-y-2",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {rows.map((item) => (
        <div key={item.label} className="grid grid-cols-[7.5rem_1fr] items-baseline gap-3">
          <dt className="text-meta text-ink-3">{item.label}</dt>
          <dd className="font-mono text-meta tabular-nums text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
