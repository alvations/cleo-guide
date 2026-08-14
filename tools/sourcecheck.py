#!/usr/bin/env python3
# Sourcing-quality gate: every place must have MULTIPLE SOURCES OF TRUTH — at least
# 2 independent CREDIBLE sources (Yelp/TripAdvisor/OpenTable are open-verification only,
# NOT credible recommenders, and never count toward the two).
#
#   python3 tools/sourcecheck.py <city-dataset.json> [--list]
#   e.g. python3 tools/sourcecheck.py data/siliconvalley.dataset.json --list
#
# Exit 0 = PASS (every place has >=2 credible sources), 1 = FAIL.
import json, sys, os
from collections import Counter

OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    show = "--list" in sys.argv
    path = args[0] if args else "data/siliconvalley.dataset.json"
    ds = json.load(open(path, encoding="utf-8"))
    recs = ds.get("P", []) + ds.get("F", [])
    yelp_only, single, ok = [], [], 0
    src_usage = Counter()
    for r in recs:
        keys = [t[0] for t in r.get("s", [])]
        credible = [k for k in keys if k not in OPEN_CHECK_ONLY]
        for k in keys: src_usage[k] += 1
        n = len(set(credible))
        if n == 0:   yelp_only.append(r["n"])
        elif n == 1: single.append((r["n"], credible[0]))
        else:        ok += 1
    total = len(recs)
    print(f"== Sourcing check: {os.path.basename(path)} ==")
    print(f"  places:                         {total}")
    print(f"  >=2 credible sources (PASS):    {ok}")
    print(f"  1 credible source (needs +1):   {len(single)}")
    print(f"  0 credible / Yelp-only (FAIL):  {len(yelp_only)}")
    print(f"  distinct sources in use:        {len([k for k in src_usage if k not in OPEN_CHECK_ONLY])} credible + "
          f"{len([k for k in src_usage if k in OPEN_CHECK_ONLY])} open-check")
    if show:
        if yelp_only:
            print("\n  -- 0 credible (Yelp-only), upgrade or prune: --")
            for n in yelp_only: print("     x", n)
        if single:
            print("\n  -- 1 credible (add a 2nd source of truth): --")
            for n, k in single: print(f"     . {n}  [{k}]")
    passed = not yelp_only and not single
    print("\n>>> " + ("PASS — every place has >=2 credible sources of truth."
                      if passed else
                      f"FAIL — {len(yelp_only)} Yelp-only + {len(single)} single-source place(s) need corroboration."))
    # write the worklist for the re-sourcing wave
    outdir = os.path.dirname(path)
    need = [{"n": n, "have": 0} for n in yelp_only] + [{"n": n, "have": 1, "src": k} for n, k in single]
    wl = os.path.join(os.path.dirname(path), "silicon-valley-research", "_needs_sources.json")
    if os.path.isdir(os.path.dirname(wl)):
        json.dump(need, open(wl, "w"), indent=1, ensure_ascii=False)
        print(f"    wrote {len(need)} places needing corroboration -> {wl}")
    sys.exit(0 if passed else 1)

if __name__ == "__main__":
    main()
