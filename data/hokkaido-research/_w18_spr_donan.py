#!/usr/bin/env python3
# W18 — SPR sights b4 + DONAN onsen. WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; ST="https://www.sapporo.travel/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
O="open"
S(2,"SPR","Sapporo Pirka Kotan — Ainu Culture Promotion Center (サッポロピリカコタン)","Minami-ku, Sapporo, Hokkaido, Japan",
  "'Beautiful village in Sapporo' — some 300 Ainu garments and tools you may handle, made by Ainu artisans.",
  [("SAPPOROTRAVEL",ST+"spot/facility/sapporo-pirka-kotan/"),ja("%E6%9C%AD%E5%B9%8C%E5%B8%82%E3%82%A2%E3%82%A4%E3%83%8C%E6%96%87%E5%8C%96%E4%BA%A4%E6%B5%81%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC")],
  42.96897694,141.21982694,"high","ja.wikipedia 札幌市アイヌ文化交流センター infobox (北緯42度58分08.317秒 東経141度13分11.377秒) via WebSearch",
  O,"sapporo.travel official listing (current)",k="ainu culture centre",g=["MUS","FREE"])
S(2,"SPR","Sapporo Factory (サッポロファクトリー)","Chuo-ku, Sapporo, Hokkaido, Japan",
  "Shopping complex on the site of the first Sapporo Beer brewery — the original brick buildings plus a vast glass atrium, shops, restaurants and a cinema.",
  [("SAPPOROTRAVEL",ST+"barrier-free/sapporo-barrier-free-sightseeing-spots/"),ja("%E3%82%B5%E3%83%83%E3%83%9D%E3%83%AD%E3%83%95%E3%82%A1%E3%82%AF%E3%83%88%E3%83%AA%E3%83%BC")],
  43.06556,141.36333,"high","ja.wikipedia サッポロファクトリー infobox (北緯43度03分56秒 東経141度21分48秒) via WebSearch",
  O,"sapporo.travel barrier-free sightseeing list (current)",k="brick brewery shopping",g=["MKT","CASTLE"])
S(2,"SPR","Hōheikyō Dam (豊平峡ダム)","Jōzankei, Minami-ku, Sapporo, Hokkaido, Japan",
  "A 102.5 m concrete arch dam (1972) on the upper Toyohira River beyond Jōzankei — autumn colour in the Jōzankei hills.",
  [("SAPPOROTRAVEL",ST+"barrier-free/sapporo-barrier-free-sightseeing-spots/"),ja("%E8%B1%8A%E5%B9%B3%E5%B3%A1%E3%83%80%E3%83%A0")],
  42.91583,141.15361,"high","ja.wikipedia 豊平峡ダム infobox (北緯42度54分57秒 東経141度09分13秒) via WebSearch",
  O,"sapporo.travel listing (current, seasonal access)",k="arch dam autumn",g=["NATURE","VIEW"])
S(2,"DONAN","Yunokawa Onsen, Hakodate (湯の川温泉)","Yunokawa-chō, Hakodate, Hokkaido, Japan",
  "Hakodate's seaside hot-spring quarter, one of Hokkaido's three great onsen areas, with a history going back to 1653.",
  [ja("%E6%B9%AF%E3%81%AE%E5%B7%9D%E6%B8%A9%E6%B3%89_(%E5%8C%97%E6%B5%B7%E9%81%93)"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spa/plan/detail_54.html")],
  41.77972,140.78556,"med","ja.wikipedia 湯の川温泉 (北海道) infobox (北緯41度46分47秒 東経140度47分08秒 — onsen area) via WebSearch",
  O,"visit-hokkaido.jp onsen route 54 (current)",k="onsen town sea",g=["ONSEN"])
emit("W18")
