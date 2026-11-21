# Implementation plan

How to build the redesign described in [vision.md](vision.md), [design-system.md](design-system.md) and [motion-spec.md](motion-spec.md) on the existing Next.js codebase, in shippable phases.

---

## 1. Stack decision

**Keep Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3 and Vercel.** There is no justification for replacing them:

- Static generation already covers every route.
- The typed data layer (`src/data/*`) maps directly onto the new scenes.
- Vercel auto-deploys from `main`.
- Every new library (GSAP, Lenis, R3F) is designed to work with React client components inside the App Router.

**Tailwind 4 migration: not now.** The redesign changes almost every token. Doing a framework migration in the same pass would mix two kinds of risk. Revisit it after launch.

## 2. Dependencies

| Package | Why | Notes / risk |
| --- | --- | --- |
| `gsap` | Timelines, ScrollTrigger, `matchMedia` | Free under GSAP's standard license, including all plugins (confirm the current terms at install). Tree-shake by importing only `gsap` and `gsap/ScrollTrigger`. |
| `@gsap/react` | `useGSAP` hook: scoped selectors, automatic cleanup | Small. Required by the gsap-react guidance. |
| `lenis` | Smooth scrolling on desktop | Small. Desktop and fine-pointer only (motion-spec §3). |
| `three` | WebGL renderer for the signal field | **The largest addition.** Loaded only in a lazy, home-only chunk, never in the initial bundle. |
| `@react-three/fiber` (v9) | Declarative Three.js in React 19 | v9 is the React 19 compatible line. Pin the exact version at install. |
| `@react-three/drei` | Only `PerformanceMonitor`, `AdaptiveDpr` (import paths per helper) | Optional. If the bundle analyzer shows it pulls in too much, write the two helpers by hand. |
| `@next/bundle-analyzer` (dev) | Verify chunk sizes per phase | Dev only. |

Not added:

- **ScrollSmoother.** Lenis was requested and is lighter.
- **Framer Motion.** One motion system only.
- **Post-processing libraries.**
- **A state library.** The scroll store is a plain mutable module (motion-spec §3).

Fonts change from DM Sans + Plus Jakarta Sans to **Instrument Serif + Plus Jakarta Sans + JetBrains Mono**, all through `next/font/google` (no new package).

## 3. Target file structure

New and changed paths only.

```
src/
  app/
    layout.tsx                 # fonts, MotionProvider, header/footer
    page.tsx                   # home: scene composition
    projects/[slug]/page.tsx   # CaseStudy layout
  components/
    motion/
      MotionProvider.tsx       # "use client": GSAP registration, Lenis lifecycle, route-change refresh
      useSceneTimeline.ts      # useGSAP + gsap.matchMedia helper
      scrollStore.ts           # { scene, progress, velocity } shared with the field
      TextMask.tsx             # line-split mask reveal (hero, page h1)
    scenes/
      ArrivalScene.tsx         # server component + client director child
      MethodScene.tsx
      WorkScene.tsx            # wraps ProjectChapter x3
      TrajectoryScene.tsx
      RecognitionScene.tsx
      ContactScene.tsx
    field/
      SignalField.tsx          # "use client", R3F Canvas, lazy-loaded
      FieldPoints.tsx          # Points + ShaderMaterial
      targets.ts               # deterministic target layouts (typed arrays)
      field.vert.glsl / field.frag.glsl
      FieldPoster.tsx          # <picture> fallback per scene state
      tier.ts                  # device/performance tier detection
    ui/                        # Headline, Meta, StepList, Button, Plate, Timeline (restyled)
  data/
    scenes.ts                  # scene copy + CV-sourced numbers used by Method scene
public/
  images/field/                # posters: arrival, method, seagis, hiroop, emodu, trajectory, contact (.avif + .webp)
docs/portfolio-redesign/       # these documents
```

`src/data/scenes.ts` holds every number shown in scenes, each with a comment naming its CV source line. Scenes import from it; no component hard-codes a figure.

## 4. Phases

Each phase lands as its own PR to `main` and deploys to a Vercel preview first. The site stays fully working after every phase.

### Phase 0: Content fixes and asset prep (small, no design change)

- Fix stale copy:
  - `src/app/experience/page.tsx` description (it still describes the previous owner's roles)
  - generic headings ("Building systems that last", "Learn more about me")
- Re-export `public/images/avatar.jpeg`: crop to 4:5 at 1600px long edge. Today it is 6240×4160 / 4.2 MB.
- Collect from Calzy (vision §8):
  - project screenshots
  - GitHub or demo links
  - problem statements
  - Seagis outcome
  - approval of scene copy
- Add `@next/bundle-analyzer` and record baseline Lighthouse and bundle numbers.

**Done when:** no copy references roles Calzy didn't hold; avatar < 400 KB; baseline metrics recorded in the PR description.

### Phase 1: Design foundation

- Tokens:
  - `tailwind.config.ts`: colours (`paper`, `ink`, `ink-2`, `ink-3`, `rule`, `ice`, `sage`, `signal`, `signal-ink`), the type scale, grid container and radius tokens.
  - `layout.tsx`: fonts (`--font-serif`, `--font-sans`, `--font-mono`).
- `globals.css`:
  - remove `.eyebrow`, `.card` and `.reveal`
  - add base typography, focus styles and grain texture
- UI primitives: `Headline`, `Meta`, `Button`, `StepList`, `Plate`, `Timeline`.
- Update `icon.svg`, `opengraph-image.tsx` and the project covers to the new palette and type.

**Done when:**
- All pages render with the new type and colour.
- Contrast matches the design-system table.
- No uppercase eyebrow labels remain.
- Lighthouse accessibility ≥ 95.

### Phase 2: Static page redesign (no scroll motion yet)

- Rebuild the home page as static scenes: Arrival, Method, Work, Trajectory, Recognition, Contact. Each shows its final-state `FieldPoster` image (temporary placeholder posters are fine).
- Rebuild the other pages:
  - `/projects` as an index of rows
  - `/projects/[slug]` as a `CaseStudy` (keep the "hide empty sections" logic)
  - `/experience` and `/education` with the unified `Timeline`
  - `/achievements` restyled
- Remove `Reveal` usage everywhere. Keep the component file until phase 3 lands, then delete it.

**Done when:**
- Every page is complete and good-looking with JS disabled.
- Responsive from 320px to 1920px with no horizontal scroll.
- Every number on screen traces to `src/data/*`.

### Phase 3: Motion infrastructure and scroll scenes (DOM only)

- Install `gsap`, `@gsap/react` and `lenis`.
- `MotionProvider`:
  - plugin registration
  - Lenis on desktop with a fine pointer (motion-spec §3)
  - ticker sync
  - route-change reset
  - `ScrollTrigger.refresh()` after `document.fonts.ready`
  - anchor and focus handling
- Scene directors for each home scene using `gsap.matchMedia` (desktop / compact / reduced). Drive DOM parts only: hero mask reveal, step list activation, chapter text swaps, horizontal trajectory track, contact background crossfade. Write `scene` / `progress` to `scrollStore` even though nothing reads it yet.
- `TextMask` for page `h1` reveals on sub-pages.

**Done when:**
- Desktop scenes scrub smoothly with no jank: Chrome Performance shows < 4 ms of scripting per frame while scrolling.
- Reduced motion shows the static phase-2 layout.
- Tab order reaches every link inside pinned scenes.
- Fewer than 15 ScrollTriggers on the home page.

### Phase 4: 3D signal field

- Install `three` and `@react-three/fiber`, plus the `drei` helpers if they are kept.
- `targets.ts`: deterministic layouts for arrival noise, pipeline lanes, Seagis grid, Hiroop terrain plus 5 clusters, Emodu cloud with 112 marked points, trajectory line and contact lattice. Unit-test them for the expected counts.
- `FieldPoints` shader: morph between targets via uniforms, curl-noise, round points, `ice` → `sage` screen tint, `signal` highlight by group.
- `SignalField` canvas:
  - fixed and `aria-hidden`
  - `frameloop="demand"`
  - lazy `next/dynamic` import, deferred to idle
  - posters until ready, then a crossfade
- `tier.ts` + `PerformanceMonitor`: High / Default / Compact / Low tiers. Low and reduced motion use posters only.
- Render the final posters from the real target layouts (replace the phase-2 placeholders). Reuse them as the `/projects` plates and in the OG image if suitable.

**Done when:**
- Home LCP element is still the hero `h1`.
- The 3D chunk is absent from the initial JS (bundle analyzer).
- The canvas pauses when hidden or covered.
- ≥ 55 fps on a mid-range laptop, ≥ 30 fps on a mid-range phone.
- No WebGL errors.
- Memory is released after navigating away from home.

### Phase 5: Case study polish

- `/projects/[slug]`:
  - opening plate (the project's field poster, or a real screenshot when supplied)
  - editorial article layout
  - sticky facts column
  - `TextMask` on the title
  - gallery restyle
- Add GitHub and demo links and real screenshots if Calzy supplied them in phase 0.

**Done when:** each case study reads well on mobile and desktop; sections without data stay hidden; "Illustrative" labels appear wherever a visual is not real data.

### Phase 6: QA and launch

- Run the `web-design-guidelines` skill against all pages.
- Run the `vercel-react-best-practices` skill on motion and field code (client boundaries, bundle, effects).
- Test matrix:
  - Chrome, Safari, Firefox on desktop
  - iOS Safari and Android Chrome
  - keyboard-only
  - VoiceOver
  - 200% zoom
  - reduced motion
  - JS disabled
  - slow 4G with CPU throttling
- Lighthouse / Vercel Speed Insights on the preview deployment:
  - mobile LCP < 2.5 s
  - CLS < 0.05
  - INP < 200 ms
  - accessibility ≥ 95
- Merge to `main`. Vercel deploys production automatically.

## 5. Performance budget

| Metric | Budget |
| --- | --- |
| Initial JS on `/` (gzipped, excluding the lazy 3D chunk) | ≤ 180 KB. The current baseline is ~113 KB first-load JS; GSAP + Lenis + providers should add well under 70 KB, to be confirmed by the analyzer. |
| Lazy 3D chunk (three + R3F + field) | Measure in phase 4; target ≤ 250 KB gzipped. If it is higher, drop `drei` and import Three.js modules selectively. |
| Fonts | 3 families, subset `latin`, ≤ 6 font files total. Instrument Serif 400 normal (+ italic only if used), Jakarta 400/500/600, JetBrains Mono 400/500. |
| Posters | ≤ 80 KB each (AVIF), ≤ 7 posters |
| LCP (mobile, 4G) | < 2.5 s, LCP element = hero `h1` |
| CLS | < 0.05 (posters and canvas reserve identical boxes) |
| INP | < 200 ms |
| Scroll frame | < 4 ms scripting, no long tasks while scrolling |

## 6. Risks and mitigations

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| **3D hurts LCP or battery on phones** | High if unmanaged | Lazy idle import; posters first; tiering; `frameloop="demand"`; posters-only on low tier, `saveData` and reduced motion. |
| **Lenis breaks keyboard, anchor or focus scrolling** | Medium | Desktop-only; explicit anchor and `focusin` handling; keyboard tests in phase 3 acceptance. Fallback: ship without Lenis (native scrolling works with ScrollTrigger as-is). |
| **Pinned scenes feel like scroll-jacking or confuse readers** | Medium | Moderate pin lengths (≤ 250%), no snapping on desktop, no pins on mobile, content readable at every progress point. |
| **ScrollTrigger miscalculates after font load, images or route changes** | Medium | One `refresh()` after `document.fonts.ready`; debounced resize refresh; triggers created in page order (or `refreshPriority`); `useGSAP` cleanup on unmount. |
| **Hydration mismatches from motion code** | Low | Scenes are server components; motion lives in client children that only touch DOM after mount; no `window` access during render. |
| **Visual metaphors drift from facts** | Medium | All figures in `src/data/scenes.ts` with source comments; "Illustrative" captions; Calzy approves scene copy (vision §8). |
| **WebGL unavailable or context lost** | Low | Error boundary around the canvas falls back to posters; listen for `webglcontextlost`. |
| **Bundle creep from drei / three** | Medium | Bundle analyzer gate in phases 3–4; per-helper imports; drop drei if needed. |
| **Instrument Serif has a single weight** | Certain | Hierarchy comes from size, space and the sans/mono contrast, not weight. Never fake-bold it (`font-synthesis: none`). |
| **Scope creep** | Medium | Phases ship independently. Phases 4–5 can slip without blocking the static redesign (phase 2) from going live. |

## 7. Open questions (need Calzy's input before phase 1)

1. Approve the palette shift: `paper` background, `ice` / `sage` as gradient light, Vermillion as signal only.
2. Hero portrait: move it to the Contact scene, or keep a small portrait in the hero?
3. Approve the draft headline copy and the four Method stage names.
4. Supply screenshots, links, problem statements and the Seagis outcome, if available.
5. Keep `/education` and `/achievements` as separate routes (current plan), or merge them into one `/about` page later?

## 8. Implementation notes (as built)

Deviations from the spec, and why:

| Spec | As built | Reason |
| --- | --- | --- |
| Each Selected-work chapter pins for `+=150%` | Chapters scroll normally; only the fixed 3D field morphs between them | The field is already fixed, so the scene feels held without extra scroll distance. Less scroll-jacking. |
| Method pin `+=250%` | `+=150%`, starting at `bottom bottom` when the scene is taller than the screen | Keeps the headline readable before the pin; shorter hold. |
| Trajectory as a pinned horizontal track | Five-column timeline whose rail draws itself (scrubbed, no pin) | With five entries the track barely moved, and keyboard focus could land on clipped items. |
| `FieldPoster` as AVIF/WebP files | `/field/<state>.svg` generated at build time from the same layouts (route handler, `force-static`) | Posters always match the live field; about 12 KB each over gzip. |
| Compact (tablet/phone) live field tier | Live field only at ≥ 1024px; posters elsewhere | Simpler, and protects phone battery and LCP. |
| `drei` helpers | Not used; adaptive quality is hand-written (DPR → half the points → posters) | Smaller 3D chunk. |

Single animation loop: GSAP's ticker drives Lenis, ScrollTrigger and the R3F render (`frameloop="never"` + `advance()`).

Testing motion on a machine with Reduce Motion on (development only): run `localStorage.debugMotion = "1"` in the console and reload. Remove it with `localStorage.removeItem("debugMotion")`.

Measured (production build): home first-load JS 163 KB; lazy 3D chunks ≈ 240 KB gzipped (three + R3F), loaded only when the live field runs.
