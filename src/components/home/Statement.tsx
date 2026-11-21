"use client";

import { Fragment, useCallback, useRef } from "react";
import { clampProgress, useScrollMotion } from "./motion";

/** Brings each word from faint to ink as the reader passes through the statement. */
export function Statement({ text }: { text: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useScrollMotion(useCallback(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;
    const words = Array.from(section.querySelectorAll<HTMLElement>(".home-statement-word"));
    let start = 0;
    let range = 1;
    let previous = -1;
    section.dataset.lighting = "";

    return {
      measure() {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const viewport = window.innerHeight;
        const pinned = getComputedStyle(frame).position === "sticky";
        start = pinned ? top : top - viewport * 0.85;
        range = Math.max(1, pinned ? section.clientHeight - frame.offsetHeight : viewport * 0.55);
      },
      paint(scroll) {
        const progress = clampProgress((scroll - start) / range);
        if (progress === previous) return;
        previous = progress;
        words.forEach((word, index) => {
          const step = clampProgress(progress * words.length - index);
          word.style.setProperty("--word-progress", String(step * step * (3 - 2 * step)));
        });
      },
      cleanup() {
        delete section.dataset.lighting;
        for (const word of words) word.style.removeProperty("--word-progress");
      },
    };
  }, []));

  return (
    <section ref={sectionRef} className="home-statement" aria-label="Approach">
      <div className="home-statement-frame" ref={frameRef}>
        <p>
          {text.trim().split(/\s+/).map((word, index) => (
            <Fragment key={index}>
              {index > 0 && " "}
              <span className="home-statement-word">
                {word}
                <span className="home-statement-ink" aria-hidden="true">{word}</span>
              </span>
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
