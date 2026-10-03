#!/usr/bin/env python3
# W52 — roadside stations with a sourced signature food (ja.wikipedia pins): Mukawa shishamo (IBURI), Sarufutsu scallops (SOYA).
# WebSearch 2026-10-02 (s3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"
O="open"
F(2,"IBURI",["HOKKAIDO","MKT"],"seasonal Mukawa shishamo dishes","Michi-no-eki Mukawa Shiki no Yakata (道の駅 むかわ四季の館)",
  "Mukawa, Yūfutsu District, Hokkaido, Japan",
  "The roadside station of Japan's shishamo town — its Tanpopo dining room serves the local smelt in season.",
  [("RURUBU",RU+"spot/80084536"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%82%80%E3%81%8B%E3%82%8F%E5%9B%9B%E5%AD%A3%E3%81%AE%E9%A4%A8")],
  42.57381,141.92497,"high","ja.wikipedia 道の駅むかわ四季の館 infobox (北緯42度34分26秒 東経141度55分30秒) via WebSearch",O,"rurubu&more spot page (hours current)")
F(2,"SOYA",["HOKKAIDO","MKT"],"Sarufutsu scallop curry and 'hotate-meshi' ekiben","Michi-no-eki Sarufutsu Kōen (道の駅 さるふつ公園)",
  "Sarufutsu, Sōya District, Hokkaido, Japan",
  "On the Okhotsk coast of Japan's scallop capital — scallop curry in the restaurant and the station's own scallop-rice bento.",
  [("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/9165/"),("RURUBU",RU+"spot/80001583"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%95%E3%82%8B%E3%81%B5%E3%81%A4%E5%85%AC%E5%9C%92")],
  45.32922,142.17733,"high","ja.wikipedia 道の駅さるふつ公園 infobox (北緯45度19分45秒 東経142度10分38秒) via WebSearch",O,"visit-hokkaido travel-navi listing (current)")
emit("W52")
