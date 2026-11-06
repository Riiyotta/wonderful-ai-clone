# Changelog

## 1.0.1 - 2026-11-06

Status: design-review-pending (`productionApproved: false`). Visual parity gate review complete (agent review, not a
production approval; production approval stays a human sign-off).

Parity (1440x900, threshold 24/255, gate 0.80, 104 routes, 751 sections): mean section score 0.993 -> 0.996, sections at or
above the gate 743 -> 749, below the gate 8 -> 2. Real numbers in `extraction/measured-values.json#/sectionParity` and
`extraction/parity/parity-results.json`.

Fixed in `src/` (each re-measured against the live site)
* `PlatformCards.jsx`/`platform.css`, `Deployed.jsx`, `Closer.jsx`/`closer.css`: the width/colour springs ran from the first
  paint, so a viewport resize (a full-page screenshot is one) animated the 60/40 cards through a mid-spring state. The
  springs are now armed by the first hover swap. `/deployment` content.stat-intro 0.568 -> 0.997, `/ai-transformation`
  0.594 -> 0.995, `/systems` 0.594 -> 0.997, `/` team-closer 0.760 -> 0.995.
* `Deployed.jsx`: heading uses `text-wrap: wrap` (live computed value) instead of `balance`.
* `industries.js` + `Workflows.jsx`: insurance workflow image focal point `25.1% 39%` (live); `/industries/insurance`
  features.workflow-list 0.725 -> 1.000.
* `App.jsx` + `Navbar.jsx`: `/ashby` (the Framer 404 page) renders the header without the language chip, as live does on
  desktop and mobile; `/ashby` hero.not-found 0.792 -> 0.807 (the remainder is the 6s spinning gradient blob; 0.773-0.821
  across runs).

Exception (pending human approval, EXC-001)
* `conversion.job-application-form` on `/ashby/55005121-d37f-463d-98b0-29d400eb52c0/submit` (0.704) and
  `/ashby/8de2ffef-0059-4c5d-b2ac-c1fd0c8d31ba/submit` (0.703): live is a cross-origin `jobs.ashbyhq.com` iframe; on the
  measurement machine it returns 403 and a network-policy interstitial renders in the box (not bypassed). Outside the iframe
  rectangle the section matches 1.000. The stand-in form is unchanged and stays unverified. Not added to bypass the gate: the
  score is recorded unchanged.

Changed
* `extraction/parity/parity_sections.mjs`: pauses every `<video>` on frame 0 on both sides before the screenshot (seek wait
  up to 25s because a seek on the live CDN takes ~5s), overrides `play()` so in-view observers cannot resume it. The earlier
  0.995 on the `/` hero was a lucky frame alignment; the unchanged harness scored 0.11-0.76 there. No other region is
  frozen or masked.
* Re-pointed source citations after the `src/` edits (`Closer`, `Deployed`, `Navbar` and its chip/trigger primitives,
  `platform.css`); added notes to the four affected section contracts. Section heights unchanged (re-measured, 0px delta).
* `registry.manifest.json`: version 1.0.1 and `parityGateReview`. README parity section rewritten with the before/after table.

Note
* Parity needs the clone's git-LFS media (`git lfs pull`); a plain checkout has pointer files for the videos.

IR left untouched by request
* No file under `ir/` and no IR schema exists in this repository; none was created, edited, regenerated or deleted.

## 1.0.0 - 2026-11-04

Status: design-review-pending (`productionApproved: false`). First packaged release; the contract data (tokens,
primitives, components, 76 sections, 20 templates, 104 routes, schema, semantic validator, examples, token catalog and
policy, parity harness) was built before this entry; this entry adds the admission tooling and the registry.

Added
* `registry.manifest.json`: versions, status, counts recomputed from disk, entry points (all inside this folder),
  category `saas` with the evidence and counter-evidence in `policy/design-policy.json`, and the designPolicy binding to
  `n0-saas-design-constraints-common` 0.1.0 (commonIrVersion 0.5, hard-and-soft) with a verified `contentHash`.
  Approval is pending architecture review; the classification is an agent decision (agent attestation, not a human sign-off).
* `extraction/verify_all.py`: the single admission command (schema validity, examples, controls for every template in
  both modes, allowlist parity, versions, counts, entry points, absolute paths, junk, citations and section source tags,
  pins, retrieval eligibility, asset roles, source-brand registry, generated-mode canaries, token catalog rebuild check,
  token policy resolution, graph parity, route coverage against `src/` and `ia.json`, wrapper gate, policy binding,
  adversarial coverage, docs).
* `extraction/wrapper_gate.py` and `extraction/wrapper-whitelist.json` (moved out of `measured-values.json`), thresholds
  pinned in code: HERO 1800 warn / 3000 fail; section share 50% warn / 60% fail; pages with fewer than 3 in-flow
  sections skipped; SHELL excluded; missing measurement and a wrong viewport are errors. Whitelist entries: `/blog`
  post grid, `/press` mosaic, `/fcb/x/thank-you` confirmation (each is a single listing or opener unit; all
  `reviewedBy` fields say agent attestation, not a human sign-off, and each still warns). Measurements exposed no
  whole-page, whole-article or whole-legal section: nothing needed decomposing.
* `extraction/build_source_brand.py` and `extraction/source-brand-evidence.json`: re-derives, from `src/` and
  `CLONE_SPEC*.md`, how often and where every registry entry occurs; `--check` fails on drift. Found two registry entries
  not present in the source as written (`$100M`, the `^/assets` anchor); fixed by recording `$100 million` and the long-form
  matching rule.
* `schema/tests/adversarial_test.py` and `schema/tests/controls.py`: mutations and controls (schema, structure,
  generated-mode leakage including zero-width, full-width and curly-quote evasions, token rules, retrieval flips,
  registry and pin edits, wrapper-gate cases); one control per template in both modes synthesized from the repo itself.
* `extraction/prove_drift.py`: injects each defect into a scratch copy and requires `verify_all.py` to fail (or warn
  as designed); also proves the clean copy and a standalone copy pass.
* README.md with the counts table checked by `verify_all.py`.

Changed
* `schema/semantic_validate.py`: generated-mode matching now folds text first (NFKC full-width, zero-width characters,
  curly quotes and dashes, a small look-alike table). Before this, `Wonder<zero-width>ful` and full-width spellings of
  the brand passed generated mode. Detection remains string-based.
* `schema/semantic_validate.py`: two leaks the new adversarial suite found are closed. A generated page's `brand.mark`
  with a source-only role (e.g. `logo.source-wordmark`) was accepted when its `src` used `generated://`; the mark role must
  now be `brand-mark.generated` or `brand-mark.user-supplied`. An inline person object (the article author, which has an
  `identityRole` but is not a `$ref` person) escaped the `GENERATED_MODE_PERSON` check; it is now checked like a person.
* `schema/source-brand.json`: added the statistic `$100 million` (present in the source press titles).

Verified at release
* Section heights re-measured at 1440px from a production build of a fresh clone (`npm ci`, `vite build`, `vite preview`):
  104 routes, 933 boxes, largest difference from `measured-values.json` 0px; the recorded values are unchanged.
* `extraction/verify_all.py`, `schema/tests/adversarial_test.py`, `extraction/prove_drift.py`, root `node validate.mjs`
  and the baseline audit were run; their output is in the build report, not asserted here.
* Visual parity from the earlier measurement: mean section score 0.993; 8 of 751 sections below the 0.80 gate (see README).
  It was not re-measured in this release.

IR left untouched by request
* No file under `ir/` and no IR schema exists in this repository; none was created, edited, regenerated or deleted, and
  no check depends on an IR.
