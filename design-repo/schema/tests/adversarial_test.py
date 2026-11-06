#!/usr/bin/env python3
"""Adversarial suite: every rule must reject a crafted bad instance; every control must pass.

    python3 schema/tests/adversarial_test.py        (exit 1 on any failure; needs the `jsonschema` package)

Controls (must be accepted with zero errors and zero warnings)
  * schema/example.pagespec.json and every schema/examples/*.pagespec.json (real reference content, generation-safe
    generated examples)
  * one synthesized PageSpec per template in BOTH modes (schema/tests/controls.py builds them from the repo itself,
    so a new template or section is covered automatically)
  * a reference page carrying real source identity (reference mode must accept it)
  * a node carrying valid catalog tokens; the real wrapper-gate inputs

Mutations (each must be rejected by the named rule)
  schema layer; structure and template matching; cross-node (graph) rules; generated-mode leakage (brand / logo /
  copy / CTA / URL / store / person / customer / rating / statistic / screenshot and proprietary media / asset reuse,
  with zero-width, full-width, curly-quote and look-alike evasions); token rules (unknown, raw colour, raw spacing,
  unsupported font, wrong category, invalid theme combination); retrieval flips (node / contract / pin); registry and
  pin edits; the wrapper gate (HERO 1900 / 3100px, majority share, missing measurement, whitelist abuse).

TEST FIXTURE NOTE: a few short source strings below (marked SOURCE) exist only to prove that generated mode rejects them
and reference mode accepts them. They are test input, not design content.
"""
import copy
import glob
import importlib.util
import json
import os
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, "schema"))
sys.path.insert(0, HERE)
import semantic_validate as V  # noqa: E402
import controls as C  # noqa: E402

_spec = importlib.util.spec_from_file_location("wrapper_gate", os.path.join(REPO, "extraction", "wrapper_gate.py"))
WG = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(WG)

ZW = "​"
RESULTS = []


def jload(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def node(spec, sid):
    return next(n for n in spec["nodes"] if n["section"] == sid)


def idx(spec, sid):
    return next(i for i, n in enumerate(spec["nodes"]) if n["section"] == sid)


def record(group, label, ok, detail=""):
    RESULTS.append((group, label, ok, detail))
    print(f"[{'ok ' if ok else 'BAD'}] {group}: {label}" + (f"  ({detail})" if detail and not ok else ""))


def codes(spec):
    e, w = V.validate(spec)
    return {c for c, _ in e}, {c for c, _ in w}


def expect_error(group, label, spec, code):
    e, w = codes(spec)
    record(group, f"{label} -> {code}", code in e, f"got errors {sorted(e)} warnings {sorted(w)}")


def expect_warning(group, label, spec, code):
    e, w = codes(spec)
    record(group, f"{label} -> {code} (warn)", code in w, f"got errors {sorted(e)} warnings {sorted(w)}")


def expect_schema(group, label, spec):
    errs = [x for x in V.validate_schema(spec) if not x.startswith("SCHEMA_LAYER_SKIPPED")]
    record(group, f"{label} -> schema error", bool(errs), "schema accepted it")


def expect_clean(group, label, spec):
    e, w = V.validate(spec)
    s = [x for x in V.validate_schema(spec) if not x.startswith("SCHEMA_LAYER_SKIPPED")]
    record(group, label, not e and not w and not s, f"errors {e[:2]} warnings {w[:2]} schema {s[:2]}")


GEN = {t: C.build_control(t, "generated") for t in V.load_repo()["templates"]}
REF = {t: C.build_control(t, "reference") for t in V.load_repo()["templates"]}


def gen(t="home"):
    return copy.deepcopy(GEN[t])


def ref(t="home"):
    return copy.deepcopy(REF[t])


def hero(spec):
    return node(spec, "hero.video-statement")


# =============================================================== controls
def controls():
    g = "control"
    for rel in ["schema/example.pagespec.json"] + sorted(os.path.relpath(p, REPO) for p in glob.glob(os.path.join(REPO, "schema", "examples", "*.pagespec.json"))):
        expect_clean(g, f"bundled example {rel}", jload(rel))
    for t in sorted(GEN):
        expect_clean(g, f"synthesized {t} [reference]", REF[t])
        expect_clean(g, f"synthesized {t} [generated]", GEN[t])
    s = ref("home")
    hero(s)["content"]["lead"] = "Wonderful builds agents for Telefonica"  # SOURCE
    hero(s)["content"]["ctas"][0] = {"label": "Explore the OS", "href": "https://www.wonderful.ai/ai-os"}  # SOURCE
    e, w = V.validate(s)
    record(g, "reference mode accepts source brand, customer, CTA and URL", not [c for c, _ in e if c.startswith("GENERATED_MODE_")], str(e[:2]))
    s = gen("home")
    hero(s)["tokens"] = {"surface": "color.surface.page", "text": "color.text.primary", "paddingY": "space.section-y.md", "gap": "space.gap.md", "radius": "radius.lg", "fontFamily": "font.family.sans"}
    expect_clean(g, "node with valid catalog tokens", s)
    errs, warns, _info = WG.evaluate(*WG.load_inputs(REPO))
    record(g, "wrapper gate accepts the real measured heights", not errs, str(errs[:2]))
    record(g, "a whitelisted hit still warns", any(c.endswith("_WHITELISTED") for c, _ in warns), "no *_WHITELISTED warning")
    record(g, "registry matches every pin", not V.registry_problems(), str(V.registry_problems()[:2]))


# =============================================================== schema layer
def schema_layer():
    g = "schema"
    s = gen(); del s["mode"]; expect_schema(g, "mode missing", s)
    s = gen(); s["mode"] = "clone"; expect_schema(g, "mode outside the closed enum", s)
    s = gen(); s["mode"] = "clone"; expect_error(g, "mode outside the closed enum", s, "MODE_INVALID")
    s = gen(); s["template"] = "pricing"; expect_schema(g, "unknown template", s)
    s = gen(); s["template"] = "pricing"; expect_error(g, "unknown template", s, "TEMPLATE_UNKNOWN")
    s = gen(); s["extra"] = 1; expect_schema(g, "unknown top-level property", s)
    s = gen(); s["pageSpecVersion"] = "0.9.0"; expect_schema(g, "wrong pageSpecVersion", s)
    s = gen(); s["route"] = "home"; expect_schema(g, "route without leading slash", s)
    s = gen(); hero(s)["style"] = "x"; expect_schema(g, "node with an invented property", s)
    s = gen(); hero(s)["section"] = "hero.invented"; expect_schema(g, "unknown section id", s)
    s = gen(); hero(s)["section"] = "hero.invented"; expect_error(g, "unknown section id", s, "SECTION_UNKNOWN")
    s = gen(); hero(s)["motion"]["pattern"] = "wobble"; expect_schema(g, "invented motion pattern", s)
    s = gen(); hero(s)["motion"]["inventedAnimation"] = 1; expect_schema(g, "motion with an invented field", s)
    s = gen(); del hero(s)["motion"]["reducedMotionFallback"]; expect_schema(g, "motion without reducedMotionFallback", s)
    s = gen(); hero(s)["motion"]["reducedMotionFallback"] = "ignore"; expect_schema(g, "reducedMotionFallback outside the enum", s)
    s = gen(); hero(s)["content"]["extra"] = "x"; expect_schema(g, "section content with an extra field", s)
    s = gen(); del hero(s)["content"]["title"]; expect_schema(g, "section content missing a required field", s)
    s = gen(); hero(s)["content"]["video"]["assetRole"] = "video.invented"; expect_schema(g, "invented assetRole", s)
    s = gen(); hero(s)["content"]["video"]["tag"] = "x"; expect_schema(g, "media with an extra property", s)
    s = gen(); hero(s)["retrievalEligible"] = "false"; expect_schema(g, "retrievalEligible not a boolean", s)
    s = gen(); hero(s)["tokens"] = {"shadow": "elevation.card"}; expect_schema(g, "tokens with an ungoverned field", s)
    s = gen(); hero(s)["theme"] = "sepia"; expect_schema(g, "theme outside the enum", s)
    s = gen(); s["brand"]["mark"]["extra"] = 1; expect_schema(g, "brand mark with an extra property", s)
    s = gen(); s["overlays"] = [{"section": "content.prose-block", "content": {}, "motion": {"pattern": "static", "reducedMotionFallback": "none"}}]; expect_schema(g, "an in-flow section declared as an overlay", s)


# =============================================================== structure / template
def find_slot_template():
    for tid, t in V.load_repo()["templates"].items():
        for tn in t["nodes"]:
            if "slot" in tn and tn["max"] < 20:
                return tid, tn
    raise SystemExit("no finite slot in any template")


def structure():
    g = "structure"
    s = gen(); del s["nodes"][idx(s, "hero.video-statement")]; expect_error(g, "required node removed", s, "TEMPLATE_MISSING_REQUIRED")
    s = gen(); s["nodes"].insert(len(s["nodes"]) - 1, copy.deepcopy(node(s, "social-proof.logo-grid"))); expect_error(g, "non-repeatable node duplicated", s, "TEMPLATE_UNEXPECTED_NODE")
    s = gen(); s["nodes"].insert(2, copy.deepcopy(hero(s))); expect_error(g, "one-per-page section duplicated", s, "ONE_PER_PAGE")
    s = gen(); s["nodes"].insert(2, copy.deepcopy(hero(s))); expect_error(g, "hero duplicated", s, "TEMPLATE_UNEXPECTED_NODE")
    s = gen(); s["nodes"].insert(2, copy.deepcopy(hero(s))); expect_error(g, "two heroes on one page", s, "ONE_HERO")
    tid, tn = find_slot_template()
    s = gen(tid)
    body = [n for n in s["nodes"] if n["section"] in tn["allowed"]]
    for i in range(tn["max"] + 1 - len(body)):
        s["nodes"].insert(s["nodes"].index(body[-1]) + 1, copy.deepcopy(body[-1]))
    expect_error(g, f"slot '{tn['slot']}' of {tid} over its maximum", s, "TEMPLATE_SLOT_COUNT")
    s = gen("blog-article")
    ch = [n for n in s["nodes"] if n["section"] == "editorial.article-chapter"]
    for i in list(range(21)):
        s["nodes"].insert(s["nodes"].index(ch[-1]) + 1, copy.deepcopy(ch[-1]))
    expect_error(g, "more article chapters than maxPerPage", s, "MAX_PER_PAGE")
    s = gen(); node(s, "social-proof.logo-grid")["variant"] = "strip"; expect_error(g, "variant allowed by the contract but not by the template", s, "TEMPLATE_VARIANT")
    s = gen(); node(s, "social-proof.logo-grid")["variant"] = "wide"; expect_error(g, "variant unknown to the contract", s, "VARIANT_UNKNOWN")
    s = gen(); hero(s)["variant"] = "wide"; expect_error(g, "variant on a section that has none", s, "VARIANT_UNKNOWN")
    s = gen(); n = next(x for x in s["nodes"] if len(V.load_repo()["sections"][x["section"]]["themes"]) == 1)
    n["theme"] = "dark" if V.load_repo()["sections"][n["section"]]["themes"] == ["light"] else "light"
    expect_error(g, "theme the contract does not support", s, "THEME_UNSUPPORTED")
    s = gen(); hero(s)["motion"]["pattern"] = "tab-crossfade"; expect_error(g, "motion pattern not allowed for the section", s, "MOTION_PATTERN")
    s = gen(); hero(s)["motion"]["reducedMotionFallback"] = "none"; expect_error(g, "reducedMotionFallback differs from the contract", s, "MOTION_FALLBACK")
    s = ref("home"); s["route"] = "/blog"; expect_error(g, "reference page on a route mapped to another template", s, "ROUTE_TEMPLATE_MISMATCH")
    s = ref("home"); s["route"] = "/not-served"; expect_error(g, "reference page on a route the clone does not serve", s, "ROUTE_TEMPLATE_MISMATCH")
    s = gen(); hero(s)["content"]["title"] = "one two three four five six seven eight nine ten eleven twelve thirteen"; expect_error(g, "maxWords overflow on a real field", s, "MAX_WORDS")
    s = gen(); hero(s)["content"]["ctas"][0]["label"] = "one two three four five six seven"; expect_error(g, "CTA label over six words", s, "MAX_WORDS")
    s = ref("home"); hero(s)["content"]["video"]["assetRole"] = "logo.customer"; expect_error(g, "assetRole not allowed in the slot (reference mode)", s, "ASSET_ROLE_SLOT")
    s = gen(); s["overlays"] = [C.build_node("overlay.video-lightbox", None, "generated")]; expect_error(g, "overlay not allowed by the template", s, "OVERLAY_NOT_ALLOWED")
    s = gen(); s["overlays"] = [C.build_node("utility.cookie-consent", None, "generated")]
    expect_clean(g, "an allowed overlay is accepted (control)", s)
    s = gen(); node(s, "social-proof.logo-grid")["retrievalEligible"] = False; expect_error(g, "content node marked retrieval-ineligible", s, "RETRIEVAL_PIN")
    s = gen(); s["overlays"] = [C.build_node("utility.cookie-consent", None, "generated")]; s["overlays"][0]["retrievalEligible"] = True; expect_error(g, "runtime overlay flipped retrieval-eligible", s, "RETRIEVAL_PIN")


def graph_rules():
    g = "graph"
    s = gen(); s["nodes"].insert(0, s["nodes"].pop(idx(s, "shell.site-header") + 1)); expect_error(g, "header not first", s, "HEADER_FIRST")
    s = gen(); s["nodes"].insert(len(s["nodes"]) - 2, s["nodes"].pop()); expect_error(g, "footer not last", s, "FOOTER_LAST")
    s = gen(); s["nodes"].insert(idx(s, "social-proof.logo-grid"), s["nodes"].pop(idx(s, "hero.video-statement"))); expect_error(g, "hero does not open the page", s, "HERO_OPENS_PAGE")
    s = gen("blog-article"); s["nodes"].insert(1, C.build_node("hero.index-title", "press", "generated")); expect_error(g, "hero on a template without one", s, "ONE_HERO")
    s = gen(); s["nodes"].insert(3, C.build_node("structure.hairline-divider", "light", "generated")); s["nodes"].insert(3, C.build_node("structure.hairline-divider", "light", "generated"))
    expect_error(g, "two dividers in a row", s, "NO_CONSECUTIVE_DIVIDERS")
    s = gen(); s["nodes"].insert(1, C.build_node("structure.hairline-divider", "light", "generated")); expect_error(g, "divider directly after the header", s, "NO_CONSECUTIVE_DIVIDERS")
    s = gen(); s["nodes"].insert(len(s["nodes"]) - 1, C.build_node("features.approach-cards", None, "generated")); expect_error(g, "closing CTA not directly before the footer", s, "CLOSING_CTA_BEFORE_FOOTER")
    s = gen("product"); n = [i for i, x in enumerate(s["nodes"]) if x["section"] == "features.product-cross-sell"]
    if n:
        del s["nodes"][n[0]]
    else:
        s["nodes"].insert(len(s["nodes"]) - 1, C.build_node("features.product-cross-sell", None, "generated"))
        s["nodes"].insert(len(s["nodes"]) - 1, C.build_node("features.product-cross-sell", None, "generated"))
    expect_error(g, "product cross-sell count != 1", s, "PRODUCT_CROSS_SELL_ONCE")
    s = gen(); s["nodes"].insert(idx(s, "conversion.team-closer"), C.build_node("conversion.apply-contact", None, "generated")); s["nodes"].insert(idx(s, "conversion.team-closer"), C.build_node("conversion.event-registration", None, "generated"))
    expect_warning(g, "two adjacent CONVERSION sections", s, "NO_ADJACENT_SAME_CATEGORY")
    s = gen()
    for n in s["nodes"][:4]:
        n["motion"]["pattern"] = "video-loop"
    expect_warning(g, "four continuously looping nodes", s, "MOTION_LOOP_BUDGET")
    s = gen(); s["nodes"].insert(1, C.build_node("utility.announcement-ticker", None, "generated")); expect_error(g, "runtime UI placed in nodes[]", s, "INELIGIBLE_ONLY_AS_OVERLAY")


# =============================================================== generated-mode leakage
def corpus_strings():
    strings = jload("schema/reference-copy-corpus.json")["strings"]
    long_plain = next(s for s in strings if len(s.split()) >= 12 and "Wonderful" not in s and not any(ch in s for ch in "’“”"))
    curly = next(s for s in strings if "’" in s and len(s.split()) >= 12 and "Wonderful" not in s)
    return long_plain, curly


def leakage():
    g = "generated-mode"
    long_plain, curly = corpus_strings()

    def lead(text):
        s = gen(); hero(s)["content"]["lead"] = text; return s

    def cta(label=None, href=None):
        s = gen()
        if label is not None:
            hero(s)["content"]["ctas"][0]["label"] = label
        if href is not None:
            hero(s)["content"]["ctas"][0]["href"] = href
        return s
    # --- brand / logo
    expect_error(g, "source brand in copy", lead("Wonderful builds agents"), "GENERATED_MODE_BRAND")  # SOURCE
    expect_error(g, "source legal entity", lead("a product of Wonderful AI B.V."), "GENERATED_MODE_BRAND")  # SOURCE
    expect_error(g, "source product name", lead("try Wonderful AI Gateway today"), "GENERATED_MODE_BRAND")  # SOURCE
    expect_error(g, "source social handle", lead("follow wonderfulcx online"), "GENERATED_MODE_BRAND")  # SOURCE
    expect_error(g, "brand with a zero-width character", lead("Wonder" + ZW + "ful builds agents"), "GENERATED_MODE_BRAND")
    expect_error(g, "brand in full-width letters", lead("Ｗｏｎｄｅｒｆｕｌ builds agents"), "GENERATED_MODE_BRAND")
    expect_error(g, "brand with Cyrillic look-alike letters", lead("Wоndеrful builds agents"), "GENERATED_MODE_BRAND")
    expect_error(g, "source domain with a zero-width character", lead("visit wonderful" + ZW + ".ai"), "GENERATED_MODE_BRAND")
    s = gen(); s["brand"]["name"] = "Wonderful Labs"; expect_error(g, "source brand as the operator brand name", s, "GENERATED_MODE_BRAND")
    s = gen(); s["meta"]["title"] = "Wonderful pricing"; expect_error(g, "source brand in meta.title", s, "GENERATED_MODE_BRAND")
    s = gen(); s["meta"]["description"] = "by Wonderful"; expect_error(g, "source brand in meta.description", s, "GENERATED_MODE_BRAND")
    s = gen(); del s["brand"]; expect_error(g, "no operator brand", s, "GENERATED_MODE_BRAND_MISSING")
    s = gen(); hero(s)["content"]["video"]["alt"] = "Wonderful product film"; expect_error(g, "source brand in media alt text", s, "GENERATED_MODE_BRAND")
    s = gen(); s["brand"]["mark"] = {"assetRole": "logo.source-wordmark", "alt": "mark", "src": "generated://x.svg"}; expect_error(g, "source wordmark as the brand mark", s, "GENERATED_MODE_ASSET")
    s = gen(); node(s, "social-proof.logo-grid")["content"]["logos"][0]["assetRole"] = "logo.customer"; expect_error(g, "real customer logo role", s, "GENERATED_MODE_ASSET")
    s = gen(); node(s, "social-proof.logo-grid")["content"]["logos"][0]["assetRole"] = "logo.investor"; expect_error(g, "real investor logo role", s, "GENERATED_MODE_ASSET")
    # --- CTA
    expect_error(g, "source CTA label", cta(label="Explore the OS"), "GENERATED_MODE_CTA")  # SOURCE
    expect_error(g, "source CTA label, upper-cased with a zero-width character", cta(label="EXPLORE" + ZW + " THE OS"), "GENERATED_MODE_CTA")
    expect_error(g, "brand-verb CTA", cta(label="Get Wonderful"), "GENERATED_MODE_CTA")  # SOURCE
    # --- URL / endpoint / store
    expect_error(g, "source domain URL", cta(href="https://www.wonderful.ai/agents"), "GENERATED_MODE_URL")  # SOURCE
    expect_error(g, "source social profile", cta(href="https://x.com/wonderful_ai"), "GENERATED_MODE_URL")  # SOURCE
    expect_error(g, "third-party live endpoint", cta(href="https://jobs.ashbyhq.com/x/apply"), "GENERATED_MODE_URL")  # SOURCE
    expect_error(g, "arbitrary external URL", cta(href="https://acme-corp.com/start"), "GENERATED_MODE_URL")
    expect_error(g, "source domain with full-width dots and letters", cta(href="https://www.ｗｏｎｄｅｒｆｕｌ.ai"), "GENERATED_MODE_URL")
    expect_error(g, "mailto on a real domain", cta(href="mailto:hello@acme-corp.com"), "GENERATED_MODE_URL")
    expect_error(g, "protocol-relative URL", cta(href="//cdn.example.org/x"), "GENERATED_MODE_URL")
    expect_error(g, "app store link", cta(href="https://apps.apple.com/app/id1"), "GENERATED_MODE_STORE")
    expect_error(g, "app store mark in copy", lead("Download on the App Store"), "GENERATED_MODE_STORE")
    s = cta(href="https://brand.example/start"); expect_clean(g, "reserved .example URL is accepted (control)", s)
    s = cta(href="/contact"); expect_clean(g, "relative path is accepted (control)", s)
    # --- rating / statistic
    expect_error(g, "rating score", lead("rated 4.8/5 by readers"), "GENERATED_MODE_RATING")
    expect_error(g, "star glyph", lead("★★★★★ service"), "GENERATED_MODE_RATING")
    expect_error(g, "review platform", lead("top of G2 this year"), "GENERATED_MODE_RATING")
    expect_error(g, "source funding statistic", lead("backed by $550M in funding"), "GENERATED_MODE_STAT")  # SOURCE
    expect_error(g, "source statistic spelled long-form", lead("raised $100 million"), "GENERATED_MODE_STAT")  # SOURCE
    # --- person / customer
    expect_error(g, "real person name", lead("said Gadi Ganon at the launch"), "GENERATED_MODE_PERSON")  # SOURCE
    expect_error(g, "real person name with Cyrillic look-alikes", lead("said Gadi Gаnоn at the launch"), "GENERATED_MODE_PERSON")
    s = gen("blog-article"); node(s, "editorial.article-header")["content"]["author"] = {"name": "Control Author", "identityRole": "person.real-identity"}; expect_error(g, "author flagged as a real identity", s, "GENERATED_MODE_PERSON")
    expect_error(g, "real customer name", lead("trusted by Telefonica daily"), "GENERATED_MODE_CUSTOMER")  # SOURCE
    expect_error(g, "real customer with full-width letters", lead("trusted by ＭｃＫｉｎｓｅｙ daily"), "GENERATED_MODE_CUSTOMER")
    expect_error(g, "real partner name", lead("with FC Bayern on the pitch"), "GENERATED_MODE_CUSTOMER")  # SOURCE
    # --- source copy
    expect_error(g, "verbatim source copy", lead(long_plain), "GENERATED_MODE_COPY")
    expect_error(g, "source copy with a curly apostrophe straightened", lead(curly.replace("’", "'")), "GENERATED_MODE_COPY")
    expect_error(g, "source copy with zero-width characters between words", lead(long_plain.replace(" ", ZW + " ")), "GENERATED_MODE_COPY")
    words = long_plain.split()
    expect_error(g, "new text embedding a seven-word run of source copy", lead("lumen harbor " + " ".join(words[:8]) + " ember quill"), "GENERATED_MODE_COPY")
    # --- media / asset reuse
    s = gen(); hero(s)["content"]["video"]["src"] = "/videos/hero.mp4"; expect_error(g, "source asset path reused", s, "GENERATED_MODE_ASSET")
    s = gen(); hero(s)["content"]["video"]["src"] = "https://framerusercontent.com/assets/x.mp4"; expect_error(g, "source CDN asset reused", s, "GENERATED_MODE_ASSET")
    s = gen(); hero(s)["content"]["video"]["src"] = "https://cdn.acme-corp.com/x.mp4"; expect_error(g, "foreign asset host", s, "GENERATED_MODE_ASSET")
    s = gen(); hero(s)["content"]["video"]["assetRole"] = "video.source-loop"; expect_error(g, "reference-only video role", s, "GENERATED_MODE_ASSET")
    s = gen("about"); node(s, "hero.company")["content"]["image"]["assetRole"] = "photo.source-scene"; expect_error(g, "reference-only scene photo role", s, "GENERATED_MODE_ASSET")
    s = gen(); hero(s)["content"]["video"]["assetRole"] = "product.source-visual"; expect_error(g, "proprietary product screenshot role", s, "GENERATED_MODE_ASSET")
    s = gen(); hero(s)["content"]["video"]["assetRole"] = "brand-mark.generated"; expect_error(g, "generation-safe role not offered by the section", s, "GENERATED_MODE_ASSET")
    ex_src = None
    for rel in ("schema/example.pagespec.json", "schema/examples/reference-blog-article.pagespec.json"):
        txt = json.dumps(jload(rel))
        import re
        m = re.search(r'"src": "(/[^"]+)"', txt)
        if m:
            ex_src = m.group(1)
            break
    s = gen(); hero(s)["content"]["video"]["src"] = ex_src or "/assets/probe.png"; expect_error(g, "media src copied from a reference example", s, "GENERATED_MODE_ASSET")


# =============================================================== tokens
def tokens():
    g = "tokens"

    def with_tokens(**t):
        s = gen(); hero(s)["tokens"] = t; return s
    expect_error(g, "unknown token id", with_tokens(surface="color.surface.neon"), "TOKEN_UNKNOWN")
    expect_error(g, "token of another catalog that does not exist", with_tokens(text="color.text.hot-pink"), "TOKEN_UNKNOWN")
    expect_error(g, "raw hex colour", with_tokens(surface="#ffffff"), "TOKEN_RAW_COLOR")
    expect_error(g, "raw rgb colour", with_tokens(text="rgb(0, 0, 0)"), "TOKEN_RAW_COLOR")
    expect_error(g, "named colour", with_tokens(accent="red"), "TOKEN_RAW_COLOR")
    expect_error(g, "raw hsl colour", with_tokens(border="hsl(10 20% 30%)"), "TOKEN_RAW_COLOR")
    expect_error(g, "arbitrary px spacing", with_tokens(paddingY="17px"), "TOKEN_RAW_SPACING")
    expect_error(g, "arbitrary unitless spacing", with_tokens(gap="24"), "TOKEN_RAW_SPACING")
    expect_error(g, "rem spacing", with_tokens(paddingY="3rem"), "TOKEN_RAW_SPACING")
    expect_error(g, "unsupported font family", with_tokens(fontFamily="Comic Sans MS"), "TOKEN_FONT_UNSUPPORTED")
    expect_error(g, "font token that is not an approved family", with_tokens(fontFamily="font.family.script-fallback"), "TOKEN_FONT_UNSUPPORTED")
    expect_error(g, "radius token used as a surface", with_tokens(surface="radius.lg"), "TOKEN_FIELD_CATEGORY")
    expect_error(g, "gap token used as paddingY", with_tokens(paddingY="space.gap.md"), "TOKEN_FIELD_CATEGORY")
    expect_error(g, "text colour used as a surface", with_tokens(surface="color.text.primary"), "TOKEN_FIELD_CATEGORY")
    expect_error(g, "foundation colour instead of a semantic role", with_tokens(surface="color.white"), "TOKEN_FIELD_CATEGORY")
    th = V.load_repo()["sections"]["hero.video-statement"]["themes"][0]
    other = {"light": ("color.surface.black", "color.text.on-dark"), "dark": ("color.surface.subtle", "color.text.inverse")}[th]
    expect_error(g, f"surface that only exists on the other theme (node is {th})", with_tokens(surface=other[0]), "TOKEN_THEME_MISMATCH")
    expect_error(g, f"text role that only exists on the other theme (node is {th})", with_tokens(text=other[1]), "TOKEN_THEME_MISMATCH")
    s = with_tokens(surface=other[0]); hero(s)["theme"] = th
    expect_error(g, "explicit theme does not rescue a mismatched token", s, "TOKEN_THEME_MISMATCH")


# =============================================================== registry / pins (in-memory edits of the loaded repo)
def registry_codes(mutate):
    R = V.load_repo()
    r2 = dict(R)
    r2["roles"] = copy.deepcopy(R["roles"])
    r2["sections"] = copy.deepcopy(R["sections"])
    mutate(r2)
    return {c for c, _ in V.registry_problems(r2)}


def registry():
    g = "registry"

    def case(label, mutate, code):
        got = registry_codes(mutate)
        record(g, f"{label} -> {code}", code in got, f"got {sorted(got)}")
    case("source wordmark loosened to generation-safe", lambda r: r["roles"]["logo.source-wordmark"].__setitem__("availability", "generation-safe"), "ASSET_AVAILABILITY_PIN")
    case("blocked customer logo moved to reference-only", lambda r: r["roles"]["logo.customer"].__setitem__("availability", "reference-only"), "ASSET_AVAILABILITY_PIN")
    case("source scene photo loosened", lambda r: r["roles"]["photo.source-scene"].__setitem__("availability", "generation-safe"), "ASSET_AVAILABILITY_PIN")
    case("new role without a pin", lambda r: r["roles"].__setitem__("logo.new", {"id": "logo.new", "availability": "generation-safe", "generationPolicy": "may-generate-new"}), "ASSET_ROLE_UNPINNED")
    case("pinned role deleted from the registry", lambda r: r["roles"].pop("rating.placeholder"), "ASSET_ROLE_MISSING")
    case("compliance role flipped to a DIFFERENT VALID policy", lambda r: r["roles"]["endpoint.third-party-live"].__setitem__("generationPolicy", "may-generate-new"), "ASSET_POLICY_PIN")
    case("source wordmark made must-reuse-exact", lambda r: r["roles"]["logo.source-wordmark"].__setitem__("generationPolicy", "must-reuse-exact"), "ASSET_POLICY_PIN")
    case("substitutes emptied on a reference-only role", lambda r: r["roles"]["product.source-visual"].__setitem__("generationSafeSubstitutes", []), "ASSET_SUBSTITUTE_MISSING")
    case("section lists a reference-only role as generation-safe", lambda r: r["sections"]["hero.company"]["generatedAssetRoles"].append("photo.source-scene"), "ASSET_GENERATED_ROLE")
    case("runtime UI contract flipped retrieval-eligible", lambda r: r["sections"]["utility.cookie-consent"].__setitem__("retrievalEligible", True), "RETRIEVAL_PIN")
    case("content contract marked retrieval-ineligible", lambda r: r["sections"]["features.approach-cards"].__setitem__("retrievalEligible", False), "RETRIEVAL_PIN")
    case("runtime-looking contract not in the pin", lambda r: r["sections"].__setitem__("content.cookie-banner", dict(r["sections"]["content.prose-block"], id="content.cookie-banner", title="Cookie banner", retrievalEligible=True)), "RETRIEVAL_PIN")
    case("pinned ineligible section lost its contract", lambda r: r["sections"].pop("overlay.mega-menu"), "RETRIEVAL_PIN")


# =============================================================== wrapper gate
def gate_inputs():
    t, r, c, h, w = WG.load_inputs(REPO)
    return t, r, copy.deepcopy(c), copy.deepcopy(h), copy.deepcopy(w)


def resize(h, route, sid, new, nth=0):
    r = h["routes"][route]
    s = [x for x in r["sections"] if x["section"] == sid][nth]
    d = new - s["heightPx"]
    s["heightPx"] = new
    s["visibleHeightPx"] = new
    r["pageHeightPx"] += d


def gate():
    g = "wrapper-gate"

    def run(mutate, whitelist=None):
        t, r, c, h, w = gate_inputs()
        mutate(h)
        if whitelist is not None:
            w = whitelist(w)
        return WG.evaluate(t, r, c, h, w)

    def err(label, mutate, code, whitelist=None):
        e, _w, _i = run(mutate, whitelist)
        record(g, f"{label} -> {code}", code in {c for c, _ in e}, f"got {sorted({c for c, _ in e})}")

    def wrn(label, mutate, code):
        e, w, _i = run(mutate)
        record(g, f"{label} -> {code} (warn)", code in {c for c, _ in w} and not e, f"errors {sorted({c for c, _ in e})} warnings {sorted({c for c, _ in w})}")
    wrn("HERO 1900px", lambda h: resize(h, "/", "hero.video-statement", 1900), "HERO_HEIGHT_WARN")
    err("HERO 3100px", lambda h: resize(h, "/", "hero.video-statement", 3100), "HERO_HEIGHT_FAIL")
    def to_55(h):
        cur = next(x for x in h["routes"]["/careers"]["sections"] if x["section"] == "listing.role-rows")["heightPx"]
        resize(h, "/careers", "listing.role-rows", (h["routes"]["/careers"]["pageHeightPx"] - cur) * 0.55 / 0.45)
    wrn("section at 55% of its page", to_55, "SECTION_SHARE_WARN")
    err("one section at 80% of its page", lambda h: resize(h, "/careers", "listing.role-rows", 24000), "SECTION_SHARE_FAIL")

    def merge_legal(h):
        r = h["routes"]["/legal/aup"]
        parts = [x for x in r["sections"] if x["section"] == "content.legal-section"]
        r["sections"] = [x for x in r["sections"] if x not in parts]
        merged = dict(parts[0], heightPx=sum(x["heightPx"] for x in parts), visibleHeightPx=sum(x["visibleHeightPx"] for x in parts))
        r["sections"].insert(2, merged)
    err("whole-page legal section re-created", merge_legal, "SECTION_SHARE_FAIL")
    err("route measurement missing", lambda h: h["routes"].pop("/press"), "MEASUREMENT_MISSING")
    err("required node not measured", lambda h: h["routes"]["/"].__setitem__("sections", [x for x in h["routes"]["/"]["sections"] if x["section"] != "hero.video-statement"]), "MEASUREMENT_MISSING")
    err("measurement without a usable height", lambda h: h["routes"]["/"]["sections"][0].__setitem__("heightPx", None) or h["routes"]["/"]["sections"][0].pop("visibleHeightPx", None), "MEASUREMENT_MISSING")
    err("measured at the wrong viewport", lambda h: h.__setitem__("viewportWidth", 1280), "MEASUREMENT_VIEWPORT")
    err("measured route bound to the wrong template", lambda h: h["routes"]["/"].__setitem__("template", "product"), "MEASUREMENT_INCONSISTENT")
    err("in-flow heights exceed the page", lambda h: h["routes"]["/"].__setitem__("pageHeightPx", 1000), "MEASUREMENT_INCONSISTENT")

    def bad_wl(entry_edit):
        def f(w):
            w = copy.deepcopy(w)
            entry_edit(w[0])
            return w
        return f
    err("whitelist entry without a justification", lambda h: None, "WHITELIST_INVALID", bad_wl(lambda e: e.__setitem__("justification", "tall")))
    err("agent reviewer without the attestation phrase", lambda h: None, "WHITELIST_INVALID", bad_wl(lambda e: (e.__setitem__("attestation", "agent"), e.__setitem__("reviewedBy", "Claude"))))
    err("human attestation naming an agent", lambda h: None, "WHITELIST_INVALID", bad_wl(lambda e: e.__setitem__("reviewedBy", "Claude Code")))
    err("human attestation naming a tool", lambda h: None, "WHITELIST_INVALID", bad_wl(lambda e: e.__setitem__("reviewedBy", "probe bot")))
    err("whitelist attestation outside agent|human", lambda h: None, "WHITELIST_INVALID", bad_wl(lambda e: e.__setitem__("attestation", "bot")))
    err("whitelist entry exempting a non-whitelistable rule", lambda h: None, "WHITELIST_INVALID", bad_wl(lambda e: e.__setitem__("rules", ["HERO_HEIGHT_WARN"])))
    err("whitelist entry without a date", lambda h: None, "WHITELIST_INVALID", bad_wl(lambda e: e.__setitem__("reviewedOn", "yesterday")))
    err("whitelist entry that exempts nothing", lambda h: None, "WHITELIST_STALE", lambda w: w + [dict(w[0], route="/about-us", section="hero.company")])
    err("whitelisted section grew past its cap", lambda h: resize(h, "/blog", "editorial.post-grid", 9000), "SECTION_SHARE_FAIL")
    err("whitelist removed for a real hit", lambda h: None, "SECTION_SHARE_FAIL", lambda w: [])
    err("whitelist cap below the measured height", lambda h: None, "SECTION_SHARE_FAIL", bad_wl(lambda e: e.__setitem__("maxHeightPx", 100)))
    code_pins = {"HERO_FAIL_PX": 3000, "HERO_WARN_PX": 1800, "SHARE_FAIL_PCT": 60.0, "SHARE_WARN_PCT": 50.0, "MIN_SECTIONS": 3, "VIEWPORT_WIDTH": 1440}
    record(g, "thresholds are pinned in code", all(getattr(WG, k) == v for k, v in code_pins.items()), str({k: getattr(WG, k) for k in code_pins}))


def main():
    for fn in (controls, schema_layer, structure, graph_rules, leakage, tokens, registry, gate):
        fn()
    bad = [r for r in RESULTS if not r[2]]
    groups = {}
    for g, _l, ok, _d in RESULTS:
        groups.setdefault(g, [0, 0])
        groups[g][0 if ok else 1] += 1
    print()
    for g, (ok, ko) in groups.items():
        print(f"  {g:15s} {ok:4d} ok {ko:3d} bad")
    print(f"\n{len(RESULTS) - len(bad)}/{len(RESULTS)} adversarial cases behaved as required")
    for g, label, _ok, d in bad:
        print(f"FAILED {g}: {label}  {d}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
