"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { observeLayout } from "@/components/home/motion";
import { markReturn } from "@/components/home/ReturnPoint";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/#recognition", label: "Recognition" },
  { href: "#contact", label: "Contact" },
];

/**
 * The left rail on pages other than home: same look as the home Rail, but its links lead back
 * to the home sections. Switches to light text once the dark footer sits under it.
 */
export function PageNav() {
  const lenis = useLenis();
  const [onDark, setOnDark] = useState(false);

  // Browser back to home: let home put the visitor back where they left it (ReturnPoint).
  useEffect(() => {
    const onPop = () => {
      if (window.location.pathname === "/" && !window.location.hash) markReturn();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    let footerTop = Infinity;
    const update = (scroll: number) => setOnDark(footerTop <= scroll + 48);
    const measure = () => {
      const marker = document.getElementById("contact");
      footerTop = marker ? marker.getBoundingClientRect().top + window.scrollY : Infinity;
      update(window.scrollY);
    };
    measure();
    const unobserve = observeLayout(measure);
    const unsubscribe = lenis?.on("scroll", (instance) => update(instance.scroll));
    return () => {
      unobserve();
      unsubscribe?.();
    };
  }, [lenis]);

  const toContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!lenis) return;
    event.preventDefault();
    lenis.scrollTo(lenis.limit, {
      duration: 1.8,
      easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2),
    });
  };

  return (
    <aside className="home-rail" aria-label="Site" data-on-dark={onDark || undefined}>
      <nav>
        {links.map((link) =>
          link.href === "#contact" ? (
            <a key={link.href} href={link.href} onClick={toContact}>
              {link.label}
            </a>
          ) : (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ),
        )}
      </nav>
    </aside>
  );
}
