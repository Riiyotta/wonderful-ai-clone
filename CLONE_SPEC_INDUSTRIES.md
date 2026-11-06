# Industries + case studies: clone spec

Sources:
- Live wonderful.ai, measured on 2026-11-03 with headless Playwright at 1440, 1100 and 390 (plus spot checks at 600, 850, 900, 1000, 1300, 1420 and 1800).
- `_source/pages/industries__*.html` and `_source/pages/case-studies__*.html`.
- The Framer CSS rules quoted below were read from those source pages. Each one maps a Framer class to a `.inx-*` class (industries) or a `.cs-*` class (case studies).

Code:
- Routes: `src/routes/industries.jsx`
- Templates: `src/pages/industries/IndustryPage.jsx`, `CaseStudyPage.jsx`, `CharReveal.jsx`, `sections/*`
- Data: `src/pages/industries/data/industries.js` (CMS content, generated from the live DOM plus the page's SVG symbols) and `data/caseStudies.js` (the source rich text kept verbatim, with preset classes renamed to `rt-*`)
- CSS: `src/styles/industries/{industry,casestudy,fonts}.css`

## 0. Breakpoints and tokens
Industry pages:
- desktop ≥1400
- tablet 880–1399.98
- mobile ≤879.98

Case-study pages:
- desktop ≥1200
- tablet 810–1199.98
- mobile ≤809.98

Text presets keep their own Framer breakpoints:

| preset | sizes |
|---|---|
| `190xti5` H2 | 48/1.05/-.04em ≥1200 · 42/1.15 for 800–1199 · 34/1.15/-.05em below 800 · text-wrap balance · pad-bottom 3px |
| `1ing3ma` H4 | 26/1.25/-.05em ≥1200 · 24/1.15/-.04em below 1200 |
| `pyuk04` H3 | 32px ≥1440 · 22px for 810–1439 · 24px below 810 · 1.15/-.04em |
| `ekr7ll` hero H1 | 200 ≥1400 · 160 for 880–1399 · mobile variant inline 70px · 1.05/-.06em |
| `1ln1alt` | Inter 17 / 128% / -.02em |
| `x0s9r5` | Inter 14 / 1.5 / -.02em |
| `o1ogpi` | Inter 20 / 1.25 / -.4px |
| `wpi04i` | Inter 700 30 / 1.4em / -.04em; its `strong` renders Inter 300 |

Fonts added in `fonts.css`: Inter 700, Inter 300 italic (the quote) and Inter Display 400 (the counters).

Colors:
- Dividers: `rgba(255,255,255,.18)`
- Muted body text: `rgba(255,255,255,.7)`
- Why-choose description: `#777`
- Intro grey: `rgba(49,49,49,.6)`
- CTA background: `#080808`

## 1. Industry template (7 CMS pages; heights in px)
| route | 1440 | 1100 | 390 |
|---|---|---|---|
| airlines, banking, insurance, retail, telecommunication | 5860 | 8578–8621 | 7738–7866 |
| healthcare (single-row logos, 2-line H2) | 5836 | 8659 | 7654 |
| utilities (adds the Video Section) | 6676 | 9499 | 9158 |

Every page has the same sections, in order (banking at 1440):

**Hero** `[0,0,1440,900]`
- Height: 100vh (min 500) on desktop, 85vh (min 720) on tablet, 80vh on mobile.
- Background photo, cover. Mobile has a separate portrait crop.
- Top gradient: 74px tall, `#5454544a` to transparent.
- Overlay: `linear-gradient(#6660 45%, #000000b3)`, padding 0 60 80. Tablet padding is 0 40 60; mobile is 0 24 60.
- Desktop layout: H1 column (flex 1, 920 wide) beside the intro block.
  - Intro block: max-w 480, padding-bottom 32.
  - Inner box: 2px left border `#ffffffa6`, padding-left 40.
  - Intro text: 360 wide.
- Tablet and mobile stack the two columns.
  - Tablet: H1 at max 75%; intro text 327 wide.
  - Mobile: intro is a `p` (Inter 15/1.4, or 16px for 810–879), 278 wide.
- H1 fit rule (Framer runtime): when the widest word × 1.1 is wider than the column, font-size = floor(base × column / (word × 1.1)).
  - "Healthcare" renders at 189, 193, 197 and 200px for columns of 880, 900, 920 and 940px.

**Logo Strip** (bg #fff)
- Padding 120/60. Tablet 120/40; mobile 80/24.
- Gap 64 between the heading and the logos.
- Heading (`1ing3ma`, #171719, centered): "Trusted by leading enterprises across industries". Airlines uses "Trusted by enterprises worldwide".
- Logo cards: 80px tall, flex 1, bg #fafafa, radius 4. Logo image max-w 210, opacity .47, contain.
- 8 logos: two rows of 4, gap 4, max-w 1200.
- 6 logos (healthcare, utilities): one row of 6; tablet uses a 3×2 grid.
- Mobile: 2-column grid, gap 4. Logos 1–6 have a 260 max-w (a different Client Card variant); logos 7–8 keep 210.

**Transform** (bg #000) `[0,1401,1440,692]`
- Padding 120/60, gap 92. Tablet padding 60/40; mobile 60/24 with gap 60.
- Glow image: `93SjXd…jpg`, object-position 50% 0, mask `linear-gradient(338deg, #0000 48%, #000)`.
- H2: Favorit 48/1.25/-.04em #fafafa (mobile 32), max-w 862.
- Feature row: height 300 (tablet 356), 3 columns, gap 42, each flex 1.
  - Column: 1px left border, padding 32 (tablet 24).
  - 32px icon, gap 84 (mobile 40), then title and description.
  - Title: Inter 24/1.15/-.04em.
  - Description: 17/1.25/-.04em, `.7` white, max-w 371, balance.
- Mobile stacks the columns with a 1px top border and padding 32/0. Order becomes card 2, card 3, card 1 (live `order` rules).

**Video Section** (utilities only)
- 100vh, padding 60, space-between. Tablet padding 100/40/60. Mobile is auto height (min 160vh), padding 80/24/60.
- Background loop:
  - 16:9 at ≥1400: `/videos/ppc-16x9-short.mp4`.
  - 9:16 below that: `/videos/ppc-9x16-short.mp4`. Mobile box is 43% tall at top 217.
  - Masked with a top/bottom fade gradient.
- Title (`190xti5`, max-w 920; mobile inline 28/1.25 with no balance), then "Watch now".
  - "Watch now" button: white, radius 360, padding 16/32, Inter 500 16/16.
- Description and metrics: border-bottom, padding 80/0.
  - Description: Inter 20/1.25, max 420.
  - Metrics: 3 counters, Inter Display 60/1/-1.8px, white (252), 115px box. Columns 2 and 3 have a left border.
  - Mobile: wrapped rows; metrics 2 and 3 get a bottom border (inherited `unset` on live); labels rgb(169,169,169).
- Counter: counts 0 → value when in view, cubic-bezier(.2,0,.15,1) over 1.5s, rounded.
  - Fit to live samples: .133@165, .413@329, .64@497, .84@746, .96@1078ms.
  - Values: 75 / 91 / 77%.
- Lightbox (live code component): opens `/videos/ppc-16x9-full.mp4`.
  - Overlay: `rgba(0,0,0,.4)`, blur 10, opacity .25s.
  - Dialog: width min(1100, 90vw, 90vh·16/9), 16:9, centered, radius 12, shadow `0 30px 60px rgba(0,0,0,.25)`.
  - Open animation: opacity plus scale .96 → 1 over .25s, cubic-bezier(.22,1,.36,1).
  - Minimize: docks to 320×180 at left 20 / bottom 20 over .35s; the overlay fades and page scroll unlocks.
  - Controls: 44px buttons (30px when docked), close, Esc.

**Workflows** (bg #000)
- Padding 60/60/120. Tablet 60/40/120; mobile 0/24/80.
- Desktop: row of 700px height, gap 60. Text column (flex 2) is space-between; media (flex 3) has radius 4.
  - Title: `190xti5`, max 505.
  - 4 items, each max 450. Padding 24/0, gap 16, with a divider above every item except the first.
  - Item title: Inter 500 17/1.25/-.05em.
  - Item description: 17/1.25/-.04em `.7`, max 408.
- Tablet: media first (400 tall). The text column is **200%** wide (a live bug), with a 2-column grid [1,3] [2,4], gap 24.
  - The second column sits off-canvas.
  - Items have min-height 170; item 3 has max-w 280.
- Mobile: media 268 tall; text column 200% wide; one column.
  - Items 2 and 4 use Inter 400 20/1.4/-.02em titles.
  - Descriptions overflow and are clipped at the viewport edge, as on live.

**Why Choose** (bg #fff)
- Padding-top 120 (mobile 84/0).
- Title (#080808) and intro (grey), both `190xti5`.
- 4 rows. Each row: padding 0/60/60, a 1px line, then body padding-top 60.
  - Title frame: 628×49, gap 8.
  - Side: image 310 wide, aspect 1.584, opacity 0, radius 4; then a 382-wide description with padding-left 64.
- Tablet and mobile (`v-1ipgjxf` / `v-knpyt8`) stack the row:
  - Padding 0/40/64 (tablet) and 0/24/64 (mobile).
  - Image is visible, full width, below the text. Gaps 32/24/42. No hover.
- Hover (≥1400):
  - Background goes to #f5f5f5, the line to `rgba(0,0,0,.1)`, and the image fades in.
  - An "—" (Favorit 42/1.15/-.05em, rgb 20) appears; the frame gap goes to 16, and the title slides 60 → 111 (FLIP).
  - Curve: cubic-bezier(.1,0,.4,1) over 420ms, the same on leave. Live progress .216@50, .424@100, .596@150, .737@200, .85@250, .933@300, .98@350ms.

**Closing CTA**
- 700 tall, padding 160/60. Absolute #080808 layer with a radial-masked image `radial-gradient(141% 80% at 50.5% 100%, #0000 35.4%, #000)`.
- H2: 660 wide (max 50%; mobile 100%), centered.
- Pill: 140×50, Inter 16/26/-.5.
- Appear: H2 opacity on spring 200/60 with delay .5 (in view); button tween .6s [.44,0,.56,1] with delay .5.

Nav theme: dark over Hero, Transform, Video, Workflows and CTA; light over Logo Strip and Why.

Motion on load: H1 word reveal (heading spring) and intro words (paragraph spring, 50ms per word) start together. The logo heading reveals in view.

## 2. Case-study template (3 pages; 1440 / 1100 / 390 heights)
| page | 1440 | 1100 | 390 |
|---|---|---|---|
| financial-services | 2752 | 3241 | 3912 |
| healthcare | 2984 | 3531 | 4127 |
| telecommunication | 2843 | 3387 | 3987 |

Container:
- Max-w 800, centered, column gap 60.
- Padding 150/0/80. Tablet 150/40/80; mobile 120/20/80.

Header:
- Tag chip: #f7f7f7, radius 8, padding 4/8, `x0s9r5` at `.6` black.
- H1: `190xti5`, width 90%. Black (#171719 on mobile).
- Subtitle: `o1ogpi`, `.8` black.
- Divider: #e6e6e6.
- Stats row: 84px, gap 50 (wraps on mobile). Each stat is a label (the first one 121 wide) plus a value (Favorit 32/1.1/-2px).

Banner: 400px, radius 24.

Rich text (`.cs-rt`, Framer framer-text rules): each block after the first gets a margin-top.

| block | margin-top |
|---|---|
| p | 30 |
| h2 | 40 |
| h3 | 0 |
| ul | 32 |

- List items: `li` padding-inline-start 2ch, with a "•" at the start.

Quote card:
- Box: 283 tall (380 on mobile), #fafafa, radius 20, padding 20, gap 24.
- Left bar: 5px gradient (lilac → peach).
- Content, top to bottom:
  - Logo: 177×37.
  - Quote: Inter 300 italic 20/1.4em, balance.
  - Name: Inter 500 16.
  - Role: 12px #999.
  - The name block has min-width 300.

Motion (re-measured; page-load origin):
- Stat values: per character, 50ms stagger, starting first.
- H1: one element (blur 10 / y 10) on spring ~140/24, about 30ms later.
- Subtitle: per character but staggered **per line** (~45ms), starting about 90ms after the H1, on spring ~300/50.
- The last word of each effect is `white-space:unset`, so it can break mid-word, as on live.

Nav: light variant throughout (no dark sections).

## 3. Known differences / notes
- Utilities background video file names differ from live (local copies of the cdn files); geometry is identical.
- Footer is shared: on live its variant follows each page's own breakpoints. Industries switch to the desktop footer at ≥1400; case studies at ≥1200, with tablet down to 810. The shared Footer switches at 1440 / 880, so heights differ between 1400–1439 (industries) and 1200–1439 / 810–879 (case studies).
- Telecom's 8th logo changed on live during this session (`XdvldJ…` → `i3CYsJ…`); the data follows the current live version.

## Parity fix: insurance workflow image focal point (2026-11-06)

Live renders the insurance workflow image with `object-position: 25.1% 39%` (the other six industries use 50% 50%). Stored
as `workflows.mediaPosition` in `src/pages/industries/data/industries.js` and applied by `Workflows.jsx`.
