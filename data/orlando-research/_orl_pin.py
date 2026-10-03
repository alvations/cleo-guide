# Lead pin writer (W3; W5 default out=_geoout_w5pin.json, env ORL_PIN_OUT): pin(name, lat, lng, conf, geoSource, note) -> geo/_geoout_w3pin.json (status copied from research)
import json,glob,os
D=os.path.dirname(os.path.abspath(__file__)); P=os.path.join(D,"geo",os.environ.get("ORL_PIN_OUT","_geoout_w5pin.json"))
def _rec(n):
    for f in glob.glob(os.path.join(D,"FOOD_*.json")):
        for x in json.load(open(f)):
            if x["n"]==n: return x
    for f in glob.glob(os.path.join(D,"SIGHTS_*.json")):
        for x in json.load(open(f))["sights"]:
            if x["n"]==n: return x
    raise SystemExit("NOT FOUND "+n)
def _status(n):
    st=None
    for f in sorted(glob.glob(os.path.join(D,"geo","_geoout_*.json"))):
        if f==P: continue
        for r in json.load(open(f)):
            if r["n"]==n: st=(r.get("status","open"),r.get("statusSource",""))
    return st or ("open","")
def pin(n,lat,lng,conf,gsrc,note="",addr=None):
    x=_rec(n); s,ss=_status(n)
    L=json.load(open(P)) if os.path.exists(P) else []
    L=[r for r in L if r["n"]!=n]+[dict(n=n,address=addr or x["address"],status=s,statusSource=ss or "Recommended as open in "+x["sources"][0][1],
        lat=lat,lng=lng,confidence=conf,geoSource=gsrc,note=note)]
    json.dump(L,open(P,"w"),indent=1,ensure_ascii=False)
