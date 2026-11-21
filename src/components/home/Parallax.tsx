"use client";

import { useCallback, useRef } from "react";
import { useScrollMotion } from "./motion";

/** Moves its content against the scroll while the parent is in view. */
export function Parallax({ strength = 28, children }: { strength?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollMotion(useCallback(() => {
    const element = ref.current;
    const parent = element?.parentElement;
    if (!element || !parent) return;

    let top = 0;
    let height = 0;
    let viewport = 0;
    return {
      measure() {
        const bounds = parent.getBoundingClientRect();
        top = bounds.top + window.scrollY;
        height = bounds.height;
        viewport = window.innerHeight;
      },
      paint(scroll) {
        const position = top - scroll;
        if (position + height < 0 || position > viewport) return;
        const shift = (position + height / 2 - viewport / 2) / viewport * -strength;
        element.style.transform = `translateY(${shift.toFixed(2)}px)`;
      },
      cleanup() {
        element.style.transform = "";
      },
    };
  }, [strength]));

  return <div ref={ref} className="home-parallax">{children}</div>;
}
