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
#NEW#

emit("W92")

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
  "sources":[["IMPRESSTRAVEL","https://travel.watch.impress.co.jp/docs/news/1286441.html"],["JALONTRIP","https://ontrip.jal.co.jp/hakodate_anime"]]},
 {"t":2,"a":"SPR","n":"Shiroi Koibito Park (白い恋人パーク)","address":"","w":"",
  "anime":"Golden Kamuy — ISHIYA's long-running Golden Kamuy × Shiroi Koibito collab tins (6th edition, Ogata, March 2026) are sold at the park's Shop Piccadilly",
  "sources":[["DENFAMI","https://news.denfaminicogamer.jp/news/260302i"],["FAMITSU","https://www.famitsu.com/article/202503/36086"],
             ["ANIMEANIME","https://animeanime.jp/article/2025/03/10/89768.html"]]},
 {"t":2,"a":"SPR","n":"Jōzankei Onsen (定山渓温泉)","address":"","w":"",
  "anime":"Pokémon — Sapporo's official 'Poké-lid' (Pokéfuta) manhole with Vulpix & Slaking (Hokkaido's 'I Love Hokkaido' Pokémon) sits at the Jōzankei Tourist Association",
  "sources":[["OFFICIAL","https://www.city.sapporo.jp/keizai/kanko/jozankei-pokemon-manhole.html"],
             ["OFFICIAL","https://www.pref.hokkaido.lg.jp/ss/ckk/pokemon-manhole.html"]]},
#OV#
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
