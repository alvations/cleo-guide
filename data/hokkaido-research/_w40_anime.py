#!/usr/bin/env python3
# W40 — ANIME & pop-culture layer: Pokémon Center Sapporo, Hokuchin Memorial Museum (Golden Kamuy / 7th Division),
# Hakodate Arena (Love Live! Sunshine!!), Snow Miku Sky Town (New Chitose Airport). WebSearch 2026-10-02.
# Held/dropped candidates are logged in _note_W40.md.
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"
O="open"
S(2,"SPR","Pokémon Center Sapporo (ポケモンセンターサッポロ)",
  "Daimaru Sapporo 8F, Kita 5-jō Nishi 4-7, Chuo-ku, Sapporo 060-0005, Hokkaido, Japan",
  "Hokkaido's only official Pokémon Center, on the 8th floor of Daimaru by Sapporo Station — ~2,500 items incl. Sapporo-only Pikachu goods and pins.",
  [("OFFICIAL","https://www.pokemon.co.jp/shop/tc/pokecen/sapporo/"),("OFFICIAL","https://shop.pokemon.co.jp/en/shop/pokemoncenter-sapporo/"),
   ("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/movies/detail/5293773160001/")],
  None,None,"","",O,"pokemon.co.jp store page + voice.pokemon.co.jp Sapporo event post May 2026 (current)",
  k="character store",g=["ANIME","POP"],
  anime="Pokémon — the franchise's official flagship store for Hokkaido, with Sapporo-exclusive merchandise")
S(2,"DHOKU","Hokuchin Memorial Museum, Asahikawa (北鎮記念館)","Shunkō-chō, Asahikawa, Hokkaido, Japan",
  "Free JGSDF museum at Camp Asahikawa on the Imperial Army's 7th Division and Meiji-era Asahikawa — uniforms and bayonets that Golden Kamuy fans come to see.",
  [("WIKIPEDIA_JA",JA+"%E5%8C%97%E9%8E%AE%E8%A8%98%E5%BF%B5%E9%A4%A8"),("TRAVELJP","https://www.travel.co.jp/guide/matome/7456/"),
   ("OFFICIAL","https://www.mod.go.jp/gsdf/nae/2d/hokutin2/mission.html")],
  43.788389,142.364861,"high","ja.wikipedia 北鎮記念館 infobox (北緯43度47分18.2秒 東経142度21分53.5秒) via WebSearch",
  O,"mod.go.jp JGSDF 2nd Division museum page (current)",k="military history museum",g=["ANIME","MUS","FREE"],
  anime="Golden Kamuy — the real 7th Division's museum; Noda Satoru's uniform references, a core fan pilgrimage")
S(3,"DONAN","Hakodate Arena (函館アリーナ)","Yunokawa-chō 1-32-2, Hakodate, Hokkaido, Japan",
  "Hakodate's arena by Yunokawa Onsen — the Love Live! regional-preliminary venue in Sunshine!! S2 and the real home of the 2018 Saint Snow-hosted Hakodate Unit Carnival.",
  [("ANIMETOURISM88","https://animetourism88.com/en/places/love-live-sunshine/"),("WIKIPEDIA_JA",JA+"%E5%87%BD%E9%A4%A8%E3%82%A2%E3%83%AA%E3%83%BC%E3%83%8A"),
   ("GAMER4","https://www.4gamer.net/games/999/G999905/20201102123/")],
  41.78194,140.78333,"high","ja.wikipedia 函館アリーナ infobox (北緯41度46分55秒 東経140度47分00秒) via WebSearch",
  O,"ja.wikipedia 函館アリーナ (operating municipal arena)",k="arena · anime pilgrimage",g=["ANIME"],
  anime="Love Live! Sunshine!! — the Hakodate venue of the S2 regional preliminaries (Saint Snow's home city)")
S(3,"IBURI","Snow Miku Sky Town, New Chitose Airport (雪ミク スカイタウン)","Domestic Terminal 4F, New Chitose Airport, Chitose, Hokkaido, Japan",
  "Shop-and-museum for Snow Miku, the white Hatsune Miku born from a 2010 Sapporo Snow Festival sculpture — life-size figure, illustrations, airport-only goods.",
  [("OFFICIAL","https://www.hokkaido-airports.com/ja/new-chitose/spend/shop/237/"),("TRAVELWATCH","https://travel.watch.impress.co.jp/img/trw/docs/1633/637/html/04_o.jpg.html"),
   ("FUNJAPAN","https://www.fun-japan.jp/jp/articles/12670")],
  None,None,"","",O,"hokkaido-airports.com shop page 237 (current)",k="character museum & shop",g=["ANIME","POP"],
  anime="Hatsune Miku / Snow Miku — Sapporo-based Crypton's Hokkaido mascot Miku, with her permanent airport museum")
emit("W40")
