import type { ReactNode } from "react";
import { Headline } from "./Headline";

/** Opening block for sub-pages: one serif h1 and a short description. */
export function PageIntro({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="container pb-14 pt-16 sm:pb-20 sm:pt-28">
      <div className="max-w-4xl">
        <Headline as="h1" size="h1" intro>
          {title}
        </Headline>
        {description && (
          <p data-intro="fade" className="mt-6 max-w-lead text-lead text-ink-2">
            {description}
          </p>
        )}
      </div>
      {children && <div className="mt-10">{children}</div>}
    </header>
  );
}
