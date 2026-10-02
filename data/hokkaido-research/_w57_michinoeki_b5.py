#!/usr/bin/env python3
# W57 — roadside stations with a sourced signature food (ja.wikipedia pins): Utonai-ko (IBURI hokki curry),
# Biei Shirogane Birke (DHOKU Biei-wheat burgers). WebSearch 2026-10-02 (s3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"
O="open"
F(2,"IBURI",["HOKKAIDO","RAMEN","MKT"],"hokki (surf clam) seafood curry, hokki chirashi and Tomakomai miso-curry ramen","Michi-no-eki Utonai-ko (道の駅 ウトナイ湖)",
  "Beside Lake Utonai, Tomakomai, Hokkaido, Japan",
  "Beside Lake Utonai — a farm-and-fish shop and restaurant serving Tomakomai's hokki curry and the city's half-century-old miso-curry ramen.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/plan/detail_93.html"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%82%A6%E3%83%88%E3%83%8A%E3%82%A4%E6%B9%96")],
  42.69975,141.69442,"high","ja.wikipedia 道の駅ウトナイ湖 infobox (北緯42度41分59秒 東経141度41分40秒) via WebSearch",O,"visit-hokkaido.jp model course (current)")
F(2,"DHOKU",["INT","SWEET","HOKKAIDO"],"Biei-wheat-bun burgers (BETWEEN THE BREAD) and Blue Pond bakes","Michi-no-eki Biei Shirogane Birke (道の駅 びえい「白金ビルケ」)",
  "Shirogane, Biei, Kamikawa District, Hokkaido, Japan",
  "A birch-wood station at the Blue Pond gateway — burgers on Biei-wheat buns with premium patties, a bakery and Blue-Pond-themed treats.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_10368.html"),("RURUBU",RU+"spot/80122609"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%B3%E3%81%88%E3%81%84%E3%80%8C%E7%99%BD%E9%87%91%E3%83%93%E3%83%AB%E3%82%B1%E3%80%8D")],
  43.503056,142.597333,"high","ja.wikipedia 道の駅びえい「白金ビルケ」 infobox (北緯43度30分11.0秒 東経142度35分50.4秒) via WebSearch",O,"visit-hokkaido.jp spot 10368 (current)")
emit("W57")
