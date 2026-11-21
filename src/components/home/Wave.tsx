"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./motion";

const STILL = "M0 60 L400 60 L400 150 L0 150 Z";

/** Slow wave at the bottom of the footer. Animates only while the footer is on screen. */
export function Wave() {
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    const wave = path?.ownerSVGElement;
    const seam = document.getElementById("contact");
    if (!path || !wave || !seam || reduced) {
      path?.setAttribute("d", STILL);
      return;
    }

    let on = false;
    let raf = 0;
    const draw = (t: number) => {
      const pts: string[] = [];
      for (let x = 0; x <= 400; x += 10) {
        const y = 60 + Math.sin(x / 55 + t / 900) * 16 + Math.sin(x / 23 - t / 1400) * 6;
        pts.push(`L${x} ${y.toFixed(1)}`);
      }
      path.setAttribute("d", `M0 150 ${pts.join(" ")} L400 150 Z`);
      if (on) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([entry]) => {
      on = entry.boundingClientRect.top <= (entry.rootBounds?.bottom ?? window.innerHeight);
      wave.toggleAttribute("data-revealed", on);
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(draw);
    });
    io.observe(seam);
    return () => {
      on = false;
      wave.removeAttribute("data-revealed");
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced]);

  return (
    <svg className="home-wave" viewBox="0 0 400 150" preserveAspectRatio="none" aria-hidden="true">
      <path ref={pathRef} d={STILL} />
    </svg>
  );
}
