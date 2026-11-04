"""Control PageSpecs synthesized from the design-repo itself (no hand-written fixtures).

build_control(template_id, mode) walks a template's REAL node list and each section contract's content schema and
produces a minimal PageSpec that must validate (schema + semantic) in the given mode. Because it is generated from
templates/templates.json and sections/*.json, a new template or section is covered automatically. Used by
schema/tests/adversarial_test.py (controls and mutation bases) and extraction/verify_all.py (controls-pass).

Fictional vocabulary only: the words below appear nowhere in the source copy, so generated-mode controls carry no
source identity.
"""
import json
import os
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, "schema"))
import semantic_validate as V  # noqa: E402

WORDS = ["lumen", "harbor", "quill", "amber", "tundra", "cobalt", "meadow", "ember", "isle", "juniper", "pebble", "zephyr"]


def _j(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def _words(n, seed):
    return " ".join(WORDS[(seed + i * 5) % len(WORDS)] for i in range(max(1, n)))


class _Ctx:
    def __init__(self, mode, generated_roles):
        self.mode, self.roles, self.n = mode, generated_roles, 0

    def media(self, allowed):
        self.n += 1
        if self.mode == "generated":
            safe = [r for r in allowed if r in self.roles and V.PINNED_AVAILABILITY.get(r) == "generation-safe"]
            if not safe:
                return None
            return {"assetRole": safe[0], "alt": "Abstract placeholder " + _words(2, self.n), "src": f"generated://control/{self.n}.svg"}
        return {"assetRole": allowed[0], "alt": "Reference media " + _words(2, self.n), "src": f"/media/control-{self.n}.png"}


def synth(schema, ctx, depth=0):
    ref = schema.get("$ref")
    if ref == "#/definitions/media":
        return ctx.media(schema.get("x-assetRoles", []))
    if ref == "#/definitions/cta":
        ctx.n += 1
        return {"label": "Learn more", "href": "/"}
    if ref == "#/definitions/person":
        ctx.n += 1
        return {"name": "Ines Marrow" if ctx.mode == "generated" else "Control Person", "role": "Fictional role", "identityRole": "person.fictional" if ctx.mode == "generated" else "person.real-identity"}
    if "enum" in schema:
        return schema["enum"][0]
    t = schema.get("type")
    if t == "string":
        ctx.n += 1
        return _words(min(3, schema.get("maxWords") or 3), ctx.n)
    if t == "boolean":
        return True
    if t == "integer" or t == "number":
        return schema.get("minimum", 1)
    if t == "array":
        k = max(schema.get("minItems", 0), 1)
        k = min(k, schema.get("maxItems", k))
        out = [synth(schema["items"], ctx, depth + 1) for _ in range(k)]
        return out
    if t == "object":
        out = {}
        props = schema.get("properties", {})
        for name in schema.get("required", []):
            v = synth(props[name], ctx, depth + 1)
            if v is not None:
                out[name] = v
        return out
    return None


def build_node(sid, variant, mode):
    c = V.load_repo()["sections"][sid]
    ctx = _Ctx(mode, set(c["generatedAssetRoles"]))
    node = {"section": sid, "motion": {"pattern": c["motion"]["allowedPatterns"][0], "reducedMotionFallback": c["motion"]["reducedMotionFallback"]},
            "content": synth(c["content"], ctx)}
    if c.get("variants"):
        node["variant"] = variant or c["variants"][0]
    elif variant:
        node["variant"] = variant
    return node


def build_nodes(tid, mode):
    tpl = V.load_repo()["templates"][tid]
    nodes = []
    for tn in tpl["nodes"]:
        if "slot" in tn:
            for i in range(tn["min"]):
                nodes.append(build_node(tn["allowed"][i % len(tn["allowed"])], None, mode))
        elif tn.get("required"):
            nodes.append(build_node(tn["section"], (tn.get("variants") or [None])[0], mode))
    return nodes


def build_control(tid, mode="generated", route=None):
    repo = V.load_repo()
    if route is None:
        route = next((r["path"] for r in repo["routes"] if r["template"] == tid), "/") if mode == "reference" else "/" + tid
    spec = {"pageSpecVersion": "1.0.0", "mode": mode, "template": tid, "route": route,
            "meta": {"title": "Halcyon Grid " + tid + " control", "description": "Synthesized control page."} if mode == "generated" else {"title": "Control " + tid},
            "nodes": build_nodes(tid, mode)}
    if mode == "generated":
        spec["brand"] = {"name": "Halcyon Grid", "mark": {"assetRole": "brand-mark.generated", "alt": "Halcyon Grid mark", "src": "generated://control/mark.svg"}}
    return spec
