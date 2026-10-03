# W2 geocode-only appends (2026-10-03): python3 _ind_geo_w2.py — re-runnable.
import json, os
D=os.path.dirname(os.path.abspath(__file__)); W="https://en.wikipedia.org/wiki/"
P=os.path.join(D,"geo","_geoout_w2.json")
G=json.load(open(P)) if os.path.exists(P) else []
def g(n,addr,lat,lng,src,conf="high",ss="",note=None,status="open"):
    global G
    d={"n":n,"address":addr,"lat":lat,"lng":lng,"geoSource":src,"confidence":conf,"status":status,"statusSource":ss}
    if note: d["note"]=note
    G=[x for x in G if x["n"]!=n]+[d]
g("Christ Church Cathedral","131 Monument Circle, Indianapolis, IN",39.76917,-86.15750,"Wikipedia infobox 39°46′9″N 86°9′27″W ("+W+"Christ_Church_Cathedral_(Indianapolis))",ss="Active Episcopal cathedral on Monument Circle")
g("Stutz Building","10th St & Capitol Ave, Indianapolis, IN",39.78167,-86.16194,"Wikipedia (Stutz Motor Car Company, NRHP 100008060 — 1060 N Capitol Ave & 217 W 10th St) 39°46′54″N 86°9′43″W ("+W+"Stutz_Motor_Car_Company)",ss="Building in use (artists' studios/offices)")
g("The Palladium (Center for the Performing Arts)","Center for the Performing Arts, Carmel, IN",39.9699,-86.1303,"Wikipedia infobox 39°58′12″N 86°07′49″W, 1 Carter Green ("+W+"The_Palladium_at_the_Center_for_the_Performing_Arts)",ss="Operating concert hall")
json.dump(G,open(P,"w"),indent=1,ensure_ascii=False); print(len(G),"geo w2")
