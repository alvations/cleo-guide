#!/usr/bin/env python3
# W49 — IBURI sweets: ROYCE' Chocolate World (New Chitose Airport) + Wakasaimo Honpo Tōyako. WebSearch 2026-10-02 (s3).
# LAKETOYA = laketoya.com, the Tōyako Onsen Tourism Association's official site.
from _hk import F, emit
RU="https://rurubu.jp/andmore/"
O="open"
F(1,"IBURI",["SWEET"],"ROYCE' chocolate made on a glass-walled line — free, no reservation","ROYCE' Chocolate World, New Chitose Airport (ロイズチョコレートワールド)",
  "New Chitose Airport 3F, Chitose, Hokkaido, Japan",
  "Japan's first chocolate factory inside an airport — watch ROYCE' bite-size chocolates being made, then the shop and bakery.",
  [("RURUBU",RU+"spot/80001137"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_13109.html")],status=O,ssrc="visit-hokkaido.jp spot 13109 (current)")
F(1,"IBURI",["SWEET"],"'Wakasaimo' — Lake Tōya's signature sweet","Wakasaimo Honpo Tōyako Honten (わかさいも本舗 洞爺湖本店)",
  "Tōyako Onsen 144, Tōyako, Abuta District, Hokkaido, Japan",
  "The lakeside flagship of Tōya's signature sweet, with the Sendō-an Japanese restaurant upstairs looking over the lake.",
  [("RURUBU",RU+"spot/80001718"),("LAKETOYA","https://www.laketoya.com/news/%E3%80%90%E7%AC%AC30%E5%9B%9E%E3%80%91youtube%E4%B8%8A%E3%81%8C%E3%81%A3%E3%81%A6%E3%81%BE%E3%81%99%EF%BC%81%E3%82%8F%E3%81%8B%E3%81%95%E3%81%84%E3%82%82%E6%9C%AC%E8%88%97%E3%80%80%E6%B4%9E%E7%88%BA/")],status=O,ssrc="rurubu&more spot page (hours current)")
emit("W49")
