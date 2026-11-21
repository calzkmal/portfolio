# Design system — "Quietly Cinematic"

Tokens, typography, layout and components for the redesign. See [vision.md](vision.md) for the reasoning and [motion-spec.md](motion-spec.md) for motion tokens.

---

## 1. Principles

1. **One loud thing.** The 3D signal field is the only expressive element. Type, layout and UI stay disciplined around it.
2. **Structure carries meaning.** Rules, numbering and labels appear only when they encode something real:
   - a sequence (pipeline stages, the timeline)
   - a category
   - a date or a technology

   No decorative eyebrows.
3. **Paper, ink, one signal.** Colour is mostly two values. Gradients are light falling on the scene, not wallpaper. Vermillion marks "active / being processed" and nothing else.
4. **Editorial asymmetry.** Text holds a strong left column. Figures and the scene take the remaining space. Centred layouts are reserved for the closing Contact scene.
5. **Readable first.** Every component renders its full content as HTML, server-side, with no motion. Motion is layered on top.

## 2. Colour

### Core palette

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#F3F5F3` | Page background. A cool, faintly sage off-white, deliberately **not** a warm cream. |
| `ink` | `#082E43` | Midnight Ink. Headlines, body text, primary button, the Contact scene background. |
| `ink-2` | `#3E5F72` | Secondary text: lead paragraphs, descriptions. |
| `ink-3` | `#546F7E` | Metadata, captions, mono labels. |
| `rule` | `#D3DCDA` | Hairline rules, input borders, table lines. Never used for text. |
| `ice` | `#C9DFEA` | Ice Blue. Gradient stop, scene light, selected states on paper. |
| `sage` | `#BCCFC2` | Sage. Second gradient stop, quiet surfaces (e.g. case-study plates). |
| `signal` | `#FF4F31` | Vermillion. Active particle cluster, current timeline node, focus marker on dark backgrounds. **Graphics only. Never text on paper.** |
| `signal-ink` | `#A82A14` | Vermillion for text and thin marks on paper: links on hover, active nav marker. |

### Contrast (WCAG 2.2)

Ratios are approximate; check them again in the browser during QA.

| Pair | Ratio | Use allowed |
| --- | --- | --- |
| `ink` on `paper` | ~13 : 1 | All text |
| `ink-2` on `paper` | ~6.2 : 1 | All text |
| `ink-3` on `paper` | ~4.9 : 1 | Text ≥ 13px (metadata) |
| `signal-ink` on `paper` | ~6.4 : 1 | Text, icons, focus marks |
| `signal` on `paper` | ~2.6 : 1 | **Decorative only**, always paired with text or shape |
| `signal` on `ink` | ~5.0 : 1 | Text, icons, focus marks on dark |
| `paper` / `ice` on `ink` | ~13 : 1 / ~10 : 1 | Text on dark scenes |

### Gradients

Gradients are used in exactly two places:

- **Scene light.** Scenes 1–2 sit on a vertical wash from `paper` → `ice` at 40% → `paper`. The wash is very low contrast, applied to a full-bleed scene layer behind the canvas. It is not visible as a "gradient box".
- **Contact scene.** `ink` with a radial sage tint, `radial-gradient(60% 50% at 70% 30%, rgb(188 207 194 / 0.14), transparent)`. The tint is barely perceptible and gives the dark section depth.

Not allowed:

- gradient text
- gradient buttons
- glows
- `backdrop-filter` glass (except the existing header blur, reduced to a solid `paper/92` with a 1px `rule` line)

### Relationship to the current palette

- The current site uses `ice` as the page background, which reads as a tinted SaaS theme.
- The brief asks for off-white and ink. Moving `ice` into the light and gradient role keeps the colour identity Calzy chose while meeting the brief.
- Midnight Ink and Vermillion stay unchanged. **Requires Calzy's confirmation** (vision §8).

## 3. Typography

### Families

All three load via `next/font/google`, self-hosted, with `display: "swap"` and `adjustFontFallback`.

| Family | Variable | Weights | Role |
| --- | --- | --- | --- |
| **Instrument Serif** | `--font-serif` | 400 (normal + italic) | Display and section headlines only. Never body, never under 32px. |
| **Plus Jakarta Sans** | `--font-sans` | 400, 500, 600 | Interface and body: paragraphs, navigation, buttons, h3–h4 headings. |
| **JetBrains Mono** | `--font-mono` | 400, 500 | Technical metadata only: dates, durations, stacks, metrics captions, figure notes, "Illustrative" labels. |

Rules:

- **Instrument Serif is set in roman.** Italic is allowed only for a complete quoted line (e.g. a pull quote). Never to accent a single word inside a headline.
- **Mono is metadata, not decoration.** If a string is not a date, a duration, a technology, a figure caption or a value, it is not set in mono.
- **Sentence case everywhere.** No uppercase transforms, no tracked-out caps labels.
- **Numbers.** Use `font-variant-numeric: tabular-nums` in mono and in timelines.

### Scale

Based on the classical typographic scale (Bringhurst): 13 · 15 · 17 · 21 · 24 · 32 · 48 · 72 · 96–144.

| Token | Size (mobile → desktop) | Line height | Family / weight | Use |
| --- | --- | --- | --- | --- |
| `display` | `clamp(3.5rem, 9vw, 9rem)` | 0.95 | Serif 400, `-0.015em` | Hero name only |
| `h1` | `clamp(2.75rem, 6vw, 4.5rem)` | 1.0 | Serif 400, `-0.01em` | Page titles, project titles |
| `h2` | `clamp(2rem, 4vw, 3rem)` | 1.05 | Serif 400 | Scene headlines |
| `h3` | `1.5rem` | 1.25 | Sans 600, `-0.01em` | Sub-sections, timeline roles |
| `lead` | `1.3125rem` (21px) | 1.5 | Sans 400 | Intro paragraphs |
| `body` | `1.0625rem` (17px) | 1.65 | Sans 400 | Paragraphs |
| `small` | `0.9375rem` (15px) | 1.55 | Sans 400/500 | UI, buttons, nav |
| `meta` | `0.8125rem` (13px) | 1.5 | Mono 400 | Metadata, captions |

- **Measure.** Body text runs 60–72 characters (`max-w-[66ch]`); lead text 55–62 characters.
- **Headline width.** Headlines use `text-wrap: balance`. The hero name may break across lines on purpose.
- **Spacing.** The vertical rhythm is based on 8px, with headline-to-body spacing at 24px and section-to-section spacing at 160–240px on desktop.

## 4. Layout

### Grid

- **Columns.** 12 columns on desktop (≥ 1024px), 8 on tablet, 4 on mobile.
- **Container.** `max-width: 1320px`.
- **Side gutters.** 20px on mobile, 32px on tablet, 48px on desktop.
- **Column gutters.** 24px.
- **Alignment.** Left-aligned throughout. The only centred composition is the Contact scene.
- **Asymmetry.** The primary text column spans columns 1–6 (or 2–7 in scenes). The figure, scene focus or metadata column spans 8–12. Columns 7 or 1 stay empty on purpose.

### Scene wireframes

**Scene 0: Arrival (desktop)**

```
┌──────────────────────────────────────────────────────────────┐
│ Calzy A. Indyramdhani            Work  Trajectory  Contact   │  header (sans 15)
│                                                              │
│                                   · ·  ·   ·  · ·  ·         │
│  Calzy Akmal                    ·   ·  ·  · ·   ·  ·  ·      │  ← 3D field (right 60%,
│  Indyramdhani                     ·  · ·   ·  · ·            │    bleeds behind text)
│                                 ·  ·    · ·  ·   ·  ·        │
│  I turn complex workflows into                               │  lead (sans 21)
│  systems that run on their own.                              │
│                                                              │
│  [ See selected work ]   Download CV (PDF)                   │
│                                                              │
│  Now  iOS Developer Learner, Apple Developer Academy         │  meta (mono 13)
│  Based in Bandung, Indonesia                                 │
└──────────────────────────────────────────────────────────────┘
```

**Scene 1: Method (pinned on desktop)**

```
┌──────────────────────────────────────────────────────────────┐
│  How a production workflow     │   ░░░░▒▒▒▒▓▓▓▓ ─┐           │
│  runs                          │   scrape        │ filter    │
│                                │                 ▼  ~50%     │
│  PT Senja Solusi, 2025–2026    │        ═══ 4 workflows      │
│                                │        ═══ 20+ agents       │
│  1 Collect   …                 │        ═══ 18+ prompts      │
│  2 Filter    …  (active)       │           ▼                 │
│  3 Generate  …                 │        [ 10+ QA reviewers ] │
│  4 Review    …                 │                             │
└──────────────────────────────────────────────────────────────┘
  left: step list (real sequence, numbered); right: field as pipeline
```

**Scene 2: Selected work (one chapter per project)**

```
┌──────────────────────────────────────────────────────────────┐
│  Hiroop                         │                             │
│  Respiration audio classifier   │      ▁▂▅▇▅▃▂ ▂▅▇▆▃          │
│                                 │    ▂▅▇█▇▅▃▁▃▅▇█▇▅  → ● ● ●  │
│  1st place, TSDN 2024           │                     ● ●     │
│  Machine Learning Engineer      │   (5 class clusters)        │
│  Nov–Dec 2024                   │                             │
│  Python  Flask  TensorFlow …    │   Illustrative              │
│                                 │                             │
│  Read the case study            │                             │
└──────────────────────────────────────────────────────────────┘
```

**Scene 3: Trajectory (desktop: horizontal; mobile: vertical)**

```
  2021 ────── 2023 ────── 2025 ─────────── 2026 ─────────▶
  UPI         Western      Kalbe   Senja      Apple Dev. Academy ●
  Software    Ontario      intern  automation iOS learner (now)
  Engineering exchange
```

**Scene 5: Contact (ink background, centred)**

```
┌──────────────────────────────────────────────────────────────┐
│             (calm ordered lattice, sage-tinted)              │
│                                                              │
│          Working on something that should run                │
│                  itself? Let's talk.                         │
│                                                              │
│                    calzkmal@gmail.com                        │  serif 48, link
│         LinkedIn     GitHub     Download CV (PDF)            │
│                                                              │
│   [portrait, small]   Bandung, Indonesia                     │
└──────────────────────────────────────────────────────────────┘
```

### Responsive behaviour

| Breakpoint | Layout |
| --- | --- |
| ≥ 1280px | Full 12-column compositions, pinned scenes, horizontal timeline. |
| 1024–1279px | Same compositions with tighter gutters; shorter pin distances. |
| 768–1023px | 8 columns. Text above the scene focus. No horizontal timeline (vertical). Pins kept short or removed. |
| < 768px | 4 columns, single column flow. The scene becomes a 60vh plate between text blocks instead of a background. No pinning. 16–20px side gutters, no horizontal page scroll. |

## 5. Shape, depth and texture

- **Radius follows hierarchy, not a single value:**
  - Buttons: fully rounded (pill). Primary actions read as objects.
  - Image plates and figure frames: 6px.
  - Tags (stack items): 4px.
  - Rules and timeline lines: none.
- **Elevation is avoided.** Separation comes from rules and space. The single shadow token is `0 1px 0 rgb(8 46 67 / 0.06), 0 12px 32px -20px rgb(8 46 67 / 0.25)`, used only for the floating header on scroll and an opened menu.
- **Texture.** A 2% film-grain noise (static, CSS `background-image` SVG noise) on scene backgrounds only, to keep large gradients from banding. It is not animated.

## 6. Components

New or restyled. Names are proposals.

| Component | Purpose | Notes |
| --- | --- | --- |
| `SiteHeader` | Name + 3–4 links: Work, Trajectory, Recognition, Contact. On sub-pages the links are Projects, Experience, Education, Achievements. | Restyle of `Header`. The active link gets a 2px `signal-ink` underline. The mobile menu stays (existing logic). |
| `SceneSection` | Wrapper for a home scene: `id`, accessible heading, scene index for the field, `data-scene` attribute | Server component; motion attaches from a client child. |
| `Headline` | Serif headline with `as` prop and size token | Balanced wrapping; optional line-split for the hero mask reveal. |
| `Meta` | Mono metadata line or definition list (`<dl>`) | Tabular numbers; never uppercase. Replaces `A · B` strings with real `<dl>` pairs (e.g. "Role / Machine Learning Engineer"). |
| `StepList` | Numbered real sequences (pipeline stages) | `<ol>`; the active step is marked by a `signal` dot plus `aria-current="step"` when scrubbed. |
| `ProjectChapter` | Home scene 2 chapter: title, one-line summary, the real outcome, role, dates, stack, link | Reads `Project`. If `outcomes` is empty (Seagis), it shows the role and stack instead. Nothing is invented. |
| `ProjectIndexRow` | `/projects` row: year · title · category · role, with a still plate of the project's field state | Whole row is one link; hover reveals the plate on desktop. |
| `Plate` | Figure with caption and optional "Illustrative" note | Wraps static renders of field states and real screenshots. |
| `Timeline` | Experience + education as one chronological sequence | The newest node uses `signal`. On desktop it becomes a horizontal scrubbed track in scene 3. |
| `Button` | Primary (ink pill, paper text) and Text link (underline that draws on hover/focus) | No appended arrows. Labels say what happens ("Download CV (PDF)"). |
| `CaseStudy` | `/projects/[slug]` article layout | Two columns: article (cols 1–7) and sticky facts (cols 9–12). Existing "hide empty section" logic is kept. |
| `SignalField` | The R3F canvas (client only, lazy) | See motion-spec §5. Never contains content; `aria-hidden="true"`. |
| `FieldPoster` | Static image of a field state | Used for SSR, no-JS, reduced motion, low-power devices, OG image and `/projects` plates. |

## 7. Iconography and imagery

- **Icons.** Lucide stays, but used sparingly: socials, download, external link. No decorative icons beside headings. 1.5px stroke, sized to the text cap height.
- **Portrait.** Crop to 4:5, export at 1600px (AVIF/WebP via `next/image`, quality 75). Place it in the Contact scene at modest size, desaturated by 10%, with no border frame.
- **Project imagery.** Real screenshots when supplied. Until then, the `FieldPoster` state for that project, labelled "Illustrative".

## 8. Accessibility baseline

- **Focus.** A visible `:focus-visible` ring: 2px `ink` outline with 3px offset on paper; 2px `signal` on ink.
- **Content in HTML.** All content is HTML in document order. The canvas is `aria-hidden` and never holds text.
- **Headings.** Exactly one `h1` per page. Scenes use `h2`.
- **Hit areas.** At least 44×44px on touch.
- **Colour is never the only signal.** The active step has a dot **and** `aria-current`. The active nav item has an underline **and** `aria-current="page"`.
- **Language.** Language is set (`lang="en"`). Each link's text describes its destination.
