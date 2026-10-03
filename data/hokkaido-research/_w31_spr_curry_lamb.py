#!/usr/bin/env python3
# W31 — SPR food canon: soup curry b2 + jingisukan b2 (session 3, food-first). WebSearch 2026-10-02.
from _hk import F, emit
ST="https://www.sapporo.travel/en/gourmet/"; RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"SPR",["HOKKAIDO"],"the original 'soup curry' — ~20-spice medicinal-food broth","Magic Spice Sapporo Honten (マジックスパイス 札幌本店)",
  "Hongō-dōri 8-chōme Minami 6-2, Shiroishi-ku, Sapporo, Hokkaido, Japan",
  "The shop that named 'soup curry' — a broth of about twenty spices built on the idea that food is medicine, ordered by escalating heat levels.",
  [("MAPPLE",MP+"spot/1000281/"),("RURUBU",RU+"article/13216")],status=O,ssrc="MAPPLE spot page (address/phone current)")
F(1,"SPR",["HOKKAIDO"],"'original shrimp-dashi' soup curry","Okushiba Shōten Ekimae Sōseiji (奥芝商店 駅前創成寺)",
  "Hokuren Bldg B1F, Kita 4-jō Nishi 1-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Soup curry rebuilt around a sweet, rich shrimp-head dashi, piled with Hokkaido vegetables — the chain's station-side temple-themed branch.",
  [("SAPPOROTRAVEL",ST+"shop/shop_337-4/"),("RURUBU",RU+"article/13216")],status=O,ssrc="sapporo.travel shop listing (current)")
F(2,"SPR",["HOKKAIDO"],"thick, rich soup curry loaded with vegetables","Sapporo Rakkyo Kotoni (札幌らっきょ 琴似店)",
  "Capitaine Kotoni 1F, Kotoni 1-jō 1-7-7, Nishi-ku, Sapporo, Hokkaido, Japan",
  "A Kotoni stalwart whose deep, concentrated broth is the one curry-heads graduate to.",
  [("SAPPOROTRAVEL",ST+"feature/soupcarry/"),("MAPPLE",MP+"article/41624/")],status=O,ssrc="sapporo.travel soup-curry feature (current)")
F(1,"SPR",["HOKKAIDO"],"jingisukan of purebred Hokkaido Suffolk lamb","Jingisukan Hitsujikai no Mise Itadakimasu (羊飼いの店 いただきます。)",
  "Minami 5-jō Nishi 5-1-6, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A Susukino jingisukan run by an owner who took up shepherding to supply it — rare cuts of purebred Hokkaido Suffolk on the domed grill.",
  [("SAPPOROTRAVEL",ST+"shop/shop_183-4/"),("RURUBU",RU+"spot/80071391"),("MAPPLE",MP+"spot/1016315/")],status=O,ssrc="rurubu&more spot page (hours current)")
F(1,"SPR",["HOKKAIDO"],"charcoal jingisukan in a former members-only club (est. 1953)","Tsukisappu Jingisukan Club (ツキサップじんぎすかんクラブ)",
  "Tsukisamu-higashi 3-11-2-5, Toyohira-ku, Sapporo, Hokkaido, Japan",
  "Fresh mutton over charcoal in clay braziers, at a ranch-side club that began in 1953 as members-only.",
  [("SAPPOROTRAVEL",ST+"shop/tsukisappu-jingisukan-club/"),("RURUBU",RU+"article/22385")],status=O,ssrc="sapporo.travel shop listing (current)")
F(2,"SPR",["HOKKAIDO"],"charcoal-grilled Suffolk lamb","Shibetsu Barbecue (士別バーベキュー)",
  "Minami 3-jō Nishi 7-7, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A Tanukikōji 7-chōme arcade grill counted among the city's best for rare Suffolk lamb from Shibetsu.",
  [("SAPPOROTRAVEL",ST+"feature/hokkaido-local-dish-genghis-khan-mongolian-barbecue/"),("RURUBU",RU+"article/22385")],status=O,ssrc="sapporo.travel jingisukan feature (current)")
emit("W31")
