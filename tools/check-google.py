#!/usr/bin/env python3
# check-google.py — repo-wide guard: NO map may carry the Google base-map "API key" surface.
#
# The Cleveland engine once shipped an optional Google base-layer system (key-required g_* layers, an
# "ADD GOOGLE API KEY" button, setGoogle()/promptKey()/GoogleMutant loader). It surfaced "API key
# required" to viewers on every page cloned from the engine — US cities AND the SEA pastel pages. It has
# been stripped everywhere (tools/strip-google-basemap.py) and the guides use only free CARTO/OSM/Esri
# tiles. This scans EVERY map HTML in the repo for the forbidden tokens so it can never come back — wired
# into `npm test`. (fonts.googleapis.com stylesheet links are allowed; the Maps tile API + key UI are not.)
import glob, os, sys
from engine_guard import FORBIDDEN

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def maps():
    fs = [os.path.join(ROOT, "cleveland.html"), os.path.join(ROOT, "index.html")]
    fs += sorted(glob.glob(os.path.join(ROOT, "cities", "*.html")))
    fs += sorted(glob.glob(os.path.join(ROOT, "Singapore", "*.html")))
    return [f for f in fs if os.path.exists(f)]

def main():
    bad = False; n = 0
    for f in maps():
        n += 1
        h = open(f, encoding="utf-8").read().replace("https://fonts.googleapis.com", "")
        hits = [t for t in FORBIDDEN if t in h]
        if hits:
            bad = True
            print(f"  FAIL  {os.path.relpath(f, ROOT)}: Google base-map surface present {hits}")
    if bad:
        print(">>> FAIL — a map carries the Google 'API key' surface. Strip it: "
              "python3 tools/strip-google-basemap.py <file>")
        sys.exit(1)
    print(f">>> PASS — {n} maps clean; no Google 'API key' base-map surface anywhere.")

if __name__ == "__main__":
    main()
