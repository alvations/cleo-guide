#!/usr/bin/env python3
# W16 — SPR seafood/crab/sushi + NSK dairy. WebSearch 2026-10-02 (session 2). Guidebook-editorial domain queries
# (rurubu/mapple/sapporo.travel). NOTE: the result summary merged several outlets; each place below appeared under
# the two cited outlets' URLs in the same result set — re-verify per-outlet attribution at refresh.
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"NSK",["SWEET","HOKKAIDO"],"farm soft-serve and rice-flour roll cake","Niseko Takahashi Farm Milk Kobo (ニセコ高橋牧場 ミルク工房)",
  "Niseko, Abuta District, Hokkaido, Japan (near Niseko Village ski resort)",
  "The dairy farm's own sweets shop facing Mount Yōtei — soft-serve, rice-flour roll cake and drinking yogurt from the farm's milk, with a vegetable-buffet restaurant and cheese workshop alongside.",
  [("RURUBU",RU+"spot/80001344"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_12972.html")],status=O,ssrc="rurubu&more spot page (prices listed, current)")
F(1,"SPR",["HOKKAIDO"],"crab kaiseki — taraba, zuwai and kegani, ~30 crab dishes","Kani Ryōri Hyōsetsu no Mon (蟹料理の店 氷雪の門)",
  "Chuo-ku, Sapporo, Hokkaido, Japan",
  "Sapporo's oldest crab specialist — king, snow and hairy crab as sashimi, charcoal-grilled, shabu-shabu and tempura.",
  [("RURUBU",RU+"article/22367"),("MAPPLE",MP+"region/a0102010100_g03050400/spot/")],status=O,ssrc="rurubu&more Sapporo seafood feature (current)")
F(2,"SPR",["HOKKAIDO"],"crab set courses (taraba, zuwai, kegani)","Sapporo Kani Honke Ekimae Honten (札幌かに本家 札幌駅前本店)",
  "Near JR Sapporo Station, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Crab bought direct at the fishing grounds and served at fair prices in set courses, steps from Sapporo Station.",
  [("RURUBU",RU+"article/22367"),("MAPPLE",MP+"region/a0102010100_g03050400/spot/")],status=O,ssrc="rurubu&more Sapporo seafood feature (current)")
F(1,"SPR",["SUSHI"],"Edomae nigiri with Hokkaido seafood","Sushi Zen Honten (すし善 本店)",
  "Sapporo, Hokkaido, Japan (honten)",
  "The grand old name in Sapporo sushi — an all-hinoki house with several counters and private rooms, Hokkaido fish handled with Edomae technique.",
  [("RURUBU",RU+"article/22367"),("MAPPLE",MP+"region/a0102010100_g03050300/spot/")],status=O,ssrc="rurubu&more Sapporo sushi feature (current)")
emit("W16")
