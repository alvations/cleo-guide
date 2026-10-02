#!/usr/bin/env python3
# W51 — DOTO zantare (Kushiro) + SOYA Rishiri uni-don. WebSearch 2026-10-02 (s3).
# RISHIRIPLUS = rishiri-plus.jp, Rishiri Island's tourism portal ("shima-shop" listings) — local tourism body, one corroborating source.
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"DOTO",["TEMPURA","HOKKAIDO"],"zantare — fried zangi chicken in house sweet-and-sour sauce (the original)","Nanbantei, Kushiro-chō (南蛮酊)",
  "Tōya 1-39, Kushiro-chō, Kushiro District, Hokkaido, Japan",
  "The home of 'zantare': fresh-fried chicken thigh doused in a soy-sugar-vinegar sauce, in portions big enough that take-home boxes are standard; weekend queues.",
  [("RURUBU",RU+"spot/80001840"),("MAPPLE",MP+"spot/1014100/")],status=O,ssrc="rurubu&more spot page (hours current)")
F(2,"SOYA",["SUSHI","RAMEN","HOKKAIDO"],"Rishiri uni-don and Rishiri kombu ramen (Apr–Oct)","Satō Shokudō, Rishiri (さとう食堂)",
  "In front of the ferry terminal, Rishiri Island, Rishiri District, Hokkaido, Japan",
  "The long-running ferry-front canteen for Rishiri sea urchin over rice, grilled hokke sets and kelp ramen — open with the ferry season.",
  [("RISHIRIPLUS","https://www.rishiri-plus.jp/shima-shop/satou-shokudou/"),("MAPPLE",MP+"spot/1017224/")],status=O,ssrc="rishiri-plus.jp shop listing (season hours current)")
emit("W51")
