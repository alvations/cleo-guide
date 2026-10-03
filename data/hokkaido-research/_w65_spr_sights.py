#!/usr/bin/env python3
# W65 — SPR sights (ja.wikipedia pins + sapporo.travel / visit-hokkaido). WebSearch 2026-10-02 (s3).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; SF="https://www.sapporo.travel/en/spot/facility/"
O="open"
S(3,"SPR","Sapporo Satoland (サッポロさとらんど)","Okadama-chō 584-2, Higashi-ku, Sapporo, Hokkaido, Japan",
  "A 74.3 ha agricultural park of flower fields, farm animals and lawns — pick potatoes, onions and corn from mid-June to early November.",
  [("SAPPOROTRAVEL",SF+"satoland/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_10078.html"),("WIKIPEDIA_JA",JA+"%E3%82%B5%E3%83%83%E3%83%9D%E3%83%AD%E3%81%95%E3%81%A8%E3%82%89%E3%82%93%E3%81%A9")],
  43.11778,141.41444,"high","ja.wikipedia サッポロさとらんど infobox (北緯43度07分04秒 東経141度24分52秒) via WebSearch",O,"sapporo.travel facility page (current)",k="farm park",g=["NATURE","FREE"])
S(2,"SPR","Hiraoka Park plum grove (平岡公園 梅林)","Kiyota-ku, Sapporo, Hokkaido, Japan",
  "About 1,200 red and white plum trees — one of Sapporo's largest groves — whose May bloom draws some 100,000 visitors and announces spring.",
  [("SAPPOROTRAVEL",SF+"hiraoka-park/"),("WIKIPEDIA_JA",JA+"%E5%B9%B3%E5%B2%A1%E5%85%AC%E5%9C%92")],
  43.00833,141.46861,"high","ja.wikipedia 平岡公園 infobox (北緯43度00分30秒 東経141度28分07秒) via WebSearch",O,"sapporo.travel facility page (current)",k="plum blossom park",g=["NATURE","FREE"])
S(3,"SPR","Seikatei (清華亭)","Kita 7-jō Nishi 7-chōme, Kita-ku, Sapporo, Hokkaido, Japan",
  "An 1880 rest house built for Emperor Meiji's Hokkaido visit — a Western-style building blended with Japanese rooms; a city-designated cultural property.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/bunkazaisanpo/kaitakushi/"),("WIKIPEDIA_JA",JA+"%E6%B8%85%E8%8F%AF%E4%BA%AD")],
  43.068778,141.343694,"high","ja.wikipedia 清華亭 infobox (北緯43度4分7.6秒 東経141度20分37.3秒) via WebSearch",O,"sapporo.travel Kaitakushi heritage walk (current)",k="Meiji pavilion",g=["HISTORY","FREE"])
emit("W65")
