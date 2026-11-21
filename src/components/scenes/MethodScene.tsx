import { method } from "@/data/scenes";
import { Headline } from "@/components/ui/Headline";
import { MetaList } from "@/components/ui/Meta";
import { Plate } from "@/components/ui/Plate";
import { StepList } from "@/components/ui/StepList";

/** Scene 1: one production system, told through its real sequence of stages. */
export function MethodScene() {
  const job = method.company;
  return (
    <section id="method" aria-labelledby="method-heading" data-scene="method" className="relative">
      <div data-pin className="container grid gap-12 py-24 lg:min-h-screen lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-20">
        <div className="lg:col-span-6">
          <Headline id="method-heading" lines={method.headline} />
          <p className="mt-6 max-w-lead text-lead text-ink-2">{method.intro}</p>
          <MetaList
            className="mt-8"
            items={[
              { label: "Role", value: job.role },
              { label: "Period", value: job.period },
            ]}
          />
          <StepList steps={method.steps} className="mt-10" />
        </div>

        <figure className="lg:col-span-5 lg:col-start-8">
          <Plate src="/field/pipeline.svg" alt="" poster ratio="aspect-[4/3]" />
          <figcaption className="mt-4 flex items-baseline gap-3 border-t border-rule pt-4">
            <span className="font-serif text-h2 tabular-nums text-ink">
              <span aria-hidden="true">~</span>
              <span data-counter={method.scrapingCostCut} aria-hidden="true">
                {method.scrapingCostCut}
              </span>
              <span aria-hidden="true">%</span>
              <span className="sr-only">About {method.scrapingCostCut}%</span>
            </span>
            <span className="text-small text-ink-2">lower web scraping cost</span>
          </figcaption>
          <p className="mt-2 font-mono text-meta text-ink-3">Pipeline diagram is illustrative</p>
        </figure>
      </div>
    </section>
  );
}
