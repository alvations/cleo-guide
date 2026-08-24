#!/usr/bin/env python3
# add-to-cleveland.py — the SAFE engine splicer. Cleveland is the repo's engine page (cleveland.html) with
# inline data (const P / const F) and hard validator invariants — NOT a dataset build. This tool splices new
# researched places into those arrays with the mandatory guards (CLAUDE.md rule 2: assert record counts before
# and after; refuse on any loss). It reads:
#   - data/cleveland-research/FOOD_LAKEWOOD.json / SIGHTS_<tag>.json   (records: {t,a,n,address,w,k?,cz?,closed?,sources})
#   - data/geocodes.json cities["cleveland-oh"]                        (verified coords; un-geocoded are DROPPED, like GATE 2)
#   - data/cleveland-research/SOURCES_<tag>.json (optional)            ({outlets:[{key,name,url}]}) for new S/FS table rows
# It maps research cuisine labels -> Cleveland's short codes, escapes strings via json, inserts before each
# array's closing "]", adds any missing source-table rows to S (sights) / FS (food), then asserts:
#   new_P == old_P + added_P ; new_F == old_F + added_F ; every coord inside validate.js BOX ; no duplicate name.
# On ANY failure it writes nothing. After it runs, ALWAYS: cd tools && npm run validate && npm test.
#
#   python3 tools/add-to-cleveland.py --food FOOD_LAKEWOOD.json --sights SIGHTS_LAKEWOOD.json [--dry-run]
import json, os, re, sys, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLE = os.path.join(ROOT, "cleveland.html")
RDIR = os.path.join(ROOT, "data", "cleveland-research")
BOX = {"latMin": 40.9, "latMax": 42.1, "lngMin": -82.6, "lngMax": -80.8}
OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}
CLOSED_SUFFIX = " — CLOSED"
# research cuisine label -> Cleveland CUISINES code (US is the catch-all for anything without a distinct code)
CZMAP = {
    "Vietnamese": "VN", "Pho": "VN", "Singaporean": "SG", "Malaysian": "SG", "Thai": "SEA", "Lao": "SEA",
    "Filipino": "SEA", "Indonesian": "SEA", "Chinese": "CN", "Sichuan": "CN", "Cantonese": "CN", "Taiwanese": "CN",
    "Japanese": "CN", "Sushi": "CN", "Korean": "CN", "French": "EU", "Italian": "EU", "German": "EU",
    "European": "EU", "Polish": "EU", "Hungarian": "EU", "Latin American": "LAT", "Brazilian": "LAT",
    "Mexican": "LAT", "Peruvian": "LAT", "Cuban": "LAT", "Middle Eastern": "ME", "Mediterranean": "ME",
    "Lebanese": "ME", "Turkish": "ME", "Israeli": "ME", "Persian": "ME", "Ethiopian": "ME",
    "Dessert": "DES", "Bakery": "DES", "Ice Cream": "DES", "Coffee": "DES", "Cafe": "DES",
    "American": "US", "New American": "US", "Seafood": "US", "Brewery": "US", "Bar": "US", "Gastropub": "US",
    "Brunch": "US", "Vegetarian": "US", "Vegan": "US", "Soul Food": "US", "BBQ": "US", "Pizza": "US", "Burgers": "US",
}

def load(name):
    p = os.path.join(RDIR, name)
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else None

def array_block(html, marker):
    i = html.index(marker); j = html.index("\n]", i)
    return i, j, html[i:j]

def count_records(block):
    return len(re.findall(r'\bn:"', block))

def esc(s):  # exact JS string literal with correct \u escaping
    return json.dumps(s if s is not None else "", ensure_ascii=True)

def cz_codes(labels):
    out = []
    for l in labels or []:
        c = CZMAP.get(l) or CZMAP.get(l.strip()) or "US"
        if c not in out:
            out.append(c)
    return out or ["US"]

def rec_str(r, geo, is_food):
    n = r["n"]
    e = geo.get(n)
    if not e or e.get("lat") is None or e.get("lng") is None or not e.get("source") or e.get("source") == "UNVERIFIED":
        return None  # GATE 2: drop un-geocoded
    parts = [f't:{int(r["t"])}', f'a:{esc(r["a"])}']
    if is_food:
        parts.append("cz:[" + ",".join(esc(c) for c in cz_codes(r.get("cz"))) + "]")
    parts += [f'n:{esc(n)}', f'ad:{esc(r.get("address",""))}',
              f'la:{e["lat"]}', f'ln:{e["lng"]}', f'w:{esc(r.get("w",""))}']
    if r.get("k"):
        parts.append(f'k:{esc(r["k"])}')
    if r.get("closed"):
        parts.append("closed:1")
    src = [t for t in r.get("sources", []) if t and t[0]]
    parts.append("s:[" + ",".join(f'[{esc(t[0])},{esc(t[1] if len(t)>1 else "")}]' for t in src) + "]")
    return "{" + ",".join(parts) + "}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--food"); ap.add_argument("--sights")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    html = open(CLE, encoding="utf-8").read()
    geo = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"].get("cleveland-oh", {})

    # existing names (dup guard) across P + F
    existing = set(re.findall(r'\bn:"((?:[^"\\]|\\.)*)"', html))
    def decode(x):
        try: return json.loads('"' + x + '"')
        except Exception: return x
    existing = {decode(x) for x in existing}

    added = {"P": [], "F": [], "dropped": [], "dupe": []}
    def build(records, is_food, bucket):
        for r in records or []:
            n = r["n"]
            if r.get("closed") and not n.endswith(CLOSED_SUFFIX):
                r = dict(r); r["n"] = n = n + CLOSED_SUFFIX
            if n in existing:
                added["dupe"].append(n); continue
            s = rec_str(r, geo, is_food)
            if s is None:
                added["dropped"].append(n); continue
            # bbox check
            e = geo.get(r["n"]) or geo.get(n)
            if not (BOX["latMin"] <= e["lat"] <= BOX["latMax"] and BOX["lngMin"] <= e["lng"] <= BOX["lngMax"]):
                print(f"!! {n} coord out of Cleveland bbox — aborting"); sys.exit(1)
            bucket.append(s); existing.add(n)

    def as_list(x):
        if x is None: return []
        return x if isinstance(x, list) else x.get("sights", x.get("food", []))
    sights_records = as_list(load(a.sights)) if a.sights else []
    food_records = as_list(load(a.food)) if a.food else []
    build(sights_records, False, added["P"])
    build(food_records, True, added["F"])

    # splice into arrays (before each "\n]")
    for marker, key in (("const P = [", "P"), ("const F = [", "F")):
        if not added[key]:
            continue
        i, j, block = array_block(html, marker)
        old = count_records(block)
        insertion = "\n" + ",\n".join(added[key])
        html = html[:j] + ("," if block.rstrip().endswith("}") else "") + insertion + html[j:]
        i2, j2, block2 = array_block(html, marker)
        new = count_records(block2)
        assert new == old + len(added[key]), f"RECORD-COUNT ASSERT FAILED for {key}: {old}+{len(added[key])} != {new}"

    # add missing source-table rows to S (sights) / FS (food)
    src_meta = {}
    for sf in (load(a.food.replace("FOOD", "SOURCES")) if a.food else None,
               load(a.sights.replace("SIGHTS", "SOURCES")) if a.sights else None,
               load("SOURCES_LAKEWOOD.json")):
        if sf:
            for o in sf.get("outlets", []):
                src_meta[o["key"]] = {"k": o.get("name", o["key"]).upper()[:40], "t": o.get("name", o["key"]),
                                      "u": o.get("url", ""), "l": o.get("name", o["key"])}
    def add_rows(tbl_marker, records):
        nonlocal html
        i = html.index(tbl_marker); j = html.index("\n}", i)
        present = set(re.findall(r'\n  (\w+):\{', html[i:j]))
        need = []
        for r in records or []:
            for t in r.get("sources", []):
                k = t[0]
                if k and k not in present and k not in OPEN_CHECK_ONLY and k not in [x.split(":")[0] for x in need]:
                    m = src_meta.get(k, {"k": k, "t": k, "u": (t[1] if len(t) > 1 else ""), "l": k})
                    need.append(f'{k}:{{k:{esc(m["k"])},t:{esc(m["t"])},u:{esc(m["u"])},l:{esc(m["l"])}}}')
                    present.add(k)
        if need:
            html = html[:j] + ",\n  " + ",\n  ".join(need) + html[j:]
    add_rows("const S = {", sights_records)
    add_rows("const FS = {", food_records)

    print(f"Cleveland splice: +{len(added['P'])} sights, +{len(added['F'])} food | "
          f"dropped un-geocoded: {len(added['dropped'])} | skipped dupes: {len(added['dupe'])}")
    if added["dropped"]:
        print("  UNVERIFIED (need geocode-helper, not spliced):", ", ".join(added["dropped"]))
    if added["dupe"]:
        print("  already in engine (skipped):", ", ".join(added["dupe"]))
    if a.dry_run:
        print("  --dry-run: nothing written. Re-run without --dry-run, then: cd tools && npm run validate && npm test")
        return
    open(CLE, "w", encoding="utf-8").write(html)
    print("  WROTE cleveland.html. NOW RUN: cd tools && npm run validate && npm test")

if __name__ == "__main__":
    main()
