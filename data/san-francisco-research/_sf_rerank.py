#!/usr/bin/env python3
# Phase-4 re-rank (2026-10-02): FOOD tiers graded WITHIN each area by measured merit (docs/SOURCES.md merit bar).
# Idempotent: the curator's original tier is kept once in "t0" and only used as one signal.
# score = award (MICHELIN_STAR 3, JAMESBEARD 2.5, MICHELIN_BIB 2, MICHELIN listing 1)
#       + 0.75 per extra distinct credible key (corroboration breadth, capped at 3)
#       + 1.5 if SF-canon icon (brief's opening-move list)
#       + 1.5 if the curator had it tier 1 (iconic canon judgement), + 0.5 if tier 2
# Per area: top 35% -> t1, next 45% -> t2, rest -> t3 (positional; ties by name). Closed places keep their tier.
import json, glob, os, math
from collections import defaultdict
D = os.path.dirname(os.path.abspath(__file__))
# SF food canon named in _AGENT_BRIEF.md (the city-unique opening move) — iconic, kept prominent in their area
CANON = {"La Taqueria", "El Farolito", "Swan Oyster Depot", "Tadich Grill", "The Buena Vista Cafe", "Boudin Bakery (Fisherman's Wharf)",
         "Tartine Bakery", "Hog Island Oyster Co.", "Golden Gate Fortune Cookie Factory", "It's-It Ice Cream Factory Shop",
         "Mandalay Restaurant", "Burma Superstar", "Blue Bottle Coffee (Ferry Building)", "Ritual Coffee Roasters",
         "Sightglass Coffee", "Yank Sing", "Mister Jiu's", "House of Prime Rib", "Zuni Café", "Hang Ah Tea Room", "Thanh Long",
         "Sotto Mare", "Saigon Sandwich", "Tonga Room & Hurricane Bar", "Vesuvio Cafe"}
AW = {"MICHELIN_STAR": 3, "JAMESBEARD": 2.5, "MICHELIN_BIB": 2, "MICHELIN": 1}
OPEN = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}
files = {}
for f in sorted(glob.glob(os.path.join(D, "*.json"))):
    b = os.path.basename(f)
    if b.startswith(("_", "sf_")) or "dataset" in b or "worklist" in b: continue
    files[f] = json.load(open(f))
food = []
for f, d in files.items():
    for r in (d if isinstance(d, list) else d.get("food", [])): food.append(r)
def score(r):
    keys = {t[0] for t in r["sources"]} - OPEN
    aw = max([AW.get(k, 0) for k in keys] + [0])
    extra = min(3, len(keys) - (1 if aw else 0))
    t0 = r.setdefault("t0", r["t"])
    return (1.5 if r["n"] in CANON else 0) + aw + 0.75 * max(0, extra - (0 if aw else 1)) + {1: 1.5, 2: 0.5}.get(t0, 0)
by = defaultdict(list)
for r in food: by[r["a"]].append((score(r), r))
changes = []
for a, L in by.items():
    L.sort(key=lambda x: (-x[0], x[1]["n"])); n = len(L)
    c1, c2 = math.ceil(n * 0.35), math.ceil(n * 0.80)
    for i, (s, r) in enumerate(L):   # positional cut (ties broken by the stable name order below)
        new = 1 if i < c1 else 2 if i < c2 else 3
        if r.get("closed"): new = r["t"]
        if new != r["t"]: changes.append((a, r["n"], r["t"], new, round(s, 2)))
        r["t"] = new
for f, d in files.items(): json.dump(d, open(f, "w"), ensure_ascii=False, indent=1)
for c in sorted(changes): print(*c, sep=" | ")
print(len(changes), "tier changes")
