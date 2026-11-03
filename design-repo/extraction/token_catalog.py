#!/usr/bin/env python3
"""Derives tokens/llm/token-catalog.json from the real token files (tokens/00-foundation, 10-semantic,
20-component, 30-layout, themes). extraction/verify_all.py re-derives it on every run and fails on any
difference, so the catalog cannot drift from the token files.

    python3 extraction/token_catalog.py            # print the derived catalog
    python3 extraction/token_catalog.py --write    # (re)write tokens/llm/token-catalog.json
"""
import hashlib, json, os, sys
sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_VERSION = "1.0.0"

FOUNDATION = ["color", "typography", "spacing", "radius", "breakpoint", "elevation", "gradient", "motion"]


def _load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as fh:
        return json.load(fh)


def _category(tid):
    head = tid.split(".")[0]
    if head == "color":
        return "color"
    if tid.startswith("font.family."):
        return "fontFamily"
    if tid.startswith("font.weight."):
        return "fontWeight"
    if tid.startswith("font.size."):
        return "fontSize"
    if head == "type":
        return "typeStyle"
    if tid.startswith("space.section-y.") or tid.startswith("space.section-x.") or tid.startswith("space.gap."):
        return "spacingRole"
    if head == "space":
        return "spacing"
    if head == "layout":
        return "layout"
    if head in ("radius", "breakpoint", "gradient", "motion"):
        return head
    if head in ("blur", "shadow"):
        return "elevation"
    if head == "component":
        return "component"
    return "other"


def derive():
    entries = {}
    files = []
    for name in FOUNDATION:
        rel = f"tokens/00-foundation/{name}.json"
        files.append(rel)
        for tid, t in _load(rel)["tokens"].items():
            entries[tid] = {"category": _category(tid), "value": t["value"], "file": rel}
    sem = _load("tokens/10-semantic/semantic.json")
    files.append("tokens/10-semantic/semantic.json")
    for tid, modes in sem["tokens"].items():
        if tid in entries:
            raise ValueError(f"semantic token id collides with a foundation token: {tid}")
        entries[tid] = {"category": "semanticColor", "value": {"light": modes["light"], "dark": modes["dark"]}, "file": "tokens/10-semantic/semantic.json"}
    for rel in ("tokens/20-component/component.json", "tokens/30-layout/layout.json"):
        files.append(rel)
        for tid, t in _load(rel)["tokens"].items():
            val = t.get("value", t.get("ref", {k: v for k, v in t.items() if k != "evidence"}))
            entries[tid] = {"category": _category(tid), "value": val, "file": rel}
    for th in ("light", "dark"):
        files.append(f"tokens/themes/{th}.json")
    digest = hashlib.sha256()
    for rel in sorted(files):
        with open(os.path.join(REPO, rel), "rb") as fh:
            digest.update(rel.encode() + b"\0" + fh.read())
    cats = {}
    for tid, e in entries.items():
        cats.setdefault(e["category"], []).append(tid)
    return {
        "$description": "Curated, LLM-facing view of every referenceable token, derived mechanically from the token files by extraction/token_catalog.py (never hand-edited). sourceDigest is the sha256 of the token files it was derived from.",
        "version": CATALOG_VERSION,
        "sourceFiles": sorted(files),
        "sourceDigest": digest.hexdigest(),
        "counts": {"tokens": len(entries), **{k: len(v) for k, v in sorted(cats.items())}},
        "categories": {k: sorted(v) for k, v in sorted(cats.items())},
        "tokens": dict(sorted(entries.items())),
    }


if __name__ == "__main__":
    cat = derive()
    if "--write" in sys.argv:
        with open(os.path.join(REPO, "tokens/llm/token-catalog.json"), "w", encoding="utf-8") as fh:
            json.dump(cat, fh, indent=2, ensure_ascii=False)
            fh.write("\n")
        print("wrote tokens/llm/token-catalog.json", cat["counts"]["tokens"], "tokens")
    else:
        print(json.dumps(cat, indent=2, ensure_ascii=False))
