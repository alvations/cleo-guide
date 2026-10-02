#!/usr/bin/env python3
# W55 — roadside stations with a sourced signature food (ja.wikipedia pins): Nanairo Nanae (DONAN), Ryūhyō Kaidō Abashiri
# (DOTO), Mashū Onsen (DOTO). WebSearch 2026-10-02 (s3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"
O="open"
F(2,"DONAN",["SWEET","HOKKAIDO","MKT"],"Kohara guaraná soft-serve and Yamakawa-ranch beef croquettes","Michi-no-eki Nanairo Nanae (道の駅 なないろ・ななえ)",
  "Nanae, Kameda District, Hokkaido, Japan",
  "Nanae's food-and-history station, in the birthplace of Western-style farming in Japan — guaraná soft-serve from the local soda maker and croquettes of Yamakawa ranch beef.",
  [("RURUBU",RU+"spot/80113740"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%AA%E3%81%AA%E3%81%84%E3%82%8D%E3%83%BB%E3%81%AA%E3%81%AA%E3%81%88")],
  41.92597,140.65606,"high","ja.wikipedia 道の駅なないろ・ななえ infobox (北緯41度55分33秒 東経140度39分22秒) via WebSearch",O,"rurubu&more spot page (current)")
F(1,"DOTO",["HOKKAIDO","MKT","SAKE"],"Abashiri burger, Abashiri zangi-don, Okhotsk drift-ice curry and 'Ryūhyō Draft' beer","Michi-no-eki Ryūhyō Kaidō Abashiri (道の駅 流氷街道網走)",
  "Abashiri, Hokkaido, Japan",
  "Abashiri's roadside station — the Kinema-kan food court does local-only dishes like the pink-salmon-and-yam Abashiri burger.",
  [("RURUBU",RU+"spot/80000973"),("MAPPLE","https://www.mapple.net/spot/1018093/"),("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/7590/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E6%B5%81%E6%B0%B7%E8%A1%97%E9%81%93%E7%B6%B2%E8%B5%B0")],
  44.02206,144.27392,"high","ja.wikipedia 道の駅流氷街道網走 infobox (北緯44度01分19秒 東経144度16分26秒) via WebSearch",O,"rurubu&more spot page (current)")
F(3,"DOTO",["HOKKAIDO","SWEET"],"Ezo venison burger and 'Cream Dōwa' ice cream","Michi-no-eki Mashū Onsen (道の駅 摩周温泉)",
  "Teshikaga, Kawakami District, Hokkaido, Japan",
  "The Teshikaga stop for Lake Mashū — Ezo-deer burgers and local dairy ice cream alongside the area's produce.",
  [("RURUBU",RU+"spot/80001892"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E6%91%A9%E5%91%A8%E6%B8%A9%E6%B3%89")],
  43.49239,144.44769,"high","ja.wikipedia 道の駅摩周温泉 infobox (北緯43度29分33秒 東経144度26分52秒) via WebSearch",O,"rurubu&more spot page (current)")
emit("W55")
