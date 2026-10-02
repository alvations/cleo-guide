#!/usr/bin/env python3
# W11 — SPR food b3 (jingisukan beer hall, ramen alley, Hokkaido sweets). WebSearch 2026-10-02 (session 2).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
CT=("CULTURETRIP","https://theculturetrip.com/asia/japan/sapporo/articles/the-best-restaurants-in-sapporo")
O="open"
F(1,"SPR",["HOKKAIDO","SAKE"],"jingisukan with Sapporo draught beer (Kessel Hall all-you-can-eat)","Sapporo Beer Garden (サッポロビール園)",
  "Higashi-ku, Sapporo, Hokkaido, Japan (beside the Sapporo Beer Museum)",
  "Restaurants spread through the garden serve fresh-lamb jingisukan and seasonal Hokkaido produce with Sapporo draught — Kessel Hall does all-you-can-eat-and-drink.",
  [("RURUBU",RU+"spot/80000281"),CT],status=O,ssrc="rurubu&more spot page (hours listed, current)")
F(2,"SPR",["RAMEN"],"Sapporo miso ramen alley","Ganso Sapporo Ramen Yokochō (元祖さっぽろラーメン横丁)",
  "Susukino, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The narrow Susukino alley of a dozen-plus tiny ramen counters, open into the small hours — the classic post-drinking miso bowl.",
  [("JAPANGUIDE","https://www.japan-guide.com/e/e5312.html"),CT,("SAPPOROTRAVEL","https://www.sapporo.travel/gourmet/shop/shop_139-2/")],status=O,ssrc="sapporo.travel shop listing in the alley (current)")
F(2,"SPR",["SWEET","CAFE"],"chiffon cake set with Hokkaido-milk soft-serve","Kitakaro Sapporo Honkan (北菓楼 札幌本館)",
  "Chuo-ku, Sapporo, Hokkaido, Japan (3 min walk from Ōdōri Park)",
  "Kitakaro's flagship in a historic building long loved as the city library and an art museum — sweets shop plus a café serving the cake set with Hokkaido-milk soft-serve.",
  [("RURUBU",RU+"article/15914"),("MAPPLE",MP+"region/a0102010000_g02060600/spot/")],status=O,ssrc="rurubu&more Kitakaro Sapporo Honkan feature (current)")
emit("W11")
