#!/usr/bin/env python3
# W85 — SPR sights batch (session 4): ja.wikipedia infobox coords + sapporo.travel / visit-hokkaido. WebSearch 2026-10-02 (s4).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; ST="https://www.sapporo.travel/en/spot/facility/"; VH="https://www.visit-hokkaido.jp/en/"
O="open"
S(2,"SPR","Sapporo Concert Hall Kitara (札幌コンサートホールKitara)","Nakajima Kōen 1-15, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Hokkaido's first dedicated concert hall and home of the Sapporo Symphony Orchestra — a glass-walled hall in Nakajima Park famed for its soft, deep acoustics.",
  [("SAPPOROTRAVEL",ST+"concert_hall_kitara/"),("WIKIPEDIA_JA",JA+"札幌コンサートホールKitara")],
  43.04417,141.35250,"high","ja.wikipedia 札幌コンサートホールKitara infobox (北緯43度02分39秒 東経141度21分09秒) via WebSearch",O,"sapporo.travel facility page (current)",g=["NIGHT"])
S(2,"SPR","Hokkaido University Museum (北海道大学総合博物館)","Kita 10-jō Nishi 8-chōme, Kita-ku, Sapporo, Hokkaido, Japan",
  "A 1929 scratch-tile campus building holding 3 million+ specimens gathered over 140 years — free, 10 minutes' walk from Sapporo Station.",
  [("SAPPOROTRAVEL",ST+"hokkaido_university_museum/"),("HOKKAIDOTOURISM",VH+"spot/detail_13068.html"),("WIKIPEDIA_JA",JA+"北海道大学総合博物館")],
  43.07222,141.34167,"med","ja.wikipedia 北海道大学総合博物館 infobox (北緯43度4分20秒 東経141度20分30秒) via WebSearch — second-precision only; ~150 m W of the Kita-10 Nishi-8 entrance, on campus (med)",O,"sapporo.travel facility page (current)",g=["MUS","FREE"])
S(3,"SPR","Migishi Kōtarō Museum of Art, Hokkaido (北海道立三岸好太郎美術館)","Kita 2-jō Nishi 15-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Devoted to the Sapporo-born modernist painter who died at 31, with a reproduction of his atelier.",
  [("SAPPOROTRAVEL",ST+"migishi_kotaro_museum_of_art/"),("WIKIPEDIA_JA",JA+"北海道立三岸好太郎美術館")],
  43.061583,141.332833,"high","ja.wikipedia 北海道立三岸好太郎美術館 infobox (北緯43度3分41.7秒 東経141度19分58.2秒) via WebSearch",O,"sapporo.travel facility page (current)",g=["MUS"])
S(3,"SPR","Hokkaido Museum of Literature (北海道立文学館)","Nakajima Kōen 1-4, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Inside Nakajima Park: Hokkaido's literature from Ainu oral epics to Takiji Kobayashi and Ayako Miura — some 260,000 items.",
  [("SAPPOROTRAVEL",ST+"hokkaido_museum_of_literature/"),("WIKIPEDIA_JA",JA+"北海道立文学館")],
  43.044250,141.356167,"high","ja.wikipedia 北海道立文学館 infobox (北緯43度2分39.3秒 東経141度21分22.2秒) via WebSearch",O,"sapporo.travel facility page (current)",g=["MUS"])
S(2,"SPR","Nopporo Forest Park (野幌森林公園)","Atsubetsu-ku, Sapporo / Ebetsu, Hokkaido, Japan",
  "2,053 ha of lowland forest on Sapporo's edge — 17 trails through a wildlife sanctuary of Ezo squirrels and 150 bird species; the Hokkaido Museum and Historical Village sit at its edge.",
  [("SAPPOROTRAVEL",ST+"nopporo_forest_park/"),("HOKKAIDOTOURISM",VH+"spot/detail_10087.html"),("WIKIPEDIA_JA",JA+"道立自然公園野幌森林公園")],
  43.05250,141.50056,"med","ja.wikipedia 道立自然公園野幌森林公園 infobox (北緯43度03分09秒 東経141度30分02秒) via WebSearch — park reference point (large park, med)",O,"visit-hokkaido spot page (current)",g=["NATURE","FREE"])
S(3,"SPR","Koganeyu Onsen (小金湯温泉)","Koganeyu, Minami-ku, Sapporo, Hokkaido, Japan",
  "A quiet 1883 hot-spring hamlet on the Toyohira River, 5 km short of Jōzankei — settlers found the water under a giant katsura tree.",
  [("HOKKAIDOTOURISM",VH+"spa/spot/detail_10632.html"),("WIKIPEDIA_JA",JA+"小金湯温泉")],
  42.967833,141.218417,"med","ja.wikipedia 小金湯温泉 infobox (北緯42度58分4.2秒 東経141度13分6.3秒) via WebSearch — onsen-area point (med)",O,"visit-hokkaido spa page (current)",g=["ONSEN"])
S(1,"SPR","ES CON FIELD HOKKAIDO — Hokkaido Ballpark F Village (エスコンフィールドHOKKAIDO)","Hokkaido Ballpark F Village, Kitahiroshima, Hokkaido, Japan",
  "The Fighters' 2023 retractable-roof ballpark at the heart of a 32-ha 'F Village' — with TOWER 11's natural hot spring and sauna overlooking the field; parts open free on non-game days.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12199.html"),("HOKKAIDOTOURISM",VH+"spa/spot/detail_12199.html"),("WIKIPEDIA_JA",JA+"エスコンフィールドHOKKAIDO")],
  42.98972,141.54944,"high","ja.wikipedia エスコンフィールドHOKKAIDO infobox (北緯42度59分23秒 東経141度32分58秒) via WebSearch",O,"visit-hokkaido spot page (current)",g=["ICON","POP"])
S(2,"SPR","Sapporo Teine (サッポロテイネ)","Teine-ku, Sapporo, Hokkaido, Japan",
  "Sapporo's largest ski area, 40 minutes from downtown, with two 1972 Winter Olympic runs — the Olympic torch still overlooks the city and the Sea of Japan.",
  [("JAPANGUIDE","https://www.japan-guide.com/e/e5318.html"),("WIKIPEDIA_JA",JA+"サッポロテイネ")],
  43.09806,141.21028,"high","ja.wikipedia サッポロテイネ infobox (北緯43度05分53秒 東経141度12分37秒) via WebSearch",O,"japan-guide page (current)",g=["NATURE","VIEW"])
S(2,"SPR","Sapporo Kokusai Ski Resort (札幌国際スキー場)","Jōzankei, Minami-ku, Sapporo, Hokkaido, Japan",
  "Under an hour from the city yet with Niseko-rivalling snowfall — a 3.6 km forest trail and a 100 m-wide family run.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/sapporo_kokusai_skiing_resort/"),("HOKKAIDOTOURISM",VH+"spot/detail_12809.html"),("JAPANGUIDE","https://www.japan-guide.com/e/e5319.html"),("WIKIPEDIA_JA",JA+"札幌国際スキー場")],
  43.07222,141.08278,"high","ja.wikipedia 札幌国際スキー場 infobox (北緯43度04分20秒 東経141度04分58秒) via WebSearch",O,"sapporo.travel facility page (current)",g=["NATURE"])
S(3,"SPR","Sapporo City Astronomical Observatory (札幌市天文台)","Nakajima Kōen 1, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A 1958 public observatory in Nakajima Park with a 20 cm refractor — free night-time stargazing on six evenings a month.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/nakajima_park/"),("WIKIPEDIA_JA",JA+"札幌市天文台")],
  43.04528,141.352444,"high","ja.wikipedia 札幌市天文台 infobox (北緯43度2分43秒 東経141度21分8.8秒) via WebSearch",O,"sapporo.travel Nakajima Park page (current)",g=["FREE","NIGHT"])
emit("W85")
