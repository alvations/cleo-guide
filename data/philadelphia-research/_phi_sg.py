#!/usr/bin/env python3
# _phi_sg.py SIGHTSFILE GEOFILE < json {"sights":[{..., "geo":[lat,lng,conf,geoSource,statusSource]}], "sources":[]}
# Appends sights (via _phi_add rules) and their verified Wikipedia geocodes in one step.
import json, sys, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
d = json.load(sys.stdin); geo = []
for s in d["sights"]:
    g = s.pop("geo", None)
    if g: geo.append(f'{s["n"]}|{g[0]}|{g[1]}|{g[3]}|{g[2]}|open|{g[4]}')
r = subprocess.run([sys.executable, os.path.join(D, "_phi_add.py"), sys.argv[1], "--sights"], input=json.dumps(d), text=True, capture_output=True); print(r.stdout, r.stderr)
r = subprocess.run([sys.executable, os.path.join(D, "_phi_geo.py"), sys.argv[2]], input="\n".join(geo), text=True, capture_output=True); print(r.stdout, r.stderr)
