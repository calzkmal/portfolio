"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "./motion";

/**
 * Moves its content slightly against the scroll while it is on screen.
 * `strength` is the shift in px between the top and the bottom of the viewport.
 */
export function Parallax({ strength = 28, children }: { strength?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLenis(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.transform = "";
      return;
    }
    const box = el.parentElement?.getBoundingClientRect();
    if (!box || box.bottom < 0 || box.top > window.innerHeight) return;
    const t = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
    el.style.transform = `translateY(${(t * -strength).toFixed(2)}px)`;
  }, [reduced, strength]);

  return (
    <div ref={ref} className="anri-parallax" style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
