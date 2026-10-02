#!/usr/bin/env python3
# W30 — Hokkaido Garden Path + Tomamu + Ikeda Wine Castle (second sources for visit-hokkaido-only holds). WebSearch 2026-10-02 (s2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; VH="https://www.visit-hokkaido.jp/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
S(2,"DHOKU","Ueno Farm, Asahikawa (上野ファーム)","Asahikawa, Hokkaido, Japan",
  "Gardener Ueno Sayuki's 'Hokkaido garden' — English planting blended with Furano-region wild nature; a mecca for Japanese gardeners on the Hokkaido Garden Path.",
  [vh("spot/detail_10119.html"),("MAPPLE","https://www.mapple.net/spot/1015615/"),ja("%E4%B8%8A%E9%87%8E%E3%83%95%E3%82%A1%E3%83%BC%E3%83%A0")],status=O,ssrc="visit-hokkaido.jp spot 10119 (seasonal, current)",k="english garden",g=["GARDEN"])
S(2,"DHOKU","Kaze no Garden, Furano (風のガーデン)","New Furano Prince Hotel grounds, Furano, Hokkaido, Japan",
  "A 2,000 m² English garden of 20,000 flowers grown over two years as the set of Kuramoto Sō's TV drama 'Kaze no Garden'.",
  [vh("spot/detail_10147.html"),ja("%E9%A2%A8%E3%81%AE%E3%82%AC%E3%83%BC%E3%83%87%E3%83%B3")],status=O,ssrc="visit-hokkaido.jp spot 10147 (seasonal, current)",k="drama garden flowers",g=["GARDEN"])
S(2,"DHOKU","Unkai Terrace, Hoshino Resorts Tomamu (雲海テラス)","Tomamu, Shimukappu, Yūfutsu District, Hokkaido, Japan",
  "A gondola-top deck at 1,088 m above the Tomamu valleys — on calm mornings from May to October a white sea of clouds fills the Hidaka foothills.",
  [vh("spot/detail_10175.html"),("RURUBU","https://rurubu.jp/andmore/spot/80001568")],status=O,ssrc="rurubu&more (seasonal opening May–Oct, current season listed)",k="sea of clouds terrace",g=["VIEW","NATURE"])
S(2,"TKC","Ikeda Wine Castle (池田ワイン城)","Ikeda, Nakagawa District (Tokachi), Hokkaido, Japan",
  "The town-run winery in a European-style castle — underground cellars of oak barrels, a brandy still, Tokachi wines and a top-floor restaurant over the Tokachi Plain.",
  [vh("spot/detail_10463.html"),ja("%E6%B1%A0%E7%94%B0%E7%94%BA%E3%83%96%E3%83%89%E3%82%A6%E3%83%BB%E3%83%96%E3%83%89%E3%82%A6%E9%85%92%E7%A0%94%E7%A9%B6%E6%89%80")],status=O,ssrc="visit-hokkaido.jp spot 10463 (current)",k="winery castle",g=["MUS"])
S(2,"TKC","Tokachi Hills (十勝ヒルズ)","Tokachi, Hokkaido, Japan",
  "Hilltop gardens over Tokachi built on 'flowers, food and farming' — seven theme gardens including 800 rose bushes, herbs, fruit trees and edible flowers.",
  [vh("spot/detail_11229.html"),("RURUBU","https://plus.rurubu.jp/article/094812672")],status=O,ssrc="visit-hokkaido.jp spot 11229 (seasonal, current)",k="rose garden hill",g=["GARDEN","VIEW"])
emit("W30")
