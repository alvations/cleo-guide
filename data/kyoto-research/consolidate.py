#!/usr/bin/env python3
# Kyoto dataset map — thin wrapper over tools/japan_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from japan_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"HGS","n":"Higashiyama-ku (Gion · Kiyomizu-dera · Sannenzaka · Kennin-ji · Yasaka · Tōfuku-ji)"},
 {"id":"SAKYO","n":"Sakyō-ku (Ginkaku-ji · Philosopher's Path · Nanzen-ji · Okazaki · Demachiyanagi · Shimogamo)"},
 {"id":"CTR","n":"Central — Nakagyō & Shimogyō (Nishiki · Pontochō · Kawaramachi · Karasuma · Nijō Castle · Kyoto Station)"},
 {"id":"KITA","n":"Kita & Kamigyō (Kinkaku-ji · Daitoku-ji · Imperial Palace · Nishijin · Kamigamo)"},
 {"id":"RKSAI","n":"Rakusai — Ukyō & Nishikyō (Arashiyama · Sagano · Ryōan-ji · Katsura · Koke-dera)"},
 {"id":"FSHMI","n":"Fushimi & Minami (Fushimi Inari · Tō-ji · Fushimi sake district · Daigo-ji)"},
 {"id":"RKHKU","n":"Rakuhoku mountains (Ōhara · Kurama · Kibune · Takao · Miyama)"},
 {"id":"UJI","n":"Uji & Nara (Byōdō-in · Uji tea · Tōdai-ji · Kasuga Taisha · Nara Park)"},
 {"id":"KYFU","n":"Kyoto Prefecture & Lake Biwa (Amanohashidate · Ine no Funaya · Kameoka · Ōtsu · Hiei-zan)"},
]
AC = {"HGS":"#D9534F","SAKYO":"#9B5DE5","CTR":"#E8B04B","KITA":"#5B8DEF","RKSAI":"#3D9970","FSHMI":"#E07A5F","RKHKU":"#7D8C38","UJI":"#00A6A6","KYFU":"#B5651D"}
build(D, AREAS, AC)
