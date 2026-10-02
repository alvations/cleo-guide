"""Record address-verify results in _addrcheck_w3.json.
stdin: {"<idx>": {"v": "verified|fixed|coarsened", "address": "<new addr if fixed/coarsened>", "via": "<url>"}}"""
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(D, "_addrcheck_w3.json")
d = json.load(open(P, encoding="utf-8")); m = json.load(sys.stdin)
for k, v in m.items():
    r = d[int(k)]; r["check"] = v["v"]; r["via"] = v["via"]
    if v.get("address"): r["newAddress"] = v["address"]
json.dump(d, open(P, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("checked", sum(1 for r in d if "check" in r), "/", len(d))
