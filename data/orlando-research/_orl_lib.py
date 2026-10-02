# Orlando helper: append sights + geo records to tagged files (write-as-you-go).
import json, os
D=os.path.dirname(os.path.abspath(__file__))
W=lambda t:"https://en.wikipedia.org/wiki/"+t
def _load(p,default):
    return json.load(open(p)) if os.path.exists(p) else default
def sight(tag,t,a,n,ad,w,k,src,lat=None,lng=None,conf="high",closed=False,stsrc="",note="",g=None):
    p=os.path.join(D,f"SIGHTS_{tag}.json"); d=_load(p,{"sources":[],"sights":[]})
    rec=dict(t=t,a=a,n=n,address=ad,w=w,k=k,sources=src)
    if closed: rec["closed"]=True
    if g: rec["g"]=g
    d["sights"]=[s for s in d["sights"] if s["n"]!=n]+[rec]
    json.dump(d,open(p,"w"),indent=1,ensure_ascii=False)
    geo(tag.lower(),n,ad,lat,lng,conf,"closed" if closed else "open",stsrc or (src[0][1]+" (listed as operating)"),note,src[0][1])
def food(tag,t,a,cz,dish,n,ad,w,src,closed=False,lat=None,lng=None,conf="high",stsrc="",note="",geosrc=""):
    p=os.path.join(D,f"FOOD_{tag}.json"); L=_load(p,[])
    L=[x for x in L if x["n"]!=n]+[dict(t=t,a=a,cz=cz,dish=dish,n=n,address=ad,w=w,closed=closed,sources=src)]
    json.dump(L,open(p,"w"),indent=1,ensure_ascii=False)
    geo(tag.lower(),n,ad,lat,lng,conf,"closed" if closed else "open",stsrc or ("Recommended as open in "+src[0][1]),note or "restaurant place-pin not surfaced by WebSearch; queue for geocode-helper",geosrc)
def geo(tag,n,ad,lat,lng,conf,status,stsrc,note,gsrc):
    p=os.path.join(D,"geo",f"_geoout_{tag}.json"); L=_load(p,[])
    r=dict(n=n,address=ad,status=status,statusSource=stsrc)
    if lat is None: r.update(lat=None,lng=None,confidence="UNVERIFIED",note=note or "no published coordinate surfaced; needs a place-pin pass")
    else: r.update(lat=lat,lng=lng,confidence=conf,geoSource=(gsrc if gsrc.startswith("Wiki") else f"Wikipedia published coordinates ({gsrc}): {lat},{lng}"),note=note)
    L=[x for x in L if x["n"]!=n]+[r]
    json.dump(L,open(p,"w"),indent=1,ensure_ascii=False)
def outlets(tag,O):
    p=os.path.join(D,f"SOURCES_{tag}.json"); d=_load(p,{"outlets":[]})
    keys={o["key"] for o in d["outlets"]}; d["outlets"]+= [o for o in O if o["key"] not in keys]
    json.dump(d,open(p,"w"),indent=1,ensure_ascii=False)
