#!/usr/bin/env python3
# W15 — DHOKU (Furano · Biei · Asahikawa Ainu) + IBURI (Muroran). WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; VH="https://www.visit-hokkaido.jp/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
S(2,"DHOKU","Ningle Terrace, Furano (ニングルテラス)","Nakagoryō, Furano, Hokkaido, Japan (New Furano Prince Hotel grounds)",
  "About fifteen log-cabin craft shops linked by boardwalks in the Furano forest — silver snowflake charms, woodcarving, leather; lantern-lit after dark.",
  [vh("spot/detail_11270.html"),ja("%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB:130503_Ningle_Terrace_Furano_Hokkaido_Japan01s3.jpg")],43.323346,142.356943,"med","ja.wikipedia file page photo geotag (43° 19′ 24.05″ N, 142° 21′ 24.99″ E) via WebSearch — camera point at the terrace",
  O,"visit-hokkaido.jp spot 11270 (current)",k="craft village log cabins",g=["MKT","NIGHT"])
S(2,"DHOKU","Takushinkan Gallery, Biei (拓真館)","Biei, Kamikawa District, Hokkaido, Japan (former primary school)",
  "Landscape photographer Shinzō Maeda's gallery of the Biei hills he made famous, in a converted primary school among birch groves.",
  [vh("spot/detail_10360.html"),ja("%E6%8B%93%E7%9C%9F%E9%A4%A8")],43.53000,142.48944,"med","ja.wikipedia 拓真館 infobox (北緯43度31分48秒 東経142度29分22秒) via WebSearch",
  O,"visit-hokkaido.jp spot 10360 (current)",k="photo gallery",g=["MUS","FREE"])
S(2,"DHOKU","Kawamura Kaneto Ainu Memorial Museum (川村カ子トアイヌ記念館)","Hokumon-chō 11-chōme, Asahikawa, Hokkaido, Japan",
  "Founded 1916 — Japan's oldest Ainu cultural museum, run by an Ainu family in the old Chikabumi kotan, with a reconstructed bamboo-grass cise house.",
  [vh("spot/detail_10229.html"),ja("%E5%B7%9D%E6%9D%91%E3%82%AB%E5%AD%90%E3%83%88%E3%82%A2%E3%82%A4%E3%83%8C%E8%A8%98%E5%BF%B5%E9%A4%A8")],43.7872750,142.3435389,"high","ja.wikipedia 川村カ子トアイヌ記念館 infobox (北緯43度47分14.19秒 東経142度20分36.74秒) via WebSearch",
  O,"visit-hokkaido.jp spot 10229 (current)",k="ainu museum",g=["MUS"])
S(2,"IBURI","Hakuchō Ōhashi Bridge, Muroran (白鳥大橋)","Muroran, Hokkaido, Japan (Route 37 across Muroran Port)",
  "Eastern Japan's longest suspension bridge, spanning Muroran harbour — lit at night above the city's famous factory-night views.",
  [ja("%E7%99%BD%E9%B3%A5%E5%A4%A7%E6%A9%8B"),("RURUBU","https://rurubu.jp/andmore/spot/80000791")],42.353278,140.950194,"high","ja.wikipedia 白鳥大橋 infobox (北緯42度21分11.8秒 東経140度57分0.7秒) via WebSearch",
  O,"rurubu&more — Michi-no-eki / Hakuchō Ōhashi memorial hall listing (current)",k="suspension bridge night view",g=["VIEW","NIGHT","FREE"])
emit("W15")
