#!/usr/bin/env python3
# W86 — DONAN/DHOKU sights (session 4 orchestrator): ja.wikipedia infobox coords + hakodate.travel / visit-hokkaido / japan-guide.
# WebSearch 2026-10-02 (s4).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; HT="https://www.hakodate.travel/en/sightseeing-spots/"; VH="https://www.visit-hokkaido.jp/en/"
O="open"
S(2,"DONAN","Trappistine Convent (天使の聖母トラピスチヌ修道院)","346 Kamiyunokawa-chō, Hakodate, Hokkaido, Japan",
  "Japan's first women's monastery — a 1927 Gothic-Romanesque brick church on the hills above Yunokawa, 35 minutes by bus from Hakodate Station.",
  [("HAKODATETRAVEL","https://www.hakodate.travel/idn/sightseeing-spots/shrine-temple-church/trappistine-convent/"),("WIKIPEDIA_JA",JA+"天使の聖母トラピスチヌ修道院")],
  41.7878500,140.8225139,"high","ja.wikipedia 天使の聖母トラピスチヌ修道院 infobox (北緯41度47分16.26秒 東経140度49分21.05秒) via WebSearch",O,"hakodate.travel spot page (current)",g=["TEMPLE"])
S(2,"DONAN","Seikan Ferry Memorial Ship Mashū-maru (函館市青函連絡船記念館摩周丸)","12 Wakamatsu-chō, Hakodate, Hokkaido, Japan",
  "A Seikan rail ferry retired in 1988 and moored as a museum 5 minutes from Hakodate Station — bridge and radio room kept as they sailed.",
  [("HAKODATETRAVEL",HT+"museum/seikan-ferry-memorial-ship-mashu-maru/"),("HOKKAIDOTOURISM","https://safe-travel.visit-hokkaido.jp/en/facility/facility2045/"),("WIKIPEDIA_JA",JA+"函館市青函連絡船記念館摩周丸")],
  41.772944,140.721889,"high","ja.wikipedia 函館市青函連絡船記念館摩周丸 infobox (北緯41度46分22.6秒 東経140度43分18.8秒) via WebSearch",O,"hakodate.travel spot page (current)",g=["MUS"])
S(3,"DHOKU","Miura Ayako Memorial Literature Museum (三浦綾子記念文学館)","Kagura 7-jō 8-chōme 2-15, Asahikawa, Hokkaido, Japan",
  "In the 15-ha Foreign Tree Species forest where her novel Hyōten (Freezing Point) is set — with the restored study where the ailing Miura dictated her books.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_10231.html"),("WIKIPEDIA_JA",JA+"三浦綾子記念文学館")],
  43.753583,142.347833,"high","ja.wikipedia 三浦綾子記念文学館 infobox (北緯43度45分12.9秒 東経142度20分52.2秒) via WebSearch",O,"visit-hokkaido spot page (hours current)",g=["MUS"])
S(2,"DHOKU","Hagoromo Falls, Tenninkyō (羽衣の滝)","Tenninkyō, Higashikawa, Kamikawa District, Hokkaido, Japan",
  "A 270 m multi-step fall, one of Japan's celebrated waterfalls — a 15–20 minute trail from the end of the Tenninkyō Onsen road in Daisetsuzan.",
  [("JAPANGUIDE","https://www.japan-guide.com/e/e6778.html"),("WIKIPEDIA_JA",JA+"羽衣の滝")],
  43.6263361,142.7868111,"high","ja.wikipedia 羽衣の滝 infobox (北緯43度37分34.81秒 東経142度47分12.52秒) via WebSearch",O,"japan-guide Tenninkyō page (trail described as current)",g=["NATURE"])
JG="https://www.japan-guide.com/e/e6720.html"
S(2,"NSK","Niseko Village Ski Resort (ニセコビレッジ)","Higashiyama, Niseko, Abuta District, Hokkaido, Japan",
  "The former Higashiyama area west of Hirafu — Hilton Niseko Village at the base and a forest course weaving through native woods; linked to Hirafu and Annupuri at the summit.",
  [("JAPANGUIDE",JG),("TIMEOUT","https://www.timeout.com/tokyo/things-to-do/niseko-village"),("WIKIPEDIA_JA",JA+"ニセコビレッジ")],
  42.846583,140.676139,"high","ja.wikipedia ニセコビレッジ infobox (北緯42度50分47.7秒 東経140度40分34.1秒) via WebSearch",O,"japan-guide Niseko page (current)",g=["NATURE"])
S(3,"NSK","Niseko Annupuri International Ski Area (ニセコアンヌプリ国際スキー場)","Niseko, Abuta District, Hokkaido, Japan",
  "The quieter, gentler of Niseko's big three — wide beginner- and family-friendly runs, less crowded, on the All Mountain Pass.",
  [("JAPANGUIDE",JG),("NISEKOTOURISM","https://www.niseko-ta.jp/en/news/article/annupuri-ski-area-open/"),("WIKIPEDIA_JA",JA+"ニセコアンヌプリ国際スキー場")],
  42.85333,140.64861,"high","ja.wikipedia ニセコアンヌプリ国際スキー場 infobox (北緯42度51分12秒 東経140度38分55秒) via WebSearch",O,"niseko-ta.jp season-open notice",g=["NATURE"])
S(3,"NSK","Niseko Moiwa Ski Resort (ニセコモイワスキーリゾート)","Niseko, Abuta District, Hokkaido, Japan",
  "A small independent fourth resort west of Annupuri — off the All Mountain Pass, so uncrowded and loved by powder purists and beginners.",
  [("JAPANGUIDE",JG),("WIKIPEDIA_JA",JA+"ニセコモイワスキーリゾート")],
  42.84833,140.62972,"high","ja.wikipedia ニセコモイワスキーリゾート infobox (北緯42度50分54秒 東経140度37分47秒) via WebSearch",O,"japan-guide Niseko page (current)",g=["NATURE"])
emit("W86")
