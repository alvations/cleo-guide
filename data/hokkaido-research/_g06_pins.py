#!/usr/bin/env python3
# _g06_pins.py — G06 (session 6): restaurant/sight place pins from NAVITIME POI pages (navitime.co.jp/poi?spot=…),
# whose WebSearch summaries print the venue's 緯度経度. Input on stdin, one per line:
#   <exact record name>|<NAVITIME address>|<lat>|<lng>|<navitime poi url>
# Appends to geo/_geoout_hokkaido_g06.json (dedup by name); carries over the record's existing status/statusSource.
import json, os, sys
D=os.path.dirname(os.path.abspath(__file__)); P=os.path.join(D,"geo","_geoout_hokkaido_g06.json")
G=json.load(open(os.path.join(D,"..","geocodes.json")))["cities"]["hokkaido"]
names={x["n"] for k in ("P","F") for x in json.load(open(os.path.join(D,"..","hokkaido.dataset.json")))[k]}
out=json.load(open(P)) if os.path.exists(P) else []; have={x["n"] for x in out}; n0=len(out)
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    n,a,la,ln,u=[x.strip() for x in line.split("|")]
    assert n in names, f"unknown record name: {n}"
    if n in have: print("dup", n); continue
    old=G.get(n,{})
    out.append({"n":n,"address":a,"lat":float(la),"lng":float(ln),"confidence":"med",
      "geoSource":f"NAVITIME POI {u} — 緯度経度 printed in WebSearch summary (2026-10-03, G06)",
      "status":old.get("status","open"),"statusSource":old.get("statusSource") or f"NAVITIME POI listing live 2026-10-03 ({u})"})
    have.add(n)
json.dump(out,open(P,"w"),ensure_ascii=False,indent=1); print(f"g06: {n0} -> {len(out)}")
