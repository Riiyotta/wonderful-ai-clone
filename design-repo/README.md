# Wonderful design-repo

A machine-validated PageSpec system extracted from the Wonderful ("Enterprise AI OS") marketing-site clone: tokens,
primitives, components, section contracts, page templates, a PageSpec JSON Schema, a semantic validator and the tooling
that proves they stay consistent. An LLM or a person can compose new on-brand pages from it without inventing colours,
copy budgets, sections or assets.

| | |
|---|---|
| Repository version | 1.0.0 |
| PageSpec version | 1.0.0 |
| Status | design-review-pending (`productionApproved: false`) |
| Category | `saas` (enterprise B2B platform), bound to `n0-saas-design-constraints-common` 0.1.0, pending architecture review |
| Visibility | PRIVATE: describes a real, live company; never publish |

## Counts

Recomputed from disk by `extraction/verify_all.py` (the `manifest-counts` check fails if this table or
`registry.manifest.json` drifts).

| Item | Count |
|---|---|
| tokens | 189 |
| primitives | 16 |
| components | 22 |
| sections | 76 |
| templates | 20 |
| routes | 104 |
| assetRoles | 30 |
| graphRules | 10 |
| generatedExamples | 4 |
| measuredRoutes | 104 |

## Layout

```
registry.manifest.json   versions, status, counts, entry points, category + designPolicy binding
tokens/                  00-foundation, 10-semantic, 20-component, 30-layout, themes, llm/{token-catalog,token-policy,component-allowlist}
primitives/ components/  generic building blocks
sections/                one contract per semantic section (source provenance split from the AI-facing taxonomy)
templates/               templates.json (page families, node lists) and routes.json (every served route -> one template)
compatibility/graph.json rhythm / position rules (severity error|warn)
assets/asset-roles.json  closed asset roles with three-way availability and licensing guidance
schema/                  pagespec.schema.json, section-contract.schema.json, semantic_validate.py, source-brand.json,
                         reference-copy-corpus.json, example.pagespec.json, examples/, tests/{adversarial_test,controls}.py
extraction/              verify_all.py, wrapper_gate.py (+ wrapper-whitelist.json), prove_drift.py, token_catalog.py,
                         build_source_brand.py, measure_sections.mjs, section-map.json, measured-values.json, parity/
policy/design-policy.json  SaaS classification (evidence and counter-evidence) and the policy binding
```

## Modes

Every PageSpec declares a required, closed `mode`.

* `reference`: a faithful reconstruction of the clone. Real brand, copy and assets are allowed (examples:
  `schema/example.pagespec.json`, `schema/examples/reference-*.json`); the route must be a served route of the template.
* `generated`: a new page for another brand. `schema/semantic_validate.py` rejects source identity under named rules
  (`GENERATED_MODE_BRAND`, `_CUSTOMER`, `_CTA`, `_COPY`, `_URL`, `_STORE`, `_ASSET`, `_PERSON`, `_RATING`, `_STAT`).
  Media roles must be `generation-safe` (pinned in code in two places) and listed in the section's
  `generatedAssetRoles`; media sources use `generated://`, `placeholder://`, `user-supplied://` or reserved
  `.example` / `.invalid` hosts. Examples: `schema/examples/generated-*.json`.

## Commands

Python 3.9+ and the `jsonschema` package (Draft-07). Nothing else is needed to validate; Node and Playwright are only
needed to re-measure heights or parity.

```bash
python3 extraction/verify_all.py                     # the single admission command (0 failures required)
python3 schema/tests/adversarial_test.py             # every mutation rejected, every control accepted
python3 extraction/prove_drift.py --scratch DIR      # injects defects into scratch copies; each must be caught
python3 extraction/wrapper_gate.py                   # wrapper-height gate alone
python3 extraction/token_catalog.py --write          # rebuild tokens/llm/token-catalog.json after a token edit
python3 extraction/build_source_brand.py --write     # re-derive source-brand evidence after a registry or source edit
python3 schema/semantic_validate.py <pagespec.json>  # validate one PageSpec (schema + semantic)
```

`verify_all.py` re-reads the real source (`src/`, `ia.json`, `_source/routes.txt`, `package.json`) when the clone sits
beside `design-repo/`; when the folder is copied on its own it prints one warning per source-dependent check and
still passes the internal checks.

## What is enforced where

* Sections are semantic units: no whole-page or whole-article section (articles are header + chapters, legal documents are
  header + one section per heading, indexes are header + grid). `extraction/wrapper_gate.py` reads the sections' boxes
  measured at 1440px for all routes: a HERO taller than 1800px warns and above 3000px fails; one in-flow non-shell
  section above 50% of its page warns and above 60% fails (pages with fewer than 3 in-flow sections are skipped, fixed
  and sticky boxes take no page height). Thresholds are pinned in code. Three index or confirmation pages are
  whitelisted in `extraction/wrapper-whitelist.json` (and still warn).
* Runtime UI (cookie banner, menus, lightbox, ticker, language chip, embed slot) has `retrievalEligible: false` with a
  reason; the set is pinned in `semantic_validate.py` and `verify_all.py`.
* Tokens: a node may carry catalog token ids only (`TOKEN_*` rules); the catalog is derived from the token files and
  checked against a fresh derivation on every run.
* Provenance (`source`) is separate from taxonomy (`semantic`); `verify_all.py` re-reads each cited range and checks the
  cited tag is inside it.

## Visual parity (measured, with limits)

`extraction/parity/parity_sections.mjs` compared the clone with the live site at 1440x900 on 2026-11-03: 104 routes, 751
sections, mean section score 0.993, 743 sections at or above the 0.80 gate and **8 below it** (listed in
`extraction/measured-values.json` under `sectionParity.sectionsBelowGate`; the worst is `content.stat-intro` on
`/deployment` at 0.568). Page heights agree within 1px on 104 routes at three widths. Visual parity was **not** re-measured
in the 1.0.0 packaging pass and cannot be re-checked offline without a live capture.

## Honest caveats

* Status is `design-review-pending`. No human has reviewed any pinned pattern, whitelist entry, classification or
  contract. Where this repo says "reviewed", it means **agent attestation, not a human sign-off**.
* Generated-mode leakage detection is string-based: regular expressions and exact strings over text folded for
  full-width letters, zero-width characters, curly quotes and a small table of look-alike letters. Paraphrased source
  claims, look-alikes outside that table, text inside images and brand imitation that shares no string are not detected.
  The registry (`schema/source-brand.json`) is mined from the source and proven real by
  `extraction/build_source_brand.py`, not proven complete.
* The copy corpus lists every heading and the marketing/index paragraphs, but only the first paragraphs of articles
  and headings of legal documents; deeper body text is covered by the shingle check only where it appears there.
* The SaaS classification is moderate-confidence (no pricing or self-serve surface); see `policy/design-policy.json`.
* The citation check proves a cited range exists and, for section sources, that the tag is inside it; it cannot prove a
  prose claim describes that code.
* Heights were measured from the clone (which matched the live page heights within 1px when parity was measured), not
  from the live site. They were re-measured at 1440px on 2026-11-04 from a production build of the clean-installed clone
  with `extraction/measure_sections.mjs`: all 104 routes and 933 boxes matched the recorded values (largest delta 0px).
* Live quirks kept on purpose are listed in `extraction/measured-values.json` (`notes.liveBugsKeptOnPurpose`). The
  job application form content could not be captured from the live site (third-party iframe).
* IR is not part of this repository's tooling and was left untouched by request.

## Delivery

The package is plain files. Install the clone's dependencies from its lockfile (`npm ci`), never ship `node_modules`.
A zip, if one is made, is built last with the `zip` CLI, kept out of git (`.gitignore` lists `design-repo.zip`) and
checked with `unzip -l design-repo.zip | grep -ic "__MACOSX\|\.DS_Store"` printing `0`.
