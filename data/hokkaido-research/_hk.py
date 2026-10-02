#!/usr/bin/env python3
# _hk.py — tiny emitter used by the Hokkaido wave scripts (_w<NN>_<area>.py). Each wave script lists the places it
# discovered + fact-checked in compact form (sources, coordinates and status exactly as read from WebSearch results
# that wave) and calls emit(tag), which writes the repo-standard artifacts deterministically:
#   SIGHTS_HOKKAIDO_<tag>.json · FOOD_HOKKAIDO_<tag>.json · geo/_geoout_hokkaido_<tag>.json
# Coordinates: only from a source read in the wave (Wikipedia/Wikidata published coords, official map, directory
# place record). lat=None -> confidence "unverified" (held by the build gate). Never from memory.
import json, os
D = os.path.dirname(os.path.abspath(__file__))
_S, _F, _G = [], [], []

def _geo(n, address, lat, lng, conf, gsrc, status, ssrc):
    _G.append({"n": n, "address": address, "lat": lat, "lng": lng,
               "confidence": (conf if lat is not None else "unverified"),
               "geoSource": (gsrc if lat is not None else "UNVERIFIED — no place pin found via WebSearch"),
               "status": status, "statusSource": ssrc})

def S(t, a, n, address, w, sources, lat=None, lng=None, conf="high", gsrc="", status="open", ssrc="", k="", g=None, closed=False):
    r = {"t": t, "a": a, "n": n, "address": address, "w": w, "sources": [list(x) for x in sources]}
    if k: r["k"] = k
    if g: r["g"] = g
    if closed: r["closed"] = True
    _S.append(r); _geo(n, address, lat, lng, conf, gsrc, status, ssrc)

def F(t, a, cz, dish, n, address, w, sources, lat=None, lng=None, conf="high", gsrc="", status="open", ssrc="", closed=False):
    r = {"t": t, "a": a, "cz": cz, "dish": dish, "n": n, "address": address, "w": w, "closed": closed,
         "sources": [list(x) for x in sources]}
    _F.append(r); _geo(n, address, lat, lng, conf, gsrc, status, ssrc)

def emit(tag, src_outlets=None):
    if _S:
        json.dump({"sources": [], "sights": _S}, open(os.path.join(D, f"SIGHTS_HOKKAIDO_{tag}.json"), "w"), indent=1, ensure_ascii=False)
    if _F:
        json.dump(_F, open(os.path.join(D, f"FOOD_HOKKAIDO_{tag}.json"), "w"), indent=1, ensure_ascii=False)
    if _G:
        json.dump(_G, open(os.path.join(D, "geo", f"_geoout_hokkaido_{tag.lower()}.json"), "w"), indent=1, ensure_ascii=False)
    if src_outlets:
        json.dump({"outlets": src_outlets}, open(os.path.join(D, f"SOURCES_HOKKAIDO_{tag}.json"), "w"), indent=1, ensure_ascii=False)
    print(f"{tag}: sights {len(_S)} food {len(_F)} geo {len(_G)} (unverified {sum(1 for g in _G if g['lat'] is None)})")
