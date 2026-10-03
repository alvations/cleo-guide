#!/usr/bin/env python3
# W22 — DONAN food (morning-market donburi, Meiji yōshoku). WebSearch 2026-10-02 (session 2).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"DONAN",["SUSHI","MKT"],"tomoe-don / pick-three donburi (uni, ikura, scallop, botan-ebi, zuwai crab on charcoal-cooked rice)","Kikuyo Shokudō Honten, Hakodate Morning Market (きくよ食堂 本店)",
  "Hakodate Morning Market, Wakamatsu-chō, Hakodate, Hokkaido, Japan",
  "The morning-market donburi counter since 1956 — choose three of uni, ikura, scallop, salmon, botan shrimp and snow crab over rice cooked on charcoal. Opens 05:00 in season.",
  [("RURUBU",RU+"spot/80000547"),("MAPPLE",MP+"article/43226/")],status=O,ssrc="rurubu&more spot page (hours listed, current)")
F(1,"DONAN",["INT"],"Gotōken 'English' curry and Meiji-era Russian/French yōshoku","Gotōken Honten — Restaurant Sekkatei (五島軒本店 レストラン雪河亭)",
  "4-5 Suehiro-chō, Hakodate, Hokkaido 040-0053, Japan (Gotōken head office / honten)",
  "Hakodate's grand Western restaurant since 1879 — Russian dishes from its founding days, classic French, and the curry that made its name.",
  [("RURUBU",RU+"spot/80000464"),("WIKIPEDIA_JA","https://ja.wikipedia.org/wiki/%E4%BA%94%E5%B3%B6%E8%BB%92"),("MAPPLE",MP+"region/a0102060000_g03000000/spot/")],status=O,ssrc="rurubu&more spot page (current)")
emit("W22")
