import Image from "next/image";
import { profile } from "@/data/profile";
import { contact } from "@/data/scenes";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";

/** Scene 5: one clear action. The only centred composition on the site. */
export function ContactScene() {
  const web = profile.socials.filter((s) => s.icon !== "mail");
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-scene="contact"
      className="on-ink relative overflow-hidden bg-ink text-paper"
    >
      {/* Static lattice poster; hidden while the live field draws it instead. */}
      <div aria-hidden="true" data-poster="" className="pointer-events-none absolute inset-0 opacity-25">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/field/contact.svg" alt="" loading="lazy" className="h-full w-full object-contain" />
      </div>
      <div
        aria-hidden="true"
        className="grain pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_30%,rgb(188_207_194/0.14),transparent)]"
      />

      <div className="container relative flex min-h-[100svh] flex-col items-center justify-center py-24 text-center">
        <h2 id="contact-heading" className="font-serif text-h1 text-paper" data-reveal="">
          {contact.headline.map((line) => (
            <span key={line} className="mask-line">
              <span>{line}</span>
            </span>
          ))}
        </h2>

        <a
          href={`mailto:${profile.email}`}
          className="link-draw mt-10 font-serif text-h2 text-paper hover:text-ice"
        >
          {profile.email}
        </a>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-paper">
          <SocialLinks links={web} className="justify-center [&_a]:text-paper" />
          <Button href={profile.resume} variant="text" download className="text-paper hover:text-ice">
            Download CV (PDF)
          </Button>
        </div>

        <div className="mt-16 flex items-center gap-4 text-left">
          <div className="relative h-28 w-[5.6rem] overflow-hidden rounded-plate">
            <Image src={profile.avatar} alt={profile.avatarAlt} fill sizes="96px" className="object-cover" />
          </div>
          <p className="text-small text-paper/80">
            {profile.name}
            <span className="mt-0.5 block font-mono text-meta text-paper/60">{profile.location}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
