#!/usr/bin/env python3
# W66 — SPR Jōzankei-side sights (ja.wikipedia pins + jozankei.jp / visit-hokkaido). WebSearch 2026-10-02 (s3).
# JOZANKEITOURISM = jozankei.jp, the Jōzankei Tourism Association's official site.
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"
O="open"
S(2,"SPR","Jōzankei Dam & Sapporo Lake (定山渓ダム・さっぽろ湖)","Jōzankei, Minami-ku, Sapporo, Hokkaido, Japan",
  "The 117.5 m dam of 1989 that formed deep-blue Sapporo Lake — look up at it from the downstream park, with a dam museum and seasonal inside tours.",
  [("JOZANKEITOURISM","https://jozankei.jp/en/spot/jozankeidam/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_11184.html"),("WIKIPEDIA_JA",JA+"%E5%AE%9A%E5%B1%B1%E6%B8%93%E3%83%80%E3%83%A0")],
  42.98472,141.1575,"high","ja.wikipedia 定山渓ダム infobox (北緯42度59分05秒 東経141度09分27秒) via WebSearch",O,"jozankei.jp spot page (current)",k="dam & lake",g=["NATURE","VIEW","FREE"])
S(3,"SPR","Mount Hakken — Kannon-iwa (八剣山)","Minami-ku, Sapporo, Hokkaido, Japan",
  "A 498 m jagged ridge on the way to Jōzankei — about an hour up with ropes on the steep upper half, for a 360° summit view.",
  [("JOZANKEITOURISM","https://jozankei.jp/en/enjoy/hiking/"),("WIKIPEDIA_JA",JA+"%E8%A6%B3%E9%9F%B3%E5%B2%A9%E5%B1%B1")],
  42.965594,141.241306,"high","ja.wikipedia 観音岩山 (八剣山) infobox (北緯42度57分56秒 東経141度14分29秒) via WebSearch",O,"jozankei.jp hiking page (current)",k="hike",g=["NATURE","VIEW","FREE"])
emit("W66")
