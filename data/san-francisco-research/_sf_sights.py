#!/usr/bin/env python3
# Append sights (or food) + their pins/status to research + geo files in one go.
# usage: python3 _sf_sights.py SIGHTS_W3A.json _geoout_s3a.json < rows.json
# row = [t, area, name, address, w, k, sources[[KEY,url],...], lat|null, lng|null, pinSourceUrl|"", confidence]
import json, sys, subprocess, os
D = os.path.dirname(os.path.abspath(__file__))
rows = json.load(sys.stdin); sf, gf = sys.argv[1], sys.argv[2]
recs, geo = [], []
for t, a, n, ad, w, k, s, la, lo, ps, conf in rows:
    recs.append({"t": t, "a": a, "n": n, "address": ad, "w": w, "k": k, "closed": False, "sources": s})
    geo.append({"n": n, "address": ad, "lat": la, "lng": lo, "geoSource": ps, "confidence": conf if la is not None else "UNVERIFIED",
                "status": "open", "statusSource": s[0][1] + " (current 2025-26 page; public landmark/park)"})
out = subprocess.run([sys.executable, os.path.join(D, "_sf_add.py"), sf], input=json.dumps(recs), text=True, capture_output=True).stdout
print(out.strip())
dups = {l.split('skipped: ', 1)[1] for l in out.splitlines() if 'skipped:' in l}
geo = [g for g in geo if g['n'] not in dups]   # never touch another file's geo record for a duplicate
print(subprocess.run([sys.executable, os.path.join(D, "_sf_geo.py"), gf], input=json.dumps(geo), text=True, capture_output=True).stdout.strip())
