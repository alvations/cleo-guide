#!/usr/bin/env python3
# W78 — NSK sights: Niseko Goshiki Onsen (promoted from held), Niseko Yumoto Onsen & Ōyunuma (ja.wikipedia pins). WebSearch 2026-10-02 (s3).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"
O="open"
S(2,"NSK","Niseko Goshiki Onsen (ニセコ五色温泉)","Between the Niseko Annupuri and Iwaonupuri trailheads, Niseko mountains, Hokkaido, Japan",
  "A 1930 mountain hot spring at 750 m, smelling of sulphur, whose free-flowing water shifts from clear to milky white — hence 'five colours'.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spa/spot/detail_10601.html"),("WIKIPEDIA_JA",JA+"%E4%BA%94%E8%89%B2%E6%B8%A9%E6%B3%89_(%E5%8C%97%E6%B5%B7%E9%81%93)")],
  42.873194,140.637417,"high","ja.wikipedia 五色温泉 (北海道) infobox (北緯42度52分23.5秒 東経140度38分14.7秒) via WebSearch",O,"visit-hokkaido.jp onsen page (current)",k="mountain onsen",g=["ONSEN","NATURE"])
S(3,"NSK","Niseko Yumoto Onsen & Ōyunuma (ニセコ湯本温泉・大湯沼)","Foot of Mt Chisenupuri, Niseko mountains, Hokkaido, Japan",
  "At the foot of Chisenupuri — a bubbling mud-sulphur pond where you watch the hot spring welling up, with onsen lodges around it.",
  [("NISEKOTOURISM","https://www.niseko-ta.jp/en/model-course/article/mountain-onsen-course/"),("WIKIPEDIA_JA",JA+"%E3%83%8B%E3%82%BB%E3%82%B3%E6%B9%AF%E6%9C%AC%E6%B8%A9%E6%B3%89")],
  42.86969,140.59786,"med","ja.wikipedia ニセコ湯本温泉 infobox (北緯42度52分11秒 東経140度35分52秒 — onsen-area point) via WebSearch",O,"niseko-ta.jp model course (current)",k="onsen & sulphur pond",g=["ONSEN","NATURE","FREE"])
emit("W78")
