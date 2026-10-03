#!/usr/bin/env python3
# W53 — roadside stations with a sourced signature food (ja.wikipedia pins): Shikabe geyser steam-cooking (DONAN),
# Pia 21 Shihoro beef (TKC). WebSearch 2026-10-02 (s3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"
O="open"
F(1,"DONAN",["HOKKAIDO","MKT"],"steam-cook-it-yourself seafood over geyser vents; Shikabe tarako","Michi-no-eki Shikabe Kanketsusen Kōen (道の駅 しかべ間歇泉公園)",
  "Shikabe, Kayabe District, Hokkaido, Japan",
  "A roadside station built around a geyser that blows about 15 m every 10–15 minutes — buy seafood and vegetables and steam them yourself in the hot-spring steam, then Shikabe cod roe at the Hama no Kaa-san canteen.",
  [("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/8638/"),("RURUBU",RU+"spot/80001301"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%97%E3%81%8B%E3%81%B9%E9%96%93%E6%AD%87%E6%B3%89%E5%85%AC%E5%9C%92")],
  42.02847,140.83067,"high","ja.wikipedia 道の駅しかべ間歇泉公園 infobox (北緯42度01分42秒 東経140度49分50秒) via WebSearch",O,"visit-hokkaido travel-navi listing (current)")
F(2,"TKC",["WAGYU","HOKKAIDO"],"Shihoro beef steak on a shovel-shaped iron plate","Michi-no-eki Pia 21 Shihoro (道の駅 ピア21しほろ)",
  "Shihoro, Katō District, Hokkaido, Japan",
  "The barn-roofed food hub of a beef-and-potato town — the Nijiiro Shokudō serves Shihoro beef steak with the town's vegetables.",
  [("RURUBU",RU+"spot/80001771"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%83%94%E3%82%A221%E3%81%97%E3%81%BB%E3%82%8D")],
  43.14433,143.23931,"high","ja.wikipedia 道の駅ピア21しほろ infobox (北緯43度08分40秒 東経143度14分22秒) via WebSearch",O,"rurubu&more spot page (prices current)")
emit("W53")
