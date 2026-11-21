"use client";

import type { FocusEvent, ReactNode } from "react";
import { useLenis } from "lenis/react";
import { Wave } from "./Wave";

/** Stages the contact footer behind main so the end of the page uncovers it from below. */
export function FooterReveal({ children }: { children: ReactNode }) {
  const lenis = useLenis();

  const keepFocusVisible = (event: FocusEvent<HTMLElement>) => {
    const edge = document.getElementById("contact")?.getBoundingClientRect().top ?? 0;
    if (event.target.getBoundingClientRect().top >= edge) return;
    if (lenis) {
      lenis.scrollTo(lenis.limit, { immediate: true });
    } else {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  };

  return (
    <footer className="home-footer" data-ready={lenis ? "" : undefined} onFocus={keepFocusVisible}>
      <div className="home-grid-lines" aria-hidden="true"><span /></div>
      <div className="home-foot-body">{children}</div>
      <Wave />
    </footer>
  );
}
