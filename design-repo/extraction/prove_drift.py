#!/usr/bin/env python3
"""Prove extraction/verify_all.py actually catches drift: one injected defect per check, pin and gate.

For each case this copies design-repo/ into a fresh scratch directory, injects ONE defect, runs verify_all.py there and
requires (a) a non-zero exit and (b) a FAIL line from the targeted check (kind "fail"), or exit 0 plus a WARN line from
the targeted check (kind "warn": the standalone-copy behaviour). Then it requires the unmodified repo to pass, and a
standalone copy (design-repo/ alone in an empty directory) to pass with its source-dependent checks reported as warnings.

Source-dependent cases (citation ranges, section source tags, route coverage against src/ and ia.json, the source-brand
evidence, the package stack) run against a scratch directory whose entries are symlinks to the real source project
beside design-repo/. When this folder was copied on its own there is no such project: those cases print SKIP and are
not counted as passed or failed.

    python3 extraction/prove_drift.py [--scratch DIR]      (exit 1 if any defect goes undetected)

--scratch DIR keeps the scratch copies under DIR (default: a new OS temp directory, removed afterwards).
Needs the `jsonschema` package (verify_all.py does).
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
PROJECT = os.path.dirname(REPO)
HAVE_SOURCE = os.path.isdir(os.path.join(PROJECT, "src"))
ENV = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")


# ------------------------------------------------------------------ mutation helpers
def jedit(rel, fn):
    def apply(root):
        p = os.path.join(root, rel)
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
        fn(d)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(d, f, indent=2, ensure_ascii=False)
            f.write("\n")
    return apply


def changelog_top_version(new_version):
    """Rewrite the top '## x.y.z' heading of CHANGELOG.md, whatever the current version is."""
    def apply(root):
        import re
        p = os.path.join(root, "CHANGELOG.md")
        with open(p, encoding="utf-8") as f:
            s = f.read()
        s2, n = re.subn(r"^##\s+\[?\d+\.\d+\.\d+\]?", "## " + new_version, s, count=1, flags=re.M)
        assert n == 1, "no version heading in CHANGELOG.md"
        with open(p, "w", encoding="utf-8") as f:
            f.write(s2)
    return apply


def tedit(rel, old, new, count=1):
    def apply(root):
        p = os.path.join(root, rel)
        with open(p, encoding="utf-8") as f:
            s = f.read()
        assert old in s, (rel, old)
        with open(p, "w", encoding="utf-8") as f:
            f.write(s.replace(old, new, count))
    return apply


def append_text(rel, extra):
    def apply(root):
        with open(os.path.join(root, rel), "a", encoding="utf-8") as f:
            f.write(extra)
    return apply


def write_file(rel, text):
    def apply(root):
        p = os.path.join(root, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            f.write(text)
    return apply


def both(*fns):
    def apply(root):
        for f in fns:
            f(root)
    return apply


def heights(fn):
    return jedit("extraction/measured-values.json", lambda d: fn(d["sectionHeights"]))


def grow(route, sid, new):
    def fn(h):
        r = h["routes"][route]
        s = next(x for x in r["sections"] if x["section"] == sid)
        r["pageHeightPx"] += new - s["heightPx"]
        s["heightPx"] = new
        s["visibleHeightPx"] = new
    return heights(fn)


WL_ENTRY = {"route": "/", "section": "hero.video-statement", "rules": ["HERO_HEIGHT_FAIL"], "maxHeightPx": 3200, "reviewedBy": "probe (agent attestation, not a human sign-off)",
            "attestation": "agent", "reviewedOn": "2026-11-04"}
# built by concatenation so this file does not contain the literals verify_all.py forbids
MAC, LIN, WIN = "/" + "Users/probe/project", "/" + "home/probe/project", "C:" + "\\Users\\probe\\project"
PIN_LINE = '    "logo.source-wordmark": "reference-only",\n'
POLICY_PIN_LINE = '    "endpoint.third-party-live": "must-not-reuse-live-endpoint",\n'
RETR_PIN = '"utility.cookie-consent", '

# (check, kind, label, mutation, needs real source)
CASES = [
    # ---- availability / pins (R3)
    ("availability-pin", "fail", "registry availability loosened (source wordmark generation-safe)", jedit("assets/asset-roles.json", lambda d: next(r for r in d["roles"] if r["id"] == "logo.source-wordmark").__setitem__("availability", "generation-safe")), False),
    ("availability-pin", "fail", "blocked customer logo moved to reference-only", jedit("assets/asset-roles.json", lambda d: next(r for r in d["roles"] if r["id"] == "logo.customer").__setitem__("availability", "reference-only")), False),
    ("availability-pin", "fail", "pin removed from semantic_validate.py only", tedit("schema/semantic_validate.py", PIN_LINE, ""), False),
    ("availability-pin", "fail", "pin removed from verify_all.py only", tedit("extraction/verify_all.py", PIN_LINE, ""), False),
    ("availability-pin", "fail", "registry + validator flipped together (verify_all literal still holds)", both(
        jedit("assets/asset-roles.json", lambda d: next(r for r in d["roles"] if r["id"] == "logo.source-wordmark").__setitem__("availability", "generation-safe")),
        tedit("schema/semantic_validate.py", '"logo.source-wordmark": "reference-only"', '"logo.source-wordmark": "generation-safe"')), False),
    ("availability-pin", "fail", "compliance role flipped to a different VALID policy", jedit("assets/asset-roles.json", lambda d: next(r for r in d["roles"] if r["id"] == "endpoint.third-party-live").__setitem__("generationPolicy", "may-generate-new")), False),
    ("availability-pin", "fail", "policy pin removed from semantic_validate.py only", tedit("schema/semantic_validate.py", POLICY_PIN_LINE, ""), False),
    ("availability-pin", "fail", "substitute list emptied", jedit("assets/asset-roles.json", lambda d: next(r for r in d["roles"] if r["id"] == "product.source-visual").__setitem__("generationSafeSubstitutes", [])), False),
    ("availability-pin", "fail", "section generatedAssetRoles lists a reference-only role", jedit("sections/hero.company.json", lambda d: d["generatedAssetRoles"].append("photo.source-scene")), False),
    ("availability-pin", "fail", "new asset role without a pin", jedit("assets/asset-roles.json", lambda d: d["roles"].append({"id": "logo.new", "availability": "generation-safe", "generationPolicy": "may-generate-new", "purpose": "probe", "evidence": ["x"]})), False),
    ("asset-roles", "fail", "schema assetRole enum drifts from the registry", jedit("schema/pagespec.schema.json", lambda d: d["definitions"]["media"]["properties"]["assetRole"]["enum"].append("stock.photo")), False),
    ("asset-roles", "fail", "reference-only role loses its licensing guidance", jedit("assets/asset-roles.json", lambda d: next(r for r in d["roles"] if r["id"] == "logo.customer").pop("licensing")), False),
    ("asset-roles", "fail", "generated example uses a reference-only role", tedit("schema/examples/generated-home.pagespec.json", '"assetRole": "video.generated-loop"', '"assetRole": "video.source-loop"'), False),
    # ---- retrieval (R8)
    ("retrieval-pin", "fail", "runtime UI contract flipped retrieval-eligible", jedit("sections/utility.cookie-consent.json", lambda d: (d.__setitem__("retrievalEligible", True), d.pop("retrievalIneligibleReason", None))), False),
    ("retrieval-pin", "fail", "contract + allowlist flipped together", both(
        jedit("sections/utility.cookie-consent.json", lambda d: (d.__setitem__("retrievalEligible", True), d.pop("retrievalIneligibleReason", None))),
        jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"]["utility.cookie-consent"].__setitem__("retrievalEligible", True))), False),
    ("retrieval-pin", "fail", "pin removed from semantic_validate.py only", tedit("schema/semantic_validate.py", RETR_PIN, ""), False),
    ("retrieval-pin", "fail", "pin removed from verify_all.py only", tedit("extraction/verify_all.py", RETR_PIN, ""), False),
    ("retrieval-pin", "fail", "content section marked ineligible", both(
        jedit("sections/features.approach-cards.json", lambda d: (d.__setitem__("retrievalEligible", False), d.__setitem__("retrievalIneligibleReason", "Pretending this content section is runtime UI."))),
        jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"]["features.approach-cards"].__setitem__("retrievalEligible", False))), False),
    ("retrieval-pin", "fail", "allowlist alone says a content section is ineligible", jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"]["features.approach-cards"].__setitem__("retrievalEligible", False)), False),
    ("section-contracts", "fail", "ineligible contract without a reason", jedit("sections/utility.cookie-consent.json", lambda d: d.pop("retrievalIneligibleReason")), False),
    # ---- wrapper gate (R9)
    ("wrapper-gate", "fail", "HERO fail threshold loosened in code", tedit("extraction/wrapper_gate.py", "HERO_FAIL_PX = 3000", "HERO_FAIL_PX = 9000"), False),
    ("wrapper-gate", "fail", "HERO warn threshold loosened in code", tedit("extraction/wrapper_gate.py", "HERO_WARN_PX = 1800", "HERO_WARN_PX = 2800"), False),
    ("wrapper-gate", "fail", "share threshold loosened in code", tedit("extraction/wrapper_gate.py", "SHARE_FAIL_PCT = 60.0", "SHARE_FAIL_PCT = 95.0"), False),
    ("wrapper-gate", "fail", "minimum-sections skip raised in code", tedit("extraction/wrapper_gate.py", "MIN_SECTIONS = 3", "MIN_SECTIONS = 30"), False),
    ("wrapper-gate", "fail", "HERO measured at 3100px", grow("/", "hero.video-statement", 3100), False),
    ("wrapper-gate", "fail", "whole-page legal section re-created", heights(lambda h: (lambda r, parts: (r.__setitem__("sections", [x for x in r["sections"] if x not in parts]), r["sections"].insert(2, dict(parts[0], heightPx=sum(x["heightPx"] for x in parts), visibleHeightPx=sum(x["visibleHeightPx"] for x in parts)))))(h["routes"]["/legal/aup"], [x for x in h["routes"]["/legal/aup"]["sections"] if x["section"] == "content.legal-section"])), False),
    ("wrapper-gate", "fail", "route measurement missing", heights(lambda h: h["routes"].pop("/press")), False),
    ("wrapper-gate", "fail", "measured at the wrong viewport", heights(lambda h: h.__setitem__("viewportWidth", 1280)), False),
    ("wrapper-gate", "fail", "whitelist emptied (real exemptions removed)", jedit("extraction/wrapper-whitelist.json", lambda d: d.__setitem__("entries", [])), False),
    ("wrapper-gate", "fail", "whitelist entry without justification", both(grow("/", "hero.video-statement", 3100), jedit("extraction/wrapper-whitelist.json", lambda d: d["entries"].append(dict(WL_ENTRY, justification="tall")))), False),
    ("wrapper-gate", "fail", "whitelist agent entry without the attestation phrase", jedit("extraction/wrapper-whitelist.json", lambda d: d["entries"][0].__setitem__("reviewedBy", "Claude")), False),
    ("wrapper-gate", "fail", "stale whitelist entry", jedit("extraction/wrapper-whitelist.json", lambda d: d["entries"].append(dict(WL_ENTRY, justification="Probe entry for a hero that is not actually tall."))), False),
    ("manifest-counts", "fail", "measured route count hand-bumped", jedit("registry.manifest.json", lambda d: d["counts"].__setitem__("measuredRoutes", 99)), False),
    # ---- token catalog / policy (R10)
    ("token-catalog", "fail", "token file edited without rebuilding the catalog", jedit("tokens/00-foundation/color.json", lambda d: d["tokens"]["color.black"].__setitem__("value", "#010101")), False),
    ("token-catalog", "fail", "catalog hand-edited", jedit("tokens/llm/token-catalog.json", lambda d: d["tokens"]["color.black"].__setitem__("value", "#020202")), False),
    ("token-catalog", "fail", "catalog entry removed", jedit("tokens/llm/token-catalog.json", lambda d: d["tokens"].pop("color.white")), False),
    ("token-policy", "fail", "policy category is not a real catalog key", jedit("tokens/llm/token-policy.json", lambda d: d["rawValueRestrictions"].__setitem__("typography", "x")), False),
    ("token-policy", "fail", "policy allows a font that is not in the catalog", jedit("tokens/llm/token-policy.json", lambda d: d["nodeTokenFields"]["fontFamily"]["allowed"].append("font.family.comic")), False),
    ("token-policy", "fail", "policy claims a rule the validator never raises", jedit("tokens/llm/token-policy.json", lambda d: d["enforcedRules"].append("TOKEN_BOGUS")), False),
    ("token-policy", "fail", "theme file drifts from the foundation value", jedit("tokens/themes/light.json", lambda d: d["resolved"]["color.surface.page"].__setitem__("value", "#fefefe")), False),
    ("token-policy", "fail", "primitive references an unknown token", jedit("primitives/arrow-icon.json", lambda d: d["tokens"].append("color.neon")), False),
    # ---- generated-mode registry and validator (R2)
    ("generated-mode-registry", "fail", "brand pattern removed from the registry", jedit("schema/source-brand.json", lambda d: d["sourceBrand"]["patterns"].pop(3)), False),
    ("generated-mode-registry", "fail", "source domain pattern removed", jedit("schema/source-brand.json", lambda d: d["sourceBrand"]["urlPatterns"].pop(0)), False),
    ("generated-mode-registry", "fail", "one person removed (still above the minimum; evidence digest stale)", jedit("schema/source-brand.json", lambda d: d["sourceBrand"]["people"].pop()), False),
    ("generated-mode-registry", "fail", "copy corpus truncated", jedit("schema/reference-copy-corpus.json", lambda d: d.__setitem__("strings", d["strings"][:50])), False),
    ("generated-mode-registry", "fail", "evidence file out of date against the real source", jedit("extraction/source-brand-evidence.json", lambda d: d["items"][0].__setitem__("hits", d["items"][0]["hits"] + 1)), True),
    ("generated-mode-canaries", "fail", "validator stops enforcing generated mode", tedit("schema/semantic_validate.py", '    if mode == "generated":\n        generated_checks(spec, all_items, repo, errors)', "    if False:\n        generated_checks(spec, all_items, repo, errors)"), False),
    ("generated-mode-canaries", "fail", "evasion folding disabled", tedit("schema/semantic_validate.py", 'return _INVISIBLE.sub("", unicodedata.normalize("NFKC", s)).translate(_FOLD_TABLE)', "return s"), False),
    ("generated-mode-canaries", "fail", "customer check disabled", tedit("schema/semantic_validate.py", 'errors.append(("GENERATED_MODE_CUSTOMER"', 'pass  # errors.append(("GENERATED_MODE_CUSTOMER"'), False),
    ("generated-mode-canaries", "fail", "source CTA rule disabled", tedit("schema/semantic_validate.py", 'errors.append(("GENERATED_MODE_CTA"', 'pass  # errors.append(("GENERATED_MODE_CTA"'), False),
    ("semantic-example", "fail", "generated example leaks the source brand", tedit("schema/examples/generated-home.pagespec.json", '"title": "Halcyon Grid', '"title": "Wonderful Grid', 1), False),
    ("semantic-example", "fail", "generated example of a family removed", both(lambda r: os.remove(os.path.join(r, "schema/examples/generated-legal-document.pagespec.json"))), False),
    ("semantic-example", "fail", "reference example relabelled generated", jedit("schema/example.pagespec.json", lambda d: d.__setitem__("mode", "generated")), False),
    ("controls-pass", "fail", "contract variant no longer matches its template", jedit("sections/social-proof.logo-grid.json", lambda d: d.__setitem__("variants", ["strip", "wide"])), False),
    ("controls-pass", "fail", "contract example budget broken (required field removed from the schema layer)", jedit("sections/hero.video-statement.json", lambda d: d["content"]["required"].append("nonexistent")), False),
    # ---- structure
    ("allowlist-parity", "fail", "phantom allowlist entry", jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"].__setitem__("features.ticker", dict(d["sections"]["content.essay-split"]))), False),
    ("allowlist-parity", "fail", "orphan contract with no allowlist entry", write_file("primitives/divider.json", json.dumps({"id": "primitive.divider", "kind": "primitive", "tokens": []})), False),
    ("allowlist-parity", "fail", "allowlist field drifts from the contract", jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"]["hero.company"].__setitem__("themes", ["dark"])), False),
    ("allowlist-parity", "fail", "settableNodeProps drift", jedit("tokens/llm/component-allowlist.json", lambda d: d["settableNodeProps"].append("style")), False),
    ("schema-draft07", "fail", "mode dropped from required", jedit("schema/pagespec.schema.json", lambda d: d["required"].remove("mode")), False),
    ("schema-draft07", "fail", "mode enum opened up", jedit("schema/pagespec.schema.json", lambda d: d["properties"]["mode"]["enum"].append("clone")), False),
    ("schema-draft07", "fail", "motion definition reopened", jedit("schema/pagespec.schema.json", lambda d: d["definitions"]["motion"].__setitem__("additionalProperties", True)), False),
    ("schema-draft07", "fail", "node retrievalEligible no longer a boolean", jedit("schema/pagespec.schema.json", lambda d: d["definitions"]["node"]["properties"]["retrievalEligible"].__setitem__("type", "string")), False),
    ("schema-draft07", "fail", "schema stops being valid Draft-07", jedit("schema/pagespec.schema.json", lambda d: d["definitions"]["node"].__setitem__("additionalProperties", "nope")), False),
    ("section-contracts", "fail", "closed contract schema gets an extra field", jedit("sections/hero.company.json", lambda d: d.__setitem__("aiHint", "x")), False),
    ("section-contracts", "fail", "semantic.id drifts from the contract id", jedit("sections/hero.company.json", lambda d: d["semantic"].__setitem__("id", "hero.about")), False),
    ("section-contracts", "fail", "source.id loses its provenance prefix (taxonomy id used as provenance)", jedit("sections/hero.company.json", lambda d: d["source"].__setitem__("id", "hero.company")), False),
    ("section-contracts", "fail", "hero without onePerPage", jedit("sections/hero.company.json", lambda d: d["constraints"].pop("onePerPage")), False),
    ("section-contracts", "fail", "conversion section re-classed as CONTENT", jedit("sections/conversion.closing-cta.json", lambda d: d["semantic"].__setitem__("category", "CONTENT")), False),
    ("section-contracts", "fail", "editorial section re-classed as FEATURES", jedit("sections/editorial.post-grid.json", lambda d: d["semantic"].__setitem__("category", "FEATURES")), False),
    ("graph-validator-parity", "fail", "graph rule with no enforcing code", jedit("compatibility/graph.json", lambda d: d["rules"].append({"id": "ONE_CTA_BAND", "severity": "error", "rule": "probe"})), False),
    ("graph-validator-parity", "fail", "graph rule severity outside error|warn", jedit("compatibility/graph.json", lambda d: d["rules"][0].__setitem__("severity", "fatal")), False),
    ("route-coverage", "fail", "route assigned twice", jedit("templates/routes.json", lambda d: d["routes"].append(dict(d["routes"][0], template="press"))), False),
    ("route-coverage", "fail", "template left without a route", jedit("templates/routes.json", lambda d: d["routes"].remove(next(r for r in d["routes"] if r["template"] == "press"))), False),
    ("route-coverage", "fail", "alias list drifts", jedit("templates/routes.json", lambda d: d["aliases"].pop()), False),
    ("route-coverage", "fail", "a route the clone serves is no longer mapped", both(
        jedit("templates/routes.json", lambda d: d["routes"].remove(next(r for r in d["routes"] if r["path"] == "/blog-articles/maccabi")))), True),
    ("route-coverage", "fail", "phantom route the clone does not serve", jedit("templates/routes.json", lambda d: d["routes"].append({"path": "/pricing", "template": "press", "title": "x", "mountedIn": "src/App.jsx", "chrome": "site"})), True),
    ("versions", "fail", "manifest allowlistVersion drift", jedit("registry.manifest.json", lambda d: d.__setitem__("allowlistVersion", "1.0.1")), False),
    ("versions", "fail", "manifest pageSpecVersion drift", jedit("registry.manifest.json", lambda d: d.__setitem__("pageSpecVersion", "1.1.0")), False),
    ("versions", "fail", "CHANGELOG version differs from the manifest", changelog_top_version("9.9.9"), False),
    ("versions", "fail", "productionApproved flipped to true", jedit("registry.manifest.json", lambda d: d.__setitem__("productionApproved", True)), False),
    ("manifest-counts", "fail", "hand-bumped manifest count", jedit("registry.manifest.json", lambda d: d["counts"].__setitem__("sections", 99)), False),
    ("manifest-counts", "fail", "stale README count", tedit("README.md", "| sections | 76 |", "| sections | 77 |"), False),
    ("manifest-counts", "fail", "section contract added without updating counts", write_file("primitives/probe.json", json.dumps({"id": "primitive.probe", "kind": "primitive", "tokens": []})), False),
    ("entrypoints-inside-repo", "fail", "entry point outside the package", jedit("registry.manifest.json", lambda d: d["entryPoints"].__setitem__("ia", "../ia.json")), False),
    ("entrypoints-inside-repo", "fail", "entry point that does not exist", jedit("registry.manifest.json", lambda d: d["entryPoints"].__setitem__("verifyAll", "extraction/missing.py")), False),
    ("entrypoints-inside-repo", "fail", "token catalog registration removed", jedit("registry.manifest.json", lambda d: d["entryPoints"].pop("tokenCatalog")), False),
    ("no-absolute-paths", "fail", "macOS machine path added", append_text("README.md", f"\nbuilt in {MAC}\n"), False),
    ("no-absolute-paths", "fail", "Linux machine path added", append_text("README.md", f"\nbuilt in {LIN}\n"), False),
    ("no-absolute-paths", "fail", "Windows machine path added", append_text("README.md", f"\nbuilt in {WIN}\n"), False),
    ("no-junk-files", "fail", ".DS_Store added", write_file(".DS_Store", "x"), False),
    ("no-junk-files", "fail", "bytecode directory added", write_file("schema/__pycache__/x.pyc", "x"), False),
    ("no-junk-files", "fail", "zip added", write_file("design-repo.zip", "x"), False),
    ("no-junk-files", "fail", "font file added", write_file("assets/display.woff2", "x"), False),
    ("json-parse", "fail", "broken JSON", write_file("tokens/00-foundation/broken.json", "{ not json"), False),
    ("citation-validity", "fail", "citation range past the end of the real file", tedit("extraction/measured-values.json", "../CLONE_SPEC.md:1-511", "../CLONE_SPEC.md:1-99999"), True),
    ("citation-validity", "fail", "section source range moved off its tag", jedit("sections/hero.company.json", lambda d: d["source"].__setitem__("lines", "1-3")), True),
    ("citation-validity", "fail", "citation to a file that does not exist", jedit("sections/hero.company.json", lambda d: d.__setitem__("purpose", d["purpose"] + " See src/pages/gone/Missing.jsx:3-9.")), True),
    ("citation-validity", "warn", "standalone copy: a broken citation only warns (no source tree)", tedit("extraction/measured-values.json", "../CLONE_SPEC.md:1-511", "../CLONE_SPEC.md:1-99999"), False),
    ("policy-binding", "fail", "enforced file edited without re-hashing the policy", append_text("tokens/llm/token-policy.json", "\n"), False),
    ("policy-binding", "fail", "category changed away from saas", jedit("registry.manifest.json", lambda d: d.__setitem__("category", "marketplace")), False),
    ("policy-binding", "fail", "architecture approval claimed without a human", jedit("policy/design-policy.json", lambda d: d["approval"].__setitem__("architectureDecisionRecorded", True)), False),
    ("policy-binding", "fail", "policy evidence quote no longer on its line", jedit("policy/design-policy.json", lambda d: d["classification"]["evidence"][0].__setitem__("quote", "Single-tenant only")), True),
    ("policy-binding", "fail", "counter-evidence removed", jedit("policy/design-policy.json", lambda d: d["classification"].__setitem__("counterEvidence", [])), False),
    ("source-stack", "fail", "declared framework range differs from package.json", jedit("registry.manifest.json", lambda d: d["sourceProject"]["declaredRanges"].__setitem__("react", "^19.0.0")), True),
    ("adversarial-coverage", "fail", "a validator rule loses its adversarial mutation", tedit("schema/tests/adversarial_test.py", '"TOKEN_RAW_COLOR"', '"TOKEN_RAW_COLOUR"', 99), False),
    ("adversarial-coverage", "fail", "a wrapper-gate rule loses its adversarial case", tedit("schema/tests/adversarial_test.py", '"SECTION_SHARE_WARN"', '"SECTION_SHARE_WARNING"', 99), False),
    ("docs", "fail", "README drops the agent-attestation caveat", tedit("README.md", "agent attestation, not a human sign-off", "reviewed", 99), False),
    ("docs", "fail", "CHANGELOG drops the IR statement", tedit("CHANGELOG.md", "IR left untouched", "IR notes", 99), False),
]


# ------------------------------------------------------------------ runner
def run_verify(case_dir):
    root = os.path.join(case_dir, "design-repo")
    p = subprocess.run([sys.executable, os.path.join(root, "extraction", "verify_all.py"), "--source-root", case_dir], capture_output=True, text=True, env=ENV)
    return p.returncode, p.stdout + p.stderr


def make_case(tmp, name, with_source):
    case = os.path.join(tmp, name)
    os.makedirs(case)
    if with_source:
        for entry in sorted(os.listdir(PROJECT)):
            if entry not in ("design-repo", "node_modules", ".git", "dist", "design-repo.zip"):
                os.symlink(os.path.join(PROJECT, entry), os.path.join(case, entry))
    shutil.copytree(REPO, os.path.join(case, "design-repo"), ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
    return case


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scratch", help="directory for the scratch copies (kept); default: a temp dir that is removed")
    a = ap.parse_args()
    if a.scratch:
        os.makedirs(a.scratch, exist_ok=True)
        tmp = tempfile.mkdtemp(prefix="prove-drift-", dir=a.scratch)
    else:
        tmp = tempfile.mkdtemp(prefix="prove-drift-")
    bad = skipped = total = 0
    try:
        for i, (check, kind, label, mutate, needs_source) in enumerate(CASES):
            if needs_source and not HAVE_SOURCE:
                skipped += 1
                print(f"[SKIP]   {check}: {label} (needs the real source tree beside design-repo/)")
                continue
            total += 1
            case = make_case(tmp, f"case{i:03d}", with_source=needs_source)
            mutate(os.path.join(case, "design-repo"))
            code, out = run_verify(case)
            if kind == "fail":
                line = next((ln for ln in out.splitlines() if ln.startswith(f"FAIL  [{check}]")), "")
                caught = code != 0 and bool(line)
            else:
                line = next((ln for ln in out.splitlines() if ln.startswith(f"WARN  [{check}]")), "")
                caught = code == 0 and bool(line)
            bad += not caught
            print(f"[{'CAUGHT' if caught else 'MISSED'}] {check}: {label}" + (f"\n           {line[:140]}" if caught else f" (exit {code})"))
        # clean copy (with the real source when present)
        total += 1
        case = make_case(tmp, "clean", with_source=HAVE_SOURCE)
        code, out = run_verify(case)
        ok = code == 0
        bad += not ok
        print(f"[{'PASS' if ok else 'FAIL'}] unmodified copy passes verify_all.py ({'with' if HAVE_SOURCE else 'without'} the source tree, exit {code})")
        if not ok:
            print("\n".join("         " + ln for ln in out.splitlines() if ln.startswith("FAIL")))
        # standalone copy: design-repo alone in an empty directory
        total += 1
        case = make_case(tmp, "standalone", with_source=False)
        code, out = run_verify(case)
        warned = sorted({ln.split("]")[0][7:] for ln in out.splitlines() if ln.startswith("WARN  [") and ("no source tree" in ln or "no package.json" in ln or "NOT " in ln)})
        ok = code == 0 and len(warned) >= 4
        bad += not ok
        print(f"[{'PASS' if ok else 'FAIL'}] standalone copy (empty directory, no siblings) passes with source-dependent checks skipped as warnings: {', '.join(warned)} (exit {code})")
        if code != 0:
            print("\n".join("         " + ln for ln in out.splitlines() if ln.startswith("FAIL")))
    finally:
        if not a.scratch:
            shutil.rmtree(tmp, ignore_errors=True)
    print(f"\n{total - bad}/{total} drift probes behaved as required" + (f" ({skipped} source-dependent probes skipped: no source tree beside design-repo/)" if skipped else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
