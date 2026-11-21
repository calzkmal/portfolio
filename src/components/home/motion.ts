"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";

const reducedQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(update: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}

/**
 * True when the visitor asked the OS for reduced motion. Lenis smooth scrolling stays on
 * either way; this only switches off the decorative effects (parallax, word reveals, wave).
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedQuery).matches,
    () => true,
  );
}

export const clampProgress = (progress: number) => Math.min(1, Math.max(0, progress));

export function observeLayout(measure: () => void) {
  const observer = new ResizeObserver(measure);
  observer.observe(document.body);
  window.addEventListener("resize", measure);
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", measure);
  };
}

/** Measure on layout changes and use the cached geometry for each Lenis update. */
export function useScrollMotion(setup: () => {
  measure: () => void;
  paint: (scroll: number) => void;
  cleanup: () => void;
} | undefined) {
  const lenis = useLenis();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !lenis) return;
    const effect = setup();
    if (!effect) return;

    const measure = () => {
      effect.measure();
      effect.paint(window.scrollY);
    };
    measure();
    const unobserve = observeLayout(measure);
    const unsubscribe = lenis.on("scroll", (instance) => effect.paint(instance.scroll));
    return () => {
      unsubscribe();
      unobserve();
      effect.cleanup();
    };
  }, [lenis, reduced, setup]);
}
