#!/usr/bin/env python3
# W03 — island-wide sights backbone (OTARU · DONAN · IBURI · DHOKU). WebSearch 2026-10-02 (session 2).
# Technique: allowed_domains=["en.wikipedia.org"] + 3 names per query → infobox coords in the summary;
# allowed_domains=["japan-guide.com"] area query → staff area pages as the 2nd source (10 links/query).
from _hk import S, emit
WP="https://en.wikipedia.org/wiki/"; JG="https://www.japan-guide.com/e/"
def jg(p): return ("JAPANGUIDE",JG+p)
def wp(p): return ("WIKIPEDIA",WP+p)
O="open"
# ---- OTARU ----
S(1,"OTARU","Otaru Canal (小樽運河)","Minato-machi, Otaru, Hokkaido, Japan",
  "The 1923 freight canal lined with stone warehouses and gas lamps — Otaru's postcard, best at dusk and during the February Snow Light Path.",
  [jg("e6700.html"),wp("Otaru")],43.198004,141.003047,"med","en.wikivoyage Otaru listing (43.198004, 141.003047) via WebSearch",
  O,"japan-guide.com e6700 (current)",k="canal warehouses",g=["ICON","FREE","NIGHT"])
S(2,"OTARU","Sakaimachi Street (堺町通り)","Sakaimachi, Otaru, Hokkaido, Japan",
  "The preserved Meiji–Taishō merchant street a short walk from the canal — glass workshops, music boxes, LeTAO and Kitakaro sweet shops.",
  [jg("e6704.html"),("WIKIVOYAGE","https://en.wikivoyage.org/wiki/Otaru")],status=O,ssrc="japan-guide.com e6704 (current)",k="merchant street glass",g=["MKT","CASTLE","FREE"])
S(2,"OTARU","Otaru Music Box Museum (小樽オルゴール堂)","1-2-3 Irifune, Otaru, Hokkaido, Japan",
  "The 1912 brick main hall at the foot of Sakaimachi, packed with thousands of music boxes — the Vancouver-gifted steam clock whistles out front. Free entry.",
  [wp("Otaru_Music_Box_Museum"),jg("e6704.html")],43.19060194,141.00777028,"high","en.wikipedia Otaru_Music_Box_Museum infobox (43°11′26.167″N 141°0′27.973″E) via WebSearch",
  O,"japan-guide.com e6704 (hours 9:00–18:00, no closing days)",k="music box museum steam clock",g=["MUS","FREE"])
S(1,"OTARU","Nikka Whisky Yoichi Distillery (ニッカウヰスキー余市蒸溜所)","Kurokawa-chō, Yoichi, Yoichi District, Hokkaido, Japan",
  "Masataka Taketsuru's 1934 distillery, chosen because Yoichi most resembled Scotland — coal-fired pot stills, stone kilns and a tasting hall.",
  [wp("Yoichi_distillery"),jg("e6707.html")],43.18722,140.79167,"high","en.wikipedia Yoichi_distillery infobox (43°11′14″N 140°47′30″E) via WebSearch",
  O,"japan-guide.com e6707 (current)",k="whisky distillery",g=["ICON","MUS"])
S(2,"OTARU","Otaru City General Museum (小樽市総合博物館)","Temiya, Otaru, Hokkaido, Japan",
  "Hokkaido's railway birthplace — steam locomotives in the old Temiya roundhouse, plus the canal-side annex in a former warehouse.",
  [jg("e6702.html"),wp("Otaru_City_General_Museum")],status=O,ssrc="japan-guide.com e6702 (current)",k="railway museum",g=["MUS"])
# ---- DONAN ----
S(1,"DONAN","Goryōkaku (五稜郭)","Goryōkaku-chō, Hakodate, Hokkaido, Japan",
  "Japan's first Western-style fortress, the 1866 star fort where the Republic of Ezo made its last stand — a thousand cherry trees fill the moats in spring.",
  [jg("e5350.html"),("WIKIPEDIA",WP+"Goryōkaku")],41.796995,140.757165,"med","Wikipedia-format DMS (41°47′49.181″N 140°45′25.793″E) read from sygic POI page via WebSearch",
  O,"japan-guide.com e5350 (current)",k="star fort cherry blossom",g=["ICON","CASTLE","NATURE"])
S(1,"DONAN","Mount Hakodate (函館山)","Hakodateyama, Hakodate, Hokkaido, Japan",
  "334 m peak at the tip of the peninsula: a three-minute ropeway to one of Japan's great night views, the city lights pinched between two bays.",
  [wp("Mount_Hakodate"),jg("e5354.html")],41.75889,140.70444,"high","en.wikipedia Mount_Hakodate infobox (41°45′32″N 140°42′16″E) via WebSearch",
  O,"japan-guide.com e5354 (ropeway operating, current)",k="night view ropeway",g=["ICON","VIEW","NIGHT"])
S(1,"DONAN","Motomachi (元町)","Motomachi, Hakodate, Hokkaido, Japan",
  "The slope-side former foreign settlement — churches, the Old British Consulate, the Chinese Memorial Hall and the Old Public Hall of Hakodate Ward on stepped streets down to the harbour.",
  [jg("e5351.html"),wp("Hakodate_foreign_settlement")],status=O,ssrc="japan-guide.com e5351 (current)",k="foreign settlement churches slopes",g=["CASTLE","TEMPLE","FREE"])
S(2,"DONAN","Hakodate Orthodox Church (Holy Resurrection, ハリストス正教会)","Motomachi, Hakodate, Hokkaido, Japan",
  "Japan's first Orthodox parish (consecrated 1860); the 1916 white church with green copper domes is an Important Cultural Property.",
  [wp("Holy_Resurrection_Orthodox_Church_of_Hakodate"),jg("e5351.html")],41.76283,140.71223,"high","en.wikipedia Holy_Resurrection_Orthodox_Church_of_Hakodate infobox (41°45′46″N 140°42′44″E) via WebSearch",
  O,"japan-guide.com e5351 (current)",k="orthodox church",g=["TEMPLE","CASTLE"])
S(2,"DONAN","Hakodate Morning Market (函館朝市)","Wakamatsu-chō, Hakodate, Hokkaido, Japan",
  "250-odd stalls across the street from Hakodate Station — squid you fish yourself, crab, uni and ikura donburi for breakfast.",
  [jg("e5350.html"),wp("Hakodate")],status=O,ssrc="japan-guide.com e5350 (current)",k="morning market seafood",g=["MKT","ICON"])
S(2,"DONAN","Matsumae Castle (松前城)","Matsushiro, Matsumae, Matsumae District, Hokkaido, Japan",
  "Japan's northernmost castle, seat of the only Edo-period domain on Hokkaido — its park is one of the island's great cherry-blossom spots, thousands of trees in 250 varieties.",
  [wp("Matsumae_Castle"),("JAPANGUIDE","https://www.japan-guide.com/blog/schauwecker/100513_matsumae.html")],41.429833,140.108389,"high","en.wikipedia Matsumae_Castle infobox (41°25′47″N 140°06′30″E) via WebSearch",
  O,"japan-guide.com (castle park, current)",k="castle cherry blossom",g=["CASTLE","NATURE"])
# ---- IBURI ----
S(1,"IBURI","Upopoy — National Ainu Museum & Park (ウポポイ)","Wakakusa-chō, Shiraoi, Shiraoi District, Hokkaido, Japan",
  "Japan's national centre for Ainu culture on Lake Poroto — the museum, a kotan of chise houses, dance, music and Ainu cooking.",
  [wp("Upopoy"),jg("e5375.html")],42.561347,141.366885,"high","en.wikipedia Upopoy (National Ainu Museum) infobox (42°33′41″N 141°22′01″E) via WebSearch",
  O,"japan-guide.com e5375 (current)",k="ainu museum",g=["ICON","MUS"])
S(1,"IBURI","Noboribetsu Jigokudani (登別地獄谷)","Noboribetsu Onsen-chō, Noboribetsu, Hokkaido, Japan",
  "'Hell Valley' above Hokkaido's most famous onsen town — a steaming crater of sulphur vents feeding nine kinds of spring water, boardwalk to Oyunuma.",
  [jg("e6750.html"),("JNTO","https://www.japan.travel/en/destinations/hokkaido/hokkaido/noboribetsu-upopoy-and-around/")],status=O,ssrc="japan-guide.com e6750 (current)",k="hell valley onsen",g=["ICON","ONSEN","NATURE","FREE"])
S(1,"IBURI","Lake Tōya (洞爺湖)","Tōyako Onsen, Tōyako, Abuta District, Hokkaido, Japan",
  "Round caldera lake with an island at its heart and Mount Usu steaming on its shore — onsen town, summer fireworks every night.",
  [wp("Lake_T%C5%8Dya"),jg("e6725.html")],42.57889,140.85444,"med","en.wikipedia Lake_Tōya infobox (42°34′44″N 140°51′16″E — lake centre) via WebSearch",
  O,"japan-guide.com e6725 (current)",k="caldera lake",g=["NATURE","ONSEN","VIEW"])
S(2,"IBURI","Mount Usu (有珠山)","Tōyako, Abuta District, Hokkaido, Japan",
  "Active volcano that last erupted in 2000 — the Usuzan Ropeway rises to crater rims and views over Lake Tōya and Shōwa-shinzan.",
  [wp("Mount_Usu"),jg("e6725.html")],42.5435,140.8392,"high","en.wikipedia Mount_Usu infobox (42°32′37″N 140°50′21″E) via WebSearch",
  O,"japan-guide.com e6725 (ropeway operating)",k="volcano ropeway",g=["NATURE","VIEW"])
S(2,"IBURI","Lake Shikotsu (支笏湖)","Shikotsuko Onsen, Chitose, Hokkaido, Japan",
  "Japan's northernmost ice-free lake and one of its deepest and clearest — a caldera ringed by volcanoes an hour from Sapporo.",
  [wp("Lake_Shikotsu"),jg("e6735.html")],42.800,141.350,"med","en.wikipedia Lake_Shikotsu infobox (42°48′N 141°21′E — lake centre) via WebSearch",
  O,"japan-guide.com e6735 (current)",k="caldera lake clear",g=["NATURE","VIEW"])
# ---- DHOKU ----
S(1,"DHOKU","Asahiyama Zoo (旭山動物園)","Higashi-Asahikawa-chō Kuranuma, Asahikawa, Hokkaido, Japan",
  "The zoo that reinvented Japanese zoos with behavioural exhibits — penguin parade in the snow, polar bears and seals in see-through tubes.",
  [wp("Asahiyama_Zoo"),jg("e6890.html")],43.76805114,142.4797823,"high","en.wikipedia Asahiyama_Zoo infobox (43°46′05″N 142°28′47″E) via WebSearch",
  O,"japan-guide.com e6890 (current)",k="zoo penguin walk",g=["ICON","NATURE"])
S(1,"DHOKU","Blue Pond, Biei (青い池)","Shirogane, Biei, Kamikawa District, Hokkaido, Japan",
  "An accidental pond behind a volcanic-mudflow dam whose aluminium-rich water turns an unreal cobalt around drowned larches.",
  [wp("Blue_Pond_(Biei)"),jg("e6828.html")],43.493583,142.614028,"high","en.wikipedia Blue_Pond_(Biei) infobox (43°29′37″N 142°36′51″E) via WebSearch",
  O,"japan-guide.com e6828 (current)",k="blue pond",g=["ICON","NATURE","FREE"])
S(2,"DHOKU","Sōunkyō Gorge (層雲峡)","Sōunkyō, Kamikawa, Kamikawa District, Hokkaido, Japan",
  "Onsen town in a 100 m-cliffed gorge of the Ishikari River — Ginga and Ryūsei falls, and the Kurodake ropeway into Daisetsuzan.",
  [wp("Sounkyo"),jg("e6777.html")],43.7284,142.9498,"high","en.wikipedia Sōunkyō infobox (43°43′42″N 142°56′59″E) via WebSearch",
  O,"japan-guide.com e6777 (current)",k="gorge onsen waterfalls",g=["NATURE","ONSEN"])
S(2,"DHOKU","Mount Asahidake (旭岳)","Asahidake Onsen, Higashikawa, Kamikawa District, Hokkaido, Japan",
  "Hokkaido's highest peak (2,291 m) in Daisetsuzan National Park — a ropeway to steaming fumaroles and alpine tundra, Japan's first autumn colour.",
  [wp("Asahi-dake"),jg("e6776.html")],43.650,142.850,"med","en.wikipedia Asahi-dake infobox (43°39′N 142°51′E — summit, minute precision) via WebSearch",
  O,"japan-guide.com e6776 (ropeway operating)",k="highest peak ropeway",g=["NATURE","VIEW"])
OUT=[{"key":"WIKIVOYAGE","name":"Wikivoyage","url":"https://en.wikivoyage.org/","credible":"Collaborative travel guide with geocoded listings; corroborating only (like Wikipedia), never a lone recommender."}]
emit("W03",OUT)
