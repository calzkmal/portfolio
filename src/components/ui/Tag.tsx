import { cn } from "@/lib/utils";

/** Technology tags, set in the metadata face. */
export function TagList({
  items,
  max,
  className,
  label = "Technologies",
}: {
  items: string[];
  max?: number;
  className?: string;
  label?: string;
}) {
  const visible = max ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label={label}>
      {visible.map((item) => (
        <li key={item} className="rounded-tag border border-rule px-2 py-0.5 font-mono text-meta text-ink-2">
          {item}
        </li>
      ))}
      {hidden > 0 && (
        <li className="px-1 py-0.5 font-mono text-meta text-ink-3">and {hidden} more</li>
      )}
    </ul>
  );
}
