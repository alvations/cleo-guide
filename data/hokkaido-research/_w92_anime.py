#!/usr/bin/env python3
# W92 — ANIME & pop-culture wave 3 (Hokkaido seichi junrei): Detective Conan 'The Million-dollar Pentagram' (Hakodate,
# 2024), Love Live! Sunshine!! Hakodate AR stamp rally, Golden Kamuy × Shiroi Koibito, Pokémon 'Poké-lids' (Pokéfuta).
# WebSearch 2026-10-03 (s5). New places via _hk S()/F()/emit("W92"); overlays (name + area + new sources + anime only,
# merged by tools/japan_consolidate.py _overlay — never prose/pin) written to SIGHTS_HOKKAIDO_W92O.json below.
# Held/dropped candidates are logged in _note_W92.md.
import json, os, glob
from _hk import S, F, emit
D=os.path.dirname(os.path.abspath(__file__))
JA="https://ja.wikipedia.org/wiki/"
O="open"

# ---- new places ----
FT="https://www.furanotourism.com/jp/spot/spot_D.php?id="
KNK="Kita no Kuni kara (北の国から) — pop culture: Kuramoto Sō's 1981–2002 Fuji TV drama, Japan's best-loved TV saga, filmed in Rokugō"
S(2,"DHOKU","Rokugō no Mori — 'Kita no Kuni kara' location (麓郷の森)","Higashi-Rokugō 1-1, Furano, Hokkaido, Japan",
  "Conifer forest in Furano's Rokugō valley where the Kuroita family's log cabin and Gorō's windmill 'third house' from Kita no Kuni kara still stand as the drama left them.",
  [("WIKIPEDIA_JA",JA+"%E9%BA%93%E9%83%B7%E3%81%AE%E6%A3%AE"),("FURANOTOURISM",FT+"404"),("MAPPLE","https://www.mapple.net/article/42419/")],
  43.312417,142.540528,"high","ja.wikipedia 麓郷の森 infobox (北緯43度18分44.7秒 東経142度32分25.9秒) via WebSearch",
  O,"furanotourism.com spot 404 (admission ¥500, seasonal opening — current)",k="TV-drama location",g=["ANIME"],
  anime=KNK+" — the Kuroita log cabin and Gorō's windmill house are preserved here")
S(2,"DHOKU","Gorō's Stone House — 'Kita no Kuni kara' (五郎の石の家・最初の家)","Rokugō, Furano, Hokkaido, Japan",
  "The stone house Kuroita Gorō builds from field stones in Kita no Kuni kara '89 Kikyō, beside the family's very first house — the drama's emotional centre.",
  [("RURUBU","https://rurubu.jp/andmore/spot/80001183"),("FURANOTOURISM",FT+"401"),("MAPPLE","https://www.mapple.net/article/42419/")],
  None,None,"","",O,"rurubu spot page + furanotourism.com spot 401 (3-site common ticket, current)",k="TV-drama location",g=["ANIME"],
  anime=KNK+" — Gorō's stone house from '89 Kikyō")


OUTLETS=[
 {"key":"DIME","name":"@DIME (dime.jp, Shogakukan)","url":"https://dime.jp/","credible":"Shogakukan's trend/lifestyle magazine — editorial survey coverage; one ordinary source"},
 {"key":"DENFAMI","name":"Denfaminicogamer (news.denfaminicogamer.jp)","url":"https://news.denfaminicogamer.jp/","credible":"Established Japanese games/anime news outlet with named editorial staff; one ordinary source"},
 {"key":"SORANEWS24","name":"SoraNews24","url":"https://soranews24.com/","credible":"Major English-language Japan news/feature site (Rocket News 24 group) with staff-reported location visits; one ordinary source"},
 {"key":"FURANOTOURISM","name":"Furano Tourism Association (furanotourism.com)","url":"https://www.furanotourism.com/","credible":"Official tourism association of Furano — city tourism body of record (one source)"},
]
emit("W92", OUTLETS)

# ---- overlays onto EXISTING places ----
CONAN="Detective Conan: The Million-dollar Pentagram (2024 film, set in Hakodate)"
OV=[
 {"t":1,"a":"DONAN","n":"Goryōkaku (五稜郭)","address":"","w":"",
  "anime":CONAN+" — the star fort is the key to the film's riddle; ranked No.1 pilgrimage spot in post-release surveys",
  "sources":[["MYNAVI","https://news.mynavi.jp/article/20240422-2931683/"],["DIME","https://dime.jp/genre/1959909/"],
             ["HOKKAIDOSHIMBUN","https://www.hokkaido-np.co.jp/article/1160689/"]]},
 {"t":1,"a":"DONAN","n":"Mount Hakodate (函館山)","address":"","w":"",
  "anime":CONAN+" — the summit observatory is where Heiji tries to confess to Kazuha · Love Live! Sunshine!! S2 eps 8–9 night-view scene",
  "sources":[["MYNAVI","https://news.mynavi.jp/article/20240422-2931683/"],["DIME","https://dime.jp/genre/1959909/"],
             ["JALONTRIP","https://ontrip.jal.co.jp/hakodate_anime"]]},
 {"t":1,"a":"DONAN","n":"Hakodate Morning Market (函館朝市)","address":"","w":"",
  "anime":CONAN+" — No.4 in the film's pilgrimage-spot ranking",
  "sources":[["DIME","https://dime.jp/genre/1959909/"]]},
 {"t":2,"a":"DONAN","n":"Kanemori Red Brick Warehouses (金森赤レンガ倉庫)","address":"","w":"",
  "anime":CONAN+" — No.5 in the film's pilgrimage-spot ranking",
  "sources":[["DIME","https://dime.jp/genre/1959909/"]]},
 {"t":2,"a":"DONAN","n":"Lucky Pierrot Bay Area Honten (ラッキーピエロ ベイエリア本店)","address":"","w":"",
  "anime":"Love Live! Sunshine!! — appears in the S2 Hakodate arc; a point on the official Aqours × Saint Snow AR digital stamp rally (11 Hakodate spots)",
  "sources":[["TRAVELWATCH","https://travel.watch.impress.co.jp/docs/news/1286441.html"],["JALONTRIP","https://ontrip.jal.co.jp/hakodate_anime"]]},
 {"t":2,"a":"SPR","n":"Shiroi Koibito Park (白い恋人パーク)","address":"","w":"",
  "anime":"Golden Kamuy — ISHIYA's long-running Golden Kamuy × Shiroi Koibito collab tins (6th edition, Ogata, March 2026) are sold at the park's Shop Piccadilly",
  "sources":[["DENFAMI","https://news.denfaminicogamer.jp/news/260302i"],["FAMITSU","https://www.famitsu.com/article/202503/36086"],
             ["ANIMEANIME","https://animeanime.jp/article/2025/03/10/89768.html"]]},
 {"t":2,"a":"SPR","n":"Jōzankei Onsen (定山渓温泉)","address":"","w":"",
  "anime":"Pokémon — Sapporo's official 'Poké-lid' (Pokéfuta) manhole with Vulpix & Slaking (Hokkaido's 'I Love Hokkaido' Pokémon) sits at the Jōzankei Tourist Association",
  "sources":[["OFFICIAL","https://www.city.sapporo.jp/keizai/kanko/jozankei-pokemon-manhole.html"],
             ["OFFICIAL","https://www.pref.hokkaido.lg.jp/ss/ckk/pokemon-manhole.html"]]},

 {"t":1,"a":"SPR","n":"Ōdōri Park (大通公園)","address":"","w":"",
  "anime":"Hatsune Miku / Snow Miku — the Snow Miku snow statue has stood at the Sapporo Snow Festival's Ōdōri 11-chōme site for 17 years (2026: 'Sweet Snow Ver.' plus Oshi no Ko & Medalist statues, KADOKAWA)",
  "sources":[["ANIMEANIME","https://animeanime.jp/release/prtimes/20260128/267860.html"],["MYNAVI","https://news.mynavi.jp/article/20260207-4086468/"]]},
 {"t":1,"a":"SPR","n":"Sapporo Beer Museum (サッポロビール博物館)","address":"","w":"",
  "anime":"Golden Kamuy — the museum displays a signed shikishi donated by author Noda Satoru; the 'Sapporo Beer Factory' arc (2025 films) is set at the Kaitakushi brewery",
  "sources":[["WARAKU","https://intojapanwaraku.com/rock/gourmet-rock/203121/"]]},
 {"t":2,"a":"OTARU","n":"Otaru City General Museum (小樽市総合博物館)","address":"","w":"",
  "anime":"Golden Kamuy — held the special exhibition 'Otaru inside Golden Kamuy' (Jul–Sep 2016: the real Otaru behind the manga's art, plus Ainu tools)",
  "sources":[["OFFICIAL","https://www.city.otaru.lg.jp/docs/2021051200025/file_contents/event_201607.pdf"],
             ["OFFICIAL","https://www.city.otaru.lg.jp/docs/2021051200025/file_contents/event_201609.pdf"]]},
 {"t":1,"a":"OTARU","n":"Otaru Canal (小樽運河)","address":"","w":"",
  "anime":"Golden Kamuy — Otaru is Lt. Tsurumi's 7th Division base and near Asirpa's kotan; the canal recurs throughout the series",
  "sources":[["SORANEWS24","https://soranews24.com/2024/05/18/we-check-out-some-locales-in-otaru-city-that-inspired-scenes-in-the-hit-anime-golden-kamuy/amp/"],
             ["FUNJAPAN","https://www.fun-japan.jp/jp/articles/14606"]]},
 {"t":1,"a":"DONAN","n":"Goryōkaku Tower (五稜郭タワー)","address":"","w":"",
  "anime":CONAN+" — No.3 in the film's pilgrimage-spot ranking",
  "sources":[["DIME","https://dime.jp/genre/1959909/"],["MAPPLE","https://www.mapple.net/original/470408/"]]},
 {"t":2,"a":"DONAN","n":"Hachimanzaka Slope (八幡坂)","address":"","w":"",
  "anime":CONAN+" — the slope where Conan is caught by a motorbike mid-acrobatics",
  "sources":[["MAPPLE","https://www.mapple.net/original/470408/"],["MYNAVI","https://news.mynavi.jp/article/20240422-2931683/"]]},

]
names={l.rstrip("\n").split("\t")[-1].strip() for l in open(os.path.join(D,"_hk_existing_names.txt"),encoding="utf-8") if "\t" in l}
for o in OV: assert o["n"] in names, o["n"]
OUT="SIGHTS_HOKKAIDO_W92O.json"
# the consolidator walks files in sorted order and overlays onto the FIRST record seen — make sure each original sorts first
files=sorted(os.path.basename(p) for p in glob.glob(os.path.join(D,"*.json")))
for o in OV:
    first=None
    for f in files:
        if f.startswith(("_","out_","sr_","geo_","CREATORS","SOURCES_")) or "dataset" in f or f==OUT: continue
        if ('"n": "%s"'%o["n"]) in open(os.path.join(D,f),encoding="utf-8").read(): first=f; break
    assert first and first<OUT, (o["n"], first)
json.dump({"sources":[],"sights":OV},open(os.path.join(D,OUT),"w"),indent=1,ensure_ascii=False)
print("W92 overlay:",len(OV))
