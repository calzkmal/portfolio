import type Lenis from "lenis";

/** The active Lenis instance (desktop only), or null when native scrolling is in use. */
let current: Lenis | null = null;

export const lenisRef = {
  get: () => current,
  set: (lenis: Lenis | null) => {
    current = lenis;
  },
};

/** Scroll to a position through Lenis when it is active, natively otherwise. */
export function scrollToY(y: number) {
  if (current) current.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "auto" });
}
