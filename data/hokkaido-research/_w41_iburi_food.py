#!/usr/bin/env python3
# W41 — IBURI food canon: Tomakomai hokki (surf clam) curry, Muroran 'yakitori' (pork + onion + karashi). WebSearch 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"IBURI",["HOKKAIDO","SUSHI","MKT"],"hokki (surf clam) curry and hokki-don","Marutoma Shokudō, Tomakomai (マルトマ食堂)",
  "Shiomi-machi 1-1-13, Tomakomai, Hokkaido, Japan",
  "A fishermen's diner facing Tomakomai harbour, open from 5am — Japan's top surf-clam port served as a heaped hokki curry and seafood bowls.",
  [("RURUBU",RU+"spot/80001002"),("MAPPLE",MP+"spot/1013443/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/plan/detail_93.html")],status=O,ssrc="rurubu&more spot page (hours current)")
F(1,"IBURI",["IZAKAYA","HOKKAIDO"],"Muroran yakitori — pork and onion skewers with karashi mustard","Yakitori no Ippei Nakajima Honten, Muroran (やきとりの一平 中島本店)",
  "Nakajima-chō 1-17-3, Muroran, Hokkaido, Japan",
  "The shop that put Muroran 'yakitori' — charcoal pork and onion, eaten with hot mustard — on the national map by winning the Yakitorimpic twice.",
  [("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/8604/"),("MAPPLE",MP+"region/a0102030201_g03050500/spot/")],status=O,ssrc="MAPPLE Muroran yakitori list (hours current)")
emit("W41")
