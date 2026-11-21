import Link from "next/link";
import { trajectory } from "@/data/scenes";
import { Headline } from "@/components/ui/Headline";
import { cn } from "@/lib/utils";

/** Scene 3: experience and education as one timeline, oldest first. */
export function TrajectoryScene() {
  return (
    <section id="trajectory" aria-labelledby="trajectory-heading" data-scene="trajectory" className="relative">
      <div className="flex flex-col justify-center py-24 lg:min-h-[80vh]">
        <div className="container">
          <Headline id="trajectory-heading" lines={["Where I've worked", "and studied"]} />
        </div>

        <div className="container mt-14">
          <ol data-track className="relative grid lg:grid-cols-5">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[3px] top-0 w-px bg-rule lg:bottom-auto lg:left-0 lg:right-0 lg:top-0 lg:h-px lg:w-auto"
            />
            <span
              aria-hidden="true"
              data-rail=""
              className="absolute bottom-0 left-[3px] top-0 w-px origin-top bg-ink lg:bottom-auto lg:left-0 lg:right-0 lg:top-0 lg:h-px lg:w-auto lg:origin-left"
            />
            {trajectory.map((entry) => (
              <li key={entry.id} data-node="" className="group relative pb-10 pl-8 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-10">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full lg:-top-[3px]",
                    entry.current ? "bg-signal" : "bg-ink",
                  )}
                />
                <p className="font-mono text-meta tabular-nums text-ink-3">
                  {entry.period}
                  {entry.current && <span className="ml-2 text-signal-ink">Now</span>}
                </p>
                <h3 className="mt-2 text-[1.1875rem] font-semibold leading-snug text-ink">
                  <Link href={entry.href} className="link-draw">
                    {entry.title}
                  </Link>
                </h3>
                <p className="mt-1 text-ink-2">{entry.place}</p>
                <p className="mt-1 text-meta text-ink-3">{entry.kind === "Work" ? "Work" : "Study"}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
