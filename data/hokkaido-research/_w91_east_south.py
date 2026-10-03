#!/usr/bin/env python3
# W91 — DONAN / DOTO / IBURI food-first wave (session 5): Hakodate shio ramen & Motomachi cafés, Kushiro soba/robata,
# Nemuro escalope, Okhotsk craft beer, Kitami mint; + ja.wikipedia-pinned sights. WebSearch 2026-10-03, ≤30 searches.
from _hk import F, S, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/spot/"; MP="https://www.mapple.net/spot/"
VH="https://www.visit-hokkaido.jp/spot/detail_"; KL="http://en.kushiro-lakeakan.com/"
O="open"
OUTLETS=[{"key":"NEMUROTOURISM","name":"Nemuro City Tourism Association (根室市観光協会)","url":"https://nemuro-kankou.com/",
          "credible":"official municipal tourism association for Nemuro — same class as hakodate.travel / kushiro-lakeakan.com"},
         {"key":"SHIRETOKOTOURISM","name":"Shiretoko Shari Tourism Association (知床斜里町観光協会)","url":"https://www.shiretoko.asia/",
          "credible":"official town tourism association for Shari/Utoro (Shiretoko)"},
         {"key":"SHIRAOITOURISM","name":"Shiraoi Tourism Association (白老観光協会)","url":"https://shiraoi.net/",
          "credible":"official town tourism association for Shiraoi (Upopoy's town)"}]

# ---------------- DONAN ----------------
F(2,"DONAN",["RAMEN","HOKKAIDO"],"Hakodate shio ramen — whole-chicken & Minami-kayabe kombu clear broth, house-made thin noodles","Hakodate Men'ya Ichimonji, Yunokawa (函館麺や 一文字)",
  "Yunokawa-chō, Hakodate, Hokkaido, Japan",
  "Yunokawa's shio-ramen specialist — a double soup of whole chicken and Minami-kayabe kombu, clam and shijimi essence in the salt tare, and its own thin straight noodles.",
  [("RURUBU",RU+"80000377"),("MAPPLE","https://www.mapple.net/article/53509/")],
  status=O,ssrc="rurubu 80000377 (current listing)")
F(2,"DONAN",["CAFE","SWEET"],"British afternoon tea set in the old consulate","Tearoom Victorian Rose, Former British Consulate (ティールーム ヴィクトリアンローズ)",
  "33-14 Motomachi, Hakodate, Hokkaido, Japan",
  "The English tearoom inside the 1913 Former British Consulate — antiques shipped from Britain, scones and a full afternoon-tea stand in Motomachi.",
  [("RURUBU",RU+"80000555"),("MAPPLE",MP+"1002535/")],
  41.765944,140.710694,"high","ja.wikipedia 函館市旧イギリス領事館 infobox (北緯41度45分57.4秒 東経140度42分38.5秒) — tearoom is inside the building; via WebSearch",O,"mapple 1002535 (10:00-18:00; winter to 16:30)")

F(2,"DONAN",["RAMEN","HOKKAIDO"],"the 'Ryūhō' yatai-style original Hakodate shio ramen of ~40 years ago","Shin-Hakodate Ramen Mame-san (新函館ラーメン マメさん)",
  "22-6 Hōrai-chō, Hakodate, Hokkaido, Japan",
  "Hōrai-chō counter reviving the shio ramen of the old 'Ryūhō' street stall — the pre-boom Hakodate bowl, below Mt Hakodate.",
  [("RURUBU",RU+"80000445"),("MAPPLE","https://www.mapple.net/article/53509/")],
  status=O,ssrc="rurubu 80000445 (11-15, 17-20; closed Thu & 2nd/3rd Wed)")
F(2,"DONAN",["INT","HOKKAIDO"],"Hakodate 'Indo curry' — 1948-recipe spiced roux curry","Indo Curry Koike Honten, Hakodate (印度カレー 小いけ本店)",
  "22-5 Hōrai-chō, Hakodate, Hokkaido, Japan",
  "Founded 1948, Hakodate's old-school curry house — a sharply spiced, nostalgic roux that locals rank beside Gotōken's.",
  [("RURUBU",RU+"80000496"),("MAPPLE","https://www.mapple.net/article/51876/")],
  status=O,ssrc="rurubu 80000496 (11-15, 17:30-20)")
F(2,"DONAN",["MKT","HOKKAIDO"],"chefs' market seafood — squid, kaisendon at the in-market shokudō","Hakodate Jiyū Ichiba (はこだて自由市場)",
  "1-2 Shinkawa-chō, Hakodate, Hokkaido, Japan",
  "The locals' and chefs' market rather than the tourists' — sushi chefs buy here; fish stalls will slice what you pick, plus a shokudō and food court.",
  [("RURUBU",RU+"80000525"),("MAPPLE",MP+"1000589/")],
  status=O,ssrc="rurubu 80000525 (7-17, closed Sun)")
F(2,"DONAN",["MKT","HOKKAIDO"],"kaisendon, uni-ikura-don and ikasōmen from the market canteens","Donburi Yokochō Ichiba, Hakodate Morning Market (どんぶり横丁市場)",
  "Wakamatsu-chō, Hakodate, Hokkaido, Japan (inside Hakodate Morning Market)",
  "The Morning Market's canteen arcade — a covered lane of donburi shokudō open from dawn into lunch, the place for kaisendon by Hakodate Station.",
  [("RURUBU","https://rurubu.jp/andmore/article/22507"),("MAPPLE","https://www.mapple.net/article/43226/")],
  status=O,ssrc="rurubu article 22507 (2026 guide, current)")
S(2,"DONAN","Former Sōma Residence (旧相馬家住宅)","Motomachi, Hakodate, Hokkaido, Japan",
  "Merchant Sōma Teppei's 1908 Japanese-Western house beside the Old Public Hall he paid for — an Important Cultural Property with a kura gallery of Esashi screens.",
  [("BUNKACHO","https://kunishitei.bunka.go.jp/"),("HAKODATETRAVEL","https://www.hakodate.travel/chs/sightseeing-spots/historic-building/old-soma-residence/"),("WIKIPEDIA_JA",JA+"%E6%97%A7%E7%9B%B8%E9%A6%AC%E5%AE%B6%E4%BD%8F%E5%AE%85")],
  41.765333,140.710778,"high","ja.wikipedia 旧相馬家住宅 infobox (北緯41度45分55.2秒 東経140度42分38.8秒) via WebSearch",O,"hakodate.travel spot page (current)",k="merchant mansion (ICP)",g=["HISTORY"])
S(3,"DONAN","Shiryōkaku Fort (四稜郭)","Kamiyama-chō, Hakodate, Hokkaido, Japan",
  "A four-pointed earthwork fort thrown up in days by ~300 Republic of Ezo soldiers and locals in 1869 to shield Goryōkaku — a national historic site park 3 km north.",
  [("HOKKAIDOTOURISM",VH+"10209.html"),("WIKIPEDIA_JA",JA+"%E5%9B%9B%E7%A8%9C%E9%83%AD")],
  41.8255806,140.7707944,"high","ja.wikipedia 四稜郭 infobox (北緯41度49分32.09秒 東経140度46分14.86秒) via WebSearch",O,"visit-hokkaido 10209 (open park)",k="Boshin War fort",g=["HISTORY","FREE"])
S(3,"DONAN","Iai Gakuin Former Missionaries' Residence (遺愛学院旧宣教師館)","Suginami-chō, Hakodate, Hokkaido, Japan",
  "On the campus of the first girls' school north of Tokyo (1882) — the clapboard missionary house and main hall are Important Cultural Properties, opened on set days.",
  [("BUNKACHO","https://kunishitei.bunka.go.jp/"),("MAPPLE",MP+"1010758/"),("WIKIPEDIA_JA",JA+"%E9%81%BA%E6%84%9B%E5%A5%B3%E5%AD%90%E4%B8%AD%E5%AD%A6%E6%A0%A1%E3%83%BB%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1")],
  41.78725,140.756722,"med","ja.wikipedia 遺愛女子中学校・高等学校 infobox (campus, 北緯41度47分14.1秒 東経140度45分24.2秒) — ICP buildings stand on this campus; via WebSearch",O,"mapple 1010758 (current listing)",k="Meiji mission school (ICP)",g=["HISTORY"])

# ---------------- DOTO ----------------
F(1,"DOTO",["NOODLE","HOKKAIDO"],"ranchiri soba (egg-bound), kashiwa-nuki and green-tea soba","Chikurōen Azumaya Sōhonten, Kushiro (竹老園 東家総本店)",
  "3-19 Kashiwagi-chō, Kushiro, Hokkaido, Japan",
  "Meiji-founded soba house in a 1927 building with a Japanese garden — the origin of Kushiro's green-tinged soba, served as ranchiri, kashiwa-nuki and soba-zushi.",
  [("RURUBU",RU+"80000808"),("MAPPLE",MP+"1001387/")],
  status=O,ssrc="rurubu 80000808 (11:00-18:00)")
F(2,"DOTO",["IZAKAYA","HOKKAIDO"],"Kushiro robatayaki — local saba and Notsuke scallops grilled over charcoal","Robata Renga, Kushiro (炉ばた 煉瓦)",
  "3-5-3 Nishiki-chō, Kushiro, Hokkaido, Japan",
  "Robatayaki in a late-Meiji red-brick grain-and-salt warehouse by Fisherman's Wharf MOO — Kushiro-landed fish and Notsuke scallops grilled at your table.",
  [("RURUBU",RU+"80000802"),("KUSHIROTOURISM",KL+"eat_souvenir/7660/")],
  status=O,ssrc="rurubu 80000802 (17:00-23:00)")
F(2,"DOTO",["INT","HOKKAIDO"],"Nemuro escalope — pork cutlet on bamboo-shoot butter rice with demi-glace","Shokuji to Kissa Dorian, Nemuro (食事と喫茶 どりあん)",
  "Nemuro, Hokkaido, Japan (7 min walk from JR Nemuro Station)",
  "Since 1969 the reference escalope — butter rice, pork cutlet and demi-glace — plus its 'Oriental rice', 7 minutes' walk from Nemuro Station.",
  [("MAPPLE","https://www.mapple.net/collection/126b3d1507d743b99b98fe237a8cd2ce/"),("NEMUROTOURISM","https://nemuro-kankou.com/spot/spot807/")],
  status=O,ssrc="nemuro-kankou.com spot807 (current menu & prices)")
F(2,"DOTO",["SAKE","HOKKAIDO"],"Okhotsk Beer — Hokkaido's first craft beer, pilsner & ales on tap","Okhotsk Beer Factory, Kitami (オホーツクビアファクトリー)",
  "2-2-2 Yamashita-chō, Kitami, Hokkaido, Japan",
  "The brewpub that started Hokkaido's craft-beer boom — all-malt pilsner and ales brewed on site in Kitami, with a restaurant.",
  [("RURUBU",RU+"80000936"),("HOKKAIDOTOURISM",VH+"11188.html")],
  status=O,ssrc="rurubu 80000936 (11:30-22:00, closed Mon)")
S(2,"DOTO","Kitami Hakka Memorial Museum & Mint Distillery (北見ハッカ記念館・薄荷蒸溜館)","Kitami, Hokkaido, Japan",
  "The 1934 Western-style office of the Hokuren mint plant from when Kitami grew ~70% of the world's mint — with a working steam-distillation house next door.",
  [("HOKKAIDOTOURISM",VH+"10131.html"),("RURUBU","https://rurubu.jp/andmore/article/16051"),("WIKIPEDIA_JA",JA+"%E5%8C%97%E8%A6%8B%E3%83%8F%E3%83%83%E3%82%AB%E8%A8%98%E5%BF%B5%E9%A4%A8")],
  43.79972,143.89389,"high","ja.wikipedia 北見ハッカ記念館 infobox (北緯43度47分59秒 東経143度53分38秒) via WebSearch",O,"visit-hokkaido 10131 (current)",k="mint-industry museum",g=["MUS","HISTORY"])


F(2,"DOTO",["TEISHOKU","HOKKAIDO"],"Utoro-caught sashimi teishoku (uni, botan-ebi) and the 'Araiso-don'","Araiso Ryōri Kuma no Ya, Utoro (荒磯料理 熊の家)",
  "187-11 Utoro-nishi, Shari, Shari District, Hokkaido, Japan",
  "Utoro's local-catch-only fish house — 5–7 kinds of sashimi including sea urchin and botan shrimp; a green-lantern (local produce) restaurant.",
  [("RURUBU",RU+"80001645"),("MAPPLE","https://www.mapple.net/article/43383/")],
  status=O,ssrc="rurubu 80001645 (11:00-16:00)")
F(3,"DOTO",["TEISHOKU","HOKKAIDO"],"Utoro salmon and summer uni teishoku, pick-your-own kaisendon","Oshokujidokoro Ezogashima, Utoro (お食事処 夷知床)",
  "Utoro, Shari, Shari District, Hokkaido, Japan",
  "Utoro diner built around the town's two catches — salmon set meals and, in summer, Utoro uni; build-your-own seafood bowls.",
  [("MAPPLE","https://www.mapple.net/article/43383/"),("SHIRETOKOTOURISM","https://www.shiretoko.asia/restaurant/ezogashima.html")],
  status=O,ssrc="shiretoko.asia restaurant page (current)")

S(2,"DOTO","Oronko Rock, Utoro (オロンコ岩)","Utoro, Shari, Shari District, Hokkaido, Japan",
  "A 60 m sea stack by Utoro port, one of the 'Shiretoko Eight Views' — 200-odd steps to a flat top over the Okhotsk and the Shiretoko range (summit access closed for works in 2022; check).",
  [("RURUBU",RU+"80001657"),("SHIRETOKOTOURISM","https://www.shiretoko.asia/detail/scenic/oronkoiwa"),("WIKIPEDIA_JA",JA+"%E3%82%AA%E3%83%AD%E3%83%B3%E3%82%B3%E5%B2%A9")],
  44.07333,144.99056,"high","ja.wikipedia オロンコ岩 infobox (北緯44度04分24秒 東経144度59分26秒) via WebSearch",O,"rurubu 80001657 (late Apr-early Dec); shiretoko.asia blog 2022 noted summit closed for works",k="sea stack viewpoint",g=["VIEW","NATURE","FREE"])
S(2,"DOTO","Ten ni Tsuzuku Michi — Road to Heaven, Shari (天に続く道)","Minehama, Shari, Shari District, Hokkaido, Japan",
  "A 28.1 km dead-straight stretch of road rolling over the Shari hills toward the sky — twice a year the sun sets exactly at its end.",
  [("HOKKAIDOTOURISM",VH+"10527.html"),("SHIRETOKOTOURISM","https://www.shiretoko.asia/detail/scenic/road_to_heaven"),("WIKIPEDIA_JA",JA+"%E5%A4%A9%E3%81%AB%E7%B6%9A%E3%81%8F%E9%81%93")],
  43.906845,144.798699,"med","ja.wikipedia 天に続く道 infobox (北緯43度54分25秒 東経144度47分55秒 — the Minehama viewpoint end of a 28 km road) via WebSearch",O,"visit-hokkaido 10527 (parking 8 cars, free)",k="straight-road viewpoint",g=["VIEW","FREE"])

# ---------------- IBURI ----------------

F(2,"IBURI",["WAGYU","HOKKAIDO"],"home-raised Shiraoi-beef burger and Shiraoi-beef curry","Farm Restaurant Uemura Base, Shiraoi (ファームレストラン ウエムラ・ベース)",
  "109-20 Ishiyama, Shiraoi, Shiraoi District, Hokkaido, Japan",
  "Run by one of Hokkaido's few birth-to-finish Kuroge-wagyu farms (Uemura Bokujō) — Shiraoi-beef burgers, reopened 2021.",
  [("RURUBU",RU+"80101494"),("SHIRAOITOURISM","https://shiraoi.net/gourmet/uemura-base/")],
  status=O,ssrc="shiraoi.net page (renewed July 2021, current)")
F(3,"IBURI",["WAGYU","HOKKAIDO"],"charcoal yakiniku and steak of Shiraoi beef","Yakiniku & Steak Restaurant Cowbell, Shiraoi (レストラン カウベル)",
  "112-14 Ishiyama, Shiraoi, Shiraoi District, Hokkaido, Japan",
  "Butcher-run since 1975 — Shiraoi-beef yakiniku over charcoal and steaks, listed among the town's Shiraoi-beef houses.",
  [("RURUBU",RU+"80001701"),("SHIRAOITOURISM","https://shiraoi.net/gourmet/cat/shiraoi_beef/")],
  status=O,ssrc="rurubu 80001701 (current)")
F(3,"IBURI",["SWEET","HOKKAIDO"],"farm-milk gelato with Mt Yōtei view; 'Mura-ichiban' curry","Lake Hill Farm, Tōyako (レークヒル・ファーム)",
  "127 Hanawa, Tōyako, Abuta District, Hokkaido, Japan",
  "Dairy-farm gelateria on the hill above Lake Tōya — gelato made daily from its own cows' milk, looking across to Mt Yōtei.",
  [("HOKKAIDOTOURISM",VH+"10431.html"),("MAPPLE","https://www.mapple.net/region/a0102030000_g03000000/spot/")],
  status=O,ssrc="visit-hokkaido 10431 (summer 9-18, winter 9-17)")

emit("W91",OUTLETS)
