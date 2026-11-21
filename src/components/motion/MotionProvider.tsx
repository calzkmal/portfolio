"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { playIntro } from "./intro";

/**
 * Scroll and entrance motion for the inner pages (the home page runs its own Lenis, see components/home).
 *
 * - Lenis smooths wheel scrolling on desktop with a fine pointer only. Touch
 *   devices and reduced-motion visitors keep native scrolling.
 * - Lenis is driven by GSAP's ticker, the only animation loop on the page.
 * - On route changes: jump to the top and re-measure every ScrollTrigger once
 *   fonts have loaded.
 */
export function MotionProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        syncTouch: false,
        autoRaf: false,
        anchors: { offset: -64 },
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenisRef.current = null;
      };
    });
    return () => mm.revert();
  }, []);

  // Before paint on every route: play the page's entrance.
  useLayoutEffect(() => {
    const main = document.getElementById("main");
    const tl = main ? playIntro(main) : null;
    return () => {
      tl?.kill();
    };
  }, [pathname]);

  useEffect(() => {
    // Next.js already scrolls to the top on navigation; keep Lenis in sync with it.
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
