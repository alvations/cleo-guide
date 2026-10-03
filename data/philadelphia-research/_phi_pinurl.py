#!/usr/bin/env python3
# _phi_pinurl.py <tag>  < lines "Name|AppleURL[|conf|note]" — parses Apple's coordinate=/ll= and address= from the URL,
# compares the URL's street address with the record's, then appends via _phi_pin.py logic (W6).
import sys, json, re, subprocess, os, urllib.parse
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(H))
ds = json.load(open(os.path.join(ROOT, "data/philadelphia.dataset.json")))
rec = {r["n"]: r for r in ds["P"] + ds["F"]}
rows = []
for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith("#"): continue
    f = line.split("|"); n, url = f[0], f[1]; conf = f[2] if len(f) > 2 and f[2] else "high"; note = f[3] if len(f) > 3 else ""
    q = urllib.parse.parse_qs(urllib.parse.urlsplit(url.replace("&amp;", "&")).query)
    c = (q.get("coordinate") or q.get("ll"))[0]; lat, lng = map(float, c.split(","))
    ad = (q.get("address") or [""])[0].replace(", United States", "").replace("  ", " ")
    r = rec.get(n); assert r, f"not in dataset: {n}"
    num = lambda s: (re.match(r"\s*(\d+)", s) or [None, None])[1]
    if ad and num(ad) != num(r.get("ad", "")):
        print(f"!! ADDRESS MISMATCH {n}: apple '{ad}' vs record '{r.get('ad')}'")
        if conf == "high": continue
    rows.append([n, lat, lng, url, ad or r.get("ad", ""), "", conf, note])
subprocess.run([sys.executable, os.path.join(H, "_phi_pin.py"), sys.argv[1], json.dumps(rows)])
