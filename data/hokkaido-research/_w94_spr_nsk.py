#!/usr/bin/env python3
# W94 — SPR +3 / NSK +2 (session 6, 2026-10-03). Closes SPR NEED +2 and NSK NEED +1.
# Sight pins from ja.wikipedia infobox coords read in the WebSearch results; food pins added in G06 (NAVITIME POI).
from _hk import S, F, emit
RU="https://rurubu.jp/andmore/spot/"; JA="https://ja.wikipedia.org/wiki/"
O="open"
S(2,"SPR","Asahiyama Memorial Park (旭山記念公園)","Moiwa-shita / Asahigaoka, Chūō-ku, Sapporo, Hokkaido, Japan",
  "A hillside park between Mt Moiwa and Maruyama built for Sapporo's centenary — its lookout at 137.5 m takes in the whole grid of the city and is one of Sapporo's classic free night-view spots.",
  [("WIKIPEDIA_JA",JA+"旭山記念公園"),("SAPPOROTRAVEL","https://www.sapporo.travel/find/nature-and-parks/asahiyama-memorial-park/"),("RURUBU",RU+"80000132")],
  43.03944,141.31389,"high","ja.wikipedia 旭山記念公園 infobox (北緯43度02分22秒 東経141度18分50秒) via WebSearch",O,"sapporo.travel page current (2026-10)",g=["PARK","VIEW","FREE"])
S(3,"SPR","Sapporo Shiryōkan — former Sapporo Court of Appeals (札幌市資料館)","Ōdōri Nishi 13-chōme, Chūō-ku, Sapporo, Hokkaido, Japan",
  "The 1926 sandstone Court of Appeals at the west end of Ōdōri Park, its façade carved with the blindfolded scales of justice — now a free city museum with a preserved courtroom and the Ōta Shinkichi manga gallery.",
  [("WIKIPEDIA_JA",JA+"札幌市資料館"),("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/shiryokan/")],
  43.058528,141.337472,"high","ja.wikipedia 札幌市資料館 infobox (北緯43度3分30.7秒 東経141度20分14.9秒) via WebSearch",O,"sapporo.travel EN facility page current (2026-10)",g=["ARCH","MUS","FREE"])
S(3,"SPR","Kotoni Tondenhei Village Barracks Site (琴似屯田兵村兵屋跡)","Kotoni 2-jō 5-chōme, Nishi-ku, Sapporo, Hokkaido, Japan",
  "A surviving 1874 farmer-soldier (tondenhei) house of the first militia village that settled Sapporo — a National Historic Site, restored with its earthen-floor kitchen and open hearth.",
  [("BUNKACHO","https://online.bunka.go.jp/heritages/search/item_137554:1"),("WIKIPEDIA_JA",JA+"琴似屯田兵村兵屋跡"),("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/998057/")],
  43.076278,141.301944,"high","ja.wikipedia 琴似屯田兵村兵屋跡 infobox (北緯43度4分34.6秒 東経141度18分7.0秒) via WebSearch",O,"Sapporo City cultural-property pages (city.sapporo.jp/shimin/bunkazai) list it as a viewable national historic site (2026-10)",g=["HIST"])
F(2,"NSK",["HOKKAIDO","CAFE"],"sandwiches on house bread (the 'Graubünden sand') and seasonal-fruit cakes","Graubünden, Hirafu (おやつとサンドイッチのお店 グラウビュンデン)",
  "Niseko Hirafu 5-jō 4-chōme 2-6, Kutchan, Abuta District, Hokkaido, Japan",
  "A long-running Swiss-named sweets-and-sandwich café in Hirafu village — the skiers' lunch stop for its sandwiches and fruit cakes, listed in Kutchan's official town specialty catalogue.",
  [("RURUBU",RU+"80001385"),("KUTCHANTOWN","https://www.town.kutchan.hokkaido.jp/file/contents/708/50789/kutchanmiyagecatalog.pdf")],status=O,ssrc="rurubu spot page (hours current)")
F(2,"NSK",["HOKKAIDO","SUSHI"],"omakase of fish bought daily from nearby bays (hairy crab, tuna belly, ankimo)","Sushi Hanayoshi, Niseko (鮨 花吉)",
  "Fujimi 65, Niseko-chō, Abuta District, Hokkaido, Japan",
  "Counter sushi in Niseko town where chef Yoshioka buys from the local bays each morning — the omakase runs from sashimi to hairy crab and chawanmushi; dinner only, booking essential.",
  [("NISEKOTOURISM","https://www.niseko-ta.jp/resorts-eat/7543/"),("POWDERLIFE","https://www.powderlife.com/blog/hanayoshi-sushi/")],status=O,ssrc="niseko-ta.jp listing (hours current: 17:00–21:00, closed Mon)")
emit("W94",[{"key":"POWDERLIFE","name":"Powderlife Magazine (Niseko's English-language local magazine)","url":"https://www.powderlife.com","credible":"Niseko's long-running local English magazine/guide (print + web since 2000s) with bylined restaurant features; local-editorial tier, one corroborating source."}])
