import { cn } from "@/lib/utils";

export interface Step {
  title: string;
  detail: string;
}

/** A real sequence (pipeline stages). The scroll director sets `data-active`. */
export function StepList({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn("space-y-1", className)} data-steps="">
      {steps.map((step, i) => (
        <li
          key={step.title}
          data-step={i}
          className="group grid grid-cols-[2rem_1fr] gap-x-3 border-t border-rule py-4"
        >
          <span className="relative pt-1 font-mono text-meta tabular-nums text-ink-3">
            {i + 1}
            <span
              aria-hidden="true"
              className="absolute -left-4 top-[0.6rem] h-1.5 w-1.5 rounded-full bg-signal opacity-0 transition-opacity duration-quick group-data-[active]:opacity-100"
            />
          </span>
          <div>
            <h3 className="text-h3 font-semibold text-ink">{step.title}</h3>
            <p className="mt-1 max-w-measure text-small text-ink-2">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
