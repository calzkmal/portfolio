# Scroll motion: making the home page feel alive

Instructions for adding scroll-driven motion to the home page (`src/app/page.tsx`), taking the patterns from [lenis.dev](https://lenis.dev/) while keeping the current white, editorial look.

## Goal

Today most of the page fades in once and then sits still. On lenis.dev almost every section **reacts to the scroll**: things stick, slide sideways or assemble. Add that rhythm without new libraries and without changing the palette.

## How the page works today

- **Smooth scroll:** Lenis via `lenis/react` (`src/components/home/SmoothScroll.tsx`, `<ReactLenis root>`).
  - Read the scroll position with `useLenis((lenis) => …)`. It gives `lenis.scroll`, `lenis.velocity` and `lenis.limit`.
- **Reveals:** `src/components/home/ScrollReveal.tsx`.
  - Any element with `data-reveal` (`"up"`, `"card"` or `"head"`, plus an optional `data-reveal-delay`) is painted from the scroll position on every Lenis frame.
  - Positions are cached as document offsets and re-measured when the page resizes.
  - **Reuse this measure-once, paint-per-frame pattern** for every effect below. Never call `getBoundingClientRect()` inside the scroll callback.
- **Velocity effects:** `Stamp.tsx` already spins with `lenis.velocity`, and `Parallax.tsx` already offsets with scroll. Use them as references.
- **Reduced motion:** `useReducedMotion()` in `src/components/home/motion.ts`.
  - Lenis stays on, but decorative motion must switch off.
  - Every new effect must show its final state when this is true.
- **Sections:** About (`.home-hero`), Experience, Works, Education, Recognition, then the footer (`#contact`).
  - Experience and Education render with `<Entry>`, and every section title uses `<SectionHead>` (both in `src/components/home/Entry.tsx`).
- **Styles:** `src/components/home/home.css`.
  - Tokens: `--ink`, `--muted`, `--faint`, `--line`, `--accent`, `--night*`.
  - Breakpoints: `1080px` (layouts stack) and `720px` (phone).
- **Data:**
  - `src/data/home.ts`: `displayName`, `focusAreas`
  - `src/data/profile.ts`: `stats`, `skills`, `tagline`
  - `src/data/experience.ts`, `education.ts`, `projects.ts`, `achievements.ts`

## Rules for every effect

1. **No new dependencies.** Lenis plus plain DOM writes (`transform`, `opacity`, `clip-path`, CSS variables) only.
2. **Animate only `transform`, `opacity` and `clip-path`.** Never animate layout properties.
3. **Measure on resize, paint on scroll.** Cache offsets, and listen with a `ResizeObserver` on `document.body` plus `window` resize.
4. **Reduced motion:** render the finished state and attach no scroll handlers.
5. **Mobile (≤ 720px):** each effect either has a simple stacked fallback (stated below) or is off. There must be no horizontal page scroll (`document.documentElement.scrollWidth === innerWidth`).
6. **Content stays in the DOM and readable without JS.** Effects enhance; they never hide content permanently.
7. **Keep the look:** white page, ink text, one accent (`--accent`), hairline rules. No new colours unless the owner asks.
8. One component per effect in `src/components/home/`, with a short doc comment explaining what it does.

## Effects, in build order

### 1. Sticky section titles (Experience, Education)

- **What:** on desktop, the section title (`<SectionHead>`) sticks on the left while the entries scroll past on the right.
- **How:**
  - Make each of the two sections a two-column grid (title column about 32%, entries the rest).
  - Give the title `position: sticky; top: 96px`.
  - Keep the title's own `data-reveal="head"` reveal.
- **Extra:** the active entry is the one crossing 40% of the viewport. Show a small counter under the title (`01 / 03`) that updates as you scroll; work it out from cached entry offsets.
- **Mobile:** no sticky; the current stacked layout.
- **Done when:** the title stays put while every entry scrolls by, and it releases cleanly at the end of the section.

### 2. Works as a horizontal gallery

- **What:** while the Works section is pinned, vertical scrolling moves the project cards sideways.
- **How:**
  - Make a tall outer section whose height is `100vh + (track width − viewport width)`.
  - Inside it, put a `position: sticky; top: 0; height: 100vh` frame holding a flex track of cards.
  - Map progress `p = clamp((scroll − sectionTop) / (sectionHeight − vh))` to `translateX(−p × (trackWidth − vw))`.
  - The card nearest the centre gets `scale(1)` and the others `scale(0.94)`, interpolated from their distance to the centre.
- **Cards:** keep the existing art (`ProjectArt`) and info. Size each card to about 70vw, max 900px.
- **Mobile:** no pinning; the current vertical stack.
- **Done when:** scrolling through Works shows all four projects sideways, the page continues normally afterwards, and the nav's "Works" link still lands at the start of the section.

### 3. Statement that lights up word by word

- **What:** one big sentence between About and Experience. Each word goes from `--faint` to `--ink` as you scroll.
- **Copy:** use `profile.tagline`, or a dedicated `statement` string added to `src/data/home.ts`.
- **How:**
  - Split the sentence into `<span>` words.
  - Progress runs across the section's height (pin it with sticky for about 150vh).
  - Word *i* is lit when `p > i / wordCount`. Ease each word's colour over a short window rather than flipping it.
- **Type:** display font (`--home-display`), about `clamp(32px, 4.6vw, 72px)`, centred, max width about 18ch per line.
- **Mobile:** same effect at a smaller size; no pinning needed.

### 4. Counting numbers

- **What:** `profile.stats` (20+, ~50%, 100+) as three big numbers in one row that count up from 0 as they enter the viewport.
- **How:**
  - Parse the leading number and keep the prefix and suffix (`~`, `%`, `+`).
  - Tie the count to scroll progress (not time), so it also counts back down when you scroll up.
- **Where:** directly under the statement from step 3, or at the top of Experience.
- **Mobile:** stack the numbers vertically.

### 5. Velocity marquee

- **What:** one row of `focusAreas`, or the tech stack from `profile.skills`, scrolling sideways forever.
- **How:**
  - Duplicate the content twice in a flex track and move it with a `translateX` loop.
  - Base speed is about 40px/s. Add `lenis.velocity × k` to it, and flip direction when the velocity is negative.
  - Separate items with a small accent dot.
- **Where:** between Works and Education.
- **Reduced motion:** a static, wrapped row.

### 6. Footer reveal

- **What:** the page content slides up and away to uncover the dark footer underneath, like a curtain.
- **How:**
  - Make the footer `position: sticky; bottom: 0; z-index: 0`.
  - Give `<main>` a white background and `position: relative; z-index: 1`.
  - Optionally darken the footer content slightly until it is fully uncovered (opacity 0.4 → 1).
- **Check:**
  - Nav "Contact" still scrolls to the very bottom (`lenis.limit`).
  - The rail and clock still switch to light text over the footer (`data-on-dark` in `Rail.tsx`).
- **Mobile:** the same works; verify it on a 375px screen.

### 7. (Optional, last) Ambient particle field in the hero

- **What:** a faint field of dots behind the About section that drifts with the cursor and thins out as you scroll away.
- **How:** a single `<canvas>` with 2D context, no WebGL, about 400 points. Pause it when off-screen (`IntersectionObserver`) and when reduced motion is on.
- **Budget:** under 2ms per frame on a mid laptop. Skip it if the first six already feel full enough.

## Verification checklist (per effect)

- [ ] `npm run typecheck` and `npm run lint` pass.
- [ ] Desktop 1280×800 and 1440×700: the effect runs smoothly, both scrolling down and back up.
- [ ] Phone 375×812: the fallback layout, with no horizontal scroll.
- [ ] Reduced motion (emulate `prefers-reduced-motion: reduce`): the final state, nothing moving.
- [ ] Nav links (About … Contact) still glide to the right place with the heavy ease in `Rail.tsx`.
- [ ] No console errors, and no layout shift on load.
- [ ] The link preview (`src/app/opengraph-image.tsx`) still renders. It reads `src/data/home.ts`, so keep those exports.
