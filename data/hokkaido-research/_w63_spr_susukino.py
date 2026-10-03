#!/usr/bin/env python3
# W63 — SPR Susukino food via GoodLuckTrip "21 Must-Try Restaurants in Susukino" + sapporo.travel. WebSearch 2026-10-02 (s3).
from _hk import F, emit
GL="https://www.gltjp.com/en/article/item/21517/"; ST="https://www.sapporo.travel/en/gourmet/shop/"; SP="https://visit.sapporo.travel/discover/cuisine/shime-parfait/"
O="open"
F(2,"SPR",["HOKKAIDO"],"soup curry","Curry Shop S, Susukino (カレーショップ S)",
  "Silver Bldg B1F, Minami 3-jō Nishi 4-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A basement soup-curry counter in the middle of Susukino, on both the city tourism board's and GoodLuckTrip's Susukino lists.",
  [("SAPPOROTRAVEL",ST+"shop_117-3/"),("GOODLUCKTRIP",GL)],status=O,ssrc="sapporo.travel shop listing (current)")
F(1,"SPR",["IZAKAYA","SUSHI","HOKKAIDO"],"Hokkaido seafood izakaya","Umi Hachikyō Honten, Susukino (海味はちきょう 本店)",
  "Miyako Bldg 1F, Minami 3-jō Nishi 3, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A Susukino seafood izakaya, open 365 days a year until midnight.",
  [("SAPPOROTRAVEL",ST+"shop_194-3/"),("GOODLUCKTRIP",GL)],status=O,ssrc="sapporo.travel shop listing (hours current)")
F(2,"SPR",["SWEET","CAFE"],"shime parfait, open till 2am at weekends","Night Parfait Nanakamado (夜パフェ専門店 ななかまど)",
  "Dai-4 Fujii Bldg 2F, Minami 4-jō Nishi 5-10, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A dedicated night-parfait bar in Susukino — the after-dinner, after-drinks parfait until late.",
  [("SAPPOROTRAVEL",SP),("GOODLUCKTRIP",GL)],status=O,ssrc="sapporo.travel shime-parfait page (hours current)")
F(2,"SPR",["SWEET","CAFE"],"shime parfait, open 365 days","Parfaiteria PaL (パフェテリア パル)",
  "Susukino, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A second night-parfait specialist in Susukino, open every night of the year until midnight or later.",
  [("SAPPOROTRAVEL",SP),("GOODLUCKTRIP",GL)],status=O,ssrc="sapporo.travel shime-parfait page (hours current)")
emit("W63")
