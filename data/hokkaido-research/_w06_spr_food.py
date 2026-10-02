#!/usr/bin/env python3
# W06 — SPR sights b2 + regional food canon (Hakodate shio ramen, Lucky Pierrot, Asahikawa ramen, Obihiro butadon,
# Otaru sushi). WebSearch 2026-10-02 (session 2).
from _hk import S, F, emit
JA="https://ja.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"; VH="https://www.visit-hokkaido.jp/en/"; VHE="https://en.visit-hokkaido.jp/"
def jg(p): return ("JAPANGUIDE",JG+p)
O="open"
# ---- SPR sights ----
S(2,"SPR","Ōkurayama Ski Jump Stadium & Sapporo Olympic Museum (大倉山ジャンプ競技場)","Miyanomori, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The 1972 Winter Olympics large hill — ride the chairlift to the top-of-jump observatory over the city, then the Olympic Museum at its foot.",
  [jg("e5308.html"),("WIKIPEDIA_JA",JA+"%E5%A4%A7%E5%80%89%E5%B1%B1%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%E7%AB%B6%E6%8A%80%E5%A0%B4"),("WIKIPEDIA","https://en.wikipedia.org/wiki/Okurayama_Ski_Jump_Stadium")],
  43.0513250,141.29000,"high","ja.wikipedia 大倉山ジャンプ競技場 infobox (北緯43度03分4.77秒 東経141度17分24秒) via WebSearch",
  O,"japan-guide.com e5308 (observatory + museum, current)",k="ski jump olympic view",g=["VIEW","MUS"])
S(2,"SPR","Shiroi Koibito Park (白い恋人パーク)","Miyanosawa 2-jō, Nishi-ku, Sapporo, Hokkaido, Japan",
  "Ishiya's Tudor-style chocolate factory behind Hokkaido's most famous souvenir cookie — factory line views, cookie workshops, a free courtyard and café.",
  [jg("e5307.html"),("WIKIPEDIA_JA",JA+"%E7%99%BD%E3%81%84%E6%81%8B%E4%BA%BA%E3%83%91%E3%83%BC%E3%82%AF")],43.08861,141.27167,"high","ja.wikipedia 白い恋人パーク infobox (北緯43度05分19秒 東経141度16分18秒) via WebSearch",
  O,"japan-guide.com e5307 (current)",k="chocolate factory cookie",g=["POP","MUS"])
S(1,"SPR","Nijō Market (二条市場)","Minami 3-jō Higashi 1–2-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A city block of crab, uni, ikura and fish stalls since the Meiji era, with kaisendon counters and the Noren Yokochō drinking alley.",
  [jg("e5310.html"),("WIKIPEDIA_JA",JA+"%E4%BA%8C%E6%9D%A1%E5%B8%82%E5%A0%B4"),("JUSTONECOOKBOOK","https://www.justonecookbook.com/hokkaido-sapporo-travel-guide")],
  43.058306,141.358472,"high","ja.wikipedia 二条市場 infobox (北緯43度3分29.9秒 東経141度21分30.5秒) via WebSearch",
  O,"japan-guide.com e5310 (current)",k="seafood market",g=["MKT","ICON"])
S(2,"SPR","Susukino (すすきの)","Minami 4-jō – Minami 7-jō Nishi 2–6-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Japan's biggest entertainment district north of Tokyo — the Nikka neon man, Ramen Yokochō, izakaya towers and the February ice-sculpture site.",
  [jg("e5305.html"),("JUSTONECOOKBOOK","https://www.justonecookbook.com/hokkaido-sapporo-travel-guide")],status=O,ssrc="japan-guide.com e5305 (current)",k="nightlife district neon",g=["NIGHT","ICON"])
S(2,"SPR","Sapporo Curb Market — Jōgai Shijō (札幌場外市場)","Kita 11-jō Nishi 21–22-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Around 60 stalls and seafood diners on the edge of the Central Wholesale Market — early-morning crab and kaisendon away from the downtown crowds.",
  [jg("e5317.html"),("WIKIPEDIA_JA",JA+"%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8D%B8%E5%A3%B2%E5%B8%82%E5%A0%B4")],status=O,ssrc="japan-guide.com e5317 (current)",k="morning market seafood",g=["MKT"])
S(2,"SPR","Tanukikōji Shopping Street (狸小路商店街)","Minami 2/3-jō Nishi 1–7-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Hokkaido's oldest shopping arcade (1873) — seven covered blocks of drugstores, souvenir shops, retro diners and the market at 7-chōme.",
  [("WIKIPEDIA_JA",JA+"%E7%8B%B8%E5%B0%8F%E8%B7%AF%E5%95%86%E5%BA%97%E8%A1%97"),("JUSTONECOOKBOOK","https://www.justonecookbook.com/hokkaido-sapporo-travel-guide")],status=O,ssrc="Just One Cookbook Sapporo guide (current)",k="shopping arcade",g=["MKT","FREE"])
# ---- food: Hakodate / Asahikawa / Obihiro / Otaru ----
F(1,"DONAN",["RAMEN"],"Hakodate shio ramen (Ajisai shio — kelp-clear broth)","Ajisai Honten, Hakodate (函館麺厨房あじさい 本店)",
  "Goryōkaku area, Hakodate, Hokkaido, Japan",
  "Founded 1930, the name in Hakodate shio ramen: a clear broth of southern-Dōnan kelp with pork and chicken bone and rock salt. Tabelog Ramen Hokkaido 100.",
  [("TABELOG100","https://www.gltjp.com/ja/directory/item/13744/"),("HOKKAIDOTOURISM",VHE+"destinations/foodie-tours-in-hakodate-checking-out-the-local-favorites"),("HOKKAIDOTOURISM",VH+"spot/detail_12825.html")],
  status=O,ssrc="Tabelog Ramen HOKKAIDO 百名店 selection (current) via Good Luck Trip directory")
F(2,"DONAN",["INT"],"Chinese Chicken Burger","Lucky Pierrot Bay Area Honten (ラッキーピエロ ベイエリア本店)",
  "Bay Area waterfront (Suehiro-chō), Hakodate, Hokkaido, Japan",
  "Hakodate's own clown-themed burger chain (17 branches, all in the city) — the Chinese Chicken Burger, curry rice and soft-serve; the waterfront flagship.",
  [("HOKKAIDOTOURISM",VHE+"destinations/foodie-tours-in-hakodate-checking-out-the-local-favorites"),jg("e5312.html")],
  status=O,ssrc="visit-hokkaido.jp Hakodate foodie feature (current)")
F(1,"DHOKU",["RAMEN"],"Asahikawa shōyu ramen (oily-sealed double broth, thin wavy noodles)","Asahikawa Ramen Village (あさひかわラーメン村)",
  "Nagayama, Asahikawa, Hokkaido, Japan",
  "Eight of Asahikawa's best-known shops under one roof — the city's shōyu style: pork-bone and seafood double broth sealed under a film of lard, thin, firm, wavy noodles.",
  [jg("e6893.html"),("HOKKAIDOTOURISM",VHE+"destinations/the-tastiest-village-in-hokkaido-the-asahikawa-ramen-village")],
  status=O,ssrc="japan-guide.com e6893 (current)")
F(1,"TKC",["HOKKAIDO"],"butadon (charcoal-grilled pork bowl, the 1933 original)","Ganso Butadon no Panchō, Obihiro (元祖豚丼のぱんちょう)",
  "In front of Obihiro Station, Obihiro, Hokkaido, Japan",
  "The 1933 Obihiro shop credited with inventing butadon — sweet-soy charcoal-grilled pork on rice, the Tokachi soul food. The name is from the Chinese 'fan ting'.",
  [("GOODLUCKTRIP","https://www.gltjp.com/ja/directory/item/15300/"),("HOKKAIDOTOURISM",VH+"spot/detail_12868.html")],
  status=O,ssrc="Good Luck Trip directory (operating, 90+ years) — current")
F(2,"TKC",["HOKKAIDO"],"butadon","Butadon no Tonta, Obihiro (ぶた丼のとん田)",
  "Obihiro, Hokkaido, Japan",
  "Among Obihiro's most popular butadon counters; Michelin Bib Gourmand in the Hokkaido 2017 special edition.",
  [("MICHELIN_BIB","https://guide.michelin.com/sg/en/article/news-and-views/hokkaido-guide-2017")],
  status=O,ssrc="nap-camp Obihiro butadon feature (2025, operating) — status signal only")
F(1,"OTARU",["SUSHI"],"Otaru edomae sushi","Isezushi, Otaru (伊勢鮨)",
  "3-15-3 Inaho, Otaru, Hokkaido, Japan",
  "Otaru's Michelin-starred sushi counter (Hokkaido guide one star), with a casual by-the-piece outpost inside Otaru Station.",
  [("MICHELIN_STAR","https://guide.michelin.com/sg/en/article/news-and-views/hokkaido-guide-2017"),("MACARONI","https://macaro-ni.jp/100221"),("OTARUTOURISM","https://otaru.gr.jp/project/otarujishin-202302sushi")],
  status=O,ssrc="macaroni Otaru sushi feature (named writer 高井なお; current)")
OUT=[{"key":"MACARONI","name":"macaroni (macaro-ni.jp)","url":"https://macaro-ni.jp/","credible":"Major Japanese food-lifestyle media with bylined writers; one source."},
     {"key":"MICHELIN_STAR","name":"Michelin Guide Hokkaido — star","url":"https://guide.michelin.com/","credible":"Institutional authority (Michelin star) — lone-solo per the gate."}]
emit("W06",OUT)
