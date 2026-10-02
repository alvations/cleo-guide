#!/usr/bin/env python3
# W08 — IBURI + NSK + UNESCO Jōmon Prehistoric Sites (DONAN/IBURI). WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"; VH="https://www.visit-hokkaido.jp/en/"
def jg(p): return ("JAPANGUIDE",JG+p)
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
UN=("UNESCO","https://whc.unesco.org/en/list/1632/"); JM=("JOMONJAPAN","https://jomon-japan.jp/en/learn/jomon-sites")
O="open"
def jomon(t,a,n,addr,w,jap,lat,lng,dms,unesco=True,k="jomon site"):
    src=([UN] if unesco else [])+[JM,ja(jap)]
    S(t,a,n,addr,w,src,lat,lng,"high",f"ja.wikipedia {n.split('(')[-1].rstrip(')')} infobox ({dms}) via WebSearch",
      O,"jomon-japan.jp component list (site open to visitors, current)",k=k,g=(["UNESCO","MUS"] if unesco else ["MUS"]))
# ---- UNESCO Jōmon component parts in Hokkaido (+ one associated site) ----
jomon(2,"DONAN","Ōfune Site — Jōmon (大船遺跡)","Ōfune-chō, Hakodate, Hokkaido, Japan",
  "A Middle Jōmon village above the Pacific — more than 100 pit-dwelling hollows, some 2 m deep, part of the 2021 UNESCO Jōmon Prehistoric Sites in Northern Japan.",
  "%E5%A4%A7%E8%88%B9%E9%81%BA%E8%B7%A1",41.957694,140.925444,"北緯41度57分27.7秒 東経140度55分31.6秒")
jomon(2,"DONAN","Kakinoshima Site — Jōmon (垣ノ島遺跡)","Usujiri-chō, Hakodate, Hokkaido, Japan",
  "A settlement where living and burial grounds were separated for millennia, with a 190 m U-shaped earthen mound; the Hakodate Jōmon Culture Center (with Hokkaido's only National Treasure, a hollow clay dogū) is beside it. UNESCO.",
  "%E5%9E%A3%E3%83%8E%E5%B3%B6%E9%81%BA%E8%B7%A1",41.928861,140.947500,"北緯41度55分43.9秒 東経140度56分51.0秒")
jomon(2,"DONAN","Washinoki Stone Circle (鷲ノ木遺跡)","Washinoki-chō, Mori, Kayabe District, Hokkaido, Japan",
  "Hokkaido's largest stone circle (Late Jōmon), a double ring of stones on a hill above Uchiura Bay — an associated site of the Jōmon World Heritage nomination.",
  "%E9%B7%B2%E3%83%8E%E6%9C%A8%E9%81%BA%E8%B7%A1",42.115833,140.525833,"北緯42度6分57.0秒 東経140度31分33.0秒",unesco=False,k="stone circle jomon")
jomon(2,"IBURI","Kitakogane Shell Mound — Jōmon (北黄金貝塚)","Kitakogane-chō, Date, Hokkaido, Japan",
  "A Jōmon settlement with large shell middens facing Uchiura Bay and a 'water site' where tools were ritually sent back — UNESCO Jōmon Prehistoric Sites.",
  "%E5%8C%97%E9%BB%84%E9%87%91%E8%B2%9D%E5%A1%9A",42.40203392,140.91064837,"北緯42度24分07秒 東経140度54分38秒")
jomon(2,"IBURI","Irie & Takasago Shell Mounds — Jōmon (入江・高砂貝塚)","Takasago-chō, Tōyako, Abuta District, Hokkaido, Japan",
  "Two Jōmon sites a few hundred metres apart above Uchiura Bay — the Irie village shell mound and the Takasago burial ground. UNESCO Jōmon Prehistoric Sites.",
  "%E5%85%A5%E6%B1%9F%E3%83%BB%E9%AB%98%E7%A0%82%E8%B2%9D%E5%A1%9A",42.546667,140.770278,"北緯42度32分48.0秒 東経140度46分13.0秒")
jomon(2,"IBURI","Kiusu Earthwork Burial Circles — Jōmon (キウス周堤墓群)","Chitose, Hokkaido, Japan",
  "Ring-shaped earthen burial enclosures up to 75 m across in a Chitose forest — among the largest Jōmon communal cemeteries. UNESCO Jōmon Prehistoric Sites.",
  "%E3%82%AD%E3%82%A6%E3%82%B9%E5%91%A8%E5%A0%A4%E5%A2%93%E7%BE%A4",42.885556,141.716111,"北緯42度53分8.0秒 東経141度42分58.0秒")
# ---- IBURI ----
S(2,"IBURI","Shōwa-shinzan (昭和新山)","Sōbetsu Onsen, Sōbetsu, Usu District, Hokkaido, Japan",
  "One of the world's youngest mountains: a lava dome that rose out of a wheat field in 1943–45 to 398 m and still steams — beside the Usuzan Ropeway base.",
  [("WIKIPEDIA","https://en.wikipedia.org/wiki/Sh%C5%8Dwa-shinzan"),jg("e6728.html")],42.54250,140.86444,"high","en.wikipedia Shōwa-shinzan infobox (42°32′33″N 140°51′52″E) via WebSearch",
  O,"japan-guide.com e6728 (current)",k="new volcano lava dome",g=["NATURE","FREE"])
S(2,"IBURI","Lake Kuttara (倶多楽湖)","Noboribetsu Onsen-chō, Noboribetsu, Hokkaido, Japan",
  "A near-perfectly round caldera lake above Noboribetsu Onsen with no inflowing river — rated among Japan's clearest.",
  [ja("%E5%80%B6%E5%A4%9A%E6%A5%BD%E6%B9%96"),vh("spot/detail_10158.html")],42.50000,141.18333,"med","ja.wikipedia 倶多楽湖 infobox (北緯42度30分0秒 東経141度11分0秒 — lake, minute precision) via WebSearch",
  O,"visit-hokkaido.jp spot 10158 (Bear Park ropeway viewpoint, current)",k="caldera lake clear",g=["NATURE","VIEW","FREE"])
# ---- NSK ----
S(1,"NSK","Niseko Annupuri (ニセコアンヌプリ)","Niseko / Kutchan, Abuta District, Hokkaido, Japan",
  "The 1,308 m volcano whose flanks carry the Niseko United ski areas (Grand Hirafu, Hanazono, Niseko Village, Annupuri) — famed for deep, dry powder and backcountry gates.",
  [ja("%E3%83%8B%E3%82%BB%E3%82%B3%E3%82%A2%E3%83%B3%E3%83%8C%E3%83%97%E3%83%AA"),jg("e6720.html")],42.87500,140.65889,"med","ja.wikipedia ニセコアンヌプリ infobox (北緯42度52分30秒 東経140度39分32秒 — summit) via WebSearch",
  O,"japan-guide.com e6720 (current)",k="ski powder mountain",g=["ICON","NATURE","VIEW"])
S(2,"NSK","Shinsen-numa Pond (神仙沼)","Maeda, Kyōwa, Iwanai District, Hokkaido, Japan",
  "The loveliest of the Niseko range's marsh ponds — a 20-minute boardwalk through alpine bog to still water ringed by Todo firs.",
  [ja("%E7%A5%9E%E4%BB%99%E6%B2%BC"),vh("spot/detail_10169.html")],42.90417,140.59278,"high","ja.wikipedia 神仙沼 infobox (北緯42度54分15秒 東経140度35分34秒) via WebSearch",
  O,"visit-hokkaido.jp spot 10169 (boardwalk, seasonal)",k="marsh pond boardwalk",g=["NATURE","FREE"])
S(2,"NSK","Fukidashi Park, Kyōgoku (ふきだし公園)","Kyōgoku, Abuta District, Hokkaido, Japan",
  "Mount Yōtei's snowmelt gushes out here after decades underground — one of Japan's biggest spring discharges; locals fill bottles at the source.",
  [ja("%E3%81%B5%E3%81%8D%E3%81%A0%E3%81%97%E5%85%AC%E5%9C%92"),vh("spot/detail_10333.html")],42.85833,140.87056,"high","ja.wikipedia ふきだし公園 infobox (北緯42度51分30秒 東経140度52分14秒) via WebSearch",
  O,"visit-hokkaido.jp spot 10333 (current)",k="spring water park",g=["NATURE","FREE"])
OUT=[{"key":"UNESCO","name":"UNESCO World Heritage Centre","url":"https://whc.unesco.org/","credible":"Institutional authority (World Heritage inscription) — lone-solo per the gate."},
     {"key":"JOMONJAPAN","name":"Jomon Prehistoric Sites in Northern Japan (official site, Jomon World Heritage Promotion Office)","url":"https://jomon-japan.jp/","credible":"Official site of the World Heritage property's managing prefectures (Hokkaido/Aomori/Iwate/Akita); institutional, one source."}]
emit("W08",OUT)
