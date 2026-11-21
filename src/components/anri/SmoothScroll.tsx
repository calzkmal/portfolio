"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Page-wide Lenis smooth scroll (https://github.com/darkroomengineering/lenis).
 * Options follow the README's recommended setup; `anchors` makes the rail's #links glide.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        autoToggle: true,
        anchors: { offset: -24 },
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        lerp: 0.085,
      }}
    >
      {children}
    </ReactLenis>
  );
}
