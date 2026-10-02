#!/usr/bin/env python3
# W23 — DOTO food: Ainu cuisine at Akan, Utoro fishermen's-wives canteen. WebSearch 2026-10-02 (session 2).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"DOTO",["HOKKAIDO"],"Ainu cuisine — pocche-imo (fermented potato cakes), yuk (Ezo venison) set with foraged greens","Mingei Kissa Poronno, Akan Ainu Kotan (民芸喫茶 ポロンノ)",
  "4-7-8 Akanko Onsen, Akan-chō, Kushiro, Hokkaido, Japan (inside the Ainu Kotan)",
  "Ainu cooking inside Hokkaido's largest Ainu village — pocche-imo and the yuk (venison) set, with gyōja-ninniku, fiddleheads and mushrooms gathered by the staff and deer from local hunters.",
  [("RURUBU",RU+"spot/80000871"),("MAPPLE",MP+"spot/1001206/")],status=O,ssrc="MAPPLE spot page (open year-round, current)")
F(2,"DOTO",["SUSHI","HOKKAIDO"],"sanshoku-don of Utoro-landed salmon and roe","Utoro Fishermen's Wives' Canteen (ウトロ漁協婦人部食堂)",
  "117 Utoro-higashi, Shari, Shari District, Hokkaido, Japan (by Utoro fishing port)",
  "A 20-seat counter by the harbour run by local fishermen's wives — salmon landed at Utoro the same morning; queues out the door at lunch. Late April–late October.",
  [("RURUBU",RU+"article/20408"),("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/syaricho/")],status=O,ssrc="rurubu&more Shiretoko food feature (seasonal, current)")
emit("W23")
