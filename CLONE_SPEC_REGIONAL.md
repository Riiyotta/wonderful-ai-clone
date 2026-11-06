# Regional page group: clone spec

Measured live (https://www.wonderful.ai) with headless Playwright on 2026-11-03, at 1440x900, 1100x900 and 390x844. Values come from `getComputedStyle` / `getBoundingClientRect`, plus the Framer CSS in `_source/pages/<route>.html`.

| | |
|---|---|
| Code | `src/routes/regional.jsx`, `src/pages/regional/*`, `src/styles/regional/*` |
| Data | `countries.data.js`, `fcb.data.js`, `jobs.data.js` (all extracted from `_source`) |

## 0. Verification: page height, live vs clone

The box check compared every h1–h4, p, li, img, video, input, button, label and iframe outside the nav and footer. A box counts as a match when it is within 2px **and** has the same font size and line height.

| route | 1440 | 1100 | 390 | boxes |
|---|---|---|---|---|
| /adriatics | 2873 = 2873 | 3445 = 3445 | 4465 = 4465 | all match |
| /baltics | 1977 = | 2501 = | 2668 = | all match |
| /belgium | 2295 = | 2891 = | 3375 = | all match |
| /greece | 2770 = | 3375 = | 3899 = | all match |
| /italy | 2242 = | 2814 = | 3260 = | all match |
| /netherlands | 2367 = | 2939 = | 3485 = | all match |
| /poland | 2391 = | 2939 = | 3447 = | all match |
| /romania | 2359 = | 2931 = | 3433 = | all match |
| /switzerland | 2362 = | 2877 = | 3404 = | all match |
| /uae | 2815 = | 3420 = | 4074 = | all match |
| /fcb/x/arsenal | 3095 = | 3923 = | 2720 / 2719 | all match |
| /fcb/x/slavia-prague | 3095 = | 3901 = | 2698 = | all match |
| /fcb/x/thank-you (extra) | 1646 = | 1402 = | 991 = | all match |
| /ashby (404) | 1088 = | 1518 = | 1685 = | all match |
| /ashby/55005121… | 1080 = | 1080 = | 1080 = | all match |
| /ashby/8de2ffef… | 1080 = | 1080 = | 1080 = | all match |
| /ashby/*/submit | 1339 = | 1339 = | 1339 = | outer layout matches; iframe content not verifiable (§5) |
| /archive/comeet-style | 905 = | 1412 = | 1433 = | empty box, matches |

The only items the checker flagged are live's cookie banner and inherited font sizes on `<label>`/`<button>` wrappers, which do not render.

## 1. Country landing pages (`CountryPage.jsx`, `country.css`, `countries.data.js`)

All 10 pages are separate Framer pages but share one layout.
- **Breakpoints** are the page's own: d ≥1200, t 810–1199.98, m <810.
- **Wrapper:** a flex column, centered, white.

### Hero section
- Width 100%, max-width 1600.
- Padding: d and m `140px 20px 80px`; t `140px 40px 80px`.
- Flex column, gap 60.
- **Title** (preset 1idioqq): Favorit Light 300, 64px / 105% / -0.06em, `ss04 ss05`, #000, centered.
  - t: 48px, -0.05em.
  - m: a separate text node at 40px / 55px / -3.4px with no OpenType features.
- **Banner:** 100% wide, 496px tall (m 330), radius 24. The image is `object-fit: cover` with the object-position from the data.

### Body section
- Width 100%, max-width 800.
- Padding: d `0 0 80`; t `0 40px 80`; m `0 20px 80`.
- Blocks run in a flex column, in this order: text, divider, quote, divider, text, links.
- **Spacing between blocks** comes from Framer's nested flex gaps and differs per page and per breakpoint. The extractor flattened it into `gap: [d, t, m]`:
  - "Long" pages (adriatics, greece, romania, uae): 60 between groups and 40 inside the quote group.
  - UAE uses 32 inside the quote group.
  - Every page uses 40 everywhere on m.
- **Order also differs per breakpoint** and is stored as `ord: [d, t, m]`, where -1 means hidden:
  - /greece swaps its two quotes on m.
  - /uae drops two dividers on m.
- **Text:** Inter 400, 16 / 24 / -0.5px, #000, `pre-wrap`, paragraph spacing 0. Empty paragraphs are one line tall (24px).
  - Links ("Careers page" → `/`): #171719, underlined.
- **Divider:** 1px, #e6e6e6.
- **Quote:** Inter 300 italic, 24px / 1.4em / -0.01em, `cv01 cv09 cv11 cv05 ss03`, `text-wrap: balance`.
  - Gap 40 to the author block, which is a column with gap 10.
  - Name: Inter 500, 16 / 1.2 / -0.01em, `white-space: pre` on d/t, wraps and left-aligns on m.
  - Role: Inter 500, 12 / 1.2 / -0.01em, #999, `cv01 cv09 cv11 cv05`, 395px wide (100% on m).
- **Links row:** row, gap 20 (a column on m).
  - Each link is a row with gap 8 and a fixed width (154 / 197; Greece's second name is 161 wide).
  - Name: Inter 16 / 24.
  - LinkedIn glyph: `9GhIaR1…png`, 16 wide, aspect 1.07831, opacity .5.
  - An empty second anchor (min-height 15) still takes space. Pages with no names have an empty 15px-tall row.
- **Live quirk on /baltics, kept:** the first paragraph is `position: absolute; top: 91%; left: 50%; translate(-50%, -50%)`. It overlaps the last paragraph and runs under the footer. Because it is absolute, the next block has no gap above it.

### Motion
Appear effects run on load, not on scroll. Both start right after hydration.
- **h1:** opacity .001→1, blur(10px)→0, translateY(10)→0 on a near-critical spring (stiffness 144, damping 24). It reaches 50% at about 134ms and 90% at about 314ms.
- **Text blocks and link names:** opacity only, on spring 340/56 (`SPRING_PARAGRAPH`). They reach 50% at about 80ms and 90% at about 275ms.
- Quotes do not animate.

### No video on /romania
`/romania` has **no cdn.wonderful.ai or PPC video**, either in the SSR HTML or on the rendered live page. The hero is the image `qGM6xm…jpg`. Nothing was downloaded for it.

## 2. Fonts added (`src/styles/regional/fonts.css`)

All files already existed in `/public/fonts`. The new @font-face rules are:
- Inter 300 italic (latin `8mwKwSh…`, latin-ext `aUYDUTz…`)
- Inter 700 (`syRNPWz…`)
- Inter 400 italic (`pKRFNWF…`)

## 3. FC Bayern matchday pages (`FcbMatchday.jsx`, `FcbFooter.jsx`, `fcb.css`, `fcb.data.js`)

Shared setup:
- `chrome: 'none'`: the page brings its own lockup and "LP Footer".
- Page breakpoints are d ≥1440, t 880–1439.98, m <880. Text presets keep the 1200/810 breakpoints, so the h1 is 64 / 48 / 38.
- Page background is #080808.

### Hero
- Height: d 960; t 820; m auto with padding `139 24 96`.
- Content gap: 86 / 64 / 48.
- **Lockup:** crest 41 (31) | 1px divider #ffffff80 46 (35) tall | logo 170×47 (128×35).
- **Copy:**
  - Headline: max-width 1000.
  - Subhead: preset o1ogpi 20 / 25, max-width 690. On m it switches to 1ln1alt.
  - Match line: 1ln1alt, max-width 432. On m it switches to x0s9r5.
- **CTA "Request my seat":** white pill, 37px tall, padding `6px 16px`, radius 50.
  - Live links to `#register`. The clone scrolls to it smoothly.
- **Background image** `wGADB…jpg` is masked:
  - d: `linear-gradient(#000 22%, #0000 95%)`
  - t: `radial-gradient(141% 82% at 50.5% 100%, #0000 35.4%, #000 100%)`
  - m: `linear-gradient(#000, #0000)`

### Registration (`#register`)
- Padding: `0 60 120` / `0 40 80` / `0 24 72`. Bottom hairline #ffffff0d.
- **Layout:** a row on d, a column on t/m.
  - Content column: flex 1, padding-top 64 (m 56), gap 64.
  - Form column: 510 wide, padding `64 0 60`. t: 100% wide, padding `40 0 0`. m: padding `64 0 0`.
- **Form card:** #141414, radius 8, padding 24, gap 32. Fields are 24 apart; label to input is 10.
  - Labels: x0s9r5 #777.
  - Inputs: 40px tall, padding 12, inset 1px border #393939, radius 10. Focus border is #ffffff80.
  - Input text: Inter 14 / 1.25em / -0.04em #fafafa; placeholder #777.
- **Submit button:** radius 360, padding `16 32`, white. Hover is #ebebeb with a 0.2s ease-in-out (sampled 255→235 over about 200ms). Label: 1b18csx, Inter 500 17 / 1.25 / -0.05em, #131313.
- **On submit:** live posts to Framer Forms and redirects to `/fcb/x/thank-you` (the `redirectUrl` in the page bundle). The clone prevents the POST and navigates to `/fcb/x/thank-you`. That page is built too: hero video `ur7EFJT…mp4` (downloaded to `/public/videos`), poster and image downloaded to `/public/assets`.

### Practical info
- Background #000. Padding: `120 120 180` / `80 40 120` / `72 0 96`.
- The pitch image is masked `linear-gradient(#0000, #000)`.
- **Title** is Framer fit-text: an SVG with viewBox `1208.46×241` (d), `800×159.5` (t) or `320.84×64` (m) that scales to the container width.
  - It is absolutely positioned at top-left on d, in flow on t, and 91% wide on m.
- **Cards:**
  - d: a row with gap 16, each card flex 1 and 370 tall.
  - t: a 2-column grid, aspect .8.
  - m: horizontal scroll, 320×430 cards, gap 12, 8px edge spacers.
  - Card title: Inter 28 / 1 / -0.08em, centered (on m: top 201).
  - Card body: Inter 18 / 1.4 / -0.04em.

### LP footer
- Inner #080808. Top row: max-width 1200, padding `64 32 0`.
- Logo: a white SVG, the Framer data URI saved as `fcb-footer-logo.svg`.
- Copyright: 12px / 110%, rgba(255,255,255,.55).
- Links: Inter 500 14 / 1.2 / -0.5px, #ffffffb8, hover #fff over 0.2s.
- Wordmark PNG at opacity .08, 95% wide (93% on t/m), in a clipped box 173 / 136 / 80 tall.

### Motion
None. The FCB pages have no appear effects.

## 4. Ashby job posts (`AshbyJob.jsx`, `ashby.css`, `jobs.data.js`)

The live Framer page `rhlou` has a single variant: a fixed **1080px-tall black canvas with overflow clipped**. Only the top of the description is ever visible, and the page height is 1080 at every width. The clone reproduces this.

### Layout
- Column 700 wide (max 100%), gap 107.
- **Head:** a 600-wide column with gap 15, containing:
  - ID and department (1ln1alt, #999)
  - a white 600×24 "back" bar with an arrow icon, linking to `/`
  - the h1 (1idioqq, #fafafa)
  - an empty compensation line
- On m the 600px back bar overflows symmetrically, as on live.
- **"About" h5** (Inter 300 20 / 1.15 / -0.05em): absolute, top 353, left 50.
- **Tags row:** absolute, top 290, left 49%, 585 wide.
  - Tags: Inter 500 14, #999, separated by 1×16 #e6e6e6 bars.
  - "Apply now →": outline pill, 39 tall, 1px #222 border, text #131313. Hover background rgba(0,0,0,.043).

### Description
Framer rich text, color #393939:
- p spacing 30 (preset)
- list spacing 32 (container)
- `li` padding-inline-start 2ch with a "•" bullet
- `strong` is 700; `em` is italic
- links: #1f1f1f, hover #000 over 0.4s

### Live quirk, kept
The Brazil post (`8de2ffef…`) prints the Poland post's ID text (`55005121…`). Routes use the real IDs.

## 5. Application pages `/ashby/<id>/submit` (`AshbySubmit.jsx`, `AshbyApplicationForm.jsx`)

### Outer page
- Black, padding `140px 20px`. The box is 779×1059, centered.
- "< Go back": absolute at top 70, left `calc(47.9167% - 342.5px)`, on a white chip. Inter 500 14, opacity .6, link #1f1f1f.

### The Ashby form itself could not be measured
- **What blocked it:** live embeds `https://jobs.ashbyhq.com/Wonderful/<id>/application` in an iframe. This machine's network policy blocks it (Netskope / "YOTTA" interstitial: "Category: Job Websites block"), and that block was not bypassed.
- **What the clone does instead:** it renders a local stand-in in the same 779×1059 scroll box that follows Ashby's default hosted layout:
  - logo, title, meta line
  - Overview / Application tabs
  - fields: Name*, Email*, Resume* (upload), Phone, LinkedIn
  - a Submit Application button
  - a "Powered by Ashby" footer
- **This form is not measured.**
- **Submit:** it validates required fields locally and then navigates to `/thank-you`. Testing confirmed no non-GET request is ever made.

## 6. /ashby (the Framer 404 page) and /archive/comeet-style

### /ashby
Uses the standard nav and footer.
- **Hero:** white, max-width 1480. Padding: `0 80 160` (gap 120); t `0 80 120` (gap 100); m `0 30 120` (gap 80). An 80px spacer sits on top.
- **Title:** 1idioqq, #000. On m it is a separate node at 56 / 65 / -3.4px.
- **Body:** x0s9r5 #393939, max-width 500. On d/t there is a forced break after "doesn't".
- **Button:** "Back To Homepage", black pill 50 tall, text white 2mfvz6. Hover background rgba(0,0,0,.84).
- **Gradient blob:** a container 1100 wide, top -811 / bottom 214 (t: -638 / 316; m: 847 wide, -506 / 596), holding three blurred discs:
  - 1066 wide, blur 100, with a conic fill at opacity .8
  - 800 wide, blur 80, rotated by a base 105°
  - 800 wide, blur 100, overlay blend
- **Motion:**
  - The blobs spin about 60°/s (sampled at 1s steps: 6s per turn, linear). The conic fills scale 1→0.8→1 in phase.
  - The title fades in (spring 36/12; 50% at about 280ms).
  - The button fades in at +0.63s.
  - The body uses the shared `WordReveal` "paragraph" variant (blur 10, y 10, 50ms stagger) from +1.04s.
- **Not reproduced:** the exact rotation phase at load. Live's phase depends on time since hydration.

### /archive/comeet-style
An archived page whose only content is a 600×400 Comeet careers embed. It renders nothing on live. The clone keeps the same empty box between the standard nav and footer.

## Parity fix: /ashby header has no language chip (2026-11-06)

Live renders the Framer 404 page (/ashby) with the nav bar lacking the "EN" language chip on desktop and mobile (every
other route has it). The clone passes `hideLang` to `Navbar` for `/ashby` only. The 404 hero's two gradient blobs spin
forever (6s period); the screenshot phase depends on load timing, so that section's score varies run to run (0.77-0.82
measured over six runs).

### Recorded exception (reviewed by the repository owner, 2026-11-06): job application form parity

`/ashby/<id>/submit` scores 0.70. Live embeds `https://jobs.ashbyhq.com/Wonderful/<id>/application` in a 779x1059
cross-origin iframe; on the measurement machine that request returns 403 and the network policy interstitial ("Non-compliant
action ... Job Websites block") is what renders inside the box. That block was not bypassed, so the real form is unknown
and the clone keeps its stand-in. Everything outside the iframe rectangle (Go-back chip, black canvas) matches: 1.000 on
1,102,140 px. Inside the rectangle the live pixels are the interstitial, so the section cannot reach 0.80 without copying a
network-block page, which is not a valid implementation.
