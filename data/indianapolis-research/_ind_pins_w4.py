#!/usr/bin/env python3
# W4 pin stage (2026-10-03): merges the pin sub-agent's rows (geo/_pins_w4agent.json — Waze place records /
# usarestaurants.info listings via WebSearch, coordinates copied verbatim) into geo/_geoout_w4pins.json, copying the
# record's address/status from the latest existing geo row. Address differences reported by the pin source go in the note.
import json, glob, os
D = os.path.dirname(os.path.abspath(__file__))
prev = {}
for f in sorted(glob.glob(os.path.join(D, "geo", "_geoout_*.json"))):
    if f.endswith("_w4pins.json"): continue
    for g in json.load(open(f, encoding="utf-8")): prev[g["n"]] = g
out = []
for p in json.load(open(os.path.join(D, "geo", "_pins_w4agent.json"), encoding="utf-8")):
    r = prev[p["n"]]  # KeyError = name mismatch, fail loudly
    note = p.get("note", "")
    if p.get("address") and p["address"].split(",")[0].lower() != r["address"].split(",")[0].lower():
        note += " | pin source address: " + p["address"]
    out.append({"n": p["n"], "address": r["address"], "lat": p["lat"], "lng": p["lng"], "geoSource": p["geoSource"],
                "confidence": p["confidence"], "status": r.get("status", "open"), "statusSource": r.get("statusSource", ""), "note": note})
json.dump(out, open(os.path.join(D, "geo", "_geoout_w4pins.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("pins", len(out))
