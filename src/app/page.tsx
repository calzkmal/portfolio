import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "@/components/home/home.css";
import { SmoothScroll } from "@/components/home/SmoothScroll";
import { Rail } from "@/components/home/Rail";
import { Clock } from "@/components/home/Clock";
import { Entry, SectionHead } from "@/components/home/Entry";
import { Parallax } from "@/components/home/Parallax";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { StickyEntries } from "@/components/home/StickyEntries";
import { Statement } from "@/components/home/Statement";
import { SiteFooter } from "@/components/home/SiteFooter";
import { ReturnPoint } from "@/components/home/ReturnPoint";
import { bodyFont, displayFont } from "@/components/home/fonts";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { achievements } from "@/data/achievements";
import { siteConfig } from "@/data/site";
import { displayName, focusAreas, entryProjects } from "@/data/home";

export const metadata: Metadata = {
  title: { absolute: siteConfig.siteName },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
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

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`home ${bodyFont.variable} ${displayFont.variable}`}>
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
                My name is {displayName}. I&apos;m currently building iOS apps
                at Apple Developer Academy @ UC Jakarta.
              </p>
              <ul className="home-chips">
                {focusAreas.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </section>

          <Statement text={profile.tagline} />

          {/* Experience */}
          <section id="experience">
            <StickyEntries
              heading={<SectionHead title="Experience" subtitle="Selected Practice & Results" />}
              count={experience.length}
            >

              {experience.map((job) => {
                const result = job.result ?? job.achievements.join(" ");
                return (
                  <Entry
                    key={job.id}
                    logoSrc={job.logoSrc}
                    title={`${job.role} — ${job.company}`}
                    meta={`${job.period} · ${city(job.location)}`}
                    summary={job.summary}
                    tags={job.technologies}
                    projectSlugs={entryProjects[job.id]}
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
            </StickyEntries>
          </section>

          <section id="education">
            <StickyEntries
              heading={<SectionHead title="Education" subtitle="Degrees & Exchange" />}
              count={education.length}
            >

              {education.map((ed) => (
                <Entry
                  key={ed.id}
                  logoSrc={ed.logoSrc}
                  title={`${ed.degree}, ${ed.field} — ${ed.institution}`}
                  meta={`${ed.period} · ${city(ed.location)}`}
                  summary={ed.summary}
                  projectSlugs={entryProjects[ed.id]}
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
            </StickyEntries>
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
        <div id="contact" aria-hidden="true" />

        <SiteFooter />
      </div>
      <ScrollReveal />
      <ReturnPoint />
    </SmoothScroll>
  );
}
