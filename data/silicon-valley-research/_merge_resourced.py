#!/usr/bin/env python3
# Merge the re-sourcing agents' output (_resourced_*.json) back into the research files:
# for each place in "add", append any NEW credible source key it doesn't already carry.
# Dedup by source KEY (one entry per outlet). Reports unmatched names + collects prune candidates.
import json, glob, os
D = os.path.dirname(os.path.abspath(__file__))
OPEN_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}

add = {}   # place -> list of [key,url]
none = set()
for f in sorted(glob.glob(os.path.join(D, "_resourced_*.json"))):
    d = json.load(open(f))
    for place, srcs in d.get("add", {}).items():
        add.setdefault(place, [])
        for s in srcs:
            if s and s[0] not in OPEN_ONLY:
                add[place].append([s[0], s[1] if len(s) > 1 else ""])
    for n in d.get("none", []):
        none.add(n)

research = [p for p in glob.glob(os.path.join(D, "*.json"))
            if not os.path.basename(p).startswith(("_", "sv_", "geo_")) and "dataset" not in os.path.basename(p)]
applied, touched_places = 0, set()
for path in research:
    d = json.load(open(path)); changed = False
    items = d if isinstance(d, list) else (d.get("food", []) + d.get("sights", []))
    for x in items:
        if not isinstance(x, dict) or x.get("n") not in add:
            continue
        have = {s[0] for s in x.get("sources", [])}
        for key, url in add[x["n"]]:
            if key not in have:
                x.setdefault("sources", []).append([key, url]); have.add(key)
                applied += 1; changed = True; touched_places.add(x["n"])
    if changed:
        json.dump(d, open(path, "w"), indent=1, ensure_ascii=False)

matched = touched_places
unmatched = sorted(set(add) - matched)
print(f"re-sourced files: {len(glob.glob(os.path.join(D,'_resourced_*.json')))}")
print(f"places with new sources requested: {len(add)}  |  matched & updated: {len(matched)}  |  source rows added: {applied}")
if unmatched:
    print(f"UNMATCHED names (check spelling vs research files): {len(unmatched)}")
    for n in unmatched: print("   ?", n)
# prune candidates = agent 'none' minus any that ended up with sources anyway
prune = sorted(n for n in none if n not in matched)
json.dump(prune, open(os.path.join(D, "_prune_candidates.json"), "w"), indent=1, ensure_ascii=False)
print(f"prune candidates (no credible source found, <2 will be dropped by the build gate): {len(prune)} -> _prune_candidates.json")
