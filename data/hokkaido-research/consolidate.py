#!/usr/bin/env python3
# Hokkaido dataset map — thin wrapper over tools/japan_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from japan_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"SPR","n":"Sapporo (Ōdōri · Susukino · Nijō Market · Maruyama · Moiwa · Jōzankei)"},
 {"id":"OTARU","n":"Otaru & Shakotan (canal · Sushi-ya Dōri · Yoichi Nikka · Shakotan uni)"},
 {"id":"NSK","n":"Niseko & Yōtei (Niseko · Kutchan · Rusutsu · Makkari · Kyōgoku)"},
 {"id":"DONAN","n":"Hakodate & Dōnan (Morning Market · Goryōkaku · Mt Hakodate · Motomachi · Ōnuma · Matsumae)"},
 {"id":"IBURI","n":"Shikotsu-Tōya & Iburi (Noboribetsu Jigokudani · Lake Tōya · Upopoy · Shiraoi · Tomakomai)"},
 {"id":"DHOKU","n":"Dōhoku — Central Hokkaido (Asahikawa · Biei · Furano · Daisetsuzan · Sōunkyō)"},
 {"id":"TKC","n":"Tokachi (Obihiro · Tokachi Plain · Nakasatsunai · Ikeda)"},
 {"id":"DOTO","n":"Dōtō — Eastern Hokkaido (Kushiro · Akan · Mashū · Shiretoko · Abashiri · Nemuro)"},
 {"id":"SOYA","n":"Far North (Wakkanai · Cape Sōya · Rishiri · Rebun)"},
]
AC = {"SPR":"#D9534F","OTARU":"#5B8DEF","NSK":"#9B5DE5","DONAN":"#E07A5F","IBURI":"#00A6A6","DHOKU":"#3D9970","TKC":"#E8B04B","DOTO":"#7D8C38","SOYA":"#6A8CAF"}
build(D, AREAS, AC)
