#!/usr/bin/env python3
# W71 — ANIME overlay (Golden Kamuy) onto places already in the dataset. WebSearch 2026-10-02 (s3).
# Overlay records carry ONLY name + area + the new sources + an "anime" note; tools/japan_consolidate.py merges them into
# the existing record (sources + anime only — never prose/pin). No geo file is written (pins stay as verified).
import json, os
D=os.path.dirname(os.path.abspath(__file__))
O=[
 {"t":1,"a":"DOTO","n":"Abashiri Prison Museum (博物館 網走監獄)","address":"","w":"",
  "anime":"Golden Kamuy — Abashiri Prison is a central setting of the manga/anime, drawing a wave of younger visitors",
  "sources":[["GENDAI","https://gendai.media/articles/-/58057"]]},
 {"t":1,"a":"IBURI","n":"Upopoy — National Ainu Museum & Park (ウポポイ)","address":"","w":"",
  "anime":"Golden Kamuy — partner of the official 'Golden Kamuy × Hokkaido' campaign; the National Ainu Museum held a Golden Kamuy special exhibition",
  "sources":[["OFFICIAL","https://kamuy-anime.com/news/index06220000.html"],["BIJUTSUTECHO","https://bijutsutecho.com/exhibitions/8339"]]},
 {"t":1,"a":"IBURI","n":"Noboribetsu Jigokudani (登別地獄谷)","address":"","w":"",
  "anime":"Golden Kamuy — Noboribetsu Onsen is the 7th Division's convalescent spa in the story; 2024 Hell Festival collaboration",
  "sources":[["FAMITSU","https://www.famitsu.com/article/202407/12219"]]},
]
json.dump({"sources":[],"sights":O},open(os.path.join(D,"SIGHTS_HOKKAIDO_W71.json"),"w"),indent=1,ensure_ascii=False)
print("W71 overlay:",len(O))
