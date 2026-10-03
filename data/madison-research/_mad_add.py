# helper: append sights/geocodes to wave files (Madison only). usage: imported by one-off snippets
import json
def add_sights(path, recs, srcs=()):
    try: d=json.load(open(path))
    except FileNotFoundError: d={"sights":[],"sources":[]}
    have={x['n'] for x in d['sights']}
    d['sights']+=[r for r in recs if r['n'] not in have]
    hk={s['key'] for s in d['sources']}
    d['sources']+=[s for s in srcs if s['key'] not in hk]
    json.dump(d,open(path,'w'),indent=1,ensure_ascii=False)
def add_geo(path, recs):
    try: g=json.load(open(path))
    except FileNotFoundError: g=[]
    have={x['n'] for x in g}
    g+=[r for r in recs if r['n'] not in have]
    json.dump(g,open(path,'w'),indent=1,ensure_ascii=False)
def W(n,a,lat,lng,src,ss,conf="high",note=None):
    r={"n":n,"address":a,"lat":lat,"lng":lng,"geoSource":src,"confidence":conf,"status":"open","statusSource":ss}
    if note: r["note"]=note
    return r
