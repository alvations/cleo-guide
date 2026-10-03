#!/usr/bin/env python3
# W69 — DOTO Kushiro ramen b2. WebSearch 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"
O="open"
F(2,"DOTO",["RAMEN"],"Kushiro ramen — only shōyu or shio, from 9:30am","Kushiro Rāmen Maruhira (釧路ラーメン まるひら)",
  "Urami 8-1-13, Kushiro, Hokkaido, Japan",
  "A 60-plus-year Kushiro counter with a two-item menu, shōyu or shio, open mornings to early afternoon — No. 66 in Ramen Adventures' Hokkaido top 100.",
  [("RURUBU",RU+"spot/80000832"),("RAMENADVENTURES","https://ramenadventures.com/2025/01/09/hokkaido-best-ramen-2024/")],status=O,ssrc="rurubu&more spot page (hours current)")
F(2,"DOTO",["RAMEN"],"ramen seasoned with saury-and-herring fish sauce","Uocchi Rāmen Kōbō, Tanchō Market (魚一らーめん工房)",
  "Kushiro, Hokkaido, Japan",
  "A Kushiro market ramen counter whose soup layers niboshi and kombu with its own saury and herring fish sauce.",
  [("RURUBU",RU+"spot/80000836"),("KUSHIROTOURISM","http://en.kushiro-lakeakan.com/eat_souvenir/7871/")],status=O,ssrc="rurubu&more spot page (current)")
emit("W69")
