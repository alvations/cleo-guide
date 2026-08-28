#!/usr/bin/env python3
# gen-helper-backlog.py — the reusable GEOCODE-BACKLOG generator for the browser geocode-helper.
#
# The browser helper (tools/geocode-helper.html) needs a worklist of exactly the places that still
# lack a verified coordinate, as [{n, addr, kind}]. This used to be an inline python snippet re-typed
# each wave; that is the "ad-hoc" the project rule warns against. This tool derives the worklist from
# the two sources of truth — the built dataset (names + addresses + sight/food kind) and the geocode
# registry (which names are already verified) — so it never drifts and any agent can re-run it:
#
#   python3 tools/gen-helper-backlog.py singapore --region-substr Vietnam \
#           --out data/singapore-research/_vn_helper_backlog.json
#
# A place lands in the backlog iff (a) its address matches --region-substr (case-insensitive; repeatable),
# and (b) its name has no VERIFIED entry in data/geocodes.json under the city key (absent, or source /
# confidence == UNVERIFIED, or null lat/lng). kind is "sight" for dataset P records, "food" for F.
import json, os, sys, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def is_verified(entry):
    if not isinstance(entry, dict):
        return False
    if entry.get("lat") is None or entry.get("lng") is None:
        return False
    src = str(entry.get("source", "")).strip().upper()
    conf = str(entry.get("confidence", "")).strip().lower()
    return src != "UNVERIFIED" and conf != "unverified"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("city_key", help="dataset key, e.g. singapore")
    ap.add_argument("--region-substr", action="append", default=[],
                    help="only include places whose address contains this (case-insensitive); repeatable. "
                         "Omit to include every unverified place in the dataset.")
    ap.add_argument("--out", required=True, help="output worklist path")
    a = ap.parse_args()

    dataset = os.path.join(ROOT, "data", f"{a.city_key}.dataset.json")
    d = json.load(open(dataset, encoding="utf-8"))
    g = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))
    reg = g.get("cities", {}).get(a.city_key, {})

    subs = [s.lower() for s in a.region_substr]
    def in_region(ad):
        if not subs:
            return True
        ad = (ad or "").lower()
        return any(s in ad for s in subs)

    work = []
    for kind, arr in (("sight", d.get("P", [])), ("food", d.get("F", []))):
        for p in arr:
            n, ad = p.get("n"), p.get("ad", "")
            if not n or not in_region(ad):
                continue
            if is_verified(reg.get(n)):
                continue
            work.append({"n": n, "addr": ad, "kind": kind})

    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    json.dump(work, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s = sum(1 for w in work if w["kind"] == "sight")
    f = sum(1 for w in work if w["kind"] == "food")
    print(f"wrote {a.out}: {len(work)} places still needing a verified pin ({s} sights + {f} food)"
          + (f" [region: {', '.join(a.region_substr)}]" if a.region_substr else ""))

if __name__ == "__main__":
    main()
