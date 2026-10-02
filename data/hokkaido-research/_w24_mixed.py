#!/usr/bin/env python3
# W24 — capes, Ainu kotan, museum, bird lake (second sources for Wikipedia-only holds). WebSearch 2026-10-02 (s2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; VH="https://www.visit-hokkaido.jp/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
def wj(n,d): return f"ja.wikipedia {n} infobox ({d}) via WebSearch"
O="open"
S(1,"DOTO","Lake Akan Ainu Kotan (阿寒湖アイヌコタン)","Akanko Onsen, Akan-chō, Kushiro, Hokkaido, Japan",
  "Hokkaido's largest Ainu settlement (about 120 residents) on Lake Akan — craft shops, the Ikor theatre's UNESCO-listed traditional dances and Ainu restaurants.",
  [vh("spot/detail_10122.html"),("MAPPLE","https://www.mapple.net/article/80388/"),ja("%E9%98%BF%E5%AF%92%E6%B9%96%E3%82%A2%E3%82%A4%E3%83%8C%E3%82%B3%E3%82%BF%E3%83%B3")],
  43.433611,144.089722,"high",wj("阿寒湖アイヌコタン","北緯43度26分1.0秒 東経144度5分23.0秒"),O,"visit-hokkaido.jp spot 10122 (current)",k="ainu village dance",g=["ICON","MUS"])
S(2,"IBURI","Cape Chikyū, Muroran (地球岬)","Muroran, Hokkaido, Japan",
  "100 m cliffs at the tip of the Etomo Peninsula with a white octagonal lighthouse and a sweep of the Pacific.",
  [vh("spot/detail_10019.html"),ja("%E3%83%81%E3%82%AD%E3%82%A6%E5%B2%AC")],42.30167,141.00194,"high",wj("チキウ岬 (地球岬)","北緯42度18分06秒 東経141度00分07秒"),
  O,"visit-hokkaido.jp spot 10019 (current)",k="cape cliffs lighthouse",g=["VIEW","NATURE","FREE"])
S(2,"DONAN","Cape Tachimachi (立待岬)","South side of Mount Hakodate, Hakodate, Hokkaido, Japan",
  "A 30 m cliff on the south side of Mount Hakodate jutting into the Tsugaru Strait — on clear days the Shimokita and Tsugaru peninsulas of Aomori across the water.",
  [("HAKODATETRAVEL","https://www.hakodate.travel/en/sightseeing-spots/view/cape-tachimachi/"),vh("spot/detail_10030.html"),ja("%E7%AB%8B%E5%BE%85%E5%B2%AC")],41.744604,140.721037,"high",wj("立待岬","北緯41度44分41秒 東経140度43分16秒"),
  O,"hakodate.travel official listing (current)",k="cape strait view",g=["VIEW","FREE"])
S(2,"SPR","Hokkaido Museum (北海道博物館)","53-2 Konopporo, Atsubetsu-chō, Atsubetsu-ku, Sapporo, Hokkaido, Japan",
  "The prefecture's museum of nature and history beside the Historical Village — five themes including Ainu culture, history and wildlife.",
  [("JAPANGUIDE","https://www.japan-guide.com/e/e5303.html"),("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/hokkaido-museum/"),ja("%E5%8C%97%E6%B5%B7%E9%81%93%E5%8D%9A%E7%89%A9%E9%A4%A8")],43.053000,141.496611,"high",wj("北海道博物館","北緯43度3分10.8秒 東経141度29分47.8秒"),
  O,"japan-guide.com e5303 (current)",k="history nature museum",g=["MUS"])
S(2,"IBURI","Lake Utonai (ウトナイ湖)","Tomakomai, Hokkaido, Japan",
  "Japan's first bird sanctuary (1981) on the edge of Tomakomai — whooper swans and white-fronted geese stop over from autumn to spring.",
  [vh("spot/detail_10139.html"),ja("%E3%82%A6%E3%83%88%E3%83%8A%E3%82%A4%E6%B9%96")],42.69889,141.71111,"med",wj("ウトナイ湖","北緯42度41分56秒 東経141度42分40秒 — lake"),
  O,"visit-hokkaido.jp spot 10139 (current)",k="bird sanctuary lake swans",g=["NATURE","FREE"])
emit("W24")
