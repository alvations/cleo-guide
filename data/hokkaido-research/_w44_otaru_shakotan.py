#!/usr/bin/env python3
# W44 — OTARU food & drink: Shakotan uni-don canon + Otaru sake/beer/sweets. WebSearch 2026-10-02 (s3).
# Attribution caveat (Shakotan): one merged result set of rurubu spot pages + visit-hokkaido uni features + MAPPLE
# uni article — each shop cites the outlets that surfaced it; re-verify per-outlet at refresh.
from _hk import F, emit
RU="https://rurubu.jp/andmore/"; MP="https://www.mapple.net/"; OT="https://otaru.gr.jp/"
O="open"
F(1,"OTARU",["SUSHI","HOKKAIDO"],"Shakotan uni-don — red vs purple uni side by side (Jun–Aug)","Nakamuraya, Shakotan (中村屋)",
  "Shakotan, Shakotan District, Hokkaido, Japan",
  "An uni fisherman's own shop: additive-free sea urchin landed that morning, with a ten-a-day bowl comparing bafun (red) and murasaki (purple) uni in season.",
  [("RURUBU",RU+"spot/80001400"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/korezo/detail/105")],status=O,ssrc="rurubu&more spot page (prices current)")
F(2,"OTARU",["SUSHI","HOKKAIDO"],"additive-free Shakotan uni-don over the 'Shakotan Blue' sea","Shokudō Ushio, Shakotan (食堂 うしお)",
  "Shakotan, Shakotan District, Hokkaido, Japan",
  "A half-century seaside canteen buying uni straight from the fishermen and serving it untreated, with the cape's blue water out the window.",
  [("RURUBU",RU+"spot/80108471"),("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/syakotanuni/")],status=O,ssrc="rurubu&more spot page (current)")
F(2,"OTARU",["SUSHI","HOKKAIDO"],"20-a-day red bafun-uni bowl (Jun–Aug)","Oshokujidokoro Misaki, Shakotan (お食事処 みさき)",
  "Near Cape Kamui, Shakotan, Shakotan District, Hokkaido, Japan",
  "Fisherman-run at the tip of the peninsula — the owner is out for uni at 4am, and the limited bafun bowl sells out daily in season.",
  [("HOKKAIDOTOURISM","https://visit-hokkaido.jp/line/syakotanuni/"),("MAPPLE",MP+"article/267549/")],status=O,ssrc="visit-hokkaido.jp uni feature (current)")
F(1,"OTARU",["SAKE"],"year-round Otaru sake from Hokkaido rice and Mt Tengu water — free tasting","Tanaka Shuzō Kikkōgura, Otaru (田中酒造 亀甲蔵)",
  "Shinkō-chō 2-2, Otaru, Hokkaido, Japan",
  "An 1899 brewery in a stone warehouse that brews all four seasons thanks to Hokkaido's cool climate — walk the brewery, then taste free.",
  [("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/spot/detail_11319.html"),("RURUBU",RU+"spot/80000589"),("OTARUTOURISM",OT+"guidemap/gourmet-japanese-sake")],status=O,ssrc="visit-hokkaido.jp spot 11319 (hours current)")
F(1,"OTARU",["SAKE","INT"],"Otaru Beer German-style lagers brewed in the canal warehouse","Otaru Sōko No.1 — Otaru Beer (小樽倉庫No.1)",
  "Minato-machi 5-4, Otaru, Hokkaido 047-0007, Japan",
  "A brewpub inside a canal-side stone warehouse with the brewery on view — lagers from German organic barley and Otaru's soft water, with German-style plates.",
  [("OTARUTOURISM",OT+"guidemap/gourmet-beer"),("HOKKAIDOTOURISM","https://www.visit-hokkaido.jp/plan/detail_79.html")],status=O,ssrc="otaru.gr.jp beer guide (hours current)")
F(2,"OTARU",["SWEET"],"'Hanazono dango' — rice-flour dumplings under a hand-swept wave of bean paste (since 1895)","Niikuraya Hanazono Honten, Otaru (新倉屋 花園本店)",
  "Hanazono 1-3-1, Otaru, Hokkaido, Japan",
  "An 1895 wagashi house whose Hanazono dango wear their red-bean paste in a single mountain-shaped sweep.",
  [("RURUBU",RU+"spot/80000604"),("MAPPLE",MP+"spot/1010615/"),("OTARUTOURISM",OT+"guidemap/dango")],status=O,ssrc="rurubu&more spot page (current)")
F(2,"OTARU",["SWEET","CAFE"],"cream zenzai — red beans, mochi and soft-serve","Amatō, Otaru (あまとう)",
  "Inaho 2-chōme 16-3, Otaru, Hokkaido, Japan",
  "A Shōwa-era Otaru sweet parlour still loved for its cream zenzai.",
  [("OTARUTOURISM",OT+"guidemap/sweets-creamzenzai"),("MAPPLE",MP+"article/41237/")],status=O,ssrc="otaru.gr.jp sweets guide (current)")
emit("W44")
