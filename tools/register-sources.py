#!/usr/bin/env python3
# register-sources.py — the reusable SOURCE-REGISTRATION step. Reads every data/<city>-research/SOURCES_*.json
# a discovery agent proposed and merges the outlets + creators into data/sources.json cities[<key>] (dedup by
# key). Replaces the ad-hoc "append to sources.json" python one-liners run every wave.
#
# SOURCES_*.json schema (what agents write):
#   {"outlets":[{"key","name","type","url","credible","rank"?}], "creators":[{"key","name","type","scope",
#    "followers","url","verified","credible"}]}
# Outlets missing a rank default to 3; national desks / rating platforms should be flagged corroboration-only
# in their `credible` text (they are never a lone recommender — the sourcing gate already treats Yelp/TripAdvisor
# as zero, and merit still requires ≥2 credible). Creators are corroborating, never institutional authority.
#
#   python3 tools/register-sources.py <city-key>          # e.g. columbus-oh, dayton-oh, cleveland-oh, washington-dc
import json, sys, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}

def research_dir(key):
    full = os.path.join(ROOT, "data", f"{key}-research")
    slug = key if os.path.isdir(full) else key.rsplit("-", 1)[0]
    return os.path.join(ROOT, "data", f"{slug}-research")

def used_source_keys(rdir, slug):
    """Every source key referenced across the city's research records (food arrays, sight objects)."""
    keys = set()
    for p in glob.glob(os.path.join(rdir, "*.json")):
        b = os.path.basename(p)
        if b.startswith(("_", slug[:3] + "_", "geo_", "SOURCES_")) or "dataset" in b:
            continue
        try:
            d = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
        items = d if isinstance(d, list) else (d.get("food", []) + d.get("sights", []))
        for x in items:
            if isinstance(x, dict):
                for t in x.get("sources", []):
                    if isinstance(t, (list, tuple)) and t:
                        keys.add(t[0])
    return keys

def creator_keys(rdir):
    """Keys that are CREATORS (belong in creators[], never sources[])."""
    ks = set()
    for p in glob.glob(os.path.join(rdir, "CREATORS*.json")):
        try:
            j = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
        for c in j.get("creators", []):
            if c.get("key"):
                ks.add(c["key"])
    return ks

def main():
    key = (sys.argv[1] if len(sys.argv) > 1 else "").strip()
    if not key:
        print("usage: python3 tools/register-sources.py <city-key>"); sys.exit(2)
    rdir = research_dir(key)
    files = sorted(glob.glob(os.path.join(rdir, "SOURCES_*.json")))  # may be empty; auto-catch still runs

    sp = os.path.join(ROOT, "data", "sources.json"); s = json.load(open(sp, encoding="utf-8"))
    city = s["cities"].setdefault(key, {"name": key, "sources": [], "creators": []})
    have_s = {x.get("key") for x in city.setdefault("sources", [])}
    have_c = {c.get("key") for c in city.setdefault("creators", [])}
    added_s = added_c = 0
    for f in files:
        j = json.load(open(f, encoding="utf-8"))
        for o in j.get("outlets", []):
            k = o.get("key")
            if not k or k in have_s:
                continue
            city["sources"].append({
                "key": k, "name": o.get("name", k), "type": o.get("type", "editorial"),
                "rank": o.get("rank", 3), "verified": True,
                "credible": o.get("credible", "Registered via a discovery pass; see the research SOURCES_*.json."),
            })
            have_s.add(k); added_s += 1
        for c in j.get("creators", []):
            k = c.get("key")
            if not k or k in have_c:
                continue
            city["creators"].append(c); have_c.add(k); added_c += 1
    # Safety net: auto-catch any source key USED in research files but not yet registered (and not a creator,
    # not an open-check platform). Agents should write SOURCES_*.json with rationale; this guarantees the
    # registry never silently misses a key, and flags the auto-added ones for a rationale pass.
    cks = creator_keys(rdir) | have_c
    slug = os.path.basename(rdir).replace("-research", "")
    auto = sorted(k for k in used_source_keys(rdir, slug)
                  if k and k not in have_s and k not in cks and k not in OPEN_CHECK_ONLY)
    for k in auto:
        city["sources"].append({"key": k, "name": k, "type": "editorial", "rank": 3, "verified": True,
                                "credible": "AUTO-registered from research use — ADD a proper rationale (docs/SOURCES.md)."})
        have_s.add(k)

    json.dump(s, open(sp, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"{key}: registered {added_s} outlet(s) + {added_c} creator(s) from {len(files)} SOURCES_*.json"
          + (f"; AUTO-caught {len(auto)} used-but-unregistered key(s): {', '.join(auto)}" if auto else "")
          + f". Totals now {len(city['sources'])} sources / {len(city['creators'])} creators.")
    if auto:
        print("  ^ give the AUTO-registered keys a real `credible` rationale in data/sources.json.")
    print("  NOTE: source-table display uses each consolidate.py SRC_LABEL / the sight files' embedded `sources`; "
          "unregistered keys still render as the key + gate-count correctly (any non-open-check key counts).")

if __name__ == "__main__":
    main()
