#!/usr/bin/env python3
# W36 — DHOKU food canon: Asahikawa ramen b2 (double soup / miso pioneer) + Furano curry & dairy sweets. WebSearch 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"DHOKU",["RAMEN"],"Asahikawa shōyu ramen with seafood + pork 'double soup' (since 1947)","Asahikawa Rāmen Aoba Honten (旭川らぅめん青葉 本店)",
  "Nijō Bldg Meitengai 1F, Nijō-dōri 8-chōme, Asahikawa, Hokkaido, Japan",
  "A 1947 original kept by its third-generation master — the Asahikawa double soup of sea and land stocks in a lard-sealed shōyu bowl.",
  [("RURUBU",RU+"spot/80000752"),("MAPPLE",MP+"article/43037/")],status=O,ssrc="rurubu&more spot page (current)")
F(2,"DHOKU",["RAMEN"],"Asahikawa miso ramen — the pioneer","Miso Rāmen no Yoshino Honten (みそラーメンのよし乃 本店)",
  "Toyooka 1-jō 1-1-8, Asahikawa, Hokkaido, Japan",
  "The trailblazer of Asahikawa miso ramen, miso-only since the day it opened.",
  [("RURUBU",RU+"spot/80000770"),("MAPPLE",MP+"article/43037/")],status=O,ssrc="MAPPLE Asahikawa ramen eight (hours listed, current)")
F(2,"DHOKU",["TEISHOKU"],"Furano curry with Furano vegetables","Curry no Furanoya (カレーのふらのや)",
  "Yayoi-chō 1-46, Furano, Hokkaido, Japan",
  "A log-house curry shop near Furano Station with soup and roux curries built on local vegetables — a Furano lunch queue.",
  [("RURUBU",RU+"spot/80001208"),("MAPPLE",MP+"region/a0102050100_g03070400/spot/")],status=O,ssrc="rurubu&more spot page (hours current)")
F(2,"DHOKU",["SWEET","HOKKAIDO"],"Furano-milk pudding and 'double fromage' cheesecake","Kashi Kōbō Furano Delice (菓子工房フラノデリス)",
  "Shimogoryō 2156-1, Furano, Hokkaido, Japan",
  "A hillside patisserie using Furano milk and eggs — the bottled Furano milk pudding has sold out since day one; twenty-plus cakes daily.",
  [("MAPPLE",MP+"spot/1013403/"),("RURUBU",RU+"spot/80001187")],status=O,ssrc="MAPPLE spot page (hours current)")
emit("W36")
