"use client";

import { useId, useRef } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "./motion";

/** Round company stamp; it turns while the page scrolls, faster with a quick flick. */
export function Stamp({ initials, ring, reverse = false }: { initials: string; ring: string; reverse?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const spin = useRef(0);
  const reduced = useReducedMotion();
  const pathId = useId();

  useLenis(
    (lenis) => {
      if (reduced || !ref.current) return;
      spin.current += 0.25 + Math.abs(lenis.velocity) * 0.5;
      ref.current.style.transform = `rotate(${(reverse ? -1 : 1) * spin.current * 0.6}deg)`;
    },
    [reduced, reverse],
  );

  return (
    <svg ref={ref} className="home-stamp" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id={pathId} d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth=".6" />
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth=".6" />
      <text>
        <textPath href={`#${pathId}`}>{ring}</textPath>
      </text>
      <text className="home-stamp-mono" x="60" y="69" textAnchor="middle">
        {initials}
      </text>
    </svg>
  );
}
