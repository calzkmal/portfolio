"use client";

import { ReactLenis } from "lenis/react";

/**
 * Page-wide Lenis smooth scroll (https://github.com/darkroomengineering/lenis).
 * Options follow the README's recommended setup. The rail handles its own #links (Rail.tsx) with a slow eased glide.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        autoToggle: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        lerp: 0.085,
      }}
    >
      {children}
    </ReactLenis>
  );
}
