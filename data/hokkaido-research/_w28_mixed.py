#!/usr/bin/env python3
# W28 — SPR observatories + DHOKU Furano food. WebSearch 2026-10-02 (session 2).
from _hk import S, F, emit
JA="https://ja.wikipedia.org/wiki/"; ST="https://www.sapporo.travel/en/"; RU="https://rurubu.jp/andmore/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
O="open"
S(2,"SPR","JR Tower Observatory T38 (JRタワー展望室 T38)","JR Tower (Sapporo Station), Chuo-ku, Sapporo, Hokkaido, Japan",
  "The 38th-floor deck of the Sapporo Station tower — a 360° view down the city grid to Ōdōri and the mountains.",
  [("SAPPOROTRAVEL",ST+"barrier-free/sapporo-barrier-free-sightseeing-spots/"),ja("JR%E3%82%BF%E3%83%AF%E3%83%BC")],43.06861,141.35194,"high","ja.wikipedia JRタワー infobox (北緯43度04分07秒 東経141度21分07秒) via WebSearch",
  O,"sapporo.travel listing (current)",k="observation deck",g=["VIEW","NIGHT"])
S(2,"SPR","Sapporo Dome (札幌ドーム)","Hitsujigaoka, Toyohira-ku, Sapporo, Hokkaido, Japan",
  "The silver dome stadium of football and concerts, with an observatory over the city.",
  [("SAPPOROTRAVEL",ST+"barrier-free/sapporo-barrier-free-sightseeing-spots/"),ja("%E6%9C%AD%E5%B9%8C%E3%83%89%E3%83%BC%E3%83%A0")],43.0151278,141.4097722,"high","ja.wikipedia 札幌ドーム infobox (北緯43度0分54.46秒 東経141度24分35.18秒) via WebSearch",
  O,"sapporo.travel listing (current)",k="stadium observatory",g=["VIEW"])
F(1,"DHOKU",["INT","HOKKAIDO"],"Furano omu-curry (omelette curry)","Yuiga Dokuson, Furano (唯我独尊)",
  "Near Furano Station, Furano, Hokkaido, Japan",
  "Furano's curry institution — 100% Hokkaido-egg omu-curry over a spicy roux of onions and carrots cooked down for three days with Furano vegetables.",
  [("RURUBU",RU+"spot/80001151"),("MAPPLE","https://www.mapple.net/collection/4ee30e1286444aebbe60d880c2084ea9/")],status=O,ssrc="rurubu&more spot page (current)")
F(2,"DHOKU",["HOKKAIDO","SWEET"],"Furano natural cheeses incl. red-wine 'Wine Cheddar'","Furano Cheese Factory (富良野チーズ工房)",
  "Furano, Hokkaido, Japan",
  "Five natural cheeses from Furano milk, made behind glass you can watch through — the pioneering red-wine-infused Wine Cheddar; butter too.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_10290.html"),("RURUBU","https://plus.rurubu.jp/article/142072127")],status=O,ssrc="visit-hokkaido.jp spot 10290 (current)")
emit("W28")
