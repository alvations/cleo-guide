#!/usr/bin/env python3
# Append food/drink places + their status (and pin if sourced) in one go.
# usage: python3 _sf_food.py FOOD_W5.json _geoout_w5.json < rows.json
# row = [t, area, name, address, w, cz[list], dish, sources[[KEY,url],...], statusSource, lat|null, lng|null, pinSource|"", confidence]
import json, sys, subprocess, os
D = os.path.dirname(os.path.abspath(__file__))
rows = json.load(sys.stdin); ff, gf = sys.argv[1], sys.argv[2]
recs, geo = [], []
for t, a, n, ad, w, cz, dish, s, ss, la, lo, ps, conf in rows:
    recs.append({"t": t, "a": a, "n": n, "address": ad, "w": w, "closed": False, "sources": s, "cz": cz, "dish": dish})
    geo.append({"n": n, "address": ad, "lat": la, "lng": lo, "geoSource": ps, "confidence": conf if la is not None else "UNVERIFIED",
                "status": "open", "statusSource": ss})
out = subprocess.run([sys.executable, os.path.join(D, "_sf_add.py"), ff], input=json.dumps(recs), text=True, capture_output=True).stdout
print(out.strip())
dups = {l.split('skipped: ', 1)[1] for l in out.splitlines() if 'skipped:' in l}
geo = [g for g in geo if g['n'] not in dups]   # never touch another file's geo record for a duplicate
print(subprocess.run([sys.executable, os.path.join(D, "_sf_geo.py"), gf], input=json.dumps(geo), text=True, capture_output=True).stdout.strip())
