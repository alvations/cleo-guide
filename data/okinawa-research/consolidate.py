#!/usr/bin/env python3
# Okinawa dataset map — thin wrapper over tools/japan_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from japan_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"NAHA","n":"Naha (Kokusai-dōri · Makishi Public Market · Tsuboya · Shuri Castle · Naminoue · Sakaemachi)"},
 {"id":"CHUBU","n":"Chūbu — Central Okinawa (Chatan & American Village · Okinawa City/Koza · Ginowan · Urasoe · Yomitan)"},
 {"id":"NANBU","n":"Nanbu — Southern Okinawa (Itoman · Nanjō & Sēfa-utaki · Peace Memorial Park · Tomigusuku)"},
 {"id":"HOKBU","n":"Hokubu — Northern Okinawa (Nago · Motobu & Churaumi · Kouri Island · Onna · Yanbaru)"},
 {"id":"KRM","n":"Kerama & nearby islands (Tokashiki · Zamami · Aka · Kume-jima · Iheya)"},
 {"id":"MYK","n":"Miyako Islands (Miyako-jima · Irabu · Ikema · Kurima)"},
 {"id":"YAEYA","n":"Yaeyama Islands (Ishigaki · Iriomote · Taketomi · Hateruma · Yonaguni)"},
]
AC = {"NAHA":"#D9534F","CHUBU":"#5B8DEF","NANBU":"#3D9970","HOKBU":"#00A6A6","KRM":"#9B5DE5","MYK":"#E8B04B","YAEYA":"#E07A5F"}
build(D, AREAS, AC)
