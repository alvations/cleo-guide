#!/usr/bin/env python3
# Tokyo dataset map — thin wrapper over tools/japan_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from japan_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"CYD","n":"Chiyoda-ku (Imperial Palace · Marunouchi · Akihabara · Kanda · Jimbōchō)"},
 {"id":"CHUO","n":"Chūō-ku (Ginza · Nihonbashi · Tsukiji · Tsukishima · Ningyōchō)"},
 {"id":"MNT","n":"Minato-ku (Roppongi · Azabu-Jūban · Akasaka · Shimbashi · Shiba · Odaiba)"},
 {"id":"SJK","n":"Shinjuku-ku (Kabukichō · Golden Gai · Omoide Yokochō · Shinjuku Gyoen · Kagurazaka · Shin-Ōkubo)"},
 {"id":"SBY","n":"Shibuya-ku (Shibuya · Harajuku · Omotesandō · Ebisu · Yoyogi · Daikanyama)"},
 {"id":"TAITO","n":"Taitō-ku (Asakusa · Ueno · Yanaka · Kappabashi · Okachimachi)"},
 {"id":"SMKT","n":"Sumida-ku & Kōtō-ku (Skytree · Ryōgoku · Kiyosumi-Shirakawa · Monzen-Nakachō · Toyosu)"},
 {"id":"JONAN","n":"Jōnan — Shinagawa · Meguro · Ōta (Nakameguro · Togoshi-Ginza · Kamata · Haneda)"},
 {"id":"JOSAI","n":"Jōsai — Setagaya · Nakano · Suginami (Shimokitazawa · Sangenjaya · Gōtokuji · Nakano Broadway · Kōenji · Ogikubo)"},
 {"id":"JHOKU","n":"Jōhoku — Toshima · Bunkyō · Kita · Arakawa · Itabashi · Nerima (Ikebukuro · Sugamo · Nezu · Akabane · Nippori)"},
 {"id":"JOTO","n":"Jōtō — Katsushika · Edogawa · Adachi (Shibamata · Kameari · Kita-Senju · Kasai)"},
 {"id":"TAMA","n":"Tama area (Kichijōji · Mitaka & Ghibli · Takao-san · Okutama · Hachiōji · Chōfu)"},
 {"id":"KANTO","n":"Kantō day trips (Yokohama · Kamakura · Hakone · Nikkō · Kawagoe · Fuji Five Lakes)"},
]
AC = {"CYD":"#E8B04B","CHUO":"#D9534F","MNT":"#5B8DEF","SJK":"#C05780","SBY":"#9B5DE5","TAITO":"#E07A5F","SMKT":"#00A6A6","JONAN":"#3D9970","JOSAI":"#7D8C38","JHOKU":"#B5651D","JOTO":"#6A8CAF","TAMA":"#A6588C","KANTO":"#D4A017"}
build(D, AREAS, AC)
