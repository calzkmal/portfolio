import { cn } from "@/lib/utils";

/**
 * Figure with a caption. Visuals that are not real data must pass
 * `illustrative` so the caption says so.
 */
export function Plate({
  src,
  alt,
  caption,
  illustrative = false,
  className,
  ratio = "aspect-[4/3]",
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  illustrative?: boolean;
  className?: string;
  ratio?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <div className={cn("relative overflow-hidden rounded-plate", ratio)}>
        {/* Plain <img>: posters are small SVGs and must not go through the image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      {(caption || illustrative) && (
        <figcaption className="mt-3 flex flex-wrap gap-x-3 font-mono text-meta text-ink-3">
          {caption && <span>{caption}</span>}
          {illustrative && <span>Illustrative, not real data</span>}
        </figcaption>
      )}
    </figure>
  );
}
