#!/usr/bin/env python3
# W54 — NSK roadside stations with a sourced signature food (ja.wikipedia pins): 230 Rusutsu (farm produce, pizza),
# Makkari Flower Center (yuri-ne lily bulb — Japan's top producer). WebSearch 2026-10-02 (s3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"
O="open"
F(2,"NSK",["MKT","HOKKAIDO"],"morning-picked Rusutsu asparagus, sweet corn and tomatoes; the stand's pizza","Michi-no-eki 230 Rusutsu (道の駅 230ルスツ)",
  "Route 230, Rusutsu, Abuta District, Hokkaido, Japan",
  "Rusutsu growers' farm stand on Route 230 — asparagus, corn and tomatoes picked that morning in high season, and a pizza counter visitors detour for.",
  [("RURUBU",RU+"article/24894"),("MAPPLE","https://www.mapple.net/spot/1013158/"),("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/rusutsu22024/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85230%E3%83%AB%E3%82%B9%E3%83%84")],
  42.73994,140.88447,"high","ja.wikipedia 道の駅230ルスツ infobox (北緯42度44分24秒 東経140度53分04秒) via WebSearch",O,"rurubu&more feature (current)")
F(3,"NSK",["SWEET","MKT"],"yuri-ne (lily bulb) — monaka and castella made with it","Michi-no-eki Makkari Flower Center (道の駅 真狩フラワーセンター)",
  "Makkari, Abuta District, Hokkaido, Japan",
  "Makkari grows about 60% of Japan's edible lily bulbs — the station sells them fresh and baked into monaka and castella, under Mt Yōtei.",
  [("RURUBU",RU+"spot/80084539"),("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/8359/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E7%9C%9F%E7%8B%A9%E3%83%95%E3%83%A9%E3%83%AF%E3%83%BC%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC")],
  42.76194,140.80797,"high","ja.wikipedia 道の駅真狩フラワーセンター infobox (北緯42度45分43秒 東経140度48分29秒) via WebSearch",O,"rurubu&more spot page (current)")
emit("W54")
