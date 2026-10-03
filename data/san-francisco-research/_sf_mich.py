#!/usr/bin/env python3
# Build Michelin-listed records (lone institutional authority) from compact tuples + their geo/status stubs.
# usage: python3 _sf_mich.py FOOD_FILE GEO_FILE < tuples.json   tuple = [t, area, name, address, cuisines, dish, w, slug, kind]
# kind: STAR | BIB | PLATE  (MICHELIN_STAR / MICHELIN_BIB / MICHELIN listing). URL = guide.michelin.com venue page.
import json, sys, subprocess, os
D = os.path.dirname(os.path.abspath(__file__))
K = {"STAR": "MICHELIN_STAR", "BIB": "MICHELIN_BIB", "PLATE": "MICHELIN"}
recs, geo = [], []
for t, a, n, ad, cz, dish, w, slug, kind in json.load(sys.stdin):
    url = slug if slug.startswith("http") else f"https://guide.michelin.com/us/en/california/san-francisco/restaurant/{slug}"
    recs.append(dict(t=t, a=a, n=n, address=ad, cz=cz, dish=dish, w=w, closed=False, sources=[[K[kind], url]]))
    geo.append(dict(n=n, address=ad, lat=None, lng=None, geoSource="", status="open",
                    statusSource=f"{url} — current MICHELIN Guide listing (checked 2026-10-02)"))
for prog, arg, data in (("_sf_add.py", sys.argv[1], recs), ("_sf_geo.py", sys.argv[2], geo)):
    print(subprocess.run([sys.executable, os.path.join(D, prog), arg], input=json.dumps(data), text=True, capture_output=True).stdout.strip())
