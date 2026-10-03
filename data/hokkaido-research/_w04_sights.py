#!/usr/bin/env python3
# W04 — sights: DOTO (Shiretoko · Akan-Mashū · Abashiri · Kushiro) + DONAN extras + SOYA. WebSearch 2026-10-02 (session 2).
from _hk import S, emit
WP="https://en.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"; VH="https://www.visit-hokkaido.jp/en/"
def jg(p): return ("JAPANGUIDE",JG+p)
def wp(p): return ("WIKIPEDIA",WP+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
# ---- DOTO ----
S(1,"DOTO","Shiretoko Five Lakes (知床五湖)","Onnebetsu, Shari, Shari District, Hokkaido, Japan",
  "Five forest lakes under the Shiretoko range inside the UNESCO World Natural Heritage site — an 800 m bear-proof elevated boardwalk plus guided ground trails.",
  [wp("Shiretoko_Goko_Lakes"),jg("e6853.html"),vh("plan/detail_24.html")],44.12556,145.08111,"high","en.wikipedia Shiretoko_Goko_Lakes infobox (44°7′32″N 145°4′52″E) via WebSearch",
  O,"japan-guide.com e6853 (boardwalk open in season)",k="five lakes boardwalk world heritage",g=["UNESCO","NATURE","ICON"])
S(2,"DOTO","Furepe Waterfall (フレペの滝)","Iwaobetsu, Shari, Shari District, Hokkaido, Japan",
  "'The Maiden's Tears' — groundwater seeping straight out of a sea cliff into the Sea of Okhotsk, twenty minutes' walk from the Shiretoko Nature Center.",
  [jg("e6855.html"),wp("Shiretoko_Peninsula")],status=O,ssrc="japan-guide.com e6855 (current)",k="waterfall sea cliff",g=["UNESCO","NATURE","FREE"])
S(2,"DOTO","Oshinkoshin Falls (オシンコシンの滝)","Chashikotsu, Shari, Shari District, Hokkaido, Japan",
  "Twin-stream roadside falls on the way to Utoro, one of Japan's 100 best waterfalls, with a stair up to the mid-fall viewpoint.",
  [jg("e6856.html"),wp("List_of_waterfalls_in_Japan")],status=O,ssrc="japan-guide.com e6856 (current)",k="waterfall",g=["NATURE","FREE"])
S(2,"DOTO","Shiretoko Pass (知床峠)","Shiretoko-tōge, between Utoro (Shari) and Rausu, Hokkaido, Japan",
  "The 738 m road pass across the peninsula, facing Mount Rausu and, across the strait, Kunashiri Island; open roughly May to early November.",
  [jg("e6858.html"),wp("Shiretoko_National_Park")],status=O,ssrc="japan-guide.com e6858 (seasonal road, current)",k="mountain pass view",g=["VIEW","NATURE","FREE"])
S(1,"DOTO","Lake Mashū (摩周湖)","Teshikaga, Kawakami District, Hokkaido, Japan",
  "The Ainu 'Lake of the Gods': a 212 m-deep caldera with no inlet or outlet, famous for 'Mashū blue' clarity — and its fogs.",
  [wp("Lake_Mash%C5%AB"),vh("spot/detail_10052.html"),jg("e6800.html")],43.583,144.517,"med","en.wikipedia Lake_Mashū infobox (43°35′N 144°31′E — lake centre) via WebSearch",
  O,"visit-hokkaido.jp spot 10052 (current)",k="caldera lake mashu blue",g=["ICON","NATURE","VIEW"])
S(1,"DOTO","Lake Akan (阿寒湖)","Akanko Onsen, Akan-chō, Kushiro, Hokkaido, Japan",
  "Crater lake under Me-Akan and O-Akan, home of the spherical marimo algae, with the Akankohan onsen town on its shore.",
  [wp("Lake_Akan"),jg("e6800.html")],43.45167,144.09861,"high","en.wikipedia Lake_Akan infobox (43°27′6″N 144°5′55″E) via WebSearch",
  O,"japan-guide.com e6800 (current)",k="marimo lake",g=["NATURE","ONSEN"])
S(2,"DOTO","Lake Kussharo (屈斜路湖)","Teshikaga, Kawakami District, Hokkaido, Japan",
  "Japan's largest caldera lake — hot sand you dig into at Sunayu, open-air shore baths and winter swans.",
  [wp("Lake_Kussharo"),jg("e6800.html")],43.62750,144.32944,"med","en.wikipedia Lake_Kussharo infobox (43°37′39″N 144°19′46″E — lake centre) via WebSearch",
  O,"japan-guide.com e6800 (current)",k="caldera lake sand bath",g=["NATURE","ONSEN","FREE"])
S(2,"DOTO","Mount Iō — Iōzan (硫黄山 / Atosanupuri)","Kawayu Onsen, Teshikaga, Kawakami District, Hokkaido, Japan",
  "The Ainu 'naked mountain': a bare, yellow-crusted active volcano hissing sulphur steam beside Kawayu Onsen.",
  [wp("Mount_I%C5%8D_(Akan)"),jg("e6800.html")],43.61028,144.43861,"high","en.wikipedia Mount_Iō_(Akan) infobox (43°36′37″N 144°26′19″E) via WebSearch",
  O,"japan-guide.com e6800 (current)",k="sulphur volcano",g=["NATURE","FREE"])
S(1,"DOTO","Abashiri Prison Museum (博物館 網走監獄)","Yobito, Abashiri, Hokkaido, Japan",
  "The Meiji prison that built Hokkaido's roads, rebuilt as an open-air museum — the five-winged radial cell block, court, bathhouse and punishment cells.",
  [wp("Abashiri_Prison"),jg("e6867.html")],44.016583,144.231056,"high","en.wikipedia Abashiri_Prison infobox (44°0′59.7″N 144°13′51.8″E) via WebSearch",
  O,"japan-guide.com e6867 (current)",k="prison museum",g=["MUS","ICON"])
S(1,"DOTO","Kushiro Marsh — Kushiro-shitsugen National Park (釧路湿原)","Hosooka Observatory (細岡展望台), Kushiro-chō, Kushiro District, Hokkaido, Japan",
  "Japan's largest wetland and first Ramsar site (1980) — the stronghold of the red-crowned crane, seen from the Hosooka and marsh observatories.",
  [wp("Kushiro_Shitsugen_National_Park"),jg("e6792.html"),vh("plan/detail_24.html")],status=O,ssrc="visit-hokkaido.jp sample itinerary 24 (current)",k="marsh crane wetland",g=["NATURE","VIEW"])
# ---- DONAN ----
S(2,"DONAN","Kanemori Red Brick Warehouses (金森赤レンガ倉庫)","Suehiro-chō, Hakodate, Hokkaido, Japan",
  "1909 harbour warehouses (founded 1887) turned shops, beer hall and event space in 1988 — Hakodate's waterfront landmark.",
  [wp("Kanemori_Red_Brick_Warehouses"),vh("spot/detail_10036.html")],41.7661,140.7175,"high","en.wikipedia Kanemori_Red_Brick_Warehouses infobox (41°45′58″N 140°43′03″E) via WebSearch",
  O,"visit-hokkaido.jp spot 10036 (~50 shops, current)",k="red brick warehouse bay",g=["MKT","CASTLE","FREE"])
S(1,"DONAN","Ōnuma Quasi-National Park (大沼国定公園)","Ōnuma-chō, Nanae, Kameda District, Hokkaido, Japan",
  "Island-dotted Ōnuma and Konuma ponds under the volcano Hokkaidō-Komagatake — 126 islets linked by bridges, boating and cycling 30 minutes from Hakodate.",
  [wp("%C5%8Cnuma_Quasi-National_Park"),jg("e5356.html"),vh("spot/detail_10099.html")],42.0121,140.671,"med","en.wikipedia Ōnuma_Quasi-National_Park infobox (42°00′44″N 140°40′16″E) via WebSearch",
  O,"japan-guide.com e5356 (current)",k="lake islands volcano",g=["NATURE","VIEW"])
# ---- SOYA ----
S(1,"SOYA","Cape Sōya (宗谷岬)","Sōyamisaki, Wakkanai, Hokkaido, Japan",
  "The northernmost point you can stand on in Japan — the triangular monument, Sakhalin on the horizon on a clear day.",
  [wp("Cape_S%C5%8Dya"),("JAPANGUIDE","http://www.japan-guide.com/tour/e/north/day1.html")],45.52278,141.93639,"high","en.wikipedia Cape_Sōya infobox (45°31′22″N 141°56′11″E) via WebSearch",
  O,"japan-guide.com Rishiri/Rebun & north pages (current)",k="northernmost point",g=["ICON","VIEW","FREE"])
S(1,"SOYA","Rishiri Island & Mount Rishiri (利尻島・利尻山)","Rishiri / Rishirifuji, Rishiri District, Hokkaido, Japan",
  "A dormant 1,721 m volcano rising straight from the sea — 'Rishiri-Fuji' — ringed by a cycling road and kelp-drying beaches; ferry from Wakkanai.",
  [wp("Rishiri_Island"),jg("e6876.html")],45.183,141.250,"med","en.wikipedia Rishiri_Island infobox (45°11′N 141°15′E — island/summit, minute precision) via WebSearch",
  O,"japan-guide.com e6876 (Heart Land Ferry operating)",k="island volcano",g=["NATURE","VIEW","ICON"])
S(1,"SOYA","Rebun Island (礼文島)","Rebun, Rebun District, Hokkaido, Japan",
  "The 'floating island of flowers' — alpine flowers found nowhere else bloom at sea level June–August along the Momoiwa and Cape Sukoton trails.",
  [wp("Rebun_Island"),jg("e6877.html")],45.36861,141.01528,"med","en.wikipedia Rebun_Island infobox (45°22′07″N 141°00′55″E) via WebSearch",
  O,"japan-guide.com e6877 (current)",k="island alpine flowers",g=["NATURE","VIEW"])
emit("W04")
