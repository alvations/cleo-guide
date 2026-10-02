#!/usr/bin/env python3
# W83 — food & drink discovery for DONAN / NSK / DHOKU (wineries, sake, distillery, michi-no-eki with a named dish,
# Asahikawa shinkoyaki & ji-beer, Furano wine/marché). WebSearch 2026-10-02 (s4).
# Source keys: ATCA = Asahikawa Tourism & Convention Association (atca.jp, city tourism body, one source);
# FURANOTOURISM = Furano Tourism Association (furanotourism.com, one source); HOKKAIDOMICHINOEKI = the Hokkaido
# roadside-station liaison council's official directory (hokkaido-michinoeki.jp, one source).
from _hk import F, S, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
VH="https://www.visit-hokkaido.jp/"; AT="https://www.atca.jp/"; FT="https://www.furanotourism.com/jp/spot/spot_D.php?id="
ME="https://hokkaido-michinoeki.jp/michinoeki/"
O="open"

# ---------------- DONAN ----------------
F(2,"DONAN",["SAKE"],"Hakodate wine (since 1973) — free tastings of 12+ wines and the shop-only wine soft-serve",
  "Hakodate Wine Budōkan Honten (はこだてわいん 葡萄館本店)",
  "Kamifujishiro 11, Nanae, Kameda District, Hokkaido, Japan",
  "One of Hokkaido's pioneer wineries (1973): about 80 wines on the shelves, a dozen to taste free, and a wine soft-serve sold only here.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12255.html"),("WIKIPEDIA_JA",JA+"%E3%81%AF%E3%81%93%E3%81%A0%E3%81%A6%E3%82%8F%E3%81%84%E3%82%93")],
  41.91046,140.68098,"med","ja.wikipedia はこだてわいん infobox (北緯41度54分37.6秒 東経140度40分51.5秒 — company HQ/winery, Nanae) via WebSearch",O,"visit-hokkaido.jp spot 12255 (hours 10:00–17:00, current)")
F(2,"DONAN",["HOKKAIDO","MKT"],"Mori ikameshi — squid stuffed with rice, the town's original ekiben","Michi-no-eki YOU・Yū・Mori (道の駅 YOU・遊・もり)",
  "Kamidai-chō 326-18, Mori, Kayabe District, Hokkaido, Japan",
  "Route 5 roadside station of Mori, home of ikameshi — the squid-rice ekiben sold here in many forms, with Komagatake and Uchiura Bay from the roof lounge.",
  [("RURUBU",RU+"spot/80084542"),("HOKKAIDOMICHINOEKI",ME+"641/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85YOU%E3%83%BB%E9%81%8A%E3%83%BB%E3%82%82%E3%82%8A")],
  42.09961,140.568,"high","ja.wikipedia 道の駅YOU・遊・もり infobox (北緯42度05分59秒 東経140度34分05秒) via WebSearch",O,"rurubu&more spot page (current)")
F(2,"DONAN",["HOKKAIDO","SUSHI"],"Matsumae hon-maguro-don (Tsugaru Strait bluefin) and Matsumae-zuke","Michi-no-eki Kitamaebune Matsumae (道の駅 北前船 松前)",
  "Matsumae, Matsumae District, Hokkaido, Japan",
  "Clifftop roadside station on the Tsugaru Strait serving bowls of wild bluefin from the same waters as Ōma tuna, and Matsumae-zuke, the clan-era pickle of herring roe, kelp and squid.",
  [("RURUBU",RU+"spot/80001268"),("HOKKAIDOMICHINOEKI","https://2016.hokkaido-michinoeki.jp/michinoeki/3007/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E5%8C%97%E5%89%8D%E8%88%B9_%E6%9D%BE%E5%89%8D")],
  41.42656,140.10728,"high","ja.wikipedia 道の駅北前船 松前 infobox (北緯41度25分36秒 東経140度06分26秒) via WebSearch",O,"rurubu&more spot page (current)")
F(3,"DONAN",["HOKKAIDO","TEMPURA"],"tekkui-don — tempura of local wild flounder ('tekkui') over rice","Michi-no-eki Kaminokuni Monju (道の駅 上ノ国もんじゅ)",
  "Kaminokuni, Hiyama District, Hokkaido, Japan",
  "Sea-of-Japan roadside station whose restaurant window looks over the water; the signature is a tendon of local flounder.",
  [("RURUBU",RU+"spot/80001325"),("MAPPLE",MP+"spot/1011950/"),("HOKKAIDOMICHINOEKI",ME+"870/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E4%B8%8A%E3%83%8E%E5%9B%BD%E3%82%82%E3%82%93%E3%81%98%E3%82%85")],
  41.8085,140.09511,"high","ja.wikipedia 道の駅上ノ国もんじゅ infobox (北緯41度48分31秒 東経140度05分42秒) via WebSearch",O,"hokkaido-michinoeki.jp listing (restaurant 11:00–15:00, current)")

# ---------------- DHOKU ----------------
F(2,"DHOKU",["SAKE"],"junmai sake brewed with Daisetsu snowmelt water (sold mainly in Kamikawa)","Kamikawa Taisetsu Shuzō Ryokkyū-gura (上川大雪酒造 緑丘蔵)",
  "Asahi-machi, Kamikawa, Kamikawa District, Hokkaido, Japan",
  "A 2017 regional-revival sake brewery at the foot of Daisetsuzan — pure sake only, from Hokkaido rice and mountain water.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12217.html"),("WIKIPEDIA_JA",JA+"%E4%B8%8A%E5%B7%9D%E5%A4%A7%E9%9B%AA%E9%85%92%E9%80%A0")],
  status=O,ssrc="visit-hokkaido.jp spot 12217 (current)")
F(1,"DHOKU",["IZAKAYA","HOKKAIDO"],"Asahikawa shinkoyaki — a charcoal-grilled half young chicken in a sauce kept going since 1925","Yakitori Senmon Ginneko (焼鳥専門 ぎんねこ)",
  "Fura-Ri-To, 5-jō-dōri 7-chōme, Asahikawa, Hokkaido, Japan",
  "The keeper of Asahikawa's soul food: a 1925 yakitori house in the Fura-Ri-To alley grilling a whole half chicken over charcoal in its never-emptied tare.",
  [("MAPPLE",MP+"spot/1017238/"),("ATCA",AT+"menberinfo/%E7%84%BC%E9%B3%A5%E5%B0%82%E9%96%80%E3%80%80%E3%81%8E%E3%82%93%E3%81%AD%E3%81%93%E3%80%80%EF%BC%88%E6%9C%89%E9%99%90%E4%BC%9A%E7%A4%BE-%E3%81%8E%E3%82%93%E3%81%AD%E3%81%93-%EF%BC%89/")],
  status=O,ssrc="MAPPLE spot page + atca.jp member listing (current)")
F(2,"DHOKU",["IZAKAYA","HOKKAIDO"],"Taisetsu ji-beer (4–5 on tap, Daisetsu water) with lamb jingisukan","Taisetsu Ji-Beer-kan (大雪地ビール館)",
  "Miyashita-dōri 11-chōme 1604-1, Asahikawa, Hokkaido, Japan",
  "A red-brick warehouse brewpub five minutes from Asahikawa Station pouring the local Taisetsu beers alongside fresh-lamb jingisukan.",
  [("MAPPLE",MP+"original/459075/"),("RURUBU",RU+"spot/80000728"),("ATCA",AT+"group_meal/ji-bee/"),("WIKIPEDIA_JA",JA+"%E5%A4%A7%E9%9B%AA%E5%9C%B0%E3%83%93%E3%83%BC%E3%83%AB")],
  status=O,ssrc="rurubu&more spot page + atca.jp (current)")
F(2,"DHOKU",["SAKE"],"Furano wine — factory-only seasonal bottlings and free tastings","Furano Wine Factory (ふらのワイン工場)",
  "Shimizuyama, Furano Budōgaoka Park, Furano, Hokkaido, Japan",
  "The city-run brick winery on Shimizuyama hill (grapes since 1972): see the cellar and bottle-ageing rooms and taste factory-exclusive wines, free entry.",
  [("RURUBU",RU+"spot/80001192"),("MAPPLE",MP+"spot/1001779/"),("FURANOTOURISM",FT+"398&kid3=18")],
  status=O,ssrc="rurubu&more spot page (9:00–17:00, current)")
F(2,"DHOKU",["MKT","HOKKAIDO"],"Furano produce, cheese, milk and wine — JA Furano farm store and takeout stalls","Furano Marché (フラノマルシェ)",
  "Saiwai-chō 13-1, Furano, Hokkaido, Japan",
  "Four buildings round a plaza near Furano Station: JA Furano's farm shop, a sweets bakery, ~2,000 local products and takeout stands cooking local ingredients.",
  [("MAPPLE",MP+"article/46006/"),("FURANOTOURISM",FT+"291")],
  status=O,ssrc="MAPPLE article (10:00–18:00, summer to 19:00, current)")

# ---------------- NSK ----------------
NT="https://www.niseko-ta.jp/"
F(2,"NSK",["HOKKAIDO","SWEET"],"award-winning Niseko-milk cheeses (blue 'Kū', aged mimolette-style 'Momiji') and camembert soft-serve","Niseko Cheese Kōbō (ニセコチーズ工房)",
  "Kondō 425-6, Niseko, Abuta District, Hokkaido, Japan",
  "Small creamery making cheese from Niseko milk — World Cheese Awards 2021 super-gold for its long-aged 'Momiji' — with a café selling camembert soft-serve in summer.",
  [("RURUBU",RU+"spot/80001353"),("NISEKOTOURISM",NT+"resorts-eat/7547/"),("HOKKAIDOTOURISM",VH+"en/spot/detail_12979.html")],
  status=O,ssrc="rurubu&more spot page (10–17, Nov–Apr 11–17, current)")
F(1,"NSK",["NOODLE"],"hand-cut kiko-uchi (100% buckwheat) soba and kamo-seiro; soba kaiseki by reservation","Soba-dokoro Rakuichi (そば処 楽一)",
  "Niseko 431, Niseko, Abuta District, Hokkaido, Japan",
  "Soba master Tatsuru Rai's tiny counter (opened 2000) — the Niseko soba made famous by Anthony Bourdain's No Reservations; dinner is reservation-only.",
  [("NISEKOTOURISM",NT+"resorts/article/%E3%81%9D%E3%81%B0%E5%87%A6%E3%80%80%E6%A5%BD%E4%B8%80/"),("JAPANTIMES","https://www.japantimes.co.jp/life/2021/11/27/food/luxury-niseko-hokkaido-somoza-hyatt-hakuvillas-tatsuru-rai-shouya-grigg-hotels-skiing-japan/"),("JAPANTIMES_BOJ","https://boj.japantimes.co.jp/seasonal-guide/vol15/15-03-01/")],
  status=O,ssrc="niseko-ta.jp listing (11:30–15:00, closed Wed/Thu, current)")
F(1,"NSK",["FINE"],"French-Japanese tasting menu of Niseko produce (chef Yuichi Kamimura, ex-Tetsuya's)","Kamimura, Niseko (KAMIMURA)",
  "Hirafu, Kutchan, Abuta District, Hokkaido, Japan",
  "Niseko's fine-dining pioneer (2008): chef Yuichi Kamimura, trained under Tetsuya Wakuda in Sydney, holds a Michelin star from the Hokkaido guide.",
  [("JAPANTIMES_BOJ","https://boj.japantimes.co.jp/seasonal-guide/vol15/15-03-01/"),("TIMEOUT","https://www.timeout.com/kuala-lumpur/restaurants/michelin-star-chef-yuichi-kamimura-at-senja")],
  status=O,ssrc="Japan Times 'Best of Japan' Niseko guide (no closure reported); address area-level only — no street address read")
F(2,"NSK",["SAKE"],"ohoro GIN (13 botanicals incl. Niseko mint) — ISC 2024 gin Trophy — and single malt","Niseko Distillery (ニセコ蒸溜所)",
  "Niseko 478-15, Niseko, Abuta District, Hokkaido, Japan",
  "Opened 2021 beside Niseko's onsen area with Scottish pot stills and Annupuri spring water; its ohoro gin took the top gin award at the 2024 International Spirits Challenge.",
  [("HOKKAIDOTOURISM",VH+"hokkaido-ni-yoishirete/other/"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1070282/")],
  status=O,ssrc="visit-hokkaido.jp alcohol feature (current)")
F(2,"NSK",["SAKE"],"genshu sake from Yōtei spring water — about 30 to taste (since 1916)","Niseko Shuzō, Kutchan (二世古酒造)",
  "Asahi 47, Kutchan, Abuta District, Hokkaido, Japan",
  "Kutchan's century-old (1916) sake brewery at the foot of Yōtei, known for undiluted genshu; around 30 sakes to taste and buy, 15 minutes' walk from Kutchan Station.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12846.html"),("WIKIPEDIA_JA",JA+"%E4%BA%8C%E4%B8%96%E5%8F%A4%E9%85%92%E9%80%A0")],
  status=O,ssrc="visit-hokkaido.jp spot 12846 (current)")
emit("W83")
