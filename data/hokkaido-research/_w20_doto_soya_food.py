#!/usr/bin/env python3
# W20 — DOTO (Kushiro zangi & spakatsu, Nemuro escalope) + SOYA (Rishiri ramen) food canon. WebSearch 2026-10-02 (s2).
from _hk import F, emit
MP="https://www.mapple.net/"; RU="https://rurubu.jp/andmore/"; NP="https://www.hokkaido-np.co.jp/"
O="open"
F(1,"DOTO",["HOKKAIDO","IZAKAYA"],"Kushiro zangi (marinated fried chicken with spiced dipping sauce)","Torimatsu, Kushiro (鳥松)",
  "Kushiro, Hokkaido, Japan",
  "Said to be the birthplace of zangi (1960) — chicken marinated in about ten seasonings, fried and eaten with a spiced sauce.",
  [("MAPPLE",MP+"article/42668/"),("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/kushirozangidon/")],status=O,ssrc="MAPPLE Kushiro local-food feature (current)")
F(1,"DOTO",["INT","TEISHOKU"],"spakatsu (spaghetti with meat sauce and a pork cutlet on a sizzling iron plate)","Restaurant Izumiya Sōhonten, Kushiro (レストラン泉屋 総本店)",
  "Kushiro, Hokkaido, Japan (sōhonten)",
  "Kushiro's yōshoku house since 1954 and home of the spakatsu — its meat sauce is the taste of the dish, now even sold retort-packed.",
  [("MAPPLE",MP+"article/42668/"),("HOKKAIDOSHIMBUN",NP+"article/881831/")],status=O,ssrc="Hokkaido Shimbun (retort meat-sauce story; restaurant operating)")
F(1,"DOTO",["INT","TEISHOKU"],"escalope (butter rice, pork cutlet, demi-glace)","New Montblanc, Nemuro (ニューモンブラン)",
  "Nemuro, Hokkaido, Japan (city centre)",
  "The original escalope shop: the dish was born around 1963 at Nemuro's 'Montblanc' and carried on here by a former cook — butter rice under a pork cutlet and demi-glace.",
  [("RURUBU",RU+"spot/80001081"),("MAPPLE",MP+"collection/126b3d1507d743b99b98fe237a8cd2ce/"),("HOKKAIDOSHIMBUN","https://tripeat.hokkaido-np.co.jp/topics/142071/")],status=O,ssrc="rurubu&more spot page (current)")
F(1,"SOYA",["RAMEN"],"yaki-shōyu ramen with Rishiri kombu broth","Rishiri Ramen Miraku (利尻らーめん味楽)",
  "67 Kutsugata-honmachi, Rishiri, Rishiri District, Hokkaido, Japan",
  "Island ramen that made the magazines and TV — scorched-soy broth built on generous Rishiri kelp; the Rishiri main shop was a Michelin Bib Gourmand in the Hokkaido special edition. Lunch 11:30–14:00.",
  [("MICHELIN_BIB","https://guide.michelin.com/sg/en/article/news-and-views/hokkaido-guide-2017"),("MAPPLE",MP+"region/a0101060300_g03000000/spot/")],status=O,ssrc="MAPPLE Rishiri gourmet list (hours listed, current)")
emit("W20")
