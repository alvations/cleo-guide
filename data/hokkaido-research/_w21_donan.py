#!/usr/bin/env python3
# W21 — DONAN museums/churches/Jōmon centre/monastery/Esashi. WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; VH="https://www.visit-hokkaido.jp/en/"; HT="https://www.hakodate.travel/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
def ht(p): return ("HAKODATETRAVEL",HT+p)
O="open"
S(2,"DONAN","Catholic Motomachi Church (カトリック元町教会)","15-30 Motomachi, Hakodate, Hokkaido 040-0054, Japan",
  "Founded 1859 by the French missionary Mermet-Cachon and rebuilt in Gothic style in 1924 — its altar is the only one in Japan given by a Pope.",
  [vh("spot/detail_10101.html"),ja("%E3%82%AB%E3%83%88%E3%83%AA%E3%83%83%E3%82%AF%E5%85%83%E7%94%BA%E6%95%99%E4%BC%9A")],41.76333,140.71278,"high","ja.wikipedia カトリック元町教会 infobox (北緯41度45分48秒 東経140度42分46秒) via WebSearch",
  O,"visit-hokkaido.jp spot 10101 (current)",k="gothic church",g=["TEMPLE","CASTLE"])
S(2,"DONAN","Hakodate City Museum of Northern Peoples (函館市北方民族資料館)","21-7 Suehiro-chō, Hakodate, Hokkaido 040-0053, Japan",
  "Ainu and Okhotsk-coast peoples' clothing, tools and ritual objects — try Ainu paper-cutting or make and play traditional instruments.",
  [ht("sightseeing-spots/museum/hakodate-city-museum-of-northern-peoples/"),ja("%E5%87%BD%E9%A4%A8%E5%B8%82%E5%8C%97%E6%96%B9%E6%B0%91%E6%97%8F%E8%B3%87%E6%96%99%E9%A4%A8")],41.76694,140.71194,"high","ja.wikipedia 函館市北方民族資料館 infobox (北緯41度46分1秒 東経140度42分43秒) via WebSearch",
  O,"hakodate.travel official listing (current)",k="ainu northern peoples museum",g=["MUS"])
S(1,"DONAN","Hakodate Jōmon Culture Center (函館市縄文文化交流センター)","551-1 Usujiri-chō, Hakodate, Hokkaido, Japan",
  "Home of a National Treasure, the 3,500-year-old hollow clay dogū (41.5 cm) found by chance in 1975 — beside the UNESCO Kakinoshima site.",
  [vh("spot/detail_10512.html"),ht("sightseeing-spots/museum/hakodate-jomon-culture-center/"),ja("%E5%87%BD%E9%A4%A8%E5%B8%82%E7%B8%84%E6%96%87%E6%96%87%E5%8C%96%E4%BA%A4%E6%B5%81%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC")],
  41.927921,140.944750,"high","ja.wikipedia 函館市縄文文化交流センター infobox (北緯41度55分40.517秒 東経140度56分41.099秒) via WebSearch",
  O,"hakodate.travel official listing (current)",k="national treasure dogu jomon",g=["MUS","ICON"])
S(2,"DONAN","Trappist Monastery, Hokuto (トラピスト修道院)","Mitsuishi (Oshima-Tōbetsu), Hokuto, Hokkaido, Japan",
  "Japan's first men's monastery (1896).",
  [vh("plan/detail_40.html"),ja("%E3%83%88%E3%83%A9%E3%83%94%E3%82%B9%E3%83%88%E4%BF%AE%E9%81%93%E9%99%A2")],41.740556,140.568861,"high","ja.wikipedia トラピスト修道院 infobox (北緯41度44分26秒 東経140度34分7.9秒) via WebSearch",
  O,"visit-hokkaido.jp Dōnan itinerary (current)",k="monastery avenue",g=["TEMPLE"])
S(2,"DONAN","Kaiyō Maru replica & Kamome Island, Esashi (開陽丸・鴎島)","Esashi, Hiyama District, Hokkaido, Japan",
  "A full-size replica of the shogunate's Dutch-built flagship that sank off Esashi in a storm in 1868, moored at the entrance to Kamome Island in the herring-trade port.",
  [vh("plan/detail_40.html"),ja("%E9%96%8B%E9%99%BD%E4%B8%B8")],status=O,ssrc="visit-hokkaido.jp Hakodate–Esashi itinerary 40 (current)",k="warship replica island",g=["MUS"])
emit("W21")
