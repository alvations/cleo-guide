#!/usr/bin/env python3
# Kyoto helper: compact sight rows (JSON list on stdin) -> SIGHTS file + geoout file.
# row: {"n","a","t","ad","w","g":[..],"s":[[KEY,url],..],"lat","lng","c","gs","ss"}  (lat null => unverified)
import json, sys, subprocess
sf, gf = sys.argv[1], sys.argv[2]
rows = json.load(sys.stdin)
S = [{"t":r["t"],"a":r["a"],"n":r["n"],"address":r["ad"],"w":r["w"],"g":r["g"],"sources":r["s"]} for r in rows]
G = [{"n":r["n"],"address":r["ad"],"lat":r.get("lat"),"lng":r.get("lng"),
      "confidence":r.get("c","high") if r.get("lat") is not None else "unverified",
      "geoSource":r.get("gs",""),"status":"open","statusSource":r.get("ss","")} for r in rows]
for kind, f, data in (("sight", sf, S), ("geo", gf, G)):
    p = subprocess.run([sys.executable, "_kyoto_add.py", kind, f], input=json.dumps(data, ensure_ascii=False), text=True, capture_output=True)
    print(p.stdout.strip(), p.stderr.strip())
