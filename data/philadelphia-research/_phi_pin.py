#!/usr/bin/env python3
# _phi_pin.py — append Apple-Maps place-pin rows to geo/_geoout_<tag>.json (W6, after miami _miami_pin.py).
# Usage: python3 _phi_pin.py <tag> '<json list of [name, lat, lng, appleUrlOrSrc, address, statusNote, conf?, note?]>'
# Validates: name exists in the dataset (exact), not already pinned, inside the Philadelphia-region bbox.
import json, sys, os
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(H))
tag, rows = sys.argv[1], json.loads(sys.argv[2])
ds = json.load(open(os.path.join(ROOT, "data/philadelphia.dataset.json")))
names = {r["n"]: r for r in ds["P"] + ds["F"]}
gc = json.load(open(os.path.join(ROOT, "data/geocodes.json")))["cities"]["philadelphia-pa"]
out = os.path.join(H, "geo", f"_geoout_{tag}.json")
cur = json.load(open(out)) if os.path.exists(out) else []
have = {r["n"] for r in cur}
for row in rows:
    n, lat, lng, src, addr, st = row[:6]; conf = row[6] if len(row) > 6 else "high"; note = row[7] if len(row) > 7 else ""
    assert n in names, f"not in dataset: {n}"
    if n in have: print("dup in file, skip:", n); continue
    e = gc.get(n)
    if e and e.get("lat") is not None: print("already pinned, skip:", n); continue
    assert 39.4 < lat < 40.6 and -76.2 < lng < -74.6, f"out of bbox: {n} {lat},{lng}"
    apple = src.startswith("https://maps.apple.com")
    cur.append({"n": n, "address": addr or names[n].get("ad", ""), "lat": lat, "lng": lng, "confidence": conf,
        "geoSource": (f"Apple Maps place pin {lat},{lng} — {src}" if apple else src),
        "status": "open",
        "statusSource": (st or "Apple Maps place listing active (no closure marker); open per 2025-26 discovery sources.") + " Checked 2026-10-03."})
    if note: cur[-1]["note"] = note
    have.add(n); print("+", n, lat, lng, conf)
json.dump(cur, open(out, "w"), indent=1, ensure_ascii=False)
print(out, len(cur))
