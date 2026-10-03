#!/usr/bin/env python3
# W50 — TKC sweets & bread: Cranberry sweet potato, Masuya (100% Tokachi wheat). WebSearch 2026-10-02 (s3).
# OBIKAN = obikan.jp, the Obihiro Tourism & Convention Association's official site.
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"TKC",["SWEET"],"sweet-potato cake (the house signature)","Cranberry Honten, Obihiro (クランベリー 本店)",
  "Obihiro, Hokkaido, Japan",
  "Obihiro's handmade-cake house, famous for its sweet-potato cake and for letting each ingredient's own flavour lead.",
  [("OBIKAN","https://obikan.jp/post_spot/1358/"),("MAPPLE",MP+"spot/1011915/")],status=O,ssrc="obikan.jp spot listing (current)")
F(2,"TKC",["SWEET","HOKKAIDO"],"bread of 100% Tokachi wheat","Masuya Shōten Honten, Obihiro (満寿屋商店 本店)",
  "Obihiro, Hokkaido, Japan",
  "'Masuya-san' — the 100%-Tokachi-wheat bakery with seven shops in the region; the main store keeps the sweet, soft breads first baked as farmhands' snacks.",
  [("RURUBU",RU+"spot/80000881"),("MAPPLE",MP+"region/a0101040000_g02060700/spot/")],status=O,ssrc="rurubu&more spot page (current)")
emit("W50")
