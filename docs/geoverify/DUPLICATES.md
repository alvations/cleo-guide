# Registry duplicates (location-verify --duplicates)

_Generated 2026-10-16 from data/geocodes.json and the committed docs/geoverify/<city>.json reports. Report only: fixing is a research / data job. For each pair the status evidence is shown so the current one can be decided against a real source (CLAUDE.md 4c)._

**42 pair(s)** — open + CLOSED: 6 · one OSM object: 9 · similar names, same spot: 27

## open + CLOSED

| city | name A | A: status · checked · source | name B | B: status · checked · source | why |
|---|---|---|---|---|---|
| chicago-il | Edzo's Burger Shop | open · 2026-10-03 · https://www.timeout.com/chicago/restaurants/edzos-burger-shop (current listing with hours, search 2026-10-03; no closure reported) | Edzo's Burger Shop — CLOSED | closed · 2026-10-03 · https://evanstonroundtable.com/2024/12/22/at-this-time-edzos-last-supper/ (Evanston RoundTable: last day of service Sat 21 Dec 2024) + https | the same name exists bare and with the closed marker |
| erie-pa | Enrique's Southeast Mexico Taqueria & Tortilleria | open · 2026-08-30 ·  | Enrique's Southeast Mexico Taqueria & Tortilleria — CLOSED | closed · 2026-08-30 ·  | the same name exists bare and with the closed marker |
| miami-fl | The Fillmore Miami Beach (Jackie Gleason Theater) | open · 2026-10-02 · Songkick venue page lists 2026 shows (e.g. WOODZ 31 Jul 2026) https://www.songkick.com/venues/244628-fillmore-miami-beach-at-jackie-gleason- | The Fillmore Miami Beach (Jackie Gleason Theater) — CLOSED | closed · 2026-10-03 · Miami New Times + WLRN (Mar 2024): closed 31 May 2022, no reopening found (geocode w8); w7's Songkick-listing 'open' rejected as unconfirmed | the same name exists bare and with the closed marker |
| philadelphia-pa | Manakeesh Cafe Bakery & Grill | open · 2026-10-03 · Zabihah listing (record created Sep 2024) https://www.zabihah.com/biz/Philadelphia/Manakeesh-Cafe-Bakery/rXnLzCA3v8 ; Visit Philly halal gui | Manakeesh Cafe Bakery & Grill — CLOSED | closed · 2026-10-03 · West Philly Local (westphillylocal.com/tag/manakeesh): the Lebanese cafe at 45th & Walnut permanently closed after 15 years, last day Tue 17 | the same name exists bare and with the closed marker |
| singapore | Chợ Nổi Cái Bè (Cái Bè Floating Market) | open · 2026-10-03 ·  | Chợ Nổi Cái Bè (Cái Bè Floating Market) — CLOSED | closed · 2026-09-02 · Vietnam.vn 2025 / Tripadvisor — market defunct since the COVID pandemic, no longer operating as of Aug 2025 (only Cái Răng & Long Xuyên rema | the same name exists bare and with the closed marker |
| singapore | Denzy Gelato | open · 2026-10-03 ·  | Denzy Gelato (Bishan) — CLOSED | closed · 2026-10-03 ·  | the same name exists bare and with the closed marker |

## one OSM object

| city | name A | A: status · checked · source | name B | B: status · checked · source | why |
|---|---|---|---|---|---|
| erie-pa | Tandoori Hut | open · 2026-08-30 ·  | Tandoori Hut Indian Cuisine | open · 2026-08-30 ·  | both resolved to OSM node/8529356114 in docs/geoverify/erie-pa.json |
| erie-pa | Enrique's Southeast Mexico Taqueria & Tortilleria — CLOSED | closed · 2026-08-30 ·  | Enrique's Southeast Mexico Taqueria & Tortilleria | open · 2026-08-30 ·  | both resolved to OSM way/1016678162 in docs/geoverify/erie-pa.json |
| erie-pa | Enrique's Southeast Mexico Taqueria & Tortilleria — CLOSED | closed · 2026-08-30 ·  | Ippa Pizza Napoletana | open · 2026-08-30 ·  | both resolved to OSM way/1016678162 in docs/geoverify/erie-pa.json |
| erie-pa | Enrique's Southeast Mexico Taqueria & Tortilleria — CLOSED | closed · 2026-08-30 ·  | Dina's Authentic Dominican Kitchen | open · 2026-08-30 ·  | both resolved to OSM way/1016678162 in docs/geoverify/erie-pa.json |
| erie-pa | Enrique's Southeast Mexico Taqueria & Tortilleria | open · 2026-08-30 ·  | Ippa Pizza Napoletana | open · 2026-08-30 ·  | both resolved to OSM way/1016678162 in docs/geoverify/erie-pa.json |
| erie-pa | Enrique's Southeast Mexico Taqueria & Tortilleria | open · 2026-08-30 ·  | Dina's Authentic Dominican Kitchen | open · 2026-08-30 ·  | both resolved to OSM way/1016678162 in docs/geoverify/erie-pa.json |
| erie-pa | Ippa Pizza Napoletana | open · 2026-08-30 ·  | Dina's Authentic Dominican Kitchen | open · 2026-08-30 ·  | both resolved to OSM way/1016678162 in docs/geoverify/erie-pa.json |
| miami-fl | The Fillmore Miami Beach (Jackie Gleason Theater) | open · 2026-10-02 · Songkick venue page lists 2026 shows (e.g. WOODZ 31 Jul 2026) https://www.songkick.com/venues/244628-fillmore-miami-beach-at-jackie-gleason- | The Fillmore Miami Beach (Jackie Gleason Theater) — CLOSED | closed · 2026-10-03 · Miami New Times + WLRN (Mar 2024): closed 31 May 2022, no reopening found (geocode w8); w7's Songkick-listing 'open' rejected as unconfirmed | both resolved to OSM way/590186839 in docs/geoverify/miami-fl.json |
| philadelphia-pa | Manakeesh Cafe Bakery & Grill | open · 2026-10-03 · Zabihah listing (record created Sep 2024) https://www.zabihah.com/biz/Philadelphia/Manakeesh-Cafe-Bakery/rXnLzCA3v8 ; Visit Philly halal gui | Manakeesh Cafe Bakery & Grill — CLOSED | closed · 2026-10-03 · West Philly Local (westphillylocal.com/tag/manakeesh): the Lebanese cafe at 45th & Walnut permanently closed after 15 years, last day Tue 17 | both resolved to OSM node/2108022395 in docs/geoverify/philadelphia-pa.json |

## similar names, same spot

_Candidates only: a stall in a hawker centre, a sub-temple or a restaurant on a named street can look alike. Check each by hand._

| city | name A | A: status · checked · source | name B | B: status · checked · source | why |
|---|---|---|---|---|---|
| aachen | Het Romeins Museum (Thermenmuseum) - CLOSED | open · 2026-09-01 ·  | Het Romeins Museum (Thermenmuseum) — CLOSED | closed · 2026-09-01 · https://www.hetromeinsmuseum.nl/geschiedenis | name similarity 1, 0 m apart |
| columbus-oh | Red Brick Tavern | open · 2026-08-24 · Facebook (Historic Red Brick Tavern) active; operating restaurant | The Red Brick Tavern | open · 2026-08-24 · historicredbricktavern.com; reopened Feb 2023 by Massey Bros; Yelp active Aug 2026 | name similarity 1, 0 m apart |
| kyoto | Ryōan-ji | open · 2026-10-02 · UNESCO World Heritage listing (active property); https://whc.unesco.org/en/list/688/maps | Ryōan-ji Seigen-in (龍安寺 西源院) | open · 2026-10-02 · Rurubu spot listing https://rurubu.jp/andmore/spot/80027181 (discovery listing); checked 2026-10-02 | name similarity 0.9, 0 m apart |
| new-york-ny | Wah Fung No 1 | open · 2026-08-10 · NYC research pass 2026-08-10 — fact-checked open via 2026 sources (Michelin/Eater/Infatuation/official) | Wah Fung No. 1 Fast Food | open · 2026-08-10 · NYC research pass 2026-08-10 — fact-checked open via 2026 sources (Michelin/Eater/Infatuation/official) | name similarity 0.9, 10 m apart |
| okinawa | Makishi Public Market (第一牧志公設市場) | open · 2026-10-03 · Stripes: reopened in new 3-storey building (84 shops), hours 8–22 | Kiraku, Makishi Public Market 2F (きらく 第一牧志公設市場) | open · 2026-10-03 · Ryukyu Shimpo 933592 and co-trip 613167 describe mochiage at the rebuilt market (opened 2023-03); no closure notice found (2026-10) | name similarity 0.9, 0 m apart |
| osaka | Dōtonbori | open · 2026-10-03 · public street / canal district | Kani Doraku Dōtonbori Honten (かに道楽 道頓堀本店) | open · 2026-10-03 · carried over from dataset record (not re-checked in W7E); MapFan spot listing live 2026-10-03 https://mapfan.com/spots/S5CQC,E0,W56CP0 | name similarity 0.9, 22 m apart |
| pittsburgh-pa | Pamela's Diner (Strip) | open · 2026-08-10 · Yelp updated Aug 2026 with current hours; official pamelasdiner.com lists Strip District location | Pamela's Diner | open · 2026-08-13 · Yelp 'Updated 2026' + active official site; classic-PGH Mode C fact-check 2026-08-13 | name similarity 1, 0 m apart |
| pittsburgh-pa | De Luca's Diner | open · 2026-08-10 · active hours + Jul 2026 Yelp reviews; Jan 2026 Post-Gazette story on its 75th anniversary | DeLuca's Diner | open · 2026-08-13 · Yelp 'Updated August 2026' + active official site; classic-PGH Mode C fact-check 2026-08-13 | name similarity 1, 17 m apart |
| saarland | Brasserie Excelsior | open · 2026-08-31 ·  | Brasserie L'Excelsior | open · 2026-08-31 ·  | name similarity 0.914, 0 m apart |
| saarland | Place Stanislas, Place de la Carrière & Place d'Alliance | open · 2026-08-31 ·  | Place Stanislas (Nancy) | open · 2026-08-31 ·  | name similarity 0.9, 0 m apart |
| saarland | Villa Majorelle | open · 2026-08-31 ·  | Villa Majorelle (Nancy) | open · 2026-08-31 ·  | name similarity 1, 0 m apart |
| saarland | Palais des Ducs de Lorraine – Musée Lorrain | open · 2026-08-31 ·  | Palais des ducs de Lorraine – Musée Lorrain (Nancy) | open · 2026-08-31 ·  | name similarity 1, 0 m apart |
| saarland | Porte de la Craffe | open · 2026-08-31 ·  | Porte de la Craffe (Nancy) | open · 2026-08-31 ·  | name similarity 1, 0 m apart |
| saarland | Basilique Saint-Epvre | open · 2026-08-31 ·  | Basilique Saint-Epvre & Ville Vieille (Nancy) | open · 2026-08-31 ·  | name similarity 0.9, 0 m apart |
| saarland | Parc de la Pépinière | open · 2026-08-31 ·  | Parc de la Pépinière (Nancy) | open · 2026-08-31 ·  | name similarity 1, 0 m apart |
| saarland | Cathédrale Notre-Dame-de-l'Annonciation de Nancy | open · 2026-08-31 ·  | Cathédrale Notre-Dame-de-l'Annonciation (Nancy) | open · 2026-08-31 ·  | name similarity 0.904, 0 m apart |
| silicon-valley-ca | Android Lawn Statues | open · 2026-08-14 · Wikipedia/Atlas Obscura; outdoor installation still on site next to Google Visitor Center | Google Android Lawn Statues & Visitor Experience | open · 2026-08-14 · Public installation next to Google Visitor Center; Wikipedia/Atlas Obscura active listings | name similarity 0.9, 10 m apart |
| silicon-valley-ca | SoFA District & SoFA Market | open · 2026-08-14 · SoFA Market open daily 11am-9pm; Yelp updated Aug 2026 | SoFA District | open · 2026-08-14 · Active downtown arts/entertainment district; Visit San Jose listing | name similarity 0.9, 0 m apart |
| silicon-valley-ca | Cantor Arts Center | open · 2026-08-14 · Official museum.stanford.edu site active; Yelp updated Jul 2026 | Cantor Arts Center & Rodin Sculpture Garden | open · 2026-08-14 · museum.stanford.edu active; open museum | name similarity 0.9, 5 m apart |
| singapore | Song Kee Teochew Fish Porridge | open · 2026-09-02 · https://newtonfoodcentre.com/ | Kwang Kee Teochew Fish Porridge | open · 2026-10-03 · Seth Lui Newton guide Oct 2024 update; MICHELIN listing live | name similarity 0.902, 0 m apart |
| singapore | The Cafe Apartment | open · 2026-09-02 · Vietnam Airlines / Vietnam Coracle 2026 guides; iconic operating cafe-apartment building | The Cafe Apartment (42 Nguyen Hue) | open · 2026-09-02 · Open; active cafe/retail building, current 2026 hours 8am-10pm (silverlandhotels/vietnamairlines 2026) | name similarity 1, 0 m apart |
| singapore | Stir | open · 2026-09-02 · Listed on Asia's 50 Best Bars discovery and The World's 50 Best; active; no closure notice found | Stir - Modern Classic Cocktail | open · 2026-09-02 · Listed on Asia's 50 Best Bars discovery / The World's 50 Best; active; no closure notice found | name similarity 0.9, 0 m apart |
| singapore | Old Upper Thomson Road (former Grand Prix circuit) | open · 2026-10-03 ·  | Old Upper Thomson Road (Thomson Road Grand Prix Circuit) | open · 2026-10-03 ·  | name similarity 1, 0 m apart |
| singapore | Goodwood Park Hotel (Tower Wing) | open · 2026-10-03 · Operating hotel; not re-checked this pass (no WebSearch budget spent on status); 2026-10-02 | Goodwood Park Hotel Coffee Lounge (durian desserts) | open · 2026-10-03 · Eatbook durian-buffet coverage (2024 edition) + Time Out listing; no closure report | name similarity 0.9, 0 m apart |
| tokyo | Shibamata Taishakuten (柴又帝釈天) | open · 2026-10-02 · GO TOKYO spot page (current) | Taishakuten-Sandō, Shibamata (帝釈天参道) | open · 2026-10-02 · GO TOKYO spot page (current) | name similarity 0.9, 14 m apart |
| youngstown-oh | Youngstown Historical Center of Industry and Labor | open · 2026-08-10 · Official yhcil.org; Ohio History Connection; Yelp 'Updated May 2026' with current hours | Youngstown Historical Center of Industry and Labor (the "Steel Museum") | open · 2026-08-10 · Ohio History Connection site + yhcil.org list current 2026 hours (Wed–Sat) and admission; Yelp updated April 2026 | name similarity 1, 28 m apart |
| youngstown-oh | Roger & Gloria Jones Children's Center for Science & Technology | open · 2026-08-10 · OH WOW! official site + WFMJ news; new exhibit hosted Apr 2026, operating in downtown Youngstown | Roger & Gloria Jones Children's Center for Science & Technology (OH WOW!) | open · 2026-08-10 · Official site ohwowkids.org + WFMJ news of April 2026 exhibit; 2026 free-admission Wednesdays program | name similarity 1, 32 m apart |

