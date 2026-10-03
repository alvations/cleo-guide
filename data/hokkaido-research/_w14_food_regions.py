#!/usr/bin/env python3
# W14 — regional food canon: Obihiro butadon & Rokkatei, Muroran curry ramen. WebSearch 2026-10-02 (session 2).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; VH="https://www.visit-hokkaido.jp/en/"
O="open"
F(1,"TKC",["HOKKAIDO","TEMPURA"],"butadon (high-heat grilled marbled pork loin, 1934 house sauce)","Obihiro Hageten Honten (帯広はげ天 本店)",
  "Obihiro, Hokkaido, Japan (city centre)",
  "Tempura and local-food house founded 1934, whose first chef Yano Shōroku helped devise the butadon sauce — marbled loin seared fast at high heat, a restrained sweet glaze.",
  [("MAPPLE",MP+"spot/1013336/"),("RURUBU",RU+"article/10392")],status=O,ssrc="MAPPLE spot page (current)")
F(1,"TKC",["SWEET","CAFE"],"Marusei Butter Sandwich","Rokkatei Obihiro Main Store (六花亭 帯広本店)",
  "Obihiro, Hokkaido, Japan (city centre)",
  "The 1933 Tokachi confectioner's home store — the Marusei Butter Sandwich, crisp pies and assortments, with a second-floor kissa café.",
  [("HOKKAIDOTOURISM",VH+"spot/detail_10249.html"),("MAPPLE",MP+"spot/1001339/")],status=O,ssrc="visit-hokkaido.jp spot 10249 (current)")
F(1,"IBURI",["RAMEN"],"Muroran curry ramen (thick curry broth, house curly noodles)","Aji no Daiō Muroran Honten (味の大王 室蘭本店)",
  "Muroran, Hokkaido, Japan (near Muroran Station)",
  "Serving its thick, rich curry ramen since opening in Muroran in 1971 — the bowl that made curry ramen the city's new local dish; house-made medium-thick curly noodles.",
  [("RURUBU",RU+"spot/80000790"),("MAPPLE",MP+"spot/1013865/")],status=O,ssrc="rurubu&more spot page (current)")
emit("W14")
