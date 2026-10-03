#!/usr/bin/env python3
# W29 — NSK ski resorts. WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
O="open"
def wj(n,d): return f"ja.wikipedia {n} infobox ({d}) via WebSearch"
S(2,"NSK","Niseko Tokyu Grand Hirafu (ニセコ東急 グラン・ヒラフ)","Hirafu, Kutchan, Abuta District, Hokkaido, Japan",
  "The biggest of the Niseko United resorts on Annupuri's east face — powder runs, backcountry gates and the Hirafu village of restaurants and bars.",
  [ja("%E3%83%8B%E3%82%BB%E3%82%B3%E6%9D%B1%E6%80%A5_%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%BB%E3%83%92%E3%83%A9%E3%83%95"),("JAPANGUIDE",JG+"e6720.html")],42.86278,140.70000,"high",wj("ニセコ東急 グラン・ヒラフ","北緯42度51分46秒 東経140度42分00秒"),
  O,"japan-guide.com e6720 (current)",k="ski resort powder",g=["NATURE"])
S(2,"NSK","Niseko HANAZONO Resort (ニセコHANAZONOリゾート)","Kutchan, Abuta District, Hokkaido, Japan",
  "Grand Hirafu's satellite base on the north-east flank of Annupuri, reached by bus from Kutchan Station.",
  [ja("%E3%83%8B%E3%82%BB%E3%82%B3HANAZONO%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88"),("JAPANGUIDE",JG+"e6720.html")],42.89306,140.69972,"high",wj("ニセコHANAZONOリゾート","北緯42度53分35秒 東経140度41分59秒"),
  O,"japan-guide.com e6720 (current)",k="ski resort",g=["NATURE"])
S(2,"NSK","Rusutsu Resort (ルスツリゾート)","Rusutsu, Abuta District, Hokkaido, Japan",
  "One of Hokkaido's best ski areas across three mountains — long groomers, powder and trees in winter; an amusement park with seven roller coasters, pools and onsen in summer.",
  [ja("%E3%83%AB%E3%82%B9%E3%83%84%E3%83%AA%E3%82%BE%E3%83%BC%E3%83%88"),("JAPANGUIDE",JG+"e6715.html")],42.74750,140.89639,"high",wj("ルスツリゾート","北緯42度44分51秒 東経140度53分47秒"),
  O,"japan-guide.com e6715 (current)",k="ski resort amusement park",g=["NATURE","POP"])
emit("W29")
