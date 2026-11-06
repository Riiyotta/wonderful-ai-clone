Source: https://www.wonderful.ai/ai-gateway, /deployment, /ai-transformation

# Platform group: clone spec (measured live with Playwright, 2026-11-03)

Geometry is `[x, y(page), w, h]` in CSS px. Widths measured: **D** 1440x900, **T** 1100x900, **M** 390x844. Page breakpoints are 880 / 1440. The text presets use their own breakpoints, listed in §0. Global tokens, nav, footer and the word-reveal system are in `CLONE_SPEC.md`.

| route | live title | page height D / T / M |
|---|---|---|
| /ai-gateway | `Wonderful AI Gateway \| A command center for all enterprise AI` | 7455 / 8396 / 7484 |
| /deployment | `Wonderful \| The Enterprise AI OS ` | 4417 / 5712 / 5990 |
| /ai-transformation | `Wonderful \| The Enterprise AI OS ` | 4350 / 4621 / 5956 |

Code lives in `src/pages/platform/*`, CSS in `src/styles/platform/platform.css`, and routes in `src/routes/platform.jsx`.

## 0. Text presets (from the Framer preset CSS)

| preset | role | default | 810/800–1199 | <810/<800 | features / wrap |
|---|---|---|---|---|---|
| 1idioqq | H1 | Favorit 300 64 / 105% / -.06em | 48, -.05em (810–1199) | 38, -.05em | ss04 ss05 |
| 190xti5 | H2 | 48 / 105% / -.04em, 3px bottom padding | 42 / 115% (800–1199) | 34 / 115% / -.05em | ss04 ss05; `text-wrap: balance` only via per-element overrides |
| pyuk04 | H3 | 32 / 115% / -.04em | 22 (810–1439) | 24 | ss02 ss04 ss05 ss11 |
| 1ln1alt | body 17 | Inter 17 / 128% / -.02em | – | – | blwf cv03 cv04 cv09 |
| o1ogpi | hero sub | Inter 20 / 125% / -.4px | – | – | – |
| x0s9r5 | small 14 | Inter 14 / 150% / -.02em | – | – | ss03 |
| voew0c | feature title (h5) | Inter 300 20 / 115% / -.05em | – | – | ss04 |
| 1ing3ma / qb2ly8 | accordion number / title | 26 / 125% (number), 26 / 115% (title), -.05em | 24 / 115% / -.04em (≤1439) | 24 | number adds cv11 ss04 ss05 |

Which elements are `balance` was checked on every heading and paragraph at all three widths against live (`text-wrap-style`), and they now match.

## 1. /ai-gateway (page bg #080808)

### 1.1 Hero `[0,0,1440,1252]`
- **Box.** Padding 230/60/0, gap 172, column, start-aligned.
  - T: min-height 119vh, padding 150/40/0, gap 120.
  - M: padding 139/24/0, gap 44.
- **Background.**
  - D: `SuEMXvP1…jpg`, cover, 50% 0%.
  - T/M: `Ae16pHbd…jpg` with a radial mask:
    - T: `150% 57% at 45.9% 100.9%`
    - M: `200% 33% at 50% 89.8%`
    - Both: `#0000 35.4%` → `#000 100%`.
- **Tag & Title.** 950 wide, gap 24 (T/M 32).
  - Lockup `vebmpCK8…svg` 255x32 (T height 30, M 150 wide).
  - Inner gap 12 (T/M 16).
  - H1 (max 814), copy "A control center⏎for all enterprise AI".
  - p 20px, 646 wide on D: "Run all your AI stack through one place to observe, control, and optimize it." Word-reveal paragraph variant, on mount.
- **Dashboard.** Framer code component "Gateway Overview Live", at D `[120,654,1200,598]` and T `[40,474,1020,508]`.
  - Ported verbatim from the live module `nzGDh76Bs-…BFuqs1C1.mjs` into `gateway/GatewayOverview.jsx`. Only the minified React imports are rebound.
  - Interactive: the 7d / 30d / QTD tabs morph the data over 650ms; the sidebar `aria-current` moves; there are chart tooltips.
  - Intro: the chart draws over 700ms once 20% is visible.
  - Fade overlay: the `100vw` gradient from `rgba(8,8,8,0)` to `#080808` is part of the component.
  - M: replaced by the static `AoyBbwo6…jpg`. Aspect 2.0067, radius 10, shadow `0 24px 60px -12px #00000059`, mask `linear-gradient(#000 40%, #0000 75%)`.
- **Motion.** H1 appear: opacity .001 → 1, spring 200/60, delay .1.

### 1.2 Video section
"Gateway Video Section" is a code component, ported in `gateway/VideoSection.jsx` and verified frame-for-frame at D and T.
- **Track and stage.** Track height 240vh; stage is sticky with height 100vh.
- **Scroll mapping.**
  - `p` = progress, from `start start` to `end end`.
  - `u = clamp((p - .04) / .66)`.
  - `e = 1 - (1 - u)²`.
  - Frame width = `o·.56 + o·.44·e`, where `o` = min(1680, vw-120) at ≥1440, vw-80 at ≥880, vw-48 below.
  - Frame height = `min(9/16·w, vh-48)`.
  - Media scale goes 1.1 → 1.
  - Title halves translate ±`((vw - titleW)/2 - 48)` over u 0 → .6. That is 451px at D.
  - Title opacity is 1 until u .3, reaching 0 at u .58.
  - The play button turns on at p ≥ .72: opacity 0 → 1 and scale .88 → 1, .35s `cubic-bezier(.22,1,.36,1)`.
- **Measured at D** (offset from the section top → frame width): 60 → 752, 180 → 906, 300 → 1036, 540 → 1222, 900 → 1320.
- **Media.** Poster `zI0osPtD…jpg`. The muted loop `/videos/U8Du8JtkAFEjYT2j40UACIxYg.mp4` fades in (.6s) on `playing`, and only plays while visible (IO rootMargin 300px).
- **Simple mode.** Used when the section is under 810 wide (M) or with reduced motion: padding 60/0, a 16:9 frame, play button always on.
- **Click → lightbox.** This is the site's shared "Play video" component (`gateway/lightbox.js`):
  - Backdrop `rgba(0,0,0,.4)` with blur 10.
  - Dialog: `min(90vw, 1100)` wide, 16:9, centred, radius 12. Opens from scale .96 / opacity 0 over .25s `cubic-bezier(.22,1,.36,1)`.
  - Minimize docks a 320x180 player at left 20, bottom 20 (.35s). Close fades over .2s. Esc closes.
  - Video: `/videos/ai-gateway-online-v8.mp4`, downloaded from `cdn.wonderful.ai/videos/AI Gateway/Online v8 (Web, under 20MB).mp4`.

### 1.3 Capabilities `#capbility`
- **Box.** Padding 160/60/120, gap 80. T: padding 120/40, gap 60. M: padding 64/24/84, gap 40.
- **Title row.** Space-between.
  - H2, max 790 (with a 24 padding-right): "AI usage is outpacing AI control.⏎The gateway is where you get it back."
  - T copy: "AI usage is outpacing  AI control. The gateway is where you get it back."
  - M: 32px / 1.05 / -.04em, "AI usage is outpacing⏎AI control. The gateway⏎is where you get it back.", column gap 30.
  - Right: two p's, 16 / 19.2 at .7 white. Width 351 (T 279).
- **Cards.**
  - D: 2x3 grid, gap 24, each 648x454 (aspect 1.4276). Full-bleed image, radius 8, padding 32, text at the bottom.
    - Text block max 560, gap 12; H3 is white.
    - The 4th card's p is 16 / 19.2; the others use body 17.
  - T: card bg `#1e1e1e`, height 442.
  - M: card bg `#1e1e1e`, rows column gap 16.
  - T/M layout: visual at aspect 1.751 on top, then text with padding 0/24/24 (M 0/16/16).
  - T/M use different visuals (`AnK6F…` contain top, `syXUS…`, `bZQIy…`, `vhpdx…`, `LHDZK…`, `qBvny…` top).

### 1.4 "What it means for your business" `#black`
FeatureGrid, dark:
- Padding 120/60.
- Four columns, gap 24. Each column has padding 32, a 1px left rule `rgba(255,255,255,.18)` drawn with `::after`, and backdrop blur 20.
- Icons: white Phosphor, 32px. Gap 60 from the icon to the text.
- h5 is #fafafa. p is 14 / 21 in #9e9e9e.
- The 4th column does not stretch (it is 245 tall vs 266).
- T: 2x2 grid, gap 40/24.
- M: stacked, top rule, padding 30/0.
- Below it: a divider, 1px `rgba(255,255,255,.18)` inside the 60px gutters.

### 1.5 Products ("Transform the way you work on a unified platform")
- **Box.** Padding 120/60, gap 84. H2 max 560, balance.
- **Cards.**
  - 3 across, gap 16, aspect .6973. Padding 28/20, gap 12, radius 8.
  - Column: spacer `flex 1.4` → lockup → spacer `flex 1` → one-liner (14px, max 218, balance) → "Explore" small pill (80x37).
  - Lockup sizes:
    - AI OS: 153 wide (T 215).
    - Agents and Systems: 28 tall (T 35).
    - M: all 30 tall.
  - T: 1-col grid with `grid-template-rows: repeat(4, min-content)`. The empty 4th row adds 16px, which live has too. Cards 350 tall; padding 120/40/80.
  - M: padding 72/20, gap 64. Cards aspect .814, gap 12. The Agents one-liner is 60% wide; the others 80%.
- **Hover.** None on cards or pills (verified).

## 2. /deployment

### 2.1 Hero
- **Box.**
  - D: 85vh, min 500, padding 106/60/60.
  - T: min 560, padding 0. Inner block: flex 1, padding 166/40/60, gap 16.
  - M: 80vh, padding-top 49. Inner block: padding 24, gap 16.
- **Image.** `GE2ff9…jpg` cover. M uses `OUaQj…png` at 65% 48%.
- **H1.**
  - D/T copy: "Deployment is where⏎enterprise AI succeeds or fails." (950 wide on D).
  - M copy: "Deployment is⏎where enterprise AI succeeds or fails."
  - Motion: appear spring 200/60, delay .1.
- **p.**
  - D: 20px (o1ogpi). T/M: 17px. T max 80%.
  - D/T copy has a hard break after "production,". M has no break.
  - Motion: word reveal (blur 10 / y 10), on mount.

### 2.2 `#2nd-section`
- **Box.** White, min-height 70vh, padding 120/60, gap 60.
  - T: start-aligned, gap 64, padding 120/40.
  - M: padding 84/24.
- **Row.** Gap 12.
  - Left column:
    - H2 "Locally embedded deployment teams", #000, balance. Word reveal uses the **paragraph** style: blur 10, y 10.
    - p #6b6b6b, balance.
  - Right column: a 1px rule `rgba(0,0,0,.1)`, then a 40% column holding:
    - Counter "40+" in Inter Display 60 / 60 / -1.8. Counts 0 → 40 over 1.3s CSS `ease`, floored, when it enters view (fitted to the live samples, error 1).
    - p 16 / 24 / -.5, `rgba(0,0,0,.6)`, word reveal.
- **Card pair** (`PlatformCards`):
  - D: 542 tall. The expanded card is 60% wide (image, scrim `linear-gradient(transparent 35%, rgba(0,0,0,.82))`, p at .7 white, max 80%, balance). The collapsed card fills the rest (bg `rgba(17,17,17,.05)`, title #171719).
  - Hovering the second card swaps them; leaving restores the default.
  - Measured transition (width, bg, title colour): spring 360/38. The newly expanded title fades in from transparent white.
  - T/M on this page: stacked 492-tall cards, both expanded, padding 24, p at .9 white, content max 450.
  - Cards: FDE (`vVKXkk2…jpg`) and DS (`cXLe4OB…png`). No links.

### 2.3 Phases `#wonderful-lead`
- **Box.** #080808, padding 120/60 (T 120/40, M 84/20), gap 120 inside.
- **H2.** "From Wonderful-led to⏎full client ownership, by design."
- **Tabs.**
  - Track `#232323`, padding 4, radius 999. Chips padding 9/16, 14px, -.06em.
  - Active chip: bg `#0f0f0f`, text #fff. Inactive: transparent, text `rgba(255,255,255,.45)`.
  - Crossfade: spring 540/38.
  - No autoplay: 20s observed with no change.
- **Content.** Gap 32.
  - H3, balance.
  - Progress row, gap 32:
    - Track: 8px, `#ebebeb`, flex 1.
    - Fill: `#1c7fff`. Spring 160/22 with slight overshoot.
    - % label: Inter 300 64 / 64 / -.03em, `#1c7fff`. It follows the fill (75 → 50 counts down through 73, 70, …).
  - p, balance.
  - Chips: bg `rgba(255,255,255,.08)`, radius 6, padding 8/12, 16px `#b4b4b4`, wrap with gap 8.
- **Phase copy.**
  - Phase 1 (75%): "Get the right use case into production, fast." Chips: Discovery & scoping, AI Workshops, Production pilots.
  - Phase 2 (50%): "We build with you, so you can build on your own." Chips: Co-building, Training, Builder enablement.
  - Phase 3 (25%): "Keep production running and take ownership." Chips: Support, Handover, Production pilots.

### 2.4 `#deploy`
FeatureGrid, light:
- Bg #fafafa, max 1200.
- Subtitle: 17px #777, max 600, with a hard break.
- Columns: bg `rgba(255,255,255,.1)`, left rule `rgba(0,0,0,.1)`. Icons #171719.
- Padding: T 120/40; M 60/30.

### 2.5 Closer `#closer`
- **Box.** 640 tall, padding 160/60. T: padding 160/40. M: height auto, padding 120/24.
- **Image.** `4ZA5m…jpg` cover, 50% 100%.
- **Title.** 660 wide, max 50%, balance; T 549, M 370.
- **Motion.** Title: opacity spring 200/60, delay .5. "Get in touch" pill (140x50): tween .6s, delay .5.

## 3. /ai-transformation (page bg #080808 behind the closer)

### 3.1 Hero
- **Box.** Same box as deployment. M padding 60/24.
- **Image.** `7sauq…jpg` (M `65w2jyk…png`), with a `rgba(0,0,0,.1)` overlay.
- **H1.** Max 1200, balance: "AI is not a technology you adopt.⏎It's a change to how your organization operates."
  - M: preset 6rsens, 32 / 1.05 / -.07em. Three explicit lines, white spans on an h1 coloured #171719.
  - Motion: appear spring 200/60, delay .1.

### 3.2 `#body`
- **Box.** White, padding 120/60 (T 120/40, M 84/24), gap 80 (M 64).
- **Dividers.** 1px `rgba(0,0,0,.1)`. The second divider is hidden on T only. That, and gap 80 instead of 1+80+80, is how live measures.
- **Row 1.** Gap 60.
  - H2 (max 40%): "The enterprise of the future". On T the copy is **"Built for teams building at scale"**. Paragraph-style word reveal.
  - Paragraph stack: flex 1, max 540, gap 30, four paragraphs, 17px #777.
    - Motion ("Paragraphs" effect): all four trigger together when 50% of the stack is visible. Each goes opacity .001 → 1, blur 10 → 0, y 10 → 0, with a 50ms stagger.
    - Fitted spring: 300/50. Live samples: .07 at 42ms, .31 at 92, .51 at 142, .65 at 192, .83 at 292.
- **Row 2.**
  - H2 "AI transformation principles", #393939. M padding 32/0.
  - Accordion: 50% wide, max 540, gap 42.
  - Items: header (number in `rgba(49,49,49,.6)` + title #393939, wrap gap 8/12) plus a 22px caret (stroke `#31313199`, 1.5).
  - When open: a 17px #777 p, balance. Divider: 1px `#ffffff2e`, which is invisible on white but takes space. The last item has no divider.
  - Each item toggles independently; item 01 is open by default.
  - Height: spring 540/38 (overshoots about 2px). Caret rotates 0 → 180°, spring 280/28. The sub-paragraph mounts and unmounts instantly; only the height animates.
- **`#light-team`.**
  - H2 701 wide, no balance: "Helping critical organizations accelerate AI adoption". T adds a break after "organizations". Heading-style word reveal.
  - Card pair, as in §2.2:
    - AI OS (`PbxeRt98…jpg`, M `wmeFBLFU…png`) → /ai-os.
    - Deployment (`OUaQj…png`, T `SOzfY9h8…jpg`, M `bz6Byt…jpg`) → /deployment.
    - T: both expanded, side by side, 470 tall, flex 1.

### 3.3 Closer
- **Box.** 640 at all widths. Content sits in an absolute layer; M is relative, flex 1, padding 0/24.
- **Image.** `93SjX…jpg` with mask `radial-gradient(141% 80% at 50.5% 100%, transparent 35.4%, #000 100%)`.

## 4. Verification (live vs clone)
**Page heights**

| page | 1440 | 1100 | 390 |
|---|---|---|---|
| /ai-gateway | 7455 / 7455 | 8396 / 8396 | 7484 / 7483 |
| /deployment | 4417 / 4417 | 5712 / 5712 | 5990 / 5990 |
| /ai-transformation | 4350 / 4350 | 4621 / 4620 | 5956 / 5956 |

**Element boxes.** Every h1–h5, p, img and link was matched by text. All are within 2px, apart from these:
- The gateway T hero p box is 16px narrower. The text is identical and centred.
- Two M accordion h4 boxes are wider than the text they hold. The text positions are identical.

**Motion**
- The video section scroll mapping matches live within 0.3px at D and T.
- The dashboard's 7d state is pixel-identical to live.
- The lightbox open, minimize and close geometry is identical.

## Parity fix: card swap transitions armed on first hover (2026-11-06)

`PlatformCards` (/deployment, /ai-transformation) set the width/colour spring on the cards at all times. When the page
viewport is resized (a full-page screenshot does this), the 60%/40% widths animated through a mid-spring state and the
capture caught it (scores 0.568 and 0.594). The transition is now armed by the first hover swap (`data-anim="on"`);
before that the cards are static at 60/40. Behaviour after the first hover is unchanged (spring 360/38).
