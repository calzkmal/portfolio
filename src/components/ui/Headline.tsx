import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Level = "h1" | "h2" | "h3";

const sizes = {
  display: "font-serif text-display",
  h1: "font-serif text-h1",
  h2: "font-serif text-h2",
} as const;

/**
 * Serif headline. Each entry in `lines` becomes its own mask line so the
 * scroll director can reveal it line by line; plain children render as one line.
 */
export function Headline({
  as: Tag = "h2",
  size = "h2",
  lines,
  children,
  id,
  className,
  reveal = true,
  intro = false,
}: {
  as?: Level;
  size?: keyof typeof sizes;
  lines?: string[];
  children?: ReactNode;
  id?: string;
  className?: string;
  /** Mark for the scroll-triggered typographic reveal (only runs when motion is allowed). */
  reveal?: boolean;
  /** Part of the page entrance instead (page titles). */
  intro?: boolean;
}) {
  const content = lines ?? [children];
  return (
    <Tag id={id} className={cn(sizes[size], "text-ink", className)} data-reveal={reveal && !intro ? "" : undefined}>
      {content.map((line, i) => (
        <span key={i} className="mask-line">
          <span data-intro={intro ? "line" : undefined}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
