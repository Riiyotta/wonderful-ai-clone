Source: https://www.wonderful.ai — content group (/blog, 51 × /blog-articles/<slug>, /legal, 9 × /legal/<slug>).
Measured live with headless Playwright (Chromium) on 2026-11-03 at 1440×900, 1100×900 and 390×844.

# Content group: clone spec

## How it is built
- **Extraction.** `src/pages/content/_extract/extract.cjs` (node) reads `_source/pages/*.html` in a headless Chromium with JS disabled and the network blocked, then writes the following:
  - `data/articles/<slug>.json`: title, author, date, description, hero image and/or video, `bodyHtml`, an optional sidebar ("Story Details"), and the related cards. Desktop shows 3 related cards (`related`); tablet and mobile show 4 (`relatedTM`).
  - `data/blog.json`: the featured card, 50 grid cards, the tabs, and each post's category. Categories come from `categories.live.json`, recorded on live by clicking each filter tab.
  - `data/legal/<slug>.json`: title, the date label, dates (desktop and mobile variants), and `bodyHtml`.
  - `data/titles.json`: every `<title>`, used by `src/routes/content.jsx`.
  - `src/styles/content/richtext.gen.css`: Framer's own `.framer-text` base rules plus every text-style preset (`framer-styles-preset-*`) in all their `@media` variants, re-scoped under `.cx-rt`. It also carries the `--token-*` colour variables. Duplicate preset blocks keep their *last* occurrence, which matches the live cascade.
  - Assets: internal links become absolute paths. framerusercontent assets become `/assets/<basename>` or `/videos/<basename>`. cdn.wonderful.ai videos go to `/videos/<clean-name>.mp4`. Anything missing is downloaded with curl.
- **Rich text.** Bodies are injected as Framer's own markup (`p/h1–h4/ul/ol/li/blockquote/img.framer-image/table/figure/.framer-text-module`) and keep their `framer-text` and preset classes. Computed typography therefore matches live element by element, because the CSS is the same.
- **Layout.** Layout CSS is hand-transcribed from the Framer classes into `src/styles/content/{article,blog,legal,lightfooter}.css`.
- **Page breakpoints.** All four templates switch at 1200 and 810 (desktop ≥1200, tablet 810–1199.98, mobile ≤809.98), not at the homepage's 880/1440. Framer `ssr-variant hidden-*` wrappers map to `.cx-v` (`display: contents`) plus `.cx-hide-d/t/m`.
- **Re-running.** Run `node src/pages/content/_extract/extract.cjs`, then `node src/pages/content/_extract/check-routes.cjs [--width=390]`.

## Fonts (src/styles/content/fonts.css)
- Inter 700, 700i, 400i, 300i, 500i and 600i (latin), for `strong` and `em` in the rich text.
- Live also declares Arabic-range (Noto Sans Arabic) faces for "ABC Favorit Light" at weights 300–700, and a placeholder of local Arial with `size-adjust: 100.95%` (ascent 94.11%, descent 24.77%). Together these change how Latin text renders:
  - A `<strong>` inside a Favorit heading asks for weight 400. Chrome picks the 400 face, which only covers Arabic, so the run falls back to the placeholder (Arial).
  - Example: a 32px H3 is 604.25px wide on live and wraps; it is 599.9px without these faces and does not wrap.
  - The clone declares the same faces. The placeholder families are renamed `"CX Favorit Light Placeholder"` and `"CX Inter Placeholder"` because other groups' CSS redefines the original names without metric overrides, and their CSS loads later.
- Fragment Mono 400 (latin), used by the binary pattern on /legal.

## /blog-articles/<slug> (Framer page WD52k)

### Root
- Padding is 180/120/120 on desktop, 180/64/120 on tablet and 140/24/120 on mobile.
- Column gap is 60 (40 on mobile).

### Head
- Width 800, gap 32.
- Meta row: author `|` date, gap 10, preset 1bkfxbx (Inter 14 / 145% / −.01em).
  - Desktop and tablet: author is rgba(31,31,31,.8), date is #31313199, the bar is rgba(0,0,0,.1) in 17px.
  - Mobile: the row becomes a column, the author is #777, and the bar is rotated 90°.
- Title: h1, preset 190xti5 (Favorit 48/105%/−.04em; 42/115% at 800–1199; 34/115%/−.05em below 800), centred, colour #171719.
- Description: preset 1ln1alt (Inter 17/128%/−.02em), centred, max-width 600. Opacity is .66 on mobile. Empty descriptions still keep the 8px gap.

### Banner
- 1064 wide (100% on tablet and mobile), aspect 1.7778, radius 8.
- Contains a cover image, optionally with a video on top: ai-gateway, computer-use, ppc-energie and series-c have a looping muted video with controls and radius 8.

### Body
- Max-width 600, `--framer-paragraph-spacing: 32px`.
- Presets: p 1ln1alt (17px, #393939, spacing 30), h3 pyuk04 (Favorit 32/115%/−.04em; 22 at 810–1439; 24 on mobile), h4 1ing3ma, h2 190xti5, links 68ruwb, blockquote 1dxr6ef (16px italic #999, 2px #ddd rule, 22px left padding), images 1adqy14.

### Story Details sidebar (maccabi, mercado-libre, ote)
- Width 300, padding 28, 1px #e6e6e6 left border, sticky at top 120, row gap 60.
- On tablet and mobile it moves below the body with a top border, max-width 600.

### Divider and More Posts
- Divider: 1px #e6e6e6, max-width 1200.
- "More Posts" heading: h3 pyuk04 on desktop and tablet, h4 1ing3ma on mobile, colour #000.
- Grid: 3 columns with a 30px gap on desktop; 2 columns on tablet; a single column with a 24px gap on mobile.
- Desktop lists 3 cards; tablet and mobile list 4.

### Card component (fr5mj / 9rut2n)
- Image: aspect 1.7778, radius 8.
- Text block: 8px left padding, gap 8.
- h4: 1ing3ma (26/125%/−.05em; 24/115% below 1200).
- Date: Inter 14 / 1.6em / −.02em, #696969.

## /blog (Framer page jVSVd)

### "All Posts" block
- Padding 144/60/60 (140/40/60 on tablet, 130/20/40 on mobile), gap 60 (40 on mobile).
- Background `linear-gradient(#0000 50.14%, #fff)`, max-width 1440.

### Featured card
- Card variant 18fb6ag on desktop: the image is 823 wide (min 640) with a wrapping row, gap 40. The text column is at most 33% wide with gap 12, in the order date, then h3 pyuk04, then description 1ln1alt #6b6b6b.
- Variant bj21h1 on tablet and mobile: h4 1ing3ma, then description x0s9r5, then date.
- On tablet the link is a row whose container is `flex: 1 0 0`.

### Header and tabs
- Header: h1 "All Posts" in preset pyuk04. The subtitle uses 1ln1alt on desktop and tablet and x0s9r5 on mobile, in #6b6b6b.
- Divider: 1px, #0000001a.
- Tabs: padding 4/12, radius 1000, Inter 14/150%/−.02em (preset x0s9r5). Active is #f5f5f5 with #171719 text; inactive is transparent with #6e6e6e text.
- Switching tabs is instant (no transition) and writes `?blog-category=<slug>`. "All" clears the parameter, and deep links work.
- The featured card stays visible under every tab.

### Grid
- `repeat(auto-fill, minmax(409px, 1fr))` with a 50/30 gap, which gives 3 columns at 1440 and 2 at 1100. Mobile uses `minmax(220px, 1fr)`.
- Cards: image aspect 1.7778, radius 8; gap 24; h4 1ing3ma clamped to 2 lines at max-width 80%; date x0s9r5 in #31313199.

### Page heights per tab (1440)

| Tab | Height (px) |
|---|---|
| All | 8258 |
| Product | 2195 |
| In production | 2195 |
| News | 3812 |
| Perspectives | 3408 |
| Customer stories | 2599 |

The clone matches every one of these.

## /legal/<slug> (Framer page FXDOZ): no site nav or footer on live
- Page background is #fafafa with min-height 100vh.
- Container: width 1200 (100% on tablet and mobile), padding 120/60 (90/60/120 on tablet, 60/20 on mobile), gap 64.
- Title: h2 190xti5, left-aligned, max-width 768.
- "Updated Date:" (unstyled framer-text) followed by the date in 1ln1alt:
  - Desktop and tablet: the date is #777 and centred.
  - Mobile: the date is rgba(0,0,0,.5) and left-aligned.
- Divider: 1px #000000bf at .65 opacity, hidden on mobile.
- Body: max-width 980. Presets: p ffcr9e (justified), links 8y431r, h3 pyuk04, h4 1ing3ma, tables 1ruyxkb (privacy, sla), and lists.

## /legal index (Framer page 5y7vo)
- Uses the shared Navbar and the **"White L" footer variant** (`src/pages/content/footer/LightFooter.jsx`).
- Container: width 1200, min-height 80vh, padding 120/60/60 (80/20/60 on mobile), gap 64.
- h1 "Wonderful legal": preset j6r4ug (Favorit 72/105%/−.06em; 54 on tablet; 38 on mobile).
- h2 "Legal policies": 190xti5.
- Links (component Fac2M):
  - Inter 14 / 150% / −.05em, rgb(0,102,204), `ss03`. Each row has 4px vertical padding and a min-width of 200; rows are 20px apart.
  - Each link is followed by a 22px icon that is always invisible (opacity 0).
  - Hover changes the colour to rgba(0,102,204,.75) with a spring of about .3s and bounce .2.
- Item width: 40% on tablet, 100% on mobile.

### White L footer
- **Band**
  - Min-height 480, background rgb(247,250,255). Title h2 190xti5 in #393939, max-width 60%. Black "Get in touch" button, 140×50, radius 50, Inter 16/26.
  - Hover on the button: the background fades #000 → rgba(0,0,0,.8) and the shadow alpha goes .3 → 0, on an overdamped spring of about stiffness 200 / damping 60.
  - Appear: the title fades opacity .001 → 1 on a spring (stiffness 200, damping 60) after a .5s delay. The button fades over .6s with cubic-bezier(.44,0,.56,1) after .5s.
- **Canvas 1 (multiply, opacity .8)**
  - Port of the "Animated Gradient Background" component (paper-design warp shader, WebGL2).
  - Colours: #ece8e1, #ced8ff, #fff.
  - Settings: rotation 123, proportion 75, scale .08, softness 100, swirl 16, shape Edge, shapeSize 22, seed offset 88. Swirl iterations are 4 on desktop and 16 on tablet and mobile.
  - It runs while in view, at a speed of `cubic-bezier(.65,0,.88,.77)(.75) × 5`.
  - Box: top −280, bottom −574 (mobile −320 / −343).
- **Canvas 2 (overlay)**
  - Port of the "Animated Pattern Background" component (ASCII style).
  - Characters: " 01" in Fragment Mono 12px, colour #313131, on rgb(201,211,255).
  - Settings: pattern 3, frequency A 1, frequency B 0, centre speeds 8/4, easing 62, inverted.
  - Time is advanced every 10ms.
  - Box: 132% tall, top −5.375% (−21.83% on mobile).
- **Columns**
  - Same geometry as the dark footer. Titles are 1mywhy3 in #393939 at .65 opacity. Links are 1gjbdzu + 1e7mtqr: rgba(31,31,31,.8), hover #0c0c0d, current page #1f1f1f.
  - "Deployment" and "Strategy" use the dark-footer link preset on live, rgba(255,255,255,.7), so they are invisible on white. This is reproduced as-is.
  - "X (Twitter)" sits at .8 opacity.
- **Wordmark row**
  - 1px #0000001a top border.
  - Image at .1 opacity: 95% wide, max 1400.

## Motion (exact values from `__framer__appearAnimationsContent`, or sampled)
- **Card image appear (h4me46):** on page load, also below the fold, opacity .001 → 1 on a spring (duration .4, bounce .2). Sampled live and clone: both reach 1 about 180ms after starting.
- **Blog content appear (b89lqw):** opacity .001 → 1 and y 50 → 0 on a spring (duration .5, bounce 0) after a .2s delay. The sampled curves match within about one frame.
- **Card hover (featured and related):** the container opacity goes 1 → .8.
  - Enter: spring of about duration .4 / bounce .2. Live samples: .969 at 32ms, .909 at 66, .857 at 99, .822 at 132, .803 at 166, then .794 minimum.
  - Leave: softer spring of about duration .45 / bounce 0.
  - Grid cards on /blog have no hover.
- **Legal index link hover:** spring of about .3s, bounce .2.
- **Not animated:** the blog tabs.
- **Rich-text video modules:** hydrated to autoplay, muted, loop and `preload="auto"`.
- **Hero videos:** autoplay, muted, loop, with controls and `preload="auto"`.

## Not reproducible or out of scope
- The ASCII and warp canvases are time-based from mount, so individual frames differ from live; the algorithm and parameters are identical.
- The live cookie banner is not part of this group.
