"use client";

import { useEffect, useState } from "react";

/**
 * True when the visitor asked the OS for reduced motion. Lenis smooth scrolling stays on
 * either way; this only switches off the decorative effects (parallax, stamp spin, wave).
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
