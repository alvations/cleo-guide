#!/usr/bin/env python3
# W02 — Sapporo (SPR) food canon. Sources/addresses/status as read from WebSearch results on 2026-10-02 (session 2).
# Restaurant place-pins do not surface via WebSearch here -> lat None (UNVERIFIED, held by the gate for the helper).
from _hk import F, emit
MIB=("MICHELIN_BIB","https://guide.michelin.com/sg/en/article/news-and-views/hokkaido-guide-2017")
T100R=("TABELOG100","https://tabelog.com/matome/28663/")
GLT="https://www.gltjp.com/en/"
GLTF=("GOODLUCKTRIP",GLT+"article/item/20658/")   # Good Luck Trip — [Sapporo Food Guide] by local specialty
SPT_SC=("SAPPOROTRAVEL","https://www.sapporo.travel/en/gourmet/shop/soupcarry/")
CT=("CULTURETRIP","https://theculturetrip.com/asia/japan/sapporo/articles/the-best-restaurants-in-sapporo")
CX=("CATHAYPACIFIC","https://www.cathaypacific.com/cx/en_GB/inspiration/dining/the-best-restaurants-in-sapporo.html")
NAVI=("NAVITIMETRAVEL","https://haveagood-holiday.com/en/articles/227790")

F(1,"SPR",["RAMEN"],"Sapporo miso ramen (three-white-miso blend, Kōchi ginger)","Menya Saimi (麺屋彩未)",
  "5-3-12 Misono 10-jō, Toyohira-ku, Sapporo, Hokkaido 062-0010, Japan",
  "The miso-ramen counter Sapporo queues for — three white misos over a clear pork-bone broth, a dab of grated ginger on the chāshū. Michelin Bib Gourmand (Hokkaido 2017) and Tabelog Ramen Hokkaido 100 (2024).",
  [MIB,T100R,("GOODLUCKTRIP",GLT+"directory/item/13924/")],status="open",ssrc="Tabelog Ramen HOKKAIDO 百名店 2024 selection + reservation listing (autoreserve) current 2025")
F(1,"SPR",["RAMEN"],"Sapporo miso ramen (lard-capped)","Sumire Susukino (すみれ 札幌すすきの店)",
  "Pixis Bldg 2F, Minami 3-jō Nishi 3-9-2, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The Murakami family house (1964) that codified the lard-sealed, scalding Sapporo miso bowl; the late-night Susukino branch pours the Nakanoshima honten broth. Tabelog Ramen Hokkaido 100 2024 & 2025.",
  [("TABELOG100","https://www.gltjp.com/en/directory/item/15390/"),GLTF],status="open",ssrc="Tabelog Ramen HOKKAIDO 百名店 2025 selection (current)")
F(1,"SPR",["RAMEN"],"miso ramen with house-made Hokkaido-wheat noodles","MEN-EIJI Hiragishi Base (麺eiji 平岸base)",
  "Hiragishi 2-jō 11-chōme 1-12, Toyohira-ku, Sapporo, Hokkaido 062-0932, Japan",
  "Additive-free broths and house-made noodles from Hokkaido wheat since 2006 — the gyokai-tonkotsu shōyu and the miso both draw lines. Michelin Bib Gourmand (Hokkaido 2017).",
  [MIB,("GOODLUCKTRIP",GLT+"directory/item/16239/")],status="open",ssrc="Good Luck Trip directory listing (current, 2025)")
F(1,"SPR",["HOKKAIDO"],"jingisukan (dome-grilled mutton, atozuke sauce)","Jingisukan Daruma Honten (だるま本店)",
  "Crystal Bldg 1F, Minami 5-jō Nishi 4, Chuo-ku, Sapporo, Hokkaido 064-0805, Japan",
  "The Susukino jingisukan room since 1954 — a cast-iron dome at every seat, one cut of mutton, sweet-spicy dipping sauce, a queue from 17:30. Cash only.",
  [CT,("GOODLUCKTRIP",GLT+"directory/item/14002/"),GLTF],status="open",ssrc="Good Luck Trip directory (hours 17:00–05:00 daily, current)")
F(1,"SPR",["HOKKAIDO"],"soup curry (two-day pork-bone & dashi broth)","Soup Curry Garaku (スープカレー GARAKU)",
  "Okumura Bldg B1F, Minami 2-jō Nishi 2-6-1, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Numbered tickets and daily lines for a soup curry whose broth borrows udon-shop dashi technique — pork bone and herbs stewed two days, kelp and bonito layered in.",
  [SPT_SC,GLTF],status="open",ssrc="sapporo.travel official soup-curry feature (current)")
F(2,"SPR",["HOKKAIDO"],"soup curry with Hokkaido vegetables and red-rice blend","Soup Curry & Dining Suage+ (すあげ+)",
  "Minami 4-jō Nishi (〒064-0804), Chuo-ku, Sapporo, Hokkaido, Japan — a few minutes from Susukino Station",
  "Locals' favourite Susukino soup curry: skewered roast chicken, stewed pork and a pile of local vegetables, with rice cut with red rice. 11:30–22:00 daily.",
  [CT,SPT_SC],status="open",ssrc="Culture Trip Sapporo restaurants (open 11:30–22:00 daily)")
F(2,"SPR",["SUSHI","MKT"],"kaisendon (uni, ikura, king crab)","Oiso, Nijō Market (二条市場 大磯)",
  "Sapporo Nijō Market, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The classic first stop in 'Sapporo's kitchen' — morning queues for donburi of sea urchin, salmon roe and crab, ¥2,000–3,000.",
  [NAVI,("FUNJAPAN","https://www.fun-japan.jp/en/articles/8994"),GLTF],status="open",ssrc="Have a Good Holiday (NAVITIME) Hokkaido kaisendon feature (current)")
F(2,"SPR",["SUSHI","MKT"],"kaisendon (50+ combinations, all-crab bowl)","Donburi Chaya, Nijō Market (どんぶり茶屋)",
  "Sapporo Nijō Market, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Born in Nijō Market, a specialist with over fifty kaisendon — all-crab, all-shrimp, uni-ikura-crab-scallop-botan-ebi — plus grilled-seafood bowls.",
  [NAVI,CX],status="open",ssrc="Have a Good Holiday (NAVITIME) feature + Cathay Pacific dining guide (current)")
OUT=[
 {"key":"GOODLUCKTRIP","name":"Good Luck Trip (gltjp.com) — inbound Japan travel magazine","url":"https://www.gltjp.com/en/","credible":"Long-running multilingual inbound-travel magazine/web (free paper + site) with staff-written regional food guides; ONE ordinary source, its directory pages also carry award notes (Michelin/Tabelog) that are measured, not counted."},
 {"key":"CULTURETRIP","name":"Culture Trip","url":"https://theculturetrip.com/","credible":"International travel publisher with named-writer city guides; notable travel site (one source)."},
 {"key":"CATHAYPACIFIC","name":"Cathay Pacific — Inspiration / Eat the city","url":"https://www.cathaypacific.com/","credible":"Airline editorial dining guides written by named contributors; corroborating travel editorial (one source)."},
 {"key":"NAVITIMETRAVEL","name":"Have a Good Holiday (NAVITIME Japan)","url":"https://haveagood-holiday.com/","credible":"Editorial travel media of NAVITIME Japan, the national navigation company — staff/writer features on regional food; one source."},
 {"key":"FUNJAPAN","name":"FUN! JAPAN","url":"https://www.fun-japan.jp/","credible":"Multilingual Japan travel/culture media (JTB-affiliated) with writer features; one source."},
 {"key":"TABELOG100","name":"Tabelog 百名店 (Hyakumeiten) annual selections","url":"https://award.tabelog.com/hyakumeiten","credible":"Published annual genre/region selections by Tabelog — ONE source each (the score itself is measurement only)."},
 {"key":"MICHELIN_BIB","name":"Michelin Guide Hokkaido 2017 (special edition) — Bib Gourmand","url":"https://guide.michelin.com/sg/en/article/news-and-views/hokkaido-guide-2017","credible":"Institutional authority (Michelin award) — lone-solo per the gate; 2017 special edition, so status is re-checked against a current source."},
]
emit("W02",OUT)
