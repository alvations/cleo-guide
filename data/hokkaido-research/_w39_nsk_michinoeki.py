#!/usr/bin/env python3
# W39 — NSK food: Yōtei-foothill roadside stations with signature foods (ja.wikipedia pins). WebSearch 2026-10-02 (s3).
from _hk import F, emit
JA="https://ja.wikipedia.org/wiki/"; RU="https://rurubu.jp/andmore/"
O="open"
F(1,"NSK",["MKT","HOKKAIDO"],"'Tōge no age-imo' — the original Nakayama Pass fried potato skewer","Michi-no-eki Bōyō Nakayama, Nakayama Pass (道の駅 望羊中山)",
  "Nakayama Pass (Route 230), Kimobetsu, Abuta District, Hokkaido, Japan",
  "The pass-top stop where Sapporo drivers first see Mt Yōtei — famous for battered, fried Danshaku potatoes from the Yōtei foothills, plus Nakayama chicken and Rusutsu-pork butadon.",
  [("RURUBU",RU+"spot/80001374"),("HOKKAIDOSHIMBUN","https://tripeat.hokkaido-np.co.jp/doushin/66515/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E6%9C%9B%E7%BE%8A%E4%B8%AD%E5%B1%B1")],
  42.85581,141.09667,"high","ja.wikipedia 道の駅望羊中山 infobox (北緯42度51分21秒 東経141度05分48秒) via WebSearch",O,"rurubu&more spot page (prices current)")
F(2,"NSK",["MKT","HOKKAIDO"],"Niseko farm-stand produce, house ham and ice cream","Michi-no-eki Niseko View Plaza (道の駅 ニセコビュープラザ)",
  "Niseko, Abuta District, Hokkaido, Japan",
  "Niseko's roadside farm market — local vegetables and fruit straight from the growers, handmade ham and ice cream, with Yōtei and Annupuri views.",
  [("RURUBU",RU+"spot/80001351"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%83%8B%E3%82%BB%E3%82%B3%E3%83%93%E3%83%A5%E3%83%BC%E3%83%97%E3%83%A9%E3%82%B6")],
  42.79942,140.70233,"high","ja.wikipedia 道の駅ニセコビュープラザ infobox (北緯42度47分58秒 東経140度42分08秒) via WebSearch",O,"rurubu&more spot page (current)")
F(3,"NSK",["SWEET","MKT"],"village-milk and local-rice gelato, fresh-baked bread","Michi-no-eki Akaigawa (道の駅 あかいがわ)",
  "Maple Kaidō, Akaigawa, Yoichi District, Hokkaido, Japan",
  "A newer roadside station on the Maple Kaidō between Kiroro and Niseko — bread baked on site from local ingredients, Akaigawa milk, and gelato made with the village's rice.",
  [("HOKKAIDOTOURISM","https://travel-navi.visit-hokkaido.jp/tourism/8213/"),("WIKIPEDIA_JA",JA+"%E9%81%93%E3%81%AE%E9%A7%85%E3%81%82%E3%81%8B%E3%81%84%E3%81%8C%E3%82%8F")],
  43.05103,140.84478,"high","ja.wikipedia 道の駅あかいがわ infobox (北緯43度03分04秒 東経140度50分41秒) via WebSearch",O,"visit-hokkaido travel-navi listing (current)")
emit("W39")
