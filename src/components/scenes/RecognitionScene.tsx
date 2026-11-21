import { achievements } from "@/data/achievements";
import { Button } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";

/** Scene 4: outside proof. A deliberate rest beat: no scroll motion here. */
export function RecognitionScene() {
  const items = [...achievements].sort((a, b) => b.year - a.year);
  return (
    <section id="recognition" aria-labelledby="recognition-heading" data-scene="recognition" className="container py-24 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <Headline id="recognition-heading">Recognition</Headline>
          <Button href="/achievements" variant="text" className="mt-6">
            See all achievements
          </Button>
        </div>
        <ol className="lg:col-span-8">
          {items.map((item) => (
            <li key={item.id} className="grid gap-1 border-t border-rule py-5 sm:grid-cols-[5rem_1fr] sm:gap-6">
              <span className="font-mono text-meta tabular-nums text-ink-3">{item.year}</span>
              <div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-0.5 text-small text-ink-2">{item.organization}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
