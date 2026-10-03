#!/usr/bin/env python3
# W82 — SPR + OTARU food & drink (miso ramen, soup curry, jingisukan, zangi, bars, craft beer, sake, kissaten, sweets;
# Otaru soba/ice cream/ankake/sushi, Yoichi-Niki wineries, Shakotan gin). WebSearch 2026-10-02 (s4), 29 searches.
# No pin read for any venue this wave (ja.wikipedia company articles carried no infobox coords) -> all lat=None (UNVERIFIED).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; ST="https://www.sapporo.travel/"; OT="https://otaru.gr.jp/"
VH="https://www.visit-hokkaido.jp/"; RA="https://ramenadventures.com/listing/"
O="open"
# ---------------- SPR ----------------
F(1,"SPR",["RAMEN","HOKKAIDO"],"Sapporo miso ramen (the 1964 original rich-lard style)","Sapporo Junren, Sapporo-ten (さっぽろ純連 札幌店)",
  "Hiragishi 2-jō 17-1-41, Toyohira-ku, Sapporo, Hokkaido, Japan",
  "The 1964 shop that set the rich, lard-sealed Sapporo miso style — rurubu calls it the long-running origin of the modern miso bowl.",
  [("RURUBU",RU+"spot/80000297"),("MAPPLE",MP+"spot/1000235/"),("RURUBU",RU+"article/22517")],status=O,ssrc="rurubu spot page (hours current; closed Mondays)")
F(1,"SPR",["HOKKAIDO"],"yakuzen (medicinal) soup curry — 30 spices, 15 herbal extracts","Ajanta Yakuzen Curry Honpo Sōhonke (アジャンタ薬膳カリィ本舗総本家)",
  "Kita 23-jō Higashi 20-2-18, Higashi-ku, Sapporo, Hokkaido, Japan",
  "Ajanta's 1970s medicinal curry is where Sapporo soup curry began; this is the head shop.",
  [("RURUBU",RU+"spot/80000284"),("SAPPOROTRAVEL",ST+"sp/sapporo-soupcurry/")],status=O,ssrc="rurubu spot page (current)")
F(2,"SPR",["HOKKAIDO"],"soup curry, heat level 1–20 (since 1996)","Soup Curry Yellow (スープカリーイエロー)",
  "Elm Bldg 1F, Minami 3-jō Nishi 1-12-19, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A 1996 soup-curry house with a clear pork-and-chicken stock and a 20-step heat scale.",
  [("RURUBU",RU+"spot/80000181"),("MAPPLE",MP+"article/41624/")],status=O,ssrc="rurubu spot page (current)")
F(2,"SPR",["HOKKAIDO","INT"],"zangi (fist-sized Hokkaido fried chicken)","Chūgoku Ryōri Hotei (中国料理 布袋)",
  "Minami 1-jō Nishi 9-1-3, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Ask Sapporo where to eat zangi and this Chinese diner comes up: fist-sized pieces fried in three oils at three temperatures.",
  [("SAPPOROTRAVEL",ST+"gourmet/feature/%E5%A4%A7%E3%81%8D%E3%81%AA%E3%82%B6%E3%83%B3%E3%82%AE%E3%81%AB%E3%80%81%E5%BC%BE%E3%81%91%E3%82%8B%E7%AC%91%E9%A1%94%E3%80%82%E3%81%AC%E3%81%8F%E3%82%82%E3%82%8A%E3%81%82%E3%81%B5%E3%82%8C%E3%82%8B/"),("MAPPLE",MP+"article/42109/")],
  status=O,ssrc="sapporo.travel local-gourmet feature (current)")
F(2,"SPR",["SAKE"],"Chitose-tsuru junmai — brewery-only and seasonal sake, tasting counter","Chitose-tsuru Sake Museum (千歳鶴 酒ミュージアム)",
  "Minami 3-jō Higashi 5-1, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The shop and small museum of Sapporo's only sake brewery (Nihon Seishu), with free tasting counter and brewery-only bottles.",
  [("MAPPLE",MP+"spot/1011879/"),("WIKIPEDIA_JA","https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E6%B8%85%E9%85%92")],status=O,ssrc="mapple spot page (hours current)")
F(1,"SPR",["SWEET","CAFE","HOKKAIDO"],"Snow Royal ice cream and milk parfaits (since 1961)","Snow Brand Parlor Sapporo Honten (雪印パーラー 札幌本店)",
  "Taiyō Seimei Sapporo Bldg 1F, Kita 2-jō Nishi 3-1-31, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Sapporo's 1961 dairy parlour: 30-plus parfaits and the 'Snow Royal' ice cream first made for a 1968 imperial visit.",
  [("SAPPOROTRAVEL",ST+"gourmet/shop/shop_256-2/"),("RURUBU",RU+"spot/80000070"),("MAPPLE",MP+"spot/1000035/")],status=O,ssrc="rurubu spot page (hours current)")
F(2,"SPR",["SWEET"],"Northman pie and Yama-oyaji senbei","Sapporo Senshūan Honten (札幌千秋庵 本店)",
  "Minami 3-jō Nishi 3, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Confectioner since 1921, maker of the Northman bean-paste pie and Yama-oyaji biscuits.",
  [("RURUBU",RU+"spot/80000069"),("MAPPLE",MP+"spot/1017277/"),("SAPPOROTRAVEL",ST+"en/spot/facility/senshu-an/")],status=O,ssrc="rurubu spot page (open daily)")
F(2,"SPR",["CAFE"],"European-style dark-roast blends and house cake","Miyakoshiya Coffee Honten, Maruyama (宮越屋珈琲 本店)",
  "Minami 2-jō Nishi 28, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Sapporo's best-known kissaten roaster; the first-floor windows look onto Maruyama Park.",
  [("RURUBU",RU+"spot/80000116"),("SAPPOROTRAVEL",ST+"en/gourmet/shop/miyakoshiya-coffee/")],status=O,ssrc="rurubu spot page (open daily)")
F(3,"SPR",["INT"],"seasonal Hokkaido fruit and vegetable cocktails (haskap & lavender on potato shochu)","the bar nano.femto, Susukino",
  "Near Susukino Crossing, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A 16-seat cocktail counter whose idea is 'cocktails as liquid cooking', built on Hokkaido produce.",
  [("MAPPLE",MP+"original/402825/"),("TABELOG100","https://www.enprimeurclub.com/restaurants/the-bar-nano-femto")],status=O,ssrc="mapple bar feature (current)")
F(2,"SPR",["INT"],"400+ whiskies and 60 original cocktails","Do Ermitage, Susukino (ドゥ・エルミタアヂュ)",
  "Minami 3-jō Nishi 4 Bldg 10F, Chuo-ku, Sapporo, Hokkaido, Japan",
  "An old-school authentic bar run by a woman with about 50 years behind the counter; more than 400 whiskies.",
  [("RURUBU",RU+"spot/80000172"),("MAPPLE",MP+"original/402825/")],status=O,ssrc="rurubu spot page (hours current; closed Sun/hol)")
F(3,"SPR",["HOKKAIDO"],"jingisukan — Roaring Forties lamb, fresh lamb shoulder","Jingisukan Yōyōtei Sapporo Honten (ジンギスカン羊々亭 札幌本店)",
  "Chuo-ku, Sapporo, Hokkaido, Japan",
  "Specialist lamb grill known for its rare 'Roaring Forties' lamb.",
  [("MAPPLE",MP+"spot/1013598/"),("RURUBU",RU+"article/22385")],status=O,ssrc="rurubu jingisukan article (current)")
F(2,"SPR",["HOKKAIDO"],"fresh-lamb jingisukan with apple-aged sauce (Otaru Keishōen recipe, 1956)","Nama-Ramu Jingisukan Yamagoya, Susukino (生ラムジンギスカン 山小屋)",
  "Dai-5 Green Bldg 1F, Minami 4-jō Nishi 4-13-2, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Susukino fresh-lamb grill carrying on the 1956 sauce of Otaru's Keishōen.",
  [("RURUBU",RU+"spot/80000072"),("MAPPLE",MP+"article/45617/")],status=O,ssrc="rurubu spot page (hours current)")
F(2,"SPR",["INT","HOKKAIDO"],"North Island craft beer, 8–12 taps","Beer Bar North Island (ビアバー ノースアイランド)",
  "Large Country Bldg 10F, Minami 2-jō Nishi 4-10-1, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Taproom of Sapporo's North Island Beer (founded 2003, now brewed in Ebetsu) — fresh kegs, guest and seasonal beers.",
  [("SAPPOROTRAVEL",ST+"en/gourmet/shop/north-island-beer/"),("MAPPLE",MP+"original/327416/")],status=O,ssrc="sapporo.travel shop page (hours current)")
F(3,"SPR",["INT"],"own-brewed craft beer","Moon and Sun Brewing (月と太陽BREWING)",
  "Sapporo, Hokkaido, Japan",
  "A brewpub on the city's craft-beer trail.",
  [("SAPPOROTRAVEL",ST+"en/gourmet/shop/moon-and-sun-craft-beer-brewery-and-bar/"),("MAPPLE",MP+"original/327416/")],status=O,ssrc="sapporo.travel shop page (current)")
F(2,"SPR",["RAMEN","HOKKAIDO"],"miso-only Sapporo ramen","Misoramen Senmonten Ōkami Soup (味噌らーめん専門店 狼スープ)",
  "Near Nakajima Park, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Started as a yatai in 2000 and reopened in 2012; it serves miso ramen only.",
  [("RURUBU",RU+"article/15204"),("RAMENADVENTURES",RA+"%E7%8B%BC%E3%82%B9%E3%83%BC%E3%83%97-okami-soup-in-sapporo-hokkaido/")],status=O,ssrc="rurubu article (hours current; closed Tue/Wed)")
F(2,"SPR",["RAMEN","HOKKAIDO"],"wok-fried-vegetable miso ramen","Kiraito, Tanukikōji (喜来登)",
  "Minami 2-jō Nishi 6, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A Tanukikōji miso ramen shop that fries the vegetables and garlic in the wok before the soup goes in, the old Sapporo way.",
  [("RURUBU",RU+"spot/80000118"),("RAMENADVENTURES",RA+"kiraito/")],status=O,ssrc="rurubu spot page (closed Thursdays)")
# ---------------- OTARU ----------------
F(2,"OTARU",["SAKE"],"Hokkaido Wine (Tsurunuma series) tasting bar","Otaru Wine Gallery — Hokkaido Wine Otaru Winery (北海道ワイン おたるワインギャラリー)",
  "Asarigawa Onsen 1-130, Otaru, Hokkaido, Japan",
  "Hokkaido Wine's head winery (founded 1974): a tasting bar with about 100 wines and paid winery tours.",
  [("RURUBU",RU+"spot/80000696"),("MAPPLE",MP+"spot/1010220/"),("OTARUTOURISM",OT+"guidemap/gourmet-wine")],status=O,ssrc="rurubu spot page (open daily, free entry)")
F(2,"OTARU",["NOODLE"],"handmade seiro and grated-radish soba (since 1954)","Soba-ya Yabuhan, Otaru (蕎麦屋 籔半)",
  "Inaho 2-19-14, Otaru, Hokkaido, Japan",
  "A 1954 Edo-style soba house near Otaru Station.",
  [("MAPPLE",MP+"spot/1000276/"),("OTARUTOURISM",OT+"guidemap/gourmet-soba")],status=O,ssrc="mapple spot page (closed Tuesdays)")
F(2,"OTARU",["SWEET","CAFE"],"house ice cream made the 1919 way","Ice Cream Parlor Misono, Otaru (アイスクリームパーラー美園)",
  "Inaho 2-12-15, Otaru, Hokkaido, Japan",
  "Opened in 1919 as the first shop in Hokkaido to sell ice cream, and still uses its original method.",
  [("RURUBU",RU+"spot/80000704"),("MAPPLE",MP+"spot/1000270/")],status=O,ssrc="rurubu spot page (closed Tue/Wed)")
F(2,"OTARU",["SUSHI"],"Uomasa nigiri (15 pieces with dobin-mushi)","Uomasa, Otaru (魚真)",
  "Inaho 2-5-11, Otaru, Hokkaido, Japan",
  "Local-catch sushi at fair prices, as popular with residents as with visitors.",
  [("RURUBU",RU+"article/24816"),("MAPPLE",MP+"original/454269/?pg=2")],status=O,ssrc="rurubu sushi article (hours current; closed Sundays)")
F(3,"OTARU",["SAKE","INT"],"Yoichi estate wine and vineyard lunch","OcciGabi Winery, Yoichi (オチガビワイナリー)",
  "Yamada-chō 635, Yoichi, Hokkaido, Japan",
  "Founded in 2012 by the Ochii couple, who want to make Yoichi Japan's leading wine town. Tasting counter, terrace and a restaurant overlooking the vines.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12258.html"),("RURUBU","https://plus.rurubu.jp/article/340768777")],status=O,ssrc="visit-hokkaido spot page (current)")
F(3,"OTARU",["SAKE"],"Yoichi-grown wine with on-site restaurant","Yoichi Winery (余市ワイナリー)",
  "Kurokawa-chō 1318, Yoichi, Hokkaido, Japan",
  "Makes its wine only from grapes grown and pressed in Yoichi, and runs a lunch restaurant on site.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12238.html"),("RURUBU","https://plus.rurubu.jp/article/340768777")],status=O,ssrc="visit-hokkaido spot page (current)")
F(2,"OTARU",["SAKE","FINE"],"award-winning cool-climate wine; vineyard lunch and dinner","NIKI Hills Winery, Niki (NIKI Hills Winery)",
  "Asahidai 148-1, Niki, Yoichi District, Hokkaido, Japan",
  "A hilltop winery with lodging above the Yoichi River valley, whose cool-climate wines have won international awards.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_12774.html"),("RURUBU","https://plus.rurubu.jp/article/340768777")],status=O,ssrc="visit-hokkaido spot page (current)")
F(3,"OTARU",["SWEET","HOKKAIDO"],"30 cm 'New York Jumbo' soft-serve (seasonal Apr–Nov)","Otaru Milk Plant (小樽ミルクプラント)",
  "Hanazono 2-12-13, Otaru, Hokkaido, Japan",
  "Otaru's oldest soft-serve stand, run by Hoshō Gyūnyū in its 1936 milk-plant office.",
  [("MAPPLE",MP+"spot/1014591/"),("JUSTONECOOKBOOK","https://www.justonecookbook.com/tags/hokkaido/")],status=O,ssrc="mapple spot page (seasonal Apr mid–Nov 3)")
F(3,"OTARU",["CAFE","SWEET"],"cream zenzai and coffee in a Meiji merchant house","Taishō Glass Kuboya, Sakaimachi (大正硝子 くぼ家)",
  "Sakaimachi 4-4, Otaru, Hokkaido, Japan",
  "A kissaten in the historic former Sakaiya shop on Sakaimachi Street, kept going by Taishō Glass.",
  [("MAPPLE",MP+"spot/1018126/"),("OTARUTOURISM",OT+"shop/taishoglass-kuboya")],status=O,ssrc="mapple spot page (seasonal late Apr–late Dec)")
F(2,"OTARU",["MKT","HOKKAIDO"],"'wagamama-don' — choose 3 of 10 seafood toppings","Kita no Donburiya Takinami Shokudō, Sankaku Market (北のどんぶり屋 滝波食堂)",
  "Sankaku Market, Inaho 3-10-16, Otaru, Hokkaido, Japan",
  "The Takinami fish shop's diner in the Triangle Market — seafood from the tanks onto a pick-your-own bowl, with a queue every day.",
  [("RURUBU",RU+"spot/80071304"),("OTARUTOURISM",OT+"shop/takinamisyokudou")],status=O,ssrc="rurubu spot page (7–17h)")
F(2,"OTARU",["NOODLE","HOKKAIDO"],"Otaru ankake yakisoba (oyster-sauce gravy)","New Sankō, Otaru (ニュー三幸)",
  "Sun Mall 1-bangai, Inaho 1-3-6, Otaru, Hokkaido, Japan",
  "A 1954 all-round restaurant, now known for its ankake yakisoba on house egg noodles. Bunkacho has named the dish a '100-Year Food'.",
  [("MAPPLE",MP+"spot/1000247/"),("OTARUTOURISM",OT+"project/otarujishin-202211ankake")],status=O,ssrc="mapple spot page (open daily)")
F(3,"OTARU",["NOODLE","HOKKAIDO"],"Otaru ankake yakisoba (chicken-stock gravy)","Otaru Ankake Yakisoba Kakuryū (小樽あんかけ焼きそば 鶴龍)",
  "Otaru Dejō Kōji, Ironai 1-1, Otaru, Hokkaido, Japan",
  "An ankake-yakisoba specialist in the Dejō Kōji food alley by the canal.",
  [("MAPPLE",MP+"spot/1018889/"),("OTARUTOURISM",OT+"project/otarujishin-202211ankake")],status=O,ssrc="mapple spot page (current)")
F(3,"OTARU",["MKT","HOKKAIDO"],"Yoichi kaisendon (sweet shrimp, uni)","Kakizaki Shōten Kaisen Kōbō, Yoichi (柿崎商店 海鮮工房)",
  "Kurokawa-chō 7-25, Yoichi, Hokkaido, Japan",
  "A seafood wholesaler's fish market with a second-floor diner, four minutes from JR Yoichi; queues at weekends.",
  [("MAPPLE",MP+"pref/01408/spot/"),("HOKKAIDOTOURISM",VH+"hokkaido-ni-yoishirete/other/")],status=O,ssrc="domain-restricted search summary (closed Thursdays)")
F(3,"OTARU",["SAKE"],"Hi-no-Ho craft gin from home-grown botanicals","Shakotan Blue Distillery — Shakotan Spirit (積丹ブルー蒸溜所)",
  "Nozuka-chō Uento 229-1, Shakotan, Hokkaido, Japan",
  "A 'farm family distillery' growing about 100 botanicals on 5.7 ha for its Hi-no-Ho gins.",
  [("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/syakotanspirit/"),("MAPPLE",MP+"region/a0102020100_g02060000/spot/")],status=O,ssrc="visit-hokkaido feature (current)")
# Orchestrator review (s4): HOLD records whose second source is not an exact page naming the place
# (Kakizaki, Shakotan Blue: generic mapple/visit-hokkaido list pages; Hotei: mapple article only a "best match";
# nano.femto: "TABELOG100" key actually points at enprimeurclub.com). Held, not deleted — see _note_W82.md.
import _hk
_HOLD=("Hotei","nano.femto","Kakizaki","Shakotan Blue")
_hk._F[:]=[r for r in _hk._F if not any(h in r["n"] for h in _HOLD)]
_hk._G[:]=[g for g in _hk._G if not any(h in g["n"] for h in _HOLD)]
emit("W82")
