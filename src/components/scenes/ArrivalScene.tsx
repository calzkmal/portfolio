import { profile } from "@/data/profile";
import { hero } from "@/data/scenes";
import { Button } from "@/components/ui/Button";
import { Plate } from "@/components/ui/Plate";

/** Scene 0: who Calzy is and what he builds, in under five seconds. */
export function ArrivalScene() {
  const parts = profile.name.split(" ");
  const lines = [parts.slice(0, -1).join(" "), parts[parts.length - 1]];

  return (
    <section
      id="arrival"
      aria-labelledby="arrival-heading"
      data-scene="arrival"
      className="container grid min-h-[calc(100svh-4rem)] items-center gap-10 pb-16 pt-8 lg:grid-cols-12 lg:gap-6 lg:pb-24"
    >
      <div className="lg:col-span-7">
        <h1 id="arrival-heading" className="font-serif text-display text-ink">
          {lines.map((line) => (
            <span key={line} className="mask-line">
              <span data-intro="line">{line}</span>
            </span>
          ))}
        </h1>

        <p data-intro="fade" className="mt-8 max-w-lead text-lead text-ink">
          {hero.statement}
        </p>
        <p data-intro="fade" className="mt-4 max-w-lead text-ink-2">
          {profile.intro}
        </p>

        <div data-intro="fade" className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href="#work">See selected work</Button>
          <Button href={profile.resume} variant="text" download>
            Download CV (PDF)
          </Button>
        </div>

        <dl data-intro="fade" className="mt-12 grid gap-1 font-mono text-meta text-ink-3 sm:grid-cols-[auto_1fr] sm:gap-x-4">
          <dt>Now</dt>
          <dd className="text-ink">{hero.now}</dd>
          <dt>Based in</dt>
          <dd className="text-ink">{profile.location}</dd>
        </dl>
      </div>

      <div className="lg:col-span-5" aria-hidden="true">
        <Plate src="/field/arrival.svg" alt="" poster priority ratio="aspect-square" />
      </div>
    </section>
  );
}
