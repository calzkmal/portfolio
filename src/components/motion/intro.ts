"use client";

import { gsap } from "./gsap";

/**
 * The single orchestrated entrance (motion-spec §4, scene 0): lines marked
 * `data-intro="line"` rise through their masks, then `data-intro="fade"`
 * elements fade in. Runs on first load and after each route change.
 * Elements are only hidden (by CSS) when <html> has the `motion` class.
 */
export function playIntro(root: ParentNode = document) {
  if (!document.documentElement.classList.contains("motion")) return null;
  const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-intro='line']"));
  const fades = Array.from(root.querySelectorAll<HTMLElement>("[data-intro='fade']"));
  if (!lines.length && !fades.length) return null;

  gsap.set([...lines, ...fades], { visibility: "visible", animation: "none" });
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  if (lines.length) tl.from(lines, { yPercent: 105, duration: 0.9, stagger: 0.12 }, 0.1);
  if (fades.length) tl.from(fades, { autoAlpha: 0, duration: 0.48, stagger: 0.08, ease: "power3.out" }, lines.length ? 0.45 : 0);
  return tl;
}
