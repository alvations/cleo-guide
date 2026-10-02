#!/usr/bin/env python3
# W07 — OTARU (Otaru city + Shakotan) + DHOKU (Biei · Sōunkyō) sights. WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"; VH="https://www.visit-hokkaido.jp/en/"
def jg(p): return ("JAPANGUIDE",JG+p)
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def vh(p): return ("HOKKAIDOTOURISM",VH+p)
O="open"
VHLIST=vh("spot/index_1_2_7_____.html")
# ---- OTARU ----
S(2,"OTARU","Bank of Japan Otaru Museum (日本銀行旧小樽支店金融資料館)","1-11-16 Ironai, Otaru, Hokkaido 047-0031, Japan",
  "Tatsuno Kingo's 1912 branch of the Bank of Japan from the days Otaru was 'the Wall Street of the North' — now a free museum of money and the vault.",
  [ja("%E6%97%A5%E6%9C%AC%E9%8A%80%E8%A1%8C%E6%97%A7%E5%B0%8F%E6%A8%BD%E6%94%AF%E5%BA%97%E9%87%91%E8%9E%8D%E8%B3%87%E6%96%99%E9%A4%A8"),jg("e6700.html")],
  43.196194,141.000333,"high","ja.wikipedia 日本銀行旧小樽支店金融資料館 infobox (北緯43度11分46.3秒 東経141度0分1.2秒) via WebSearch",
  O,"japan-guide.com e6700 (free museum, current)",k="bank museum architecture",g=["MUS","CASTLE","FREE"])
S(2,"OTARU","Mount Tengu, Otaru (天狗山)","Mogamicho, Otaru, Hokkaido 047-0023, Japan",
  "Otaru's 532 m house mountain — a ropeway to a night view over the harbour and Ishikari Bay, and a ski hill in winter.",
  [ja("%E5%A4%A9%E7%8B%97%E5%B1%B1_(%E5%B0%8F%E6%A8%BD%E5%B8%82)"),VHLIST],
  43.168389,140.969806,"high","ja.wikipedia 天狗山 (小樽市) infobox (北緯43度10分06.2秒 東経140度58分11.3秒 — summit) via WebSearch",
  O,"visit-hokkaido.jp Otaru spot list (ropeway, current)",k="night view ropeway",g=["VIEW","NIGHT","NATURE"])
S(2,"OTARU","Otaru Herring Mansion, Shukutsu (鰊御殿)","3-228 Shukutsu, Otaru, Hokkaido 047-0047, Japan",
  "A late-19th-century herring fishermen's lodge on the Shukutsu headland — the boss's quarters and bunk lofts from the herring boom that built Otaru.",
  [jg("e6703.html"),ja("%E9%B0%8A%E5%BE%A1%E6%AE%BF")],status=O,ssrc="japan-guide.com e6703 (seasonal, current)",k="herring mansion history",g=["MUS","CASTLE"])
S(2,"OTARU","Former Aoyama Villa — Otaru Kihinkan (小樽貴賓館 旧青山別邸)","3-63 Shukutsu, Otaru, Hokkaido 047-0047, Japan",
  "The opulent 1923 retreat a herring-fishing dynasty built from its fortune — painted ceilings, lacquer and a peony garden.",
  [vh("spot/detail_10041.html"),ja("%E9%B0%8A%E5%BE%A1%E6%AE%BF")],status=O,ssrc="visit-hokkaido.jp spot 10041 (current)",k="herring villa",g=["MUS","CASTLE","GARDEN"])
S(1,"OTARU","Cape Kamui, Shakotan (神威岬)","Kamuimisaki, Shakotan, Shakotan District, Hokkaido 046-0321, Japan",
  "An 80 m knife-edge cape on the Shakotan Peninsula — the 'Charenka trail' ridge walk to the lighthouse above 'Shakotan blue' sea.",
  [ja("%E7%A5%9E%E5%A8%81%E5%B2%AC"),VHLIST],43.330083,140.353472,"high","ja.wikipedia 神威岬 infobox (北緯43度19分48.3秒 東経140度21分12.5秒) via WebSearch",
  O,"visit-hokkaido.jp Otaru/Shakotan spot list (current; trail closes in high wind)",k="cape ridge walk shakotan blue",g=["ICON","NATURE","VIEW"])
S(2,"OTARU","Shimamui Coast, Shakotan (島武意海岸)","Iridomari, Shakotan, Shakotan District, Hokkaido, Japan",
  "Through a short hand-dug tunnel to a cove of startling clear blue — one of Japan's '100 best beaches'.",
  [ja("%E5%B3%B6%E6%AD%A6%E6%84%8F%E6%B5%B7%E5%B2%B8"),VHLIST],status=O,ssrc="visit-hokkaido.jp Otaru/Shakotan spot list (current)",k="blue cove tunnel",g=["NATURE","VIEW","FREE"])
# ---- DHOKU ----
S(2,"DHOKU","Shikisai-no-Oka (四季彩の丘)","Shinsei Daisan, Biei, Kamikawa District, Hokkaido 071-0743, Japan",
  "Biei's biggest flower hill — around 30 kinds of flowers in stripes over the rolling fields, with the Tokachi range behind.",
  [jg("e6828.html"),vh("spot/detail_10363.html"),ja("%E5%9B%9B%E5%AD%A3%E5%BD%A9%E3%81%AE%E4%B8%98")],status=O,ssrc="visit-hokkaido.jp spot 10363 (current)",k="flower hill",g=["GARDEN","VIEW"])
S(2,"DHOKU","Shirahige Waterfall (白ひげの滝)","Shirogane Onsen, Biei, Kamikawa District, Hokkaido 071-0235, Japan",
  "Groundwater spilling from a cliff into the blue Biei River at Shirogane Onsen — the 'white beard' that tints the Blue Pond downstream.",
  [ja("%E7%99%BD%E3%81%B2%E3%81%92%E3%81%AE%E6%BB%9D"),vh("spot/detail_11198.html")],43.474667,142.639194,"high","ja.wikipedia 白ひげの滝 infobox (北緯43度28分28.8秒 東経142度38分21.1秒) via WebSearch",
  O,"visit-hokkaido.jp spot 11198 (current)",k="waterfall blue river",g=["NATURE","FREE"])
S(2,"DHOKU","Patchwork Road, Biei (パッチワークの路)","Biei (northwest of the town centre), Kamikawa District, Hokkaido, Japan",
  "The quilt of wheat, potato and buckwheat fields made famous by TV ads — the Ken & Mary Tree, Seven Stars Tree and Hokusei Hill lookout.",
  [jg("e6828.html"),vh("plan/detail_27.html")],status=O,ssrc="japan-guide.com e6828 (current)",k="farm fields scenic road",g=["VIEW","NATURE","FREE"])
S(2,"DHOKU","Ginga Falls, Sōunkyō (銀河の滝)","Sōunkyō, Kamikawa, Kamikawa District, Hokkaido 078-1701, Japan",
  "'Milky Way Falls', the slender twin of Ryūsei ('Shooting Star') Falls, ribboning down the 100 m basalt walls of the gorge.",
  [ja("%E5%B1%A4%E9%9B%B2%E5%B3%A1"),jg("e6777.html")],43.719056,142.977167,"high","ja.wikipedia 層雲峡 (銀河の滝 coordinates 北緯43度43分8.6秒 東経142度58分37.8秒) via WebSearch",
  O,"japan-guide.com e6777 (current)",k="waterfall gorge",g=["NATURE","FREE"])
S(2,"DHOKU","Mount Kurodake & Kurodake Ropeway (黒岳)","Sōunkyō, Kamikawa, Kamikawa District, Hokkaido 078-1701, Japan",
  "Ropeway and chairlift from Sōunkyō to within an hour of the 1,984 m summit — the quickest way into Daisetsuzan's alpine plateau.",
  [ja("%E9%BB%92%E5%B2%B3_(%E5%8C%97%E6%B5%B7%E9%81%93%E3%83%BB%E5%A4%A7%E9%9B%AA%E5%B1%B1)"),jg("e6777.html")],43.69750,142.92028,"med","ja.wikipedia 黒岳 (北海道・大雪山) infobox (北緯43度41分51秒 東経142度55分13秒 — summit) via WebSearch",
  O,"japan-guide.com e6777 (ropeway operating)",k="ropeway alpine",g=["NATURE","VIEW"])
emit("W07")
