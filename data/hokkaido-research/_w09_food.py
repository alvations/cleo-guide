#!/usr/bin/env python3
# W09 — food canon: Otaru sushi, Sapporo soup curry/jingisukan, Kushiro robata & kattedon. WebSearch 2026-10-02 (s2).
# Domain-restricted queries to Japanese guidebook editorial (rurubu = JTB Publishing, MAPPLE = Shobunsha) + the
# Otaru Tourism Association (otaru.gr.jp) return named shops with addresses/hours.
from _hk import S, F, emit
O="open"
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; OT="https://otaru.gr.jp/"
F(1,"OTARU",["SUSHI"],"Otaru nigiri (Shakotan uni, local shellfish)","Otaru Masazushi Honten (おたる政寿司 本店)",
  "1-1-1 Hanazono, Otaru, Hokkaido 047-0024, Japan (Sushiya-dōri)",
  "Founded 1938 on Otaru's Sushiya-dōri — the old guard of the city's sushi, as loved by locals as by visitors. 11:00–15:00, 17:00–21:00.",
  [("OTARUTOURISM",OT+"shop/masazushi_honten"),("RURUBU",RU+"spot/80000693"),("MAPPLE",MP+"region/a0102010400_g03050300/spot/")],
  status=O,ssrc="otaru.gr.jp shop page (hours listed, current)")
S(2,"OTARU","Sushiya-dōri — Otaru Sushi Street (寿司屋通り)","Hanazono 1-chōme – Ironai, Otaru, Hokkaido, Japan",
  "From Otaru Station toward Ironai: five or six big sushi houses and nearly twenty around them — Otaru has over a hundred places serving sushi.",
  [("MAPPLE",MP+"spot/1002431/"),("OTARUTOURISM",OT+"project/otarujishin-202302sushi")],status=O,ssrc="otaru.gr.jp 'Otaru Jishin' Feb 2023 sushi-street feature",k="sushi street",g=["MKT","FREE"])
F(2,"SPR",["HOKKAIDO"],"soup curry (rich or light broth, shrimp-dashi option)","Soup Curry Picante, Kita 13-jō Honten (ピカンティ)",
  "Near Hokkaido University (Kita 13-jō), Kita-ku, Sapporo, Hokkaido, Japan",
  "One of the founding soup-curry houses (1996), by Hokkaido University — vegetable-heavy curries with a choice of rich, light or shrimp-dashi broth.",
  [("MAPPLE",MP+"article/41624/"),("SAPPOROTRAVEL","https://www.sapporo.travel/en/gourmet/shop/soupcarry/")],status=O,ssrc="MAPPLE Sapporo soup-curry feature (current)")
F(1,"DOTO",["SUSHI","MKT"],"kattedon (build-your-own seafood bowl)","Kushiro Washō Market (釧路和商市場)",
  "Kushiro, Hokkaido, Japan",
  "Kushiro's 1954 indoor fish market of ~60 stalls, home of the katte-don — buy a bowl of rice, then walk the stalls choosing each topping.",
  [("RURUBU",RU+"article/20081"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/tw/spot/detail_10020.html"),("MAPPLE",MP+"article/80905/")],
  status=O,ssrc="rurubu&more Kushiro feature (current)")
F(1,"DOTO",["IZAKAYA","HOKKAIDO"],"robatayaki (charcoal-grilled Kushiro fish)","Robata, Kushiro (炉ばた)",
  "Kushiro, Hokkaido, Japan",
  "Seventy-plus years at the charcoal hearth in the city that claims to have invented robatayaki — counter seats only around the fire, fish grilled in front of you.",
  [("MACARONI","https://macaro-ni.jp/172153"),("MAPPLE",MP+"region/a0101050000/collection/")],status=O,ssrc="macaroni Kushiro robata feature (current)")
OUT=[{"key":"RURUBU","name":"rurubu&more. (JTB Publishing)","url":"https://rurubu.jp/andmore/","credible":"Web edition of JTB Publishing's rurubu guidebooks — Japan's best-selling guidebook brand; editor-written spot and dining features. One source."},
     {"key":"OTARUTOURISM","name":"Otaru Tourism Association (otaru.gr.jp)","url":"https://otaru.gr.jp/","credible":"Official city tourism association of Otaru — tourism body of record for the city."}]
emit("W09",OUT)
