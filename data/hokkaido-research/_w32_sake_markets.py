#!/usr/bin/env python3
# W32 — drink & market canon with Wikipedia pins: Asahikawa/Mashike sake breweries, Otaru Sankaku Market,
# Obihiro Kita no Yatai, Hakodate Daimon Yokochō. WebSearch 2026-10-02 (session 3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; VH="https://www.visit-hokkaido.jp/spot/"
O="open"
F(2,"DHOKU",["SAKE"],"Otokoyama junmai sake — free tasting at the brewery","Otokoyama Sake Park, Asahikawa (男山 OTOKOYAMA SAKE PARK)",
  "Nagayama 2-jō 7-1-33, Asahikawa, Hokkaido, Japan",
  "The 350-year-old 'Otokoyama' label's Asahikawa brewery and museum, reopened in 2024 as a sake park — Edo-era records, winter brewing on view, free tastings.",
  [("HOKKAIDOTOURISM",VH+"detail_10118.html"),("RURUBU",RU+"spot/80000726"),("WIKIPEDIA_JA",JA+"%E7%94%B7%E5%B1%B1_(%E9%85%92%E9%80%A0%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC)")],
  43.79583,142.40917,"high","ja.wikipedia 男山 (酒造メーカー) infobox (北緯43度47分45秒 東経142度24分33秒) via WebSearch",O,"rurubu&more spot page (2024 renewal noted)")
F(2,"DHOKU",["SAKE"],"'Kokushi Musō' sake — brewery shop with free tasting","Takasago Shuzō, Asahikawa (高砂酒造)",
  "Miyashita-dōri 17-chōme, Asahikawa, Hokkaido, Japan",
  "Asahikawa's flagship brewery since 1899, maker of 'Kokushi Musō' — a direct shop with free tastings and a small museum; winter tours by reservation.",
  [("HOKKAIDOTOURISM",VH+"detail_10120.html"),("RURUBU",RU+"spot/80000739"),("WIKIPEDIA_JA",JA+"%E9%AB%98%E7%A0%82%E9%85%92%E9%80%A0_(%E5%8C%97%E6%B5%B7%E9%81%93)")],
  43.76083,142.37278,"high","ja.wikipedia 高砂酒造 (北海道) infobox (北緯43度45分39秒 東経142度22分22秒) via WebSearch",O,"visit-hokkaido.jp spot 10120 (current)")
F(2,"DHOKU",["SAKE"],"Kunimare sake incl. brewery-only limited bottlings (3 free tastings)","Kunimare Shuzō, Mashike (國稀酒造)",
  "Inaba-chō 1-17, Mashike, Mashike District, Hokkaido 077-0204, Japan",
  "Japan's northernmost sake brewery, 140+ years in the herring port of Mashike — tour the stone kura, then taste three brewery-only sakes free.",
  [("HOKKAIDOTOURISM",VH+"detail_12196.html"),("WIKIPEDIA_JA",JA+"%E5%9C%8B%E7%A8%80%E9%85%92%E9%80%A0")],
  43.857861,141.523139,"high","ja.wikipedia 國稀酒造 infobox (北緯43度51分28.3秒 東経141度31分23.3秒) via WebSearch",O,"visit-hokkaido.jp spot 12196 (hours current)")
F(2,"OTARU",["MKT","SUSHI"],"fishmonger-run kaisen-don and crab at the station market","Otaru Sankaku Market (小樽三角市場)",
  "Beside JR Otaru Station, Otaru, Hokkaido, Japan",
  "The triangular fish market beside Otaru Station — crab, scallops and sea urchin over the counter, and fishmonger-run donburi canteens like Takinami Shokudō.",
  [("WIKIPEDIA_JA",JA+"%E5%B0%8F%E6%A8%BD%E4%B8%89%E8%A7%92%E5%B8%82%E5%A0%B4"),("OTARUTOURISM","https://otaru.gr.jp/shop/takinamisyokudou")],
  43.199056,140.993917,"high","ja.wikipedia 小樽三角市場 infobox (北緯43度11分56.6秒 東経140度59分38.1秒) via WebSearch",O,"otaru.gr.jp shop listing inside the market (current)")
F(1,"TKC",["IZAKAYA","MKT"],"Tokachi-produce yatai food — a 20-stall alley","Kita no Yatai, Obihiro (北の屋台)",
  "North-exit district of JR Obihiro Station, Obihiro, Hokkaido, Japan",
  "The 50 m alley of twenty tiny stalls that started Japan's yatai-village revival — Tokachi beef, vegetables and cheese, elbow to elbow.",
  [("RURUBU",RU+"spot/80000884"),("MAPPLE",MP+"spot/1010822/"),("RURUBU",RU+"article/10410")],status=O,ssrc="rurubu&more spot page (current)")
F(1,"DONAN",["IZAKAYA","MKT"],"Hakodate bar-hopping: shio ramen, yakitori, jingisukan, seafood","Hakodate Hikari no Yatai Daimon Yokochō (函館ひかりの屋台 大門横丁)",
  "Daimon district near JR Hakodate Station, Hakodate, Hokkaido, Japan",
  "Twenty-six tiny bars and kitchens on 800 m² in the Daimon nightlife quarter by Hakodate Station — the city's hashigo-zake circuit.",
  [("RURUBU",RU+"spot/80000404"),("RURUBU",RU+"article/22407"),("MAPPLE",MP+"article/52366/")],status=O,ssrc="rurubu&more spot page (current)")
emit("W32")
