#!/usr/bin/env python3
# W43 — SPR drink & late-night canon via Time Out "50 things to do in Sapporo" + sapporo.travel / Hokkaido Shimbun / MAPPLE.
# WebSearch 2026-10-02 (s3).
from _hk import F, emit
TO="https://www.timeout.com/tokyo/things-to-do/50-things-to-do-in-sapporo"
O="open"
F(1,"SPR",["SAKE"],"classic cocktails — the house 'Sapporo' and a Hennessy sidecar","Bar Yamazaki, Susukino (BARやまざき)",
  "Katsumi Bldg 4F, Minami 3-jō Nishi 3-3, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Susukino's authentic bar since 1958, founded by one of Japan's longest-serving bartenders — order the vodka 'Sapporo' and leave with a paper-cut silhouette of your profile.",
  [("TIMEOUT",TO),("MAPPLE","https://www.mapple.net/original/402825/")],status=O,ssrc="MAPPLE Susukino article (current)")
F(2,"SPR",["CAFE","SAKE"],"jazz café-bar — 15,000 records, no cover charge","Jazz Café Bossa, Tanukikōji (ジャズ喫茶 BOSSA)",
  "Tanukikōji, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A Tanukikōji jazz kissa open since 1971 whose owner's 15,000 records and CDs have carried Sapporo's jazz scene for half a century.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/gourmet/shop/bossa/"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/850050/"),("TIMEOUT",TO)],status=O,ssrc="sapporo.travel shop listing (current)")
F(2,"SPR",["TEISHOKU","IZAKAYA"],"'Miyoshino set' — six gyoza with curry rice and miso soup","Miyoshino Tanukikōji (みよしの 狸小路店)",
  "Minami 3-jō Nishi 2-chōme 16-4 (Tanukikōji 2-chōme), Chuo-ku, Sapporo, Hokkaido, Japan",
  "Sapporo's own gyoza-and-curry chain — the cult combo plate of six dumplings beside a pool of curry rice.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/gourmet/shop/shop_812/"),("TIMEOUT",TO)],status=O,ssrc="sapporo.travel shop listing (hours current)")
emit("W43")
