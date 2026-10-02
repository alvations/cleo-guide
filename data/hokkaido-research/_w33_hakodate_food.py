#!/usr/bin/env python3
# W33 — DONAN food canon: Hakodate shio ramen b2 + Morning Market (Donburi Yokochō) kaisen-don. WebSearch 2026-10-02 (s3).
# Attribution caveat: the shio-ramen result set merged MAPPLE article 53509 (9 shops) + rurubu article 10390; both
# outlets are cited per shop as surfaced together — re-verify per-outlet attribution at refresh.
# HAKODATEASAICHI = the Hakodate Morning Market cooperative's own member directory (market body, not the shop's
# own site) — counted as one corroborating local source (AUDIT decision, session 3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; AS="https://www.hakodate-asaichi.com/shop/"
O="open"
R=[("MAPPLE",MP+"article/53509/"),("RURUBU",RU+"article/10390")]
F(1,"DONAN",["RAMEN"],"Hakodate shio ramen (since 1947, house-made noodles)","Jiyōken (滋養軒)",
  "Matsukaze-chō 7-12, Hakodate, Hokkaido, Japan",
  "A 1947 shio-ramen counter still cutting noodles daily on its original machine from flour, kansui, salt and egg — closes when the soup runs out.",
  R,status=O,ssrc="MAPPLE shio-ramen feature (hours/prices listed, current)")
F(2,"DONAN",["RAMEN"],"mellow rock-salt shio ramen with pork-belly chashu","Hakodate Men'ya Yūmin (函館麺屋ゆうみん)",
  "Wakamatsu-chō 19-1, Hakodate, Hokkaido, Japan",
  "An ~80-year-old Chinese kitchen by the station whose shio ramen is rounded out with rock salt and aromatic oil.",
  R,status=O,ssrc="MAPPLE shio-ramen feature (hours listed, current)")
F(2,"DONAN",["RAMEN"],"clear shio ramen (90% pork bone, 10% chicken)","Hōran (鳳蘭)",
  "Matsukaze-chō 5-13, Hakodate, Hokkaido, Japan",
  "A Daimon-district veteran whose pale, clear shio broth is nine parts pork bone to one part chicken.",
  R,status=O,ssrc="MAPPLE shio-ramen feature (hours listed, current)")
F(2,"DONAN",["RAMEN"],"Hakodate shio ramen, open late","Hakodate Shio Ramen Shinano (はこだて塩らーめん しなの)",
  "Wakamatsu-chō 20-10, Hakodate, Hokkaido, Japan",
  "Station-side shio ramen served until midnight — the late-night bowl after Daimon Yokochō.",
  R,status=O,ssrc="MAPPLE shio-ramen feature (hours listed, current)")
F(2,"DONAN",["SUSHI","HOKKAIDO"],"kaisen-don of uni, ikura and scallop at the Morning Market","Asaichi no Ajidokoro Chamu (朝市の味処 茶夢)",
  "Donburi Yokochō Ichiba, Wakamatsu-chō 9-15, Hakodate, Hokkaido, Japan",
  "A Donburi Yokochō counter piling sea urchin, salmon roe and scallop over rice from 7am.",
  [("RURUBU",RU+"spot/80000428"),("HAKODATEASAICHI",AS+"chamu/")],status=O,ssrc="hakodate-asaichi.com member listing (hours current)")
F(2,"DONAN",["SUSHI","HOKKAIDO"],"Morning Market kaisen-don from 6am","Ikkatei Tabiji (一花亭 たびじ)",
  "Donburi Yokochō Ichiba, Wakamatsu-chō 9-15, Hakodate, Hokkaido, Japan",
  "The early opener of Donburi Yokochō — seafood bowls from 6am, open every day.",
  [("RURUBU",RU+"spot/80000497"),("HAKODATEASAICHI",AS+"tabiji/")],status=O,ssrc="hakodate-asaichi.com member listing (hours current)")
F(2,"DONAN",["SUSHI","HOKKAIDO"],"build-your-own kaisen-don","Asaichi Akebono Shokudō (朝市あけぼの食堂)",
  "Donburi Yokochō Ichiba, Wakamatsu-chō 9-15, Hakodate, Hokkaido, Japan",
  "A Donburi Yokochō shokudō of seafood bowls and grilled fish for the market's breakfast crowd.",
  [("RURUBU",RU+"spot/80000427"),("HAKODATEASAICHI",AS+"akebono/")],status=O,ssrc="hakodate-asaichi.com member listing (hours current)")
emit("W33")
