"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "./motion";

type Kind = "up" | "card" | "head";

interface Item {
  el: HTMLElement;
  /** Document position of the element's top edge, measured without our transform. */
  top: number;
  delay: number;
  kind: Kind;
}

/** Reveal starts when an element's top reaches 95% of the viewport and ends at 55%. */
const START = 0.95;
const SPAN = 0.4;

function paint(item: Item, scroll: number, vh: number) {
  const raw = (vh * START - (item.top - scroll)) / (vh * SPAN) - item.delay;
  const p = Math.min(1, Math.max(0, raw));
  const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
  const { style } = item.el;

  style.opacity = e.toFixed(3);
  if (item.kind === "card") {
    style.transform = `translate3d(0, ${((1 - e) * 72).toFixed(1)}px, 0) scale(${(0.94 + 0.06 * e).toFixed(4)})`;
  } else if (item.kind === "head") {
    style.transform = `translate3d(0, ${((1 - e) * 56).toFixed(1)}px, 0)`;
    style.clipPath = `inset(0 0 ${((1 - e) * 100).toFixed(1)}% 0)`;
  } else {
    style.transform = `translate3d(0, ${((1 - e) * 36).toFixed(1)}px, 0)`;
  }
}

function clear(el: HTMLElement) {
  el.style.opacity = "";
  el.style.transform = "";
  el.style.clipPath = "";
  el.style.willChange = "";
}

/**
 * Scroll-linked reveal driven by Lenis: every `[data-reveal]` element fades and rises in
 * step with the scroll position (and goes back when scrolling up), instead of playing a
 * one-off animation. `data-reveal` is "up" (default), "card" or "head";
 * `data-reveal-delay` (0–0.5) staggers siblings.
 *
 * The server HTML has no reveal styles, so content is visible without JavaScript, and
 * visitors who ask for reduced motion see everything in place.
 */
export function ScrollReveal() {
  const items = useRef<Item[]>([]);
  const reduced = useReducedMotion();

  const lenis = useLenis(
    (l) => {
      if (reduced) return;
      const vh = window.innerHeight;
      for (const item of items.current) paint(item, l.scroll, vh);
    },
    [reduced],
  );

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduced) {
      els.forEach(clear);
      items.current = [];
      return;
    }

    const measure = () => {
      const scroll = window.scrollY;
      items.current = els.map((el) => {
        el.style.transform = "";
        el.style.clipPath = "";
        return {
          el,
          top: el.getBoundingClientRect().top + scroll,
          delay: Number(el.dataset.revealDelay ?? 0),
          kind: (el.dataset.reveal || "up") as Kind,
        };
      });
      els.forEach((el) => (el.style.willChange = "transform, opacity"));
      const vh = window.innerHeight;
      for (const item of items.current) paint(item, scroll, vh);
    };

    measure();
    // Re-measure when the layout changes (fonts, images, resize).
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      els.forEach(clear);
    };
  }, [reduced, lenis]);

  return null;
}
