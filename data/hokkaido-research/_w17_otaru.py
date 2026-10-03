#!/usr/bin/env python3
# W17 — OTARU food & shopping canon. WebSearch 2026-10-02 (session 2).
from _hk import S, F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; OT="https://otaru.gr.jp/"
O="open"
F(1,"OTARU",["HOKKAIDO","IZAKAYA"],"wakadori hanmi-age (salt-and-pepper fried half chicken)","Wakadori Jidai Naruto Honten (若鶏時代なると 本店)",
  "Otaru, Hokkaido, Japan (honten)",
  "Otaru's soul food since 1952: a half young chicken from Date, seasoned only with salt and pepper and fried at 200 °C for 10–12 minutes — crackling outside, juicy inside.",
  [("RURUBU",RU+"article/17167"),("OTARUTOURISM",OT+"shop/wakatorijidai-naruto-honten")],status=O,ssrc="otaru.gr.jp shop page (current)")
F(1,"OTARU",["SWEET","CAFE"],"Double Fromage two-layer cheesecake","LeTAO Main Store, Otaru (ルタオ本店)",
  "East end of Sakaimachi Street, Otaru, Hokkaido, Japan",
  "Otaru's patisserie of record at the end of Sakaimachi — the Double Fromage, a baked-and-rare two-layer cheesecake of Hokkaido dairy, plus store-only sweets.",
  [("RURUBU",RU+"article/16095"),("MAPPLE",MP+"article/41251/")],status=O,ssrc="rurubu&more LeTAO Honten feature (current)")
S(2,"OTARU","Kitaichi Glass Hall No. 3 (北一硝子 三号館)","Sakaimachi, Otaru, Hokkaido, Japan",
  "Kitaichi Glass's largest shop, on Sakaimachi — glassware arranged by theme, from tableware to animal figures with Hokkaido motifs, and a café.",
  [("MAPPLE",MP+"spot/1000909/"),("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/beautiful-kitaichi-glass-art-and-a-chic-cafe-in-otaru")],status=O,ssrc="MAPPLE spot page (current)",k="glass shop warehouse",g=["MKT","CASTLE"])
emit("W17")
