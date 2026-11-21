import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Mona_Sans, Work_Sans } from "next/font/google";
import "@/components/anri/anri.css";
import { SmoothScroll } from "@/components/anri/SmoothScroll";
import { Rail } from "@/components/anri/Rail";
import { Clock } from "@/components/anri/Clock";
import { Stamp } from "@/components/anri/Stamp";
import { Parallax } from "@/components/anri/Parallax";
import { Reveal } from "@/components/anri/Reveal";
import { CopyEmail } from "@/components/anri/CopyEmail";
import { Wave } from "@/components/anri/Wave";
import { ProjectArt, artBackground } from "@/components/anri/ProjectArt";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { education } from "@/data/education";
import { achievements } from "@/data/achievements";
import { siteConfig } from "@/data/site";

const body = Work_Sans({ subsets: ["latin"], variable: "--anri-body", display: "swap" });
const display = Mona_Sans({ subsets: ["latin"], variable: "--anri-display", display: "swap" });

export const metadata: Metadata = {
  title: { absolute: `${profile.name} — ${profile.title}` },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#fbfaf8" };

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "works", label: "Works" },
  { id: "background", label: "Background" },
  { id: "contact", label: "Contact" },
];

const focusAreas = ["AI Automation", "Data Pipelines", "LLM Applications", "iOS Development"];

/** Education and achievements in one list, newest first (the exchange appears once). */
function backgroundRows() {
  const educationIds = new Set(education.map((e) => e.id));
  const rows = [
    ...education.map((e) => ({
      id: e.id,
      year: Number(e.graduationYear),
      title: e.grade ? `${e.degree}, ${e.field}, ${e.grade}` : `${e.degree}, ${e.field}`,
      org: e.location.includes("Indonesia") ? e.institution : `${e.institution}, ${e.location.split(", ").pop()}`,
    })),
    ...achievements
      .filter((a) => !educationIds.has(a.id))
      .map((a) => ({ id: a.id, year: a.year, title: a.title, org: a.organization })),
  ];
  return rows.sort((a, b) => b.year - a.year);
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.intro,
    url: siteConfig.url,
    email: profile.email,
    sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };
  const words = profile.name.split(" ");
  const nameLine1 = words.slice(0, 2).join(" ");
  const nameLine2 = words.slice(2).join(" ");
  const city = profile.location.split(",")[0];
  const works = [...projects].sort((a, b) => Number(b.year) - Number(a.year));
  const web = profile.socials.filter((s) => s.href.startsWith("http"));

  return (
    <SmoothScroll>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={`anri ${body.variable} ${display.variable}`}>
        <Rail items={sections} />
        <Clock city={city} timeZone="Asia/Jakarta" />

        <main id="main">
          {/* About */}
          <section className="anri-hero" id="about">
            <div className="anri-col">
              <div className="anri-polaroid">
                <figure>
                  <Parallax strength={-36}>
                    <Image src={profile.avatar} alt={profile.avatarAlt} fill priority sizes="280px" />
                  </Parallax>
                </figure>
                <div className="anri-status">
                  <i aria-hidden="true" />
                  Open for work
                </div>
              </div>
              <h1 className="anri-bio">
                My name is <b>{profile.name}</b>. {profile.tagline} I&apos;m currently building iOS apps at the Apple
                Developer Academy.
              </h1>
              <ul className="anri-chips">
                {focusAreas.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <dl className="anri-figures">
                {profile.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Experience */}
          <section id="experience">
            <div className="anri-col">
              <Reveal as="header" className="anri-head">
                <h2>Experience</h2>
                <p>+Selected Practice &amp; Results</p>
              </Reveal>

              {experience.map((job, i) => {
                const points = job.highlights ?? job.responsibilities.map((text) => ({ title: "", text }));
                const result = job.result ?? job.achievements.join(" ");
                return (
                  <Reveal as="article" className="anri-job" key={job.id}>
                    <div className="anri-job-side">
                      {job.stamp && (
                        <Stamp initials={job.stamp.initials} ring={job.stamp.ring} reverse={i % 2 === 1} />
                      )}
                      <h3>
                        {job.role} — {job.company}
                      </h3>
                      <p className="anri-meta">
                        {job.period} · {job.location.split(",")[0]}
                      </p>
                      <p className="anri-sum">{job.summary}</p>
                      <ul className="anri-stack">
                        {job.technologies.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <ol className="anri-points">
                      {points.map((h, n) => (
                        <li key={n}>
                          <em>#{n + 1}</em> {h.title && <b>{h.title}</b>} {h.text}
                        </li>
                      ))}
                      {result && (
                        <li className="anri-result">
                          As a result: <span>{result}</span>
                        </li>
                      )}
                    </ol>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Works */}
          <section id="works">
            <div className="anri-col">
              <Reveal as="header" className="anri-head">
                <h2>Works</h2>
                <p>+Selected Projects</p>
              </Reveal>
              <div className="anri-works">
                {works.map((p) => (
                  <Reveal as="article" className="anri-work" key={p.slug}>
                    <div className="anri-visual" style={{ background: artBackground[p.slug] ?? "#ece8e3" }}>
                      <Parallax>
                        <ProjectArt slug={p.slug} title={p.title} />
                      </Parallax>
                    </div>
                    <div className="anri-work-info">
                      <h3>{p.title.split(" — ")[0]}</h3>
                      <p className="anri-line">{p.category}</p>
                      <p className="anri-line">@{p.year}</p>
                      <p className="anri-desc">{p.summary}</p>
                      <p className="anri-line">
                        {p.role} · {p.technologies.slice(0, 4).join(", ")}
                      </p>
                      {p.outcomes[0] && (
                        <p className="anri-outcome">
                          {p.outcomes[0].value} — {p.outcomes[0].label}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Background */}
          <section id="background">
            <div className="anri-col">
              <Reveal as="header" className="anri-head">
                <h2>Background</h2>
                <p>+Education &amp; Recognition</p>
              </Reveal>
              <Reveal as="ul" className="anri-rows">
                {backgroundRows().map((r) => (
                  <li key={r.id}>
                    <span className="y">{r.year}</span>
                    <span className="t">{r.title}</span>
                    <span className="o">{r.org}</span>
                  </li>
                ))}
              </Reveal>
            </div>
          </section>
        </main>

        {/* Contact */}
        <footer className="anri-footer" id="contact">
          <div className="anri-grid-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="anri-foot-top">
            <span>{profile.location}</span>
            <span>Available for AI automation and data roles</span>
          </div>
          <div className="anri-foot-body">
            <h2 className="anri-name">
              {nameLine1}
              {nameLine2 && <span>{nameLine2}</span>}
            </h2>
            <div className="anri-reach">
              <CopyEmail email={profile.email} />
              <div className="anri-socials">
                {web.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  Résumé
                </a>
              </div>
            </div>
          </div>
          <Wave />
        </footer>
      </div>
    </SmoothScroll>
  );
}
