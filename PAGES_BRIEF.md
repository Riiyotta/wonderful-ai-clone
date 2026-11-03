# Multi-page build brief (shared by all page-group agents)

Project: /Users/riyaghosh/V3/wonderful.ai — React 18 + Vite 5 + Tailwind v3 + react-router-dom 6. Dev server with HMR is ALREADY running at http://localhost:5288 (don't start another; vite serves SPA fallback for every route).
Original: https://www.wonderful.ai (a Framer site). Goal: every route pixel- and motion-identical to live at 1440x900, 1100x900 and 390x844.

## What already exists (read-only for you — do NOT edit)
- `src/App.jsx`: BrowserRouter shell. Renders `<Navbar/>` + `<main>{route}</main>` + `<Footer/>` for each route unless the route sets `chrome: 'none'`. Same-origin `<a href="/x">` clicks are turned into client-side navigations automatically, so just use plain anchors with absolute paths (`/industries/banking`, never `./`). Scroll resets to top on route change.
- Homepage: `src/pages/Home.jsx` + `src/components/*` (Hero, Clients, CaseStudies, RevealStatement, DarkBand(+darkband/*), Industries, Closer). Reuse these components on other pages when live reuses the same Framer component — import them, don't copy-edit them.
- Shared: `src/components/Navbar.jsx` + `src/components/nav/*`, `src/components/Footer.jsx`, `src/components/WordReveal.jsx` (word-by-word blur/rise reveal; supports "\n" line breaks; variant heading|paragraph; onMount; delay), `src/components/sections/shared.jsx` (H2_SECTION, P_17, LinedHeading, PhosphorArrowRight), `src/lib/spring.js` (springEase(stiffness, damping) -> CSS linear() easing + duration; TWEEN_FADE), `src/lib/useInView.js` (amount option), `tailwind.config.js` tokens (font-favorit, font-inter, font-plex, colors band/offwhite/chip/ink-*, accent; screens `m:` = max 879.98px, `d:` = min 880px; for other ranges use arbitrary `[@media(...)]:`), `src/index.css`, `src/styles/fonts.css`.
- Nav theme: the Navbar shows its dark (white-text) variant while any element with `data-nav-theme="dark"` covers the top edge of the viewport, otherwise the light frosted variant. Put `data-nav-theme="dark"` on dark sections of your pages.
- If you need a change in any shared file (e.g. a Navbar/Footer variant a page uses), DON'T edit it — list the exact change needed in your final report and work around it meanwhile.

## What you own
- `src/routes/<group>.jsx` — export default an array of `{ path, element, title, chrome? }` (title = live <title>). This is how your pages get mounted.
- `src/pages/<group>/**` — your page components, data files (e.g. extracted CMS content as JSON/JS), and section components.
- `src/styles/<group>/**` — your CSS (import it from your components). Extra @font-face rules your pages need go here too.
- `CLONE_SPEC_<GROUP>.md` in the project root — your measured spec.

## Inputs
- `_source/pages/<route>.html` — server-rendered HTML of every live route (route slashes become `__`, `/` is `index.html`). It contains the full markup, copy, inline SVGs, and Framer CSS (exact values per breakpoint: `13yvw11` desktop 1440–1799, `bgr1vb` tablet 880–1439, `uu1d5z` mobile <880, `1nndbqt` >=1800). Extract copy and SVGs verbatim from here.
- Assets: every framerusercontent image/asset referenced by any page is downloaded to `/public/assets/<basename>` (use `/assets/<basename>`, drop `?scale-down-to…` query strings). Videos: `/public/videos/<basename>` for framerusercontent mp4s; cdn.wonderful.ai videos: only the homepage ones are local (`/videos/hp-16x9.mp4`, `/videos/hp-9x16.mp4`) — download any other cdn.wonderful.ai video your pages use into `/public/videos/` with a clean filename. Fonts: framer woff2 in `/public/fonts/<basename>`, Google fonts in `/public/fonts/g/` (filename = gstatic path with `/` -> `_`). If anything is missing, download it into the same folders.
- Homepage spec `CLONE_SPEC.md` documents the global tokens, nav, footer and the motion system (word reveals, appear effects, springs) — the same Framer presets are reused across pages.

## Method (per page or per template)
1. Recon live with Playwright (headless, isolated contexts — `require('/Users/riyaghosh/langchain-home/node_modules/playwright')` works; the shared MCP browser is contended by other agents, avoid it). Dismiss the cookie banner. Measure section geometry, computed typography, colors, images/crops, hover states and motion (sample computed styles over time with rAF). Write it to `CLONE_SPEC_<GROUP>.md`.
2. Build. One component per section; arbitrary Tailwind values for exact px; no component libraries. For CMS-type templates (many pages, same layout) extract content from `_source/pages` into a data file and render through one template component.
3. Verify against live at 1440 / 1100 / 390: page height, section boxes within ~2px, text wrapping identical, side-by-side screenshots, motion timing. Fix until matched. Check console has no errors and no 404s for your assets.
4. Run `npx vite build` at the end (other agents edit concurrently; if a build error is in a file you don't own, re-run once after a short wait and report it if it persists).

## Report
Routes built, verification numbers (heights live vs clone per width), what remains different and why, and any shared-file changes you need.
