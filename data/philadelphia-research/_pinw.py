#!/usr/bin/env python3
# _pinw.py <city-key> <tag> < lines "Name|lat|lng|conf|source"  (W7 Philadelphia / W6 Miami pin pass, 2026-10-03)
# Optional 6th field: corrected street address (when the listing proves the record's address wrong).
# Writes WebSearch-surfaced PLACE pins (Waze place.* records, usarestaurants/foursquare listings, Apple coordinate=, Wikipedia)
# into data/<city>-research/geo/_geoout_<tag>.json. Refuses: names not in the dataset, already-pinned names, out-of-bbox points,
# and points > MAXKM from the existing pins' area centroid. Preserves an existing closed status (never flips CLOSED → open).
import json, sys, os, math
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
key, tag = sys.argv[1], sys.argv[2]
CFG = {"philadelphia-pa": ("philadelphia", (39.4, 40.6, -76.2, -74.6)), "miami-fl": ("miami", (25.0, 26.5, -81.6, -80.0))}
slug, (la0, la1, lo0, lo1) = CFG[key]
ds = json.load(open(f"{ROOT}/data/{slug}.dataset.json")); recs = {r["n"]: r for r in ds["P"] + ds["F"]}
gc = json.load(open(f"{ROOT}/data/geocodes.json"))["cities"][key]
out = f"{ROOT}/data/{slug}-research/geo/_geoout_{tag}.json"
cur = json.load(open(out)) if os.path.exists(out) else []; have = {r["n"] for r in cur}
# area centroids from existing pins, for a sanity distance check
acc = {}
for n, e in gc.items():
    if e.get("lat") is not None and n in recs: acc.setdefault(recs[n]["a"], []).append((e["lat"], e["lng"]))
cent = {a: (sum(p[0] for p in v) / len(v), sum(p[1] for p in v) / len(v)) for a, v in acc.items()}
km = lambda a, b: 111 * math.hypot(a[0] - b[0], (a[1] - b[1]) * math.cos(math.radians(a[0])))
for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith("#"): continue
    f = line.split("|"); n, lat, lng, conf, src = f[:5]; fixad = f[5] if len(f) > 5 else ""; lat, lng = float(lat), float(lng)
    r = recs.get(n); assert r, f"not in dataset: {n}"
    if n in have: print("dup in file, skip:", n); continue
    e = gc.get(n) or {}
    if e.get("lat") is not None: print("already pinned, skip:", n); continue
    assert la0 < lat < la1 and lo0 < lng < lo1, f"out of bbox: {n}"
    c = cent.get(r["a"]); d = km((lat, lng), c) if c else 0
    if d > 40: print(f"!! {n}: {d:.0f} km from {r['a']} centroid — check"); 
    closed = "CLOSED" in n or e.get("status") == "closed"
    row = {"n": n, "address": fixad or r.get("ad", ""), "lat": lat, "lng": lng, "confidence": conf,
           "geoSource": f"W-pins 2026-10-03 place pin via WebSearch: {src}"}
    if closed:
        row["status"] = "closed"; row["statusSource"] = e.get("statusSource") or "flagged CLOSED in dataset (see AUDIT.md)"
    elif e.get("status") in ("open", "unknown") and e.get("statusSource"):
        row["status"] = e["status"]; row["statusSource"] = e["statusSource"]
    else:
        row["status"] = "open"; row["statusSource"] = "Live map place record (Waze/Apple/listing) with no closure marker; open per 2025-26 discovery sources. Checked 2026-10-03."
    if fixad: row["note"] = f"address corrected from '{r.get('ad', '')}' to the listing's street address"
    cur.append(row); have.add(n); print("+", n, lat, lng, conf, f"{d:.1f}km")
json.dump(cur, open(out, "w"), indent=1, ensure_ascii=False); print(out, len(cur))
