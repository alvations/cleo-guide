#!/usr/bin/env python3
# W56 — DONAN: Hakodate squid canon — sources already read in W33/W45 result sets (no new searches). 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; HT="https://www.hakodate.travel/en/"
O="open"
F(1,"DONAN",["SUSHI","HOKKAIDO","MKT"],"catch-your-own live squid, sliced to ika-sōmen sashimi on the spot","Hakodate Asaichi Ekini Ichiba (函館朝市 えきに市場)",
  "Hakodate Morning Market, by JR Hakodate Station, Hakodate, Hokkaido, Japan",
  "The Morning Market hall with the squid-fishing tank — hook a live squid and the stallholder slices it into translucent sashimi with ginger soy at the table.",
  [("HAKODATETRAVEL",HT+"experience/gourmet/"),("RURUBU",RU+"spot/80105566")],status=O,ssrc="rurubu&more spot page (current)")
F(3,"DONAN",["MKT","SUSHI"],"Hakodate seafood and crab to eat or ship","Hakodate Kaisen Ichiba Honten (はこだて海鮮市場 本店)",
  "Bay area, Hakodate, Hokkaido, Japan",
  "A big Bay-area seafood market of crab, squid and roe for tasting and shipping home.",
  [("HAKODATETRAVEL",HT+"sightseeing-spots/shopping-spot/hakodate-kaisen-ichiba-seafood-market/"),("RURUBU",RU+"spot/80000526")],status=O,ssrc="hakodate.travel spot page (current)")
emit("W56")
