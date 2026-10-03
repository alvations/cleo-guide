#!/usr/bin/env python3
# W13 — DOTO (Akan-Mashū, Abashiri, Nemuro) + SOYA (Wakkanai, Rishiri, Rebun). WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"; VH="https://www.visit-hokkaido.jp/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def jg(p): return ("JAPANGUIDE",JG+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
def wj(n,dms): return f"ja.wikipedia {n} infobox ({dms}) via WebSearch"
# ---- DOTO ----
S(2,"DOTO","Lake Onneto (オンネトー)","Akan-chō, Ashoro, Ashoro District, Hokkaido, Japan",
  "One of Hokkaido's 'three mystical lakes' at the western edge of Akan-Mashū — its colour shifts with the light under the volcano Me-Akan, whose lava dammed it.",
  [ja("%E3%82%AA%E3%83%B3%E3%83%8D%E3%83%88%E3%83%BC"),vh("spot/detail_10469.html")],43.384583,143.969917,"high",wj("オンネトー","北緯43度23分04.5秒 東経143度58分11.7秒"),
  O,"visit-hokkaido.jp spot 10469 (current)",k="mystical lake colour",g=["NATURE","VIEW","FREE"])
S(2,"DOTO","Bihoro Pass (美幌峠)","Route 243, Bihoro / Teshikaga border, Hokkaido, Japan",
  "A 525 m pass on Route 243 with the widest view over Lake Kussharo, Japan's largest caldera lake — sea of clouds at dawn.",
  [ja("%E7%BE%8E%E5%B9%8C%E5%B3%A0"),vh("spot/detail_10398.html")],43.64861,144.24806,"high",wj("美幌峠","北緯43度38分55秒 東経144度14分53秒"),
  O,"visit-hokkaido.jp spot 10398 (current)",k="mountain pass caldera view",g=["VIEW","FREE"])
S(2,"DOTO","Kaminoko Pond (神の子池)","Kiyosato, Shari District, Hokkaido, Japan (forest NE of Lake Mashū)",
  "'Child of the Gods' pond, fed underground from Lake Mashū — 12,000 tonnes a day of cobalt spring water that never freezes, sunken logs visible 5 m down.",
  [ja("%E7%A5%9E%E3%81%AE%E5%AD%90%E6%B1%A0"),vh("theme/zekkei/")],43.64528,144.55028,"high",wj("神の子池","北緯43度38分43秒 東経144度33分1秒"),
  O,"visit-hokkaido.jp spectacular-views theme (current)",k="blue spring pond",g=["NATURE","FREE"])
S(2,"DOTO","Okhotsk Drift Ice Museum & Mt Tento Observatory (オホーツク流氷館)","Mt Tento summit, Abashiri, Hokkaido, Japan",
  "Real drift ice in a sub-zero room and a 360° rooftop view over the Sea of Okhotsk from the top of Mt Tento.",
  [ja("%E3%82%AA%E3%83%9B%E3%83%BC%E3%83%84%E3%82%AF%E6%B5%81%E6%B0%B7%E9%A4%A8"),vh("spot/detail_10137.html")],44.001056,144.239778,"high",wj("オホーツク流氷館","北緯44度0分3.8秒 東経144度14分23.2秒"),
  O,"visit-hokkaido.jp spot 10137 (current)",k="drift ice museum view",g=["MUS","VIEW"])
S(2,"DOTO","Cape Nosappu (納沙布岬)","Nosappu, Nemuro, Hokkaido, Japan",
  "The easternmost point of Hokkaido's mainland at the tip of the Nemuro Peninsula — Japan's earliest sunrise, looking out toward the Habomai islets.",
  [ja("%E7%B4%8D%E6%B2%99%E5%B8%83%E5%B2%AC"),vh("spot/detail_10142.html")],43.385056,145.816278,"high",wj("納沙布岬","北緯43度23分6.2秒 東経145度48分58.6秒"),
  O,"visit-hokkaido.jp spectacular-views theme (current)",k="easternmost cape sunrise",g=["VIEW","FREE"])
S(2,"DOTO","Notsuke Peninsula (野付半島)","Notsuke, Betsukai / Shibetsu, Hokkaido, Japan",
  "A long, hooked sand spit curling into the Nemuro Strait — ghostly salt-killed forests, seals and wildflowers.",
  [ja("%E9%87%8E%E4%BB%98%E5%8D%8A%E5%B3%B6"),vh("theme/zekkei/")],43.60028,145.297611,"med",wj("野付半島","北緯43度36分1秒 東経145度17分51.4秒 — spit"),
  O,"visit-hokkaido.jp spectacular-views theme (current)",k="sand spit dead forest",g=["NATURE","FREE"])
# ---- SOYA ----
S(1,"SOYA","Wakkanai Port North Breakwater Dome (稚内港北防波堤ドーム)","Kaiun, Wakkanai, Hokkaido, Japan",
  "A 14 m-high arcade of columns built over five years to shelter travellers walking between the harbour and the railway station from waves and northern winds — a Hokkaido Heritage.",
  [ja("%E5%8C%97%E9%98%B2%E6%B3%A2%E5%A0%A4%E3%83%89%E3%83%BC%E3%83%A0"),vh("spot/detail_10273.html")],45.420222,141.680444,"high",wj("北防波堤ドーム","北緯45度25分12.8秒 東経141度40分49.6秒"),
  O,"visit-hokkaido.jp spot 10273 (current)",k="breakwater arches heritage",g=["ICON","CASTLE","FREE"])
S(2,"SOYA","Sōya Hills & the White Road (宗谷丘陵)","Sōya, Wakkanai, Hokkaido, Japan",
  "Hills shaped in the last Ice Age behind Cape Sōya, rich in wild birds and alpine plants — the 'White Road' is paved with crushed scallop shells.",
  [vh("plan/detail_16.html"),ja("%E5%AE%97%E8%B0%B7%E4%B8%98%E9%99%B5")],status=O,ssrc="visit-hokkaido.jp sample itinerary 16 (current)",k="hills white road",g=["NATURE","VIEW","FREE"])
S(2,"SOYA","Cape Sukoton, Rebun (スコトン岬)","Funadomari, Rebun, Rebun District, Hokkaido, Japan",
  "Rebun's northernmost point and trailhead of the island's 4- and 8-hour coastal hikes.",
  [jg("e6877.html"),ja("%E3%82%B9%E3%82%B3%E3%83%88%E3%83%B3%E5%B2%AC")],status=O,ssrc="japan-guide.com e6877 (current)",k="cape trailhead",g=["NATURE","VIEW","FREE"])
S(2,"SOYA","Momoiwa Observatory & Trail, Rebun (桃岩展望台)","Motochi, Rebun, Rebun District, Hokkaido, Japan",
  "The 'peach rock' dome above Motochi — alpine flowers with Rishiri-Fuji across the water along the ridge trail.",
  [jg("e6877.html"),ja("%E5%88%A9%E5%B0%BB%E7%A4%BC%E6%96%87%E3%82%B5%E3%83%AD%E3%83%99%E3%83%84%E5%9B%BD%E7%AB%8B%E5%85%AC%E5%9C%92")],status=O,ssrc="japan-guide.com e6877 (seasonal trail)",k="flower ridge trail",g=["NATURE","VIEW","FREE"])
S(2,"SOYA","Himenuma Pond, Rishiri (姫沼)","Oshidomari, Rishirifuji, Rishiri District, Hokkaido, Japan",
  "A small pond in primeval forest whose still surface mirrors Rishiri-Fuji upside down — an 800 m boardwalk loop.",
  [jg("e6876.html"),vh("plan/detail_85.html")],status=O,ssrc="japan-guide.com e6876 (current)",k="mirror pond",g=["NATURE","FREE"])
emit("W13")
