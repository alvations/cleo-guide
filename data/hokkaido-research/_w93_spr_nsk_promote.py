#!/usr/bin/env python3
# W93 — SPR/NSK promotions of held singles (session 5 orchestrator): second outlet page found for W85/W88 held candidates.
# WebSearch 2026-10-03 (s5). Pins only from ja.wikipedia infobox coords read in the results.
from _hk import S, F, emit
RU="https://rurubu.jp/andmore/spot/"; JA="https://ja.wikipedia.org/wiki/"
O="open"
F(3,"SPR",["HOKKAIDO"],"roux-based soup curry built on a Western-trained chef's broth","Curry Shokudō Kokoro Sapporo Honten (カレー食堂 心 札幌本店)",
  "City Heim N15 1F, Kita 15-jō Nishi 4-chōme 2-23, Kita-ku, Sapporo, Hokkaido, Japan",
  "A neighbourhood soup-curry house near Hokkaido University since 2001 — a roux-based broth from a chef with a yōshoku background; a 4-minute walk from Kita-18 Station.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/gourmet/shop/shop_80-2/"),("RURUBU",RU+"80000264")],status=O,ssrc="sapporo.travel shop page (hours current, no closure)")
F(3,"SPR",["HOKKAIDO"],"jingisukan of 'Roaring Forties' lamb and fresh lamb shoulder loin","Jingisukan Yōyōtei Sapporo Honten (ジンギスカン羊々亭 札幌本店)",
  "Matsuoka Bldg 5F, Minami 4-jō Nishi, Chūō-ku (Susukino), Sapporo, Hokkaido, Japan",
  "A Susukino lamb hall beside Susukino Station exit 2 — six cuts of lamb from rolls to chops grilled on the dome, plus lamb shabu-shabu.",
  [("RURUBU",RU+"80089216"),("MAPPLE","https://www.mapple.net/spot/1013598/")],status=O,ssrc="rurubu spot page (hours current; closed 1 Jan only)")
S(3,"SPR","Sapporo Salmon Museum (札幌市豊平川さけ科学館)","Makomanai Kōen 2-1, Minami-ku, Sapporo, Hokkaido, Japan",
  "A free museum in Makomanai Park with tanks of some 20 salmonid species (including the giant itō) and outdoor pools where wild salmon spawn each autumn.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/find/recreational/salmon_museum/"),("MAPPLE","https://www.mapple.net/spot/1001080/"),("RURUBU",RU+"80000314"),("WIKIPEDIA_JA",JA+"札幌市豊平川さけ科学館")],
  43.00111,141.34333,"high","ja.wikipedia 札幌市豊平川さけ科学館 infobox (北緯43度0分4秒 東経141度20分36秒) via WebSearch",O,"sapporo.travel page (hours current)",g=["MUS","FREE"])
S(3,"SPR","Sapporo Science Center (札幌市青少年科学館)","Atsubetsu-chūō 1-jō 5-chōme 2-20, Atsubetsu-ku, Sapporo, Hokkaido, Japan",
  "A hands-on 'see, touch, think' science museum by Shin-Sapporo Station, with Hokkaido's largest planetarium.",
  [("RURUBU",RU+"80121112"),("SAPPOROTRAVEL","https://www.sapporo.travel/sightseeing.photolibrary/area/area07/5752/"),("WIKIPEDIA_JA",JA+"札幌市青少年科学館")],
  43.03611,141.47222,"high","ja.wikipedia 札幌市青少年科学館 infobox (北緯43度02分10秒 東経141度28分20秒) via WebSearch",O,"rurubu spot page (seasonal hours current)",g=["MUS"])
F(3,"NSK",["HOKKAIDO"],"original soup curry with big vegetable and chicken pieces","Niseko Curry Koya (ニセコ カリー小屋)",
  "Niseko Hirafu 5-jō 2-chōme 2-11, Kutchan, Abuta District, Hokkaido, Japan",
  "A Hirafu soup-curry pioneer opened in 1988, when Sapporo itself had only a handful — rich-yet-light house broth, generous chunks; lunch only, sells out. Its retort curry is a Kutchan souvenir.",
  [("RURUBU",RU+"80001384"),("KUTCHANTOWN","https://www.town.kutchan.hokkaido.jp/file/contents/708/50789/kutchanmiyagecatalog.pdf")],status=O,ssrc="rurubu spot page (hours current: closed Tue/Fri)")
emit("W93",[{"key":"KUTCHANTOWN","name":"Kutchan Town (official municipal site)","url":"https://www.town.kutchan.hokkaido.jp/tourism/","credible":"Official municipal government of Kutchan — publishes the town's souvenir/specialty catalogue; official-tourism tier."}])
