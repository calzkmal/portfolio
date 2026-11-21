"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

const SAVED = "calzy:return-y";
const PENDING = "calzy:return-pending";

const store = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

/** Asks home to scroll back to where the visitor opened a project (BackLink and browser back). */
export function markReturn() {
  const s = store();
  if (s?.getItem(SAVED)) s.setItem(PENDING, "1");
}

/**
 * On home: remembers the scroll position when a project link is opened, and restores it
 * when the visitor comes back through the case study's back link or the browser's back button.
 */
export function ReturnPoint() {
  const lenis = useLenis();

  useEffect(() => {
    const remember = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="/projects/"]');
      if (link) store()?.setItem(SAVED, String(Math.round(window.scrollY)));
    };
    document.addEventListener("click", remember, true);
    return () => document.removeEventListener("click", remember, true);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const s = store();
    const pending = s?.getItem(PENDING);
    s?.removeItem(PENDING);
    const y = Number(s?.getItem(SAVED));
    if (!pending || window.location.hash || !Number.isFinite(y)) return;
    // After Next's own scroll-to-top on navigation.
    const frame = requestAnimationFrame(() => lenis.scrollTo(y, { immediate: true, force: true }));
    return () => cancelAnimationFrame(frame);
  }, [lenis]);

  return null;
}
