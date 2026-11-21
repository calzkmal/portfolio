"use client";

import { useScrollMotion, clampProgress } from "./motion";

interface Item {
  el: HTMLElement;
  top: number;
  delay: number;
  head: boolean;
  stickyHeading: HTMLElement | null;
}

function paint({ el, top, delay, head }: Item, scroll: number, vh: number) {
  const progress = clampProgress((vh * 0.95 - (top - scroll)) / (vh * 0.4) - delay);
  const eased = 1 - (1 - progress) ** 3;
  const { style } = el;

  style.opacity = eased.toFixed(3);
  style.transform = `translate3d(0, ${((1 - eased) * (head ? 56 : 36)).toFixed(1)}px, 0)`;
  if (head) style.clipPath = `inset(0 0 ${((1 - eased) * 100).toFixed(1)}% 0)`;
}

function setupReveal() {
  const items: Item[] = Array.from(document.querySelectorAll<HTMLElement>(".home [data-reveal]"), (el) => ({
    el,
    top: 0,
    delay: Number(el.dataset.revealDelay ?? 0),
    head: el.dataset.reveal === "head",
    stickyHeading: el.closest(".home-ledger-heading"),
  }));
  let viewport = 0;

  return {
    measure() {
      const scroll = window.scrollY;
      viewport = window.innerHeight;
      for (const { el } of items) el.style.transform = "";
      for (const item of items) {
        item.top = item.el.getBoundingClientRect().top + scroll;
        if (item.stickyHeading) {
          // Use the heading's natural position even if it is already pinned.
          item.top += item.stickyHeading.parentElement!.getBoundingClientRect().top
            - item.stickyHeading.getBoundingClientRect().top;
        }
      }
    },
    paint(scroll: number) {
      for (const item of items) paint(item, scroll, viewport);
    },
    cleanup() {
      for (const { el } of items) {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.clipPath = "";
      }
    },
  };
}

/** Reveals home copy and headings from cached document offsets on each Lenis update. */
export function ScrollReveal() {
  useScrollMotion(setupReveal);
  return null;
}
