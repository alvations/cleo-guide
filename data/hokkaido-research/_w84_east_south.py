#!/usr/bin/env python3
# W84 — DOTO / IBURI / TKC / SOYA discovery: michi-no-eki with named dishes, Wakkanai/Rishiri seafood, Tokachi dairy & sake,
# plus ja.wikipedia-pinned sights. WebSearch 2026-10-02 (s4), 30 searches.
from _hk import F, S, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/spot/"; MP="https://www.mapple.net/spot/"
VH="https://www.visit-hokkaido.jp/spot/detail_"; ME="https://hokkaido-michinoeki.jp/michinoeki/"
O="open"; CUR="listing current 2026 (no closure reported)"

# ---------------- IBURI ----------------
F(2,"IBURI",["HOKKAIDO","MKT"],"salmon-themed kaisendon and salmon goods in the food court","Michi-no-eki Salmon Park Chitose (道の駅 サーモンパーク千歳)",
  "2-4-2 Hanazono, Chitose, Hokkaido, Japan",
  "Chitose's salmon-river roadside station beside the Chitose Aquarium and its Indian water-wheel — a six-stall food court built around salmon.",
  [("RURUBU",RU+"80001091"),("HOKKAIDOMICHINOEKI","https://2016.hokkaido-michinoeki.jp/michinoeki/2654/"),("MAPPLE","https://www.mapple.net/article/190661/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%82%B5%E3%83%BC%E3%83%A2%E3%83%B3%E3%83%91%E3%83%BC%E3%82%AF%E5%8D%83%E6%AD%B3")],
  42.8339,141.6594,"high","ja.wikipedia 道の駅サーモンパーク千歳 infobox (北緯42度50分02秒 東経141度39分34秒) via WebSearch",O,"rurubu spot 80001091 (hours 9-18, no closed days)")
F(2,"IBURI",["HOKKAIDO","MKT"],"hokki (surf clam) salmon-don and hokki curry","Umi no Eki Platto Minato Ichiba, Tomakomai (海の駅 ぷらっとみなと市場)",
  "2-2-5 Minatomachi, Tomakomai, Hokkaido, Japan",
  "Tomakomai port's market hall — Japan's top hokki-clam catch sold fresh, eaten in hokki-don and hokki curry at the stalls, with a small hokki museum.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/plan/detail_93.html"),("MAPPLE","https://www.mapple.net/pref/01213/spot/")],
  status=O,ssrc="mapple Tomakomai list (7:00-16:00 year-round)")
F(3,"IBURI",["HOKKAIDO","MKT"],"Date-musha bentō (Funka Bay scallop rice) and Date-milk white pudding","Michi-no-eki Date Rekishi no Mori (道の駅 だて歴史の杜)",
  "Date, Hokkaido, Japan",
  "Date's roadside station in its history park — Hansamu Shokudō, the scallop takikomi-gohan 'Date-musha' bento and Makiya's Date-milk pudding.",
  [("RURUBU",RU+"80083095"),("HOKKAIDOMICHINOEKI",ME+"2253/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%A0%E3%81%A6%E6%AD%B4%E5%8F%B2%E3%81%AE%E6%9D%9C")],
  42.47061,140.8755,"high","ja.wikipedia 道の駅だて歴史の杜 infobox (北緯42度28分14秒 東経140度52分32秒) via WebSearch",O,"hokkaido-michinoeki.jp station page (current)")
F(3,"IBURI",["HOKKAIDO","CAFE"],"'torōri' cheese croquette and local-vegetable plates at Tōya-ko Shokudō","Michi-no-eki Tōya-ko (道の駅 とうや湖)",
  "Tōyako, Abuta District, Hokkaido, Japan",
  "Hill-top roadside station above Lake Tōya with Mt Yōtei views; its shokudō and takeaway counter work the farm produce of the caldera rim.",
  [("RURUBU",RU+"80084538"),("HOKKAIDOMICHINOEKI","https://2016.hokkaido-michinoeki.jp/michinoeki/2974/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%A8%E3%81%86%E3%82%84%E6%B9%96")],
  42.6645,140.82183,"high","ja.wikipedia 道の駅とうや湖 infobox (北緯42度39分52秒 東経140度49分19秒) via WebSearch",O,"rurubu spot 80084538 (current)")
S(2,"IBURI","Noboribetsu Bear Park (のぼりべつクマ牧場)","Noboribetsu Onsen-chō (ropeway from the onsen town), Noboribetsu, Hokkaido, Japan",
  "A 7-minute ropeway up Mt Shihorei to ~100 Ezo brown bears — with the 'human cage' where people, not bears, are behind the bars.",
  [("HOKKAIDOTOURISM",VH+"10158.html"),("RURUBU",RU+"80001234"),("MAPPLE",MP+"1000979/"),("WIKIPEDIA_JA",JA+"%E3%81%AE%E3%81%BC%E3%82%8A%E3%81%B9%E3%81%A4%E3%82%AF%E3%83%9E%E7%89%A7%E5%A0%B4")],
  42.490167,141.15925,"high","ja.wikipedia のぼりべつクマ牧場 infobox (北緯42度29分24.6秒 東経141度09分33.3秒) via WebSearch",O,"visit-hokkaido 10158 (current)",k="bear park & ropeway",g=["FAMILY","VIEW"])
S(3,"IBURI","Sendai-han Shiraoi Moto-Jin'ya Site & Museum (仙台藩白老元陣屋跡・資料館)","Jin'ya-chō, Shiraoi, Shiraoi District, Hokkaido, Japan",
  "1856 coastal-defence camp of the Sendai domain — a national historic site with earthworks in a 66,000 m² park and a museum of ~300 objects.",
  [("HOKKAIDOTOURISM",VH+"10425.html"),("RURUBU",RU+"80001699"),("WIKIPEDIA_JA",JA+"%E7%99%BD%E8%80%81%E4%BB%99%E5%8F%B0%E8%97%A9%E9%99%A3%E5%B1%8B%E8%B7%A1")],
  42.56417,141.34333,"high","ja.wikipedia 白老仙台藩陣屋跡 infobox (北緯42度33分51秒 東経141度20分36秒) via WebSearch",O,"rurubu 80001699 (9:30-16:30, closed Mon)",k="samurai-era fort site",g=["HISTORY","MUS"])
S(2,"IBURI","Usu Zenkō-ji Temple (有珠善光寺)","Usu-chō, Date, Hokkaido, Japan",
  "Said founded in 826 and named one of the shogunate's three official Ezo temples (1804) — a national historic site, Hokkaido Heritage, and a cherry 'flower temple' with its rock-splitting sakura.",
  [("HOKKAIDOTOURISM",VH+"11239.html"),("WIKIPEDIA_JA",JA+"%E6%9C%89%E7%8F%A0%E5%96%84%E5%85%89%E5%AF%BA")],
  42.52111,140.78,"high","ja.wikipedia 有珠善光寺 infobox (北緯42度31分16秒 東経140度46分48秒) via WebSearch",O,"visit-hokkaido 11239 (current)",k="historic temple & cherries",g=["HISTORY","TEMPLE","SPRING"])
S(3,"IBURI","Mt Sokuryō Observatory, Muroran (測量山展望台)","Shimizu-chō, Muroran, Hokkaido, Japan",
  "A 200 m hill named for the Meiji surveyors who planned the Sapporo road — 360° views over the port, Hakuchō Bridge and the steelworks; a Japan Night View Heritage site.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/hokkaidolove/spot/spot0013/"),("WIKIPEDIA_JA",JA+"%E6%B8%AC%E9%87%8F%E5%B1%B1")],
  42.32194,140.95806,"high","ja.wikipedia 測量山 infobox summit (北緯42度19分19秒 東経140度57分29秒) via WebSearch",O,"visit-hokkaido feature (open 24h, free)",k="factory & port night view",g=["VIEW","NIGHT","FREE"])

# ---------------- DOTO ----------------
F(2,"DOTO",["HOKKAIDO","TEISHOKU"],"Rausu hokke and kinki (menme) set meals at Rausu no Umiaji Shiretoko Shokudō","Michi-no-eki Shiretoko-Rausu (道の駅 知床・らうす)",
  "Hon-chō, Rausu, Menashi District, Hokkaido, Japan",
  "The roadside station closest to Kunashir — its Shiretoko Shokudō is the local name for Rausu-landed hokke and kinki teishoku.",
  [("RURUBU",RU+"80001949"),("MAPPLE",MP+"1015970/"),("HOKKAIDOMICHINOEKI",ME+"2217/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E7%9F%A5%E5%BA%8A%E3%83%BB%E3%82%89%E3%81%86%E3%81%99")],
  44.01739,145.19208,"high","ja.wikipedia 道の駅知床・らうす infobox (北緯44度01分03秒 東経145度11分31秒) via WebSearch",O,"rurubu 80001949 (Apr-Oct 9-17, Nov-Mar 10-16)")
F(3,"DOTO",["HOKKAIDO","TEISHOKU"],"Rausu seafood set meals","Kita no Kuni kara Jun no Banya, Rausu (北の国から 純の番屋)",
  "Funami-chō, Rausu, Menashi District, Hokkaido, Japan",
  "The fishermen's hut from the drama 'Kita no Kuni kara 2002 Yuigon', rebuilt as a diner serving Rausu-coast seafood.",
  [("RURUBU",RU+"80001948"),("MAPPLE",MP+"1012911/")],
  status=O,ssrc="rurubu 80001948 (9-15, closed Tue; closed Nov-mid Apr)")
F(2,"DOTO",["HOKKAIDO","RAMEN"],"hanasaki-crab ramen at Restaurant Bird Pal","Michi-no-eki Swan 44 Nemuro (道の駅 スワン44ねむろ)",
  "Route 44, Nemuro, Hokkaido, Japan",
  "On Lake Fūren's swan shore — the Bird Pal dining room looks over the lagoon and is known for Nemuro's hanasaki-crab ramen.",
  [("RURUBU",RU+"80001069"),("MAPPLE",MP+"1012196/"),("HOKKAIDOMICHINOEKI",ME+"2143/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%82%B9%E3%83%AF%E3%83%B344%E3%81%AD%E3%82%80%E3%82%8D")],
  43.26175,145.43847,"high","ja.wikipedia 道の駅スワン44ねむろ infobox (北緯43度15分42秒 東経145度26分18秒) via WebSearch",O,"hokkaido-michinoeki.jp station page (current)")
F(3,"DOTO",["HOKKAIDO","WAGYU"],"Ezo venison steak at Restaurant Tsuru","Michi-no-eki Akan Tanchō no Sato (道の駅 阿寒丹頂の里)",
  "Kamiakan, Akan-chō, Kushiro, Hokkaido, Japan",
  "Akan's crane-country roadside station (with an onsen) — Restaurant Tsuru grills local Ezo-shika venison.",
  [("RURUBU",RU+"80098751"),("HOKKAIDOMICHINOEKI",ME+"810/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E9%98%BF%E5%AF%92%E4%B8%B9%E9%A0%82%E3%81%AE%E9%87%8C")],
  43.144167,144.145028,"high","ja.wikipedia 道の駅阿寒丹頂の里 infobox (北緯43度8分39.0秒 東経144度8分42.1秒) via WebSearch",O,"hokkaido-michinoeki.jp (restaurant 11:00-14:30, 17:00-20:30)")
S(2,"DOTO","Hokkaido Museum of Northern Peoples, Abashiri (北海道立北方民族博物館)","Mt Tento, Shiomi, Abashiri, Hokkaido, Japan",
  "Japan's only museum of the circumpolar peoples — Ainu, Okhotsk culture, Inuit, Sámi — on Mt Tento near the drift-ice museum.",
  [("MAPPLE","https://www.mapple.net/article/43878/"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/plan/detail_28.html"),("WIKIPEDIA_JA",JA+"%E5%8C%97%E6%B5%B7%E9%81%93%E7%AB%8B%E5%8C%97%E6%96%B9%E6%B0%91%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8")],
  43.99675,144.239667,"high","ja.wikipedia 北海道立北方民族博物館 infobox (北緯43度59分48.3秒 東経144度14分22.8秒) via WebSearch",O,"mapple Abashiri article (current)",k="Ainu & northern-peoples museum",g=["MUS","AINU","HISTORY"])
S(3,"DOTO","Moyoro Shell Mound & Site Museum, Abashiri (モヨロ貝塚・モヨロ貝塚館)","Mouth of the Abashiri River, Kitamachi, Abashiri, Hokkaido, Japan",
  "National historic site of the seafaring Okhotsk culture (5th–9th c.) at the Abashiri river mouth, with burials, shell middens and a site museum.",
  [("HOKKAIDOTOURISM",VH+"11159.html"),("WIKIPEDIA_JA",JA+"%E3%83%A2%E3%83%A8%E3%83%AD%E8%B2%9D%E5%A1%9A")],
  44.025,144.267694,"high","ja.wikipedia モヨロ貝塚 infobox (北緯44度1分30.0秒 東経144度16分3.7秒) via WebSearch",O,"visit-hokkaido 11159 (current)",k="Okhotsk-culture site",g=["HISTORY","MUS"])
S(2,"DOTO","Hosooka Observatory, Kushiro Marsh (細岡展望台)","Tōro, Kushiro-chō, Kushiro District, Hokkaido, Japan",
  "The 'Taikanbō' — the classic view of the marsh with the Kushiro River's S-bends to the horizon and the Akan peaks behind; famed at sunset.",
  [("HOKKAIDOTOURISM",VH+"10181.html"),("RURUBU",RU+"80001843"),("KUSHIROTOURISM","http://en.kushiro-lakeakan.com/things_to_do/3775/"),("WIKIPEDIA_JA",JA+"%E7%B4%B0%E5%B2%A1%E5%B1%95%E6%9C%9B%E5%8F%B0")],
  43.098111,144.449306,"high","ja.wikipedia 細岡展望台 infobox (北緯43度5分53.2秒 東経144度26分57.5秒) via WebSearch",O,"rurubu 80001843 (lounge 9-18 Apr-Sep)",k="marsh viewpoint",g=["VIEW","NATURE","FREE"])
S(3,"DOTO","Cape Kiritappu (霧多布岬 / 湯沸岬)","Tōbutsu, Hamanaka, Akkeshi District, Hokkaido, Japan",
  "Sheer cliffs on the Pacific where sea otters and seals are watched from the headland — Hamanaka's signature viewpoint.",
  [("RURUBU",RU+"80001859"),("WIKIPEDIA_JA",JA+"%E6%B9%AF%E6%B2%B8%E5%B2%AC%E7%81%AF%E5%8F%B0")],
  43.07722,145.16806,"med","ja.wikipedia 湯沸岬灯台 infobox (lighthouse on the cape; 北緯43度04分38秒 東経145度10分05秒) via WebSearch",O,"rurubu 80001859 (free parking)",k="sea-otter cliffs",g=["VIEW","NATURE","FREE"])
S(2,"DOTO","Akan International Crane Center 'GRUS' (阿寒国際ツルセンター)","23-40 Kamiakan, Akan-chō, Kushiro, Hokkaido, Japan",
  "Winter feeding ground and research centre where red-crowned cranes dance on the snowfields at close range.",
  [("KUSHIROTOURISM","http://ja.kushiro-lakeakan.com/sightseeing_around/16279/"),("WIKIPEDIA_JA",JA+"%E9%98%BF%E5%AF%92%E5%9B%BD%E9%9A%9B%E3%83%84%E3%83%AB%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC")],
  status=O,ssrc="kushiro-lakeakan.com winter feature (current)",k="red-crowned cranes",g=["NATURE","WINTER"])
S(3,"DOTO","Cape Notoro, Abashiri (能取岬)","Bihoro, Abashiri, Hokkaido, Japan",
  "40–50 m sea cliffs jutting into the Okhotsk with a lone lighthouse — a drift-ice lookout from late January to early March.",
  [("HOKKAIDOTOURISM",VH+"10263.html"),("RURUBU",RU+"80000971"),("WIKIPEDIA_JA",JA+"%E8%83%BD%E5%8F%96%E5%B2%AC%E7%81%AF%E5%8F%B0")],
  44.112222,144.24306,"med","ja.wikipedia 能取岬灯台 infobox (lighthouse on the cape; 北緯44度6分44.0秒 東経144度14分35秒) via WebSearch",O,"visit-hokkaido 10263 (free parking)",k="drift-ice cape",g=["VIEW","WINTER","FREE"])
S(3,"DOTO","Meiji Park & Brick Silos, Nemuro (明治公園)","Meiji-chō, Nemuro, Hokkaido, Japan",
  "Site of Hokkaido's second state ranch (1875); its three 15 m red-brick silos are among Japan's largest — registered cultural property and modernization heritage.",
  [("RURUBU",RU+"80001062"),("WIKIPEDIA_JA",JA+"%E6%98%8E%E6%B2%BB%E5%85%AC%E5%9C%92_(%E6%A0%B9%E5%AE%A4%E5%B8%82)")],
  43.33472,145.59861,"high","ja.wikipedia 明治公園 (根室市) infobox (北緯43度20分05秒 東経145度35分55秒) via WebSearch",O,"rurubu 80001062 (free entry)",k="heritage silos",g=["HISTORY","FREE"])
S(3,"DOTO","Shunkunitai Sandspit, Nemuro (春国岱)","Between Lake Fūren and Nemuro Bay, Nemuro, Hokkaido, Japan",
  "An 8 km sandspit with a rare pure forest of Sakhalin spruce on dunes, 3 km of rugosa roses and some of Hokkaido's best birding.",
  [("RURUBU",RU+"80001071"),("WIKIPEDIA_JA",JA+"%E6%98%A5%E5%9B%BD%E5%B2%B1")],
  43.27917,145.42833,"high","ja.wikipedia 春国岱 infobox (北緯43度16分45秒 東経145度25分42秒) via WebSearch",O,"rurubu 80001071 (current)",k="birding sandspit",g=["NATURE","FREE"])

# ---------------- TKC ----------------
F(2,"TKC",["HOKKAIDO","CAFE"],"raclette and dishes made with the farm's own cheese; nama-caramel","Hanabatake Bokujō, Nakasatsunai (花畑牧場)",
  "Moto-Satsunai Higashi 4-sen 311-6, Nakasatsunai, Kasai District, Hokkaido, Japan",
  "Tanaka Yoshitaka's showcase ranch, birthplace of the nama-caramel boom — the café serves its own-cheese dishes and sweets.",
  [("RURUBU",RU+"80001820"),("MAPPLE",MP+"1010383/")],
  status=O,ssrc="rurubu 80001820 (current)")
F(2,"TKC",["SAKE"],"Tokachi junmai sake brewed on campus","Kamikawa Taisetsu Shuzō Hekiun-gura, Obihiro (上川大雪酒造 碧雲蔵)",
  "Obihiro University of Agriculture and Veterinary Medicine campus, Obihiro, Hokkaido, Japan",
  "Japan's first university-partnered sake brewery (2020), on the Obihiro agricultural university campus, brewing with Satsunai River water and Hokkaido rice.",
  [("HOKKAIDOTOURISM",VH+"12566.html"),("WIKIPEDIA_JA",JA+"%E4%B8%8A%E5%B7%9D%E5%A4%A7%E9%9B%AA%E9%85%92%E9%80%A0")],
  status=O,ssrc="visit-hokkaido 12566 (current)")
S(3,"TKC","Michi-no-eki Nakasatsunai & Bean Museum (道の駅 なかさつない)","Nakasatsunai, Kasai District, Hokkaido, Japan",
  "Flower-filled roadside station under the Hidaka range with seven eateries, a bean museum and a pioneer memorial hall — the gateway to the Nakasatsunai art village.",
  [("OBIKAN","https://www.obikan.jp/tokachi-fc/location/location-696/"),("HOKKAIDOMICHINOEKI","https://2016.hokkaido-michinoeki.jp/michinoeki/892/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%AA%E3%81%8B%E3%81%95%E3%81%A4%E3%81%AA%E3%81%84")],
  42.69214,143.12683,"high","ja.wikipedia 道の駅なかさつない infobox (北緯42度41分32秒 東経143度07分37秒) via WebSearch",O,"obikan location page (current)",k="roadside station & bean museum",g=["FAMILY","FREE"])
S(2,"TKC","Shichiku Garden, Obihiro (紫竹ガーデン)","Bisei-chō, Obihiro, Hokkaido, Japan",
  "Shichiku Akiyo's 18,000-tsubo flower garden on the Tokachi plain — ~2,500 varieties and a fixture of the Hokkaido Garden Path.",
  [("HOKKAIDOTOURISM",VH+"10128.html"),("RURUBU",RU+"80000900"),("WIKIPEDIA_JA",JA+"%E7%B4%AB%E7%AB%B9%E6%98%AD%E8%91%89")],
  status=O,ssrc="visit-hokkaido 10128 (open 3rd Sat Apr-late Oct, 8-17)",k="flower garden",g=["GARDEN","SUMMER"])
S(3,"TKC","Former Aikoku Station, Obihiro (旧国鉄広尾線 愛国駅)","Aikoku-chō, Obihiro, Hokkaido, Japan",
  "The 'From Aikoku (Land of Love) to Kōfuku (Happiness)' ticket station of the closed Hiroo Line — now a small railway museum with an SL.",
  [("HOKKAIDOTOURISM",VH+"10130.html"),("OBIKAN","https://obikan.jp/post_spot/1490/"),("RURUBU","https://rurubu.jp/andmore/article/10395"),("WIKIPEDIA_JA",JA+"%E6%84%9B%E5%9B%BD%E9%A7%85")],
  42.837139,143.193694,"high","ja.wikipedia 愛国駅 infobox (北緯42度50分13.7秒 東経143度11分37.3秒) via WebSearch",O,"visit-hokkaido 10130 (9-17)",k="railway-romance station",g=["HISTORY","FREE"])

# ---------------- SOYA ----------------
F(2,"SOYA",["HOKKAIDO","SUSHI"],"fresh bafun-uni don and Rishiri ramen","Isoyakitei, Rishiri (磯焼亭)",
  "Oshidomari, Rishirifuji, Rishiri District, Hokkaido, Japan",
  "Opposite Oshidomari ferry terminal — Rishiri's raw bafun-uni bowls (Apr-Oct) and kombu-broth Rishiri ramen.",
  [("MAPPLE",MP+"1015933/"),("RISHIRITOURISM","https://www.rishiri-plus.jp/shima-shop/isoyakitei/")],
  status=O,ssrc="mapple 1015933 (Apr-Oct 10-19)")
F(2,"SOYA",["HOKKAIDO","IZAKAYA"],"takoshabu (Sōya Strait octopus shabu-shabu)","Kurumaya Genji, Wakkanai (車屋・源氏)",
  "2-8-22 Chūō, Wakkanai, Hokkaido, Japan",
  "The Wakkanai name for takoshabu — paper-thin mizudako from the Sōya Strait swished in broth, the city's signature dish.",
  [("RURUBU",RU+"80001027"),("MAPPLE",MP+"1000650/")],
  status=O,ssrc="rurubu 80001027 (11-13:30, 17-21)")
F(2,"SOYA",["HOKKAIDO","SUSHI"],"'undefeated' raw uni-don","Karafuto Shokudō, Wakkanai (樺太食堂)",
  "2-2-6 Noshappu, Wakkanai, Hokkaido, Japan",
  "Seasonal fishermen-direct uni-don shack by Cape Noshappu, made famous by touring riders.",
  [("RURUBU",RU+"80001031"),("MAPPLE","https://www.mapple.net/pref/01214_g03000000/spot/")],
  status=O,ssrc="rurubu 80001031 (late Apr-mid Oct, 9-14:30)")
S(3,"SOYA","Wakkanai Fukukō Market (稚内副港市場)","1-6-28 Minato, Wakkanai, Hokkaido, Japan",
  "Harbourside complex of seafood market, Hatoba Yokochō food stalls, the Minato no Yu onsen with sea views and a Karafuto history exhibit.",
  [("HOKKAIDOTOURISM",VH+"11269.html"),("MAPPLE",MP+"1015056/"),("WAKKANAITOURISM","https://welcome.wakkanai.hokkaido.jp/archives/23889")],
  status=O,ssrc="mapple 1015056 (8-23 year-round)",k="market & onsen complex",g=["ONSEN","MKT"])
S(3,"SOYA","Otatomari Pond, Rishiri (オタトマリ沼)","Numaura, Oniwaki, Rishirifuji, Rishiri District, Hokkaido, Japan",
  "Rishiri's largest pond, ringed by Japan's northernmost Sakhalin-spruce forest, with Mt Rishiri reflected in still water.",
  [("HOKKAIDOTOURISM",VH+"10396.html"),("RURUBU",RU+"80001619")],
  status=O,ssrc="visit-hokkaido 10396 (May-Oct)",k="Rishiri-Fuji reflection",g=["NATURE","VIEW","FREE"])

emit("W84")
