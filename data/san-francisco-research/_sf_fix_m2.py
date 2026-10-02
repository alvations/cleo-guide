#!/usr/bin/env python3
# M2 credibility / key-hygiene audit fixes (2026-10-02). Idempotent. Logged in AUDIT.md "Stage 2-R".
import json, glob, os
D = os.path.dirname(os.path.abspath(__file__))
S26 = "https://sfist.com/2026/06/25/californios-elevated-to-three-michelin-stars-wolfsbane-and-naides/"
FIX = {  # name -> function(record)
 "San Tung":   lambda r: relabel(r, "SEVENXSEVEN", "axios.com", "AXIOS"),
 "Burma Love": lambda r: relabel(r, "SFGATE", "sfstation.com", "SFSTATION"),
 "b. Patisserie": lambda r: relabel(r, "JAMESBEARD", "bakemag.com", "BAKEMAG"),
 "Abacá":      lambda r: relabel(r, "JAMESBEARD", "vogue.ph", "VOGUEPH"),
 "Foreign Cinema": lambda r: relabel(r, "JAMESBEARD", "foreigncinema.com", "OFFICIAL"),
 "Mandalay Restaurant": lambda r: r.__setitem__("sources", [
     ["JAMESBEARD", "James Beard Foundation America's Classics 2024 — https://hoodline.com/2024/02/san-francisco-s-mandalay-honored-with-prestigious-james-beard-america-s-classics-award/"],
     ["HOODLINE", "https://hoodline.com/2024/02/san-francisco-s-mandalay-honored-with-prestigious-james-beard-america-s-classics-award/"],
     ["KRON4", "https://www.kron4.com/news/bay-area/sf-burmese-restaurant-wins-prestigious-james-beard-award/"],
     ["WIKIPEDIA", "https://en.wikipedia.org/wiki/Mandalay_(restaurant)"]]),
 "Restaurant Naides": lambda r: (r["sources"].insert(0, ["MICHELIN_STAR", S26 + " — first Michelin star, 2026"]),
                                 r.__setitem__("w", r["w"].rstrip() + " Earned its first Michelin star in the 2026 guide.")),
 "Californios": lambda r: r.__setitem__("w", r["w"].rstrip() + " Elevated to three Michelin stars in the 2026 California guide (sfist, 2026-06-25)."),
}
def relabel(r, old, urlpart, new):
    for t in r["sources"]:
        if t[0] == old and urlpart in t[1]: t[0] = new
for f in sorted(glob.glob(os.path.join(D, "*.json"))):
    b = os.path.basename(f)
    if b.startswith(("_", "sf_")) or "dataset" in b: continue
    d = json.load(open(f)); arr = d if isinstance(d, list) else d.get("sights", []) + d.get("food", [])
    ch = False
    for r in arr:
        if r["n"] in FIX:
            before = json.dumps(r); FIX[r["n"]](r)
            if "three Michelin" in r["w"] and r["w"].count("three Michelin") > 1: r["w"] = before and json.loads(before)["w"]
            if "first Michelin star" in r["w"] and r["w"].count("first Michelin star") > 1: r["w"] = json.loads(before)["w"]
            if [s for s in r["sources"] if s[0] == "MICHELIN_STAR"].__len__() > 1: r["sources"] = json.loads(before)["sources"]
            ch |= json.dumps(r) != before; print("fixed", r["n"])
        if r["n"] == "Restaurant Naides":   # now starred (2026): the earlier Bib listing is superseded
            n0 = len(r["sources"]); r["sources"] = [t for t in r["sources"] if t[0] != "MICHELIN_BIB"]; ch |= len(r["sources"]) != n0
    if ch: json.dump(d, open(f, "w"), ensure_ascii=False, indent=1)
