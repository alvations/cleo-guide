#!/usr/bin/env python3
# Kyoto helper: compact food rows (JSON list on stdin) -> FOOD file + geoout (UNVERIFIED unless lat given).
# row: {"n","a","t","cz":[..],"dish","ad","w","s":[[KEY,url],..], "lat","lng","c","gs","ss", "closed"}
import json, sys, subprocess
ff, gf = sys.argv[1], sys.argv[2]
rows = json.load(sys.stdin)
F = [{"t":r["t"],"a":r["a"],"cz":r["cz"],"dish":r["dish"],"n":r["n"],"address":r["ad"],"w":r["w"],
      "closed":r.get("closed",False),"sources":r["s"]} for r in rows]
G = [{"n":r["n"],"address":r["ad"],"lat":r.get("lat"),"lng":r.get("lng"),
      "confidence":r.get("c","high") if r.get("lat") is not None else "unverified",
      "geoSource":r.get("gs","address from the cited source; no place-pin coordinate surfaced via WebSearch — held for tools/geocode-helper.html"),
      "status":"closed" if r.get("closed") else "open",
      "statusSource":r.get("ss","listed in the current MICHELIN Guide Kyoto Osaka selection, checked 2026-10-02")} for r in rows]
for kind, f, data in (("food", ff, F), ("geo", gf, G)):
    p = subprocess.run([sys.executable, "_kyoto_add.py", kind, f], input=json.dumps(data, ensure_ascii=False), text=True, capture_output=True)
    print(p.stdout.strip(), p.stderr.strip())
