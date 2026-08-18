#!/usr/bin/env python3
# Merge a city's creator/viral-source pass into the registry + research files (reusable, per
# docs/SOURCES.md "Creator, viral & social-source pass"). Reads data/<city>-research/CREATORS.json:
#   {"creators":[{key,name,type,scope,...,verified,credible}], "attach":[{place,creatorKey,url}]}
# and (1) registers the creators under data/sources.json cities[<key>].creators[] (dedup by key),
# (2) applies each attachment as an extra CREDIBLE source [creatorKey,url] on the matching research
# record (dedup by key). VIRAL_EXPAND.json places are picked up by consolidate.py like any research file.
#
#   python3 tools/merge-creators.py <city-key>        e.g. cincinnati-oh
import json, sys, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
key = (sys.argv[1] if len(sys.argv) > 1 else "").strip()
if not key:
    print("usage: python3 tools/merge-creators.py <city-key>"); sys.exit(2)
slug = key.rsplit("-", 1)[0]                      # cincinnati-oh -> cincinnati
rdir = os.path.join(ROOT, "data", f"{slug}-research")
cpath = os.path.join(rdir, "CREATORS.json")
if not os.path.exists(cpath):
    print("no CREATORS.json for", key, "at", cpath); sys.exit(1)
cj = json.load(open(cpath, encoding="utf-8"))
creators = cj.get("creators", []); attach = cj.get("attach", [])

# 1) register creators in sources.json (dedup by key)
sp = os.path.join(ROOT, "data", "sources.json"); s = json.load(open(sp, encoding="utf-8"))
city = s["cities"].setdefault(key, {"name": key, "sources": [], "creators": []})
have = {c.get("key") for c in city.setdefault("creators", [])}
added = 0
for c in creators:
    if c.get("key") and c["key"] not in have:
        city["creators"].append(c); have.add(c["key"]); added += 1
json.dump(s, open(sp, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# 2) apply attachments to research records (add [creatorKey,url] to that place's sources)
research = [p for p in glob.glob(os.path.join(rdir, "*.json"))
           if not os.path.basename(p).startswith(("_", slug[:3] + "_", "geo_", "CREATORS"))
           and "dataset" not in os.path.basename(p)]
byplace = {}
for a in attach:
    byplace.setdefault(a["place"], []).append((a["creatorKey"], a.get("url", "")))
applied = 0; touched = set()
for path in research:
    d = json.load(open(path, encoding="utf-8"))
    items = d if isinstance(d, list) else (d.get("food", []) + d.get("sights", []))
    changed = False
    for x in items:
        if not isinstance(x, dict) or x.get("n") not in byplace:
            continue
        keys = {t[0] for t in x.get("sources", [])}
        for ck, url in byplace[x["n"]]:
            if ck not in keys:
                x.setdefault("sources", []).append([ck, url]); keys.add(ck)
                applied += 1; touched.add(x["n"]); changed = True
    if changed:
        json.dump(d, open(path, "w", encoding="utf-8"), indent=1, ensure_ascii=False)

unmatched = sorted(set(byplace) - touched)
print(f"{key}: registered {added} creators (total {len(city['creators'])}); "
      f"applied {applied} attachment source(s) to {len(touched)} place(s).")
if unmatched:
    print("  attachments with no matching research record (check spelling):")
    for n in unmatched: print("   ?", n)
