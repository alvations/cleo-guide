#!/usr/bin/env python3
# test-geo-merge.py — regression guard for the geo-merge "never downgrade a verified pin" invariant.
#
# The bug this pins down: geo-merge runs over ALL _geoout_*.json (rebuild-city --build re-merges the
# whole geo/ dir, sorted, last-write-wins). Before the fix, a stale/failed wave that listed a place as
# low/null could NULL OUT a fresh verified pin merely because its filename sorted later — silently
# losing good coordinates (the same class of silent content loss CLAUDE.md rule 2 warns about). The fix:
# an UNVERIFIED incoming record must never overwrite an existing VERIFIED coordinate.
#
# Two guards here:
#  1. entry_is_verified() classifies correctly.
#  2. Running the REAL tool over the REAL singapore geo/ dir twice is idempotent AND never reduces the
#     number of verified coordinates in the registry (a full merge can only add/keep verified pins).
import json, os, sys, subprocess, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import importlib.util
spec = importlib.util.spec_from_file_location("geomerge", os.path.join(ROOT, "tools", "geo-merge.py"))
gm = importlib.util.module_from_spec(spec); spec.loader.exec_module(gm)

def verified_count(path):
    c = json.load(open(path, encoding="utf-8")).get("cities", {}).get("singapore", {})
    return sum(1 for e in c.values() if gm.entry_is_verified(e))

fails = []

# 1) unit: classifier
assert gm.entry_is_verified({"lat": 10.7, "lng": 106.7, "source": "OSM"}) is True
assert gm.entry_is_verified({"lat": None, "lng": None, "source": "UNVERIFIED"}) is False
assert gm.entry_is_verified({"lat": 10.7, "lng": 106.7, "source": "UNVERIFIED"}) is False
assert gm.entry_is_verified(None) is False
print("PASS  entry_is_verified() classifies verified vs unverified/null correctly")

# 2) invariant on real data: a full merge never REDUCES verified coverage, and is idempotent.
GEOP = os.path.join(ROOT, "data", "geocodes.json")
if glob.glob(os.path.join(ROOT, "data", "singapore-research", "geo", "_geoout_*.json")):
    before = verified_count(GEOP)
    # snapshot so the test never leaves the working tree dirty
    orig = open(GEOP, encoding="utf-8").read()
    try:
        subprocess.run([sys.executable, os.path.join(ROOT, "tools", "geo-merge.py"), "singapore"],
                       cwd=ROOT, check=True, capture_output=True, text=True)
        after1 = verified_count(GEOP)
        subprocess.run([sys.executable, os.path.join(ROOT, "tools", "geo-merge.py"), "singapore"],
                       cwd=ROOT, check=True, capture_output=True, text=True)
        after2 = verified_count(GEOP)
    finally:
        open(GEOP, "w", encoding="utf-8").write(orig)  # restore exactly
    if after1 < before:
        fails.append(f"full merge REDUCED verified coords {before} -> {after1} (a stale unverified geoout clobbered a verified pin)")
    if after2 != after1:
        fails.append(f"merge not idempotent: {after1} then {after2}")
    if not fails:
        print(f"PASS  full merge never downgrades a verified pin (verified {before} -> {after1}, idempotent) ")
else:
    print("SKIP  no singapore geoout files present")

if fails:
    print("\n>>> FAIL — geo-merge downgrade guard broken:")
    for f in fails:
        print("   -", f)
    sys.exit(1)
print("\n>>> PASS — geo-merge never downgrades a verified coordinate.")
