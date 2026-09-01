#!/usr/bin/env python3
# geo-merge.py — the reusable GEOCODE-MERGE step (replaces the per-city geo/_merge_geo.py one-offs and
# the ad-hoc inline merges). Merges a city's geocode-agent output (data/<city>-research/geo/_geoout_*.json)
# into data/geocodes.json under the city key, with the standard schema. UNVERIFIED / null coords are
# recorded as source "UNVERIFIED" so the build's geocode gate holds them (never pins from memory).
#
# It also enforces the CLOSED-marker convention in ONE place: when a geoout record is status=="closed"
# and its name lacks the " — CLOSED" suffix, the tool (a) stores the registry entry under "<name> — CLOSED",
# and (b) renames the matching research record to "<name> — CLOSED" + sets closed:true — so the dataset
# name and the geocode key agree and --statuscheck passes. (docs/SOURCES.md; CLAUDE.md closed-places rule.)
#
#   python3 tools/geo-merge.py <city-key>                 # merge ALL _geoout_*.json for the city
#   python3 tools/geo-merge.py <city-key> --only "_geoout_new*.json"   # merge just some (avoid re-stamping)
#   python3 tools/geo-merge.py <city-key> --date 2026-08-21            # override the verified/checked date
import json, sys, os, glob, argparse, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLOSED_SUFFIX = " — CLOSED"

def entry_is_verified(entry):
    """True iff a registry entry already holds a real, sourced coordinate. An UNVERIFIED incoming
    record must never overwrite one of these (see the merge guard + tools/test-geo-merge.py)."""
    return bool(entry and entry.get("lat") is not None and entry.get("lng") is not None
                and str(entry.get("source", "")).upper() != "UNVERIFIED")

def research_dir(key):
    full = os.path.join(ROOT, "data", f"{key}-research")
    slug = key if os.path.isdir(full) else key.rsplit("-", 1)[0]
    return os.path.join(ROOT, "data", f"{slug}-research"), slug

def rename_research_record(rdir, slug, base_name, marked_name):
    """Find the research record named base_name, rename to marked_name + set closed:true. Returns True if done."""
    files = [p for p in glob.glob(os.path.join(rdir, "*.json"))
             if not os.path.basename(p).startswith(("_", slug[:3] + "_", "geo_", "CREATORS"))
             and "dataset" not in os.path.basename(p)]
    for path in files:
        try:
            d = json.load(open(path, encoding="utf-8"))
        except Exception:
            continue
        items = d if isinstance(d, list) else (d.get("food", []) + d.get("sights", []))
        changed = False
        for x in items:
            if isinstance(x, dict) and x.get("n") == base_name:
                x["n"] = marked_name; x["closed"] = True; changed = True
        if changed:
            json.dump(d, open(path, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
            return True
    return False

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("key")
    ap.add_argument("--only", default="_geoout_*.json", help='glob within geo/ (default all _geoout_*.json)')
    ap.add_argument("--date", default=datetime.date.today().isoformat())
    a = ap.parse_args()
    rdir, slug = research_dir(a.key)
    geodir = os.path.join(rdir, "geo")
    files = sorted(glob.glob(os.path.join(geodir, a.only)))
    if not files:
        print(f"no geoout files matching {a.only} in {geodir}"); sys.exit(1)

    GEOP = os.path.join(ROOT, "data", "geocodes.json")
    g = json.load(open(GEOP, encoding="utf-8"))
    city = g.setdefault("cities", {}).setdefault(a.key, {})
    added = updated = unver = closed = renamed = protected = 0
    closed_renames = []
    for f in files:
        raw = json.load(open(f, encoding="utf-8"))
        # accept either a LIST of {n, ...} records or a DICT keyed by place name -> {...}
        # (geocode agents have emitted both conventions; normalize here so neither breaks the merge).
        records = raw if isinstance(raw, list) else [dict(v, n=k) for k, v in raw.items()]
        for r in records:
            n = r.get("n")
            if not n:
                continue
            conf = (r.get("confidence") or "").lower()
            lat, lng = r.get("lat"), r.get("lng")
            verified = conf != "unverified" and lat is not None and lng is not None
            status = r.get("status", "open")
            # CLOSED-marker convention: mark the key + queue the research rename
            # mark only if the name doesn't ALREADY carry a CLOSED token anywhere — checked
            # case-insensitively on the bare word so an em-dash marker ("X — CLOSED"), a hyphen one
            # a discovery agent wrote ("X - CLOSED"), or a mid-name one ("X — CLOSED (branch)") all
            # count as already-marked; matching only the exact " — CLOSED" suffix double-marks those.
            if status == "closed" and "CLOSED" not in n.upper():
                marked = n + CLOSED_SUFFIX
                if rename_research_record(rdir, slug, n, marked):
                    renamed += 1
                closed_renames.append((n, marked))
                # drop any stale un-marked registry entry so we don't leave a duplicate
                city.pop(n, None)
                n = marked
            # NEVER let an UNVERIFIED record clobber an already-VERIFIED coordinate. geo-merge runs over
            # ALL _geoout_*.json (rebuild-city --build re-merges the whole geo/ dir, sorted, last-write-
            # wins), so without this guard a stale/failed wave that lists a place as low/null can null out
            # a fresh verified pin merely because its filename sorts later. A verified pin is only ever
            # replaced by another VERIFIED record (a real re-verify/upgrade). An unverified record may
            # still refresh the STATUS of an existing verified entry, but must not touch its coordinate.
            existing = city.get(n)
            if not verified and entry_is_verified(existing):
                protected += 1
                if r.get("statusSource") or status != existing.get("status", "open"):
                    existing["status"] = status
                    existing["statusSource"] = r.get("statusSource", existing.get("statusSource", ""))
                    existing["statusChecked"] = a.date
                if status == "closed":
                    closed += 1
                continue
            entry = {
                "address": r.get("address", ""),
                "lat": lat if verified else None,
                "lng": lng if verified else None,
                "source": (r.get("geoSource") or r.get("source") or "") if verified else "UNVERIFIED",
                "verified": a.date,
                "confidence": conf if verified else "UNVERIFIED",
                "status": status,
                "statusSource": r.get("statusSource", ""),
                "statusChecked": a.date,
            }
            if r.get("note"):
                entry["note"] = r["note"]
            if n in city: updated += 1
            else: added += 1
            if not verified: unver += 1
            if status == "closed": closed += 1
            city[n] = entry

    json.dump(g, open(GEOP, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(f"{a.key}: merged {len(files)} file(s) — +{added} new / {updated} updated | "
          f"UNVERIFIED (gate holds): {unver} | protected (kept verified vs stale unverified): {protected} | "
          f"CLOSED: {closed} | registry now {len(city)}")
    if closed_renames:
        print("  closed-marker applied (registry key + research record renamed):")
        for base, mk in closed_renames:
            print(f"    - {base}  ->  {mk}" + ("" if renamed else "  (research record not found — verify)"))

if __name__ == "__main__":
    main()
