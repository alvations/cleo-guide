#!/usr/bin/env python3
# W72 — DOTO sights: Nusamai Bridge (Kushiro sunsets), Kamuiwakka Hot Falls. WebSearch 2026-10-02 (s3).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"
O="open"
S(2,"DOTO","Nusamai Bridge, Kushiro (幣舞橋)","Over the Kushiro River from JR Kushiro Station, Kushiro, Hokkaido, Japan",
  "One of Hokkaido's three famous bridges (1889, rebuilt 1976) with bronze statues of the four seasons — the stage for Kushiro's famous sunsets.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_10121.html"),("KUSHIROTOURISM","http://en.kushiro-lakeakan.com/overview/3747/"),("WIKIPEDIA_JA",JA+"%E5%B9%A3%E8%88%9E%E6%A9%8B")],
  42.981028,144.385556,"high","ja.wikipedia 幣舞橋 infobox (北緯42度58分51.7秒 東経144度23分08.0秒) via WebSearch",O,"visit-hokkaido.jp spot 10121 (current)",k="bridge & sunset",g=["VIEW","NIGHT","FREE"])
S(2,"DOTO","Kamuiwakka Hot Falls, Shiretoko (カムイワッカ湯の滝)","Kamuiwakka River, Shari, Shari District, Hokkaido, Japan",
  "A river heated by the active Mt Shiretoko-Iō — wade upstream through warm water to falls whose basins are natural hot baths; 'Water of the Gods' in Ainu.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_10412.html"),("WIKIPEDIA_JA",JA+"%E3%82%AB%E3%83%A0%E3%82%A4%E3%83%AF%E3%83%83%E3%82%AB%E6%B9%AF%E3%81%AE%E6%BB%9D")],
  status=O,ssrc="visit-hokkaido.jp spot 10412 (current; seasonal access)",k="hot-spring waterfall",g=["NATURE","ONSEN"])
emit("W72")
