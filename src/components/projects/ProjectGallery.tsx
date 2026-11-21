"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectImage } from "@/types";
import { cn } from "@/lib/utils";

/** In-page screenshot viewer: large preview plus selectable thumbnails (no modal). */
export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;
  const current = images[index];

  return (
    <figure aria-label="Project screenshots">
      <div className="relative aspect-[16/10] overflow-hidden rounded-plate bg-sage/30">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1080px) 1016px, 100vw"
          className={cn(
                        current.fit === "contain" ? "object-contain p-2 sm:p-4" : "object-cover",
          )}
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <figcaption className="min-h-[1.5rem] font-mono text-meta text-ink-2">
          {current.caption ?? current.alt}
          <span className="ml-2 text-ink-3">
            {index + 1} / {images.length}
          </span>
        </figcaption>
        <a
          href={current.src}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw shrink-0 text-small font-medium"
        >
          Open full size
        </a>
      </div>

      {images.length > 1 && (
        <ul className="mt-2 grid grid-cols-3 gap-3 sm:gap-4">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show screenshot ${i + 1}: ${image.caption ?? image.alt}`}
                aria-pressed={i === index}
                className={cn(
                  "relative block aspect-[16/10] w-full overflow-hidden rounded-plate border-2 transition-[border-color,opacity] duration-quick",
                  i === index
                    ? "border-ink"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1080px) 330px, 33vw"
                  className={image.fit === "contain" ? "object-contain bg-paper p-1" : "object-cover"}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
