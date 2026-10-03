#!/usr/bin/env python3
# W38 — DOTO food canon: Kushiro ramen, Kushiro robata at MOO, Akkeshi oysters, Utoro seafood. WebSearch 2026-10-02 (s3).
# KUSHIROTOURISM = kushiro-lakeakan.com, the Kushiro City / Lake Akan tourism association's official site.
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; VH="https://www.visit-hokkaido.jp/spot/"; KT="http://en.kushiro-lakeakan.com/eat_souvenir/"
O="open"
F(1,"DOTO",["RAMEN"],"Kushiro ramen — thin noodles in clear bonito-shōyu broth","Kushiro Rāmen Kawamura (釧路ラーメン 河むら)",
  "Suehiro-chō 5-3, Kushiro, Hokkaido, Japan",
  "The mainstream of Kushiro ramen: a crystal-clear, bonito-led shōyu soup and fine curly noodles, served into the Suehiro nightlife hours.",
  [("RURUBU",RU+"spot/80000831"),("KUSHIROTOURISM",KT+"7817/")],status=O,ssrc="rurubu&more spot page (hours current)")
F(1,"DOTO",["HOKKAIDO","IZAKAYA","MKT"],"Kushiro robatayaki — the quayside 'Ganpeki Robata' charcoal grill (mid-May–Oct)","Kushiro Fisherman's Wharf MOO & Ganpeki Robata (釧路フィッシャーマンズワーフMOO・岸壁炉ばた)",
  "At the foot of Nusamai Bridge, Kushiro, Hokkaido, Japan",
  "Kushiro's harbour hall by Nusamai Bridge — a fish market downstairs, the retro 'Minato no Yatai' upstairs, and in summer the open-air quayside robata where you grill your own catch.",
  [("HOKKAIDOTOURISM",VH+"detail_10066.html"),("KUSHIROTOURISM",KT+"7530/"),("MAPPLE",MP+"spot/1001253/"),("WIKIPEDIA_JA",JA+"%E9%87%A7%E8%B7%AF%E3%83%95%E3%82%A3%E3%83%83%E3%82%B7%E3%83%A3%E3%83%BC%E3%83%9E%E3%83%B3%E3%82%BA%E3%83%AF%E3%83%BC%E3%83%95MOO")],
  42.98175,144.3835,"high","ja.wikipedia 釧路フィッシャーマンズワーフMOO infobox (北緯42度58分54.3秒 東経144度23分0.6秒) via WebSearch",O,"visit-hokkaido.jp spot 10066 (Ganpeki Robata hours current)")
F(1,"DOTO",["HOKKAIDO","SUSHI"],"Akkeshi oysters — raw, grilled and in oyster dishes","Akkeshi Mikaku Terminal Conchiglie — Michi-no-eki Akkeshi Gourmet Park (厚岸味覚ターミナル コンキリエ)",
  "Akkeshi, Akkeshi District, Hokkaido, Japan",
  "The roadside station of Japan's year-round oyster town — oyster restaurants, a grill-it-yourself seafood shop and oyster sweets above Akkeshi Bay.",
  [("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/akkeshi/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E5%8E%9A%E5%B2%B8%E3%82%B0%E3%83%AB%E3%83%A1%E3%83%91%E3%83%BC%E3%82%AF")],
  43.05767,144.84411,"high","ja.wikipedia 道の駅厚岸グルメパーク infobox (北緯43度03分28秒 東経144度50分39秒) via WebSearch",O,"visit-hokkaido.jp feature (current)")
F(2,"DOTO",["HOKKAIDO","SUSHI"],"seasonal Shiretoko salmon dishes (tokishirazu, karafuto-masu, ittō-kenzake)","Michi-no-eki Utoro Shiretoku restaurant (道の駅うとろ・シリエトク)",
  "Utoro, Shari, Shari District, Hokkaido, Japan",
  "The Utoro roadside station's local-catch restaurant: spring tokishirazu, summer pink salmon, autumn-winter prime chum — Shiretoko seafood at fair prices.",
  [("MAPPLE",MP+"article/81226/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%86%E3%81%A8%E3%82%8D%E3%83%BB%E3%82%B7%E3%83%AA%E3%82%A8%E3%83%88%E3%82%AF")],
  44.06903,144.99069,"high","ja.wikipedia 道の駅うとろ・シリエトク infobox (北緯44度04分09秒 東経144度59分26秒) via WebSearch",O,"MAPPLE Utoro seafood article (current)")
emit("W38")
