# Motion specification

Scroll scenes, 3D behaviour and responsive motion rules. See [vision.md](vision.md) §5 for the scene list and [design-system.md](design-system.md) for layout.

---

## 1. Motion principles

1. **Scenes, not effects.** The home page is one continuous timeline that the reader scrubs by scrolling. Each section is a scene in that timeline, and the 3D field is the thread through all of them.
2. **One orchestrated entrance.** The only autoplaying, non-scroll motion is the page-load sequence in scene 0. Nothing else fades up "because it entered the viewport".
3. **Motion explains processing.** Every transformation in the field corresponds to an operation from the work: filter, route, align, extract, cluster, evaluate. If a motion does not map to one, it is cut.
4. **Response over decoration.** Interaction motion (hover, focus, menu open, filter change) is short and shows what changed.
5. **Content is never gated.** No text waits for an animation to become readable. With JS off, reduced motion on, or the scene failing to load, the page is complete and static.

## 2. Tokens

### Durations

| Token | ms | Use |
| --- | --- | --- |
| `instant` | 120 | Hover colour, underline start |
| `quick` | 240 | Buttons, menu items, focus |
| `settle` | 480 | Menu open/close, filter transitions, plate swap |
| `scene` | 900 | Hero entrance segments |
| `field` | 1600 | Field morphs that are toggled rather than scroll-scrubbed (mobile chapter changes) |

### Easing (GSAP names)

| Token | GSAP | Use |
| --- | --- | --- |
| `out` | `power3.out` | UI responses |
| `inOut` | `power2.inOut` | Field morphs triggered by toggle |
| `reveal` | `expo.out` | Hero line reveals |
| `scrub` | `none` (linear) with `scrub: 0.6` smoothing | Every scroll-linked timeline |

### Distances

- Text reveals use a clip mask with a 100% line-height translate. There is no opacity-only fade on text.
- Parallax is limited to 8% of the element height. Only the field and plates move at a different rate. Text never parallaxes.

## 3. Scroll infrastructure

### Lenis smooth scrolling

- **When it is enabled.** Only when all three are true:
  - `(pointer: fine)` (desktop or trackpad)
  - `(prefers-reduced-motion: no-preference)`
  - viewport ≥ 1024px
- **When it is not.** Touch devices keep native momentum scrolling (`syncTouch: false`).
- **Settings.** `lerp: 0.1`, `wheelMultiplier: 1`. No exaggerated inertia.
- **Sync with ScrollTrigger.** Use the single GSAP ticker:
  ```ts
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- **Lifecycle.**
  - Lenis is created once in a client `MotionProvider` in `app/layout.tsx`.
  - It is destroyed and recreated when the media query flips.
- **Anchors and focus.**
  - In-page anchor links and the skip link call `lenis.scrollTo(target, { offset: -headerHeight })`.
  - Keyboard scrolling (Space, PageDown, arrows, Tab into off-screen content) must keep working. Verify that Lenis does not swallow `Tab` focus scroll; if it does, set `lenis.scrollTo(focusedEl)` on `focusin`.
- **Route changes.** On App Router navigation:
  - `lenis.scrollTo(0, { immediate: true })`
  - kill the old page's triggers via `useGSAP` cleanup
  - `ScrollTrigger.refresh()` once after fonts and images settle (`document.fonts.ready`)

### GSAP setup

- `gsap`, `ScrollTrigger` and `@gsap/react` (`useGSAP`).
- Register plugins once, in the client provider.
- All selectors are scoped with `useGSAP({ scope: ref })`.
- **No GSAP during SSR.** Scene components are server components with a small client "director" child that attaches timelines.
- **`gsap.matchMedia()` drives every conditional set of animations.** It reverts automatically when conditions change:

```ts
const mm = gsap.matchMedia();
mm.add({
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  compact: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
}, (ctx) => { /* build per-condition timelines */ });
```

### Shared scroll state for the 3D field

- **One scroll owner.** ScrollTrigger owns scroll progress. A tiny mutable store (a plain object or a `zustand` vanilla store, no React re-render) holds:
  ```ts
  { scene: number, progress: number, velocity: number }
  ```
- **Writing.** Each scene's ScrollTrigger writes `scene` and `progress` in `onUpdate`.
- **Reading.** The R3F `useFrame` loop reads the store and interpolates. React state is never set per scroll frame.

## 4. Scene-by-scene specification (home page, desktop)

Positions use ScrollTrigger `start`/`end` syntax. "Pin" means `pin: true` on the scene wrapper; only children animate, never the pinned element itself.

### Scene 0: Arrival

| Element | Behaviour |
| --- | --- |
| Page load sequence | Timeline (not scroll-linked), total ≈ 1.6 s. It starts after `document.fonts.ready`, with a 1.2 s timeout fallback. |
| 0.00 s | Field canvas fades from 0 → 1 opacity (600 ms). The points are already drifting. The canvas is lazy-loaded, and if it is not ready the poster is shown. |
| 0.15 s | Hero name lines rise through a clip mask (`yPercent: 100 → 0`, 900 ms, `expo.out`, 120 ms stagger per line). |
| 0.55 s | Lead line and CTAs fade in (opacity only, 480 ms). These are short UI elements, so a mask is not needed. |
| 0.80 s | Meta line ("Now …") fades in. |
| Field | Noise amplitude eases from 1.0 → 0.6. Points nearest the headline drift slightly toward the text block and form a loose, still unordered cloud. |
| Scroll out (`top top` → `bottom top`, scrub) | Hero text translates up at 1× (native). Field noise amplitude goes 0.6 → 0.3, and the points begin streaming to the right edge, which hands off to scene 1. |

No-JS / reduced motion: all text is visible immediately and the poster `field-arrival.webp` is shown.

### Scene 1: Method (the Senja pipeline)

- **Pin.** `start: "top top"`, `end: "+=250%"`, `scrub: 0.6`. On a 900px viewport this is about 2.5 screens.
- **Layout.** The left column is a `StepList` of four real stages, derived from the experience bullets:
  1. Collect: web scraping
  2. Filter: relevance filtering and deduplication (~50% lower scraping cost)
  3. Generate: 4 production workflows, 20+ AI agents, 18+ reusable prompt modules
  4. Review: 10+ quality assurance reviewers
- **Copy check.** The stage wording must be approved by Calzy (vision §8). The four-stage structure is an interpretation of the bullets, not a quote.

| Progress | Field | Text |
| --- | --- | --- |
| 0.00–0.20 | Stream of points enters from the left as a wide, noisy band | Step 1 active (`signal` dot, `aria-current="step"`) |
| 0.20–0.45 | Band hits a vertical "gate": about half of the points fade to `rule` colour and fall away (deduplicated / irrelevant), the rest continue | Step 2 active; the "~50%" figure counts up from 0 to 50 in mono, clamped to the real value |
| 0.45–0.75 | Survivors split into **4 lanes** (workflows) with **20+ small clusters** riding them (agents) | Step 3 active |
| 0.75–1.00 | Lanes converge through a narrow **review gate** of 10+ fixed nodes; points passing it turn from `ink-3` to `ink`; a few are briefly tinted `signal` while "under review" | Step 4 active |

Counts on screen come from data constants that mirror the CV. They are not computed visuals that could drift from the CV.

### Scene 2: Selected work (three chapters)

- **Pin.** Each chapter pins for `+=150%` (desktop). The chapters are sequential `ProjectChapter` sections, driven by one master timeline with three labels.
- **Text.**
  - The chapter text block swaps with a 480 ms crossfade plus an 8px vertical shift. This text-swap shift and the mask are the only exceptions to "no fade-ups".
  - Chapter numbering is not shown. The projects are not a sequence.

| Chapter | Field morph (scrubbed, first 40% of the chapter) | Hold (40–85%) | Exit (85–100%) |
| --- | --- | --- | --- |
| **Seagis** | Points snap into an hourly grid: columns = hours, rows = sources (IoT readings, regional data) | A thin `signal` cursor sweeps across columns, one "hour" at a time, showing alignment | Grid loosens back into the stream |
| **Hiroop** | Points rise into a terrain (x = time, z = frequency, y = energy), suggesting a Mel spectrogram | Terrain collapses into **5 clusters**; the active cluster is `signal` | Clusters dissolve |
| **Emodu** | Points arrange into a loose token cloud; **112** are marked in `ink` | A marker travels along a thin scale from **0.6878** to **0.7238** (BERTScore F1, base → fine-tuned), with values in mono | Cloud relaxes into the timeline line for scene 3 |

The "Illustrative" note stays visible in the plate caption for every chapter.

### Scene 3: Trajectory

- **Desktop.** Horizontal scrubbed track. Pin `+=200%`. The inner track translates on `x` via `containerAnimation`, following the gsap-scrolltrigger guidance. Pinning and snapping are not used on the child triggers.
- **Nodes.** Each node is an experience or education entry in date order. The current role (Apple Developer Academy, "Present") is the only `signal` node.
- **Field.** It becomes a single line of points under the track and moves at 0.9× the track speed (slight depth).
- **Compact and mobile.** A vertical list. No pin, no field motion.

### Scene 4: Recognition

- No pin, no scrub.
- The list renders statically, so this is a deliberate rest beat.
- The field is paused (`frameloop` idle; see §5).

### Scene 5: Contact

- The background crossfades from `paper` to `ink` across `top 80%` → `top 30%` (scrub).
- The field settles into a calm, regular lattice with slow breathing: amplitude 0.05, period 8 s. It is the only idle loop on the page, and it stops when the scene leaves the viewport.
- The email address underline draws on hover and focus (`quick`, `out`).

## 5. 3D: `SignalField`

### Technology

- **Three.js via React Three Fiber.** R3F v9 is the line that supports React 19.
- **drei.** Only individual helpers that are needed (e.g. `AdaptiveDpr`, `PerformanceMonitor`). No full environment maps, no post-processing.
- **One `<Canvas>`** mounted once in the home page layout, `position: fixed`, behind content, `pointer-events: none`, `aria-hidden="true"`.

### Geometry and rendering

- **Points.** A single `THREE.Points` with a custom `ShaderMaterial`.
- **Per-point attributes.** Each point carries:
  - `aStart`
  - one position attribute per target: `aTargetA`, `aTargetB`, … one per scene state
  - `aSeed`
  - `aGroup` (for highlighting a class or cluster)
- **Morphing.** Done in the vertex shader by mixing between two target attributes with a `uMix` uniform, plus curl-noise displacement scaled by `uNoise`. The CPU never iterates over points per frame.
- **Target generation.** Target layouts (grid, terrain, clusters, cloud, lattice, pipeline lanes) are generated once, deterministically from a seed, in a Web Worker or at module init. They are cached in typed arrays.
- **Point counts by tier:**

  | Tier | Points | DPR cap |
  | --- | --- | --- |
  | High (desktop, discrete GPU) | 12,000 | 2 |
  | Default (desktop / modern laptop) | 8,000 | 1.5 |
  | Compact (tablet / modern phone) | 3,000 | 1.5 |
  | Low (low-end devices, `PerformanceMonitor` decline, `saveData`, `deviceMemory ≤ 2`) | no canvas, `FieldPoster` images instead | n/a |

- **Colours.**
  - Points use `ink` at 0.55–0.9 alpha.
  - Discarded points use `rule`.
  - Highlighted points use `signal`.
  - Scene light is a two-stop gradient (`ice` → `sage`) applied as a screen-space tint in the fragment shader, not real lights.
  - No bloom, no glow sprites.
- **Points as dots.** Round points via `gl_PointCoord` discard, size 1.5–3px at DPR 1, attenuated by depth.

### Frame loop and power

- **Demand rendering.** `frameloop="demand"`. Invalidate on:
  - scroll store changes
  - the hero load timeline
  - the Contact breathing loop while visible
- **Pausing.** Pause entirely when:
  - `document.hidden`
  - the field is fully covered (scene 4)
  - the user prefers reduced motion
- **Adaptive tiering.** `PerformanceMonitor` lowers DPR and then point count if FPS stays under 50 for 2 s. If it declines again, it swaps to posters.
- **Cleanup.** Dispose geometry and material on unmount (route change away from home).

### Loading

- **Lazy load.** `next/dynamic(() => import("./SignalField"), { ssr: false })`. Start the import with `requestIdleCallback` after first paint, so it never competes with LCP.
- **Before ready.** Until the field is ready, `FieldPoster` (AVIF/WebP, ~40–80 KB each) is shown at the same position, so there is no layout shift. The canvas then crossfades over it.
- **Posters.** Rendered offline from the same scene states, with a small script using the same target generator and a headless render, or captured manually.

## 6. Interaction motion (all pages)

| Interaction | Motion |
| --- | --- |
| Link hover / focus | Underline draws left → right (`scaleX` 0 → 1, `quick`, `out`); colour shifts to `signal-ink` |
| Primary button hover | Background `ink` → `#0B3A55` (slightly lighter ink), `instant`; no lift, no shadow |
| Project index row hover (desktop) | Plate for that project fades in at the cursor-side column (`settle`); title shifts 4px right |
| Header on scroll | After 8px, `paper/92` background + 1px rule (`quick`) |
| Mobile menu | Panel slides down 8px + opacity (`settle`, `out`); focus moves to the first link; Escape closes (existing) |
| Projects category filter | Rows that leave fade (`quick`); remaining rows shift up with FLIP (`settle`) |
| Gallery thumbnail select | Main image crossfade (`settle`) |
| Route change | No full-page transition. The new page renders immediately and only the `h1` mask reveal runs (`scene`, `reveal`). |

## 7. Responsive and accessibility matrix

| Condition | Lenis | Pins | Scrub timelines | 3D field | Load sequence |
| --- | --- | --- | --- | --- | --- |
| Desktop ≥ 1024px, fine pointer | On | Full lengths | On | Full tier | Full |
| Tablet 768–1023px | Off | Short (≤ 120%) or none | On (simplified: one morph per scene) | Compact tier | Full |
| Mobile < 768px | Off | **None** | Light: field plates crossfade between states as each chapter enters (toggle, not scrub) | Compact tier as a 60vh inline plate, or posters on low tier | Shortened (name mask only) |
| `prefers-reduced-motion: reduce` | Off | None | None | **Posters only** (static final state per scene) | None; everything visible |
| JS disabled / scene error | n/a | None | None | Posters (SSR `<picture>`) | None |
| `navigator.connection.saveData` | Off | As per size | As per size | Posters only | As per size |

Additional rules:

- **Respect user zoom.** Pins and track widths are calculated in `vh`/`vw` and recalculated on `ScrollTrigger.refresh()`. Refresh is debounced on resize (200 ms) and runs once after `document.fonts.ready`.
- **Pinned scenes never hold focusable content off-screen.** Every link in a pinned scene is reachable by Tab. When a link inside an inactive chapter receives focus, the page scrolls to that chapter's position (`focusin` handler).
- **No scroll-jacking.** Scroll speed and direction are never altered beyond Lenis smoothing. No snapping on desktop. A soft snap to chapter labels is allowed on tablet only if testing shows it helps.
- **Live counters announce once.** The "~50%" counter is presentational. The real value is in the text and is not re-announced per frame (`aria-hidden` on the animated digits, a visually hidden static value next to them).

## 8. Performance guardrails for motion

- Animate only `transform` and `opacity` on DOM elements. Never `top`/`left`/`width`/`height`/`filter: blur`.
- Pin only the scene wrappers, at most one active pin at a time.
- Keep the total number of ScrollTriggers on the home page under 15.
- `will-change` is added during an active tween only, never left on permanently.
- Every timeline and trigger is created inside `useGSAP` / `gsap.matchMedia` so it is reverted on unmount.
- Budget: main-thread scripting during scroll < 4 ms/frame on a mid-range laptop (Chrome Performance panel), and no long tasks > 50 ms while scrolling.
