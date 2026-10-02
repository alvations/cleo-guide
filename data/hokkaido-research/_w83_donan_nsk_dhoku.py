#!/usr/bin/env python3
# W83 — food & drink discovery for DONAN / NSK / DHOKU (wineries, sake, distillery, michi-no-eki with a named dish,
# Asahikawa shinkoyaki & ji-beer, Furano wine/marché). WebSearch 2026-10-02 (s4).
# Source keys: ATCA = Asahikawa Tourism & Convention Association (atca.jp, city tourism body, one source);
# BIEITOURISM = Biei Tourism Association (biei-hokkaido.jp, one source);
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
  "Asahi-machi 25-1, Kamikawa, Kamikawa District, Hokkaido, Japan",
  "A 2017 regional-revival sake brewery at the foot of Daisetsuzan — pure sake only, from Hokkaido rice and mountain water.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12217.html"),("WIKIPEDIA_JA",JA+"%E4%B8%8A%E5%B7%9D%E5%A4%A7%E9%9B%AA%E9%85%92%E9%80%A0"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1328634/")],
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
  [("MAPPLE",MP+"article/46006/"),("FURANOTOURISM",FT+"291"),("WIKIPEDIA_JA",JA+"%E3%83%95%E3%83%A9%E3%83%8E%E3%83%9E%E3%83%AB%E3%82%B7%E3%82%A7")],
  43.34222,142.38694,"high","ja.wikipedia フラノマルシェ infobox (北緯43度20分32秒 東経142度23分13秒) via WebSearch",O,ssrc="MAPPLE article (10:00–18:00, summer to 19:00, current)")

# ---- DONAN b2 ----
F(2,"DONAN",["SWEET"],"Goshōteya maru-kan yōkan — tube yōkan pushed up and cut with its own string (since 1870)","Goshōteya Honpo, Esashi (五勝手屋本舗)",
  "Honchō 38, Esashi, Hiyama District, Hokkaido, Japan",
  "Esashi's 1870 confectioner, whose cylindrical azuki yōkan — sliced with the string on the tube — was presented to the Shōwa Emperor in 1936.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_10310.html"),("RURUBU",RU+"spot/80001317"),("WIKIPEDIA_JA",JA+"%E4%BA%94%E5%8B%9D%E6%89%8B%E5%B1%8B%E6%9C%AC%E8%88%97")],
  41.86444,140.12583,"high","ja.wikipedia 五勝手屋本舗 infobox (北緯41度51分52秒 東経140度07分33秒) via WebSearch",O,"rurubu&more spot page (8:00–18:00, closed 1 Jan, current)")
F(2,"DONAN",["IZAKAYA","HOKKAIDO"],"katsu-ma-ika-sashi — live squid sashimi still translucent","Kasshō Ryōri Ikasei Honten (活魚料理 いか清 本店)",
  "Honchō 2-14, Hakodate, Hokkaido, Japan",
  "Goryōkaku-side live-seafood house built around Hakodate's squid: the tank-fresh ma-ika is cut to order as glassy ikasōmen-style sashimi.",
  [("RURUBU",RU+"spot/80000487"),("MAPPLE",MP+"spot/1010737/")],
  status=O,ssrc="rurubu&more + MAPPLE spot pages (current hours)")
F(3,"DONAN",["NOODLE","HOKKAIDO"],"Esashi nishin soba — glazed dried herring on soba, a 1950s house recipe","Yokoyama-ke, Esashi (横山家)",
  "Esashi Inishie Kaidō, Esashi, Hiyama District, Hokkaido, Japan",
  "An old herring-merchant house on Esashi's Inishie Kaidō that serves the town's herring soba, topped with shredded nori.",
  [("MAPPLE",MP+"collection/dd69569105a3467a815cacaac18fb6d5/"),("WIKIPEDIA_JA",JA+"%E3%81%AB%E3%81%97%E3%82%93%E3%81%9D%E3%81%B0")],
  status=O,ssrc="MAPPLE nishin-soba collection (current)")
F(2,"DONAN",["SAKE"],"Hakodate jizake — junmai from Suisei, Ginpū and Kitashizuku rice (first Hakodate brewery in 54 years)","Hakodate Goryō no Kura (函館五稜乃蔵)",
  "Kameo-chō (former Kameo school site), Hakodate, Hokkaido, Japan",
  "Kamikawa Taisetsu's 2021 Hakodate brewery — the city's first sake brewery in over half a century, with a Hakodate KOSEN lab inside and a shop; it shared top prize at a Hokkaido-rice sake competition.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12567.html"),("MAPPLE",MP+"spot/1018818/"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/615660"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1328634/")],
  status=O,ssrc="visit-hokkaido.jp spot 12567 (current)")
F(2,"DONAN",["IZAKAYA","HOKKAIDO"],"Ōnuma Beer — Kölsch, Alt, IPA and black beer brewed with Yokotsu-dake spring water","Bräuhaus Ōnuma — Ōnuma Beer (ブロイハウス大沼)",
  "Ōnuma-chō 208, Nanae, Kameda District, Hokkaido, Japan",
  "The Ōnuma-park microbrewery: award-winning craft beers poured by the glass beside the lake station.",
  [("RURUBU",RU+"spot/80001294"),("WIKIPEDIA_JA",JA+"%E5%A4%A7%E6%B2%BC%E3%83%93%E3%83%BC%E3%83%AB")],
  status=O,ssrc="rurubu&more spot page (9–17, Dec–Mar 9–16; closed Tue, current)")

# ---- DHOKU b2 ----
BT="https://www.biei-hokkaido.jp/ja/facility/"
F(2,"DHOKU",["RAMEN"],"shōga (ginger) ramen — ordered by 9 in 10 customers (since 1972)","Shōga Rāmen Mizuno, Asahikawa (生姜ラーメン みづの)",
  "Tokiwa-dōri 2-chōme, Asahikawa, Hokkaido, Japan",
  "Asahikawa's ginger-ramen original, invented by the founder in 1972 — a shōyu bowl sharpened with grated ginger.",
  [("RURUBU",RU+"spot/80000769"),("ATCA",AT+"menberinfo/%E7%94%9F%E5%A7%9C%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%E3%80%80%E3%81%BF%E3%81%A5%E3%81%AE/"),("MAPPLE",MP+"article/43037/")],
  status=O,ssrc="rurubu&more spot page + atca.jp member listing (current)")
F(2,"DHOKU",["NOODLE","HOKKAIDO"],"Biei curry udon (yaki-men and tsuke-men styles) with Biei vegetables","Michi-no-eki Biei 'Oka no Kura' — Kōbaku Shokudō (道の駅 びえい「丘のくら」香麦食堂)",
  "Biei, Kamikawa District, Hokkaido, Japan",
  "Stone-warehouse roadside station in central Biei whose dining room serves the town's curry udon both baked and as a dip, heaped with local vegetables.",
  [("MAPPLE",MP+"collection/5517a41504c04fc2af8d01136af76697/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%B3%E3%81%88%E3%81%84%E3%80%8C%E4%B8%98%E3%81%AE%E3%81%8F%E3%82%89%E3%80%8D")],
  43.59214,142.46378,"high","ja.wikipedia 道の駅びえい「丘のくら」 infobox (北緯43度35分32秒 東経142度27分50秒) via WebSearch",O,"MAPPLE curry-udon collection (current)")
F(3,"DHOKU",["NOODLE","HOKKAIDO"],"Biei curry udon — Biei wheat, vegetables and pork","Family Restaurant Daimaru, Biei (ファミリーレストラン だいまる)",
  "Biei, Kamikawa District, Hokkaido, Japan",
  "Town diner whose curry udon is all-Biei: local wheat noodles, Biei vegetables and Biei pork.",
  [("RURUBU",RU+"spot/80001503"),("BIEITOURISM",BT+"daimaru"),("MAPPLE",MP+"collection/5517a41504c04fc2af8d01136af76697/")],
  status=O,ssrc="biei-hokkaido.jp facility page (current)")
F(3,"DHOKU",["NOODLE","HOKKAIDO"],"Biei-wheat udon blends and whole-pig 'wasei mochibuta' slow food","Eki no Mieru Restaurant & Café KOERU, Biei (駅の見えるレストラン KOERU)",
  "Biei, Kamikawa District, Hokkaido, Japan",
  "Station-view restaurant showcasing Biei wheat and the town's mochibuta pork — udon blended from several local wheat varieties.",
  [("RURUBU",RU+"spot/80001497"),("BIEITOURISM",BT+"koeru"),("MAPPLE",MP+"collection/5517a41504c04fc2af8d01136af76697/")],
  status=O,ssrc="biei-hokkaido.jp facility page (current)")

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
S(3,"NSK","Niseko Konbu Onsen (ニセコ昆布温泉)","Niseko-Konbu Onsen, Rankoshi, Isoya District, Hokkaido, Japan",
  "A designated national health-resort onsen at the south-west foot of Annupuri — several inns, each with its own spring (bicarbonate to chloride).",
  [("HOKKAIDOTOURISM",VH+"spa/spot/detail_10606.html"),("WIKIPEDIA_JA",JA+"%E3%83%8B%E3%82%BB%E3%82%B3%E6%98%86%E5%B8%83%E6%B8%A9%E6%B3%89")],
  42.83983,140.62242,"med","ja.wikipedia ニセコ昆布温泉 infobox (北緯42度50分23秒 東経140度37分21秒 — onsen-area point) via WebSearch",O,"visit-hokkaido.jp onsen page (current)",k="onsen",g=["ONSEN","NATURE"])
emit("W83")
