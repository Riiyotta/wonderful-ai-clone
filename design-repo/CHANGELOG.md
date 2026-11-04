# Changelog

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
* `extraction/verify_all.py`, `schema/tests/adversarial_test.py`, `extraction/prove_drift.py`, root `node validate.mjs`
  and the baseline audit were run; their output is in the build report, not asserted here.
* Visual parity from the earlier measurement: mean section score 0.993; 8 of 751 sections below the 0.80 gate (see README).
  It was not re-measured in this release.

IR left untouched by request
* No file under `ir/` and no IR schema exists in this repository; none was created, edited, regenerated or deleted, and
  no check depends on an IR.
