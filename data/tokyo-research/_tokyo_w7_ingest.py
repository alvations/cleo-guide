#!/usr/bin/env python3
# _tokyo_w6_ingest.py — Tokyo W7: vet a background agent's `_w6_*_verified.json` and append the passing records
# to FOOD_TOKYO_W7.json / SIGHTS_TOKYO_W7.json + geo/_geoout_tokyo_w7.json (same split as _add.py).
# Checks (stricter than the build gates): area id valid; >=2 distinct credible keys from different outlets
# (OFFICIAL / Yelp / Google / Tabelog-page never count for food; OFFICIAL counts once for anime sights),
# or one Michelin award key; food has a named dish; pin read from a place pin (`!3d…!4d…` matching lat/lng,
# a Michelin venue page, or Wikipedia/Wikidata) — never a `/@` viewport alone; lat/lng inside the Kantō box;
# name not already on the map (consolidate.py's normalizer). Failures go to _w7_held.json with the reason.
#   python3 _tokyo_w6_ingest.py _w7_x_verified.json [--dry]
import json, os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
AREAS = {"CYD","CHUO","MNT","SJK","SBY","TAITO","SMKT","JONAN","JOSAI","JHOKU","JOTO","TAMA","KANTO"}
ZERO = {"YELP","TRIPADVISOR","GOOGLE","GOOGLEMAPS","TABELOG","RETTY","OPENTABLE","KLOOK","KKDAY"}
SOLO = {"MICHELIN","MICHELIN_BIB","MICHELIN_STAR","MICHELINJP"}
STOP = {'the','restaurant','cafe','café','and','of','a','honten','main','store','shop','branch','ten','ya','tei','no'}
def norm(n):
    s = re.sub(r'\(.*?\)', '', n.lower()).replace('’',' ').replace("'",' ')
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return ' '.join(t for t in s.split() if t not in STOP)

def existing():
    names = set()
    for f in os.listdir(D):
        p = os.path.join(D, f)
        if f.startswith("FOOD_") and f.endswith(".json"): names |= {norm(x["n"]) for x in json.load(open(p))}
        if f.startswith("SIGHTS_") and f.endswith(".json"): names |= {norm(x["n"]) for x in json.load(open(p))["sights"]}
    return names

def pin_ok(r):
    if r.get("lat") is None: return "unverified"
    lat, lng = float(r["lat"]), float(r["lng"])
    if not (34.9 <= lat <= 37.0 and 138.4 <= lng <= 140.4): return "out-of-box"
    gs = r.get("gs", "")
    m = re.search(r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)', gs)
    if m:
        if abs(float(m.group(1)) - lat) > 1e-4 or abs(float(m.group(2)) - lng) > 1e-4: return "lat/lng != !3d!4d"
        return "ok"
    if re.search(r'michelin|wikipedia|wikidata', gs, re.I): return "ok"
    return "no place-pin evidence"

def main():
    src = sys.argv[1]; dry = "--dry" in sys.argv
    recs = json.load(open(os.path.join(D, src)))
    have = existing()
    held_p = os.path.join(D, "_w7_held.json")
    held = json.load(open(held_p)) if os.path.exists(held_p) else []
    food, sights = [], []
    for r in recs:
        why = []
        is_food = r.get("kind", "food") != "sight"
        if r.get("a") not in AREAS: why.append(f"bad area {r.get('a')}")
        keys = {s[0].upper() for s in r.get("sources", []) if s and s[0]}
        urls = {s[1] for s in r.get("sources", []) if len(s) > 1}
        cnt = keys - ZERO - ({"OFFICIAL"} if is_food else set())
        if not (len(cnt) >= 2 and len(urls) >= 2) and not (keys & SOLO): why.append(f"sources {sorted(keys)}")
        if is_food and not (r.get("dish") or "").strip(): why.append("no dish")
        if not (r.get("w") or "").strip() or r.get("t") not in (1, 2, 3): why.append("missing w/t")
        if is_food and not r.get("cz"): why.append("missing cz")
        if norm(r["n"]) in have: why.append("duplicate")
        p = pin_ok(r)
        if p not in ("ok", "unverified"): why.append("pin: " + p)
        if why:
            held.append({"n": r["n"], "from": src, "why": "; ".join(why), "rec": r}); continue
        rec = {k: v for k, v in r.items() if k not in ("kind", "notes")}
        if p == "unverified":
            rec["lat"] = None; rec["lng"] = None; rec["conf"] = "unverified"; rec["gs"] = "UNVERIFIED"
        rec.setdefault("st", "open")
        if rec["st"] == "closed" and not rec["n"].endswith("— CLOSED"): rec["n"] += " — CLOSED"
        (food if is_food else sights).append(rec); have.add(norm(r["n"]))
    print(f"{src}: {len(food)} food + {len(sights)} sights pass; held total {len(held)}")
    for h in held:
        if h["from"] == src: print("  HELD", h["n"], "—", h["why"])
    if dry: return
    import subprocess
    for fname, rs in (("FOOD_TOKYO_W7.json", food), ("SIGHTS_TOKYO_W7.json", sights)):
        if rs:
            out = subprocess.run([sys.executable, os.path.join(D, "_tokyo_w6_add.py")], input=json.dumps(
                {"file": fname, "geo": "_geoout_tokyo_w7.json", "recs": rs}), text=True, capture_output=True)
            print(out.stdout.strip(), out.stderr.strip())
    json.dump(held, open(held_p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)

main()
