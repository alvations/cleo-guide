#!/usr/bin/env python3
# Okinawa-agent append helper (not a dataset file; leading "_" so consolidate skips it).
# usage: python3 _okinawa_add.py F|S|G TAG < records.json
import json,sys,os
R=os.path.dirname(os.path.abspath(__file__))
AREAS={"NAHA","CHUBU","NANBU","HOKBU","KRM","MYK","YAEYA"}
kind,tag=sys.argv[1],sys.argv[2]
recs=json.load(sys.stdin); recs=recs if isinstance(recs,list) else [recs]
if kind=="F":
    p=f"{R}/FOOD_OKINAWA_{tag}.json"; d=json.load(open(p)) if os.path.exists(p) else []; L=d
elif kind=="S":
    p=f"{R}/SIGHTS_OKINAWA_{tag}.json"; d=json.load(open(p)) if os.path.exists(p) else {"sources":[],"sights":[]}; L=d["sights"]
else:
    p=f"{R}/geo/_geoout_okinawa_{tag}.json"; d=json.load(open(p)) if os.path.exists(p) else []; L=d
names={x["n"] for x in L}
for r in recs:
    if kind in "FS":
        assert r["a"] in AREAS and r.get("sources"), r
        if kind=="F": assert r.get("dish"), r; r.setdefault("closed",False)
    else: r.setdefault("status","open")
    if r["n"] in names: print("dup skipped:",r["n"]); continue
    L.append(r); names.add(r["n"])
json.dump(d,open(p,"w"),ensure_ascii=False,indent=1); print(kind,tag,"->",len(L))
