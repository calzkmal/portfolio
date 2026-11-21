# Vision — "Quietly Cinematic"

Redesign of the personal portfolio of **Calzy Akmal Indyramdhani**.
Companion documents: [design-system.md](design-system.md) · [motion-spec.md](motion-spec.md) · [implementation-plan.md](implementation-plan.md).

---

## 1. Audit of the current implementation

### Stack and structure

| Area | Today | Keep? |
| --- | --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript, static generation for every route | Keep. Nothing in the brief needs a different framework. |
| Styling | Tailwind CSS 3 with tokens in `tailwind.config.ts` (`canvas`, `surface`, `ink`, `line`, `accent`) and a few component classes in `globals.css` (`.card`, `.eyebrow`, `.reveal`) | Keep Tailwind; replace the tokens (see design system). |
| Fonts | `next/font/google`: Plus Jakarta Sans (`--font-display`) + DM Sans (`--font-sans`) | Replace: Instrument Serif, Plus Jakarta Sans, JetBrains Mono. |
| Routes | `/`, `/projects`, `/projects/[slug]` (SSG via `generateStaticParams`), `/experience`, `/education`, `/achievements`, plus `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `icon.svg`, `not-found.tsx` | Keep every URL. They are indexed and linked from the CV. |
| Content | Typed data in `src/data/*` (`profile`, `experience`, `education`, `projects`, `achievements`, `site`) with types in `src/types/index.ts` | Keep. It is the best part of the codebase: all new scenes read from it. |
| Hosting | Vercel, auto-deploy from `main` | Keep. |

### Components worth reusing

- **Data layer and types.** These are the source of truth for every scene, count and label. No copy should be hard-coded into scenes.
- **`ProjectGallery`.** Accessible in-page viewer with a `fit: "contain"` option. Restyle it and keep the logic.
- **`Header`.** It already handles route-based active state, the mobile menu, Escape-to-close and scroll state. Restyle it and keep the behaviour.
- **SEO plumbing.** Metadata, JSON-LD `Person`, sitemap, OG image. Retheme the OG image only.
- **Hidden empty sections on the project detail page.** The page hides sections whose data is empty. Keep this pattern so nothing has to be invented.

### Existing motion

- `Reveal.tsx`: an IntersectionObserver adds `.is-visible`, and CSS fades and slides elements up 18px. It is used on nearly every section and card, with stagger delays.
- `animate-fade-up` keyframe on the hero, staggered via inline `animationDelay`.
- Hover lifts (`hover:-translate-y-1`, `shadow-lift`) on cards.
- `prefers-reduced-motion` is already respected (CSS override and an early return in `Reveal`).
- **No animation library, no smooth scrolling, no WebGL.** Dependencies are only `next`, `react`, `react-dom` and `lucide-react`.

**Verdict.** The motion is the generic "fade-up on everything" pattern. It does not tell a story and should be replaced, not extended.

### Content and copy issues found (fix regardless of redesign)

1. **Stale copy from the previous owner.** `src/app/experience/page.tsx` describes the roles as *"data engineering, analytics, IT digitalization and database operations"*. None of those match Calzy's experience.
2. **Placeholder-flavoured headings.** For example *"Building systems that last"* and *"Learn more about me"*. These generic phrases say nothing specific.
3. **Template chrome.**
   - Uppercase tracked eyebrows (`.eyebrow`) above every heading.
   - `A · B` meta strings in `ExploreSection`.
   - Arrows appended to button text.
   - Identical rounded cards with the same shadow everywhere.
4. **Avatar asset.** `public/images/avatar.jpeg` is **6240×4160 px / 4.2 MB**, landscape, cropped into a 4:5 frame. `next/image` resizes it, but the source should be cropped and exported at ~1600 px on the long edge.
5. **Missing case-study material** (the site must not invent it):
   - No screenshots for any project (`gallery: []`).
   - No GitHub or demo links.
   - Seagis has no outcomes.
   - None of the projects has a "problem" statement.

### Accessibility and performance limitations today

- **Contrast.** It is good after the palette change. Vermillion text needed a darker shade (`#A82A14`), and that lesson carries into the new system.
- **Focus.** The focus ring is present (`:focus-visible` ring). The skip link exists.
- **LCP.** The hero `<Image priority>` with a 4.2 MB source is the main risk for LCP today.
- **Layout.** No layout shift issues, since fonts use `display: swap` with `next/font` fallbacks.
- **Pages without JS.** Pages are fully readable without JS (`<noscript>` disables `.reveal`). This property must be preserved: **every scene must degrade to readable static content.**

---

## 2. Subject, audience and job

- **Subject.** A software engineer whose work, across every role and project in the CV, is the same move: taking a messy, noisy input and turning it into a structured, dependable output. The inputs are:
  - scraped web content (PT Senja Solusi)
  - macroeconomic series (Kalbe)
  - IoT temperature readings (Seagis)
  - respiratory audio (Hiroop)
  - students' emotional context (Emodu)
- **Audience.** In order:
  - hiring managers and engineering leads evaluating AI/automation or data roles
  - recruiters scanning quickly
  - peers from the Apple Developer Academy and the data community
- **Primary job.** Make a reader believe, within one scroll, that Calzy builds **working systems that run in production**. Then let them verify it through case studies, the CV and links.
- **Secondary job.** Make contacting him effortless.

## 3. The idea: "Signal to structure"

One visual metaphor carries the whole site. It comes from the work itself, not from a mood board.

> **Scattered signal becomes ordered structure.**

A single 3D field of points runs through the home page as one continuous scene. It starts as drifting, unordered noise. As the reader scrolls, the same points are filtered, routed and arranged. They form a different structure for each piece of work, then settle into a calm, ordered state at the end of the page.

Why this fits:

- It is literally what the CV describes:
  - relevance filtering and deduplication
  - feature extraction (MFCC, Mel spectrograms, chroma)
  - hourly data alignment
  - fine-tuning that moves a score
- It shows engineering capability through **behaviour**, not decoration. The visual changes because data is being processed, and every structure maps to a real project.
- It is one memorable element. Everything around it stays quiet, editorial and typographic.

What it is **not**:

- No glowing orbs, no bloom.
- No glass panels.
- No neon on black.
- No floating laptop mock-ups.
- No generic "AI brain".

The points are small, matte and ink-coloured on an off-white field, closer to a technical plate in a printed journal than to a sci-fi HUD.

### Honesty rule for visuals

Scene structures are **illustrative**. They use only numbers that appear in the CV or data files, for example:

- 5 respiratory classes
- 112 evaluation examples
- BERTScore F1 0.6878 → 0.7238
- 4 production workflows, 20+ agents, 18+ prompt modules, 10+ QA reviewers
- ~50% scraping cost reduction
- 100+ TestFlight testers

Anything shaped like a chart that is not real data carries a visible "Illustrative" note in the metadata face. No invented metrics, clients, logos or testimonials.

## 4. Art direction

- **Editorial, not product.** The page reads like a well-set long-form feature:
  - large Instrument Serif headlines
  - generous margins
  - asymmetric columns
  - captions and metadata in JetBrains Mono, as a technical journal would set figure notes
- **Paper and ink.** A cool off-white page with deep blue-ink type. The blue/sage gradient appears only as **light falling on the 3D field and on full-bleed scene backgrounds**, never as a decorative wash behind cards.
- **One signal colour.** Vermillion is the colour of *"this point is being processed right now"*:
  - the active particle cluster
  - the current timeline node
  - the focused link underline

  It never appears as a large fill.
- **Spatial, not boxed.** Content sits directly on the page, in a grid, with rules and whitespace for structure. Cards survive only where an object really is a discrete, clickable thing (project index, achievement list on the archive page). Even there, radius and elevation follow hierarchy.
- **Credibility first.** Every scene ends in something verifiable: a case study link, the CV, GitHub, LinkedIn. Motion never hides content or delays reading it.

## 5. Content hierarchy and storytelling (home page)

The home page becomes a sequence of **scenes**. The 3D field is the connective tissue. Each scene has one job.

| # | Scene | Job | Real content used | 3D field state |
| --- | --- | --- | --- | --- |
| 0 | **Arrival** (hero) | Who he is and what he builds, in under five seconds | Name, title, one-line summary from `profile`, current role (Apple Developer Academy), CV + contact | Unordered drifting noise that gently resolves around the headline on load |
| 1 | **Method** | Show *how* he works through one production system | PT Senja Solusi: 4 production workflows, 20+ AI agents, 18+ prompt modules, 10+ QA reviewers, ~50% lower scraping cost | Points stream through a pipeline: a filter gate drops roughly half of the stream (the ~50%), then the stream splits into parallel lanes and passes a review gate |
| 2 | **Selected work** | Three projects as chapters, each with a verifiable outcome | Seagis, Hiroop, Emodu from `projects.ts` | The field morphs into one structure per project (see below) |
| 3 | **Trajectory** | Experience and education as one timeline | `experience.ts` + `education.ts`, newest first | Field recedes to a thin horizontal line of nodes that tracks the timeline |
| 4 | **Recognition** | Proof from outside | TSDN 2024 1st place, Very Disco Local Game Jam 3rd place, HIMARPL Executive Lead, IISMA Alumni Club | Static. The field rests. No motion competes with the list. |
| 5 | **Contact** | One clear action | Email, LinkedIn, GitHub, CV, location, photo | Field settles into a calm, ordered lattice on an ink background |

Per-project structures in scene 2 (all illustrative, driven by real attributes):

- **Seagis**: points snap into an hourly grid. Columns are hours and rows are data sources, joined at the same timestamp. This visualises "traceable, hourly data alignment" and the join of IoT readings with regional data.
- **Hiroop**: points rise into a spectrogram-like terrain (time × frequency × energy), then separate into **5 clusters** for the five respiratory sound classes.
- **Emodu**: points become a token cloud. **112 points** (the evaluation set) are marked. A marker travels along a scale from **0.6878 to 0.7238** (base model vs. fine-tuned BERTScore F1).

### Other pages

The other pages stay mostly typographic and fast. The cinematic weight is on the home page.

| Route | Role in the story |
| --- | --- |
| `/projects` | An index, not a card grid: one row per project with year, category, role and stack in the metadata face, plus a still frame of that project's field structure. |
| `/projects/[slug]` | A long-form case study. The opening plate is a still render (static image) of the project's field structure. After that come overview, objectives, solution, contributions, outcomes and stack, laid out as an editorial article. Missing sections stay hidden. |
| `/experience`, `/education` | Detailed versions of the Trajectory timeline. |
| `/achievements` | Full archive, filterable by category (existing logic). |

## 6. Voice and copy

- Plain, specific, first person, sentence case. Copy says what the work does, not how impressive it is.
- Headlines come from the content. Examples (drafts, to be approved by Calzy):
  - Hero: *"I turn complex workflows into systems that run on their own."* This paraphrases the CV summary: "turning complex workflows into practical solutions".
  - Method: *"Four workflows, twenty-plus agents, and half the scraping bill."*
  - Selected work: no heading slogan, just the project titles.
  - Contact: *"Working on something that should run itself? Let's talk."*
- No all-caps labels, no "01 / 02 / 03" except where the content is truly a sequence (the pipeline stages and the timeline).
- CTAs say exactly what happens: "Read the case study", "Download CV (PDF)", "Email Calzy".

## 7. Success criteria

- A first-time visitor can state Calzy's focus (AI automation, data pipelines, LLM applications) after the hero, without scrolling.
- Every number on the site can be traced to the CV or `src/data/*`.
- The home page is fully readable and navigable with JavaScript disabled, with reduced motion on, by keyboard only, and on a low-end phone.
- Core Web Vitals on mobile (Vercel Speed Insights / Lighthouse):
  - LCP < 2.5 s
  - CLS < 0.05
  - INP < 200 ms
- The 3D field never blocks the first paint or the LCP element.

## 8. Decisions for Calzy to confirm

1. **Palette.** The brief asks for "neutral off-white and dark ink" with blue/sage gradients. The current site uses Ice Blue `#C9DFEA` as the page background. Proposal:
   - Move the page background to a cool off-white.
   - Keep Midnight Ink as the ink colour.
   - Keep Ice Blue and add a sage as gradient stops.
   - Keep Vermillion as the single signal colour.

   See design-system §2.
2. **Hero photo.** Move the portrait from the hero into the Contact scene, so the hero focal point is the field. The alternative is a smaller portrait in the hero.
3. **Lenis.** Enable it on desktop with a fine pointer only. Touch devices keep native scrolling. See motion-spec §3.
4. **Content to supply** (optional, but it makes the case studies much stronger):
   - screenshots or screen recordings for Seagis, Hiroop and Emodu
   - GitHub or demo links
   - a one-paragraph "problem" for each project
   - any measured outcome for Seagis
5. **Headline copy** in §6 is a draft for approval.
