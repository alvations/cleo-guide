#!/usr/bin/env python3
# W25 — museums & gardens (SPR, DONAN, IBURI). WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; VH="https://www.visit-hokkaido.jp/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
S(2,"SPR","Hokkaido Museum of Modern Art (北海道立近代美術館)","Kita 1-jō Nishi 17-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Hokkaido's largest art collection — over 5,000 works by Hokkaido-linked masters (Kataoka Tamako, Iwahashi Eien, Kida Kinjirō, Kanda Nisshō) — next to the Hokkaido Governor's Official Residence.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/museum_of_modern_art/"),vh("spot/detail_10055.html"),ja("%E5%8C%97%E6%B5%B7%E9%81%93%E7%AB%8B%E8%BF%91%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8")],
  43.06028,141.330389,"high","ja.wikipedia 北海道立近代美術館 infobox (北緯43度3分37秒 東経141度19分49.4秒) via WebSearch",
  O,"sapporo.travel official listing (current)",k="art museum",g=["MUS"])
S(2,"DONAN","Hakodate Tropical Botanical Garden (函館市熱帯植物園)","3-1-15 Yunokawa-chō, Hakodate, Hokkaido 042-0932, Japan",
  "A pyramid greenhouse of tropical plants at Yunokawa — famous for the Japanese macaques soaking in their own hot-spring pool from December to May.",
  [("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/monkeys-and-flora-at-hakodate-tropical-botanic-garden"),ja("%E5%87%BD%E9%A4%A8%E5%B8%82%E7%86%B1%E5%B8%AF%E6%A4%8D%E7%89%A9%E5%9C%92")],
  status=O,ssrc="visit-hokkaido.jp feature (current)",k="monkeys onsen greenhouse",g=["GARDEN","ONSEN"])
S(2,"IBURI","Noboribetsu Date Jidaimura (登別伊達時代村)","53-1 Naka-Noboribetsu-chō, Noboribetsu, Hokkaido, Japan",
  "An immersive Edo-period theme park near Noboribetsu Onsen.",
  [vh("theme/activity/"),ja("%E7%99%BB%E5%88%A5%E4%BC%8A%E9%81%94%E6%99%82%E4%BB%A3%E6%9D%91")],status=O,ssrc="visit-hokkaido.jp kids-activity theme (current)",k="edo theme park ninja",g=["POP"])
emit("W25")
