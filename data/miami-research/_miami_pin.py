#!/usr/bin/env python3
# _miami_pin.py — append Apple-Maps / Wikipedia place-pin rows to a geo/_geoout_<tag>.json (session 5).
# Usage: python3 _miami_pin.py <tag> '<json list of [name, lat, lng, appleUrlOrSrc, address, statusNote]>'
# Validates: name exists in the dataset (exact), not already pinned, inside the Miami/Broward/Glades bbox.
import json, sys, os
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(H))
tag, rows = sys.argv[1], json.loads(sys.argv[2])
ds = json.load(open(os.path.join(ROOT, "data/miami.dataset.json")))
names = {r["n"]: r for r in ds["P"] + ds["F"]}
gc = json.load(open(os.path.join(ROOT, "data/geocodes.json")))["cities"]["miami-fl"]
out = os.path.join(H, "geo", f"_geoout_{tag}.json")
cur = json.load(open(out)) if os.path.exists(out) else []
have = {r["n"] for r in cur}
for row in rows:
    n, lat, lng, src, addr, st = row[:6]; conf = row[6] if len(row) > 6 else "high"; note = row[7] if len(row) > 7 else ""
    assert n in names, f"not in dataset: {n}"
    if n in have: print("dup in file, skip:", n); continue
    e = gc.get(n)
    if e and e.get("lat") is not None: print("already pinned, skip:", n); continue
    assert 25.0 < lat < 26.5 and -81.6 < lng < -80.0, f"out of bbox: {n} {lat},{lng}"
    apple = src.startswith("https://maps.apple.com")
    cur.append({"n": n, "address": addr, "lat": lat, "lng": lng, "confidence": conf,
        "geoSource": (f"Apple Maps place pin {lat},{lng} — {src}" if apple else src),
        "status": "open",
        "statusSource": st + " Checked 2026-10-03."})
    if note: cur[-1]["note"] = note
    have.add(n); print("+", n, lat, lng, conf)
json.dump(cur, open(out, "w"), indent=1, ensure_ascii=False)
print(out, len(cur))
