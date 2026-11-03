# Information architecture: wonderful.ai clone

`ia.json` is the only file to hand-edit. `IA.md` (readable doc) and `matrix.csv` (section × template matrix) are **generated** by `build.mjs`. Don't edit them; they are overwritten on every build.

```bash
node validate.mjs   # hard checks: route sum, template count, section references, categories
node build.mjs      # regenerates IA.md and matrix.csv from ia.json
```

## What it covers

- **104 routes in 27 templates and 83 sections.** The routes are the 103 in the live sitemap plus `/fcb/x/thank-you`, which live redirects to after the matchday form but leaves out of the sitemap.
- Sections were read from the rendered clone at 1440px. Each one names the component that renders it (`implementedBy`), so the IA doubles as a map of `src/`.
- `chrome` records how much site shell a page carries:
  - `full`: nav and footer, 85 routes.
  - `none`: 14 routes (legal documents, candidate notice, job posts and applications).
  - `event`: 3 routes. The FC Bayern microsite has its own footer.
  - `nav-only`: `/contact`.
  - `nav-light-footer`: `/legal`.

## What the data shows

- **74% of routes come from 4 data-driven templates.** These are blog article (51), country launch (10), legal document (9) and industry (6, plus Utilities as its own template because only it has the customer-video section): 77 of 104 routes. The real build effort sits in the other 27 routes. 22 templates cover them, and most of those are single bespoke pages: the homepage, four product pages and two approach pages.
- **Only 13 of 83 sections are shared; 70 are page-local.** Apart from the nav and footer, reuse is shallow. The industry sections are shared by the 7 industry pages, `features.platform-cards` by 4 product pages, and `conversion.operating-model-cta` by 12 routes. The page-local sections should stay local until a second page needs them.
- **Two shared sections are implemented more than once in code.** These are real consolidation candidates:
  - `conversion.operating-model-cta` ("Transform your operating model with Wonderful."): 4 separate components (company `CtaBand`, `aios/Cta`, `platform/Closer`, industries `ClosingCta`), plus a fifth copy inside the legal `LightFooter`.
  - `features.platform-cards`: `product/shared/ProductCards.jsx`, plus a re-implementation in `platform/Gateway.jsx > Products`.
- **Similar-looking blocks are kept as separate sections on purpose.** The homepage client-logo grid and the per-industry logo strip carry different logos at a different size. The light and dark case-study carousels (homepage vs `/agents`) are also different. Each pair has its own id, so neither shared id has to mean two things.

## Known validator note (informational, not a bug)

`validate.mjs` flags that `conversion.operating-model-cta`'s scope text mentions "7" while the section computes to 12 routes. Both numbers are true. 7 is the industry-page subset named inside the sentence, and 12 is the total, stated as "(12 routes)". Don't "fix" either number to match the other.

## Live quirks recorded as-is

- `/ashby` renders the not-found page.
- Job posts are cut off at a fixed 1080px height.
- The job application form is a stand-in, because the real jobs.ashbyhq.com embed was blocked on this network.
- `/archive/comeet-style` is an empty embed frame.
- No form submits anywhere: `/contact` goes to `/thank-you`, and the matchday form goes to `/fcb/x/thank-you`.
