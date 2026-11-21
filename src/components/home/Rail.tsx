"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { observeLayout } from "./motion";

export interface RailItem {
  id: string;
  label: string;
}

/** Marks the section in view and switches to light text as main uncovers the footer. */
export function Rail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [onDark, setOnDark] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let sections: { id: string; top: number }[] = [];
    let readingLine = 0;
    let contactTop = Infinity;
    const update = (scroll: number) => {
      const current = sections.findLast((section) => section.top <= scroll + readingLine);
      setActive(current?.id ?? items[0]?.id);
      setOnDark(contactTop <= scroll + 48);
    };
    const measure = () => {
      const scroll = window.scrollY;
      readingLine = window.innerHeight * 0.4;
      sections = items.flatMap(({ id }) => {
        const element = document.getElementById(id);
        return element ? [{ id, top: element.getBoundingClientRect().top + scroll }] : [];
      });
      contactTop = sections.find((section) => section.id === "contact")?.top ?? Infinity;
      update(scroll);
    };

    measure();
    const unobserve = observeLayout(measure);
    const unsubscribe = lenis?.on("scroll", (instance) => update(instance.scroll));
    return () => {
      unobserve();
      unsubscribe?.();
    };
  }, [items, lenis]);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const target = document.getElementById(id);
    if (!lenis || !target) return;
    event.preventDefault();

    lenis.scrollTo(id === "contact" ? lenis.limit : target, {
      offset: id === "about" || id === "contact" ? 0 : -24,
      duration: 1.8,
      easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2),
      onComplete: () => history.replaceState(null, "", `#${id}`),
    });
  };

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
            onClick={(event) => go(event, item.id)}
            aria-current={active === item.id ? "true" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
