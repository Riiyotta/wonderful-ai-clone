# Product group spec: /ai-os, /agents, /systems (measured live with Playwright, 2026-11-03)

D = 1440x900 (Framer bp 1440–1799), T = 1100x900 (880–1439.98), M = 390x844 (<880). Geometry `[x,y,w,h]` page px.
Sources: `_source/pages/{ai-os,agents,systems}.html`. Code: `src/routes/product.jsx`, `src/pages/product/**`, `src/styles/product/**`.

## 0. Shared (src/pages/product/shared)
### Text presets (live CSS; preset breakpoints are Framer's own, not 880/1440)
| class | preset | values |
|---|---|---|
| `.pr-h1` | 1idioqq | Favorit 300 64/1.05/-.06em ss04 ss05; 810–1199: 48/-.05em; <810: 38/-.05em |
| `.pr-h2` | 190xti5 | 48/1.05/-.04em, pb 3px, text-wrap balance; 800–1199: 42/1.15; <800: 34/1.15/-.05em |
| `.pr-h3` | pyuk04 | 32/1.15/-.04em ss02 ss04 ss05 ss11; 810–1439: 22; <810: 24 |
| `.pr-h4` | 1ing3ma | 26/1.25/-.05em blwf cv03 cv04 cv09 cv11 ss04 ss05; ≤1199: 24/1.15/-.04em |
| `.pr-h5` | voew0c | Inter 300 20/1.15/-.05em ss04 |
| `.pr-p17` / `.pr-p14` / `.pr-p20` | 1ln1alt / x0s9r5 / o1ogpi | 17/1.28/-.02em · 14/1.5/-.02em ss03 · 20/1.25/-.4px |

### ProductHero ("Hero animation")
- D: h 95vh (min 500), padding 24px 60px 0, gap 120. T: 80vh (/ai-os 90vh), padding 0 40. M: 90vh (/ai-os 100vh), padding 0 24, gap 44.
- Tag & Title: w 950 (T/M 100%), gap 24 (T/M 32). Text block gap 12 (T/M 16).
- H1 appear: opacity .001 → 1, spring 200/60, delay .1, on load. The sub paragraph is a word reveal on mount (paragraph variant), text-wrap balance.
- Lockups: /ai-os KPfLio… 193x31 (M 150 wide); /agents UIOyw… 181x29 (M 150); /systems m9NwX… 210x31 (T h30, M 150).
- H1 max-width: /ai-os 800, /agents 707 (on T a separate variant with a forced break), /systems 992.

### ProductCards ("Transform the way you work on a unified platform", Framer component awQoL; also used on /ai-gateway)
- Four cards: Code (AI OS), Agents, Systems, Gateway. Live hides the current page's card with `.wf-xsell-card:has(a[data-framer-page-link-current]){display:none}`; pass `current`.
- Section: #080808, padding 120 60 (T 120 40 80; M 72 20), gap 84 (M 64). Heading w 560 (M 100%).
- Cards:
  - D: flex row gap 16, cards flex 1 with aspect .697297 (429.3x615.7).
  - T: 1-col grid with 4 explicit rows (the hidden card leaves an extra 16px gap), cards 350 tall.
  - M: column gap 12, aspect .813953 (350x430).
- Card internals: padding 28 20, gap 12, radius 8. Spacer flex 1.4, lockup (h 28 / T 35 / M 30; AI OS w153 / T w215 / M h30; Gateway T 266x35), spacer flex 1, one-liner (max 218; Agents 60%, others 80%; balance), "Explore" pill (37px, 6px 16px, #fff, 14/21 #171719). No hover.

### FeatureCell
- Icon 32 (Phosphor regular, path data from live DOM in `icons.jsx`), gap 60, H5, gap 24, p14.
- Padding 32, backdrop blur 20, 1px left border #ffffff2e (dark).
- M: top border, padding 30px 0.

### Divider
1px rgba(255,255,255,.18) line on #080808, inset 24.

## A. /ai-os (height D 6600 / T 9983 / M 9234)
| section | D | T | M |
|---|---|---|---|
| Hero | 0+855 | 0+810 | 0+844 |
| Infrastructure | 855+843 | 810+939 | 844+809 |
| Divider, ProductCards, Divider | 1698 / 1699+1044 / 2742 | 1749 / 1750+1482 / 3232 | 1653 / 1654+1642 / 3296 |
| Advantage | 2743+1041 | 3233+1319 | 3297+1905 |
| Built for the enterprise | 3784+1671 | 4551+3780 | 5202+2358 |
| CTA | 5455+640 | 8331+640 | 7560+640 |
| Footer | 6095 | 8971 | 8200 |

### Hero
- Background pSVbsZ…png, cover. Mask `linear-gradient(#000 41%, #0000)` on D, `0%` on T/M.
- "Hero Lattice" code component: abs, bottom -30px (M: top 6.33%, h 90%).
- Its SSR markup (three breakpoint variants, pure CSS keyframes) is injected verbatim from the source (`aios/latticeMarkup.js`).
- The ai-os timings differ from the homepage lattice: on D, tags hold until 22.9% of the 17.05s cycle (homepage 16.5%). T uses a 17.65s cycle; M uses 16.712s.

### Infrastructure (component 8xV7y; variants Desktop / Stacked (T) / Phone (M) x 7 states)
- Section padding 140 60 (T 140 40, M 64 24).
- **D layout:**
  - Left column 556 (pr 50), centered vertically, gap 64: H2 #f5f5f5, then the state (H3 32 + p17 #777, max 466; line breaks for Security / Context / Models).
  - Visual: flex 1, aspect 1.34, radius 8, image KQ4FP5…jpg.
  - Panel: 75% wide, aspect 1.665, padding 60 40 44, gap 9, bg rgba(9,11,16,.78), radius 12, 1px border .08.
  - Blocks: flex 1 (52.2 tall), bg rgba(0,0,0,.2), 1px border .1, label 17px rgba(255,255,255,.55). Row 4 has 3 blocks, gap 9.
  - Badge: abs top -16, 32 tall, padding 0 18, radius 16.
- **T/M:** title, then the visual (padding 48 30 40, gap 24): panel (padding 40 16 16 / M 36 12 12, gap 8, blocks 52, row gap 8 / M 6, labels 14px) plus a 176px "State Content Bottom" (H4 24 + p17 #fafafa, no breaks). Every block also carries a static 2px rgba(245,245,245,.16) ring.
- **Interaction:** click a block (or the badge) to switch state; it does not auto-cycle.
  - Active block: wfNU1e…png image bg, bg .08, border .3, label #fff.
  - Inactive badge: bg rgb(10,12,17), border .16, label .85.
  - Hover on an inactive block: bg rgba(255,255,255,.08).
- Copy per state:
  - Observability: "Evaluates and monitors…"
  - Workflows: "Executes multi-step…"
  - Building tools: "An environment for creating…"
  - Context hub: "A knowledge layer…"
  - Models: "Runs frontier…"
  - Integration hub: "A single place to manage…"
- **Beam** (code component, verbatim):
  - It sits on the block after the active one (Security → Observability → Workflows → … → Integrations → Badge + Observability).
  - The glow is a radial gradient 75% of the block wide, moving along `offset-path: rect(0 auto auto 0 round 6px)` (6s linear), inside a 2px masked ring with opacity breathing 0.25 ↔ 1 over 3s ease-in-out.

### Advantage
- Section padding 120 60 (T 120 40, M 60 30), gap 60. H2 (balance), then p17 #9e9e9e (max 620).
- Grid: D 3 cols gap 24 with equal rows (287). T 2 cols, gap 40/24. M column, gap 24.
- 5 cells.

### Built for the enterprise (white)
- Padding 120 0 0 (M 84 0), gap 80.
- H2: first span #171719, rest rgba(49,49,49,.6) with breaks. M: rest #6b6b6b.
- **D rows:** padding 0 60 60; 1px top line (rgba(255,255,255,.18): invisible on white); padding-top 60.
  - Title box 628x49.
  - Right side 702: image 310x195.7 (opacity 0, radius 4), gap 10, text 382 with pl 64 (p17 #777).
- **D hover** (0.4s ease, fitted to rAF samples: .34 @78ms, .69 @177, .90 @277):
  - bg → #f5f5f5, line → rgba(0,0,0,.1).
  - A 42px "—" (#141414) appears and the title slides right 51.2px.
  - The image fades in.
- **T/M:** rows padding 0 40 64 (M 0 24 64), pt 24, title → 24 → text → 42 → image (aspect 640/404, always visible). No hover.
- Images, in row order: YdIXaP…, bHBi0Z…, WDmw2A…, 721DZp….

### CTA
- 640 tall, #080808, padding 160 60.
- H2 w 660 (max 50%; T 549; M 370), balance, appear spring 200/60 delay .5 in view.
- "Get in touch" pill (50px), appear tween .6 delay .5; hover opacity .6.
- Background 93SjXd…jpg with mask `radial-gradient(141% 80% at 50.5% 100%, #0000 35.4%, #000)` (T 82%, M 90%).


## B. /agents

### /agents — measured spec (live https://www.wonderful.ai/agents, 2026-11-03)

Page height: D 1440x900 = 6121, T 1100x900 = 9872, M 390x844 = 8802. Sections (D y+h): hero 0+855, use cards 855+902,
real work 1757+863, divider 2619+1, case studies 2620+996, teams 3617+956, cross-sell 4573+1044, footer 5616+505.

## Hero
Shared ProductHero. bg lOzB6A2mLfsIG1Nzz1sMZpI9jCw.jpg cover; 95vh D / 80vh T / 90vh M. Wordmark UIOy…svg 181x29 (M 150 wide, aspect 6.24138).
H1 preset 1idioqq (64/48/38), max-w 707; T variant has a forced break "Deploy agents anywhere⏎work happens". Appear: opacity .001→1 spring 200/60 delay .1.
Sub p o1ogpi 20/25/-.4px #fafafa, max-w 70% (M 100%), text-wrap balance, word reveal (paragraph) on load.

## "Transform the way you work" (#fff)
Padding 120 60 (T 120 40, M 84 24), gap 80 (M 40). H2 #171719.
Cards (<a href ./agents>, radius 8, padding 28 20, content bottom, content max-w 600, gap 12):
- D: row gap 16, flex 1, aspect .813447 (middle .8125). H4 1ing3ma 26/32.5 #fafafa (balance), p 1ln1alt 17 rgba(255,255,255,.7).
- T: column, 1020x700, content left; title uses H2 preset (42/48.3), p o1ogpi 20/25.
- M: column, 342x510; H4 24/27.6, p 17.
Images per breakpoint: D kLjlUak6…, zmHgufjg…, PCqf8VFC…; T s0SPGt2A…, fQVHdIGB…, N3UbkdCg…; M 2F8adlyU…, WVnBTdqJ…, x7Qqxer… (object-position 58.7% 27.1%).
No hover state.

## "Built for real enterprise work" (#080808)
Padding 120 60 (T 120 40, M 64 24).
- D: row gap 10. Left col 556 (pr 50), stretch, justify space-between: [H2 #f5f5f5 + gap 32 + subtitle p17 #b3b3b3 max-w 490] / list (gap 24: divider 1px rgba(255,255,255,.18) before each item).
  Item: H4 26 (#f5f5f5 open, rgba(255,255,255,.45) closed) + gap 20 + p 14/21 ls -.04em #9e9e9e (open only), widths 425/470/425/425/385.
  Image 0idj71nARTQPJF29WjuFQFbfZGY.png, flex 1, aspect 1.21087 (754x622.7), radius 8.
- T: column gap 64; left block gap 160 between title and list; p width 100% max 490 balance; image full width aspect 1.336.
- M: static (no accordion): H2, p17 #9e9e9e "Enterprise work spans…", 4 items (no "Tested") all open (H4 24 #f5f5f5, p 14 x0s9r5 #9e9e9e, gap 12), dividers, gap 32, image aspect 1.22493.
- Click switches the open item (one open, default first). Quirk: the H2 subtitle shows "Enterprise work spans…" only while item 4 is open, otherwise " ".
  State geometry (D, H4 tops): default 2079/2222/2304/2385/2467; open 2: 2079/2160/2304/…; open 4: 2081/2163/2244/2326/2490 (column grows); open 5: 2059/2141/2222/2304/2385.
- Motion: Framer layout animation; rAF-sampled H4 travel (Δ62px) .02@22ms .26@54 .56@86 .79@120 .92@153 .99@187 1.003@202 1.015@236 → settles ~400ms; fit spring 480/34. Header colour rides the same curve. Clone: FLIP translateY + CSS colour transition with springEase(480,34); clone sample 671.6@54 / 652@88 / 631@137 / 621.3@204 vs live 667.5 / 648.7 / 629.6 / 621.3.

## Case studies ("Solving the problems that move the business.")
Homepage carousel (CLONE_SPEC §2.3) "agents page" variant: bg #000, padding 120 0 (M 24 0 120), H2 #fafafa word reveal.
5 cards: ote, banco-caja-social, petrol-ofisi, telefonica (mid spacer), ppc-energie. D arrows bg rgba(255,255,255,.2), chevron #fafafa; T arrows #f5f5f5 + dark chevron; M none.

## "Built for teams building at scale" (#fafafa)
Padding 120 60 (T 120 40, M 60 30), gap 60. H2 #171719, p17 #777 max-w 801 with <br>.
Cells (light FeatureCell): bg rgba(255,255,255,.1), border-left 1px #0000001a, padding 32, backdrop blur 20, icon 32 #171719, H5 #171719, p14 #777.
D: 2 rows × 4 (flex 1, gap 24). T: each row a 2×2 grid gap 40/24. M: 2-col grid, each column = one row's 4 cells; cells 270 tall, padding 30 0, border-top.
Icons (Phosphor regular): SquaresFour, GitFork, Books, LockSimple, PuzzlePiece, ArrowsLeftRight, Tag, ArrowsSplit (paths in shared/icons.jsx).

## Cross-sell
Shared ProductCards current="agents".

## Global note
All live H2s compute `text-wrap: balance` (preset 190xti5).

## C. /systems

### /systems — measured spec (live https://www.wonderful.ai/systems, 2026-11-03)

Geometry is `[x, y(page), w, h]`. D = 1440x900, T = 1100x900, M = 390x844.
Page height: D 6278, T 7730, M 8856. Breakpoints are Framer's: D ≥1440, T 880–1439.98, M <880.
Files: `src/pages/product/Systems.jsx`, `src/pages/product/systems/{Adapts,Helps,Replace,Deployed}.jsx`, `src/styles/product/systems.css`.

## 1. Hero (shared ProductHero)
- D `[0,0,1440,855]` (95vh), T 720 (80vh), M 759.6 (90vh).
- Wordmark `m9NwXolMW9WRfbDA1Issz2oFEfA.svg`: D 210x31, T height 30 / auto (203.6x30), M 150 wide, aspect 6.8 (150x22).
- H1 (preset 1idioqq): "Replace legacy software with software built for the way you work.", max-w 992. D 950x134 (2 lines), T 992x101, M 342x160 (4 lines).
- Sub (o1ogpi 20/25/-0.4, #fafafa, balance, word reveal on mount): max-w 491 (M 100%). M is 3 lines (75px).
- Background: D and M `WIqIBOiTiPsV4nkZyfqf1D6tCkc.jpg`; **T uses `COHS8z4dumWgykF53BIati5FHo.jpg`**. The clone swaps it with CSS (`.sys-hero-bg`).
- Appear: the H1 fades opacity .001→1 (spring 200/60, delay .1).

## 2. "Software finally adapts to you." (white)
- Section padding: D 120/60, T 120/40, M 64/24. D `[0,855,1440,957]`, T 1646, M 1411.
- D row height 717, gap 10. Left column is flex 1, max 40% (528), padding-right 50, and justify space-between. The image is flex 1 with aspect 1.09066 (782x717), radius 8.
- T: stacked, gap 64. Left column gap 60. Image aspect 1.34 (1020x761).
- M: stacked. Left column padding-bottom 64, title block padding 32/0/60. Image aspect 1.05 (342x326).
- H2 (190xti5, #080808, text-wrap balance): D/M "Software finally adapts to you." On T the copy has a forced break: "Software finally⏎adapts to you."
- Sub "For decades, enterprises adapted…": p17. Color is #393939 on D and #777 on T and M. On T max-w is 60%.
- List: column gap 24 (M 32). Dividers are 1px rgba(0,0,0,.1).
- Each item has an H5 (voew0c, #171719) and a p17 #777 (balance). The gap between them is 15; on M, item 1 uses 24.
  - On D, item 2 is 411 wide.
  - On M, each paragraph is max-w 300.
- No hover or scroll motion.

## 3. "What Wonderful helps you do" (#080808)
- Padding: D 120/60, T 120/40/60, M 60/30. Gap 60.
- Section height: D 665.2, T 909.1, M 1169.7.
- H2 is balanced. The sub (p17 #9e9e9e) is max 560.
- Cells (icons Optionality / Building / Cloud, from shared PhIcon, white). The cell content is a column with gap 60; inside it, the H5 and p have gap 24.
  - **D:** row, gap 24. Cells are flex 1 and stretch to equal height (266). Padding 32, 1px left border #ffffff2e, backdrop blur 20.
  - **T:** 2x2 grid with rows minmax(0,1fr) and gap 40/24. Cells size to their content.
  - **M:** column, gap 16. Cells have a top border instead and padding 30/0.
- Live quirks, kept in the clone:
  - The 2nd H5 is #fff; the others are #fafafa.
  - On T, the 2nd cell's paragraph is an unstyled variant: Inter 16/19.2, normal tracking, #000. It is invisible on the dark band.

## 4. Divider
1px rgba(255,255,255,.18) on #080808, inset 60 (T 40, M 24).

## 5. "Build or replace your core business systems" (#080808)
- Padding: D 120/60, T 120/40, M 84/24. Gap 80 (M 64).
- Section height: D 1305.2, T 1139.3, M 1544.4.
- Layout: 2 rows of 2 cards, gap 24 (M: one column).
- **D card:** flex 1, aspect 1.4276 (648x454), radius 8, padding 32, column justify-end, gap 10.
  - Full-bleed image.
  - Text block (max 600, gap 12): H4 (1ing3ma, white, balance), then an **empty** p17, which still adds the 12px gap.
- **T/M card:** bg #141414, radius 8, column gap 24.
  - Image area aspect 1.751 (T 498x284, M 342x195).
  - Text block below it, padding 0 24 24. The H4 is 24/27.6.
  - T card is 372 tall.
- Images, in order:
  - CRM: `9rfgYXmF9SBC6EUB2jXO5LpmfrA.jpg`
  - CVM: `A4kwn19AjNGKY8cum7zimmO0tM.jpg`
  - Knowledge: `Ch4XdpulzzTSIyiLMXICKLimNeI.jpg`
  - HCM: `ntWrufB5PA18uoF4cb6UYZxNx5c.jpg`
- No hover state (checked with a computed-style diff).

## 6. "Deployed where you run, by local teams" (white)
- Outer padding: D 120/60, T 120/40, M 84/24/72. Inner max 1200, gap 60 (M 64).
- Section height: D 945.8, T 821.3, M 1295.2.
- H2 is 701 wide on D (T flex 1, M 100%), #171719, text-wrap none.
  - Word-by-word reveal on view: blur 6, y 16, 50ms stagger.
- Cards (Framer component 1Hm7A, `<a>` with no href, cursor pointer). Images:
  - FDE-led Rollout: `0mdyl04dtY9LVOwd1CjHfzZC3c.jpg`
  - Any cloud: `QMeFdoJ9YmQHUHbVjmrBe9IL3g.jpg`
- **D:** row, gap 10, height 542, padding 32, radius 8.
  - **Default variant:** card 1 is expanded (60% = 720).
    - It shows the image, a scrim `linear-gradient(180deg, transparent 35%, rgba(0,0,0,.82) 100%)`, a white H3 (pyuk04, max 450, balance) and a p (17/1.4/-0.01em, rgba(255,255,255,.7), max 80%).
    - Card 2 is collapsed (470): bg rgba(17,17,17,.05) and a #171719 H3 only.
  - Hovering card 2 switches to the "Expand 2" variant: widths swap, and card 2's bg becomes #000.
    - Leaving the component returns it to Default.
    - Width and colours follow a spring, measured with rAF: .2 @57ms, .53 @107, .75 @156, .87 @207, .94 @257, .97 @306, 1 @~500. That fits stiffness 400 / damping 42.
    - The image, scrim and p switch instantly.
- **T:** both cards are expanded side by side (505x470), padding 24, bg #000.
  - Content max 450, H3 max 400 (22px), p unconstrained at rgba(255,255,255,.9).
  - No hover change.
- **M:** cards stacked, 342x492, padding 24, same as T (H3 24px).

## 7. Cross-sell
Shared `<ProductCards current="systems" />` with cards AI OS / Agents / Gateway, followed by the shared footer.

## Verification (clone vs live)
- **D:** height 6278 / 6278. All section boxes are within 1px. All text and image rects match within 2px.
- **T:** height 7714 vs 7730. The whole −16 is in the shared ProductCards (see the report). Sections 1–5 are exact.
- **M:** height 8856 / 8856. Sections are within 1px.

## Parity fix: Deployed cards and heading (2026-11-06)

* `/systems` "Deployed where you run" cards: the width/colour/title spring is armed by the first hover swap only (same
  cause and fix as `PlatformCards`; the section scored 0.58 because the capture caught a mid-spring state).
* The heading uses `text-wrap: wrap` (live computed value), not `balance`: live breaks "Deployed where you run, by local /
  teams"; the clone had broken after "you".
