#!/usr/bin/env python3
# W46 — SOYA food canon: Rebun uni-don & hokke chanchan-yaki. WebSearch 2026-10-02 (s3).
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"SOYA",["SUSHI","HOKKAIDO"],"Rebun uni-don and grilled hokke (fishery co-op run, May–mid-Oct)","Kaisen-dokoro Kafuka, Rebun (海鮮処かふか)",
  "Kafuka, Rebun, Rebun District, Hokkaido, Japan",
  "The fishery co-op's own restaurant at Kafuka port — island sea urchin over rice and fat Rebun hokke, open for the summer season.",
  [("RURUBU",RU+"spot/80001602"),("MAPPLE",MP+"region/a0101060400_g03000000/spot/")],status=O,ssrc="rurubu&more spot page (season hours current)")
F(2,"SOYA",["HOKKAIDO","IZAKAYA"],"hokke chanchan-yaki (miso-grilled Atka mackerel)","Robata Chidori, Rebun (炉ばた ちどり)",
  "Rebun, Rebun District, Hokkaido, Japan",
  "A Rebun robata where the local catch is miso-grilled at the hearth — the island's hokke chanchan-yaki is the order.",
  [("RURUBU",RU+"spot/80001592"),("MAPPLE",MP+"region/a0101060400_g03000000/spot/")],status=O,ssrc="rurubu&more spot page (current)")
emit("W46")
