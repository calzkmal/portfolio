import Link from "next/link";
import type { ReactNode } from "react";
import { cn, isExternal } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: ReactNode;
  /** primary: ink pill. quiet: outlined pill. text: underline-draw link. */
  variant?: "primary" | "quiet" | "text";
  /** Adds the `download` attribute (files in /public). */
  download?: boolean;
  className?: string;
}

const styles = {
  primary:
    "inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-small font-medium text-paper transition-colors duration-instant hover:bg-[#0B3A55]",
  quiet:
    "inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/25 px-6 text-small font-medium text-ink transition-colors duration-instant hover:border-ink",
  text: "link-draw inline-flex min-h-11 items-center gap-2 text-small font-medium text-ink hover:text-signal-ink",
};

/** A link styled as an action. Labels must say what happens ("Download CV (PDF)"). */
export function Button({ href, children, variant = "primary", download, className }: ButtonProps) {
  const classes = cn(styles[variant], className);

  if (download) {
    return (
      <a href={href} download className={classes}>
        {children}
      </a>
    );
  }
  if (isExternal(href)) {
    const web = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
