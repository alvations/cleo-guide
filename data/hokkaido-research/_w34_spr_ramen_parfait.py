#!/usr/bin/env python3
# W34 — SPR food canon: ramen b3 (MAPPLE Sapporo ramen TOP30 + sapporo.travel + GoodLuckTrip) and the Sapporo-born
# "shime parfait" (night parfait). WebSearch 2026-10-02 (session 3).
from _hk import F, emit
ST="https://www.sapporo.travel/en/gourmet/"; RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; GL="https://www.gltjp.com/en/article/item/"
O="open"
F(2,"SPR",["RAMEN"],"local-sourced miso ramen (Hokkaido wheat, pork bone, custom miso)","Ramen Sapporo Ichiryūan (ラーメン札幌一粒庵)",
  "Hokuren Bldg B1F, Kita 4-jō Nishi 1-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The station-side ramen shop most fixated on local sourcing — Hokkaido wheat noodles, Hokkaido pork bones and vegetables, miso made to order.",
  [("SAPPOROTRAVEL",ST+"shop/shop_308-3/"),("RURUBU",RU+"article/15323")],status=O,ssrc="rurubu&more article (hours current)")
F(1,"SPR",["RAMEN"],"rich miso ramen on pork-bone + chicken paitan","Menya Yukikaze Susukino Honten (麺屋 雪風 すすきの本店)",
  "Susukino, Chuo-ku, Sapporo, Hokkaido, Japan",
  "No. 3 in MAPPLE's Sapporo ramen top 30 — a rich-yet-clean 'nōkō miso' of pork-bone and chicken paitan with curly medium noodles.",
  [("MAPPLE",MP+"original/440444/"),("MAPPLE",MP+"spot/1017295/"),("GOODLUCKTRIP",GL+"21517/")],status=O,ssrc="MAPPLE spot page (current)")
F(1,"SPR",["RAMEN"],"ebi-soba — sweet-shrimp broth (miso, shio or shōyu)","Ebisoba Ichigen Sōhonten (えびそば一幻 総本店)",
  "Sapporo, Hokkaido, Japan",
  "Sapporo's prawn-ramen original, burning through ~60 kg of shrimp heads a day; pick your broth from pure shrimp to half pork-bone.",
  [("MAPPLE",MP+"original/440444/"),("GOODLUCKTRIP",GL+"10703/"),("TIMEOUT","https://www.timeout.com/tokyo/restaurants/ebisoba-ichigen")],status=O,ssrc="MAPPLE Sapporo ramen top-30 (current)")
F(1,"SPR",["SWEET","CAFE"],"shime parfait — the after-drinks parfait, everything made in-house","Parfait, Coffee, Sake, Satō Honten (パフェ、珈琲、酒、佐藤 本店)",
  "Kino Ninary Bldg 1F–3F, Minami 1-jō Nishi 2-chōme 1-2, Chuo-ku, Sapporo, Hokkaido 060-0061, Japan",
  "The flag-bearer of Sapporo's 'shime parfait' — the night-capping parfait — with Hokkaido-milk ice cream, sorbets and bakes all made in-house; open till midnight.",
  [("RURUBU",RU+"article/10282"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/etabigift/shop/detail_13089.html"),("SAPPOROTRAVEL","https://magazine.sapporo.travel/article/sapporo_parfait/"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/964684/")],status=O,ssrc="visit-hokkaido.jp shop listing (2024 relocation, hours current)")
F(2,"SPR",["SWEET","SAKE"],"shime parfait paired with liqueurs","INITIAL Sapporo",
  "F.DRESS Gogai Bldg 2F, Minami 3-jō Nishi 5-chōme 36-1, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A pioneer of the night-parfait boom built on 'dessert and alcohol marriage' — sculptural parfaits till midnight, three minutes from Susukino.",
  [("RURUBU",RU+"article/22444"),("SAPPOROTRAVEL","https://magazine.sapporo.travel/article/sapporo_parfait/")],status=O,ssrc="rurubu&more article (hours current)")
emit("W34")
