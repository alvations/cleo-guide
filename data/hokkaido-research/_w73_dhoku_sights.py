#!/usr/bin/env python3
# W73 — DHOKU sights: Asahibashi Bridge, Fukiage Onsen (free open-air bath), Shirogane Onsen. WebSearch 2026-10-02 (s3).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"
O="open"
S(2,"DHOKU","Asahibashi Bridge, Asahikawa (旭橋)","Over the Ishikari River, Asahikawa, Hokkaido, Japan",
  "The 1932 steel arch (224.82 m) over the Ishikari — one of Hokkaido's Three Great Bridges and the only one still in its original form; a Hokkaido Heritage site.",
  [("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/asahibashi-bridge-a-bridge-with-a-beautiful-arch-designated-a-hokkaido-heritage-site"),("WIKIPEDIA_JA",JA+"%E6%97%AD%E6%A9%8B_(%E6%97%AD%E5%B7%9D%E5%B8%82)")],
  43.77833,142.36,"high","ja.wikipedia 旭橋 (旭川市) infobox (北緯43度46分42秒 東経142度21分36秒) via WebSearch",O,"visit-hokkaido.jp feature (current)",k="historic bridge",g=["HISTORY","VIEW","FREE"])
S(2,"DHOKU","Fukiage Onsen open-air bath, Kamifurano (吹上温泉 吹上露天の湯)","Slopes of Mt Tokachi, Kamifurano, Sorachi District, Hokkaido, Japan",
  "A free, wild open-air hot spring about 1,000 m up the flank of Mt Tokachi, kept up for anyone to soak in.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spa/spot/detail_10635.html"),("WIKIPEDIA_JA",JA+"%E5%90%B9%E4%B8%8A%E6%B8%A9%E6%B3%89_(%E5%8C%97%E6%B5%B7%E9%81%93)")],
  43.431528,142.641583,"high","ja.wikipedia 吹上温泉 (北海道) infobox (北緯43度25分53.5秒 東経142度38分29.7秒) via WebSearch",O,"visit-hokkaido.jp onsen page (current)",k="wild onsen",g=["ONSEN","NATURE","FREE"])
S(3,"DHOKU","Biei Shirogane Onsen (白金温泉)","Shirogane, Biei, Kamikawa District, Hokkaido, Japan",
  "A quiet spa village at the foot of the Tokachidake range, named in 1950 for water 'as precious as platinum' — base for the Blue Pond and Shirahige Falls.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spa/spot/detail_10617.html"),("WIKIPEDIA_JA",JA+"%E7%99%BD%E9%87%91%E6%B8%A9%E6%B3%89")],
  status=O,ssrc="visit-hokkaido.jp onsen page (current)",k="onsen village",g=["ONSEN","NATURE"])
emit("W73")
