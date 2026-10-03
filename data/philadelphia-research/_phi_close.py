#!/usr/bin/env python3
# _phi_close.py '<json list of [name, statusSource]>' — flag a place CLOSED (W6): renames the record "<name> — CLOSED" in its
# FOOD_*/SIGHTS_* file (closed:true) and appends a closed-status row to geo/_geoout_w6s.json. Closed places stay, flagged.
import json, sys, os, glob
H = os.path.dirname(os.path.abspath(__file__))
rows = json.loads(sys.argv[1]); out = os.path.join(H, "geo", "_geoout_w6s.json")
cur = json.load(open(out)) if os.path.exists(out) else []
for n, src in rows:
    hit = False
    for f in sorted(glob.glob(os.path.join(H, "FOOD_*.json")) + glob.glob(os.path.join(H, "SIGHTS_*.json"))):
        d = json.load(open(f)); L = d if isinstance(d, list) else d.get("places", d)
        for r in L:
            if r.get("n") == n:
                r["n"] = n + " — CLOSED"; r["closed"] = True; hit = True; addr = r.get("address", r.get("ad", ""))
        if hit: json.dump(d, open(f, "w"), indent=1, ensure_ascii=False); print("renamed in", os.path.basename(f)); break
    assert hit, f"not found: {n}"
    cur.append({"n": n + " — CLOSED", "address": addr, "lat": None, "lng": None, "geoSource": "UNVERIFIED", "confidence": "UNVERIFIED",
                "status": "closed", "statusSource": src, "note": "Flagged closed in W6 (2026-10-03); kept, not deleted."})
json.dump(cur, open(out, "w"), indent=1, ensure_ascii=False); print(out, len(cur))
