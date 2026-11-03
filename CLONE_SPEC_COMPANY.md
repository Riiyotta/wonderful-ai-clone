# Company group: clone spec (/about-us, /careers, /careers/candidate_notice, /press, /contact, /thank-you)

Measured live with Playwright on 2026-11-03, with the cookie banner dismissed. Values come from `getComputedStyle` / `getBoundingClientRect`, the Framer CSS in `_source/pages/*.html`, and the live code-component modules.

Breakpoints are set **per page** in Framer, so they do not use the nav's 880 boundary:

| page | breakpoints |
|---|---|
| about-us, contact | ≥1440 / 810–1439 / <810 |
| careers | ≥1800 / 1440–1799 / 810–1439 / <810 |
| press, thank-you, candidate_notice | ≥1200 / 810–1199 / <810 |

Text presets keep their own breakpoints:
- h2 `190xti5`: 48 / 42 (800–1199) / 34
- h1 `6rsens`, `1idioqq`, `j6r4ug`: 1199 / 810
- h3 `pyuk04`: 1439 / 810

Code: `src/pages/company/*` and `src/styles/company/*`. Every CSS class is prefixed (`cab-`, `ccr-`, `cpr-`, `cct-`, `cty-`, `ccta-`, `co-`) because another group's global `.pr-title` rule leaked into this group's styles.

## 0. Shared motion and presets
- **Word reveal** on headings and paragraphs (about-us, careers): initial `opacity .001`, `blur(10px)`, `translateY(10px)`.
  - Sampled curve: .37 at 100ms, .60 at 167, .90 at 367, .99 at 700. This is the paragraph spring, stiffness 340 / damping 56, with a 50ms stagger.
  - Implemented with `WordReveal variant="paragraph"`.
- **"Text 1" appears**: opacity spring 200/60 (`SPRING_SOFT`).
- **Lead paragraphs**: spring with duration .5s and bounce 0. Converted as k = (2π/d)² and c = 2(1−bounce)√k.
- **Images**: tween .6s, `[.44,0,.56,1]`.
- **Hover states**:
  - White pill: opacity → .6.
  - Black pill: background → `rgba(0,0,0,.8)`.
  - Outline pill (`::after` 1px #222, radius 90): background → `rgba(0,0,0,.05)`.
  - All three use spring 200/60, exposed as the CSS variable `--co-spring-soft`.
- **CTA band** "Built for The Enterprise" (about, careers): 640px tall on #080808.
  - Image `93SjX…jpg` with mask `radial-gradient(141% 80% at 50.5% 100%, #0000 35.4%, #000 100%)`. The 80% becomes 82% on tablet and 90% on mobile.
  - H2 #fafafa centered, 660 wide / max 50% (549 on tablet, 370 on mobile).
  - The H2 appears with opacity spring 200/60, delay .5; the button with a .6s tween, delay .5.

## 1. /about-us (D 4709, T@1100 6124, M 5980)
- **Hero:** white, padding 160/60/120, gap 32.
  - Row: H1 62/115%/−.05em #171719 (tablet 54/105%/−.07em; mobile 38/120%/−.09em) next to a lead paragraph 16/1.5em at .8 black, max-width 300 (440 on tablet).
  - Image `cmqQ…jpg`: 800px tall, radius 8 (400px on mobile).
- **Mission:** column max 1200, gap 60. Two rows (H2 + text column, gap 60), separated by 1px `rgba(0,0,0,.1)` dividers.
  - Body text is the 17px preset in #6b6b6b, with 30px between paragraphs.
  - Image aspect 1.01681, object-position 11.8% 45.9%.
  - Outline pill "See open positions" → `/careers`.
- **Backed by the best:** padding 120/60.
  - Text column: H2 #000, then a paragraph at opacity .7 in #393939, max-width 80%.
  - Logo grid: 3×2, gap 4. Cards 80px tall (110 on mobile), #fafafa, radius 4. Each image is a cover-fit at 80% width (100% on mobile, except the last card).
- **Stories:** four cards, gap 24.
  - Image 238px tall, radius 4.
  - Title h5 Inter 300 20/1.15/−.05em #393939. On tablet it is Inter 400 16/1.4.
  - The 4th card is 300px tall with a 2-line clamp (3 lines on tablet/mobile).
  - Tablet: 2-column grid with image aspect 1.029. Mobile: single column with image aspect 1.437.
- **CTA band**, then the footer.

## 2. /careers (D 6479, T 9154, M 7136)
- **Hero:**
  - H1 64/1.05/−.06em #000 (48 at 810–1199; 38 on mobile).
  - Copy paragraph 500 wide.
  - Image `DaRx…png`: 800px tall (aspect .9125 on tablet, .855 on mobile).
  - Appears: H1 spring 200/60 delay .1; copy spring .5s delay .2; image tween .6s delay .3.
- **Statement:** port of the Sticky_Reveal_Pro component (`sections/StickyReveal.jsx`).
  - Desktop and tablet: Main is 1050 tall with overflow hidden, so the sticky never sticks.
    - Wrapper 185vh, Favorit 62px (42 on tablet), centered, `text-wrap: pretty`, side padding 3%, bottom padding 300.
    - Progress p = −top / (h − vh).
    - Word i of L reveals over [i/L·.8, +.15].
    - Colour **snaps** from rgb(118) to rgb(57) when t > 0. Live passes a `var()` token that motion cannot mix.
  - Mobile: a separate 150vh block holding a 171vh wrapper.
    - Reveal mode `enteringView`, head start .3, 28px, black highlight.
    - Colour uses a linear-light mix; blur 2 → 0 and y 2 → 0.
  - Verified word by word against live at several scroll positions; values match.
- **"About 1":** black section, 150vh on desktop (916 on tablet, auto on mobile).
  - H2 "Global by Design.⏎Local by Execution.". The tablet H2 is 32/1.3/−2px.
  - Paragraph .7 white, 340 wide.
  - "Submit your role" white pill with a 1px white border, linking to `mailto:`. It appears with opacity 0 and y 24 → 0 (tween .6, delay .1, runs once).
  - The globe container is 100vh tall with overflow clip; the globe itself is 910px (710 on tablet, 350 on mobile, 1200 at ≥1800).
- **Globe:** `sections/Globe.jsx`, a line-by-line port of the live canvas code component.
  - Fibonacci land dots drawn from the bundled 360×180 land mask (`data/globeLandmask.js`), plus dust particles.
  - Auto-rotates through 32 city stops with a 1.5s dwell. Labels are DOM elements with a pulse ring. Draggable with inertia.
  - Instance props and per-breakpoint overrides are in `Careers.jsx`.
- **Main Roles:** four rows.
  - Row padding 0/60/60 with a top line in `rgba(255,255,255,.18)`, which is invisible on white, as on live.
  - Title h3 32px, 628 wide; image 310px at aspect 1.584 with opacity 0; description 382px with left padding 64, #777.
  - Hover (desktop only): background → #f5f5f5 and image opacity → 1. Uses spring k 164 / c 25.6 (fit: .48 at 130ms, .78 at 243, .98 at 365).
  - Tablet/mobile: rows stack (title, description, then an always-visible full-width image).
- **Apply here:** link to `mailto:`, 42px. The mobile variant shows live's placeholder heading "Accelerating delivery", reproduced as-is.
  - Right column: Email link plus the Candidate Privacy Notice paragraph.
  - Whole block appears with opacity 0 and y 24 (once).
- **No jobs widget:** Comeet is loaded on live but nothing renders, so no `/ashby` links are needed.

## 3. /press (D 6628, T 20172, M 10408)
- Dark (#080808). Section max-width 1680, padding 190/20/100 (160/20/60 tablet; 120/20/60 mobile).
- H1 "Wonderful in the news" 72/1.05/−.06em (54 on tablet; 38 centered on mobile). It appears on mount (blur 10, y 10, paragraph spring).
- Divider: 1px `rgba(255,255,255,.18)` at opacity .13, 64px below the H1 (42 on mobile), with 44px padding-bottom.
- **Mosaic:** live arranges different articles and variants in each breakpoint, and the tablet layout contains collapsed 1px items.
  - Card rects were measured at two widths per breakpoint. Every value is linear in the section width S, stored in `data/pressLayout.js` as `[a, b]`.
  - Rendered as `calc(a*100cqw + b px)` inside an inline-size container.
  - Every card's x / y / w and its internal content, logo and title boxes match live within 1.5px at 1440, 1100 and 390.
- **Card:**
  - Square image, radius 8. Scrim covers the bottom 60%: `linear-gradient(transparent, rgba(0,0,0,.2))`.
  - Badge (dot + type) at 16/16.
  - Content block at the bottom: padding 20/16, gap 8. Source text 14/1.45 at .7 white. Title clamped to 3 lines: h4 26 Inter 300 or h5 16.
  - Logo: top-right at 48px or 26px tall, or centered at 200px / 120px wide.
  - Variants: Featured, Standard Center Logo, Featured Center Logo (h3 Favorit 22, source 20px), Small, Small Center text, Small Center Logo, Small Center text Center Logo, Hebrew and Hebrew Mobile (Google Sans).
  - Each card carries the live filter on its badge, content and logo (`brightness(0)` or `brightness(0) invert(1)`).
- **Appear:** the card container goes from opacity 0 / y 40 to rest on spring 320/52 (least-squares fit). It **replays** each time the card re-enters the viewport, triggered at about 10% visible.
- Links open in a new tab. There is no video on live /press, so none was downloaded.

## 4. /contact (D 900, T 1467, M 1416)
- Route chrome is `none`: live has no footer. The page renders the shared `<Navbar/>` itself and hides `.nv-pill`, because the live contact nav has no "Get in touch" pill.
- **Desktop:** two 720px halves, each 100vh tall with 61px top padding.
  - Left half:
    - Image `8BGR…png`, object-fit fill.
    - Content column 430×594, space-between: H1 64 white "Applied AI⏎for the enterprise", lead paragraph (17px preset), a 400px divider, inquiries (12/1.7em at .8 white), and the privacy line.
  - Right half: form, 480 wide, gap 32.
    - Heading: h4 26/1.25 #000. Note 12px #777.
    - Labels 14px. Inputs 40px tall, padding 12, radius 10, background `#0000000a`, 1px `#8888881a` border via `::after`, which turns `#09f` on focus. Placeholder `#5c5c5c80`.
    - Custom selects: button with padding 12/16, #f5f5f5, 1px #eee, radius 8 (10 for Country), 14px text at −.01em; placeholder `rgba(92,92,92,.5)`, black once filled. Chevron 12×8 rotates 180° over .2s.
    - Listbox: top `calc(100% + 4px)`, max-height 200, shadow `0 4px 12px rgba(0,0,0,.1)`. Options use padding 12/16; the selected one is #eee. Clicking outside closes it.
    - Send button: 143×40, black, radius 10, 14/600 white. Hover background `rgba(51,51,51,.85)` over about .2s.
- **Tablet:** a 598px image hero (H2 42 centered, 670 wide) sits above the form (max 640).
  - Under Send: divider, privacy note (11px, 480 wide), divider, inquiries in #777.
- **Mobile:** a 360px hero (H1 32/1.05/−.07em, 320 wide) sits above the form, which is full width.
  - Field gap 16. Industry/Company and Size/Country stack.
  - Send is full width. Order under it: divider, privacy note (324 wide), divider, inquiries.
- **Behaviour:** the form uses native constraint validation (`required`, `type=email`), so the browser shows validation bubbles as on live. The selects are hidden required `<select>` elements, as on live. A valid submit calls `navigate('/thank-you')`. **Nothing is posted:** verified that no non-GET requests are made.
- Option lists come verbatim from the source (`data/contactOptions.js`): 41 industries, 4 sizes, 241 countries.

## 5. /thank-you (D 1803, T 2687, M 2840)
- Section: white, max-width 1600, padding 160/20/80 (109/40/80 tablet; 140/20/80 mobile), gap 120 (80 on mobile).
- Top block: max-width 1200, min-height 50vh, bottom padding 120, 1px `rgba(0,0,0,.1)` bottom border, gap 32.
  - An 88px orb holds two circular videos (`p9SL…mp4`, `preload="none"`, no autoplay). They paint nothing, exactly like live.
- H1 64/1.05/−.06em #393939 (48 on tablet; 38 #1f1f1f on mobile). It appears on mount with blur 10 / y 10.
- Subtitle 20/1.25 at .8 black, revealed word by word on mount.
- "Back to Homepage" black pill: tween .6s, delay .5.
- **From our blog:** h3 32 (22 on tablet; 24 h4 on mobile) plus a 14px subtitle in #696969.
  - Grid: 3 columns with gap 30 (2 on tablet, 1 column on mobile).
  - Cards: image aspect 1.7778, radius 8. Title h4 26/1.25 #171719 with 8px left padding. Date 14px.
  - The tablet layout shows a 4th card, "Let the Field Build the Product".
  - Image appear: opacity spring, .4s, bounce .2.

## 6. /careers/candidate_notice (D 9476, T 9362, M 20056)
- No nav or footer on live (route chrome `none`). Background #fafafa.
- Column: 1200 wide, padding 120/60 (90/60/120 tablet; 60/20 mobile), gap 64.
- Header:
  - H2 48 (preset 190xti5, balance), "Updated Date: Jul 29, 2026" at 16px.
  - 1px `#000000bf` rule at opacity .65.
- Rich text extracted verbatim, with Framer class names, into `data/candidateNoticeHtml.js`. Styles are in `styles/company/richtext.css`:
  - Paragraph: 17/128%, −.03em, justified, #393939, 30px paragraph spacing.
  - h4: Favorit 26/125%/−.05em (24 below 1199).
  - Links: #3286f5, underlined, hover #1c64c8.
  - Lists use "•" with a 2ch indent.
  - Tables: 1px `#99999940` border, radius 8. Cells are **12px sans-serif** (live inherits that font), padding 10, `min-width: 16ch`.
- Needs Inter 700 for `<strong>`. It is added in `styles/company/fonts.css`, along with the non-latin Inter subsets and Google Sans.

## Assets
All images already existed in `/public/assets`. Google Sans woff2 subsets were downloaded to `/public/fonts/g/`.
