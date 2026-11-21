"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

export interface RailItem {
  id: string;
  label: string;
}

/** Fixed section nav; the section in view is marked with a short line. */
export function Rail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [onDark, setOnDark] = useState(false);

  const update = () => {
    const line = window.innerHeight * 0.4;
    let current = items[0]?.id;
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el && el.getBoundingClientRect().top <= line) current = item.id;
    }
    setActive(current);
    // The footer is dark; flip the rail's colours once it sits under the rail.
    const footer = document.querySelector<HTMLElement>(".home-footer");
    setOnDark(!!footer && footer.getBoundingClientRect().top <= 48);
  };

  const lenis = useLenis(update);

  // Glide to the section instead of jumping: a long, weighty ease-in-out.
  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!lenis || !target) return; // fall back to the browser's own jump
    e.preventDefault();
    // Contact is the last block: run all the way to the bottom of the page.
    const to = id === "contact" ? lenis.limit : target;
    lenis.scrollTo(to, {
      offset: id === "about" || id === "contact" ? 0 : -24,
      duration: 1.8,
      easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2), // easeInOutQuint
      onComplete: () => history.replaceState(null, "", `#${id}`),
    });
  };

  // Before the first scroll event, and on resize.
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      className="home-rail"
      aria-label="Sections"
      data-on-dark={onDark || undefined}
    >
      <nav>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => go(e, item.id)}
            aria-current={active === item.id ? "true" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
