#!/usr/bin/env python3
# Osaka dataset map — thin wrapper over tools/japan_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from japan_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"KITA","n":"Kita (Umeda · Nakazakichō · Tenma · Tenjinbashi-suji · Nakanoshima · Fukushima)"},
 {"id":"MINAM","n":"Minami (Namba · Dōtonbori · Shinsaibashi · Amerikamura · Kuromon · Sennichimae · Ura-Namba)"},
 {"id":"CHUO","n":"Chūō & the Castle (Osaka Castle · Honmachi · Kitahama · Tanimachi · Karahori)"},
 {"id":"TNJ","n":"Tennōji & Shinsekai (Tsūtenkaku · Shinsekai · Abeno Harukas · Shitennō-ji · Nishinari)"},
 {"id":"EAST","n":"East Osaka (Tsuruhashi · Ikuno Koreatown · Kyōbashi · Higashi-Ōsaka)"},
 {"id":"BAY","n":"Bay Area (Universal Studios · Kaiyūkan · Tempozan · Taishō Little Okinawa · Sakishima)"},
 {"id":"SOUTH","n":"Southern Osaka (Sumiyoshi Taisha · Sakai kofun & knives · Kishiwada · Kansai Airport)"},
 {"id":"NORTH","n":"Hokusetsu & Kawachi (Minoo · Expo '70 Park · Ikeda Cupnoodles Museum · Takatsuki · Hirakata)"},
 {"id":"KNSAI","n":"Kansai day trips (Kobe · Himeji · Arima Onsen · Kōya-san · Wakayama)"},
]
AC = {"KITA":"#5B8DEF","MINAM":"#D9534F","CHUO":"#E8B04B","TNJ":"#E07A5F","EAST":"#9B5DE5","BAY":"#00A6A6","SOUTH":"#3D9970","NORTH":"#7D8C38","KNSAI":"#D4A017"}
build(D, AREAS, AC)
