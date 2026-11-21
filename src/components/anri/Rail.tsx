"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

export interface RailItem {
  id: string;
  label: string;
}

/** Fixed section nav with a thin line and a dot that follows the scroll position. */
export function Rail({ items }: { items: RailItem[] }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(items[0]?.id);

  const update = (progress: number) => {
    const dot = dotRef.current;
    const track = trackRef.current;
    if (dot && track) dot.style.transform = `translateY(${(track.clientHeight - 8) * progress}px)`;

    const line = window.innerHeight * 0.4;
    let current = items[0]?.id;
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el && el.getBoundingClientRect().top <= line) current = item.id;
    }
    setActive(current);
  };

  useLenis((lenis) => update(lenis.progress));

  // Initial position (and on resize) before the first scroll event.
  useEffect(() => {
    const sync = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      update(max > 0 ? window.scrollY / max : 0);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="anri-rail" aria-label="Sections">
      <nav>
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="anri-track" ref={trackRef} aria-hidden="true">
        <div className="anri-dot" ref={dotRef} />
      </div>
    </aside>
  );
}
