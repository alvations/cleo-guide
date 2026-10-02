#!/usr/bin/env python3
# W79 — TKC sights: Banei Tokachi at Obihiro Racecourse, Obihiro Centennial City Museum (ja.wikipedia pins; 2nd sources read
# earlier this session: visit-hokkaido spot 10256, rurubu spot 80000891). WebSearch 2026-10-02 (s3).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"
O="open"
S(1,"TKC","Banei Tokachi — Obihiro Racecourse (ばんえい十勝・帯広競馬場)","Obihiro, Hokkaido, Japan",
  "Home of ban'ei racing — heavy draft-horse racing, Tokachi's signature spectacle.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_10256.html"),("WIKIPEDIA_JA",JA+"%E5%B8%AF%E5%BA%83%E7%AB%B6%E9%A6%AC%E5%A0%B4")],
  42.921,143.182167,"high","ja.wikipedia 帯広競馬場 infobox (北緯42度55分15.6秒 東経143度10分55.8秒) via WebSearch",O,"visit-hokkaido.jp spot 10256 (current)",k="draft-horse racing",g=["ICON","HISTORY"])
S(3,"TKC","Obihiro Centennial City Museum (帯広百年記念館)","Obihiro, Hokkaido, Japan",
  "Obihiro's centennial museum of Tokachi's history.",
  [("RURUBU","https://rurubu.jp/andmore/spot/80000891"),("WIKIPEDIA_JA",JA+"%E5%B8%AF%E5%BA%83%E7%99%BE%E5%B9%B4%E8%A8%98%E5%BF%B5%E9%A4%A8")],
  42.90694,143.18639,"high","ja.wikipedia 帯広百年記念館 infobox (北緯42度54分25秒 東経143度11分11秒) via WebSearch",O,"rurubu&more spot page (current)",k="museum",g=["MUS","HISTORY"])
emit("W79")
