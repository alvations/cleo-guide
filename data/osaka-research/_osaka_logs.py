p="docs/AGENT-PROMPTS.md"; s=open(p).read().split("\n")
if not any(l.startswith("| 2026-10-02 | Osaka | W2") for l in s):
    idx=max(i for i,l in enumerate(s) if l.startswith("| 2026-10-02"))
    s.insert(idx+1,"| 2026-10-02 | Osaka | W2 discovery + geocode + build + go-live (main + workers G1/S1/M1/M2) | held W1 Bibs, konamon canon, Michelin Osaka harvest, sights all 9 areas | 189 discovered, 166 rendered (61 sights + 105 food) | 0 closures; Housing & Living museum closed for renovation (not added); 3 Michelin held (no dish); street-food pins UNVERIFIED; Time Out singles pending | FOOD_OSAKA_W2/M1/M2, SIGHTS_OSAKA_W2/S1, SOURCES_OSAKA_W2, geo/_geoout_osaka_{W2,W2u,G1,M1,M2,S1}.json, _pending_osaka_W2.json |")
    open(p,"w").write("\n".join(s))
p="docs/RESEARCH-LOG.md"; s=open(p).read()
if "Osaka W2 (search techniques" not in s:
    s+='''

### 2026-10-02 — Osaka W2 (search techniques & dead ends)
- **Michelin venue pins, 2–3 per query:** `allowed_domains:["guide.michelin.com"]` + "<A>; <B>; <C> Osaka address latitude longitude" returns each venue page's address + lat/lng (~2.5 pins per search). Mine Michelin *articles* ("N New Bib Gourmands …", "December 2025: latest additions …") for name lists first, then pin them.
- **Fan-out trap:** when names in a batched query are NOT on the restricted domain (street-food stalls on Michelin, creators), the search tool silently runs 4–5 sub-searches — only batch names known to hit.
- **Japanese Wikipedia coordinates:** `allowed_domains:["ja.wikipedia.org"]` "<名称> 座標; <名称> 座標; <名称> 座標" hit 3/3 for markets, arcades and gardens that en.wikipedia lacks (黒門市場, 心斎橋筋商店街, アメリカ村, 慶沢園, 天王寺公園).
- **Dead ends:** mapcarta/OSM search (no venue pages); Tabelog まとめ (user lists — not Hyakumeiten, zero); broad creator queries (Paolo fromTOKYO / Abroad in Japan / Mark Wiens / "Somebody Feed Phil" — no Osaka episode) returned nothing findable; brands.japan-guide.com and japan-guide /ad/ pages are sponsored.
- **Hyōgo:** Michelin's first Kobe & Awaji selection is announced Feb 2027 — no Hyōgo Michelin to lean on until then.
'''
    open(p,"w").write(s)
