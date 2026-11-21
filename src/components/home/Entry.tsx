import Image from "next/image";
import { EntryProjects } from "./EntryProjects";

/** Centred section title with its "+subtitle" line; both reveal on scroll. */
export function SectionHead({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="home-head">
      <h2 data-reveal="head">{title}</h2>
      <p data-reveal data-reveal-delay="0.1">
        +{subtitle}
      </p>
    </header>
  );
}

const delay = (n: number) => (0.08 * n).toFixed(2);

/**
 * One Experience or Education entry: logo, title and details on the left,
 * numbered points and a closing result line on the right.
 */
export function Entry({
  logoSrc,
  title,
  meta,
  summary,
  tags,
  points,
  result,
  projectSlugs,
}: {
  logoSrc?: string;
  title: string;
  meta: string;
  summary: string;
  tags?: string[];
  projectSlugs?: string[];
  points: { title?: string; text: string }[];
  result?: { label: string; text: string };
}) {
  return (
    <article className="home-job">
      <div className="home-job-side" data-reveal>
        {logoSrc && (
          <Image
            className="home-organization-logo"
            src={logoSrc}
            alt=""
            width={112}
            height={112}
          />
        )}
        <h3>{title}</h3>
        <p className="home-meta">{meta}</p>
        <p className="home-sum">{summary}</p>
        {tags && tags.length > 0 && (
          <ul className="home-stack">
            {tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
      <ol className="home-points">
        {points.map((p, n) => (
          <li key={n} data-reveal data-reveal-delay={delay(n + 1)}>
            <em>#{n + 1}</em> {p.title && <b>{p.title}</b>} {p.text}
          </li>
        ))}
        {result && (
          <li
            className="home-result"
            data-reveal
            data-reveal-delay={delay(points.length + 1)}
          >
            {result.label}: <span>{result.text}</span>
          </li>
        )}
      </ol>
      {projectSlugs && <EntryProjects slugs={projectSlugs} />}
    </article>
  );
}
