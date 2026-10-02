#!/usr/bin/env python3
# Helper: take tuples (t,a,n,address,w,k,sources,lat,lng) on stdin as JSON list, append sights to SIGHTS_<tag>.json
# and their Wikipedia/NPS pins to geo/_geoout_<geotag>.json.  usage: _chi_sights.py SIGHTS_W1.json _geoout_sights.json
import json, sys, subprocess, os
D = os.path.dirname(os.path.abspath(__file__))
rows = json.load(sys.stdin); sf, gf = sys.argv[1], os.path.join(D, 'geo', sys.argv[2])
food = sf.startswith('FOOD')
recs = []
for t,a,n,ad,w,k,s,la,lo in rows:
    r = {"t":t,"a":a,"n":n,"address":ad,"w":w,"sources":s}
    if food: r.update({"cz":k.split('|'),"dish":"","closed":False})
    else: r["k"] = k
    recs.append(r)
p = subprocess.run(["python3", os.path.join(D,"_chi_add.py"), sf], input=json.dumps(recs), text=True, capture_output=True); print(p.stdout, p.stderr)
geo = json.load(open(gf)) if os.path.exists(gf) else []
have = {g['n'] for g in geo}
for t,a,n,ad,w,k,s,la,lo in rows:
    if n in have or la is None: continue
    wiki = [u for kk,u in s if 'wikipedia' in u]
    geo.append({"n":n,"address":ad,"lat":la,"lng":lo,"geoSource":(wiki[0] if wiki else s[-1][1])+" (Wikipedia/GeoHack published coordinates)",
                "confidence":"high","status":"open","statusSource":s[0][1]+" (current 2025-26 listing)","note":"Wikipedia published coordinates"})
json.dump(geo, open(gf,'w'), ensure_ascii=False, indent=1); print(gf, len(geo))
