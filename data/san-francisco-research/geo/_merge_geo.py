#!/usr/bin/env python3
# Merge geocode-agent output (_geoout_*.json) into data/geocodes.json under san-francisco-ca.
# Schema mirrors existing entries. UNVERIFIED / null coords are recorded as source "UNVERIFIED"
# so the build's geocode gate drops them (never pins from memory).
import json, glob, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
GEOP = os.path.join(ROOT, "data", "geocodes.json")
DATE = "2026-08-14"

g = json.load(open(GEOP, encoding="utf-8"))
city = g.setdefault("cities", {}).setdefault("san-francisco-ca", {})
added = updated = unver = closed = 0
for f in sorted(glob.glob(os.path.join(HERE, "_geoout_*.json"))):
    for r in json.load(open(f, encoding="utf-8")):
        n = r.get("n")
        if not n:
            continue
        conf = (r.get("confidence") or "").lower()
        lat, lng = r.get("lat"), r.get("lng")
        verified = conf != "unverified" and lat is not None and lng is not None
        entry = {
            "address": r.get("address", ""),
            "lat": lat if verified else None,
            "lng": lng if verified else None,
            "source": r.get("geoSource", "") if verified else "UNVERIFIED",
            "verified": DATE,
            "confidence": conf if verified else "UNVERIFIED",
            "status": r.get("status", "open"),
            "statusSource": r.get("statusSource", ""),
            "statusChecked": DATE,
        }
        if r.get("note"):
            entry["note"] = r["note"]
        if n in city: updated += 1
        else: added += 1
        if not verified: unver += 1
        if entry["status"] == "closed": closed += 1
        city[n] = entry

json.dump(g, open(GEOP, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"merged geocodes: +{added} new / {updated} updated | UNVERIFIED (gate will drop): {unver} | flagged CLOSED: {closed}")
print(f"san-francisco-ca registry entries now: {len(city)}")
