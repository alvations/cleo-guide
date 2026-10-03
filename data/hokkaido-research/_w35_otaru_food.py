#!/usr/bin/env python3
# W35 — OTARU food canon: Otaru ankake yakisoba (the city's ~70-year soul food) + Sushiya-dōri b2. WebSearch 2026-10-02 (s3).
# TripEat Hokkaido = Hokkaido Shimbun's food & travel web media → key HOKKAIDOSHIMBUN.
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; OT="https://otaru.gr.jp/"; TE="https://tripeat.hokkaido-np.co.jp/topics/877/"
O="open"
F(1,"OTARU",["INT","NOODLE"],"Otaru ankake yakisoba (house noodles from the Abe Seimen mill)","Otaru Ankake-dokoro Tororian (小樽あんかけ処 とろり庵)",
  "Sakura 5-chōme 7-23, Otaru, Hokkaido 047-0156, Japan",
  "The ankake-yakisoba specialist run by the old Abe noodle mill — crisp-fried noodles under a thick, generous seafood-and-vegetable sauce.",
  [("OTARUTOURISM",OT+"shop/tororian"),("HOKKAIDOSHIMBUN",TE)],status=O,ssrc="otaru.gr.jp shop listing (current)")
F(2,"OTARU",["INT","NOODLE"],"Otaru ankake yakisoba","Chūka Shokudō Keien (中華食堂 桂苑)",
  "Inaho 2-chōme 16-14, Otaru, Hokkaido, Japan",
  "An arcade Chinese diner packed even on weekdays for the city's soul-food plate of fried noodles under thick ankake.",
  [("MAPPLE",MP+"original/454269/"),("HOKKAIDOSHIMBUN",TE)],status=O,ssrc="TripEat Hokkaido ankake-yakisoba six (updated 2024-06-29)")
F(2,"OTARU",["SUSHI"],"nigiri from a third-generation Otaru chef","Kōzushi (幸寿司)",
  "Hanazono 1-chōme 4-6, Otaru, Hokkaido, Japan",
  "Tucked down an alley off Sushiya-dōri — a meticulous third-generation counter with nigiri sets from about ¥2,000.",
  [("RURUBU",RU+"spot/80000649"),("MAPPLE",MP+"region/a0102010405_g03050300/spot/")],status=O,ssrc="rurubu&more spot page (current)")
emit("W35")
