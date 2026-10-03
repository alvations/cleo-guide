#!/usr/bin/env python3
# W89 — NSK (Niseko & Yōtei) + OTARU (Otaru & Shakotan) food-first wave. WebSearch 2026-10-03 (s5).
# Source keys reused: RURUBU, MAPPLE, NISEKOTOURISM (niseko-ta.jp), OTARUTOURISM (otaru.gr.jp), HOKKAIDOTOURISM,
# HOKKAIDOMICHINOEKI (hokkaido-michinoeki.jp official directory, introduced W83), JAPANGUIDE, WIKIPEDIA_JA.
from _hk import F, S, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/spot/"; MP="https://www.mapple.net/spot/"
NT="https://www.niseko-ta.jp/"; ME="https://hokkaido-michinoeki.jp/michinoeki/"
O="open"

# ---------------- NSK ----------------
F(2,"NSK",["HOKKAIDO","CAFE"],"Takahashi-farm vegetable buffet with ranch-milk potato gratin and yogurt drinks",
  "Niseko Takahashi Farm Restaurant PRATIVO (ニセコ髙橋牧場 レストランPRATIVO)",
  "Soga 888-1, Niseko, Abuta District, Hokkaido, Japan",
  "The Takahashi dairy's own restaurant (a separate building from its Milk Kōbō shop) facing Mt Yōtei: a ~20-dish farm-vegetable buffet at lunch with gratin made from the ranch's milk, reservation-only Hokkaido courses at dinner.",
  [("RURUBU",RU+"80001348"),("MAPPLE",MP+"1015922/"),("NISEKOTOURISM",NT+"resorts-eat/7627/")],
  status=O,ssrc="niseko-ta.jp resorts-eat 7627 (winter/summer hours current)")
F(3,"NSK",["INT"],"Yōtei-sanroku Beer (house craft beer brewed with Yōtei spring water) with modern European-Japanese plates",
  "Villa Lupicia Restaurant, Kabayama (ヴィラ ルピシア レストラン)",
  "Kabayama 58-5, Kutchan, Abuta District, Hokkaido, Japan",
  "Tea house Lupicia's glass-walled restaurant in Hirafu-Kabayama, serving modern European cooking with a Japanese touch and its own Yōtei-foothills beer, poured at a summer beer garden too.",
  [("RURUBU",RU+"80001386"),("NISEKOTOURISM",NT+"news/article/lupicia-beer-garden-2024/")],
  status=O,ssrc="niseko-ta.jp Lupicia Beer Garden 2024 notice")
F(3,"NSK",["HOKKAIDO","MKT"],"Rankoshi rice (Shiribetsu-river paddies) and local pickles — celery kimchi, melon nuka-zuke",
  "Michi-no-eki Rankoshi Furusato-no-Oka (道の駅 らんこし・ふるさとの丘)",
  "Aioi 969, Rankoshi, Isoya District, Hokkaido, Japan",
  "Route 5 roadside station of Rankoshi, a town known for its rice, selling Shiribetsu-valley produce and house pickles with views of the Niseko range and Yōtei.",
  [("RURUBU",RU+"80116685"),("HOKKAIDOMICHINOEKI",ME+"2519/"),("WIKIPEDIA_JA",JA+"道の駅らんこし・ふるさとの丘")],
  42.76206,140.47897,"high","ja.wikipedia 道の駅らんこし・ふるさとの丘 infobox (北緯42度45分43秒 東経140度28分44秒) via WebSearch",O,"hokkaido-michinoeki.jp listing (current)")

F(2,"NSK",["FINE"],"Makkari-grown vegetables and Yōtei spring water in Hokkaido-French courses",
  "Restaurant Makkarina, Makkari (レストラン マッカリーナ)",
  "Midorioka 172-3, Makkari, Abuta District, Hokkaido, Japan",
  "Auberge restaurant in the Makkari woods at the foot of Yōtei, cooking French from the village's own fields and mountain spring water under chef Sugaya Shin'ichi's direction.",
  [("RURUBU",RU+"80001365"),("MAPPLE","https://www.mapple.net/article/189593/")],
  status=O,ssrc="rurubu&more spot page (lunch/dinner hours, closed Wed — current)")

# ---------------- OTARU ----------------
F(2,"OTARU",["FINE","INT"],"Yoichi seafood and vegetables with Yoichi wine pairings (Italian-leaning dinner course)",
  "Yoichi LOOP (余市 ループ)",
  "Kurokawa-chō 4-123, Yoichi, Yoichi District, Hokkaido, Japan",
  "An auberge-restaurant facing JR Yoichi Station, the first Yoichi restaurant listed in Gault&Millau Japan (two years running): local fish and farm vegetables matched to the town's vineyards.",
  [("RURUBU","https://rurubu.jp/andmore/article/19649"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1145916/"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1297657/")],
  status=O,ssrc="Hokkaido Shimbun 1297657 (Gault&Millau listing, second consecutive year)")
F(2,"OTARU",["SUSHI"],"Shakotan uni-don (June–Aug, fresh Ezo bafun/kita-murasaki uni) and local-catch nigiri",
  "Fuji-zushi Shakotan Honten, Bikuni (ふじ鮨 積丹本店)",
  "Bikuni-chō Funama 120-6, Shakotan, Shakotan District, Hokkaido, Japan",
  "The 1967 flagship of the Shakotan sushi family (five shops, incl. Otaru): fish landed in front of the shop at Bikuni harbour, uni-don in the summer season.",
  [("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/616/"),("MAPPLE","https://www.mapple.net/region/a0102020100_g03050300/spot")],
  status=O,ssrc="mapple listing (hours 11:00–20:45 summer, current)")

F(2,"OTARU",["SUSHI"],"Otaru nigiri of the day's Shakotan/Ishikari-bay catch — omakase 7-piece",
  "Otaru Nihonbashi, Sushiya-dōri (小樽 日本橋)",
  "Inaho 1-1-4, Otaru, Hokkaido, Japan",
  "One of the five houses of the Sushiya-dōri Meitenkai (the street's founding sushi guild), three minutes from the canal: counter, private rooms and seasonal Otaru nigiri.",
  [("RURUBU",RU+"80000699"),("OTARUTOURISM","https://otaru.gr.jp/shop/nihonbashi"),("OTARUTOURISM","https://otaru.gr.jp/project/otarujishin-202302sushi")],
  status=O,ssrc="rurubu&more spot page (hours, closed Thu — current)")
S(3,"NSK","Makkari Onsen (まっかり温泉)","Makkari, Abuta District, Hokkaido, Japan",
  "The village-run day spa of Makkari: a rock-built rotenburo with Mt Yōtei filling the view.",
  [("RURUBU",RU+"80001366"),("NISEKOTOURISM",NT+"resorts/article/%E7%9C%9F%E7%8B%A9%E6%9D%91%E6%B8%A9%E6%B3%89%E4%BF%9D%E9%A4%8A%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E3%80%80%E3%81%BE%E3%81%A3%E3%81%8B%E3%82%8A%E6%B8%A9%E6%B3%89/")],
  status=O,ssrc="rurubu&more day-onsen 2026 listing",g=["ONSEN"])
S(2,"NSK","Yōtei Nature Park & Yōtei Spring, Makkari (羊蹄山自然公園・羊蹄の湧水)","Makkari, Abuta District, Hokkaido, Japan",
  "Park at the Makkari trailhead of Mt Yōtei; by the entrance the 'kamui wakka' spring pours water filtered for decades through the volcano — locals queue with bottles.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_10329.html"),("RURUBU",RU+"80001364"),("MAPPLE",MP+"1010261/")],
  status=O,ssrc="visit-hokkaido spot 10329 (current)",g=["NATURE","FREE"])
S(3,"NSK","Iwaonupuri (イワオヌプリ)","Niseko / Kutchan, Abuta District, Hokkaido, Japan",
  "'Sulphur mountain' in Ainu — the youngest volcano of the Niseko range, its bare slopes crusted with sulphur crystals; a short hike from Goshiki Onsen with views to Yōtei.",
  [("NISEKOTOURISM",NT+"news/article/niseko-annupuri-iwao-nupuri/"),("WIKIPEDIA_JA",JA+"イワオヌプリ")],
  42.88528,140.64056,"high","ja.wikipedia イワオヌプリ infobox (北緯42度53分07秒 東経140度38分26秒) via WebSearch",O,"niseko-ta.jp trail-condition notice",g=["NATURE","VIEW"])

F(2,"OTARU",["MKT","HOKKAIDO"],"4 a.m. Otaru fish market — fresh fish, himono and kaisendon at the in-market Asaichi Shokudō",
  "Rinyū Asaichi Morning Market, Otaru (鱗友朝市)",
  "Ironai 3-10-15, Otaru, Hokkaido, Japan",
  "The locals' fish market by the port, open from 4 a.m.: a dozen stalls of fresh fish, dried and salted catch, plus a diner for breakfast seafood bowls (closed Sundays).",
  [("RURUBU",RU+"80000572"),("MAPPLE",MP+"1002427/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_10103.html")],
  status=O,ssrc="rurubu&more spot page (4:00–14:00, closed Sun — current)")
F(3,"OTARU",["MKT","IZAKAYA"],"20+ stalls cooking Otaru seafood, ramen and yakitori in a Meiji–Taishō-style alley",
  "Otaru Denuki Kōji (小樽出抜小路)",
  "Ironai 1-1, Otaru, Hokkaido, Japan",
  "A retro food alley opposite the canal recreating Otaru's Meiji–Taishō merchant streets, with over twenty small eateries and a fire-lookout tower view over the water.",
  [("OTARUTOURISM","https://otaru.gr.jp/shop/denuki-koji"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_12801.html"),("RURUBU",RU+"80000615")],
  status=O,ssrc="visit-hokkaido spot 12801 (current)")
F(3,"OTARU",["HOKKAIDO","MKT"],"kaisendon of boiled tarabagani, house-cured ikura and raw scallop",
  "Kaisen Shokudō Sawazaki Suisan, Denuki Kōji (海鮮食堂 澤崎水産)",
  "Ironai 1-1-17, Otaru Denuki Kōji 1F, Otaru, Hokkaido, Japan",
  "A seafood wholesaler's own diner on the ground floor of Denuki Kōji: crab, home-marinated salmon roe and scallop bowls, open daily 11:00–20:00.",
  [("RURUBU",RU+"80000660"),("MAPPLE",MP+"1015654/"),("OTARUTOURISM","https://otaru.gr.jp/shop/%E6%BE%A4%E5%B4%8E%E6%B0%B4%E7%94%A3%E3%80%80%E6%B5%B7%E9%AE%AE%E9%A3%9F%E5%A0%82")],
  status=O,ssrc="rurubu&more spot page (11:00–20:00 daily — current)")

emit("W89")
