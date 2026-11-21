import { profile } from "@/data/profile";
import { displayName } from "@/data/home";
import { FooterReveal } from "./FooterReveal";

/** The dark contact footer: the big name and every way to reach out. Shared by all pages. */
export function SiteFooter() {
  const [firstName, lastName] = displayName.split(" ");
  const mail = profile.socials.find((s) => s.href.startsWith("mailto:"));
  const web = profile.socials.filter((s) => s.href.startsWith("http"));

  return (
    <FooterReveal>
      <h2 className="home-bigname home-name">
        <span>{firstName}</span>
        <span>{lastName}</span>
      </h2>
      <div className="home-reach">
        <p className="home-reach-title">Get in touch</p>
        <div className="home-socials">
          {mail && <a href={mail.href}>Email</a>}
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
    </FooterReveal>
  );
}
