#!/usr/bin/env python3
# W05 — TKC (Tokachi) + NSK + DHOKU/SPR extras. WebSearch 2026-10-02 (session 2).
# Technique: ja.wikipedia (allowed_domains) + Japanese names → infobox 座標 for 3 places per query.
from _hk import S, F, emit
WP="https://en.wikipedia.org/wiki/"; JA="https://ja.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"; VH="https://www.visit-hokkaido.jp/en/"
MAP=("MAPPLE","https://www.mapple.net/region/a0101040000/spot/")
def jg(p): return ("JAPANGUIDE",JG+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
# ---- TKC ----
S(1,"TKC","Taushubetsu River Bridge (タウシュベツ川橋梁)","Nukabira, Kamishihoro, Katō District, Hokkaido, Japan",
  "The 1937 concrete arch viaduct of the abandoned Shihoro Line in Lake Nukabira — the 'phantom bridge' that surfaces and sinks with the reservoir; Japan Heritage.",
  [("WIKIPEDIA_JA",JA+"%E3%82%BF%E3%82%A6%E3%82%B7%E3%83%A5%E3%83%99%E3%83%84%E5%B7%9D%E6%A9%8B%E6%A2%81"),("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/for-the-best-views-in-japan-come-to-tokachi"),MAP],
  43.41556,143.18917,"high","ja.wikipedia タウシュベツ川橋梁 infobox (北緯43度24分56秒 東経143度11分21秒) via WebSearch",
  O,"visit-hokkaido.jp Tokachi feature (current; seasonal access by forest road / guided tour)",k="phantom bridge abandoned railway",g=["ICON","VIEW"])
S(1,"TKC","Lake Shikaribetsu (然別湖)","Shikaribetsu-kohan, Shikaoi, Katō District, Hokkaido, Japan",
  "Hokkaido's highest lake (810 m) and the only natural lake in Daisetsuzan National Park — canoeing in summer, an ice village with lake-ice onsen in winter.",
  [("WIKIPEDIA_JA",JA+"%E7%84%B6%E5%88%A5%E6%B9%96"),("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/for-the-best-views-in-japan-come-to-tokachi"),("MAPPLE","https://www.mapple.net/region/a0101040200/spot/")],
  43.27417,143.11667,"med","ja.wikipedia 然別湖 infobox (北緯43度16分27秒 東経143度7分0秒 — lake) via WebSearch",
  O,"visit-hokkaido.jp Tokachi feature (current)",k="mountain lake ice village",g=["NATURE","ONSEN","VIEW"])
S(2,"TKC","Kōfuku Station (旧国鉄広尾線 幸福駅)","Kōfuku-chō Higashi 1-sen, Obihiro, Hokkaido, Japan",
  "The closed Hiroo Line halt whose name means 'happiness' — the 'Ai-koku → Kōfuku' (from Love Country to Happiness) ticket made it a pilgrimage; old railcars and ticket-covered walls remain.",
  [("WIKIPEDIA_JA",JA+"%E5%B9%B8%E7%A6%8F%E9%A7%85"),("WIKIPEDIA",WP+"Hiroo_Line"),MAP],
  42.745250,143.161778,"high","ja.wikipedia 幸福駅 infobox (北緯42度44分42.9秒 東経143度9分42.4秒) via WebSearch",
  O,"MAPPLE Tokachi–Obihiro spot list (current)",k="happiness station",g=["POP","FREE"])
S(1,"TKC","Rokkatei Art Village Nakasatsunai (六花亭 中札内美術村)","Sakae-Higashi, Nakasatsunai, Kasai District, Hokkaido, Japan",
  "Rokkatei's oak-forest art village — four small museums, the sweets maker's restaurant and paths on old railway sleepers; free, late April–early November.",
  [vh("spot/detail_10457.html"),("WIKIVOYAGE","https://en.wikivoyage.org/wiki/Nakasatsunai")],42.6775,143.1625,"med","en.wikivoyage Nakasatsunai listing (42.6775, 143.1625) via WebSearch",
  O,"Wikivoyage listing (open Apr 25–Nov 4, 10:00–17:00) + visit-hokkaido.jp 10457",k="art village forest museums",g=["MUS","NATURE","FREE"])
S(2,"TKC","Manabe Garden (真鍋庭園)","Inada-chō Higashi 2-sen, Obihiro, Hokkaido, Japan",
  "Japan's first conifer garden — 83,000 m² of Japanese, Western and landscape gardens with thousands of trees from Northern Europe and Canada; on the Hokkaido Garden Path.",
  [vh("spot/detail_10127.html"),("WIKIVOYAGE","https://en.wikivoyage.org/wiki/Obihiro")],status=O,ssrc="visit-hokkaido.jp spot 10127 (current)",k="conifer garden",g=["GARDEN","NATURE"])
S(2,"TKC","Tokachi Millennium Forest (十勝千年の森)","Haobi, Shimizu, Kamikawa District (Tokachi), Hokkaido, Japan",
  "A forest planned to last a thousand years, with Dan Pearson's Earth, Meadow, Forest and Farm gardens — horse trekking and Segway tours; Hokkaido Garden Path.",
  [("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/for-the-best-views-in-japan-come-to-tokachi"),MAP],status=O,ssrc="visit-hokkaido.jp Tokachi feature (current)",k="garden forest",g=["GARDEN","NATURE"])
S(2,"TKC","Rokka no Mori (六花の森)","Nishi 3-sen, Nakasatsunai, Kasai District, Hokkaido, Japan",
  "Rokkatei's 100,000 m² meadow of the 'Tokachi six flowers' painted on its wrapping paper, with small galleries of botanical art; Hokkaido Garden Path.",
  [vh("spot/detail_11228.html"),MAP],status=O,ssrc="visit-hokkaido.jp spot 11228 (current)",k="flower meadow gallery",g=["GARDEN","MUS"])
# ---- NSK ----
S(1,"NSK","Mount Yōtei (羊蹄山)","Kutchan / Makkari / Kyōgoku / Niseko, Abuta District, Hokkaido, Japan",
  "'Ezo-Fuji' — a near-perfect 1,898 m stratovolcano towering over the Niseko ski fields; its snowmelt feeds the Fukidashi springs.",
  [("WIKIPEDIA",WP+"Mount_Yotei"),jg("e6720.html")],42.82667,140.81139,"high","en.wikipedia Mount_Yōtei infobox (42°49′36″N 140°48′41″E) via WebSearch",
  O,"japan-guide.com e6720 (current)",k="volcano ezo fuji",g=["ICON","NATURE","VIEW"])
# ---- DHOKU ----
S(1,"DHOKU","Farm Tomita (ファーム富田)","Kisen-kita, Nakafurano, Sorachi District, Hokkaido, Japan",
  "The farm that kept Furano's lavender alive and made it famous — July's purple slopes and the striped 'Irodori' flower field under the Tokachi range. Free entry.",
  [("WIKIPEDIA",WP+"Farm_Tomita"),jg("e6826.html")],43.41944,142.42778,"high","en.wikipedia Farm_Tomita infobox (43°25′10″N 142°25′40″E) via WebSearch",
  O,"japan-guide.com e6826 (current)",k="lavender fields",g=["ICON","GARDEN","FREE"])
# ---- SPR food ----
F(2,"SPR",["HOKKAIDO"],"soup curry with contract-farmed Hokkaido vegetables","Rojiura Curry SAMURAI Sakura (路地裏カリィ侍. 櫻)",
  "Sapporo, Hokkaido, Japan (Sakura branch)",
  "Rich soup curry built on vegetables contracted from farmers in Shibetsu and Nayoro — the 'Samurai' chain's original back-alley style.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/gourmet/shop/soupcarry/"),("JAPANTRAVEL","https://en.japantravel.com/hokkaido/soup-curry-samurai/7366")],status=O,ssrc="sapporo.travel official soup-curry feature (current)")
OUT=[{"key":"WIKIPEDIA_JA","name":"Wikipedia (Japanese)","url":"https://ja.wikipedia.org/","credible":"Japanese Wikipedia — notability + published infobox coordinates; corroborating only, never a lone recommender."},
     {"key":"MAPPLE","name":"MAPPLE (Shobunsha) — まっぷるトラベルガイド","url":"https://www.mapple.net/","credible":"Online edition of Shobunsha's Mapple guidebooks, a Japanese guidebook publisher of record; editorial spot listings, one source."},
     {"key":"JAPANTRAVEL","name":"Japan Travel (en.japantravel.com)","url":"https://en.japantravel.com/","credible":"Long-running English Japan travel media with named on-the-ground writers; one source."}]
emit("W05",OUT)
