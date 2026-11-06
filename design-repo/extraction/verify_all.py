#!/usr/bin/env python3
"""Single admission command for this design-repo: repository-wide consistency checks.

    python3 extraction/verify_all.py [--source-root PATH]

Needs the `jsonschema` package (Draft-07) and Python 3.9+. Exit 1 on any FAIL; warnings never fail the run.

--source-root defaults to the parent of design-repo/ (where the clone lives at build time). Checks that re-read the
real source (citation ranges, section source tags, route coverage against src/ and ia.json, the source-brand evidence,
the stack snapshot) run when that tree is present and degrade to ONE warning each when design-repo/ was copied on its
own. Every other check is internal and always fatal.

Checks (the names are what extraction/prove_drift.py asserts on):
  json-parse               every *.json parses
  schema-draft07           both schemas are valid Draft-07; every example validates
  semantic-example         every example passes semantic_validate.py with no error or warning; a mode=generated example
                           exists for each pinned template family; the reference example stays mode=reference
  controls-pass            one synthesized PageSpec per template in BOTH modes passes (schema + semantic)
  allowlist-parity         tokens/llm/component-allowlist.json <-> contract files, field-level; settable node props
  versions                 allowlistVersion / catalogVersion / pageSpecVersion / repositoryVersion consistency
  manifest-counts          registry.manifest.json counts and the README count table are recomputed from disk
  entrypoints-inside-repo  every entry point exists inside this folder (no ../, no absolute path)
  no-absolute-paths        no macOS / Linux / Windows machine path in any text file
  no-junk-files            no OS junk, bytecode, archive, font, image or video in the package
  citation-validity        every path:line[-line] citation re-read from the real file (source tree present)
  section-contracts        closed section-contract schema, source/semantic split, source tag at the cited line
  availability-pin         PINNED_AVAILABILITY / PINNED_POLICY identical in verify_all.py and semantic_validate.py and
                           in the registry; substitutes; generatedAssetRoles derived from the pins
  retrieval-pin            RETRIEVAL_INELIGIBLE identical in both validators; contracts, allowlist, schema agree
  asset-roles              registry closure against schema enum and allowlist; every role wired
  generated-mode-registry  source-brand.json minimum + extraction/build_source_brand.py --check (source present)
  generated-mode-canaries  self-test: crafted leaks in a generated PageSpec must be rejected by the real validator
  token-catalog            tokens/llm/token-catalog.json equals a fresh extraction/token_catalog.py derivation
  token-policy             policy resolves against the real catalog; theme/semantic tokens resolve
  graph-validator-parity   compatibility/graph.json rule ids == validator rule ids; severities
  route-coverage           every served route (src/ + ia.json) mapped exactly once to a template
  wrapper-gate             extraction/wrapper_gate.py thresholds pinned and the measured heights pass
  policy-binding           category + designPolicy binding, contentHash recomputed
  adversarial-coverage     every error code the validator can raise has a mutation in schema/tests/adversarial_test.py
  docs                     README/CHANGELOG state the real version, status, counts and honest caveats

Pins live here as INDEPENDENT literals (PINNED_AVAILABILITY, PINNED_POLICY, RETRIEVAL_INELIGIBLE_PIN, the wrapper-gate
thresholds, SOURCE_BRAND_MINIMUM), so editing a registry or schema/semantic_validate.py alone cannot loosen them.
Each check is proven to catch drift by extraction/prove_drift.py.
"""
import argparse
import hashlib
import importlib.util
import json
import os
import re
import subprocess
import sys
from urllib.parse import quote, unquote

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(REPO, "schema"))
sys.path.insert(0, os.path.join(REPO, "schema", "tests"))

ERRORS, WARNINGS, PASSED, CHECKS = [], [], [], []
ARGS = None

# ------------------------------------------------------------------ independent pins
PINNED_AVAILABILITY = {
    "logo.source-wordmark": "reference-only",
    "logo.source-product-lockup": "reference-only",
    "logo.customer": "blocked-for-generation",
    "logo.investor": "blocked-for-generation",
    "logo.press-outlet": "blocked-for-generation",
    "logo.partner-crest": "blocked-for-generation",
    "photo.real-person": "blocked-for-generation",
    "person.real-identity": "blocked-for-generation",
    "photo.source-scene": "reference-only",
    "illustration.source-texture": "reference-only",
    "product.source-visual": "reference-only",
    "video.source-loop": "reference-only",
    "url.source-site": "reference-only",
    "endpoint.third-party-live": "blocked-for-generation",
    "copy.source": "reference-only",
    "rating.source-review": "blocked-for-generation",
    "brand-mark.generated": "generation-safe",
    "brand-mark.user-supplied": "generation-safe",
    "logo.fictional-company": "generation-safe",
    "avatar.fictional": "generation-safe",
    "person.fictional": "generation-safe",
    "photo.generated-scene": "generation-safe",
    "illustration.generated-abstract": "generation-safe",
    "product.generated-visual": "generation-safe",
    "video.generated-loop": "generation-safe",
    "rating.placeholder": "generation-safe",
    "url.placeholder": "generation-safe",
    "copy.original": "generation-safe",
    "icon.phosphor": "generation-safe",
    "icon.ui-glyph": "generation-safe",
}
PINNED_POLICY = {
    "logo.source-wordmark": "reference-evidence-only",
    "logo.customer": "must-not-fabricate",
    "logo.investor": "must-not-fabricate",
    "logo.press-outlet": "must-not-fabricate",
    "logo.partner-crest": "must-not-fabricate",
    "photo.real-person": "must-not-fabricate",
    "person.real-identity": "must-not-fabricate",
    "endpoint.third-party-live": "must-not-reuse-live-endpoint",
    "rating.source-review": "must-not-fabricate",
}
RETRIEVAL_INELIGIBLE_PIN = {
    "utility.announcement-ticker", "overlay.mega-menu", "overlay.mobile-menu-drawer", "overlay.video-lightbox",
    "utility.cookie-consent", "utility.language-chip", "utility.cookie-settings-trigger", "utility.third-party-embed-slot",
}
RUNTIME_UI_WORDS = ("cookie", "consent", "modal", "dialog", "drawer", "overlay", "lightbox", "preloader", "cursor", "ticker", "toast", "mega-menu", "language", "embed")
WRAPPER_THRESHOLDS = {"HERO_WARN_PX": 1800, "HERO_FAIL_PX": 3000, "SHARE_WARN_PCT": 50.0, "SHARE_FAIL_PCT": 60.0, "MIN_SECTIONS": 3, "VIEWPORT_WIDTH": 1440}
SOURCE_BRAND_MINIMUM = {
    "brandIds": {"brand-name", "brand-legal-entity", "brand-domain", "brand-products", "brand-handles"},
    "urlIds": {"url-source-domain", "url-source-cdn", "url-source-social", "url-source-endpoints"},
    "min_people": 20, "min_customers": 12, "min_cta_labels": 6, "min_stats": 8, "min_corpus_strings": 500,
}
GENERATED_FAMILIES = {"home", "blog-article", "legal-document", "industry"}
REQUIRED_ENTRYPOINTS = [
    "readme", "changelog", "schema", "example", "sectionContractSchema", "semanticValidator", "adversarialTests", "controls", "verifyAll", "driftProof",
    "wrapperGate", "wrapperGateWhitelist", "measuredValues", "measureSections", "sectionMap", "templates", "routes", "compatibilityGraph", "assetRoles",
    "tokenCatalog", "tokenCatalogBuilder", "tokenPolicy", "componentAllowlist", "motionPatterns", "sourceBrand", "sourceBrandBuilder", "sourceBrandEvidence",
    "referenceCopyCorpus", "designPolicy", "sections", "primitives", "components", "examples",
]
SAAS_POLICY = ("n0-saas-design-constraints-common", "0.1.0")
JUNK_NAMES = {".DS_Store", "Thumbs.db", "desktop.ini"}
JUNK_EXT = {".pyc", ".pyo", ".zip", ".woff", ".woff2", ".ttf", ".otf", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".webm", ".avif", ".svg", ".lottie"}
JUNK_DIRS = {"__MACOSX", "__pycache__", "node_modules", ".git"}
# built by concatenation so this file does not contain the literals it forbids
ABS_PATTERNS = [("macOS home", "/" + "Users/"), ("Linux home", "/" + "home/"), ("Windows profile", "C:" + "\\Users\\"), ("Windows profile (slash)", "C:" + "/" + "Users/"),
                ("macOS temp", "/" + "private/"), ("temp dir", "/" + "tmp/"), ("macOS var", "/" + "var/folders")]
CITE_RE = re.compile(r"(?<![\w/.-])((?:\.\./)?(?:(?:src|_source|public)/[\w./@\[\]%\-’']+?\.(?:jsx?|css|json|md|mjs|cjs|html|txt|svg)|(?:CLONE_SPEC\w*|MOTION_QA|PAGES_BRIEF|IA|README-IA)\.md|(?:tailwind|vite|postcss)\.config\.js|index\.html|ia\.json|package\.json)):(\d+)(?:-(\d+))?")


def check(name):
    def deco(fn):
        def run():
            before = len(ERRORS)
            try:
                fn()
            except Exception as ex:  # a crash is a failure, never a pass
                ERRORS.append(f"[{name}] crashed: {type(ex).__name__}: {ex}")
            if len(ERRORS) == before:
                PASSED.append(name)
        run.__name__ = name
        CHECKS.append(run)
        return fn
    return deco


def err(name, msg):
    ERRORS.append(f"[{name}] {msg}")


def warn(name, msg):
    WARNINGS.append(f"[{name}] {msg}")


def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def text(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return f.read()


def walk_files():
    for dp, dns, fs in os.walk(REPO):
        dns.sort()
        for f in sorted(fs):
            p = os.path.join(dp, f)
            yield os.path.relpath(p, REPO).replace(os.sep, "/")


def json_files():
    return [r for r in walk_files() if r.endswith(".json")]


def ids_in(folder):
    out = {}
    for f in sorted(os.listdir(os.path.join(REPO, folder))):
        if f.endswith(".json"):
            out[load(f"{folder}/{f}")["id"]] = f"{folder}/{f}"
    return out


def sections_on_disk():
    return {sid: load(p) for sid, p in ids_in("sections").items()}


def example_files():
    out = ["schema/example.pagespec.json"]
    d = os.path.join(REPO, "schema", "examples")
    if os.path.isdir(d):
        out += ["schema/examples/" + f for f in sorted(os.listdir(d)) if f.endswith(".pagespec.json")]
    return out


def source_root():
    """The source project root when it really is one (has src/), else None."""
    r = os.path.abspath(ARGS.source_root)
    return r if os.path.isdir(os.path.join(r, "src")) else None


def source_lines(rel):
    r = source_root()
    if not r:
        return None
    p = os.path.join(r, rel)
    if not os.path.isfile(p):
        return None
    with open(p, encoding="utf-8") as f:
        return f.read().split("\n")


def import_file(name, rel):
    spec = importlib.util.spec_from_file_location(name, os.path.join(REPO, rel))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def validator():
    import semantic_validate as V
    return V


def compute_counts():
    """Every number the manifest and the README table state, recomputed from disk."""
    tc = import_file("token_catalog_mod", "extraction/token_catalog.py")
    secs = sections_on_disk()
    ex = example_files()
    specs = {r: load(r) for r in ex}
    routes = load("templates/routes.json")
    heights = load("extraction/measured-values.json")["sectionHeights"]["routes"]
    cites = 0
    for rel in json_files():
        if rel.endswith("parity-results.json"):
            continue
        cites += len(CITE_RE.findall(text(rel)))
    return {
        "tokens": tc.derive()["counts"]["tokens"],
        "primitives": len(ids_in("primitives")),
        "components": len(ids_in("components")),
        "sections": len(secs),
        "composableSections": sum(1 for c in secs.values() if c["retrievalEligible"] is True),
        "runtimeUiSections": sum(1 for c in secs.values() if c["retrievalEligible"] is False),
        "templates": len(load("templates/templates.json")["templates"]),
        "routes": len(routes["routes"]),
        "routeAliases": len(routes["aliases"]),
        "assetRoles": len(load("assets/asset-roles.json")["roles"]),
        "motionPatterns": len(load("tokens/00-foundation/motion-patterns.json")["patterns"]),
        "graphRules": len(load("compatibility/graph.json")["rules"]),
        "referenceExamples": sum(1 for s in specs.values() if s.get("mode") == "reference"),
        "generatedExamples": sum(1 for s in specs.values() if s.get("mode") == "generated"),
        "measuredRoutes": len(heights),
        "measuredSectionBoxes": sum(len(r["sections"]) for r in heights.values()),
        "wrapperWhitelistEntries": len(load("extraction/wrapper-whitelist.json")["entries"]),
        "sourceBrandEvidenceItems": len(load("extraction/source-brand-evidence.json")["items"]),
        "referenceCopyStrings": len(load("schema/reference-copy-corpus.json")["strings"]),
        "citationsInJson": cites,
    }


README_ROWS = ["tokens", "primitives", "components", "sections", "templates", "routes", "assetRoles", "graphRules", "generatedExamples", "measuredRoutes"]


# ------------------------------------------------------------------ checks
@check("json-parse")
def _():
    for rel in json_files():
        try:
            load(rel)
        except Exception as ex:
            err("json-parse", f"{rel}: {ex}")


@check("schema-draft07")
def _():
    from jsonschema import Draft7Validator
    schema = load("schema/pagespec.schema.json")
    Draft7Validator.check_schema(schema)
    Draft7Validator.check_schema(load("schema/section-contract.schema.json"))
    if schema.get("$schema") != "http://json-schema.org/draft-07/schema#":
        err("schema-draft07", "pagespec.schema.json must declare Draft-07")
    for rel in example_files():
        for e in Draft7Validator(schema).iter_errors(load(rel)):
            err("schema-draft07", f"{rel}: {'/'.join(map(str, e.absolute_path))}: {e.message[:160]}")
    if schema["properties"]["mode"].get("enum") != ["reference", "generated"] or "mode" not in schema["required"]:
        err("schema-draft07", "PageSpec `mode` must be a REQUIRED closed enum ['reference', 'generated']")
    node = schema["definitions"]["node"]
    if node["properties"].get("retrievalEligible", {}).get("type") != "boolean":
        err("schema-draft07", "node.retrievalEligible must be a closed boolean")
    if schema["definitions"]["motion"].get("additionalProperties") is not False:
        err("schema-draft07", "definitions.motion must be closed (additionalProperties false)")
    sec_ids = sorted(ids_in("sections"))
    in_flow = set(node["properties"]["section"]["enum"])
    overlay = set(schema["definitions"]["overlayNode"]["properties"]["section"]["enum"])
    if sorted(in_flow | overlay) != sec_ids or (in_flow & overlay):
        err("schema-draft07", f"node/overlayNode section enums differ from sections/: {sorted((in_flow | overlay) ^ set(sec_ids))[:6]}")
    if sorted(schema["properties"]["template"]["enum"]) != sorted(load("templates/templates.json")["templates"]):
        err("schema-draft07", "schema template enum differs from templates/templates.json")


@check("semantic-example")
def _():
    V = validator()
    families = set()
    for rel in example_files():
        spec = load(rel)
        e, w = V.validate(spec)
        for x in e + w:
            err("semantic-example", f"{rel}: {x}")
        if spec.get("mode") == "generated":
            families.add(spec.get("template"))
    if load("schema/example.pagespec.json").get("mode") != "reference":
        err("semantic-example", "schema/example.pagespec.json must stay the mode 'reference' example")
    for t in sorted(GENERATED_FAMILIES - families):
        err("semantic-example", f"no generation-safe (mode generated) example for template family {t} in schema/examples/")
    ref_tpl = {load(r).get("template") for r in example_files() if load(r).get("mode") == "reference"}
    if not {"home", "blog-article"} <= ref_tpl:
        err("semantic-example", "reference examples must cover home and blog-article with real content")


@check("controls-pass")
def _():
    V = validator()
    import controls
    from jsonschema import Draft7Validator
    sv = Draft7Validator(load("schema/pagespec.schema.json"))
    for tid in sorted(V.load_repo()["templates"]):
        for mode in ("reference", "generated"):
            spec = controls.build_control(tid, mode)
            e, w = V.validate(spec)
            for x in e + w:
                err("controls-pass", f"{tid} [{mode}]: {x}")
            for se in sv.iter_errors(spec):
                err("controls-pass", f"{tid} [{mode}] schema: {se.message[:140]}")


@check("allowlist-parity")
def _():
    allow = load("tokens/llm/component-allowlist.json")
    for kind in ("sections", "primitives", "components"):
        on_disk = ids_in(kind)
        listed = allow[kind]
        listed_ids = set(listed)
        for i in sorted(listed_ids - set(on_disk)):
            err("allowlist-parity", f"phantom {kind} entry '{i}' (no contract file with that id)")
        for i in sorted(set(on_disk) - listed_ids):
            err("allowlist-parity", f"orphan {kind} contract '{i}' ({on_disk[i]}) has no allowlist entry")
    schema = load("schema/pagespec.schema.json")
    node_props = sorted(schema["definitions"]["node"]["properties"])
    if sorted(allow["settableNodeProps"]) != node_props:
        err("allowlist-parity", f"settableNodeProps {sorted(allow['settableNodeProps'])} != schema node properties {node_props}")
    for sid, c in sections_on_disk().items():
        e = allow["sections"].get(sid)
        if e is None:
            continue
        exp = {"category": c["semantic"]["category"], "retrievalEligible": c["retrievalEligible"], "variants": c.get("variants", []), "themes": c["themes"],
               "contentFields": sorted(c["content"]["properties"]), "requiredFields": c["content"]["required"], "motionPatterns": c["motion"]["allowedPatterns"],
               "generatedAssetRoles": c["generatedAssetRoles"]}
        for k, v in exp.items():
            got = e.get(k)
            if got != v and not (isinstance(v, list) and isinstance(got, list) and sorted(got) == sorted(v)):
                err("allowlist-parity", f"{sid}: allowlist {k} {got!r} differs from the contract {v!r}")


AGENT_NAME_RE = re.compile(r"\b(claude|agent|bot|gpt|llm|probe|automated|assistant|copilot|ai)\b", re.I)


def named_human(v):
    return isinstance(v, str) and len(v.strip()) >= 3 and not AGENT_NAME_RE.search(v)


@check("versions")
def _():
    man = load("registry.manifest.json")
    allow = load("tokens/llm/component-allowlist.json")
    if man.get("allowlistVersion") != allow["version"]:
        err("versions", f"manifest allowlistVersion {man.get('allowlistVersion')} != allowlist version {allow['version']}")
    if load("tokens/llm/token-policy.json")["catalogVersion"] != load("tokens/llm/token-catalog.json")["version"]:
        err("versions", "token-policy catalogVersion != token-catalog version")
    schema = load("schema/pagespec.schema.json")
    if man.get("pageSpecVersion") != schema["properties"]["pageSpecVersion"].get("const"):
        err("versions", f"manifest pageSpecVersion {man.get('pageSpecVersion')} != schema const {schema['properties']['pageSpecVersion'].get('const')}")
    for rel in example_files():
        if load(rel).get("pageSpecVersion") != man.get("pageSpecVersion"):
            err("versions", f"{rel}: pageSpecVersion differs from the manifest")
    m = re.search(r"^##\s+\[?(\d+\.\d+\.\d+)\]?", text("CHANGELOG.md"), re.M)
    if not m or m.group(1) != man.get("repositoryVersion"):
        err("versions", f"CHANGELOG top version {m.group(1) if m else None} != manifest repositoryVersion {man.get('repositoryVersion')}")
    if man.get("productionApproved") is not False:
        err("versions", "manifest productionApproved must stay false (production approval is a separate sign-off)")
    if man.get("status") != "design-reviewed" or man.get("designReviewStatus") != "design-reviewed":
        err("versions", "manifest status and designReviewStatus must both be 'design-reviewed' (owner review recorded in designReview)")
    rec = man.get("designReview")
    if not isinstance(rec, dict):
        err("versions", "manifest status 'design-reviewed' needs a designReview record {by, date, note}")
    else:
        if not named_human(rec.get("by")):
            err("versions", f"designReview.by must name a person, not an agent or tool (got {rec.get('by')!r})")
        if not isinstance(rec.get("date"), str) or not re.match(r"^\d{4}-\d{2}-\d{2}$", rec["date"]):
            err("versions", "designReview.date must be YYYY-MM-DD")
        if not isinstance(rec.get("note"), str) or len(rec["note"].strip()) < 10:
            err("versions", "designReview.note is required")
    exc_sets = {"registry.manifest.json parityGateReview": man.get("parityGateReview", {}).get("exceptions", []),
                "measured-values.json sectionParity": load("extraction/measured-values.json").get("sectionParity", {}).get("exceptions", [])}
    for where, excs in exc_sets.items():
        if not excs:
            err("versions", f"{where}: exception EXC-001 is missing")
        for ex in excs:
            if ex.get("status") != "recorded exception" or "approvedBy" in ex:
                err("versions", f"{where}: {ex.get('id')} must have status 'recorded exception' (no pending/approvedBy fields)")
            if not named_human(ex.get("reviewedBy")) or not re.match(r"^\d{4}-\d{2}-\d{2}$", str(ex.get("reviewedOn"))):
                err("versions", f"{where}: {ex.get('id')} needs reviewedBy (a named person) and reviewedOn (YYYY-MM-DD)")
    if "versionFieldNote" not in man:
        err("versions", "manifest needs a versionFieldNote saying which version fields are machine-checked")


@check("manifest-counts")
def _():
    man = load("registry.manifest.json")
    actual = compute_counts()
    for k, v in actual.items():
        if man["counts"].get(k) != v:
            err("manifest-counts", f"counts.{k} = {man['counts'].get(k)} but disk has {v}")
    for k in man["counts"]:
        if k not in actual:
            err("manifest-counts", f"counts.{k} is not recomputed by any check")
    readme = text("README.md")
    for k in README_ROWS:
        m = re.search(r"\|\s*" + k + r"\s*\|\s*(\d+)\s*\|", readme)
        if not m or int(m.group(1)) != actual[k]:
            err("manifest-counts", f"README count table row '{k}' is {m.group(1) if m else 'missing'}, disk has {actual[k]}")
    cat = load("tokens/llm/token-catalog.json")
    if cat["counts"]["tokens"] != actual["tokens"]:
        err("manifest-counts", "token-catalog counts.tokens != recomputed token count")


@check("entrypoints-inside-repo")
def _():
    man = load("registry.manifest.json")
    eps = man["entryPoints"]
    for k in REQUIRED_ENTRYPOINTS:
        if k not in eps:
            err("entrypoints-inside-repo", f"entryPoints.{k} is not registered")
    for k, p in eps.items():
        if not isinstance(p, str) or p.startswith("/") or ".." in p.split("/") or "://" in p or ":" in p[:3]:
            err("entrypoints-inside-repo", f"{k}: {p!r} points outside design-repo/")
        elif not os.path.exists(os.path.join(REPO, p)):
            err("entrypoints-inside-repo", f"{k}: '{p}' does not exist")
    for k in ("tokenCatalog", "tokenPolicy"):
        if "tokens/llm/" not in eps.get(k, ""):
            err("entrypoints-inside-repo", f"{k} must be registered under tokens/llm/")


@check("no-absolute-paths")
def _():
    for rel in walk_files():
        if os.path.splitext(rel)[1].lower() in JUNK_EXT:
            continue
        try:
            txt = text(rel)
        except UnicodeDecodeError:
            continue
        for label, pat in ABS_PATTERNS:
            if pat in txt:
                err("no-absolute-paths", f"{rel} contains an absolute machine path ({label})")


@check("no-junk-files")
def _():
    for dp, dns, fs in os.walk(REPO):
        for d in dns:
            if d in JUNK_DIRS:
                err("no-junk-files", f"junk directory {os.path.relpath(os.path.join(dp, d), REPO)}")
        for f in fs:
            if f in JUNK_NAMES or os.path.splitext(f)[1].lower() in JUNK_EXT:
                err("no-junk-files", f"junk or binary file {os.path.relpath(os.path.join(dp, f), REPO)} (fonts, images, archives and bytecode never ship here)")
    root = source_root()
    if root and os.path.isdir(os.path.join(root, ".git")):
        try:
            out = subprocess.run(["git", "-C", root, "ls-files", "*.zip", "design-repo/**/__pycache__/*", "design-repo/**/.DS_Store"], capture_output=True, text=True).stdout.split()
        except OSError:
            out = []
        for f in out:
            err("no-junk-files", f"{f} is tracked by git (archives and junk are never committed)")


def _cite_ok(rel, a, b, where, tag=None):
    lines = source_lines(rel)
    if lines is None:
        return None
    if a < 1 or b < a or b > len(lines):
        err("citation-validity", f"{where}: {rel}:{a}-{b} is outside the real file ({len(lines)} lines)")
        return False
    if tag is not None and tag not in "\n".join(lines[a - 1:b]):
        err("citation-validity", f"{where}: {tag!r} not found in {rel}:{a}-{b} (the citation drifted or describes other code)")
        return False
    return True


@check("citation-validity")
def _():
    if not source_root():
        warn("citation-validity", "no source tree beside design-repo/: citation ranges, source tags and policy evidence NOT re-read (expected for a standalone copy)")
        return
    n = 0
    for rel in json_files():
        if rel.endswith("parity-results.json"):
            continue
        for m in CITE_RE.finditer(text(rel)):
            path = m.group(1)[3:] if m.group(1).startswith("../") else m.group(1)
            a = int(m.group(2))
            b = int(m.group(3) or a)
            if source_lines(path) is None:
                err("citation-validity", f"{rel}: cited file {path} does not exist in the source tree")
                continue
            _cite_ok(path, a, b, rel)
            n += 1
    for folder in ("sections", "primitives", "components"):
        for cid, p in ids_in(folder).items():
            c = load(p)
            cites = []
            if isinstance(c.get("source"), dict):
                s = c["source"]
                cites.append((s["file"], s["lines"], s["tag"]))
                for v in (s.get("variantSources") or {}).values():
                    cites.append((v["file"], v["lines"], v["tag"]))
                for v in s.get("alsoImplementedBy") or []:
                    cites.append((v["file"], v["lines"], v["tag"]))
            for f, ln, tag in cites:
                a, b = (int(x) for x in ln.split("-"))
                _cite_ok(f, a, b, f"{p} source", tag)
                n += 1
    if n == 0:
        err("citation-validity", "no citation was checked")


@check("section-contracts")
def _():
    from jsonschema import Draft7Validator
    sv = Draft7Validator(load("schema/section-contract.schema.json"))
    V = validator()
    secs = sections_on_disk()
    tpl = load("templates/templates.json")["templates"]
    used = set()
    for t in tpl.values():
        for n in t["nodes"]:
            used.update(n["allowed"] if "slot" in n else [n["section"]])
        used.update(t.get("overlays", []))
    cats = set(load("schema/section-contract.schema.json")["properties"]["semantic"]["properties"]["category"]["enum"])
    for sid, c in secs.items():
        for e in sv.iter_errors(c):
            err("section-contracts", f"{sid}: closed contract schema: {'/'.join(map(str, e.absolute_path))}: {e.message[:140]}")
        if (c.get("semantic") or {}).get("id") != sid:
            err("section-contracts", f"{sid}: semantic.id must equal the contract id")
        if (c.get("source") or {}).get("id") == sid or not str((c.get("source") or {}).get("id", "")).startswith("src:"):
            err("section-contracts", f"{sid}: source.id must be a src: provenance id different from the contract id")
        if c["semantic"]["category"] not in cats:
            err("section-contracts", f"{sid}: semantic.category outside the closed set")
        ineligible = c["retrievalEligible"] is False
        if ineligible and len(c.get("retrievalIneligibleReason") or "") < 30:
            err("section-contracts", f"{sid}: retrievalEligible=false needs a retrievalIneligibleReason of 30+ characters")
        if not ineligible and c.get("retrievalIneligibleReason"):
            err("section-contracts", f"{sid}: eligible contract must not carry a retrievalIneligibleReason")
        if c["semantic"]["category"] == "HERO" and not c["constraints"].get("onePerPage"):
            err("section-contracts", f"{sid}: a HERO is the page-opening composition: constraints.onePerPage required")
        if c["semantic"]["category"] == "CONVERSION" and sid.split(".")[0] != "conversion":
            err("section-contracts", f"{sid}: CONVERSION-category contracts live under conversion.*")
        if sid.split(".")[0] == "conversion" and c["semantic"]["category"] != "CONVERSION":
            err("section-contracts", f"{sid}: conversion.* contracts must be CONVERSION-classed (category honesty)")
        if sid.split(".")[0] == "editorial" and c["semantic"]["category"] not in ("EDITORIAL", "MEDIA"):
            err("section-contracts", f"{sid}: editorial.* contracts must be EDITORIAL/MEDIA-classed, never FEATURES")
        if sid not in used:
            err("section-contracts", f"{sid} is used by no template")
    for tid, t in tpl.items():
        for n in t["nodes"]:
            for s in (n["allowed"] if "slot" in n else [n["section"]]):
                if s not in secs:
                    err("section-contracts", f"template {tid} references unknown section {s}")
    V.registry_problems()


@check("availability-pin")
def _():
    V = validator()
    roles = {r["id"]: r for r in load("assets/asset-roles.json")["roles"]}
    if V.PINNED_AVAILABILITY != PINNED_AVAILABILITY:
        err("availability-pin", "schema/semantic_validate.py PINNED_AVAILABILITY differs from the pin in extraction/verify_all.py")
    if V.PINNED_POLICY != PINNED_POLICY:
        err("availability-pin", "schema/semantic_validate.py PINNED_POLICY differs from the pin in extraction/verify_all.py")
    for r, want in PINNED_AVAILABILITY.items():
        if roles.get(r, {}).get("availability") != want:
            err("availability-pin", f"asset role {r} must be '{want}', registry says {roles.get(r, {}).get('availability')!r}")
    for r, want in PINNED_POLICY.items():
        if roles.get(r, {}).get("generationPolicy") != want:
            err("availability-pin", f"asset role {r} generationPolicy must be '{want}', registry says {roles.get(r, {}).get('generationPolicy')!r}")
    for r, v in roles.items():
        if r not in PINNED_AVAILABILITY:
            err("availability-pin", f"asset role {r} has no pinned availability")
        if v.get("availability") not in ("reference-only", "generation-safe", "blocked-for-generation"):
            err("availability-pin", f"{r}: availability {v.get('availability')!r} not in the closed set")
        if v.get("availability") != "generation-safe":
            subs = v.get("generationSafeSubstitutes") or []
            if not subs or any(PINNED_AVAILABILITY.get(x) != "generation-safe" for x in subs):
                err("availability-pin", f"{r}: generationSafeSubstitutes {subs} must be non-empty and generation-safe")
        if v.get("generationPolicy") == "must-reuse-exact" and r.startswith("logo.source"):
            err("availability-pin", f"{r}: a real wordmark/logo can never be must-reuse-exact")

    def field_roles(o, acc):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "x-assetRoles":
                    acc.update(v)
                else:
                    field_roles(v, acc)
            if o.get("$ref") == "#/definitions/person":
                acc.update({"avatar.fictional", "person.fictional"})
            if "identityRole" in (o.get("properties") or {}):
                acc.add("person.fictional")
        elif isinstance(o, list):
            for v in o:
                field_roles(v, acc)
    for sid, c in sections_on_disk().items():
        offered = set()
        field_roles(c["content"], offered)
        want = sorted({r for r in offered if PINNED_AVAILABILITY.get(r) == "generation-safe"} | {"copy.original", "url.placeholder"})
        if sorted(c["generatedAssetRoles"]) != want:
            err("availability-pin", f"{sid}: generatedAssetRoles {sorted(c['generatedAssetRoles'])} != generation-safe roles derived from its fields via the pins {want}")
        for s in c["assetSlots"]:
            for r in s["assetRoles"]:
                if r not in PINNED_AVAILABILITY:
                    err("availability-pin", f"{sid}: assetSlot role {r} unknown")


@check("retrieval-pin")
def _():
    V = validator()
    if set(V.RETRIEVAL_INELIGIBLE) != RETRIEVAL_INELIGIBLE_PIN:
        err("retrieval-pin", f"schema/semantic_validate.py RETRIEVAL_INELIGIBLE {sorted(V.RETRIEVAL_INELIGIBLE)} differs from the pin in extraction/verify_all.py")
    allow = load("tokens/llm/component-allowlist.json")
    for sid, c in sections_on_disk().items():
        want = sid not in RETRIEVAL_INELIGIBLE_PIN
        if c["retrievalEligible"] is not want:
            err("retrieval-pin", f"{sid}: contract retrievalEligible {c['retrievalEligible']!r}, pinned {want}")
        if allow["sections"].get(sid, {}).get("retrievalEligible") is not want:
            err("retrieval-pin", f"{sid}: allowlist retrievalEligible differs from the pin ({want})")
        if (any(w in sid for w in RUNTIME_UI_WORDS) or any(w in c.get("title", "").lower() for w in RUNTIME_UI_WORDS)) and want:
            err("retrieval-pin", f"{sid} looks like runtime/utility UI but is not pinned retrieval-ineligible")
    for sid in RETRIEVAL_INELIGIBLE_PIN:
        if sid not in ids_in("sections"):
            err("retrieval-pin", f"pinned ineligible section {sid} has no contract")


@check("asset-roles")
def _():
    doc = load("assets/asset-roles.json")
    roles = {r["id"]: r for r in doc["roles"]}
    schema = load("schema/pagespec.schema.json")
    if sorted(schema["definitions"]["media"]["properties"]["assetRole"]["enum"]) != sorted(roles):
        err("asset-roles", "schema definitions.media assetRole enum != assets/asset-roles.json roles")
    if doc["availabilityEnum"] != ["reference-only", "generation-safe", "blocked-for-generation"]:
        err("asset-roles", "availabilityEnum must be the closed three-way set")
    for rid, r in roles.items():
        if r.get("generationPolicy") not in doc["generationPolicyEnum"]:
            err("asset-roles", f"{rid}: generationPolicy {r.get('generationPolicy')!r} not in the closed set")
        if r.get("availability") != "generation-safe" and len(r.get("licensing") or "") < 30:
            err("asset-roles", f"{rid}: a reference-only / blocked role needs licensing guidance (30+ characters)")
        if not r.get("purpose") or not r.get("evidence"):
            err("asset-roles", f"{rid}: purpose and evidence are required")
    used = set()

    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "x-assetRoles":
                    used.update(v)
                else:
                    walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for c in sections_on_disk().values():
        walk(c["content"])
    if used - set(roles):
        err("asset-roles", f"section fields use roles outside the registry: {sorted(used - set(roles))}")
    for rel in example_files():
        for r in set(re.findall(r'"assetRole": "([a-z.-]+)"', text(rel))):
            if r not in roles:
                err("asset-roles", f"{rel} uses role {r} outside the registry")
    ex_roles = set()
    for rel in example_files():
        if load(rel).get("mode") == "generated":
            ex_roles |= set(re.findall(r'"assetRole": "([a-z.-]+)"', text(rel)))
    if not ex_roles or any(PINNED_AVAILABILITY.get(r) != "generation-safe" for r in ex_roles):
        err("asset-roles", f"generated examples use non generation-safe roles: {sorted(r for r in ex_roles if PINNED_AVAILABILITY.get(r) != 'generation-safe')}")


@check("generated-mode-registry")
def _():
    sb = load("schema/source-brand.json")["sourceBrand"]
    m = SOURCE_BRAND_MINIMUM
    if not m["brandIds"] <= {p["id"] for p in sb["patterns"]}:
        err("generated-mode-registry", f"sourceBrand.patterns lost pinned ids {sorted(m['brandIds'] - {p['id'] for p in sb['patterns']})}")
    if not m["urlIds"] <= {p["id"] for p in sb["urlPatterns"]}:
        err("generated-mode-registry", f"sourceBrand.urlPatterns lost pinned ids {sorted(m['urlIds'] - {p['id'] for p in sb['urlPatterns']})}")
    if not any(p["id"] == "brand-name" and re.search(p["regex"], "Wonderful") for p in sb["patterns"]):
        err("generated-mode-registry", "the brand-name pattern no longer matches the source brand")
    if len(sb["people"]) < m["min_people"] or len(sb["customerAndPartnerNames"]) < m["min_customers"]:
        err("generated-mode-registry", "people / customers fell below the pinned minimum")
    labels = [x for p in sb["ctaPatterns"] for x in p.get("exact", [])]
    stats = [x for p in sb["statPatterns"] for x in p["exact"]]
    if len(labels) < m["min_cta_labels"] or len(stats) < m["min_stats"]:
        err("generated-mode-registry", "CTA labels / statistics fell below the pinned minimum")
    if len(load("schema/reference-copy-corpus.json")["strings"]) < m["min_corpus_strings"]:
        err("generated-mode-registry", "reference-copy-corpus.json fell below the pinned minimum")
    B = import_file("build_source_brand_mod", "extraction/build_source_brand.py")
    ev = load("extraction/source-brand-evidence.json")
    if ev.get("registryDigest") != B.digest_of(sb):
        err("generated-mode-registry", "extraction/source-brand-evidence.json registryDigest != schema/source-brand.json (registry edited without re-running extraction/build_source_brand.py --write)")
    root = source_root()
    if root:
        fresh = B.derive(root)
        for pb in B.problems(fresh):
            err("generated-mode-registry", pb)
        if B.dump(fresh) != text("extraction/source-brand-evidence.json"):
            err("generated-mode-registry", "source-brand evidence is OUT OF DATE against the real source (run extraction/build_source_brand.py --write)")
    else:
        warn("generated-mode-registry", "no source tree: source-brand evidence not re-derived from src/ (registry digest and pinned minimum were checked)")


@check("generated-mode-canaries")
def _():
    import copy
    import controls
    V = validator()
    base = controls.build_control("home", "generated")
    e, _w = V.validate(base)
    if e:
        err("generated-mode-canaries", f"the clean generated control already fails: {e[:2]}")
        return
    corpus = load("schema/reference-copy-corpus.json")["strings"]
    long_copy = next(s for s in corpus if len(s.split()) >= 9)
    zw = "​"
    canaries = [
        ("brand name in copy", lambda n: n["content"].__setitem__("lead", "Wonderful builds agents"), "GENERATED_MODE_BRAND"),
        ("brand with zero-width character", lambda n: n["content"].__setitem__("lead", "Wonder" + zw + "ful builds agents"), "GENERATED_MODE_BRAND"),
        ("brand in full-width letters", lambda n: n["content"].__setitem__("lead", "Ｗｏｎｄｅｒｆｕｌ builds agents"), "GENERATED_MODE_BRAND"),
        ("source domain in copy", lambda n: n["content"].__setitem__("lead", "visit wonderful" + zw + ".ai now"), "GENERATED_MODE_BRAND"),
        ("source CTA label", lambda n: n["content"]["ctas"][0].__setitem__("label", "Explore the OS"), "GENERATED_MODE_CTA"),
        ("source URL in a CTA", lambda n: n["content"]["ctas"][0].__setitem__("href", "https://www.wonderful.ai/agents"), "GENERATED_MODE_URL"),
        ("real customer name", lambda n: n["content"].__setitem__("lead", "trusted by Telefonica every day"), "GENERATED_MODE_CUSTOMER"),
        ("real person name", lambda n: n["content"].__setitem__("lead", "said Gadi Ganon on stage"), "GENERATED_MODE_PERSON"),
        ("source statistic", lambda n: n["content"].__setitem__("lead", "raised $550M recently"), "GENERATED_MODE_STAT"),
        ("source copy, verbatim", lambda n: n["content"].__setitem__("lead", long_copy), "GENERATED_MODE_COPY"),
        ("source asset path", lambda n: n["content"]["video"].__setitem__("src", "/videos/hero.mp4"), "GENERATED_MODE_ASSET"),
        ("blocked asset role", lambda n: n["content"]["video"].__setitem__("assetRole", "video.source-loop"), "GENERATED_MODE_ASSET"),
        ("store mark", lambda n: n["content"].__setitem__("lead", "Download on the App Store"), "GENERATED_MODE_STORE"),
        ("rating claim", lambda n: n["content"].__setitem__("lead", "rated 4.8/5 by reviewers"), "GENERATED_MODE_RATING"),
    ]
    for label, mutate, code in canaries:
        spec = copy.deepcopy(base)
        mutate(next(n for n in spec["nodes"] if n["section"] == "hero.video-statement"))
        errs, _ = V.validate(spec)
        if code not in {c for c, _m in errs}:
            err("generated-mode-canaries", f"canary '{label}' was NOT rejected with {code} (got {sorted({c for c, _m in errs})}): the validator no longer enforces generated mode")
    ref = copy.deepcopy(base)
    ref["mode"] = "reference"
    ref["route"] = "/"
    next(n for n in ref["nodes"] if n["section"] == "hero.video-statement")["content"]["lead"] = "Wonderful builds agents"
    errs, _ = V.validate(ref)
    if any(c.startswith("GENERATED_MODE_") for c, _m in errs):
        err("generated-mode-canaries", "reference mode must accept source identity (control): generated-mode rules fired in mode=reference")


@check("token-catalog")
def _():
    tc = import_file("token_catalog_mod2", "extraction/token_catalog.py")
    derived = tc.derive()
    onfile = load("tokens/llm/token-catalog.json")
    if derived != onfile:
        diff = sorted(set(derived["tokens"]) ^ set(onfile["tokens"]))[:5]
        changed = [k for k in derived["tokens"] if k in onfile["tokens"] and derived["tokens"][k] != onfile["tokens"][k]][:5]
        err("token-catalog", f"tokens/llm/token-catalog.json differs from a fresh extraction/token_catalog.py derivation (rebuild with --write); id diff {diff}, value diff {changed}, digest {derived['sourceDigest'][:12]} vs {onfile.get('sourceDigest', '')[:12]}")
    man = load("registry.manifest.json")
    if man["counts"].get("tokens") != derived["counts"]["tokens"]:
        err("token-catalog", "manifest token count differs from the derived catalog")


@check("token-policy")
def _():
    V = validator()
    cat = load("tokens/llm/token-catalog.json")
    pol = load("tokens/llm/token-policy.json")
    tokens, cats = cat["tokens"], cat["categories"]
    for k in pol["rawValueRestrictions"]:
        if k not in cats:
            err("token-policy", f"rawValueRestrictions key '{k}' is not a real catalog category")
    for field, rule in pol["nodeTokenFields"].items():
        for c in rule["categories"]:
            if c not in cats:
                err("token-policy", f"nodeTokenFields.{field}: category {c} is not in the catalog")
            elif "prefix" in rule and not any(t.startswith(rule["prefix"]) for t in cats[c]):
                err("token-policy", f"nodeTokenFields.{field}: prefix {rule['prefix']} matches no {c} token")
        for t in rule.get("allowed", []):
            if t not in tokens:
                err("token-policy", f"nodeTokenFields.{field}: allowed token {t} is not in the catalog")
    for theme, combos in pol["themeCombinations"].items():
        if theme == "evidence":
            continue
        for field, ids in combos.items():
            for t in ids:
                if t not in tokens:
                    err("token-policy", f"themeCombinations.{theme}.{field}: {t} is not in the catalog")
    for t in pol["restrictedTokens"]:
        if t not in tokens:
            err("token-policy", f"restrictedTokens: {t} is not in the catalog")
    src = open(V.__file__, encoding="utf-8").read()
    for rule in pol["enforcedRules"]:
        if f'"{rule}"' not in src:
            err("token-policy", f"enforcedRules lists {rule}, which semantic_validate.py never raises")
    for t in pol["themeCombinations"]["light"]["surface"] + pol["themeCombinations"]["dark"]["surface"]:
        if tokens.get(t, {}).get("category") != "semanticColor":
            err("token-policy", f"{t} is not a semantic colour token")
    # semantic tokens resolve per theme to real foundation tokens whose literal value the theme file records
    sem = load("tokens/10-semantic/semantic.json")["tokens"]
    for theme in ("light", "dark"):
        resolved = load(f"tokens/themes/{theme}.json")["resolved"]
        if set(resolved) != set(sem):
            err("token-policy", f"themes/{theme}.json does not resolve exactly the semantic tokens: {sorted(set(resolved) ^ set(sem))[:4]}")
        for tid, modes in sem.items():
            fid = modes[theme]
            if fid not in tokens:
                err("token-policy", f"semantic {tid} [{theme}] -> unknown foundation token {fid}")
            elif resolved.get(tid) != {"token": fid, "value": tokens[fid]["value"]}:
                err("token-policy", f"themes/{theme}.json[{tid}] = {resolved.get(tid)!r}, resolves to {fid} = {tokens[fid]['value']!r}")
    for tid, t in load("tokens/20-component/component.json")["tokens"].items():
        if "ref" in t and t["ref"] not in tokens:
            err("token-policy", f"{tid} refs unknown token {t['ref']}")
    for folder in ("primitives", "components"):
        for cid, p in ids_in(folder).items():
            for t in load(p).get("tokens", []):
                if t not in tokens:
                    err("token-policy", f"{p} references unknown token '{t}'")
    for sid, c in sections_on_disk().items():
        pb = (c.get("responsive") or {}).get("primaryBreakpoint")
        if pb and pb not in tokens:
            err("token-policy", f"{sid}: responsive.primaryBreakpoint {pb} is not a catalog token")
    mp = {p["id"]: p for p in load("tokens/00-foundation/motion-patterns.json")["patterns"]}
    schema_patterns = load("schema/pagespec.schema.json")["definitions"]["motion"]["properties"]["pattern"]["enum"]
    if sorted(schema_patterns) != sorted(mp):
        err("token-policy", "schema motion.pattern enum != tokens/00-foundation/motion-patterns.json patterns")
    for sid, c in sections_on_disk().items():
        for p in c["motion"]["allowedPatterns"]:
            if p not in mp:
                err("token-policy", f"{sid}: motion pattern {p} is not in motion-patterns.json")


@check("graph-validator-parity")
def _():
    V = validator()
    g = load("compatibility/graph.json")
    graph_ids = {r["id"] for r in g["rules"]}
    if graph_ids != set(V.GRAPH_RULE_IDS):
        err("graph-validator-parity", f"graph-only {sorted(graph_ids - set(V.GRAPH_RULE_IDS))}, validator-only {sorted(set(V.GRAPH_RULE_IDS) - graph_ids)}")
    src = open(V.__file__, encoding="utf-8").read()
    for r in g["rules"]:
        if r["severity"] not in ("error", "warn"):
            err("graph-validator-parity", f"{r['id']}: severity {r['severity']!r}")
        if f'"{r["id"]}"' not in src.split("def validate(spec)")[1]:
            err("graph-validator-parity", f"graph rule {r['id']} is never raised by validate()")
    tpl = load("templates/templates.json")["templates"]
    for tid, t in tpl.items():
        if t.get("hasHero") is False and any(load(p)["semantic"]["category"] == "HERO" for s in [n.get("section") for n in t["nodes"] if "section" in n] for p in [ids_in("sections").get(s)] if p):
            err("graph-validator-parity", f"template {tid} has hasHero=false but lists a HERO section")


def _lit_list(src, name):
    m = re.search(r"const " + name + r"\s*=\s*\[([^\]]*)\]", src)
    return re.findall(r"'([^']+)'", m.group(1)) if m else []


def _js_keys(src, name, indent):
    i = src.index("export const " + name + " = {")
    return re.findall(r"^" + " " * indent + r"""(?:["']([^"']+)["']|([A-Za-z0-9_-]+)): [\{\[]""", src[i:], re.M)


@check("route-coverage")
def _():
    tpl = load("templates/templates.json")["templates"]
    doc = load("templates/routes.json")
    routes = doc["routes"]
    seen = {}
    for r in routes:
        if r["path"] in seen:
            err("route-coverage", f"route {r['path']} is assigned twice")
        seen[r["path"]] = r["template"]
        if r["template"] not in tpl:
            err("route-coverage", f"route {r['path']} -> unknown template {r['template']}")
        if not r["path"].startswith("/"):
            err("route-coverage", f"route {r['path']} must start with /")
    for tid in tpl:
        if tid not in set(seen.values()):
            err("route-coverage", f"template {tid} has no route")
    enc = lambda p: quote(p, safe="-_.!~*'();/?:@&=+$,#")  # noqa: E731  (JS encodeURI)
    want_alias = {enc(p): p for p in seen if enc(p) != p}
    got_alias = {a["alias"]: a["path"] for a in doc["aliases"]}
    if want_alias != got_alias:
        err("route-coverage", f"aliases differ from the percent-encoded duplicates of the routes: {sorted(set(want_alias) ^ set(got_alias))[:3]}")
    root = source_root()
    if not root:
        warn("route-coverage", "no source tree: routes were NOT compared with src/routes, src/App.jsx and ia.json (the internal mapping checks ran)")
        return
    # ia.json
    with open(os.path.join(root, "ia.json"), encoding="utf-8") as f:
        ia = json.load(f)
    ia_routes = {unquote(x) for t in ia["templates"] for x in t["routes"]}
    if ia_routes != set(seen):
        err("route-coverage", f"routes.json differs from ia.json: only-ia {sorted(ia_routes - set(seen))[:3]}, only-routes {sorted(set(seen) - ia_routes)[:3]}")
    # sitemap
    with open(os.path.join(root, "_source", "routes.txt"), encoding="utf-8") as f:
        sitemap = {unquote(re.sub(r"^https?://[^/]+", "", ln.strip())) or "/" for ln in f if ln.strip()}
    extra_ok = {"/fcb/x/thank-you"}
    if sitemap - set(seen):
        err("route-coverage", f"sitemap routes with no mapping: {sorted(sitemap - set(seen))[:3]}")
    if set(seen) - sitemap - extra_ok:
        err("route-coverage", f"routes.json routes in neither the sitemap nor the documented extras: {sorted(set(seen) - sitemap - extra_ok)[:3]}")
    # src: static literals + data-driven families
    files = ["src/App.jsx"] + sorted("src/routes/" + f for f in os.listdir(os.path.join(root, "src", "routes")) if f.endswith(".jsx"))
    served = {"/"}
    prefixes = set()
    for rel in files:
        src = "\n".join(source_lines(rel) or [])
        served |= set(re.findall(r"path:\s*'(/[^']*)'", src))
        prefixes |= set(re.findall(r"path:\s*`(/[^$`]*)\$\{", src))
    titles = json.load(open(os.path.join(root, "src/pages/content/data/titles.json"), encoding="utf-8"))
    ind_src = "\n".join(source_lines("src/routes/industries.jsx"))
    served |= {"/blog-articles/" + s for s in titles["articles"]}
    served |= {"/legal/" + s for s in titles["legalPages"]}
    served |= {"/industries/" + s for s in _lit_list(ind_src, "INDUSTRY_ORDER")}
    served |= {"/case-studies/" + s for s in _lit_list(ind_src, "CASE_ORDER")}
    reg = "\n".join(source_lines("src/pages/regional/countries.data.js"))
    served |= {"/" + (a or b) for a, b in _js_keys(reg, "COUNTRIES", 1)}
    fcb = "\n".join(source_lines("src/pages/regional/fcb.data.js"))
    served |= {"/fcb/x/" + (a or b) for a, b in _js_keys(fcb, "FCB_MATCHES", 2)}
    jobs = "\n".join(source_lines("src/pages/regional/jobs.data.js"))
    for a, b in _js_keys(jobs, "JOBS", 1):
        served |= {f"/ashby/{a or b}", f"/ashby/{a or b}/submit"}
    expect_prefix = {"/blog-articles/", "/legal/", "/industries/", "/case-studies/", "/", "/fcb/x/", "/ashby/"}
    if prefixes != expect_prefix:
        err("route-coverage", f"src/routes declares data-driven route families {sorted(prefixes)}, this check expands {sorted(expect_prefix)}: extend the expansion")
    if served != set(seen):
        err("route-coverage", f"routes the clone serves (src/) differ from routes.json: served-only {sorted(served - set(seen))[:3]}, mapped-only {sorted(set(seen) - served)[:3]}")
    for r in routes:
        if not os.path.isfile(os.path.join(root, r["mountedIn"])):
            err("route-coverage", f"route {r['path']}: mountedIn {r['mountedIn']} does not exist")
    for u in doc.get("unmountedButLinked", []):
        if u["path"] in served:
            err("route-coverage", f"{u['path']} is listed as unmounted but the clone serves it")


@check("wrapper-gate")
def _():
    WG = import_file("wrapper_gate_mod", "extraction/wrapper_gate.py")
    for k, v in WRAPPER_THRESHOLDS.items():
        if getattr(WG, k, None) != v:
            err("wrapper-gate", f"extraction/wrapper_gate.py {k} = {getattr(WG, k, None)!r}, pinned {v!r}")
    if getattr(WG, "WHITELISTABLE", None) != {"HERO_HEIGHT_FAIL", "SECTION_SHARE_FAIL"}:
        err("wrapper-gate", "only the two *_FAIL rules may be whitelisted")
    errs, warns, _info = WG.evaluate(*WG.load_inputs(REPO))
    for c, msg in errs:
        err("wrapper-gate", f"{c}: {msg}")
    for c, msg in warns:
        warn("wrapper-gate", f"{c}: {msg}")
    sm = load("extraction/section-map.json")
    if sm["viewport"]["width"] != 1440:
        err("wrapper-gate", "extraction/section-map.json must measure at 1440px")


def policy_hash(files):
    h = hashlib.sha256()
    for rel in sorted(files):
        with open(os.path.join(REPO, rel), "rb") as f:
            h.update(rel.encode() + b"\0" + f.read() + b"\0")
    return "sha256:" + h.hexdigest()


@check("policy-binding")
def _():
    m = load("registry.manifest.json")
    dp = m.get("designPolicy")
    if m.get("category") != "saas":
        err("policy-binding", f"manifest category {m.get('category')!r} != 'saas' (decision and counter-evidence in policy/design-policy.json)")
    if not dp:
        err("policy-binding", "manifest has no designPolicy binding")
        return
    if (dp.get("policyId"), dp.get("policyVersion")) != SAAS_POLICY:
        err("policy-binding", f"designPolicy binds {dp.get('policyId')}@{dp.get('policyVersion')}, expected {SAAS_POLICY[0]}@{SAAS_POLICY[1]}")
    if dp.get("commonIrVersion") != "0.5" or dp.get("enforcementMode") != "hard-and-soft":
        err("policy-binding", "designPolicy commonIrVersion must be 0.5 and enforcementMode hard-and-soft")
    ref = dp.get("ref", "")
    if not os.path.isfile(os.path.join(REPO, ref)):
        err("policy-binding", f"designPolicy.ref {ref} does not exist")
        return
    pol = load(ref)
    if (pol.get("policyId"), pol.get("policyVersion"), pol.get("commonIrVersion")) != (SAAS_POLICY[0], SAAS_POLICY[1], "0.5"):
        err("policy-binding", f"{ref} policyId / version / commonIrVersion disagree with the manifest binding")
    cl = pol.get("classification", {})
    if cl.get("isSaaS") is not True or not cl.get("evidence") or not cl.get("counterEvidence") or not cl.get("decision"):
        err("policy-binding", f"{ref}: classification needs isSaaS true, a decision, evidence and counterEvidence")
    for e in cl.get("evidence", []) + cl.get("counterEvidence", []):
        f, _, ln = e["ref"].rpartition(":")
        lines = source_lines(f)
        if lines is None:
            continue
        if not ln.isdigit() or not (1 <= int(ln) <= len(lines)):
            err("policy-binding", f"{ref}: evidence {e['ref']} does not resolve")
        elif e.get("quote") and e["quote"] not in lines[int(ln) - 1]:
            err("policy-binding", f"{ref}: evidence {e['ref']} does not contain {e['quote']!r}")
    if not source_root():
        warn("policy-binding", "no source tree: policy classification evidence NOT re-read")
    files = pol.get("enforcedBy", [])
    missing = [f for f in files if not os.path.isfile(os.path.join(REPO, f))]
    for f in missing:
        err("policy-binding", f"{ref}: enforcedBy {f} does not exist")
    if not missing:
        want = policy_hash(files)
        if dp.get("contentHash") != want:
            err("policy-binding", f"designPolicy.contentHash {dp.get('contentHash')} != recomputed {want}")
    if pol.get("approval", {}).get("architectureDecisionRecorded") is not False:
        err("policy-binding", f"{ref}: approval.architectureDecisionRecorded must stay false until a human records it")


@check("source-stack")
def _():
    sp = load("registry.manifest.json")["sourceProject"]
    pkg = None
    root = source_root()
    if root and os.path.isfile(os.path.join(root, "package.json")):
        with open(os.path.join(root, "package.json"), encoding="utf-8") as f:
            pkg = json.load(f)
    if pkg is None:
        warn("source-stack", "no package.json beside design-repo/: declared stack ranges NOT re-diffed")
        return
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    for k, v in sp["declaredRanges"].items():
        if deps.get(k) != v:
            err("source-stack", f"manifest declares {k} {v} but package.json has {deps.get(k)}")
    for k, v in sp["declaredRanges"].items():
        major = re.sub(r"^\D*(\d+).*$", r"\1", v)
        if k in ("react", "vite", "tailwindcss", "react-router-dom") and f"{k if k != 'react-router-dom' else 'react-router'} {major}" not in sp["stack"].replace("react-router-dom", "react-router").replace("Vite", "vite").replace("Tailwind", "tailwindcss").replace("React", "react"):
            err("source-stack", f"manifest stack text does not state {k} major {major}")


@check("adversarial-coverage")
def _():
    V = validator()
    src = open(V.__file__, encoding="utf-8").read()
    adv = text("schema/tests/adversarial_test.py")
    codes = set(re.findall(r'\(\s*"([A-Z][A-Z_]{3,})"\s*,\s*f?["\']', src)) | set(re.findall(r'graph\(\s*"([A-Z_]+)"', src)) | set(V.GRAPH_RULE_IDS)
    codes -= {"SCHEMA_LAYER_SKIPPED"}
    for c in sorted(codes):
        if f'"{c}"' not in adv:
            err("adversarial-coverage", f"{c} can be raised by semantic_validate.py but has no mutation in schema/tests/adversarial_test.py")
    gate = text("extraction/wrapper_gate.py")
    for c in sorted(set(re.findall(r'"((?:HERO|SECTION|MEASUREMENT|WHITELIST)_[A-Z_]+)"', gate))):
        if f'"{c}"' not in adv:
            err("adversarial-coverage", f"wrapper gate rule {c} has no adversarial case")


@check("docs")
def _():
    man = load("registry.manifest.json")
    readme, log = text("README.md"), text("CHANGELOG.md")
    if man["repositoryVersion"] not in readme:
        err("docs", "README does not state the repository version")
    for phrase in ("design-reviewed", "reviewed by the repository owner", "not production-approved", "string-based", "visual parity"):
        if phrase not in readme.lower() and phrase not in readme:
            err("docs", f"README must state {phrase!r}")
    for stale in ("design-review-" + "pending", "pending " + "human", "no " + "human has reviewed"):
        if stale in readme.lower() or stale in log.split("\n## ")[1].lower():
            err("docs", f"README / current CHANGELOG entry still carries the stale pending-review wording {stale!r}")
    if "IR left untouched" not in log:
        err("docs", "CHANGELOG must record 'IR left untouched by request'")
    if man.get("designReview", {}).get("date", "?") not in readme:
        err("docs", "README must state the owner review date recorded in designReview")
    if not re.search(r"^##\s+1\.0\.2\b", log, re.M) and man["repositoryVersion"] == "1.0.2":
        err("docs", "CHANGELOG has no 1.0.2 entry")
    if os.path.isdir(os.path.join(REPO, "..", "ir")) and "ir" in man.get("entryPoints", {}):
        err("docs", "this design-repo must not register an IR entry point")


def main():
    for run in CHECKS:
        run()
    for p in PASSED:
        print(f"PASS  {p}")
    for w in WARNINGS:
        print(f"WARN  {w}")
    for e in ERRORS:
        print(f"FAIL  {e}")
    print(f"\n{len(PASSED)}/{len(CHECKS)} checks passed, {len(ERRORS)} failure(s), {len(WARNINGS)} warning(s)")
    return 1 if ERRORS else 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="design-repo admission command")
    ap.add_argument("--source-root", default=os.path.dirname(REPO), help="source project root (default: parent of design-repo/)")
    ARGS = ap.parse_args()
    sys.exit(main())
