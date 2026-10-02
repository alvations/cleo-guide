#!/usr/bin/env python3
# W67 — SPR sweets: Rokkatei Sapporo Honten, Kinotoya Ōdōri Kōen, Ōdōri BISSE sweets hall. WebSearch 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"
O="open"
F(1,"SPR",["SWEET","CAFE"],"Marusei Butter Sand, plus café-only sweets upstairs","Rokkatei Sapporo Honten (六花亭 札幌本店)",
  "5 minutes' walk from JR Sapporo Station (south exit), Chuo-ku, Sapporo, Hokkaido, Japan",
  "Tokachi confectioner Rokkatei's Sapporo flagship — the shop below, and a café above serving store-only desserts; home of the Marusei Butter Sand (white chocolate, raisins, Hokkaido butter).",
  [("RURUBU",RU+"article/15117"),("HOKKAIDOTOURISM","https://en.visit-hokkaido.jp/destinations/go-crazy-for-desserts-in-rokkatei-sapporo-main-store")],status=O,ssrc="rurubu&more feature (current)")
F(2,"SPR",["SWEET"],"'Gokujō Gyūnyū' premium-milk soft-serve (New Chitose soft-serve poll winner 2018–19)","Kinotoya Ōdōri Kōen & KINOTOYA Café (きのとや 大通公園店)",
  "Ōdōri Kōen area, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Sapporo patissier Kinotoya's Ōdōri café — the fresh, silky milk soft-serve that topped New Chitose Airport's ice-cream election two years running.",
  [("RURUBU",RU+"spot/80000013"),("RURUBU",RU+"article/19714"),("SAPPOROTRAVEL","https://www.sapporo.travel/gourmet/feature/softcream/")],status=O,ssrc="rurubu&more spot page (current)")
F(2,"SPR",["SWEET","MKT"],"BISSE SWEETS — Hokkaido-dairy confectioners under one roof","Ōdōri BISSE (大通ビッセ)",
  "Directly connected to Ōdōri subway station, Chuo-ku, Sapporo, Hokkaido, Japan",
  "A station-linked complex whose ground floor gathers famous Hokkaido confectioners and farm-milk soft-serve and gelato counters.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/odoribisse/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/en/spot/detail_11261.html")],status=O,ssrc="sapporo.travel facility page (current)")
emit("W67")
