#!/usr/bin/env python3
# W48 — SPR market kaisen-don (Curb Market + Nijō) + DHOKU Biei Senka. WebSearch 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"SPR",["SUSHI","MKT"],"12-topping kaisen-don at the Curb Market's oldest canteen","Kaisen Shokudō Kita no Gourmet-tei, Curb Market (海鮮食堂 北のグルメ亭)",
  "Sapporo Central Wholesale Market — Jōgai Shijō, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The Curb Market's longest-running big canteen-cum-shop — its signature bowl lays twelve oversized toppings over rice.",
  [("RURUBU",RU+"article/14911"),("MAPPLE",MP+"article/41147/")],status=O,ssrc="rurubu&more article (prices current)")
F(2,"SPR",["SUSHI","MKT"],"seasonal kaisen-don from a crab wholesaler's kitchen","Marusan-tei, Curb Market (まるさん亭)",
  "Sapporo Central Wholesale Market — Jōgai Shijō, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Run by crab-and-seafood wholesaler Marusan Mikami Shōten — about eight seasonal toppings (tuna, uni, scallop, salmon) heaped on one bowl.",
  [("RURUBU",RU+"article/14950"),("MAPPLE",MP+"article/41147/")],status=O,ssrc="rurubu&more article (prices current)")
F(2,"SPR",["SUSHI","MKT"],"sushi-chef's kaisen-don at fair prices","Kaisen-dokoro Uoya no Daidokoro, Nijō Market (海鮮処 魚屋の台所)",
  "Nijō Market, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A Nijō Market bowl shop opened by a long-time sushi chef to sell the freshest fish at fair prices — No. 2 in a MAPPLE readers' seafood ranking.",
  [("RURUBU",RU+"article/22608"),("MAPPLE",MP+"spot/1015755/"),("MAPPLE",MP+"original/505792/")],status=O,ssrc="MAPPLE spot page (current)")
F(1,"DHOKU",["HOKKAIDO","FINE","MKT"],"Biei vegetables — JA market, Biei-wheat bread and the French restaurant Asperges","Biei Senka (美瑛選果)",
  "Biei, Kamikawa District, Hokkaido, Japan",
  "JA Biei's food hall of morning-picked vegetables and limited Biei-wheat bread, with the French restaurant Asperges cooking the town's produce next door.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_10357.html"),("RURUBU",RU+"spot/80001474")],status=O,ssrc="visit-hokkaido.jp spot 10357 (current)")
emit("W48")
