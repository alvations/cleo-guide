#!/usr/bin/env python3
# W74 — OTARU food: Kama-ei factory store (pan-roll kamaboko), Kitaichi Hall lamp café. WebSearch 2026-10-02 (s3).
# Caveat: Kitaichi Hall's MAPPLE citation is the retro-café round-up that surfaced with it — re-verify per-outlet at refresh.
from _hk import F, emit
O="open"
F(1,"OTARU",["MKT","HOKKAIDO"],"'pan-roll' — surimi wrapped in bread and deep-fried (shop-only, since 1962)","Kama-ei Factory Store, Otaru (かま栄 工場直売店)",
  "Sakaimachi 3-7, Otaru, Hokkaido, Japan",
  "Otaru's kamaboko house since 1905 — the pan-roll is, sold only here because it can't be shipped; café on site.",
  [("MAPPLE","https://www.mapple.net/spot/1013436/"),("OTARUTOURISM","https://otaru.gr.jp/guidemap/gourmet-kamaboko")],status=O,ssrc="MAPPLE spot page (seasonal hours current)")
F(2,"OTARU",["CAFE"],"coffee and light meals under 167 oil lamps","Kitaichi Hall, Otaru (北一ホール)",
  "Kitaichi Glass No. 3 building, Sakaimachi 7-26, Otaru, Hokkaido, Japan",
  "The café in Kitaichi Glass's Meiji stone warehouse, lit by 167 oil lamps that staff light one by one after the 9am opening.",
  [("RURUBU","https://rurubu.jp/andmore/spot/80000582"),("RURUBU","https://rurubu.jp/andmore/article/24728"),("MAPPLE","https://www.mapple.net/article/41455/")],status=O,ssrc="rurubu&more spot page (hours current)")
emit("W74")
