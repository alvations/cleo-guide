#!/usr/bin/env python3
# W60 — sights: second sources for Wikipedia-coord-only leads (DONAN/DHOKU/TKC/NSK/SPR/OTARU) + Wakkanai Noshappu. WebSearch 2026-10-02.
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; VH="https://www.visit-hokkaido.jp/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
def rr(i): return ("RURUBU","https://rurubu.jp/andmore/spot/"+i)
O="open"
# DONAN
S(2,"DONAN","Mount Esan (恵山)","Esan area, Hakodate, Hokkaido, Japan",
  "A still-steaming 618 m active volcano at the eastern tip of the Kameda Peninsula — trails from the 300 m crater-floor car park, and some 600,000 wild Ezo azaleas around Esan Tsutsuji Park.",
  [vh("spot/detail_10096.html"),rr("80000470"),ja("%E6%81%B5%E5%B1%B1_(%E7%81%AB%E5%B1%B1)")],41.80472,141.16611,"high",
  "ja.wikipedia 恵山 (火山) infobox 41°48′17″N 141°09′58″E",O,"visit-hokkaido.jp spot 10096 (current listing; natural feature)",k="active volcano azaleas",g=["NATURE","VIEW"])
S(2,"DONAN","Hokkaido-Komagatake (北海道駒ヶ岳)","Mori, Kayabe District, Hokkaido, Japan",
  "The 1,131 m active volcano that symbolises southern Hokkaido — once a Fuji-like cone, its summit collapsed in the 1640 eruption, leaving jagged peaks such as Kengamine; climbable June–October.",
  [vh("spot/detail_10305.html"),rr("80001304"),ja("%E5%8C%97%E6%B5%B7%E9%81%93%E9%A7%92%E3%83%B6%E5%B2%B3")],42.063389,140.677222,"high",
  "ja.wikipedia 北海道駒ヶ岳 infobox 42°03′48.2″N 140°40′38.0″E",O,"visit-hokkaido.jp spot 10305 (climbing season Jun–Oct; natural feature)",k="volcano hike",g=["NATURE","VIEW"])
S(3,"DONAN","Hakodate Park (函館公園)","Hakodate, Hokkaido, Japan",
  "A Meiji-era 4.8 ha park with an Ishikawa Takuboku poem stone, the city museum and Hokkaido's first stone bridge (about 10 m).",
  [("MAPPLE","https://www.mapple.net/region/a0102060000_g04050000/spot/"),ja("%E5%87%BD%E9%A4%A8%E5%85%AC%E5%9C%92")],41.75667,140.71611,"high",
  "ja.wikipedia 函館公園 infobox 41°45′24″N 140°42′58″E",O,"mapple.net Hakodate/Donan parks list (current); public park",k="meiji park",g=["HISTORY","NATURE"])
S(3,"DONAN","Hokkaido Hakodate Museum of Art (北海道立函館美術館)","Beside Goryōkaku Park, Hakodate, Hokkaido, Japan",
  "Southern Hokkaido's prefectural art museum next to Goryōkaku Park — a collection of over 2,500 works built on three themes: Dōnan art, calligraphy and contemporary art.",
  [vh("spot/detail_10088.html"),rr("80000364"),ja("%E5%8C%97%E6%B5%B7%E9%81%93%E7%AB%8B%E5%87%BD%E9%A4%A8%E7%BE%8E%E8%A1%93%E9%A4%A8")],41.793417,140.754639,"high",
  "ja.wikipedia 北海道立函館美術館 infobox 41°47′36.3″N 140°45′16.7″E",O,"visit-hokkaido.jp spot 10088 + rurubu&more 80000364 (current listings)",k="art museum",g=["MUSEUM","ART"])
# DHOKU
S(2,"DHOKU","Tokachidake Bōgakudai Observatory (十勝岳望岳台)","Mount Tokachi slopes, Daisetsuzan, Hokkaido, Japan",
  "A lookout over Mount Tokachi's rugged volcanic terrain with views out toward Asahikawa and Furano, and a 1.1 km trail through volcanic rock and alpine flora.",
  [("HOKKAIDOTOURISM",VH+"en/spot/detail_10362.html"),ja("%E5%8D%81%E5%8B%9D%E5%B2%B3%E6%9C%9B%E5%B2%B3%E5%8F%B0")],43.44611,142.65,"high",
  "ja.wikipedia 十勝岳望岳台 infobox 43°26′46″N 142°39′0″E",O,"visit-hokkaido.jp en spot 10362 (current listing; outdoor lookout)",k="volcano lookout",g=["VIEW","NATURE"])
S(2,"DHOKU","Kamui Kotan (神居古潭)","Asahikawa, Hokkaido, Japan",
  "'Dwelling place of the gods' in Ainu — a gorge of the Ishikari River between green-schist cliffs carved over 100 million years; one of Asahikawa's Eight Scenic Views.",
  [("HOKKAIDOTOURISM",VH+"en/spot/detail_10230.html"),ja("%E7%A5%9E%E5%B1%85%E5%8F%A4%E6%BD%AD")],43.731833,142.2025,"high",
  "ja.wikipedia 神居古潭 infobox 43°43′54.6″N 142°12′9″E",O,"visit-hokkaido.jp en spot 10230 (current listing; natural feature)",k="gorge ainu",g=["NATURE","VIEW","HISTORY"])
# TKC
S(2,"TKC","Lake Nukabira (糠平湖)","Nukabira Gensenkyō, Kamishihoro, Katō District, Hokkaido, Japan",
  "A forest-ringed lake made in 1955 by damming the Otofuke River — the felled stumps on its bed raise 100+ 'mushroom ice' formations around February, and the Taushubetsu bridge surfaces from it.",
  [vh("spot/detail_10447.html"),rr("80001778"),("OBIKAN","https://obikan.jp/winter_trip_site/kinoko_ice.html"),ja("%E7%B3%A0%E5%B9%B3%E3%83%80%E3%83%A0")],43.37333,143.22139,"med",
  "ja.wikipedia 糠平ダム infobox 43°22′24″N 143°13′17″E (dam at the lake's outlet, not lake centre)",O,"visit-hokkaido.jp spot 10447 (current listing; natural feature)",k="lake mushroom ice",g=["NATURE","VIEW"])
S(2,"TKC","Mikuni Pass Observatory (三国峠)","Daisetsuzan National Park (Ishikari–Tokachi–Kitami border), Hokkaido, Japan",
  "Hokkaido's highest national-road pass at 1,139 m — a lookout over an endless sea of forest and the Matsumi Ōhashi bridge in Daisetsuzan National Park.",
  [("HOKKAIDOTOURISM",VH+"en/spot/detail_10513.html"),("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/mikuni-pass-a-sea-of-trees"),ja("%E4%B8%89%E5%9B%BD%E5%B3%A0_(%E5%8C%97%E6%B5%B7%E9%81%93)")],43.58694,143.12917,"high",
  "ja.wikipedia 三国峠 (北海道) infobox 43°35′13″N 143°07′45″E",O,"visit-hokkaido.jp en spot 10513 (current listing; roadside lookout)",k="mountain pass lookout",g=["VIEW","NATURE"])
# NSK
S(2,"NSK","Arishima Memorial Museum (有島記念館)","有島57, Niseko, Abuta District, Hokkaido, Japan",
  "Literary museum opened in 1979 for Shirakaba-school writer Arishima Takeo on the farmland he owned — the setting of 'Cain's Descendants' — with a book café looking out on Mount Yōtei.",
  [vh("spot/detail_10319.html"),("NISEKOTOURISM","https://www.niseko-ta.jp/resorts/article/974/"),rr("80001339"),ja("%E6%9C%89%E5%B3%B6%E8%A8%98%E5%BF%B5%E9%A4%A8")],42.81033367,140.70431708,"high",
  "ja.wikipedia 有島記念館 infobox 42°48′37″N 140°42′16″E",O,"niseko-ta.jp news (2025–26 winter kids park at the museum) + visit-hokkaido.jp spot 10319",k="literary museum",g=["MUSEUM","HISTORY"])
# SPR
S(3,"SPR","Hongō Shin Memorial Museum of Sculpture (本郷新記念札幌彫刻美術館)","宮の森4条12丁目, Chūō-ku, Sapporo, Hokkaido, Japan",
  "Museum for Sapporo-born Hongō Shin (1905–1980), a leading figure of postwar Japanese outdoor sculpture — 1,800 pieces including plaster models for his public works and sketches.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/museum_of_sculpture/"),vh("spot/detail_10053.html"),ja("%E6%9C%AC%E9%83%B7%E6%96%B0%E8%A8%98%E5%BF%B5%E6%9C%AD%E5%B9%8C%E5%BD%AB%E5%88%BB%E7%BE%8E%E8%A1%93%E9%A4%A8")],43.055,141.29639,"high",
  "ja.wikipedia 本郷新記念札幌彫刻美術館 infobox 43°3′18″N 141°17′47″E",O,"sapporo.travel + visit-hokkaido.jp spot 10053 (current listings)",k="sculpture museum",g=["MUSEUM","ART"])
# OTARU (Yoichi)
S(2,"OTARU","Fugoppe Cave (フゴッペ洞窟)","栄町87, Yoichi, Yoichi District, Hokkaido, Japan",
  "A cave with over 800 Zoku-Jōmon engravings (c. 1,500–2,000 years old) — people, boats, fish and winged shamanic figures thought to be carved for ritual. Closed mid-Dec to early April.",
  [vh("spot/detail_10346.html"),rr("80001427"),("MAPPLE","https://www.mapple.net/spot/1016518/"),ja("%E3%83%95%E3%82%B4%E3%83%83%E3%83%9A%E6%B4%9E%E7%AA%9F")],43.195083,140.838333,"high",
  "ja.wikipedia フゴッペ洞窟 infobox 43°11′42.3″N 140°50′18.0″E",O,"rurubu&more 80001427 (current hours/fees; seasonal closure Dec–Apr)",k="rock carvings cave",g=["HISTORY","MUSEUM"])
# SOYA
S(2,"SOYA","Cape Noshappu (ノシャップ岬)","Noshappu, Wakkanai, Hokkaido, Japan",
  "Wakkanai's westernmost point, jutting into the Sōya Strait — Ainu for 'where the cape juts out like a jaw', with views of Rishiri and Rebun and famous sunsets.",
  [vh("spot/detail_10277.html"),rr("80001035"),("MAPPLE","https://www.mapple.net/spot/1000645/"),ja("%E9%87%8E%E5%AF%92%E5%B8%83%E5%B2%AC")],45.4495222,141.6451583,"med",
  "ja.wikipedia 稚内灯台 (lighthouse on the cape) 45°26′58.28″N 141°38′42.57″E",O,"visit-hokkaido.jp spot 10277 (current; natural feature)",k="cape sunset",g=["VIEW","NATURE"])
S(3,"SOYA","Noshappu Cold Current Aquarium (ノシャップ寒流水族館)","Cape Noshappu, Wakkanai, Hokkaido, Japan",
  "Japan's northernmost aquarium at Cape Noshappu — about 100 cold-water species incl. the 'phantom fish' itō in a 90-tonne circular tank; joint ticket with the adjacent Wakkanai Youth Science Museum.",
  [vh("spot/detail_10278.html"),rr("80001036"),ja("%E7%A8%9A%E5%86%85%E5%B8%82%E7%AB%8B%E3%83%8E%E3%82%B7%E3%83%A3%E3%83%83%E3%83%97%E5%AF%92%E6%B5%81%E6%B0%B4%E6%97%8F%E9%A4%A8")],45.449333,141.644917,"high",
  "ja.wikipedia 稚内市立ノシャップ寒流水族館 infobox 45°26′57.6″N 141°38′41.7″E",O,"visit-hokkaido.jp spot 10278 + rurubu&more 80001036 (current fees)",k="aquarium",g=["MUSEUM","NATURE"])
emit("W60")
