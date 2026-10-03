#!/usr/bin/env python3
# W68 — roadside stations with a sourced signature food (ja.wikipedia pins): Space Apple Yoichi (OTARU), Misogi no Sato
# Kikonai (DONAN). Biei Oka no Kura pin read but no named dish → not added. WebSearch 2026-10-02 (s3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"
O="open"
F(2,"OTARU",["SWEET","MKT"],"Yoichi-apple juice, house ice cream and apple pie","Michi-no-eki Space Apple Yoichi (道の駅 スペース・アップルよいち)",
  "Yoichi, Yoichi District, Hokkaido, Japan",
  "Yoichi's roadside station in apple country — orchard juice, house-made ice cream and apple pie from local fruit.",
  [("RURUBU",RU+"spot/80084534"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9%E3%83%BB%E3%82%A2%E3%83%83%E3%83%97%E3%83%AB%E3%82%88%E3%81%84%E3%81%A1")],
  43.188917,140.788972,"high","ja.wikipedia 道の駅スペース・アップルよいち infobox (北緯43度11分20.1秒 東経140度47分20.3秒) via WebSearch",O,"rurubu&more spot page (current)")
F(2,"DONAN",["SWEET","SAKE","MKT"],"'misogi salt' soft-serve and salt bread; local sake 'Misogi no Mai'","Michi-no-eki Misogi no Sato Kikonai (道の駅 みそぎの郷 きこない)",
  "At JR Kikonai Station (Hokkaido Shinkansen), Kikonai, Kamiiso District, Hokkaido, Japan",
  "The roadside station at the first Hokkaido Shinkansen stop — sweets and bread built on the salt of Kikonai's midwinter Kanchū Misogi festival, and the town's own sake.",
  [("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/dounanmitinoeki/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%BF%E3%81%9D%E3%81%8E%E3%81%AE%E9%83%B7_%E3%81%8D%E3%81%93%E3%81%AA%E3%81%84")],
  41.6778,140.435,"high","ja.wikipedia 道の駅みそぎの郷 きこない infobox (北緯41度40分40秒 東経140度26分06秒) via WebSearch",O,"visit-hokkaido.jp Dōnan roadside-station feature (current)")
emit("W68")
