#!/usr/bin/env python3
"""Semantic validator for PageSpecs: everything Draft-07 JSON Schema cannot express.

    python3 schema/semantic_validate.py <pagespec.json> [...]      # schema layer + semantic layer
    python3 schema/semantic_validate.py --semantic-only <file>      # semantic layer only

Importable:
    validate(spec)        -> (errors, warnings); each a list of (code, message)
    validate_schema(spec) -> list of Draft-07 messages (needs the `jsonschema` package)

Rule families
  TEMPLATE_*            nodes are matched against the declared template's REAL node list (fixed nodes,
                        slots with min/max, variants), never validated in isolation
  ROUTE_TEMPLATE_MISMATCH  a reference page must use a served route mapped to its template
  graph rules           ids in GRAPH_RULE_IDS == ids in compatibility/graph.json (verify_all checks)
  ONE_PER_PAGE / MAX_PER_PAGE, VARIANT_UNKNOWN, THEME_UNSUPPORTED, MOTION_PATTERN, MOTION_FALLBACK,
  MAX_WORDS, ASSET_ROLE_SLOT, OVERLAY_NOT_ALLOWED, RETRIEVAL_PIN
  TOKEN_*               token policy (unknown id, raw colour, raw spacing, unsupported font, wrong
                        category for the field, invalid theme/token combination)
  GENERATED_MODE_*      mode=generated may not carry source identity or content:
                        BRAND, CUSTOMER, CTA, COPY, URL, STORE, ASSET, PERSON, RATING, STAT, BRAND_MISSING
Pins (independent of the JSON registries, so editing a registry alone cannot loosen them):
  PINNED_AVAILABILITY, PINNED_POLICY, RETRIEVAL_INELIGIBLE, RUNTIME_UI_PATTERN.
Standard library only, except the optional schema layer.
"""
import json, os, re, sys, unicodedata
sys.dont_write_bytecode = True
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)

# ---- pins ------------------------------------------------------------------------------------
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
# compliance-critical roles pinned to one specific generationPolicy value (not just enum membership)
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
# runtime / utility UI: never retrieval-eligible
RETRIEVAL_INELIGIBLE = {
    "utility.announcement-ticker", "overlay.mega-menu", "overlay.mobile-menu-drawer", "overlay.video-lightbox",
    "utility.cookie-consent", "utility.language-chip", "utility.cookie-settings-trigger", "utility.third-party-embed-slot",
}
# any contract whose id or title looks like runtime UI must be in RETRIEVAL_INELIGIBLE
RUNTIME_UI_PATTERN = re.compile(r"cookie|consent|modal|dialog|drawer|overlay|lightbox|preloader|cursor|ticker|toast|mega-menu|language|embed", re.I)
GRAPH_RULE_IDS = {
    "HEADER_FIRST", "FOOTER_LAST", "ONE_HERO", "HERO_OPENS_PAGE", "NO_CONSECUTIVE_DIVIDERS", "CLOSING_CTA_BEFORE_FOOTER",
    "PRODUCT_CROSS_SELL_ONCE", "INELIGIBLE_ONLY_AS_OVERLAY", "NO_ADJACENT_SAME_CATEGORY", "MOTION_LOOP_BUDGET",
}
ADJACENT_OK_CATEGORIES = {"FEATURES", "EDITORIAL", "CONTENT", "STRUCTURE", "TESTIMONIAL"}
ADJACENT_OK_PAIRS = {("conversion.apply-contact", "conversion.closing-cta"), ("social-proof.logo-grid", "social-proof.case-study-carousel")}
LOOP_PATTERNS = {"video-loop", "lattice-loop", "globe-autorotate", "gradient-blob-spin", "canvas-shader-loop"}
FOOTERS = {"shell.site-footer", "shell.campaign-footer"}
CLOSERS = {"conversion.closing-cta", "conversion.team-closer"}
EMBED_EXCEPTION = ("embed-shell", "utility.third-party-embed-slot")
PLACEHOLDER_SCHEMES = ("generated://", "placeholder://", "user-supplied://")
RESERVED_TLDS = (".example", ".invalid")
RAW_COLOR = re.compile(r"^\s*(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|(white|black|red|blue|green|gray|grey|orange|transparent)\s*$)", re.I)
RAW_SPACING = re.compile(r"^\s*-?\d+(\.\d+)?\s*(px|rem|em|%|vh|vw|pt)?\s*$", re.I)

_REPO_CACHE = None


def _load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as fh:
        return json.load(fh)


def load_repo():
    global _REPO_CACHE
    if _REPO_CACHE is not None:
        return _REPO_CACHE
    secs = {}
    for name in sorted(os.listdir(os.path.join(REPO, "sections"))):
        if name.endswith(".json"):
            c = _load(f"sections/{name}")
            secs[c["id"]] = c
    brand = _load("schema/source-brand.json")["sourceBrand"]
    corpus = _load("schema/reference-copy-corpus.json")
    norm_corpus = {_norm(s) for s in corpus["strings"]}
    shingles = set()
    k = corpus.get("shingleWords", 7)
    for s in corpus["strings"]:
        w = _words(s)
        for i in range(0, max(0, len(w) - k + 1)):
            shingles.add(" ".join(w[i:i + k]))
    roles = {r["id"]: r for r in _load("assets/asset-roles.json")["roles"]}
    _REPO_CACHE = {
        "sections": secs,
        "templates": _load("templates/templates.json")["templates"],
        "routes": _load("templates/routes.json")["routes"],
        "graph": _load("compatibility/graph.json"),
        "roles": roles,
        "brand": brand,
        "corpus": norm_corpus,
        "shingles": shingles,
        "shingleWords": k,
        "catalog": _load("tokens/llm/token-catalog.json"),
        "policy": _load("tokens/llm/token-policy.json"),
    }
    return _REPO_CACHE


def _norm(s):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", s)).strip().lower()


def _words(s):
    return re.findall(r"[a-z0-9$%.']+", _norm(s))


def word_count(s):
    return len(s.split())


def registry_problems(repo=None):
    """Registry-vs-pin drift: these are errors for every spec (a loosened registry cannot pass)."""
    repo = repo or load_repo()
    out = []
    for rid, role in repo["roles"].items():
        if rid not in PINNED_AVAILABILITY:
            out.append(("ASSET_ROLE_UNPINNED", f"asset role {rid} has no PINNED_AVAILABILITY entry"))
        elif role.get("availability") != PINNED_AVAILABILITY[rid]:
            out.append(("ASSET_AVAILABILITY_PIN", f"{rid}: registry availability {role.get('availability')!r} != pinned {PINNED_AVAILABILITY[rid]!r}"))
        if rid in PINNED_POLICY and role.get("generationPolicy") != PINNED_POLICY[rid]:
            out.append(("ASSET_POLICY_PIN", f"{rid}: registry generationPolicy {role.get('generationPolicy')!r} != pinned {PINNED_POLICY[rid]!r}"))
        if role.get("availability") != "generation-safe" and not role.get("generationSafeSubstitutes"):
            out.append(("ASSET_SUBSTITUTE_MISSING", f"{rid}: non-generation-safe role without generationSafeSubstitutes"))
        if role.get("availability") == "generation-safe" and rid.startswith("logo.source"):
            out.append(("ASSET_AVAILABILITY_PIN", f"{rid}: a source wordmark can never be generation-safe"))
    for rid in PINNED_AVAILABILITY:
        if rid not in repo["roles"]:
            out.append(("ASSET_ROLE_MISSING", f"pinned role {rid} missing from assets/asset-roles.json"))
    for sid, c in repo["sections"].items():
        pinned_off = sid in RETRIEVAL_INELIGIBLE
        if c.get("retrievalEligible") is not (not pinned_off):
            out.append(("RETRIEVAL_PIN", f"contract {sid}: retrievalEligible={c.get('retrievalEligible')} contradicts the pin"))
        if (RUNTIME_UI_PATTERN.search(sid) or RUNTIME_UI_PATTERN.search(c.get("title", ""))) and not pinned_off:
            out.append(("RETRIEVAL_PIN", f"contract {sid} looks like runtime UI but is not in RETRIEVAL_INELIGIBLE"))
        for r in c.get("generatedAssetRoles", []):
            if PINNED_AVAILABILITY.get(r) != "generation-safe":
                out.append(("ASSET_GENERATED_ROLE", f"contract {sid}: generatedAssetRoles lists non-generation-safe role {r}"))
    for sid in RETRIEVAL_INELIGIBLE:
        if sid not in repo["sections"]:
            out.append(("RETRIEVAL_PIN", f"pinned ineligible section {sid} has no contract"))
    return out


# ---- content walk ----------------------------------------------------------------------------
def _walk(schema, value, path, acc):
    if schema is None:
        return
    ref = schema.get("$ref")
    if ref == "#/definitions/media":
        acc["media"].append((path, value, schema.get("x-assetRoles", [])))
        if isinstance(value, dict) and isinstance(value.get("alt"), str):
            acc["strings"].append((path + ".alt", value["alt"], None))
        return
    if ref == "#/definitions/cta":
        if isinstance(value, dict):
            acc["ctas"].append((path, value))
            if isinstance(value.get("label"), str):
                acc["strings"].append((path + ".label", value["label"], 6))
        return
    if ref == "#/definitions/person":
        if isinstance(value, dict):
            acc["persons"].append((path, value))
            for f, mw in (("name", 8), ("role", 14)):
                if isinstance(value.get(f), str):
                    acc["strings"].append((f"{path}.{f}", value[f], mw))
            if "photo" in value:
                acc["media"].append((path + ".photo", value["photo"], ["photo.real-person", "avatar.fictional"]))
        return
    t = schema.get("type")
    if t == "object" and isinstance(value, dict):
        props = schema.get("properties", {})
        for k, v in value.items():
            _walk(props.get(k), v, f"{path}.{k}", acc)
        return
    if t == "array" and isinstance(value, list):
        for i, v in enumerate(value):
            _walk(schema.get("items"), v, f"{path}[{i}]", acc)
        return
    if t == "string" and isinstance(value, str):
        acc["strings"].append((path, value, schema.get("maxWords")))


def collect(contract, node, base):
    acc = {"strings": [], "media": [], "ctas": [], "persons": []}
    _walk(contract["content"], node.get("content", {}), base + ".content", acc)
    return acc


# ---- template matching -----------------------------------------------------------------------
def match_template(tpl, nodes, errors):
    i = 0
    n = len(nodes)
    for tn in tpl["nodes"]:
        if "slot" in tn:
            count = 0
            while i < n and nodes[i].get("section") in tn["allowed"]:
                i += 1
                count += 1
            if count < tn["min"] or count > tn["max"]:
                errors.append(("TEMPLATE_SLOT_COUNT", f"template {tpl['id']} slot '{tn['slot']}' holds {count} nodes; allowed {tn['min']}..{tn['max']}"))
            continue
        sid = tn["section"]
        if i < n and nodes[i].get("section") == sid:
            first = True
            while i < n and nodes[i].get("section") == sid and (first or tn.get("repeatable")):
                v = nodes[i].get("variant")
                if tn.get("variants") and v not in tn["variants"]:
                    errors.append(("TEMPLATE_VARIANT", f"nodes[{i}] {sid}: variant {v!r} not allowed by template {tpl['id']} ({tn['variants']})"))
                i += 1
                first = False
        elif tn.get("required"):
            got = nodes[i].get("section") if i < n else "end of page"
            errors.append(("TEMPLATE_MISSING_REQUIRED", f"template {tpl['id']} requires {sid} at this position; found {got}"))
    while i < n:
        errors.append(("TEMPLATE_UNEXPECTED_NODE", f"nodes[{i}] {nodes[i].get('section')} is not part of template {tpl['id']} at this position"))
        i += 1


# ---- token policy ----------------------------------------------------------------------------
def check_tokens(node, contract, path, repo, errors):
    toks = node.get("tokens")
    if not toks:
        return
    cat = repo["catalog"]["tokens"]
    pol = repo["policy"]
    theme = node.get("theme") or contract["themes"][0]
    for field, val in toks.items():
        rule = pol["nodeTokenFields"].get(field)
        if not isinstance(val, str):
            errors.append(("TOKEN_UNKNOWN", f"{path}.tokens.{field}: not a token id"))
            continue
        if RAW_COLOR.search(val):
            errors.append(("TOKEN_RAW_COLOR", f"{path}.tokens.{field}: raw colour {val!r}; use a semantic colour token"))
            continue
        if RAW_SPACING.search(val):
            errors.append(("TOKEN_RAW_SPACING", f"{path}.tokens.{field}: raw value {val!r}; use a spacing role token"))
            continue
        if field == "fontFamily" and val not in rule.get("allowed", []):
            errors.append(("TOKEN_FONT_UNSUPPORTED", f"{path}.tokens.fontFamily: {val!r} is not an approved family {rule['allowed']}"))
            continue
        if val not in cat:
            errors.append(("TOKEN_UNKNOWN", f"{path}.tokens.{field}: {val!r} is not in tokens/llm/token-catalog.json"))
            continue
        if rule is None:
            errors.append(("TOKEN_FIELD_CATEGORY", f"{path}.tokens.{field}: field not governed by token-policy"))
            continue
        if cat[val]["category"] not in rule["categories"] or ("prefix" in rule and not val.startswith(rule["prefix"])):
            errors.append(("TOKEN_FIELD_CATEGORY", f"{path}.tokens.{field}: {val} ({cat[val]['category']}) is not allowed for {field}"))
            continue
        combos = pol["themeCombinations"].get(theme, {})
        if field in combos and val not in combos[field]:
            errors.append(("TOKEN_THEME_MISMATCH", f"{path}.tokens.{field}: {val} is not valid on a {theme} node"))


# ---- generated-mode leakage ------------------------------------------------------------------
def _rx(p):
    return re.compile(p["regex"], re.I if "i" in p.get("flags", "") else 0)


def _href_ok_generated(href):
    if href.startswith(("/", "#", "?")) and not href.startswith("//"):
        return True
    if href.startswith("mailto:"):
        return href.lower().split("@")[-1].endswith(RESERVED_TLDS)
    if href.startswith(PLACEHOLDER_SCHEMES):
        return True
    host = (urlparse(href).hostname or "").lower()
    return bool(host) and host.endswith(RESERVED_TLDS)


def generated_checks(spec, items, repo, errors):
    b = repo["brand"]
    brand_rx = [(_rx(p), p["id"]) for p in b["patterns"]]
    cta_rx = [(_rx(p), p["id"]) for p in b["ctaPatterns"] if "regex" in p]
    cta_exact = {_norm(x) for p in b["ctaPatterns"] for x in p.get("exact", [])}
    url_rx = [(_rx(p), p["id"], p.get("rule", "GENERATED_MODE_URL")) for p in b["urlPatterns"]]
    store_rx = [(_rx(p), p["id"]) for p in b["storePatterns"]]
    rating_rx = [(_rx(p), p["id"]) for p in b["ratingPatterns"]]
    stats = [s.lower() for p in b["statPatterns"] for s in p["exact"]]
    people = [x.lower() for x in b["people"]]
    customers = [re.compile(r"\b" + re.escape(x) + r"\b", 0) for x in b["customerAndPartnerNames"]]

    if not (spec.get("brand") or {}).get("name"):
        errors.append(("GENERATED_MODE_BRAND_MISSING", "mode=generated requires brand.name (a fictional or user-supplied brand)"))
    strings = list(items["strings"])
    strings.append(("meta.title", spec.get("meta", {}).get("title", ""), None))
    strings.append(("meta.description", spec.get("meta", {}).get("description", ""), None))
    if spec.get("brand"):
        strings.append(("brand.name", spec["brand"].get("name", ""), None))
    for path, s, _ in strings:
        if not s:
            continue
        for rx, pid in brand_rx:
            if rx.search(s):
                errors.append(("GENERATED_MODE_BRAND", f"{path}: source brand pattern '{pid}' in {s[:80]!r}"))
                break
        for rx in customers:
            if rx.search(s):
                errors.append(("GENERATED_MODE_CUSTOMER", f"{path}: real customer/partner name {rx.pattern!r} in {s[:80]!r}"))
                break
        low = s.lower()
        for name in people:
            if name in low:
                errors.append(("GENERATED_MODE_PERSON", f"{path}: real person {name!r}"))
        for rx, pid in rating_rx:
            if rx.search(s):
                errors.append(("GENERATED_MODE_RATING", f"{path}: rating/review claim ({pid}) in {s[:80]!r}"))
                break
        for st in stats:
            if st in low:
                errors.append(("GENERATED_MODE_STAT", f"{path}: source statistic {st!r}"))
        for rx, pid in store_rx:
            if rx.search(s):
                errors.append(("GENERATED_MODE_STORE", f"{path}: store mark/link ({pid})"))
                break
        n = _norm(s)
        w = _words(s)
        k = repo["shingleWords"]
        if len(w) >= 3 and n in repo["corpus"]:
            errors.append(("GENERATED_MODE_COPY", f"{path}: verbatim source copy {s[:80]!r}"))
        elif len(w) >= k and any(" ".join(w[i:i + k]) in repo["shingles"] for i in range(len(w) - k + 1)):
            errors.append(("GENERATED_MODE_COPY", f"{path}: shares a {k}-word run with source copy {s[:80]!r}"))
    for path, cta in items["ctas"]:
        label = cta.get("label", "")
        if _norm(label) in cta_exact or any(rx.search(label) for rx, _ in cta_rx):
            errors.append(("GENERATED_MODE_CTA", f"{path}.label: source CTA {label!r}"))
        href = cta.get("href", "")
        hit = False
        for rx, pid, rule in url_rx:
            if rx.search(href):
                errors.append((rule if rule != "GENERATED_MODE_ASSET" else "GENERATED_MODE_URL", f"{path}.href: source URL/endpoint ({pid}) {href!r}"))
                hit = True
                break
        for rx, pid in store_rx:
            if rx.search(href):
                errors.append(("GENERATED_MODE_STORE", f"{path}.href: store link ({pid}) {href!r}"))
                hit = True
                break
        if not hit and not _href_ok_generated(href):
            errors.append(("GENERATED_MODE_URL", f"{path}.href: {href!r} is not a relative path or a reserved .example/.invalid URL"))
    for path, person in items["persons"]:
        if person.get("identityRole") != "person.fictional":
            errors.append(("GENERATED_MODE_PERSON", f"{path}: identityRole must be person.fictional in generated mode"))
    medias = list(items["media"])
    if (spec.get("brand") or {}).get("mark"):
        medias.append(("brand.mark", spec["brand"]["mark"], ["brand-mark.generated", "brand-mark.user-supplied"]))
    for path, m, _ in medias:
        if not isinstance(m, dict):
            continue
        src = m.get("src", "")
        if src:
            if any(rx.search(src) for rx, _, _ in url_rx) or any(rx.search(src) for rx, _ in store_rx):
                errors.append(("GENERATED_MODE_ASSET", f"{path}.src: source asset/URL {src!r}"))
            elif not (src.startswith(PLACEHOLDER_SCHEMES) or (urlparse(src).hostname or "").endswith(RESERVED_TLDS)):
                errors.append(("GENERATED_MODE_ASSET", f"{path}.src: generated media must use generated://, placeholder://, user-supplied:// or a reserved .example/.invalid host; got {src!r}"))


# ---- main ------------------------------------------------------------------------------------
def validate(spec):
    repo = load_repo()
    errors, warnings = [], []
    errors += registry_problems(repo)
    secs, tpls = repo["sections"], repo["templates"]
    severity = {r["id"]: r["severity"] for r in repo["graph"]["rules"]}

    def graph(code, msg):
        (errors if severity.get(code, "error") == "error" else warnings).append((code, msg))

    mode = spec.get("mode")
    if mode not in ("reference", "generated"):
        errors.append(("MODE_INVALID", f"mode must be reference|generated, got {mode!r}"))
    tid = spec.get("template")
    tpl = tpls.get(tid)
    if not tpl:
        errors.append(("TEMPLATE_UNKNOWN", f"unknown template {tid!r}"))
        return errors, warnings
    nodes = spec.get("nodes") or []
    overlays = spec.get("overlays") or []

    route = spec.get("route")
    served = {r["path"]: r["template"] for r in repo["routes"]}
    if mode == "reference" and served.get(route) != tid:
        errors.append(("ROUTE_TEMPLATE_MISMATCH", f"reference route {route!r} is mapped to {served.get(route)!r}, not {tid!r}"))

    match_template(tpl, nodes, errors)

    all_items = {"strings": [], "media": [], "ctas": [], "persons": []}
    counts = {}
    for idx, node in enumerate(nodes + overlays):
        is_overlay = idx >= len(nodes)
        path = f"overlays[{idx - len(nodes)}]" if is_overlay else f"nodes[{idx}]"
        sid = node.get("section")
        c = secs.get(sid)
        if not c:
            errors.append(("SECTION_UNKNOWN", f"{path}: unknown section {sid!r}"))
            continue
        counts[sid] = counts.get(sid, 0) + 1
        if is_overlay and sid not in tpl["overlays"]:
            errors.append(("OVERLAY_NOT_ALLOWED", f"{path}: {sid} is not an allowed overlay of template {tid}"))
        pinned_eligible = sid not in RETRIEVAL_INELIGIBLE
        if "retrievalEligible" in node and node["retrievalEligible"] is not pinned_eligible:
            errors.append(("RETRIEVAL_PIN", f"{path}: {sid} retrievalEligible={node['retrievalEligible']} contradicts the pin ({pinned_eligible})"))
        if not pinned_eligible and not is_overlay and (tid, sid) != EMBED_EXCEPTION:
            graph("INELIGIBLE_ONLY_AS_OVERLAY", f"{path}: retrieval-ineligible {sid} may only appear in overlays[]")
        v = node.get("variant")
        if c.get("variants"):
            if v not in c["variants"]:
                errors.append(("VARIANT_UNKNOWN", f"{path}: variant {v!r} not in {c['variants']}"))
        elif v is not None:
            errors.append(("VARIANT_UNKNOWN", f"{path}: {sid} has no variants"))
        if node.get("theme") and node["theme"] not in c["themes"]:
            errors.append(("THEME_UNSUPPORTED", f"{path}: theme {node['theme']!r} not in {c['themes']}"))
        mo = node.get("motion") or {}
        if mo.get("pattern") not in c["motion"]["allowedPatterns"]:
            errors.append(("MOTION_PATTERN", f"{path}: motion.pattern {mo.get('pattern')!r} not allowed for {sid} ({c['motion']['allowedPatterns']})"))
        if mo.get("reducedMotionFallback") != c["motion"]["reducedMotionFallback"]:
            errors.append(("MOTION_FALLBACK", f"{path}: reducedMotionFallback must be {c['motion']['reducedMotionFallback']!r}"))
        check_tokens(node, c, path, repo, errors)
        items = collect(c, node, path)
        for p, s, mw in items["strings"]:
            if mw and word_count(s) > mw:
                errors.append(("MAX_WORDS", f"{p}: {word_count(s)} words > maxWords {mw}"))
        for p, m, allowed in items["media"]:
            role = m.get("assetRole") if isinstance(m, dict) else None
            if role not in allowed:
                errors.append(("ASSET_ROLE_SLOT", f"{p}: assetRole {role!r} not allowed in this slot ({allowed})"))
            if mode == "generated":
                if PINNED_AVAILABILITY.get(role) != "generation-safe":
                    errors.append(("GENERATED_MODE_ASSET", f"{p}: assetRole {role!r} is {PINNED_AVAILABILITY.get(role)} (pinned), not generation-safe"))
                elif role not in c["generatedAssetRoles"]:
                    errors.append(("GENERATED_MODE_ASSET", f"{p}: assetRole {role!r} not in {sid}.generatedAssetRoles"))
        for k in all_items:
            all_items[k] += items[k]

    # contract constraints
    for sid, n in counts.items():
        cons = secs[sid].get("constraints", {})
        if cons.get("onePerPage") and n > 1:
            errors.append(("ONE_PER_PAGE", f"{sid} appears {n} times; onePerPage"))
        if cons.get("maxPerPage") and n > cons["maxPerPage"]:
            errors.append(("MAX_PER_PAGE", f"{sid} appears {n} times; maxPerPage {cons['maxPerPage']}"))

    # graph rules
    ids = [x.get("section") for x in nodes]
    cats = [secs[s]["semantic"]["category"] if s in secs else None for s in ids]
    if "shell.site-header" in ids and ids[0] != "shell.site-header":
        graph("HEADER_FIRST", "shell.site-header must be the first node")
    for f in FOOTERS:
        if f in ids and ids[-1] != f:
            graph("FOOTER_LAST", f"{f} must be the last node")
    heroes = [i for i, c in enumerate(cats) if c == "HERO"]
    if len(heroes) > 1 or (heroes and not tpl.get("hasHero")):
        graph("ONE_HERO", f"{len(heroes)} HERO nodes on template {tid} (hasHero={tpl.get('hasHero')})")
    if heroes:
        expected = 1 if ids and ids[0] == "shell.site-header" else 0
        if heroes[0] != expected:
            graph("HERO_OPENS_PAGE", f"HERO node at position {heroes[0]}, expected {expected}")
    for i, s in enumerate(ids):
        if s == "structure.hairline-divider":
            if i > 0 and ids[i - 1] == "structure.hairline-divider":
                graph("NO_CONSECUTIVE_DIVIDERS", f"nodes[{i}]: divider directly after a divider")
            if i > 0 and ids[i - 1] == "shell.site-header":
                graph("NO_CONSECUTIVE_DIVIDERS", f"nodes[{i}]: divider directly after the header")
        if s in CLOSERS and (i + 1 >= len(ids) or ids[i + 1] not in FOOTERS):
            graph("CLOSING_CTA_BEFORE_FOOTER", f"nodes[{i}]: {s} must be immediately followed by the site footer")
    if tid == "product" and ids.count("features.product-cross-sell") != 1:
        graph("PRODUCT_CROSS_SELL_ONCE", f"product page has {ids.count('features.product-cross-sell')} features.product-cross-sell nodes; exactly 1 required")
    for i in range(1, len(ids)):
        if cats[i] and cats[i] == cats[i - 1] and cats[i] not in ADJACENT_OK_CATEGORIES and cats[i] != "SHELL" and (ids[i - 1], ids[i]) not in ADJACENT_OK_PAIRS:
            graph("NO_ADJACENT_SAME_CATEGORY", f"nodes[{i - 1}..{i}] both {cats[i]} ({ids[i - 1]}, {ids[i]})")
    loops = [n for n in nodes if (n.get("motion") or {}).get("pattern") in LOOP_PATTERNS]
    if len(loops) > 3:
        graph("MOTION_LOOP_BUDGET", f"{len(loops)} continuously looping nodes (> 3)")

    if mode == "generated":
        generated_checks(spec, all_items, repo, errors)
    return errors, warnings


def validate_schema(spec):
    try:
        import jsonschema
    except ImportError:
        return ["SCHEMA_LAYER_SKIPPED: python package 'jsonschema' not installed"]
    schema = _load("schema/pagespec.schema.json")
    v = jsonschema.Draft7Validator(schema)
    return [f"{'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message[:200]}" for e in sorted(v.iter_errors(spec), key=lambda e: list(map(str, e.absolute_path)))]


def main(argv):
    semantic_only = "--semantic-only" in argv
    files = [a for a in argv if not a.startswith("--")]
    if not files:
        print(__doc__)
        return 2
    bad = 0
    for f in files:
        with open(f, encoding="utf-8") as fh:
            spec = json.load(fh)
        schema_errs = [] if semantic_only else validate_schema(spec)
        errs, warns = validate(spec)
        real_schema = [e for e in schema_errs if not e.startswith("SCHEMA_LAYER_SKIPPED")]
        status = "OK" if not errs and not real_schema else "FAIL"
        print(f"{status}  {f}  mode={spec.get('mode')} template={spec.get('template')}  schema_errors={len(real_schema)} semantic_errors={len(errs)} warnings={len(warns)}")
        for e in schema_errs:
            print(f"   schema: {e}")
        for code, msg in errs:
            print(f"   ERROR {code}: {msg}")
        for code, msg in warns:
            print(f"   warn  {code}: {msg}")
        bad += status != "OK"
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
