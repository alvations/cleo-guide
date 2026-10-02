#!/usr/bin/env python3
# W27 — SPR miso-ramen canon b2. WebSearch 2026-10-02 (session 2).
from _hk import F, emit
ST="https://www.sapporo.travel/gourmet/"; RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"
O="open"
F(1,"SPR",["RAMEN"],"the original Sapporo miso ramen (1955)","Aji no Sanpei (味の三平)",
  "Chuo-ku, Sapporo, Hokkaido, Japan",
  "Where miso ramen was born in 1955 — the owner took his cue from miso soup.",
  [("SAPPOROTRAVEL",ST+"shop/shop_130-2/"),("SAPPOROTRAVEL",ST+"feature/miso-ramen/"),("RURUBU",RU+"article/22377")],status=O,ssrc="sapporo.travel shop listing (current)")
F(1,"SPR",["RAMEN"],"clear miso ramen (pork genkotsu and hen broth, 10+ hours)","Sapporo Miso Ramen Senmonten Keyaki Susukino Honten (けやき すすきの本店)",
  "Susukino, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The miso-only Susukino counter with a permanent queue — an unclouded broth of pork knuckle, stewing hen and vegetables simmered over ten hours.",
  [("SAPPOROTRAVEL",ST+"shop/shop_250-2/"),("RURUBU",RU+"article/17038")],status=O,ssrc="sapporo.travel shop listing (current)")
F(2,"SPR",["RAMEN"],"mellow miso ramen (broth simmered 3+ days)","Ramen Shingen Minami 6-jō (らーめん信玄 南6条店)",
  "Minami 6-jō, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Line-out-the-door miso ramen whose broth is simmered for more than three days into something rounded and gentle.",
  [("MAPPLE",MP+"article/45570/"),("RURUBU",RU+"article/22377")],status=O,ssrc="MAPPLE Sapporo ramen feature (current)")
emit("W27")
