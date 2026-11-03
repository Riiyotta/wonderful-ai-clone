# Motion QA findings (clone vs live, 1440x900) — to fix

1. Nav light-section bar bg/blur (`.nv-bar`, src/styles/navbar.css ~l.128, `--nv-ease-bg` ~l.8). Live: rgba(250,250,250,0→.2) + blur 0→10px, full in ~240–460ms (.016 / 0.85px at 60ms). Clone ramps ~900ms (.008@65, .024@115, .2@982) — something overrides/retriggers the 240ms transition.
2. Mega-menu open/close (src/styles/navbar.css ~l.223 `.nv[data-menu]`, Navbar.jsx). Live: header stays 61px ~300ms after hover, then jumps to ~427 in one frame; close snaps back in one frame. Clone animates open 110–200ms, close ~130ms. (Live sampled with synthetic hover — confirm with real pointer.)
3. Industries tab crossfade (src/styles/industries.css ~l.6, `.ind-tab` 250ms ease). Live: ~146ms delay then ~130ms ease-in-out (0.016@146, 0.47@196, 0.965@263). Clone 8→275ms. Clone also animates chip text #6e6e6e→#141414; verify label-level colour on live.
4. Closer card width spring (src/styles/closer.css l.1–16). Live progress .31@55, .46@89, .97@339, 1.0@672. Clone .18@35, .43@68, .64@101, .97@235, 1.0@485 — needs longer tail.
5. Word-reveal in-view trigger (src/lib/useInView.js / WordReveal.jsx). Live fires when heading top is ~855–881px in a 900px viewport (i.e. ~20–45px inside); clone fires at 895–900. Add a negative bottom rootMargin / amount so it fires a bit later.
6. Ticker (src/components/nav/Announcement.jsx, navbar.css ~l.75–81). Incoming slide starts 166ms after outgoing on live vs 134ms on clone; incoming duration ~430ms vs 450ms.
7. Reveal paragraph "AI" word 50% point ~50px early (1900 vs 1950) — low priority.

Matched (don't touch): heading word reveal timing, hero button hover, carousel arrow scroll, AI OS appear (live is NOT in-view gated), lattice cycle + tag delays, nav collapse, pill crossfade.
Not verified: hero H1/sub start on load, closer paragraph reveal, industries card text appear, footer hovers, nav trigger hover colours, all of mobile 390x844.
8. (from pixel audit) Reveal paragraph timing on mobile 390x844 and tablet 1100: clone colours words too early (mobile scroll 1300: live first word ~67%, clone 100%). Re-measure the per-word windows on live at those widths and fit them (src/components/RevealStatement.jsx).
