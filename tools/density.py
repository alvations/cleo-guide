#!/usr/bin/env python3
# density.py — the iterate-to-density reporter. Counts the DISCOVERED places (food + sights) currently in
# a research dir, per area code, so an expansion is driven to a target density systematically and auditably
# (no eyeballing, no compromise). Discovery is the gate that matters here: geocoding/rendering come later,
# but a place can never render if it was never discovered — so we measure discovery against a target and
# iterate until every area clears it.
#
#   python3 tools/density.py singapore                 # every Singapore town/area, vs the Toa Payoh benchmark
#   python3 tools/density.py rhineland                 # a dataset-city research dir, vs its RESUME targets
#   python3 tools/density.py singapore --area BSH      # one area
#   python3 tools/density.py singapore --target 57     # override the per-area target
#
# Target model: SG neighbourhoods are benchmarked to **Toa Payoh** (its current food+sights total) — "at
# least as dense as Toa Payoh, scaled to size" — you raise --target for a physically larger town (AMK) and
# the tool still shows the gap. Regional dataset cities read their own targets from RESUME.md if present.
import json, os, re, sys, glob, argparse
from collections import defaultdict
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# research dir per key (extend as new guides are added)
RDIR = {
    "singapore": "data/singapore-research",
    "rhineland": "data/rhineland-research",
    "aachen":    "data/aachen-research",
    "saarland":  "data/saarland-research",
    "belgium":   "data/belgium-research",
    "antwerp":   "data/antwerp-research",
    "ghent":     "data/ghent-research",
    "brussels":  "data/brussels-research",
    "bruges":    "data/bruges-research",
}
# human labels for Singapore area codes (best-effort; unknown codes print the raw code)
SG_LABELS = {"TPY":"Toa Payoh","BSH":"Bishan","AMK":"Ang Mo Kio","PPM":"Potong Pasir & MacPherson",
             "USG":"Upper Serangoon","PPS":"(retired combined PP/Mac/Serangoon)"}
# SCALE-TO-SIZE: the benchmark is Toa Payoh; every town's target scales by its resident population
# relative to Toa Payoh's (a larger, older town must be denser — the user's rule made concrete/auditable).
# Populations are ~2020 census planning-area/subzone estimates for the ground each guide actually covers.
# Target = round(TPY_target * pop / TPY_pop), floored at 55 (the "at least 50-60" minimum).
SG_POP = {  # thousands of residents on the ground the guide covers
    "TPY": 121,   # Toa Payoh planning area (the benchmark)
    "AMK": 164,   # Ang Mo Kio + Yio Chu Kang — one of the largest, oldest towns
    "USG": 175,   # Upper Serangoon: Serangoon Gardens + Kovan + the Hougang edge
    "BSH": 88,    # Bishan — a compact town
    "PPM": 95,    # Potong Pasir + MacPherson + Bidadari/Woodleigh
}
SG_FLOOR = 55     # no SG neighbourhood target below this, however small

def load_records(rdir):
    """Return (food, sights) lists of {n, a} from every research JSON in the dir (LIST=food, DICT=sights)."""
    food, sights = [], []
    for path in sorted(glob.glob(os.path.join(rdir, "*.json"))):
        base = os.path.basename(path)
        if base.startswith(("_", "out_", "sr_", "geo_", "CREATORS", "SOURCES_")) or "dataset" in base:
            continue
        try: d = json.load(open(path, encoding="utf-8"))
        except Exception: continue
        if isinstance(d, list):
            for x in d:
                if isinstance(x, dict) and x.get("n"): food.append(x)
        elif isinstance(d, dict):
            for x in d.get("sights", []):
                if isinstance(x, dict) and x.get("n"): sights.append(x)
            for x in d.get("food", []):
                if isinstance(x, dict) and x.get("n"): food.append(x)
    return food, sights

def read_targets(rdir):
    """Parse simple 'CODE ... ~N' target lines from a RESUME.md if present. Best-effort."""
    p = os.path.join(rdir, "RESUME.md")
    tg = {}
    if os.path.exists(p):
        txt = open(p, encoding="utf-8").read()
        for m in re.finditer(r"`([A-Z]{2,5})`[^\n]*?~\s*(\d+)", txt):
            tg[m.group(1)] = int(m.group(2))
    return tg

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("key")
    ap.add_argument("--area", help="only this area code")
    ap.add_argument("--target", type=int, help="override per-area target")
    a = ap.parse_args()
    if a.key not in RDIR:
        print("unknown key. known:", ", ".join(RDIR)); sys.exit(2)
    rdir = os.path.join(ROOT, RDIR[a.key])
    if not os.path.isdir(rdir):
        print("no research dir:", rdir); sys.exit(2)
    food, sights = load_records(rdir)

    # dedup by name within bucket (mirror consolidate's exact-name dedup for an honest count)
    def dedup(recs):
        seen = set(); out = []
        for x in recs:
            n = x.get("n")
            if n and n not in seen: seen.add(n); out.append(x)
        return out
    food, sights = dedup(food), dedup(sights)

    by = defaultdict(lambda: [0, 0])  # area -> [food, sights]
    for x in food:   by[x.get("a", "?")][0] += 1
    for x in sights: by[x.get("a", "?")][1] += 1

    targets = read_targets(rdir)
    # SG benchmark = current Toa Payoh total (its own food+sights), so towns are measured against a real peer
    tpy_bench = None
    if a.key == "singapore" and "TPY" in by:
        tpy_bench = sum(by["TPY"])

    areas = [a.area] if a.area else sorted(by.keys())
    print(f"\nDENSITY — {a.key}  (discovered places per area: food + sights = total)")
    print("-" * 72)
    any_gap = False
    tpy_pop = SG_POP.get("TPY", 121)
    for code in areas:
        f, s = by.get(code, [0, 0]); total = f + s
        label = SG_LABELS.get(code, code) if a.key == "singapore" else code
        # SG towns: scale the Toa Payoh benchmark by population (floored); else RESUME target or benchmark
        if a.key == "singapore" and tpy_bench and code in SG_POP:
            scaled = max(SG_FLOOR, round(tpy_bench * SG_POP[code] / tpy_pop))
        else:
            scaled = None
        tgt = a.target or scaled or targets.get(code) or tpy_bench or 57
        gap = tgt - total
        flag = "OK" if gap <= 0 else f"NEED +{gap}"
        if gap > 0: any_gap = True
        print(f"  {code:5} {label:34} {f:3} food + {s:3} sights = {total:3}   target ~{tgt:<3} {flag}")
    print("-" * 72)
    if a.key == "singapore" and tpy_bench:
        print(f"  benchmark: Toa Payoh currently = {tpy_bench} places (SG towns should match, scaled to size)")
    print("  next: run another discovery wave on any 'NEED +N' area, then re-run this. Iterate to density.\n")
    sys.exit(1 if any_gap else 0)

if __name__ == "__main__":
    main()
