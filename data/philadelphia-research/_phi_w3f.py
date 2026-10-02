#!/usr/bin/env python3
# _phi_w3f.py FILE.json [--sights]  < lines "AREA|tier|cz1,cz2|dish|name|address|why|KEY=url;KEY=url[|kind]"
# (sights: cz/dish fields left empty; 9th field = k). Converts to records and appends via _phi_add.py (dedupe).
import json, sys, os, subprocess
D = os.path.dirname(os.path.abspath(__file__)); sights = "--sights" in sys.argv
out = []
for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith("#"): continue
    f = line.split("|")
    a, t, cz, dish, n, ad, w, src = f[:8]
    srcs = [s.split("=", 1) for s in src.split(";") if s]
    assert all(len(s) == 2 for s in srcs), n
    r = {"t": int(t), "a": a, "n": n, "address": ad, "w": w, "sources": srcs}
    if sights:
        if len(f) > 8 and f[8]: r["k"] = f[8]
    else:
        r.update({"cz": [c.strip() for c in cz.split(",") if c.strip()], "dish": dish, "closed": "CLOSED" in n})
    out.append(r)
payload = {"sights": out, "sources": []} if sights else out
args = [sys.executable, os.path.join(D, "_phi_add.py"), sys.argv[1]] + (["--sights"] if sights else [])
r = subprocess.run(args, input=json.dumps(payload), text=True, capture_output=True); print(r.stdout, r.stderr)
