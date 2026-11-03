Source: https://www.wonderful.ai/

# Wonderful homepage: clone spec (measured live with Playwright on 2026-11-03)

This is a Framer site. Every value below was read with `getComputedStyle` / `getBoundingClientRect` or by sampling live animations. Geometry is `[x, y(page), w, h]` in CSS px.
- **D** = 1440x900 viewport. Framer breakpoint `13yvw11` covers 1440–1799.98.
- **M** = 390x844 viewport. Breakpoint `uu1d5z` covers widths up to 879.98.
- Other breakpoints, not measured: `1nndbqt` at 1800px and up, and `bgr1vb` (tablet) for 880–1439.98.
- Page height: D 7078, M 7624. `body` bg is `#ffffff`.
- Assets are listed in `assets-manifest.json`, next to this file.
- Local copies: the saved page `Wonderful _ The Enterprise AI OS.html` and its `_files/` folder contain the inline SVG symbols (`#svg-templates`: `svg-652223171_4193`, `svg1117215530_4267`, `3166100823`).

---
## 0. Global tokens

### Fonts actually used on the homepage (latin subsets)
| family | weight/style | url | roles |
|---|---|---|---|
| `"ABC Favorit Light", "ABC Favorit Light Placeholder", sans-serif` | 300 normal | https://framerusercontent.com/assets/2O2V4KBfbMelLnYAtnns4e43LI.woff2 | all display headings, H1, H2, H3, the big reveal paragraph |
| `Inter, "Inter Placeholder", sans-serif` (Framer Inter) | 300 | https://framerusercontent.com/assets/aqiiD4LUKkKzXdjGL5UzHq8bo5w.woff2 | mega-menu items |
| Inter | 400 | https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2 | body, buttons, nav |
| Inter | 500 | https://framerusercontent.com/assets/UjlFhCnUjxhNfep4oYBPqnEssyo.woff2 | footer links |
| Inter | 600 | https://framerusercontent.com/assets/yDtI2UI8XcEg1W2je9XPN3Noo.woff2 | loaded, but no visible role found |
| `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace` | 400 | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q131nj-o.woff2 | AI OS lattice tags (code component does `@import` of Google css2 `IBM+Plex+Mono:wght@400`) |

Other Inter face URLs that are declared but unused: 400i `pKRFNWFoZl77qYCAIp84lN1h944`, 500i `Bo5CNzBv77CafbxOtKIkpw9egw`, 700 `syRNPWzAMIrcJ3wIlPIP43KjQs`, 900 `rZ5DdENNqIdFTIyQQiP5isO7M`. All are `framerusercontent.com/assets/<id>.woff2`.

The following fonts have `@font-face` rules but are **not used** on the homepage. Do not ship them:
- Google Sans 400: `https://fonts.gstatic.com/s/googlesans/v76/4Ua_rENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RFD48TE63OOYKtrwEIJllpyk.woff2`
- Inter Display 400: `https://framerusercontent.com/assets/bHYNJqzTyl2lqvmMiRRS6Y16Es.woff2`
- Fragment Mono 400: `https://fonts.gstatic.com/s/fragmentmono/v6/4iCr6K5wfMRRjxp0DA6-2CLnB4NHhg.woff2`
- Ubuntu Mono 400: `https://fonts.gstatic.com/s/ubuntumono/v19/KFOjCneDtsqEr0keqCMhbCc6CsQ.woff2`
- "ABC Favorit" (non-Light): only Arabic-range (Noto Sans Arabic) rules exist, so there is no latin file.

Body font smoothing is `antialiased`. Each placeholder family is `local("Arial")`.

OpenType features (`font-feature-settings`) per role:
- H1 82: `"blwf","cv03","cv04","cv09","cv11"`
- H2 26: the same plus `"ss04","ss05"`
- H2 48 and H3 72: `"ss04","ss05"`
- H3 32: `"ss02","ss04","ss05","ss11"`
- p 17 (preset 1ln1alt): `"blwf","cv03","cv04","cv09"`
- p 14 (preset x0s9r5): `"ss03"`
- Everything else: normal.

### Typography roles (computed)
| role | font | D size/lh/ls | M size/lh/ls | weight | color |
|---|---|---|---|---|---|
| H1 hero | Favorit Light | 82 / 86.1 / -4.1px | 42 / 44.1 / -2.1px | 300 | #fafafa; left (D), center (M) |
| H2 small ("Trusted by…") | Favorit Light | 26 / 32.5 / -1.3 | 24 / 27.6 / -0.96 | 300 | #171719, centered |
| H2 section | Favorit Light | 48 / 50.4 / -1.92 (pad-bottom 3px) | 34 / 39.1 / -1.7 | 300 | #393939 (Solving…), #fafafa (on dark), #171719 (Deep in…) |
| Reveal paragraph ("We bring together…") | Favorit Light | 62 / 71.3 (115%) / -3.1 (-0.05em) | 28 / 32.2 / -1.4 | 300 | animated (see Motion) |
| H3 carousel card | Favorit Light | 32 / 36.8 / -1.28 | 24 / 27.6 / -0.96 | 300 | #fafafa |
| H3 Deployment/Strategy | Favorit Light | 32 / 36.8 / -1.28 | 24 / 27.6 / -0.96 | 300 | #ffffff, center, max-w 404 |
| H3 industry card title | Favorit Light | 72 / 75.6 / -4.32 | 38 / 45.6 / -3.42 | 300 | #fafafa, center |
| Hero sub (preset o1ogpi) | Inter | 20 / 25 / -0.4 | 17 / 21.76 / -0.34 | 400 | #fafafa (D), #fff (M) |
| Body 17 (preset 1ln1alt) | Inter | 17 / 21.76 / -0.34 | 17 / 21.76 / -0.34 (on M the Deployment cards use 14/21/-0.28) | 400 | rgba(255,255,255,.7) cards; rgba(255,255,255,.88) industry card; #fafafa closer |
| Button L (preset 2mfvz6) | Inter | 16 / 26 / -0.5 | – | 400 | #000 on white; #fff on outline |
| Button S (preset x0s9r5) | Inter | 14 / 21 / -0.28 (-0.02em) | 14 / 21 / -0.28 | 400 | #171719 |
| Nav link | Inter | 16 / 19.2 / -0.5 (Blog: ls normal) | – | 400 | #fff (dark variant) / #494949 (light variant), Blog rgba(31,31,31,.8) |
| Nav pill "Get in touch" | Inter | 12 / 10 / -0.5 | – | 400 | #000 on #fff, or #fafafa on #080808 |
| Announcement | Inter | 14 / 21 / -0.28 | 14 / 21 | 400 | #393939 text; "Read more" #171719 |
| Tabs | Inter | 14 / 16.8 / -0.84 | same | 400 | active #141414, inactive #6e6e6e |
| "Explore more" pill | Inter | 12 / 10 / -0.5 | same | 400 | #000 |
| Closer card label | Inter | 42 / 42 / -1.68 | 32 / 32 / -1.28 | 400 | #393939 (expanded) / #fff (collapsed) |
| Footer col title (preset 1mywhy3) | Inter | 12 / 13.2 / -0.12 | same | 400 | rgba(255,255,255,.7) with wrapper opacity .65 |
| Footer link (preset 1unrh5u) | Inter | 14 / 16.8 / -0.5 | same | 500 | link rgba(255,255,255,.7) (`#ffffffb3`), hover #fafafa |
| Footer small text | Inter | 12 / 13.2 / -0.12 | same | 400 | rgba(255,255,255,.7) |
| Lattice tag | IBM Plex Mono | 16.942 / normal / -0.04em | 13.5 | 400 | #000 on #f5f5f5 panel |

### Color tokens
- Black surfaces: `#000000` (hero bg; M AIOS and Industries-Section bg) and `#080808` (D dark band and footer).
- Off-white: `#fafafa` (headline text), `#f5f5f5` (chips, tabs track, arrow buttons), `#ffffff`.
- Ink: `#171719`, `#141414`, `#393939`, `#494949`, `#4a4a4a`, `#6e6e6e`, `#777777`.
- Accent orange (lattice): `rgb(252,118,47)` = `#fc762f`.
- Lattice white dots: `rgba(255,255,255,.54)`.
- Footer muted link tokens: `rgba(92,92,92,.5)` on the wrapping `p`, but the anchor color wins.

### Gradients
- Hero overlay (z1, full bleed): `linear-gradient(180deg, rgba(0,0,0,.2) 0%, rgba(0,0,0,.1) 13.1179%, rgba(0,0,0,0) 60%, rgba(0,0,0,.3) 100%)`.
- Deployment card overlay: `linear-gradient(rgba(20,20,20,0) 0%, rgba(20,20,20,.1) 40%, #141414 70%)`.
- Strategy card overlay: same stops, but the last is `#141414 100%`.
- Industry card overlay: `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,.12) 73%, rgba(0,0,0,.35) 100%)`.
- Announcement bar: `linear-gradient(268deg, #ffffff 0%, #fafafa 100%)`.
- Dark-band bg image mask: `linear-gradient(#000 65%, rgba(0,0,0,0) 100%)`.

### Radii
| radius | used on |
|---|---|
| 50px | pill buttons |
| 999px | tabs and tab chips |
| 1000px | carousel arrows |
| 10.37px | carousel cards |
| 8px | Deployment/Strategy cards; industry card on M |
| 12px | industry card D; closer cards |
| 4px | client logo cards; mega-menu image and items (8px) |
| 14px | cookie panel |

### Shadows and blur
- Nav pill shadow: `rgba(79,26,214,0.118) 0 0 0 0` (white variant) and `rgba(79,26,214,.3) 0 0 0 0` (black variant). Both are effectively invisible.
- Cookie panel shadow: `inset 0 0 0 1px rgba(0,0,0,.05)`.
- Backdrop filters: nav bar `blur(10px)` in the light variant (`blur(0px)` in the dark variant); closer cards `blur(10px)`.

---
## 1. Navbar (fixed, `position:fixed; top:0; left:50%; transform:translateX(-50%)`, width 100%)

### Structure (D, on page load)
Total height is 109px: announcement bar 48 + bar 60 + 1px line (bg transparent).

**Announcement bar**
- 1440x48, padding 12px 20px, bg is the 268deg gradient above, overflow hidden.
- Inner max-w 1680, row centered, gap 16.
- Two absolutely stacked slides, each a row centered with gap 16:
  - Slide A "Announcement - Bayern": FC Bayern crest (21x21, `filter: invert(1)`), gap 6, then "Official Enterprise AI Partner". Next comes a link "Read more" plus a 16x16 arrow icon (gap 4, radius 4), href `./blog-articles/fcbayern-and-wonderful-announce-enterprise-ai-partnership`.
  - Slide B "Announcement - Raising": "Wonderful Raises $550M Series C", then "Read more" with arrow, href `./blog-articles/wonderful-raises-550m-series-c`.
- On M the bar is 40px tall, padding 12px 8px. Slide B's "Read more" there is 12/13.2, rgba(31,31,31,.8).

**Main bar**
- 1440x60, padding 12px 24px. Inner row max-w 1680, space-between, height 36.
- Left group: row, gap 24, starting at x 24.
  - Logo link (`./`, aria-label "Wonderful home") 101x25 at x 24.
  - "Name" spacer 20px.
  - Three dropdown triggers "Platform", "Industries", "Company". Each is a row with padding 8px 0, gap 4, text 16/19.2, plus a 14x14 chevron slot. The slot is an empty div with no visible glyph on desktop.
  - x positions: 194 (w 77), 295 (w 88), 407 (w 87).
  - "Blog" link at x 518.
- Right group: row, flex-end, gap 8.
  - Lang slot 66x36 at x 1255. This is a third-party widget `.scLangSelector` (website translator chip "EN", `--wf-chip-w:66px; --wf-chip-h:36px; --wf-chip-fs:12px`).
  - "Get in touch" pill 87x36 at x 1329: padding 6px 12px, radius 50, href `./contact`.

### Scroll behaviour
- **Banner collapse.** The first scroll (scrollY > 0) switches the banner variant "Open" → "Close". Height animates 48 → 0 in about 250ms (sampled 109 → 104 → 81 → 65 → 61 at 60ms steps). It does **not** reopen when you scroll back to top. Bar plus line = 61px from then on.
- **Variant switch by section underneath.**
  - Over dark sections, variant is **"Desktop / White"**: hero 0–900, dark band 2941–4775, closer 5857–6573, footer.
    - bar bg rgba(250,250,250,0), backdrop blur(0px), links #fff, white logo (`<use href="#svg-652223171_4193">`).
    - pill "White Secondery menu": bg #fff, text #000.
  - Over light sections, variant is **"Desktop"**: 900–2941 and 4775–5857.
    - bar bg rgba(250,250,250,.2), backdrop blur(10px), links #494949, Blog rgba(31,31,31,.8).
    - Logo becomes a dark data-URI SVG (fill rgb(20,20,20), viewBox 0 0 101.22 25).
    - pill "Black Secondery menu": bg #080808, text #fafafa.
  - Transition timing: bar bg and blur reach their target in about 240ms. Sampled bg alpha 0 → .04 (107ms) → .125 (185ms) → .2 (238ms), so it eases in. The pill bg crossfade is slower, about 900ms with exponential decay (251 → 130 at 238ms → 50 at 529ms → 16 at 1000ms).
- No hide-on-scroll; the nav is always visible.

### Mega-menus (hover on a trigger)
Hovering a trigger switches the whole nav to "Desktop / Product / White", "Desktop / Industrries / White" or "Desktop / Company / White".
- Bar bg becomes #fff. Trigger text goes #292929 (active) or #494949 (others). The pill becomes black.
- A dropdown body appears below the bar: bg #fff, padding 48px 24px 32px, row centered, gap 24, inner row space-between at max 1392.
  - Left: logo (102x25) and a "Links" column at x 182.
  - Right: a 368px "Video" card at x 1048 with padding-top 6, gap 12.
    - Image 368x207 radius 4.
    - Platform only: centered "Play" button 32x32, bg #ccc, radius 38.1, 13px icon.
    - Below the image: title 16/19.2 #393939 and "Read the article" 14/16.8 rgba(3,3,2,.59).
- Open animation is a layout/height spring: total 61 → 427 in about 200ms with slight overshoot (body scaleY 0.34 → 0.94 → 1.037 → 0.987 → 1). Bar bg fades to #fff in the same 200ms.
- **Platform** (nav height 427): 2-col grid `282px 282px`, gap 16/12. Items are 282 wide, padding 12, radius 8, bg #fff, gap 8. Title Inter 16/19.2 w300 rgba(3,3,2,.59); description 14/16.8 w300 #777. Items:
  1. AI OS Overview (`./ai-os`): "The unified operating layer for the AI-native enterprise"
  2. Wonderful Agents (`./agents`): "Deploy agents anywhere work happens"
  3. Wonderful Systems (`./systems`): "Software built for the way you work"
  4. Wonderful AI Gateway (`./ai-gateway`): "A control center for all enterprise AI"
  5. Deployment (`./deployment`): "Locally embedded teams who ship"
  6. Strategy (`./ai-transformation`): "Drive your AI transformation"
  - Feature card: "Announcing the Wonderful AI Gateway" plus image u77i0f…jpg, with Play button.
- **Industries** (height 448): grid `295px 295px`, gap 12, items 282x68. Column 1 is Banking, Utilities, Retail, Airlines; column 2 is Telecommunications, Healthcare, Insurance. Descriptions:
  - Banking: "AI workflows for regulated enterprises"
  - Utilities: "AI workflows for critical infrastructure"
  - Retail: "AI workflows across every channel"
  - Airlines: "AI workflows for disruption at scale"
  - Telecommunications: "AI workflows at massive scale"
  - Healthcare: "AI workflows for safer, faster care"
  - Insurance: "AI workflows for audit-ready operations"
  - Feature: "How PPC Energie cut call handling time by 75% in four weeks" / Read the article (`./blog-articles/ppc-energie`), image PpzgblDc….
- **Company** (height about 454): list About (`./about-us`), Careers (`./careers`), Press (`./press`), items 282x43. A "Latest press" block at x 670 (746 wide) has two 368x207 cards: "Announcing our Partnership with McKinsey" (image fVSTX0…, href youtube `e1u2Rt0mg6w`) and "Seb Johnson on The Scaling Europe Show". Also listed: "Wonderful raises $550M Series C at a $5B valuation" / Read the article.

### Mobile nav (M)
- Variant "Mobile / Close / White": 390x49, padding 12px 0 12px 16px.
  - Logo 93x23 at x 16.
  - Lang slot 44x44 at x 300.
  - "Menu Icon" 44x44 at x 346 with two bars 20x2, radius 10, #fafafa, at y 20 and y 27 (relative to the 44 box: top 17, 24).
- Plus a 40px announcement bar on load (total 89), which collapses on scroll as on D.
- **Open** (tap the menu icon) switches to "Mobile / Open / White", a full-height white panel about 802px tall.
  - Bar bg #fff, dark logo. The icon becomes "Close": two 16x16 #000 bars rotated ±45deg (radius 50%/500%).
  - List: padding 0 16, gap 24, starting y 73. Accordion rows "Platform", "Industries", "Company" (16/19.2, #393939, chevron svg 6x3 at right). Separators are 1px rgba(0,0,0,.1), 358 wide. Then "Blog" (#292929).
  - CTA block: padding 42px 16px, "Get Started" button 358x50, bg #000, radius 50, padding 6px 18px, text 16/26 #fff, href `./contact`.
  - Accordion expanded (Platform): sub-links 16/19.2 rgba(3,3,2,.59) at 43px pitch. Links: AI OS Overview, Wonderful Agents, Wonderful Systems, Wonderful AI Gateway, Deployment, Strategy.

---
## 2. Sections in DOM order (D geometry; M follows each)

### 2.1 Hero ("Hero animation")
- **D:** `[0,0,1440,900]`, height `100vh` (min-height 500), bg #000, overflow hidden. M uses `90vh` (760 on 844). Tablet CSS says 85vh / min 560 (not measured).
- **Background:** `<video>` 1440x900, object-fit cover, autoplay muted loop playsinline, preload auto, no poster.
  - D src `https://cdn.wonderful.ai/videos/HP%20-%20Video_Final_16x9.mp4`.
  - M src `…/HP%20-%20Video_Final%209x16.mp4`.
  - Duration 44.36s. The gradient overlay (z1) sits above it.
- **Text block (D):** absolute, bottom-aligned, `[0,562,1440,338]`, padding 0 60px 80px, max-w 1680, z2. Inner row `[60,562,1320,258]` is space-between with align-items flex-end.
  - **Left column:** H1 `[60,562,946,258]`. Copy: "Accelerate AI transformation across the enterprise". Lines render as "Accelerate" / "AI transformation" / "across the enterprise" (3 lines × 86px).
  - **Right column:** `[1010,684,370,136]`, column, gap 24, padding-top 12.
    - p `[1010,696,370,50]`: "Wonderful helps enterprises drive AI adoption to unlock their full potential."
    - Buttons row, gap 10:
      - "Get in touch" (`./contact`): 140x50, padding 6px 18px, bg #fff, radius 50, text 16/26 #000.
      - "Explore the platform" (`./ai-os`): 179x50, transparent, `::after` 1px solid #fff radius 50 inset 0, text #fff.
- **M:** text block absolute `[0,154,390,452]`, padding 64px 24px 84px, column centered, gap 24; inner column gap 16, everything center-aligned.
  - H1 `[24,218,342,176]`.
  - p `[10,410,370,44]`.
  - Buttons row at y 478, gap 10:
    - "Get in touch": 109x44, bg #fff, radius 50, padding 6px 16px, 14/21 #171719.
    - "Explore the platform" ("Outlline White small"): 160x44, 1px white outline.

### 2.2 Section Clients
- **D:** `[0,900,1440,401]`, column, padding 80px 60px 0, gap 42, max-w 1680.
  - H2 (26px, centered) `[60,980,1320,33]`: "Trusted by leading enterprises across industries".
  - Logo grid "Container - Desktop" `[60,1055,1320,164]`: column gap 4. Two rows, each a row centered with gap 4, holding 6 "Client Card"s.
    - Each card is 217x80, bg #fafafa, radius 4, column centered.
    - Each logo image is 170x79, object-fit contain, wrapper opacity 0.47.
    - Card x positions: 60, 281, 501, 722, 943, 1163.
    - Order: row 1 = TFjZ, fxHL, EWpQ, WnKj, zXjo, Tsd5; row 2 = 0Ya2, Im5O, IG5k, Wjw2, xi8l, LxO1.
  - Then an empty 1320x40 spacer at y 1261.
- **M:** `[0,760,390,549]`, padding 60px 24px, gap 42.
  - H2 24/27.6 `[24,820,342,55]`.
  - Grid "Container - Mobile": 3 cols `111.33px` × 4 rows `80px`, gap 4, same 12 logos in the same order. Images are 111x52, contain, opacity .47.

### 2.3 Section Team (horizontal case-study carousel)
- **D:** section `[0,1301,1440,840]`, padding 60px 0 24px, gap 80. Component `[0,1361,1440,756]`.
- **"Button Stack"** `[0,1361,1440,173]`: row space-between, padding 40px 60px 80px, max-w 1680.
  - H2 48 (#393939, max-w 70%) `[60,1401,924,53]`: "Solving the problems that move the business."
  - Arrows: 36x36 circles, bg #f5f5f5, radius 1000, gap 10. Left at x 1298, right at x 1344.
    - Icon is an 18x18 svg arrow (symbol `#3166100823`, stroke #141414, width 2, opacity .6).
    - The left arrow is the same icon rotated 180deg, opacity .4 when at scroll start.
- **"ScrollContainer"** `[0,1534,1440,583]`: native `overflow:auto`, `scroll-behavior:smooth`, scrollbar hidden, scrollWidth 4301.
  - Track row gap 16, with 46px spacer divs at the start and end, so the first card is at x 62.
  - 7 link cards, each 583x583. Layout: column, space-between, padding 32, radius 10.37, overflow hidden.
    - Full-bleed bg image, cover, radius 10.37.
    - Top "Text" row (gap 12.96): H3 (486 wide) plus a "↗" H3 (20x37).
    - Bottom-right logo slot: row flex-end, max-w 194, height 62 (36 for card 7).
  - Cards in order (href / title / logo):
    1. `./blog-articles/ote`: "Agentifying a national⏎telecom operator", logo HtdGps (102x62)
    2. `./blog-articles/banco-caja-social`: "Collections across⏎2.5 million clients", logo zCbhv9 (194x62)
    3. `./blog-articles/the-execution-gap-no-model-can-close`: "The execution gap no model can close", no logo (empty 62x62)
    4. `./blog-articles/petrol-ofisi`: "Internal IT automated across thousands of stations", logo QnIcjB (194x62)
    5. `./blog-articles/telefonica`: "91.5% containment rate across millions of customers", logo XNVB4d (194x62), plus an empty 428x78 "Text" div mid-card
    6. `./blog-articles/open-by-default-competitive-by-design`: "Open by default,⏎competitive by design", no logo
    7. `./blog-articles/ppc-energie`: "Billing resolved end-to-end for energy customers", logo 6ABuVo (85x36)
- **M:** section `[0,1309,390,552]`, radius 0 0 8px 8px. Variant "Phone": no arrows.
  - Button Stack padding 40px 24px. H2 34/39.1 `[24,1349,342,81]`.
  - Cards 330x391, padding 24, gap 16, leading spacer 8 (first card at x 24), H3 24/27.6.
  - Logos scale down (e.g. 69x42, 138x32, 149x28, 117x28, 62x26).

### 2.4 "Main": scroll-linked word reveal
- **D:** section `[0,2141,1440,800]`, padding 100px 60px.
  - The component container is `[220,1938,1000,1206]`. It starts 203px above the section's top edge (Framer offset).
  - Inner `position:sticky; top:0; height:100vh`, column centered, padding 0 3% 300px. In practice it does not stick: top decreases 1:1 with scroll.
  - p `[250,2386,940,310]`: 62px, centered, `text-wrap:pretty`.
  - Each word is a `span` with `display:inline-block; margin-right:.25em; margin-bottom:.1em`.
  - Copy: "We bring together the AI platform, deployment teams, and strategic partnership to transform how enterprises work."
- **Final colors:**
  - **#000:** "AI", "platform,", "deployment", "strategic".
  - **#4a4a4a:** all other words.
  - Initial color for every word is `rgba(144,144,144,0.26)`.
- **M:** section `[0,1861,390,1266]`, padding 0 24. Sticky box `[24,1861,342,844]`, padding 0 3.41 100px. p 28/32.2 `[27,2146,335,175]`.

### 2.5 Dark band (wrapper `[0,2941,1440,1834]`, bg #080808)
The background image PbxeRt98…jpg is absolute `[0,2941,1440,1559]`, cover, z0, mask `linear-gradient(#000 65%, transparent 100%)`. It paints **over** the AIOS #080808 bg (later DOM sibling) and under the lattice (z1). On M it is `[0,3127,390,717]`.

**2.5a AIOS** `[0,2941,1440,855]`
- Column centered, padding 24px 60px 0, gap 120, overflow clip.
- Absolute "Hero Lattice" code component covers the full section (see Motion §4.6).
- "Tag & Title" `[245,3255,950,251]`, column centered, gap 24:
  - Wordmark SVG KPfLio… 193x31 ("wonderful AI OS").
  - Inner column gap 42:
    - H2 48 #fafafa centered `[329,3310,782,104]`: "The unified operating layer for the AI-native enterprise", rendered "The unified operating layer / for the AI-native enterprise".
    - Button "Explore the OS" (`./ai-os`): 141x50, white pill, 16/26 #000.
- **M:** `[0,3127,390,844]`, bg #000, padding 0 24, gap 44. Wordmark 149x24, H2 34/39.1 `[24,3473,342,120]`, button 126x37 (small pill, 14/21).

**2.5b "Industries Section" (Deployment / Strategy)** `[0,3796,1440,979]`
- Column centered, padding 100px 60px 180px, gap 80, z1.
- Row `[120,3896,1200,699]`, max-w 1200, gap 16, two cards of 592x699 at x 120 and x 728.
- Card: column flex-end centered, padding 42px 60px 60px 42px, max-w 1000, radius 8, overflow clip. Image layer (cover), gradient overlay z1, content z2.
- Content `[162,4339,490,196]`: column centered, gap 32. Text group gap 10 holds H3 (max-w 404) and p (490 wide, 17px, rgba(255,255,255,.7), centered). Then a small white pill (padding 6px 16px, 14/21 #171719).
  1. "Deployment teams in every market." / "Local teams who build it with you, then hand it over and move to the next use case." / pill "See the model" 123x37, `./deployment`. Image GE2ff9…jpg.
  2. "Strategy that drives AI transformation." / "Shaping the shift: which problems, what order, how the organization changes." / pill "Explore the approach" 168x37, `./ai-transformation`. Image aa4tkK…png.
- **M:** section `[0,3971,390,1140]`, bg #000, padding 40px 24px 84px, gap 42. The DOM places it after the footer; it is ordered visually after AIOS.
  - Cards stack (column gap 16), each 342x500, padding 60px 24px 40px. Content gap 16.
  - H3 24/27.6. p 14/21/-0.28 rgba(255,255,255,.7).
  - The Strategy image on M is `we6aamQFKOLkq1wkIsxi4cTaDw.png`.

### 2.6 Section Industries (tabs plus a card)
- **D:** `[0,4775,1440,1083]`, bg #fff, padding 120px 60px. Inner "Industries CMS" `[80,4895,1280,843]`, max-w 1280, column centered, gap 64.
- Header column (gap 32):
  - H2 48 #171719 centered `[80,4895,1280,104]`: "Deep in regulated,⏎mission-critical industries".
  - "Tabs" track `[395,5031,649,43]`: row, gap 2, padding 4, bg #f5f5f5, radius 999, overflow-x auto.
    - Each chip: padding 9px 16px, radius 999, height 35. Active chip bg #fff, text #141414; inactive chips transparent, #6e6e6e.
    - Chips (width): Banking 79, Telecommunications 153, Healthcare 96, Retail 63, Utilities 73, Insurance 90, Airlines 75.
- "Card List" `[120,5137,1200,600]`, max-w 1200. Card is an `<a>` 1200x600, column space-between centered, padding 240px 24px 44px, radius 12, overflow clip.
  - Image cover, then "Overlay" gradient.
  - "Card Text" (z1, max-w 800, gap 8): H3 72 `[320,5377,800,76]`.
  - Bottom block `[144,5620,1152,74]`, gap 16: p 17 rgba(255,255,255,.88), then the "Explore more" span pill 93x36 (padding 6px 12px, bg #fff, radius 50, 12/10 #000).
- Tab data. Clicking a tab sets `?selected-industry=<slug>` and swaps the card.

| slug (href `./industries/<slug>`) | title | subtitle | image |
|---|---|---|---|
| banking | Banking | Accuracy, Compliance, and Trust | Z6ITE2va5GBIFUhQaiHnfePJmaY.jpg?width=1926&height=1075 |
| telecommunication | Telecommunications | Reliability, Scale, and Speed | FFdLCmKHmSQ4OZaBx3pFj3de65A.jpg?width=1651&height=921 |
| healthcare | Healthcare | Safety, Privacy, and Care | cvajetGWTDvJ06wQgNqFbZ79w60.jpg?width=1926&height=1075 |
| retail | Retail | Personalization, Reach, and Trust | ciChxsmc9Ulla7nbNs1CRdWq7ew.jpg?width=1651&height=921 |
| utilities | Utilities | Reliability, Scale, and Service | gauGNjiMjJQ5nem2UNlcqeILxVc.jpg?width=3853&height=2151 |
| insurance | Insurance | Precision, Compliance, and Trust | NQUtNQPJbCeeC92AlGEiZSe1hk.jpg?width=4096&height=2286 |
| airlines | Airlines | Disruption, Revenue, and Service | aqVMSZQBodIwmH6xYMyI9Tk27zk.jpg?width=3200&height=1786 |

- No autoplay: there were no changes in a 15s observation.
- **M:** `[0,5111,390,796]`, padding 0 24. CMS padding 84px 0, gap 32. Header gap 12. H2 34/39.1.
  - Tabs track max-w 330 `[30,5288,330,43]` scrolls horizontally (chips overflow to x 676).
  - Card 342x460, padding 160px 24px 44px, radius 8. H3 38/45.6/-3.42.

### 2.7 Closer
- **D:** `[0,5857,1440,716]`, column, padding 120px 60px, gap 60, overflow hidden. Background image z2gff… absolute 1440x716, cover.
- Top row `[80,5977,1280,104]`, max-w 1280, space-between:
  - H2 48 #fafafa, left `[80,5977,472,104]`: "The team building⏎the future of applied AI."
  - p 17 #fafafa, max-w 460 `[900,5986,460,87]`: "A single unified system that compounds the intelligence and execution of the entire workforce, processes, and products. We're early, and we're hiring the people who'll define it."
- Cards row `[80,6141,1280,312]`, gap 10. Two links, height 312, column flex-end, padding 32, radius 12, `backdrop-filter: blur(10px)`.
  - **Expanded card** (default: About us): 768 wide, bg #f5f5f5. Label 42/42 #393939. Round "Button" 44x44, bg #393939, radius 50%, opacity 1, holding a 24x24 arrow (color #f5f5f5) at 10/10.
  - **Collapsed card** (Careers): 502 wide, bg rgba(245,245,245,.2), label #fff, Button opacity 0 (bg #fff, icon #050505).
  - "About us" → `./about-us`, "Careers" → `./careers`.
- **M:** `[0,5907,390,684]`, padding 84px 24px, gap 64.
  - Text column gap 16: H2 34/39.1 left `[24,5991,342,81]`, then p 17.
  - Cards stack (gap 10): 342x118 each, padding 32, bg rgba(245,245,245,.2), radius 12. Label 32/32 #fff. Visible white 44px button with a 16px dark arrow.

### 2.8 Footer (`<footer>` `[0,6573,1440,505]`, bg #080808, z7)
- "Top" padding 60. Row max-w 1200 `[120,6633,1200,212]`, space-between.
- **Left** column (gap 32, padding-right 50):
  - Logo 122x30 (symbol `svg1117215530_4267`), then "Transform your operating model with Wonderful." (12/13.2 .7 white, 183 wide).
  - "Get in touch" small white pill 109x37 → `./contact`.
  - "© 2026 Wonderful AI B.V."
- **Right** row, gap 60, columns at x 512 / 711 / 901 / 1038 / 1163. Each column: gap 12, title opacity .65, links gap 10.
  - **Platform:** AI OS Overview `./ai-os`, Wonderful Agents `./agents`, Wonderful Systems `./systems`, Wonderful AI Gateway `./ai-gateway`, Deployment `./deployment`, Strategy `./ai-transformation`.
  - **Industries:** Banking, Telecommunications (`telecommunication`), Healthcare, Utilities, Insurance, Retail, Airlines, all `./industries/<slug>`.
  - **Company:** About us `./about-us`, Blog `./blog`, Press `./press`, Careers `./careers`, Trust Center `https://trust.wonderful.ai/`, Contact `./contact`.
  - **Social:** LinkedIn `https://www.linkedin.com/company/wonderfulcx/posts/?feedView=all`, X (Twitter) `https://x.com/wonderful_ai` (wrapper opacity .8).
  - **Legal:**
    - Legal Policies `./legal`
    - Privacy Policy `./legal/privacy`
    - Website Terms of Use `./legal/websiteterms`
    - Candidate Privacy Notice `./careers/candidate_notice`
    - Bug Bounty `./legal/bug-bounty-terms`
    - AI Safety `./safety`
    - A "Cookie Settings" button (wrapper opacity 0: invisible but present)
- **Bottom wordmark:** container `[0,6905,1440,173]`, padding-right 17, max-w 1680, overflow clip. Image EfwFw…png is 1352x323 (aspect 4.179) at opacity 0.1, so only its top 173px shows.
- **M:** `[0,6591,390,1033]`. Top padding 60px 24px 24px, gap 42. Column gap 60.
  - Right side: wrapping row, gap 32 (row) / 42 (col). Columns at x 24 / 206 then 24 / 199, then Legal at y 7334.
  - Wordmark 325x91, contain, inside an 80px container (padding 20px 17px 0 0).

### 2.9 Overlays
- **Framer cookie consent panel:** fixed top-right `[1060,20,360,179]`, bg #fff, radius 14, inset 1px rgba(0,0,0,.05).
  - Title "Cookie Settings" 16px. Text Inter 14/21 #444: "We use cookies to enhance your experience, analyze site traffic and deliver personalized content. Read our Cookie Policy." The link is #999.
  - Buttons "Reject" (light grey) and "Accept" (#000). Button metrics were not captured; this is Framer platform UI, so it is optional to clone.
- **Unused custom-cursor div:** fixed 14x14, z 13, radius 20, opacity 0. It never became visible during testing.

---
## 3. Interaction states (hover/click)
| element | change | timing (measured) |
|---|---|---|
| Hero "Get in touch" (white pill, appear-id 1ffh46l) | opacity 1 → 0.6 | spring, overdamped: .98 @30ms, .89 @100, .80 @200, .74 @300, .65 @600, .62 @900, .60 @1500. Fits stiffness 200 / damping 60 / mass 1. Leave: back to 1 in about 1.5s (.71 @100, .85 @300, .95 @600) |
| Hero "Explore the platform" (outline) | no change measured (opacity, bg, border, text all static) | – |
| Carousel arrow | opacity 1 → 0.7 on hover. Click scrolls the track 400px (`scrollBy({left:±400, behavior:'smooth'})`) | native smooth scroll about 450ms (sampled 28 @50ms, 159 @100, 276 @150, 331 @200, 381 @300, 398 @400, 400 @450). Left arrow is .4 at start and 1 once scrolled |
| Carousel cards, industry card, "Grey small" pills, tabs (hover) | no hover change | – |
| Tabs (click) | old chip bg #fff → transparent and new chip transparent → #fff; text #6e6e6e ↔ #141414 | about 200–300ms crossfade. The card re-mounts: card opacity .8 → 1 (about 650ms) and "Card Text" re-runs its appear (opacity .001 → 1, y 10 → 0, delay .16s, 0.4s, ease cubic-bezier(.5,0,.88,.77)) |
| Closer cards | hovering the collapsed card expands it: widths swap 768 ↔ 502, bg #f5f5f5 ↔ rgba(245,245,245,.2), label #393939 ↔ #fff, button opacity 0 ↔ 1, button bg #393939 ↔ #fff, icon #f5f5f5 ↔ #050505 | width progress .43 @50ms, .65 @100, .79 @150, .87 @200, .95 @300, .98 @400, 1 @600. Fast, roughly critically-damped spring. Rough fit: stiffness 480 / damping 44 (not least-squares) |
| Nav triggers | open mega-menu (see §1) | about 200ms |
| Footer links | color rgba(255,255,255,.7) → #fafafa (CSS `:hover` via `--framer-link-hover-text-color`) | transition not measured (CSS rule has none) |

---
## 4. Motion

### 4.1 On-load appear effects (from `#__framer__appearAnimationsContent`; same on all breakpoints)
Origin is when the app becomes interactive, about 330ms after navigation start (DCL).

| id | element | initial | transition |
|---|---|---|---|
| 7zwiw9 | hero "Explore the platform" | opacity .001 | tween .6s, delay .4, ease [.44,0,.56,1] |
| 1ffh46l | hero "Get in touch" | opacity .001 | tween .6s, delay .5, ease [.44,0,.56,1] |
| 16lndwp | AIOS H2 "Text 1" | opacity .001 | spring stiffness 200, damping 60, mass 1, delay .1 (runs when in view) |
| c9ueq4 | "Explore the OS" button | opacity .001 | tween .6s, delay .5, [.44,0,.56,1] |
| lauy6h-0 | industry "Card Text" | opacity .001, y 10 | tween .4s, delay .16, ease [.5,0,.88,.77] |
| t7l7t2 | footer "Get in touch" | opacity .001 | tween .6s, delay .5, [.44,0,.56,1] |

Also on load, the hero video autoplays (currentTime 0.31 at t = 766ms).

### 4.2 Word-by-word text effect (headings)
Applies to these elements; each word is wrapped in an `inline-block` span:
- hero H1
- "Trusted by…", "Solving…", "Deployment teams…", "Strategy that drives…", "Deep in regulated…", "The team building…"

Behaviour:
- **Initial:** `opacity:.001; filter:blur(6px); transform:translateY(16px)`.
- **Animate to:** opacity 1, blur 0, y 0.
- **Per-word stagger:** 0.05s (word *n* starts 50ms after word *n-1*).
- **Per-word curve:** spring with slight overshoot (y reaches -0.2px), settles about 350ms. Sampled progress every 50ms: .14, .41, .65, .82, .93, .98, 1.0. Best fit: stiffness 175, damping 22, mass 1. Opacity, blur and y share the same progress.
- **Trigger:** fires when the heading's top edge enters the viewport (fired at headingTop = 884px in a 900px viewport, i.e. amount about 0). Runs once.
- **Hero H1:** starts on mount, about 470ms after nav start, same params.

### 4.3 Word-by-word text effect (paragraphs)
Applies to the hero sub paragraph and the closer paragraph.
- **Initial:** `opacity:.001; blur(10px); translateY(10px)`.
- **Stagger:** about 0.05s per word.
- **Per-word curve:** overdamped spring, no overshoot. Progress .11 @23ms, .42 @89, .63 @156, .77 @223, .85 @290, .91 @356, .95 @455, .99 @623ms. Fit: stiffness 340, damping 56, mass 1.
- The hero paragraph starts at the same time as the H1. The closer paragraph uses the same in-view trigger as the headings.

### 4.4 Scroll-linked color reveal ("We bring together…")
Reversible and driven purely by scroll (no time-based easing). Each word linearly interpolates `rgba(144,144,144,.26)` → its final color (#4a4a4a, or #000 for AI/platform,/deployment/strategic). Opacity stays 1, blur 0, transform none throughout.

Measured window per word (page scrollY at D 1440x900; 2% / 50% / 99% progress):
```
word        start  mid   end
We          1050  1270  1490
bring       1200  1420  1640
together    1350  1570  1790
the         1500  1720  1940
AI          1650  1870  1960
platform,   1800  1950  1990
deployment  1940  1980  2010
teams,      1970  2000  2030
and         1990  2020  2050
strategic   2010  2040  2070
partnership 2030  2060  2100
to          2050  2090  2120
transform   2080  2110  2140
how         2100  2130  2160
enterprises 2120  2150  2180
work.       2140  2170  2200
```
Reference geometry: component container top = 1938, p top = 2386. At scrollY 1050 the container top is 888px into the 900 viewport. Every word completes by scrollY 2200.

Recommended mapping: words 0–3 have 440px windows staggered by 150px. All later words are compressed to end by 2200 with about 20px stagger and 50–60px windows.

### 4.5 Announcement ticker (nav banner)
Two slides alternate every **7.0s** (measured switches 7.0s apart) and loop forever.
- **Outgoing slide:** opacity 1 → 0 and y 0 → -6px over about 250ms, ease-in. It then jumps to y +6, hidden.
- **Incoming slide:** starts about 150ms after the outgoing one begins. Opacity 0 → 1 and y +6 → 0 over about 450ms, ease-out.
- Each slide's inner row is `position:absolute; top:50%; transform:translateY(-50%)`.

### 4.6 AI OS "Hero Lattice" (custom code component; plain DOM plus CSS keyframes; no canvas, WebGL or lottie)
**Container:** absolute, inset 0 over AIOS `[0,2941,1440,855]`, overflow hidden, pointer-events none.

**Dot grid layer**
- `position:absolute; left:50%; top:50%; width:75%; height:75%; translate(-50%,-50%)`. On D that is 1080x641 at section offset (180,107).
- Row of 11 columns, `justify-content:space-between`, column width 6.79px.
- Even columns (0,2,…,10): `top:0; height:100%`, 9 slots (space-between, 79.28px pitch).
- Odd columns: `top:calc(6.25% - 0.424px); height:calc(87.5% + 0.849px)`, 8 slots (77.84px pitch).
- Each slot is a 6.79px square holding `.wf-dot` (100% size, radius 0, initial opacity 0).
- Dot colors: W = `rgba(255,255,255,.54)` and O = `rgb(252,118,47)`. A `-` means an empty slot.
- Every dot runs `animation: 17.05s ease-in-out <delay> infinite wfDotWave2` with keyframes `0%{opacity:0} 2.639%{opacity:1} 78.886%{opacity:1} 87.097%{opacity:0} 100%{opacity:0}`.
- Pattern and delays (top → bottom):
```
c0  W1.8 W1.725 W1.65 W1.575 W1.5 W1.575 W1.65 W1.725 W1.8
c1  O1.462 O1.387 O1.313 O1.238 O1.238 O1.313 O1.387 O1.462
c2  W1.2 W1.125 W1.05 - - - W1.05 W1.125 W1.2
c3  O.863 O.787 - - - - O.787 O.863
c4  W.6 W.525 - - - - - W.525 W.6
c5  O.263 O.188 - - - - O.188 O.263
c6  W.6 W.525 - - - - - W.525 W.6
c7  O.863 O.787 - - - - O.787 O.863
c8  W1.2 W1.125 W1.05 - - - W1.05 W1.125 W1.2
c9  O1.462 O1.387 O1.313 O1.238 O1.238 O1.313 O1.387 O1.462
c10 W1.8 W1.725 W1.65 W1.575 W1.5 W1.575 W1.65 W1.725 W1.8
```
In effect, the dots fade in as a wave from the center outward and fade out at about 13.4s of each 17.05s cycle.

**Tag layer** (same 75% grid geometry; a tag is anchored at a slot origin)
- **Tag element:** `.wf-tag` is a flex row with gap 13.575px and `white-space:nowrap`.
  - Left-side tags use `flex-direction:row-reverse; padding-left:11.878px`, so the label sits left of the box. The wrapper uses `translate(calc(-100% + 14.4235px), -14.4235px)`, which centers the box on the slot.
  - Right-side tags use `row` with `padding-right:11.878px`.
- **Box:** `.wf-tag-box` 28.847px square, `border:.848px solid rgba(245,245,245,.85)`, bg #000. Inner square 6.79px `rgba(245,245,245,.9)` centered.
- **Panel:** `.wf-tag-panel`, absolute inset 0, bg #f5f5f5, radius 0. Transform-origin is the box center: `calc(100% - 14.4235px) center` for left tags, `14.4235px center` for right tags.
- **Label:** a span, IBM Plex Mono 16.942px (M 13.5px), letter-spacing -0.04em, #000. Width `calc(Nch - k px)`, holding `.wf-type` (`overflow:hidden; width:0`).
- **Animations** (all 17.05s, infinite, per-tag delay):
  - box: `wfTagBox1`, `cubic-bezier(.22,1,.36,1)`. Keyframes: `0%{opacity:0;scale(.2354)} 1.29%{opacity:1;scale(1)} 15.437%{1;1} 16.469%{opacity:0;scale(.2354)} 100%{0}`.
  - panel: `wfTagPanel3`, `cubic-bezier(.16,1,.3,1)`. Keyframes: `0%{scaleX(0)} 1.29%{scaleX(0)} 3.284%{scaleX(1)} 13.842%{scaleX(1)} 15.437%{scaleX(0)} 100%{scaleX(0)}`.
  - typing: `wfType<N>`, `steps(N)`. Keyframes: `0%{width:0} 3.284%{0} 6.51%{calc(Nch - k)} 11.789%{same} 13.842%{0} 100%{0}`.
  - The k values: N=3 → 2.033px, 4 → 2.711, 5 → 3.388, 6 → 4.066, 9 → 6.099, 10 → 6.777, 11 → 7.454, 12 → 8.132.
- **Tags** (box top-left relative to section top-left at D; side; delay; N):
```
Data          (502,146) left  11.757s 4
Alerts        (598, 96) left   6.385s 6
Permissions   (609,186) left   1.125s 11
Skills        (598,651) left   3.983s 6
Orchestrator  (609,741) left   9.5s   12
CLI           (824,107) right  9.2s   3
Evals         (824,186) right  3.683s 5
Guardrails    (824,662) right  1.425s 10
Workspaces    (824,741) right  6.685s 10
Knowledge     (931,702) right 12.057s 9
```
- Under `prefers-reduced-motion: reduce`, all animations are none, dots and tags are opacity 1 / transform none, and `.wf-type` is width auto.
- **M:** the dot grid box is 343x654 at page y 3222 (12 child layers measured), dots 6px, tag font 13.5px.

### 4.7 Other
- **Video:** autoplay, muted, loop (44.36s), no pause-on-scroll observed.
- **Parallax:** none. Element transforms and positions were sampled at 9 scroll positions and none were scroll-linked except §4.4.
- **Marquees:** none. The client logos are a static grid.
- **Carousel autoplay:** none.
- **Cards:** the industry card enters at opacity .8 and animates to 1 (about 650ms) when it appears or re-mounts.

---
## 5. Notes / limits
- Everything renders as DOM, with no canvas or WebGL. The lattice is a Framer code component (`data-code-component-plugin-id="api"`). There is no lottie and no iframe embed on the page; the Framer editor-bar iframe (0x0) should be ignored.
- **Third-party widgets** in the nav and page:
  - Translator language chip (`.scLangSelector`, "EN", via `__translator.js`). It sits in a 66x36 slot (D) / 44x44 (M).
  - Comeet careers JS API.
  - GTM.
  - The Framer cookie banner.
  These are not part of the design system; render a static "EN" chip if needed.
- **Not measured:** the tablet breakpoint (880–1439) and the ≥1800 breakpoint. Their CSS rules exist; for example the hero is `85vh`, min 560, on tablet.
- **Spring constants** marked "fit" were derived by least-squares fitting of sampled curves. The constants from `appearAnimationsContent` are exact.
