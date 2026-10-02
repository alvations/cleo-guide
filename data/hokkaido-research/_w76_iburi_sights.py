#!/usr/bin/env python3
# W76 — IBURI sights: Mt Tarumae (wiki pin + visit-hokkaido + japan-guide), Ōyunuma River natural footbath (no own coord).
# Rejected: an "大湯沼" coordinate surfaced without its own article (likely the onsen-town point) → UNVERIFIED. WebSearch 2026-10-02 (s3).
from _hk import S, emit
O="open"
S(2,"IBURI","Mount Tarumae (樽前山)","Southeast of Lake Shikotsu, Tomakomai / Chitose, Hokkaido, Japan",
  "A 1,041 m active volcano crowned by the lava dome of its 1909 eruption — about an hour from the 7th-station car park to the crater rim's 360° walk (the crater itself is off-limits).",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_10138.html"),("JAPANGUIDE","https://www.japan-guide.com/ad/national-parks/shikotsu-toya/"),("WIKIPEDIA_JA","https://ja.wikipedia.org/wiki/%E6%A8%BD%E5%89%8D%E5%B1%B1")],
  42.690556,141.376694,"high","ja.wikipedia 樽前山 infobox (北緯42度41分26.0秒 東経141度22分36.1秒) via WebSearch",O,"visit-hokkaido.jp spot 10138 (current)",k="volcano hike",g=["NATURE","VIEW","FREE"])
S(2,"IBURI","Ōyunuma River Natural Footbath, Noboribetsu (大湯沼川天然足湯)","Noboribetsu Onsen, Noboribetsu, Hokkaido, Japan",
  "A free footbath in a steaming river fed by a ~130°C crater lake, through primeval forest about 30 minutes' walk from the park service centre.",
  [("NOBORIBETSUTOURISM","https://noboribetsu-spa.jp/en/spot/spot0068/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_11428.html")],
  status=O,ssrc="visit-hokkaido.jp spot 11428 (hours 8:00–17:00, winter closure possible)",k="natural footbath",g=["ONSEN","NATURE","FREE"])
emit("W76")
