#!/usr/bin/env python3
# W81 — ANIME & pop-culture wave 2 (Hokkaido): Golden Kamuy (Kabato prison museum, Nibutani/Biratori) + Love Live!
# Sunshine!! (Saint Snow's family café). WebSearch 2026-10-02 (s4). Overlays onto existing places are in
# SIGHTS_HOKKAIDO_W81O.json (written below). Held/dropped candidates are logged in _note_W81.md.
import json, os
from _hk import S, F, emit
D=os.path.dirname(os.path.abspath(__file__))
JA="https://ja.wikipedia.org/wiki/"
O="open"
S(2,"SPR","Tsukigata Kabato Museum — former Kabato Prison (月形樺戸博物館)","Tsukigata, Kabato-gun, Hokkaido, Japan",
  "Museum in the 1886 headquarters of Kabato Shūjikan, the Meiji convict prison whose inmates cleared the Ishikari valley — irons, cells and the real men behind several Golden Kamuy convicts.",
  [("WIKIPEDIA_JA",JA+"%E6%9C%88%E5%BD%A2%E6%A8%BA%E6%88%B8%E5%8D%9A%E7%89%A9%E9%A4%A8"),("TABIMAG","https://tabi-mag.jp/goldenkamuy-kabato"),
   ("HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1337266/")],
  43.339111,141.668972,"high","ja.wikipedia 月形樺戸博物館 infobox (北緯43度20分20.8秒 東経141度40分8.3秒) via WebSearch",
  O,"hokkaido-np.co.jp 1337266 (museum passing 400k visitors, current)",k="prison history museum",g=["ANIME","MUS"],
  anime="Golden Kamuy — Kabato prison held the real models of 'Pirate' Bōtarō, forger Kumagishi Chōan and 'Lightning' Sakamoto; a fan pilgrimage stop")
S(2,"IBURI","Nibutani Ainu Culture Museum, Biratori (平取町立二風谷アイヌ文化博物館)","Nibutani, Biratori-chō, Saru-gun, Hokkaido, Japan",
  "Town museum in Nibutani, the Saru River heartland of Ainu culture — nationally designated Ainu tools, robes and boats, plus recordings of yukar epics.",
  [("WIKIPEDIA_JA",JA+"%E4%BA%8C%E9%A2%A8%E8%B0%B7%E3%82%A2%E3%82%A4%E3%83%8C%E6%96%87%E5%8C%96%E5%8D%9A%E7%89%A9%E9%A4%A8"),
   ("RURUBU","https://rurubu.jp/andmore/spot/80001743"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_10437.html"),
   ("OFFICIAL","https://origin.digitalpr.jp/pdf.php?r=118315")],
  42.637000,142.156972,"high","ja.wikipedia 二風谷アイヌ文化博物館 infobox (北緯42度38分13.2秒 東経142度9分25.1秒) via WebSearch",
  O,"rurubu + visit-hokkaido spot pages (current)",k="Ainu culture museum",g=["ANIME","MUS"],
  anime="Golden Kamuy — Nibutani hosted the official TV-anime × Biratori riddle tour (Oct–Nov 2025); Biratori is a 'Golden Kamuy × Hokkaido' campaign area")
F(3,"DONAN",["CAFE","SWEET"],"self-grilled dango set; zenzai & monaka set","Sabō Kikuizumi, Motomachi (茶房 菊泉)",
  "Motomachi 14-5, Hakodate, Hokkaido, Japan",
  "Wagashi café in a Taishō-era sake merchant's villa — grill your own dango at the table — and the family home of Saint Snow's Kazuno sisters in Love Live! Sunshine!!, with collab goods on sale.",
  [("RURUBU","https://rurubu.jp/andmore/spot/80000431"),("MAPPLE","https://www.mapple.net/spot/1013113/"),
   ("MAINICHI","https://mainichi.alljapantours.com/japan/anime/anime-tours/hakodate-hokkaido"),
   ("HOKKAIDOTOURISM","https://visit-hokkaido.jp/stamprally/en/spot/42")],
  None,None,"","",O,"rurubu & mapple spot pages (hours 10:00–17:00, current)",
  anime="Love Live! Sunshine!! — the Kazuno sisters' (Saint Snow) family home in S2 eps 8–9; a stop on the HOKKAIDO LOVE! location stamp rally")
emit("W81")

OV=[
 {"t":1,"a":"SPR","n":"Historical Village of Hokkaido (北海道開拓の村)","address":"","w":"",
  "anime":"Golden Kamuy — Noda Satoru's building reference; filming location of the 2024 live-action film (Sugimoto's horse-sleigh drag on the main street)",
  "sources":[["EIGA","https://eiga.com/news/20240201/10/"],["MYNAVI","https://news.mynavi.jp/article/20240131-2874246/"],
             ["ANIMEANIME","https://animeanime.jp/article/2024/02/01/82614.html"],["TRAVELJP","https://www.travel.co.jp/guide/matome/7456/"]]},
 {"t":1,"a":"DONAN","n":"Hakodate Magistrate's Office (箱館奉行所)","address":"","w":"",
  "anime":"Golden Kamuy — Hijikata Toshizō photo panel and two character goshuin-style castle stamps in the 2026 'Golden Kamuy — Hakodate Dyed in Gold' collaboration",
  "sources":[["HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1282302/"],["HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/event/77546/"],
             ["OFFICIAL","https://www.city.hakodate.hokkaido.jp/docs/2026030300055/file_contents/0323-01.pdf"]]},
 {"t":1,"a":"DONAN","n":"Goryōkaku Tower (五稜郭タワー)","address":"","w":"",
  "anime":"Golden Kamuy (2026 Hakodate collab: announcements by Hijikata's voice actor Nakata Jōji) · Love Live! Sunshine!! S2 ep 8 glass-floor scene",
  "sources":[["HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1282302/"],["JALONTRIP","https://ontrip.jal.co.jp/hakodate_anime"]]},
 {"t":2,"a":"DONAN","n":"Hachimanzaka Slope (八幡坂)","address":"","w":"",
  "anime":"Love Live! Sunshine!! — Aqours walk Hachimanzaka in S2 eps 8–9 (Hakodate arc)",
  "sources":[["JALONTRIP","https://ontrip.jal.co.jp/hakodate_anime"],["TORETABI","https://www.toretabi.jp/travel_info/entry-4106.html"]]},
 {"t":2,"a":"DONAN","n":"Kanemori Red Brick Warehouses (金森赤レンガ倉庫)","address":"","w":"",
  "anime":"Love Live! Sunshine!! — Hakodate pilgrimage stop from the S2 Hakodate arc",
  "sources":[["JALONTRIP","https://ontrip.jal.co.jp/hakodate_anime"]]},
 {"t":2,"a":"OTARU","n":"Former Aoyama Villa — Otaru Kihinkan (小樽貴賓館 旧青山別邸)","address":"","w":"",
  "anime":"Golden Kamuy — model for the herring-fishing boss's mansion in the Otaru arc",
  "sources":[["TRAVELJP","https://www.travel.co.jp/guide/matome/7456/"]]},
 {"t":2,"a":"SPR","n":"Sapporo Factory (サッポロファクトリー)","address":"","w":"",
  "anime":"Golden Kamuy — stands on the site of the Meiji Kaitakushi brewery, the setting of the 'Sapporo Beer Factory' arc (2025 theatrical release)",
  "sources":[["WARAKU","https://intojapanwaraku.com/rock/gourmet-rock/203121/"]]},
 {"t":1,"a":"TKC","n":"Banei Tokachi — Obihiro Racecourse (ばんえい十勝・帯広競馬場)","address":"","w":"",
  "anime":"Silver Spoon (Gin no Saji) — Arakawa Hiromu's Tokachi farm-school manga features ban'ei racing; 'Silver Spoon Day' race collabs · Uma Musume collab 2022",
  "sources":[["OFFICIAL","https://www.oddspark.com/pickup/2022/10/presentssilver-spoonday.html"],["FAMITSU","https://www.famitsu.com/news/202208/26273547.html"]]},
]
names={l.split("\t",1)[1].strip() for l in open(os.path.join(D,"_hk_existing_names.txt"),encoding="utf-8") if "\t" in l}
for o in OV: assert o["n"] in names, o["n"]
json.dump({"sources":[],"sights":OV},open(os.path.join(D,"SIGHTS_HOKKAIDO_W81O.json"),"w"),indent=1,ensure_ascii=False)
print("W81 overlay:",len(OV))
