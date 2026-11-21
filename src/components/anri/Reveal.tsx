"use client";

import { useEffect, useRef } from "react";

/**
 * Eases a block in when it scrolls into view. Content is fully visible in the server HTML;
 * only blocks that start below the fold are dimmed, after hydration.
 */
export function Reveal<T extends keyof React.JSX.IntrinsicElements = "div">({
  as,
  className = "",
  children,
}: {
  as?: T;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    el.classList.add("is-pre");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("is-pre");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag ref={ref} className={`anri-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
