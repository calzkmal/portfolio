import type { SocialLink } from "@/types";
import { cn, isExternal } from "@/lib/utils";
import { SocialIcon } from "./icons";

/** Social profiles as labelled text links (icon + name). */
export function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            {...(isExternal(link.href) && link.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="link-draw inline-flex min-h-11 items-center gap-2 text-small font-medium"
          >
            <SocialIcon name={link.icon} className="h-4 w-4" />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
