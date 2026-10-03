# Append corroborating sources to existing records (sights or food), by exact name.  usage: addsrc(name,[[KEY,url],...])
import json,glob,os
D=os.path.dirname(os.path.abspath(__file__))
def addsrc(name,srcs):
    hit=0
    for f in glob.glob(os.path.join(D,"SIGHTS_*.json"))+glob.glob(os.path.join(D,"FOOD_*.json")):
        d=json.load(open(f)); L=d["sights"] if isinstance(d,dict) else d
        for r in L:
            if r["n"]==name:
                have={k for k,u in r["sources"]}
                r["sources"]+= [s for s in srcs if s[0] not in have]; hit+=1
        if hit: json.dump(d,open(f,"w"),indent=1,ensure_ascii=False); return f
    raise SystemExit("NOT FOUND "+name)
