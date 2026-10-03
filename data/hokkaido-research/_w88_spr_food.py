#!/usr/bin/env python3
# W88 — SPR (Sapporo) food & drink: miso ramen, soup curry, jingisukan, kaisendon, Susukino bars, craft beer, kissaten,
# shime-parfait, sweets. WebSearch 2026-10-03 (s5). Pins: none read in a result unless a lat is given (lat=None = UNVERIFIED).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; ST="https://www.sapporo.travel/"
RA24="https://ramenadventures.com/2025/01/09/hokkaido-best-ramen-2024/"
O="open"
# ---------------- ramen ----------------
F(2,"SPR",["RAMEN","HOKKAIDO"],"scallop-paste ramen (hotate paste melted into the soup)","Ame wa, Yasashiku No.2 (雨は、やさしくNo.2)",
  "Kita 7-jō Higashi 3-chōme, Higashi-ku, Sapporo, Hokkaido, Japan",
  "A creative Sapporo shop whose signature bowl comes with a scallop paste you stir in as you eat. rurubu's 2025 list of local favourites includes it.",
  [("RURUBU",RU+"article/22643"),("SAPPOROTRAVEL",ST+"gourmet/shop/shop_111-2/"),("MAPPLE",MP+"spot/1018169/")],status=O,ssrc="rurubu 2025 feature + sapporo.travel shop page (current)")
F(2,"SPR",["RAMEN","HOKKAIDO"],"Sapporo miso ramen (its own take on the classic)","Hachinoki (八乃木)",
  "Hassamu, Nishi-ku, Sapporo, Hokkaido, Japan",
  "Keeps the traditional Sapporo miso style while developing its own. One of rurubu's seven classic miso shops for 2025, and new on Ramen Adventures' Hokkaido list at #15.",
  [("RURUBU",RU+"article/22377"),("RAMENADVENTURES",RA24)],status=O,ssrc="rurubu 2025 ramen feature (current)")
F(2,"SPR",["RAMEN","HOKKAIDO"],"miso ramen with wok-fried vegetables","Sapporo Menya Mitsubaki (札幌麺屋 美椿)",
  "Nishi-ku, Sapporo, Hokkaido, Japan",
  "A noren-wake offshoot of a famous Sapporo shop; its miso ramen layers miso, stock and wok-fried vegetables. On rurubu's classic-seven list, and a new entry at #19 on Ramen Adventures' 2024 Hokkaido list.",
  [("RURUBU",RU+"article/16757"),("RURUBU",RU+"article/22377"),("RAMENADVENTURES",RA24)],status=O,ssrc="rurubu 2025 ramen feature (current)")
F(2,"SPR",["RAMEN","HOKKAIDO"],"refined tanrei shōyu and 'evolved' miso ramen","Sapporo Bon no Kaze (札幌 凡の風)",
  "Minami 8-jō Nishi 15-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Serves two signature bowls: a clean tanrei shōyu and a modern miso. On rurubu's 2025 local-favourites list, and new on Ramen Adventures' 2024 Hokkaido list at #21.",
  [("RURUBU",RU+"spot/80000023"),("RAMENADVENTURES",RA24)],status=O,ssrc="rurubu spot page (current)")
F(3,"SPR",["RAMEN"],"seabura tonkotsu shōyu ramen (back-fat pork-bone soy)","Ramen Tetsuya Minami 7-jō Honten (らーめん てつや 南7条本店)",
  "Minami 7-jō Nishi 12-chōme 2-19, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The Sapporo shop that brought rich back-fat tonkotsu shōyu to a miso city; the head branch is in southern Chuo-ku.",
  [("RURUBU",RU+"spot/80000143"),("MAPPLE",MP+"spot/1010153/")],status=O,ssrc="rurubu + mapple spot pages (current)")
# ---------------- parfait / bars ----------------
F(3,"SPR",["SWEET"],"shime-parfait with 20+ house-made gelato","Shiawase no Recipe ~Sweet~ Susukino (幸せのレシピ～スイート～ すすきの店)",
  "Big Silver Bldg B1F, Minami 3-jō Nishi 4-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A late-night parfait basement in central Susukino, open until about 2 am: seasonal parfaits built on more than 20 house-made gelato.",
  [("RURUBU",RU+"article/10282"),("MAPPLE",MP+"spot/1018027/")],status=O,ssrc="rurubu shime-parfait feature (hours 19:00–2:00 LO, open daily)")
F(2,"SPR",["INT"],"Hokkaido-produce 'liquid cooking' cocktails (haskap & shiso; blue cheese & white chocolate)","the bar nano.femto, Susukino",
  "Miyako Bldg 7F, Minami 3-jō Nishi 3-chōme 3-5, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A cocktail counter that treats cocktails as liquid cooking, made with seasonal fruit and vegetables bought from Hokkaido growers. Pairings include haskap with shiso, and blue cheese with white chocolate.",
  [("MAPPLE",MP+"original/402825/"),("RURUBU",RU+"article/10242")],status=O,ssrc="mapple Sapporo-bar feature + rurubu cocktail article (current)")
F(2,"SPR",["SAKE","HOKKAIDO"],"Hokkaido-only sake flights (~300 local sake, shōchū, beer, wine) with zangi and farm cheese","Hokkaidō-sanshu BAR Kamada (北海道産酒BAR かま田)",
  "MY Plaza Bldg 8F, Minami 4-jō Nishi 4-chōme 14-2, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Master sake sommelier Takashi Kamada pours only Hokkaido drinks, about 300 of them, with local bar food such as zangi and farm cheese. He speaks English.",
  [("RURUBU",RU+"spot/80089733"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_12969.html"),("SAPPOROTRAVEL",ST+"en/spot/feature/takashi_kamata/")],status=O,ssrc="visit-hokkaido spot page (hours Mon–Sat 18:00–1:00)")
# ---------------- sushi / seafood ----------------
F(2,"SPR",["SUSHI","HOKKAIDO"],"Nemuro-direct seasonal kaiten-zushi","Kaiten-zushi Nemuro Hanamaru, JR Tower Stellar Place (回転寿司 根室花まる JRタワーステラプレイス店)",
  "Sapporo Stellar Place Center 6F, Kita 5-jō Nishi 2-chōme, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Sapporo Station branch of the Nemuro conveyor-belt chain, with fish shipped direct from Nemuro. Locals rank it among the city's best kaiten-zushi, and the queues are long.",
  [("RURUBU",RU+"spot/80000125"),("MAPPLE",MP+"spot/1012355/"),("SAPPOROTRAVEL",ST+"en/feature/special-feature-locals-guide-to-best-conveyer-belt-sushi-in-sapporo/")],status=O,ssrc="rurubu spot page (11:00–23:00, irregular holidays)")
emit("W88")
