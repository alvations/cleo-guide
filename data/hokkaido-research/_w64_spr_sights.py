#!/usr/bin/env python3
# W64 — SPR sights (ja.wikipedia pins + sapporo.travel) + jingisukan Yūhi (sapporo.travel + GoodLuckTrip). WebSearch 2026-10-02 (s3).
from _hk import S, F, emit
JA="https://ja.wikipedia.org/wiki/"; SF="https://www.sapporo.travel/en/spot/facility/"
O="open"
S(2,"SPR","Maeda Forest Park (前田森林公園)","Teine-ku, Sapporo, Hokkaido, Japan",
  "A 1980s–90s landscape park whose 600 m-long, 15 m-wide canal runs dead straight toward Mt Teine.",
  [("SAPPOROTRAVEL",SF+"maeda_forest_park/"),("WIKIPEDIA_JA",JA+"%E5%89%8D%E7%94%B0%E6%A3%AE%E6%9E%97%E5%85%AC%E5%9C%92")],
  43.14583,141.25694,"high","ja.wikipedia 前田森林公園 infobox (北緯43度08分45秒 東経141度15分25秒) via WebSearch",O,"sapporo.travel facility page (current)",k="landscape park",g=["NATURE","VIEW","FREE"])
S(2,"SPR","Yurigahara Park (百合が原公園)","Kita-ku, Sapporo, Hokkaido, Japan",
  "A 25.4 ha flower park of some 6,400 plant varieties — the World Lily Gardens and gardens built with sister cities Portland, Munich and Shenyang.",
  [("SAPPOROTRAVEL",SF+"yurigahara_park/"),("WIKIPEDIA_JA",JA+"%E7%99%BE%E5%90%88%E3%81%8C%E5%8E%9F%E5%85%AC%E5%9C%92")],
  43.12889,141.36472,"high","ja.wikipedia 百合が原公園 infobox (北緯43度07分44秒 東経141度21分53秒) via WebSearch",O,"sapporo.travel facility page (current)",k="flower park",g=["NATURE","GARDEN","FREE"])
S(3,"SPR","Hokkaido Governor's Official Residence (北海道知事公館)","Chuo-ku, Sapporo, Hokkaido, Japan",
  "A 1936 Mitsui villa, state property since 1953 — its lawn garden, with millennium-old pit-dwelling remains, is open year round.",
  [("SAPPOROTRAVEL",SF+"governors_official_residence/"),("WIKIPEDIA_JA",JA+"%E5%8C%97%E6%B5%B7%E9%81%93%E7%9F%A5%E4%BA%8B%E5%85%AC%E9%A4%A8")],
  43.060111,141.332194,"high","ja.wikipedia 北海道知事公館 infobox (北緯43度03分36.4秒 東経141度19分55.9秒) via WebSearch",O,"sapporo.travel facility page (current)",k="historic villa & garden",g=["HISTORY","GARDEN","FREE"])
S(3,"SPR","Former Nagayama Takeshirō Residence (旧永山武四郎邸)","Chuo-ku, Sapporo, Hokkaido, Japan",
  "The c.1880 home of Hokkaido's second governor — a forerunner of pioneer-era houses joining a pure Japanese study and reception rooms to Western-style building.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/bunkazaisanpo/kaitakushi/"),("WIKIPEDIA_JA",JA+"%E6%97%A7%E6%B0%B8%E5%B1%B1%E6%AD%A6%E5%9B%9B%E9%83%8E%E9%82%B8")],
  43.0659111,141.3645167,"high","ja.wikipedia 旧永山武四郎邸 infobox (北緯43度3分57.28秒 東経141度21分52.26秒) via WebSearch",O,"sapporo.travel Kaitakushi heritage walk (current)",k="Meiji residence",g=["HISTORY"])
F(2,"SPR",["HOKKAIDO"],"salt-aged lamb jingisukan","Kiwami Shio-Jukusei Jingisukan Yūhi, Susukino (極 塩熟成ジンギスカン 夕陽)",
  "Susukino, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A Susukino jingisukan specialising in salt-aged lamb, on both the city tourism board's shop list and GoodLuckTrip's Hokkaido jingisukan twelve.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/gourmet/shop/shop_577-3/"),("GOODLUCKTRIP","https://www.gltjp.com/en/article/item/21090/")],status=O,ssrc="sapporo.travel shop listing (current)")
emit("W64")
