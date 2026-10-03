#!/usr/bin/env python3
# W19 — OTARU aquarium + TKC onsen/ranch + Cape Erimo. WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; VH="https://www.visit-hokkaido.jp/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
S(2,"OTARU","Otaru Aquarium (おたる水族館)","3-303 Shukutsu, Otaru, Hokkaido, Japan",
  "Hokkaido's largest aquarium (about 250 species) on the Shukutsu headland — seals and sea lions in pens sectioned off from the open sea.",
  [ja("%E3%81%8A%E3%81%9F%E3%82%8B%E6%B0%B4%E6%97%8F%E9%A4%A8"),vh("spot/detail_10113.html")],43.236806,141.011250,"high","ja.wikipedia おたる水族館 infobox (北緯43度14分12.5秒 東経141度0分40.5秒) via WebSearch",
  O,"visit-hokkaido.jp spot 10113 (current; seasonal winter schedule)",k="aquarium seals",g=["NATURE"])
S(2,"TKC","Tokachigawa Onsen (十勝川温泉)","Otofuke, Katō District, Hokkaido, Japan",
  "A rare 'moor' hot spring of plant-derived organic water, prized as a skin-softening bath, on the Tokachi River just outside Obihiro.",
  [ja("%E5%8D%81%E5%8B%9D%E5%B7%9D%E6%B8%A9%E6%B3%89"),vh("plan/detail_29.html")],42.93417,143.29611,"med","ja.wikipedia 十勝川温泉 infobox (北緯42度56分03秒 東経143度17分46秒 — onsen area) via WebSearch",
  O,"visit-hokkaido.jp Tokachi itinerary 29 (current)",k="moor onsen",g=["ONSEN"])
S(2,"TKC","Naitai Highland Ranch & Naitai Terrace (ナイタイ高原牧場)","Naitai, Kamishihoro, Katō District, Hokkaido, Japan",
  "Japan's largest public ranch (est. 1972) rolling over Mount Naitai at the north-west edge of the Tokachi Plain — the terrace café looks out across the plain.",
  [vh("spot/detail_10448.html"),ja("%E3%83%8A%E3%82%A4%E3%82%BF%E3%82%A4%E5%B1%B1")],43.29917,143.14861,"med","ja.wikipedia ナイタイ山 infobox summit (北緯43度17分57秒 東経143度08分55秒) via WebSearch — the ranch spans the mountain; not the terrace building",
  O,"visit-hokkaido.jp spot 10448 (current; seasonal)",k="ranch view",g=["VIEW","NATURE"])
S(2,"TKC","Cape Erimo (襟裳岬)","Erimo, Horoizumi District, Hokkaido, Japan (Hidaka coast, south of Tokachi)",
  "Where the Hidaka mountains run into the Pacific as a chain of reefs — a wind-blasted cape at the southern tip of the Hidaka range.",
  [ja("%E8%A5%9F%E8%A3%B3%E5%B2%AC"),vh("theme/zekkei/")],41.92444,143.24917,"high","ja.wikipedia 襟裳岬 infobox (北緯41度55分28秒 東経143度14分57秒) via WebSearch",
  O,"visit-hokkaido.jp spectacular-views theme (current)",k="cape reefs seals",g=["NATURE","VIEW","FREE"])
emit("W19")
