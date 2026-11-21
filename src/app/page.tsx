import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Mona_Sans, Work_Sans } from "next/font/google";
import "@/components/home/home.css";
import { SmoothScroll } from "@/components/home/SmoothScroll";
import { Rail } from "@/components/home/Rail";
import { Clock } from "@/components/home/Clock";
import { Entry, SectionHead } from "@/components/home/Entry";
import { Parallax } from "@/components/home/Parallax";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { Wave } from "@/components/home/Wave";
import { ProjectArt, artBackground } from "@/components/home/ProjectArt";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { education } from "@/data/education";
import { achievements } from "@/data/achievements";
import { siteConfig } from "@/data/site";

const body = Work_Sans({
  subsets: ["latin"],
  variable: "--home-body",
  display: "swap",
});
const display = Mona_Sans({
  subsets: ["latin"],
  variable: "--home-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: `${profile.name} — ${profile.title}` },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "works", label: "Works" },
  { id: "education", label: "Education" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
];

/** The name shown on the page (the full legal name stays in profile.name for metadata). */
const displayName = "Calzy Indyramdhani";

const focusAreas = [
  "AI/ML Engineer",
  "Data Engineer",
  "Software Automation",
  "iOS Development",
  "Game Development",
  "Product Research",
];

/** "Bandung, Indonesia" → "Bandung". */
const city = (location: string) => location.split(",")[0];

/** Awards and roles, newest first (the exchange already shows under Education). */
function recognitionRows() {
  const educationIds = new Set(education.map((e) => e.id));
  return achievements
    .filter((a) => !educationIds.has(a.id))
    .sort((a, b) => b.year - a.year)
    .map((a) => ({
      id: a.id,
      year: a.year,
      title: a.title,
      org: a.organization,
    }));
}

export default function HomePage() {
  const mail = profile.socials.find((s) => s.href.startsWith("mailto:"));
  const web = profile.socials.filter((s) => s.href.startsWith("http"));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.intro,
    url: siteConfig.url,
    email: mail?.href.replace("mailto:", ""),
    sameAs: web.map((s) => s.href),
  };
  const [firstName, lastName] = displayName.split(" ");
  const works = [...projects].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`home ${body.variable} ${display.variable}`}>
        <Rail items={sections} />
        <Clock
          city={city(profile.location)}
          country="Indonesia"
          timeZone="Asia/Jakarta"
        />

        <main id="main">
          {/* About: the name on the left, portrait and intro on the right */}
          <section className="home-hero" id="about">
            <div className="home-hero-name">
              <h1 className="home-bigname">
                <span>{firstName}</span>
                <span>{lastName}</span>
              </h1>
            </div>
            <div className="home-hero-intro">
              <div className="home-polaroid">
                <figure>
                  <Parallax strength={-36}>
                    <Image
                      src={profile.avatar}
                      alt={profile.avatarAlt}
                      fill
                      priority
                      sizes="280px"
                    />
                  </Parallax>
                </figure>
              </div>
              <p className="home-bio">
                My name is {displayName}. {profile.tagline} I&apos;m currently
                building iOS apps at Apple Developer Academy @ UC Jakarta.
              </p>
              <ul className="home-chips">
                {focusAreas.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Experience */}
          <section id="experience">
            <div className="home-col">
              <SectionHead
                title="Experience"
                subtitle="Selected Practice & Results"
              />

              {experience.map((job, i) => {
                const result = job.result ?? job.achievements.join(" ");
                return (
                  <Entry
                    key={job.id}
                    stamp={job.stamp}
                    reverse={i % 2 === 1}
                    title={`${job.role} — ${job.company}`}
                    meta={`${job.period} · ${city(job.location)}`}
                    summary={job.summary}
                    tags={job.technologies}
                    points={
                      job.highlights ??
                      job.responsibilities.map((text) => ({ text }))
                    }
                    result={
                      result
                        ? { label: "As a result", text: result }
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </section>

          {/* Works */}
          <section id="works">
            <div className="home-col">
              <SectionHead title="Works" subtitle="Selected Projects" />
              <div className="home-works">
                {works.map((p) => (
                  <article
                    className="home-work"
                    key={p.slug}
                    data-reveal="card"
                  >
                    <div
                      className="home-visual"
                      style={{ background: artBackground[p.slug] ?? "#f1efec" }}
                    >
                      <Parallax>
                        <ProjectArt slug={p.slug} title={p.title} />
                      </Parallax>
                    </div>
                    <div className="home-work-info">
                      <h3>{p.title.split(" — ")[0]}</h3>
                      <p className="home-line">{p.category}</p>
                      <p className="home-line">@{p.year}</p>
                      <p className="home-desc">{p.summary}</p>
                      <p className="home-line">
                        {p.role} · {p.technologies.slice(0, 4).join(", ")}
                      </p>
                      {p.outcomes[0] && (
                        <p className="home-outcome">
                          {p.outcomes[0].value} — {p.outcomes[0].label}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Education: same layout as Experience */}
          <section id="education">
            <div className="home-col">
              <SectionHead
                title="Education"
                subtitle="Degrees & Exchange"
              />

              {education.map((ed, i) => (
                <Entry
                  key={ed.id}
                  stamp={ed.stamp}
                  reverse={i % 2 === 1}
                  title={`${ed.degree}, ${ed.field} — ${ed.institution}`}
                  meta={`${ed.period} · ${city(ed.location)}`}
                  summary={ed.summary}
                  // Coursework shows as tags, or as the only point when there are no highlights.
                  tags={ed.highlights.length ? ed.coursework : undefined}
                  points={
                    ed.highlights.length
                      ? ed.highlights.map((text) => ({ text }))
                      : ed.coursework?.length
                        ? [
                            {
                              text: `Coursework in ${ed.coursework.join(", ")}.`,
                            },
                          ]
                        : []
                  }
                  result={
                    ed.grade
                      ? { label: "Graduated with", text: ed.grade }
                      : undefined
                  }
                />
              ))}
            </div>
          </section>

          {/* Recognition */}
          <section id="recognition" className="pt-12">
            <div className="home-col">
              <SectionHead title="Recognition" subtitle="Awards & Roles" />
              <ul className="home-rows">
                {recognitionRows().map((r, n) => (
                  <li
                    key={r.id}
                    data-reveal
                    data-reveal-delay={(0.04 * (n % 3)).toFixed(2)}
                  >
                    <span className="y">{r.year}</span>
                    <span className="t">{r.title}</span>
                    <span className="o">{r.org}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        {/* Contact */}
        <footer className="home-footer" id="contact">
          <div className="home-grid-lines" aria-hidden="true">
            <span />
          </div>
          <div className="home-foot-body">
            <h2 className="home-bigname home-name" data-reveal="head">
              <span>{firstName}</span>
              <span>{lastName}</span>
            </h2>
            <div className="home-reach" data-reveal data-reveal-delay="0.15">
              <div className="home-socials">
                {mail && <a href={mail.href}>Email</a>}
                {web.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                ))}
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Résumé
                </a>
              </div>
            </div>
          </div>
          <Wave />
        </footer>
      </div>
      <ScrollReveal />
    </SmoothScroll>
  );
}
