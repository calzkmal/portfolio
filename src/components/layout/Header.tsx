"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/data/site";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-quick ease-out",
        scrolled || open ? "bg-paper/95 shadow-float" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-small font-semibold tracking-tight" aria-label={`${profile.name}, home`}>
          {profile.name}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navigation
              .filter((item) => item.href !== "/")
              .map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center text-small transition-colors duration-instant",
                        active ? "font-medium text-ink" : "text-ink-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 bottom-2 h-0.5 origin-left bg-signal-ink transition-transform duration-quick ease-out",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-settle ease-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        // Keeps hidden links out of the tab order while collapsed.
        {...(!open ? { inert: true } : {})}
      >
        <div className="min-h-0 overflow-hidden">
        <ul className="container pb-4">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="border-t border-rule">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center justify-between text-body",
                    active ? "font-medium text-ink" : "text-ink-2",
                  )}
                >
                  {item.label}
                  {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />}
                </Link>
              </li>
            );
          })}
        </ul>
        </div>
      </nav>
    </header>
  );
}
