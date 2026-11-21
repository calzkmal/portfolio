"use client";

import { useRef } from "react";
import { FIELD_STATES, type FieldState } from "@/data/scenes";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "./gsap";
import { scrollStore } from "./scrollStore";

const idx = (s: FieldState) => FIELD_STATES.indexOf(s);

/**
 * Attaches every scroll-driven timeline on the home page (motion-spec §4).
 * Renders nothing; the scenes stay server components and readable without it.
 */
export function HomeDirector() {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const main = document.getElementById("main");
      if (!main) return;
      const q = <T extends Element = HTMLElement>(sel: string) => Array.from(main.querySelectorAll<T & Element>(sel)) as T[];
      const one = <T extends Element = HTMLElement>(sel: string) => main.querySelector(sel) as T | null;

      // ------------------------------------------------------------ field segments
      // The 3D field reads a continuous position along FIELD_STATES from these.
      scrollStore.reset();
      const segment = (trigger: Element | null, from: FieldState, to: FieldState, start: string, end: string) => {
        if (!trigger) return;
        const st = ScrollTrigger.create({
          trigger,
          start,
          end,
          onUpdate: () => (scrollStore.dirty = true),
        });
        scrollStore.segments.push({ delta: idx(to) - idx(from), progress: () => st.progress });
      };
      // Arrival → pipeline is split: the hero scroll-out starts the morph, Method's arrival finishes it.
      const arrival = one("#arrival");
      const methodEl = one("#method");
      if (arrival && methodEl) {
        const a = ScrollTrigger.create({ trigger: arrival, start: "top top", end: "bottom top", onUpdate: () => (scrollStore.dirty = true) });
        const b = ScrollTrigger.create({ trigger: methodEl, start: "top 60%", end: "top top", onUpdate: () => (scrollStore.dirty = true) });
        scrollStore.segments.push({ delta: 0.4, progress: () => a.progress });
        scrollStore.segments.push({ delta: 0.6, progress: () => b.progress });
      }
      segment(one("[data-chapter='seagis']"), "pipeline", "seagis", "top 85%", "top 25%");
      const hiroop = one("[data-chapter='hiroop']");
      segment(hiroop, "seagis", "hiroop", "top 85%", "top 25%");
      segment(hiroop, "hiroop", "hiroop-classes", "top 10%", "center top");
      segment(one("[data-chapter='emodu']"), "hiroop-classes", "emodu", "top 85%", "top 25%");
      segment(one("#trajectory"), "emodu", "trajectory", "top 90%", "top 20%");
      const contactEl = one("#contact");
      segment(contactEl, "trajectory", "contact", "top 90%", "top 25%");
      if (contactEl) {
        const dark = ScrollTrigger.create({ trigger: contactEl, start: "top 80%", end: "top 30%", onUpdate: () => (scrollStore.dirty = true) });
        scrollStore.darkProgress = () => dark.progress;
      }

      const counter0 = one("#method [data-counter]");
      const mm = gsap.matchMedia();

      // ------------------------------------------------------------ desktop
      mm.add(MEDIA.desktop, () => {
        headlineReveals(q("[data-reveal]"));

        // Method: pinned narrative, steps activate as the pin is scrubbed.
        const pin = one("#method [data-pin]");
        const steps = q("#method [data-step]");
        const counter = one("#method [data-counter]");
        if (pin && steps.length) {
          const target = Number(counter?.dataset.counter ?? 0);
          const count = { value: 0 };
          if (counter) counter.textContent = "0";
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pin,
              // If the scene is taller than the screen, pin once its end is visible.
              start: () => (pin.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
              end: "+=150%",
              invalidateOnRefresh: true,
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => setActiveStep(steps, Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
              onLeaveBack: () => setActiveStep(steps, -1),
            },
          });
          if (counter) {
            tl.fromTo(
              count,
              { value: 0 },
              {
                value: target,
                ease: "none",
                duration: 0.25,
                onUpdate: () => (counter.textContent = String(Math.round(count.value))),
              },
              0.2,
            );
          }
          tl.to({}, { duration: 1 - (counter ? 0.45 : 0) }); // hold the pin for the remaining steps
        }

        trajectoryRail(one("#trajectory [data-rail]"), "x");
      });

      // ------------------------------------------------------------ tablet and phone
      mm.add(MEDIA.compact, () => {
        headlineReveals(q("[data-reveal]"));
        trajectoryRail(one("#trajectory [data-rail]"), "y");
        // No pins: each step becomes active as it reaches the middle of the screen.
        const steps = q("#method [data-step]");
        steps.forEach((step, i) =>
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => self.isActive && setActiveStep(steps, i),
          }),
        );
      });

      // Reduced motion: nothing animates. Content is already fully visible.
      return () => {
        mm.revert();
        if (counter0) counter0.textContent = counter0.dataset.counter ?? "";
        scrollStore.reset();
      };
    },
    { scope },
  );

  return <span ref={scope} hidden />;
}

/** Mask reveal for scene headlines, once, as they enter the viewport. */
function headlineReveals(headlines: HTMLElement[]) {
  headlines.forEach((h) => {
    const lines = h.querySelectorAll(".mask-line > span");
    gsap.from(lines, {
      yPercent: 105,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: h, start: "top 85%", once: true },
    });
  });
}

function setActiveStep(steps: HTMLElement[], active: number) {
  steps.forEach((step, i) => {
    if (i === active) {
      step.setAttribute("data-active", "");
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("data-active");
      step.removeAttribute("aria-current");
    }
  });
}

/** Trajectory: the timeline rail draws itself as the section is scrolled (scrubbed, no pin). */
function trajectoryRail(rail: HTMLElement | null, axis: "x" | "y") {
  if (!rail) return;
  const prop = axis === "x" ? "scaleX" : "scaleY";
  gsap.fromTo(
    rail,
    { [prop]: 0 },
    {
      [prop]: 1,
      ease: "none",
      scrollTrigger: { trigger: rail.parentElement, start: "top 75%", end: axis === "x" ? "top 35%" : "bottom 60%", scrub: 0.6 },
    },
  );
}
