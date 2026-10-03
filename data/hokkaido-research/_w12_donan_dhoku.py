#!/usr/bin/env python3
# W12 — DONAN (Hakodate Motomachi/Goryōkaku sights + food) + DHOKU (Asahikawa ramen). WebSearch 2026-10-02 (s2).
from _hk import S, F, emit
JA="https://ja.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"; VH="https://www.visit-hokkaido.jp/en/"
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def jg(p): return ("JAPANGUIDE",JG+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
# ---- DONAN sights ----
S(2,"DONAN","Old Public Hall of Hakodate Ward (旧函館区公会堂)","Motomachi, Hakodate, Hokkaido, Japan (top of Motoizaka slope)",
  "The blue-grey and yellow 1910 colonial-style assembly hall looking over the port from the top of Motoizaka — an Important Cultural Property.",
  [ja("%E6%97%A7%E5%87%BD%E9%A4%A8%E5%8C%BA%E5%85%AC%E4%BC%9A%E5%A0%82"),vh("spot/detail_11298.html"),jg("e5351.html")],41.765028,140.70889,"high","ja.wikipedia 旧函館区公会堂 infobox (北緯41度45分54.1秒 東経140度42分32秒) via WebSearch",
  O,"visit-hokkaido.jp spot 11298 (current)",k="meiji hall view",g=["CASTLE","VIEW"])
S(2,"DONAN","Former British Consulate of Hakodate (函館市旧イギリス領事館)","Motomachi, Hakodate, Hokkaido, Japan",
  "The British consulate building of Hakodate's treaty-port era in Motomachi, now a city-run museum of the port's opening.",
  [ja("%E5%87%BD%E9%A4%A8%E5%B8%82%E6%97%A7%E3%82%A4%E3%82%AE%E3%83%AA%E3%82%B9%E9%A0%98%E4%BA%8B%E9%A4%A8"),jg("e5351.html")],41.765944,140.710694,"high","ja.wikipedia 函館市旧イギリス領事館 infobox (北緯41度45分57.4秒 東経140度42分38.5秒) via WebSearch",
  O,"japan-guide.com e5351 (current)",k="consulate museum garden",g=["MUS","CASTLE","GARDEN"])
S(2,"DONAN","Goryōkaku Tower (五稜郭タワー)","Goryōkaku-chō, Hakodate, Hokkaido, Japan",
  "The observation tower beside the fort — the only way to see Goryōkaku's five-pointed star from above.",
  [ja("%E4%BA%94%E7%A8%9C%E9%83%AD%E3%82%BF%E3%83%AF%E3%83%BC"),jg("e5352.html")],41.794694,140.754000,"high","ja.wikipedia 五稜郭タワー infobox (北緯41度47分40.9秒 東経140度45分14.4秒) via WebSearch",
  O,"japan-guide.com e5352 (current)",k="observation tower star fort",g=["VIEW"])
S(2,"DONAN","Hakodate Magistrate's Office (箱館奉行所)","Goryōkaku Park, Goryōkaku-chō, Hakodate, Hokkaido, Japan",
  "Built by the Edo shogunate in the late Edo period inside Goryōkaku to oversee northern defence and foreign affairs; restored on its original site.",
  [vh("spot/detail_10090.html"),ja("%E4%BA%94%E7%A8%9C%E9%83%AD")],status=O,ssrc="visit-hokkaido.jp spot 10090 (current)",k="magistrate office reconstruction",g=["CASTLE","MUS"])
S(2,"DONAN","Hachimanzaka Slope (八幡坂)","Motomachi, Hakodate, Hokkaido, Japan",
  "The straight, stone-curbed slope that runs from Motomachi straight down to the harbour — Hakodate's most photographed view, lit up in winter.",
  [vh("spot/detail_10089.html"),jg("e5351.html")],status=O,ssrc="visit-hokkaido.jp spot 10089 (public street)",k="slope harbour view",g=["VIEW","FREE"])
# ---- DONAN food ----
F(2,"DONAN",["HOKKAIDO","IZAKAYA"],"yakitori bentō (pork 'yakitori' skewers on rice)","Hasegawa Store Bay Area (ハセガワストア ベイエリア店)",
  "Bay Area, Hakodate, Hokkaido, Japan",
  "Hakodate's convenience-store institution: the yakitori bentō grilled to order — in southern Hokkaido 'yakitori' means pork.",
  [("RURUBU",RU+"spot/80000522"),("MAPPLE",MP+"article/53535/")],status=O,ssrc="rurubu&more spot page (hours listed, current)")
F(2,"DONAN",["HOKKAIDO","SUSHI"],"additive-free raw uni donburi","Uni Murakami Hakodate Honten (うに むらかみ 函館本店)",
  "Morning-market streets, Hakodate, Hokkaido, Japan (5 min walk from Hakodate Station)",
  "Restaurant of a sea-urchin wholesaler that long supplied Tsukiji and top sushi counters — sweet, additive-free raw uni in bowls and set meals.",
  [("HAKODATETRAVEL","https://www.hakodate.travel/cht/food_and_drink/japanese-cuisine/uni-murakami-hakodate"),("MAPPLE",MP+"region/a0102060101_g03000000/spot/")],status=O,ssrc="hakodate.travel official listing (current)")
# ---- DHOKU food (Asahikawa ramen) ----
F(1,"DHOKU",["RAMEN"],"Asahikawa shio ramen (gentle paitan, tokusei toroniku)","Ramen Santouka Honten, Asahikawa (らーめん山頭火 本店)",
  "Asahikawa, Hokkaido, Japan",
  "Hitoshi Hatanaka's nine-seat 1988 shop that took Hokkaido ramen worldwide — a mild, low-salt white broth; the tokusei toroniku (pork-cheek) bowl.",
  [("MAPPLE",MP+"spot/1001390/"),("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/why-the-world-loves-japanese-ramen-the-story-of-ramen-santouka")],status=O,ssrc="MAPPLE spot page (current)")
F(1,"DHOKU",["RAMEN"],"Asahikawa shōyu ramen with burnt lard (kogashi lard)","Ramen no Hachiya Gojō Sōgyōten (ラーメンの蜂屋 五条創業店)",
  "Gojō-dōri, Asahikawa, Hokkaido, Japan",
  "Since 1947: a pork-bone and dried-horse-mackerel double broth under burnt lard, with house noodles — the shop credited with Asahikawa's low-hydration noodle.",
  [("MAPPLE",MP+"article/43037/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/stamprally/spot/09/")],status=O,ssrc="visit-hokkaido.jp location stamp-rally spot (current)")
F(2,"DHOKU",["RAMEN"],"Asahikawa double-soup shōyu ramen","Baikōken Honten, Asahikawa (梅光軒 本店)",
  "Asahikawa, Hokkaido, Japan (city centre)",
  "Founded 1969 — pork, chicken and seafood double broth, rich yet clean; first winner of the citizens' Asahikawa Ramen Grand Prize.",
  [("RURUBU",RU+"spot/80000722"),("MAPPLE",MP+"article/43037/")],status=O,ssrc="rurubu&more spot page (current)")
OUT=[{"key":"HAKODATETRAVEL","name":"Hakodate Travel (hakodate.travel) — official Hakodate city tourism site","url":"https://www.hakodate.travel/","credible":"Official tourism site of the City of Hakodate / Hakodate International Tourism & Convention Association — tourism body of record."},
     {"key":"HOKKAIDOSHIMBUN","name":"Hokkaido Shimbun (北海道新聞)","url":"https://www.hokkaido-np.co.jp/","credible":"Hokkaido's regional newspaper of record (Japan brief: HOKKAIDOSHIMBUN)."}]
emit("W12",OUT)
