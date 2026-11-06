#!/usr/bin/env python3
"""Re-derives the evidence behind schema/source-brand.json from the REAL source tree.

schema/source-brand.json is the single registry of source identity (brand patterns, CTA labels, URLs, store marks,
ratings, statistics, people, customers/partners) that semantic_validate.py rejects in mode=generated. This tool scans
the source project that sits next to design-repo/ (src/ and CLONE_SPEC*.md) and records, for every registry entry,
how many lines of the real source match it and the first file:line where it does. The result is committed as
extraction/source-brand-evidence.json together with a digest of the registry, so:

  * a registry entry that matches nothing in the real source is reported (it would be invented, not mined);
  * editing the registry without re-running this tool changes the digest and fails verify_all.py;
  * the real source changing (a pattern no longer present, new counts) fails --check until it is re-derived.

    python3 extraction/build_source_brand.py            # print the derived evidence
    python3 extraction/build_source_brand.py --write    # (re)write extraction/source-brand-evidence.json
    python3 extraction/build_source_brand.py --check    # exit 1 when the committed file differs from a re-derivation
    python3 extraction/build_source_brand.py --source-root DIR   # source project root (default: parent of design-repo/)

Detection is string/regex based: nothing here proves the registry is complete, only that
every entry in it is real and that the committed evidence matches the source it was derived from.
Without a source tree (a standalone copy of design-repo/) --check prints SKIP and exits 0.
"""
import hashlib
import json
import os
import re
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT = os.path.join(HERE, "source-brand-evidence.json")
SCAN_SUFFIXES = (".jsx", ".js", ".json", ".css", ".md", ".html", ".mjs", ".cjs")
SKIP_PARTS = {"node_modules", "dist", ".git"}


def registry():
    with open(os.path.join(REPO, "schema", "source-brand.json"), encoding="utf-8") as f:
        return json.load(f)["sourceBrand"]


def digest_of(reg):
    return hashlib.sha256(json.dumps(reg, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()


def source_files(root):
    out = []
    src = os.path.join(root, "src")
    for dp, dns, fns in os.walk(src):
        dns[:] = sorted(d for d in dns if d not in SKIP_PARTS)
        for fn in sorted(fns):
            if fn.endswith(SCAN_SUFFIXES):
                out.append(os.path.relpath(os.path.join(dp, fn), root).replace(os.sep, "/"))
    for fn in sorted(os.listdir(root)):
        if fn.startswith("CLONE_SPEC") and fn.endswith(".md"):
            out.append(fn)
    return out


def load_lines(root, files):
    data = {}
    for rel in files:
        try:
            with open(os.path.join(root, rel), encoding="utf-8") as f:
                data[rel] = f.read().split("\n")
        except (UnicodeDecodeError, OSError):
            continue
    return data


def scan(data, test):
    hits, first = 0, None
    for rel, lines in data.items():
        for i, line in enumerate(lines, 1):
            if test(line):
                hits += 1
                if first is None:
                    first = f"{rel}:{i}"
    return {"hits": hits, "firstHit": first}


def rx(p):
    # registry patterns are applied to whole string fields; a leading ^ is dropped when scanning source lines
    return re.compile(p["regex"].lstrip("^") if p["regex"].startswith("^") else p["regex"], re.I if "i" in p.get("flags", "") else 0)


def stat_spellings(s):
    """A statistic is mined when its literal or its long form ("$100M" -> "$100 million") occurs in the source."""
    out = {s}
    if s.endswith("M"):
        out.add(s[:-1] + " million")
    if s.endswith("B"):
        out.add(s[:-1] + " billion")
    return out


def derive(root):
    reg = registry()
    files = source_files(root)
    data = load_lines(root, files)
    items = []

    def add(kind, ident, res, expect):
        items.append({"kind": kind, "id": ident, "expectHits": expect, **res})

    for kind, key in (("brandPattern", "patterns"), ("urlPattern", "urlPatterns"), ("storePattern", "storePatterns"), ("ratingPattern", "ratingPatterns")):
        for p in reg[key]:
            r = rx(p)
            # store marks and rating shapes are registered because the generator might invent them; the source has none
            add(kind, p["id"], scan(data, lambda ln, r=r: bool(r.search(ln))), kind in ("brandPattern", "urlPattern"))
    for p in reg["ctaPatterns"]:
        if "regex" in p:
            r = rx(p)
            add("ctaPattern", p["id"], scan(data, lambda ln, r=r: bool(r.search(ln))), False)
        for label in p.get("exact", []):
            add("ctaLabel", label, scan(data, lambda ln, s=label: s in ln), True)
    for p in reg["statPatterns"]:
        for s in p["exact"]:
            add("statistic", s, scan(data, lambda ln, forms=stat_spellings(s): any(f in ln for f in forms)), True)
    for name in reg["people"]:
        add("person", name, scan(data, lambda ln, s=name.lower(): s in ln.lower()), True)
    for name in reg["customerAndPartnerNames"]:
        add("customerOrPartner", name, scan(data, lambda ln, s=name.lower(): s in ln.lower()), True)
    return {
        "$description": "Derived by extraction/build_source_brand.py from the real source (src/ and CLONE_SPEC*.md); never hand-edited. registryDigest is the sha256 of schema/source-brand.json it was derived from. expectHits=true entries must match the source at least once (otherwise the registry entry is invented); store and rating patterns are expected to match nothing (the source renders none).",
        "version": "1.0.0",
        "registryDigest": digest_of(reg),
        "scanned": {"roots": ["src/", "CLONE_SPEC*.md"], "files": len(data)},
        "counts": {k: sum(1 for i in items if i["kind"] == k) for k in sorted({i["kind"] for i in items})},
        "items": items,
    }


def problems(evidence):
    out = []
    for it in evidence["items"]:
        if it["expectHits"] and it["hits"] == 0:
            out.append(f"{it['kind']} {it['id']!r} matches nothing in the real source (registry entry not mined from it)")
    return out


def dump(ev):
    return json.dumps(ev, indent=2, ensure_ascii=False) + "\n"


def main(argv):
    root = os.path.dirname(REPO)
    if "--source-root" in argv:
        root = os.path.abspath(argv[argv.index("--source-root") + 1])
    if "--check" in argv:
        if not os.path.isdir(os.path.join(root, "src")):
            print("SKIP source-brand evidence not re-derived: no src/ next to design-repo/ (standalone copy)")
            return 0
        ev = derive(root)
        bad = problems(ev)
        if not os.path.exists(OUT):
            bad.append("extraction/source-brand-evidence.json is missing (run with --write)")
        elif open(OUT, encoding="utf-8").read() != dump(ev):
            bad.append("extraction/source-brand-evidence.json is OUT OF DATE against schema/source-brand.json or the real source (run with --write)")
        for b in bad:
            print("FAIL", b)
        print("source-brand evidence:", "OK" if not bad else f"{len(bad)} problem(s)")
        return 1 if bad else 0
    if not os.path.isdir(os.path.join(root, "src")):
        print("no src/ found next to design-repo/; pass --source-root", file=sys.stderr)
        return 2
    ev = derive(root)
    if "--write" in argv:
        bad = problems(ev)
        for b in bad:
            print("WARN", b)
        with open(OUT, "w", encoding="utf-8") as f:
            f.write(dump(ev))
        print("wrote extraction/source-brand-evidence.json", ev["counts"])
    else:
        print(dump(ev))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
