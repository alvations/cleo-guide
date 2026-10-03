#!/usr/bin/env python3
# _jp_navipins.py — PINS-ONLY pass for the Japan maps (2026-10-03, wave P1): NAVITIME POI place pins
# (navitime.co.jp/poi?spot=…) whose WebSearch summaries print the venue's 緯度経度 (WGS84) + block address.
#   python3 tools/_jp_navipins.py <city> <tag>   < lines "<exact record name>|<NAVITIME address>|<lat>|<lng>|<url>[|high]"
# Appends to data/<city>-research/geo/_geoout_<city>_<tag>.json (dedup by name); keeps the record's status.
import json, os, sys
city, tag = sys.argv[1], sys.argv[2]
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(R, "data", f"{city}-research", "geo", f"_geoout_{city}_{tag}.json")
G = json.load(open(os.path.join(R, "data", "geocodes.json")))["cities"].get(city, {})
D = json.load(open(os.path.join(R, "data", f"{city}.dataset.json")))
names = {x["n"] for k in ("P", "F") for x in D[k]}
out = json.load(open(P)) if os.path.exists(P) else []
have = {x["n"] for x in out}; n0 = len(out)
BOX = {"tokyo": (35.4, 35.95, 139.0, 140.0), "kyoto": (34.7, 35.8, 135.4, 136.1), "hokkaido": (41.3, 45.6, 139.3, 145.9)}[city]
for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith("#"): continue
    f = [x.strip() for x in line.split("|")]
    n, a, la, ln, u = f[:5]; conf = f[5] if len(f) > 5 else "med"
    assert n in names, f"unknown record name: {n}"
    la, ln = float(la), float(ln)
    assert BOX[0] < la < BOX[1] and BOX[2] < ln < BOX[3], f"out of box: {n} {la},{ln}"
    if n in have: print("dup", n); continue
    old = G.get(n, {})
    out.append({"n": n, "address": a, "lat": la, "lng": ln, "confidence": conf,
        "geoSource": f"NAVITIME POI {u} — 緯度経度 printed in WebSearch summary, address matched to record (2026-10-03, {tag.upper()})",
        "status": old.get("status", "open"),
        "statusSource": old.get("statusSource") or f"NAVITIME POI listing live 2026-10-03 ({u})"})
    have.add(n)
os.makedirs(os.path.dirname(P), exist_ok=True)
json.dump(out, open(P, "w"), ensure_ascii=False, indent=1); print(f"{city} {tag}: {n0} -> {len(out)}")
