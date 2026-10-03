#!/usr/bin/env python3
# W90 — Dōhoku (DHOKU) + Tokachi (TKC) food & drink first, then a few sights. WebSearch 2026-10-03 (s5).
# Source keys reused: MAPPLE, RURUBU, ATCA (atca.jp, Asahikawa tourism), FURANOTOURISM (furanotourism.com),
# BIEITOURISM (biei-hokkaido.jp), HOKKAIDOTOURISM (visit-hokkaido.jp), OBIKAN, WIKIPEDIA_JA, JAPANGUIDE.
# New key: TVTOKYO_KODOKU (TV Tokyo's official Kodoku no Gurume episode page) — see SOURCES_HOKKAIDO_W90.json.
from _hk import F, S, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/spot/"; MP="https://www.mapple.net/"
VH="https://www.visit-hokkaido.jp/"; FT="https://www.furanotourism.com/jp/spot/spot_D.php?id="
O="open"
OUTLETS=[{"key":"TVTOKYO_KODOKU","name":"TV Tokyo — Kodoku no Gurume (official programme site)","url":"https://www.tv-tokyo.co.jp/kodokunogurume/",
          "credible":"Broadcaster's own episode page for the long-running national drama whose real-restaurant visits are a recognised food-pilgrimage canon; one ordinary source"}]

# ---------------- DHOKU ----------------
F(2,"DHOKU",["IZAKAYA","HOKKAIDO"],"Asahikawa shinkoyaki — charcoal-grilled young half-chicken in secret tare (¥1,045)","Dokushaku Sanshirō, Asahikawa (独酌 三四郎)",
  "2-jō-dōri 5-chōme hidari 7, Asahikawa, Hokkaido, Japan",
  "A 1946 izakaya ten minutes from Asahikawa Station: shinkoyaki under the house tare and sake chosen by the proprietress — the stop in Kodoku no Gurume's 2016 Asahikawa New Year special.",
  [("MAPPLE",MP+"article/43069/"),("ATCA","https://www.atca.jp/menberinfo/%E7%8B%AC%E9%85%8C%E4%B8%89%E5%9B%9B%E9%83%8E/"),("TVTOKYO_KODOKU","https://www.tv-tokyo.co.jp/kodokunogurume/sp012.html")],
  status=O,ssrc="atca.jp member listing (17:00–22:00, current)")
F(2,"DHOKU",["TEISHOKU","HOKKAIDO"],"Biei ebi-don (fried-prawn rice bowl) and the original 'Jun-dog'","Yōshoku to Café Junpei, Biei (洋食とcafé じゅんぺい)",
  "Honchō 4-chōme, Biei, Kamikawa District, Hokkaido, Japan",
  "An 8-minute walk from Biei Station: the town's famous prawn-tempura bowl, tails sticking out over the rim, and the birthplace of the rice-wrapped fried-prawn 'Jun-dog'. Lunch only, until sold out.",
  [("MAPPLE",MP+"spot/1010803/"),("BIEITOURISM","https://www.biei-hokkaido.jp/ja/facility/junpei")],
  status=O,ssrc="biei-hokkaido.jp facility page (11:00–15:00, closed Mon, current)")
F(2,"DHOKU",["IZAKAYA","WAGYU","HOKKAIDO"],"Furano omu-curry, Furano-wagyu dishes and local-milk cheese tofu","Kumagera, Furano (くまげら)",
  "Hinode-machi 3-22, Furano, Hokkaido, Japan",
  "A rustic Furano Station-side local-food house opened during the filming of 'Kita no Kuni kara' — Furano beef, wild-vegetable and seafood dishes, and listed by the tourism body for Furano omu-curry.",
  [("RURUBU",RU+"80001206"),("FURANOTOURISM",FT+"152&kid1=3&kid2=12&kid3=47")],
  status=O,ssrc="furanotourism.com spot 152 (11:30–22:00, closed Wed, current)")
F(3,"DHOKU",["SWEET","HOKKAIDO"],"Furano melon — fully-ripened melon by the slice, melon soft-serve and melon sweets","Tomita Melon House, Nakafurano (とみたメロンハウス)",
  "Miya-machi 3-32, Nakafurano, Sorachi District, Hokkaido, Japan",
  "A melon grower's shop and deck café facing the Tokachi range, near the lavender farms — cut Furano melon, melon soft-serve and melon-only sweets. Summer season only (Jun–Sep).",
  [("RURUBU",RU+"80001555"),("FURANOTOURISM",FT+"357")],
  status=O,ssrc="furanotourism.com spot 357 (Jun–Sep 9:00–17:00, current)")
F(3,"DHOKU",["SWEET","HOKKAIDO"],"additive-free, water-free jams (38 kinds) from Furano fruit and vegetables","Furano Jam-en, Rokugō (ふらのジャム園)",
  "Higashi-Rokugō 3, Furano, Hokkaido, Japan",
  "A jam workshop since 1974 in Rokugō, the 'Kita no Kuni kara' valley 30 minutes from Furano — jams cooked with no added water; free entry and tastings, with the Rokugō lookout beside it.",
  [("RURUBU",RU+"80001198"),("FURANOTOURISM",FT+"77&kid1=1&kid2=6&kid3=18"),("HOKKAIDOTOURISM",VH+"spot/detail_10152.html")],
  status=O,ssrc="furanotourism.com spot 77 (9:00–17:30 year-round, current)")

F(2,"DHOKU",["SAKE"],"junmai sake from Daisetsu groundwater — a 140-year-old Gifu brewery relocated to Higashikawa in 2020","Michizakura Shuzō, Higashikawa (三千櫻酒造)",
  "Nishi 2-gō Kita 23, Higashikawa, Kamikawa District, Hokkaido, Japan",
  "Japan's rare town-built, privately-run sake brewery: Michizakura (founded 1877 in Nakatsugawa, Gifu) moved its whole operation and its tōji to Higashikawa for the cold and the Taisetsu spring water. Shop 10:00–15:30.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12278.html"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1277744/"),("WIKIPEDIA_JA",JA+"%E4%B8%89%E5%8D%83%E6%AB%BB%E9%85%92%E9%80%A0")],
  status=O,ssrc="visit-hokkaido.jp spot 12278 (10:00–15:30, closed Tue, current)")
S(2,"DHOKU","Asahikawa City Museum (旭川市博物館)","Kagura 3-jō 7-chōme, Asahikawa, Hokkaido, Japan",
  "The museum of the Kamikawa basin's Ainu culture and pioneer history, in the Taisetsu Crystal Hall by the Chūbetsu River — a full-scale chise house, ritual tools and the settlers' story.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_11441.html"),("RURUBU",RU+"80000748"),("ATCA","https://www.atca.jp/kankouspoy/%E6%97%AD%E5%B7%9D%E5%B8%82%E5%8D%9A%E7%89%A9%E9%A4%A8/")],
  43.7594139,142.350639,"high","ja.wikipedia 旭川市大雪クリスタルホール infobox — the hall that houses the museum (北緯43度45分33.89秒 東経142度21分2.3秒) via WebSearch",O,"visit-hokkaido spot 11441 (current)",g=["MUS"])

# ---------------- TKC ----------------
F(2,"TKC",["HOKKAIDO","SWEET"],"raclette and the Euro-award-winning white-mould 'Sasayuki' from Brown Swiss milk","Kyōdō Gakusha Shintoku Farm (共働学舎新得農場)",
  "Shintoku, Kamikawa District (Tokachi), Hokkaido, Japan",
  "A farming community at the foot of the Hidaka range making European-style farmhouse cheese by hand from grass-fed Brown Swiss cows — its white-mould Sasayuki has taken medals in European contests; farm shop on site.",
  [("RURUBU",RU+"80001801"),("MAPPLE",MP+"spot/1015074/")],
  status=O,ssrc="rurubu&more spot page (current)")
F(3,"TKC",["MKT","HOKKAIDO"],"Tokachi farm produce, butadon and local sweets under one roof at the ban'ei track","Tokachi-mura, Obihiro (とかちむら)",
  "Nishi 13-jō Minami 8-chōme, Obihiro, Hokkaido, Japan",
  "Tokachi's food showcase inside the Obihiro Racecourse grounds: a farmers' direct market, eateries and sweet shops cooking local ingredients, specialty coffee and the horse museum — pair it with an evening of ban'ei racing.",
  [("OBIKAN","https://obikan.jp/post_spot/1506/"),("RURUBU",RU+"80000919"),("MAPPLE",MP+"spot/1015599/")],
  status=O,ssrc="obikan.jp spot 1506 (market 10:00–17:00, closed Wed, current)")
F(2,"TKC",["HOKKAIDO","TEISHOKU"],"Tokachi butadon and bread from Otofuke wheat (Japan's top wheat town)","Michi-no-eki Otofuke Natsuzora no Furusato (道の駅 おとふけ なつぞらのふる里)",
  "Otofuke, Katō District, Hokkaido, Japan",
  "Rebuilt and reopened in April 2022 as one of Hokkaido's biggest roadside stations, with a 'Natsuzora' (NHK drama) zone and a food court of Tokachi soul food — butadon, local-wheat bakeries and dairy.",
  [("RURUBU",RU+"80116023"),("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/tokachi_otofukemitinoeki/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%8A%E3%81%A8%E3%81%B5%E3%81%91")],
  42.974917,143.181694,"med","ja.wikipedia 道の駅おとふけ infobox (北緯42度58分29.7秒 東経143度10分54.1秒) via WebSearch — station relocated in 2022; infobox assumed to reflect the new site, re-verify",O,"rurubu&more 2022 reopening article + spot page (current)")

F(2,"DHOKU",["RAMEN"],"Asahikawa shōyu ramen and the 'horumon ramen' topped with grilled pork offal","Rāmen Senmon Himawari, Asahikawa (ラーメン専門 ひまわり 大雪通店)",
  "Taisetsu-dōri 3-chōme, Tokuichi Bldg 1F, Asahikawa, Hokkaido, Japan",
  "An old-guard Asahikawa shop 10 minutes' walk from Shin-Asahikawa Station that has fed generations of students — classic lard-sealed shōyu, and its signature bowl crowned with thick-cut grilled pork offal. Lunch to 17:00.",
  [("MAPPLE",MP+"article/43037/"),("RAMENADVENTURES","https://ramenadventures.com/listing/%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%E5%B0%82%E9%96%80-%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A-himawari-in-asahikawa-hokkaido/")],
  status=O,ssrc="MAPPLE article (11:00–17:00, closed Wed, current)")
F(2,"DHOKU",["SWEET","CAFE"],"Tsuboya's Asahikawa sweets — the 'kibana' almond-cookie line made in the on-site factory — and cake at Café Bunran","Tsuboya Kibana no Mori, Asahikawa (壺屋 き花の杜)",
  "Minami 6-jō-dōri 19-chōme, Asahikawa, Hokkaido, Japan",
  "Asahikawa's century-old confectioner Tsuboya in a brick-and-timber shop set in a 1,000-tsubo garden: its standards and shop-only sweets, a viewable kibana production line, and the Café Bunran tea room.",
  [("RURUBU",RU+"80000710"),("MAPPLE",MP+"spot/1017139/")],
  status=O,ssrc="rurubu&more spot page (shop 9:30–18:00, café 10:00–17:00, current)")
F(2,"DHOKU",["SWEET","CAFE"],"'Furano mochi' — Rokkatei's Furano-only sweet of local salted peas — in a glass tea room over the vineyards","Campana Rokkatei, Furano (カンパーナ六花亭)",
  "Shimizuyama, Furano, Hokkaido, Japan",
  "Rokkatei's Furano store on Shimizuyama: a glass hall in 24,000 tsubo of vines with the Furano basin and Daisetsu range beyond; the tea room serves the shop-exclusive Furano mochi.",
  [("RURUBU",RU+"80001207"),("FURANOTOURISM",FT+"137")],
  status=O,ssrc="rurubu&more spot page (10:30–16:00, seasonal, current)")

S(2,"DHOKU","Ken & Mary Tree, Biei (ケンとメリーの木)","Biei, Kamikawa District, Hokkaido, Japan",
  "The lone poplar on a Biei hill made famous by Nissan's 1972 'Ken & Mary' Skyline commercial — the tree that turned Biei's farm hills into a destination; 5 minutes by car from Biei Station, with a car park. Stay off the fields (private farmland).",
  [("BIEITOURISM","https://www.biei-hokkaido.jp/ja/facility/ken-merry-tree"),("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/3528/"),("WIKIPEDIA_JA",JA+"%E3%82%B1%E3%83%B3%E3%81%A8%E3%83%A1%E3%83%AA%E3%83%BC%E3%81%AE%E6%9C%A8")],
  43.6087639,142.464056,"high","ja.wikipedia ケンとメリーの木 infobox (北緯43度36分31.55秒 東経142度27分50.6秒) via WebSearch",O,"biei-hokkaido.jp facility page (current)",g=["NATURE"])

F(2,"TKC",["HOKKAIDO","TEISHOKU"],"Obihiro butadon — Hokkaido pork grilled slice by slice in Hageten's pre-war tare, over Koshihikari","Butadon no Butahage, Obihiro Station (豚丼のぶたはげ 帯広本店)",
  "Esta Obihiro West Wing 1F, Nishi 2-jō Minami 12-chōme, Obihiro, Hokkaido, Japan",
  "The station-side butadon specialist spun off from the old tempura house Hageten (whose butadon got too popular) — 15 seats plus butadon bentō to take on the train.",
  [("OBIKAN","https://obikan.jp/post_spot/1005/"),("MAPPLE",MP+"collection/8e9af2cbcbac4134b73678dd4f758a94/")],
  status=O,ssrc="obikan.jp spot 1005 (10:00–19:30, closed Wed, current)")
F(3,"TKC",["SWEET","HOKKAIDO"],"milk jam — farm milk and Hokkaido sugar only — on waffles in the pasture tea room","Tokachi Shinmura Bokujō, Kamishihoro (十勝しんむら牧場)",
  "Kamishihoro, Katō District, Hokkaido, Japan",
  "A grazing dairy north of Obihiro famous across Japan for its milk jam; the farm's tea room serves it on waffles and soft-serve. Open Apr–Dec.",
  [("MAPPLE",MP+"spot/1011886/"),("RURUBU","https://rurubu.jp/andmore/article/14076")],
  status=O,ssrc="MAPPLE spot page (Apr–Dec 10:30–17:00, current)")

S(3,"DHOKU","Snow Crystal Museum, Asahikawa (雪の美術館)","Minamigaoka 3-chōme 1-1, Asahikawa, Hokkaido, Japan",
  "A Byzantine-style hilltop museum in the Hokkaido Traditional Arts & Crafts Village devoted to snow and ice — snow-crystal photographs, an ice corridor and a 200-seat music hall.",
  [("MAPPLE",MP+"article/43014/"),("WIKIPEDIA_JA",JA+"%E9%9B%AA%E3%81%AE%E7%BE%8E%E8%A1%93%E9%A4%A8")],
  43.771722,142.308472,"high","ja.wikipedia 雪の美術館 infobox (北緯43度46分18.2秒 東経142度18分30.5秒) via WebSearch; matches 北海道伝統美術工芸村 infobox (43.771833,142.3085)",O,"MAPPLE 'Asahikawa three famous spots' article (described as operating; no closure found — hours not confirmed)",g=["MUS"])
S(3,"DHOKU","Hokkaido Ice Pavilion, Kamikawa (北海道アイスパビリオン)","Kamikawa, Kamikawa District, Hokkaido, Japan",
  "An ice 'museum' on the way to Sōunkyō kept at −20 °C year-round to recreate Japan's record low (−41 °C, Asahikawa 1902) — walk-through halls of 1,000 tonnes of ice walls built up over 25 years.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_11445.html"),("MAPPLE",MP+"spot/1001400/")],
  status=O,ssrc="visit-hokkaido.jp spot 11445 (current)",g=["MUS"])

emit("W90", OUTLETS)
