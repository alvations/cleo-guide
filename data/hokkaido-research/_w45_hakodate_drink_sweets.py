#!/usr/bin/env python3
# W45 — DONAN food & drink: Hakodate local food (Cisco rice), Ōnuma dango, Hakodate craft beer. WebSearch 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"DONAN",["TEISHOKU","CAFE"],"'Cisco rice' — butter rice with sausage and meat sauce","California Baby, Hakodate (カリフォルニアベイビー)",
  "Bay area below Mt Hakodate (Motomachi side), Hakodate, Hokkaido, Japan",
  "A diner in a converted Taishō-era post office that nearly every Hakodate local has eaten at — the Cisco rice was the owner's riff on chili beans from his time in America.",
  [("RURUBU",RU+"spot/80000548"),("MAPPLE",MP+"article/53535/")],status=O,ssrc="rurubu&more spot page (current)")
F(1,"DONAN",["SWEET"],"Ōnuma dango — skewer-less dumplings in a 'lake' box (since 1905)","Numa no Ya, Ōnuma (沼の家)",
  "Ōnuma, Nanae, Kameda District, Hokkaido, Japan",
  "Founded in 1905: unskewered dumplings laid in a box to echo the lakes and their ~126 islets, in bean paste and soy.",
  [("RURUBU",RU+"spot/80001287"),("MAPPLE",MP+"spot/1000607/")],status=O,ssrc="rurubu&more spot page (current)")
F(2,"DONAN",["SAKE","IZAKAYA"],"six house-brewed Hakodate beers","Hakodate Beer (はこだてビール)",
  "Kaikō-dōri, Ōte-machi 5-22, Hakodate, Hokkaido, Japan",
  "The city's brewery restaurant on Kaikō-dōri — six regular beers on tap and a menu running from seafood to meat.",
  [("RURUBU",RU+"spot/80000528"),("MAPPLE",MP+"region/a0102060000_g030a0600/spot/")],status=O,ssrc="rurubu&more spot page (current)")
F(2,"DONAN",["SAKE","INT"],"local draught beer with German-style plates in a red-brick warehouse","Hakodate Beer Hall, Kanemori (函館ビヤホール)",
  "Kanemori Red Brick Warehouse — Hakodate History Plaza, Hakodate, Hokkaido, Japan",
  "A retro beer hall inside the Kanemori red-brick warehouses — two local beers, long sausage pie and potato-cheese bakes.",
  [("RURUBU",RU+"spot/80000403"),("HAKODATETRAVEL","https://hakodate.travel/en/food_and_drink/izakaya-beer-hall/hakodate-beer-hall")],status=O,ssrc="rurubu&more spot page (current)")
emit("W45")
