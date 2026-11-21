"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useScrollMotion } from "./motion";

const format = (count: number) => String(count).padStart(2, "0");

/** Holds the section heading beside its entries and tracks the entry at the reading line. */
export function StickyEntries({ heading, count, children }: {
  heading: ReactNode;
  count: number;
  children: ReactNode;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useScrollMotion(useCallback(() => {
    const group = groupRef.current;
    const counter = counterRef.current;
    const entries = group?.querySelectorAll<HTMLElement>(".home-ledger-entries > article");
    if (!group || !counter || !entries?.length) return;

    let entryTops: number[] = [];
    let readingLine = 0;
    let previous = 1;
    const desktop = window.matchMedia("(min-width: 1081px)");
    group.dataset.counting = "";
    return {
      measure() {
        const scroll = window.scrollY;
        readingLine = window.innerHeight * 0.4;
        entryTops = Array.from(entries, (entry) => entry.getBoundingClientRect().top + scroll);
      },
      paint(scroll) {
        if (!desktop.matches) return;
        const active = entryTops.findLastIndex((top) => top <= scroll + readingLine);
        const current = Math.max(1, active + 1);
        if (current === previous) return;
        counter.textContent = format(current);
        previous = current;
      },
      cleanup() {
        delete group.dataset.counting;
        counter.textContent = format(1);
      },
    };
  }, []));

  return (
    <div className="home-col home-ledger" ref={groupRef}>
      <div className="home-ledger-heading">
        {heading}
        <p className="home-ledger-counter" aria-hidden="true">
          <span ref={counterRef}>01</span> / {format(count)}
        </p>
      </div>
      <div className="home-ledger-entries">{children}</div>
    </div>
  );
}
