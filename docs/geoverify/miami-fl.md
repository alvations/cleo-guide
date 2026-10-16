# Location-verify report — miami-fl

_Generated 2026-10-16 by `tools/location-verify.js 0.1.0` · mode **live** · scope unverified, low, status · 85 of 85 rows in scope._

> PROPOSALS ONLY. Nothing here is in data/geocodes.json until a person reviews a row (review.decision) and runs --accept locally, then the gates (research.js --geocheck/--statuscheck, npm run validate, npm test).

City anchor (median of high-confidence pins): 25.78225, -80.19392 · candidates farther than 72 km are discarded as same-name-elsewhere.

Requests: 319 network · 4 cache hits · 136 Nominatim · failures: overpass-api.de HTTP 502; overpass-api.de HTTP 502; overpass-api.de HTTP 502; overpass-api.de HTTP 502

Failed requests by host: overpass-api.de 4/8 — Overpass failures mean OSM lifecycle (closure) evidence is incomplete for some rows

## Summary

| outcome | rows |
|---|---|
| pin | 33 |
| confirm | 5 |
| no-match | 41 |
| ambiguous | 3 |
| move | 1 |
| shared-object | 2 |

Review assist (advice against the accept bar): pass 11 · hold 27 · reject 46 · no-change 1

## Rows

| place | now | scope | outcome | assist | proposal | evidence |
|---|---|---|---|---|---|---|
| Las Olas Boulevard | UNVERIFIED | unverified, status | pin | **pass**: wikidata coordinate with an independent source within 40 m | 26.1193, -80.135 **high** · new pin · “Las Olas Boulevard” · [wikidata](https://www.wikidata.org/wiki/Q6492365) 2026-10-16 | official site schema.org address: 915 East Las Olas Boulevard, Fort Lauderdale, FL 33301 (no geo); overpass: HTTP 502 |
| Fort Lauderdale Beach | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only: needs the address or a second source | 26.14056, -80.10194 **high** · new pin · “Fort Lauderdale Beach” · [wikidata](https://www.wikidata.org/wiki/Q49320734) 2026-10-16 | overpass: HTTP 502 |
| South Pointe Park | 25.768339, -80.131853 (low) | low | confirm | **pass**: wikidata coordinate with an independent source within 40 m | 25.76616, -80.13293 **high** · 265 m · “South Pointe Park” · [wikidata](https://www.wikidata.org/wiki/Q7568258) 2026-10-16 | extended feature: 265 m between centroid and the pinned entrance/point is expected; no move proposed; overpass: HTTP 502 |
| The Surf Club Restaurant | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Hometown Barbecue Miami | 25.79744, -80.2157 (low) | low | confirm | **hold**: OSM POI without an exact address match (house number true, street false) | 25.79742, -80.21571 **high** · 2 m · “Hometown Barbecue” · [osm-poi](https://www.openstreetmap.org/node/10138428303) 2026-10-16 | OSM node/10138428303 amenity=restaurant · addresstype=amenity · name “Hometown Barbecue” · 1200 Northwest 22nd Street, Miami, Florida 33142 · website=https://hometownbbqmiami.com/, opening_hours=Su-Th 11:30-21:00; Fr-Sa 11:30-22:00 — upgrade confidence low → high; overpass: HTTP 502 |
| Chez Le Bebe | 25.82518005, -80.19346619 (med) | status | no-match | **reject**: no proposal | — | overpass: HTTP 502 |
| Cvi.che 105 | 25.7754765, -80.1884418 (med) | status | confirm | **hold**: OSM POI without an exact address match (house number true, street false) | 25.77544, -80.18847 **high** · 5 m · “CVI.CHE 105” · [osm-poi](https://www.openstreetmap.org/node/3247965416) 2026-10-16 | OSM node/3247965416 amenity=restaurant · addresstype=amenity · name “CVI.CHE 105” · 105 Northeast 3rd Avenue, Miami, Florida 33132 · website=https://www.ceviche105.com/ — upgrade confidence med → high; overpass: HTTP 502 |
| Chef's Counter at MAASS | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Recoveco | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Bar Bucce | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Daniel's, A Florida Steakhouse | UNVERIFIED | unverified | pin | **hold**: med: needs a second independent source within 50 m (Census point is 65 m away) | 26.11428, -80.13659 **med** · new pin · “” · [osm-address](https://www.openstreetmap.org/way/1089580081) 2026-10-16 | OSM way/1089580081 building=yes · addresstype=building · (no name) · 620 South Federal Highway, Fort Lauderdale, Florida 33301 — 2nd source: [Census](https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=620%20S%20Federal%20Hwy%20%2C%20Fort%20Lauderdale%2C%20FL%2033301&benchmark=Public_AR_Current&format=json) 65 m (“620 S FEDERAL HWY, FORT LAUDERDALE, FL, 33301”) — overpass: HTTP 502 |
| El Brazo Fuerte Bakery | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| La Carreta | 25.7644527, -80.2537602 (med) | status | confirm | **hold**: OSM POI without an exact address match (house number true, street false) | 25.76453, -80.25385 **high** · 12 m · “La Carreta Cuban Restaurant - Little Havana” · [osm-poi](https://www.openstreetmap.org/node/6080057062) 2026-10-16 | OSM node/6080057062 amenity=restaurant · addresstype=amenity · name “La Carreta Cuban Restaurant - Little Havana” · 3632 Southwest 8th Street, Miami, Florida 33135 · website=http://lacarreta.com/locations/, opening_hours=Su-Th 08:00-24:00; Fr 08:00-02:00; Sa 08:00-03:00 — upgrade confidence med → high; overpass: HTTP 502 |
| Latin Cafe 2000 (Brickell) | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 25.81414, -80.12842 **med** · new pin · “Latin Cafe” · [osm-poi](https://www.openstreetmap.org/way/1297375229) 2026-10-16 | OSM way/1297375229 amenity=fast_food · addresstype=amenity · name “Latin Cafe” · 441 41st Street, Miami Beach, Florida 33140 · building:part=retail — overpass: HTTP 502 |
| Naomi's Garden Restaurant & Lounge | UNVERIFIED | unverified | pin | **hold**: med: needs a second independent source within 50 m | 25.83958, -80.20793 **med** · new pin · “Naomi’s Garden Restaurant & Lounge” · [osm-poi](https://www.openstreetmap.org/node/6114254888) 2026-10-16 | OSM node/6114254888 amenity=restaurant · addresstype=amenity · name “Naomi’s Garden Restaurant & Lounge” · Northwest 71st Street, Miami, Florida 33147 — overpass: HTTP 502 |
| Piman Bouk Haitian Restaurant | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Clyde Butcher's Big Cypress Gallery | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Loop Road Scenic Drive | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Skunk Ape Research Headquarters | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| South Beach | UNVERIFIED | unverified, status | pin | **pass**: wikidata coordinate with an independent source within 40 m | 25.78188, -80.13626 **high** · new pin · “South Beach” · [wikidata](https://www.wikidata.org/wiki/Q186106) 2026-10-16 |  |
| Domino Park (Máximo Gómez Park) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Cuban Memorial Boulevard | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Black Police Precinct and Courthouse Museum | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number true, street false) | 25.7842, -80.2028 **high** · new pin · “Historic Black Police Precinct Courthouse and Museum” · [osm-poi](https://www.openstreetmap.org/way/435748157) 2026-10-16 | OSM way/435748157 tourism=museum · addresstype=tourism · name “Historic Black Police Precinct Courthouse and Museum” · 480 Northwest 11th Street, Miami, Florida 33136 · building=yes |
| Margulies Collection at the Warehouse | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only: needs the address or a second source | 25.80212, -80.20489 **high** · new pin · “Margulies Collection at the Warehouse” · [wikidata](https://www.wikidata.org/wiki/Q96585445) 2026-10-16 |  |
| The Den at Sushi Azabu | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Brasserie Laurel | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Fiola Miami — CLOSED | UNVERIFIED | unverified | pin | **pass**: OSM POI, name 1, house number + street match | 25.70511, -80.2826 **high** · new pin · “Fiola Miami” · [osm-poi](https://www.openstreetmap.org/way/278812500) 2026-10-16 | OSM way/278812500 amenity=restaurant · addresstype=amenity · name “Fiola Miami” · 1500 San Ignacio Avenue, Coral Gables, Florida 33146 · building=yes |
| Lido at The Surf Club | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Lion & the Rambler — CLOSED | UNVERIFIED | unverified | pin | **hold**: med: needs a second independent source within 50 m | 25.76421, -80.25945 **med** · new pin · “” · [osm-address](https://www.openstreetmap.org/way/435532068) 2026-10-16 | OSM way/435532068 building=yes · addresstype=building · (no name) · 804 Ponce de Leon Boulevard, Coral Gables, Florida 33134 |
| Elyu Omakase | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Grand Central | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 25.78137, -80.19905 **med** · new pin · “Soleste Grand Central” · [osm-poi](https://www.openstreetmap.org/way/954741747) 2026-10-16 | OSM way/954741747 building=yes · addresstype=building · name “Soleste Grand Central” · 218 Northwest 8th Street, Miami, Florida 33136 · website=https://www.artegcbyavanti.com, building:levels=18 — official site schema.org address: 218 NW 8th St, Miami, FL 33136 (no geo); official site schema.org address: 218 NW 8th St, Miami, FL 33136 (no geo) |
| Palma | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Torno Subito | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Apocalypse BBQ | 25.687979, -80.3935907 (med) | status | no-match | **reject**: no proposal | — |  |
| Pinecrest Bakery | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 25.65816, -80.32716 **med** · new pin · “Pinecrest bakery” · [osm-poi](https://www.openstreetmap.org/node/6047566531) 2026-10-16 | OSM node/6047566531 shop=bakery · addresstype=shop · name “Pinecrest bakery” · 12101 South Dixie Highway, Pinecrest, Florida 33156 · website=https://pinecrestbakery.com/, opening_hours=24/7 |
| Newport Fishing Pier | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Sunny Isles Beach | UNVERIFIED | unverified, status | ambiguous | **reject**: no proposal | — | candidates disagree by 2279 m |
| Broward Center for the Performing Arts | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only: needs the address or a second source | 26.1204, -80.1485 **high** · new pin · “Broward Center for the Performing Arts” · [wikidata](https://www.wikidata.org/wiki/Q4975886) 2026-10-16 |  |
| Jungle Queen Riverboat | UNVERIFIED | unverified, status | pin | **pass**: OSM POI, name 1, house number + street match | 26.11127, -80.10602 **high** · new pin · “Jungle Queen Riverboat” · [osm-poi](https://www.openstreetmap.org/node/1439350923) 2026-10-16 | OSM node/1439350923 tourism=viewpoint · addresstype=tourism · name “Jungle Queen Riverboat” · 801 Seabreeze Boulevard, Fort Lauderdale, Florida 33316 · website=https://www.junglequeen.com/ |
| Hallandale Beach | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only: needs the address or a second source | 25.98667, -80.14611 **high** · new pin · “Hallandale Beach” · [wikidata](https://www.wikidata.org/wiki/Q986548) 2026-10-16 |  |
| Ernest F. Coe Visitor Center | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only: needs the address or a second source | 25.39531, -80.58307 **high** · new pin · “Ernest F. Coe Visitor Center‎” · [wikidata](https://www.wikidata.org/wiki/Q36036101) 2026-10-16 |  |
| Mahogany Hammock Trail | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Nine Mile Pond Canoe Trail | UNVERIFIED | unverified | pin | **hold**: med: needs a second independent source within 50 m | 25.25951, -80.78514 **med** · new pin · “Nine Mile Pond Canoe Trail” · [osm-poi](https://www.openstreetmap.org/way/327295642) 2026-10-16 | OSM way/327295642 waterway=link · addresstype=link · name “Nine Mile Pond Canoe Trail” · Florida |
| West Lake Trail | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Elliott Key | 25.44306, -80.19722 (med) | status | ambiguous | **reject**: no proposal | — | candidates disagree by 1186 m |
| Adams Key | 25.4, -80.23306 (med) | status | move | **pass**: wikidata coordinate with an independent source within 40 m | 25.39984, -80.23272 **high** · 39 m · “Adams Key” · [wikidata](https://www.wikidata.org/wiki/Q2824070) 2026-10-16 |  |
| North Beach (Miami Beach) | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Surfside Beach | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 25.88033, -80.12256 **med** · new pin · “Residence Inn by Marriott Miami Beach Surfside” · [osm-poi](https://www.openstreetmap.org/relation/12905902) 2026-10-16 | OSM relation/12905902 tourism=hotel · addresstype=tourism · name “Residence Inn by Marriott Miami Beach Surfside” · 9200 Collins Avenue, Surfside, Florida 33154 · website=https://www.marriott.com/miaxb, building=yes — official site https://www.marriott.com/miaxb answered HTTP 403 — NOT closure evidence (sites move, break and block bots) |
| Bal Harbour Beach | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only: needs the address or a second source | 25.89453, -80.12119 **high** · new pin · “Bal Harbour Beach” · [wikidata](https://www.wikidata.org/wiki/Q34671119) 2026-10-16 |  |
| The Fillmore Miami Beach (Jackie Gleason Theater) | UNVERIFIED | unverified | shared-object | **reject**: low / shared OSM object | 25.79293, -80.13311 **low** · new pin · “The Fillmore Miami Beach at the Jackie Gleason Theater” · [osm-poi](https://www.openstreetmap.org/way/590186839) 2026-10-16 | OSM way/590186839 amenity=arts_centre · addresstype=amenity · name “The Fillmore Miami Beach at the Jackie Gleason Theater” · 1700 Washington Avenue, Miami Beach, Florida 33139 · building:part=yes — shared object: OSM way/590186839 also matched The Fillmore Miami Beach (Jackie Gleason Theater) — CLOSED; graded low |
| Miami Beach Bandshell | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only: needs the address or a second source | 25.85814, -80.12041 **high** · new pin · “Miami Beach Bandshell” · [wikidata](https://www.wikidata.org/wiki/Q113553953) 2026-10-16 |  |
| Miccosukee Indian Village | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Big Cypress Bend Boardwalk (Fakahatchee Strand) | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| The Fillmore Miami Beach (Jackie Gleason Theater) — CLOSED | UNVERIFIED | unverified | shared-object | **reject**: low / shared OSM object | 25.79293, -80.13311 **low** · new pin · “The Fillmore Miami Beach at the Jackie Gleason Theater” · [osm-poi](https://www.openstreetmap.org/way/590186839) 2026-10-16 | OSM way/590186839 amenity=arts_centre · addresstype=amenity · name “The Fillmore Miami Beach at the Jackie Gleason Theater” · 1700 Washington Avenue, Miami Beach, Florida 33139 · building:part=yes — shared object: OSM way/590186839 also matched The Fillmore Miami Beach (Jackie Gleason Theater); graded low |
| D. A. Dorsey House | 25.7825, -80.19889 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 25.7825, -80.19889 **high** · 0 m · “Dana A. Dorsey House” · [wikidata](https://www.wikidata.org/wiki/Q5203471) 2026-10-16 |  |
| Young At Art Museum | UNVERIFIED | unverified | pin | **pass**: wikidata coordinate with an independent source within 40 m | 26.1126, -80.3112 **high** · new pin · “Young at Art Museum” · [wikidata](https://www.wikidata.org/wiki/Q8058535) 2026-10-16 |  |
| Superblue Miami | UNVERIFIED | unverified | pin | **pass**: official site's schema.org geo | 25.7985, -80.2157 **high** · new pin · “Superblue Miami” · [official](https://www.superblue.com/miami/) 2026-10-16 |  |
| Locust Projects | UNVERIFIED | unverified | pin | **pass**: wikidata coordinate with an independent source within 40 m | 25.81239, -80.19558 **high** · new pin · “Locust Projects” · [wikidata](https://www.wikidata.org/wiki/Q17018639) 2026-10-16 |  |
| The Moore Building | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Long Pine Key Trails & Campground | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Pinelands Trail | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only: needs the address or a second source | 25.42539, -80.68006 **high** · new pin · “Pinelands Trail” · [wikidata](https://www.wikidata.org/wiki/Q3388672) 2026-10-16 |  |
| Paurotis Pond | UNVERIFIED | unverified | ambiguous | **reject**: no proposal | — | candidates disagree by 210 m |
| Eco Pond | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Anne Kolb Nature Center (West Lake Park) | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only: needs the address or a second source | 26.03472, -80.12083 **high** · new pin · “Anne Kolb Nature Center” · [wikidata](https://www.wikidata.org/wiki/Q34814303) 2026-10-16 |  |
| Homestead Historic Downtown District | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate has 3 decimals (≈ 100 m coarse) — needs a precise source | 25.46843, -80.47939 **high** · new pin · “Homestead Historic Downtown District” · [wikidata](https://www.wikidata.org/wiki/Q8561179) 2026-10-16 |  |
| El Espacio 23 | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| MiMo Biscayne Boulevard Historic District | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Overtown Historic Folklife Village | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Opa-locka Museum of Art & History (Seaboard Station) | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Opa-locka/Hialeah Flea Market | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Aventura Arts & Cultural Center | UNVERIFIED | unverified | pin | **hold**: OSM POI without an exact address match (house number true, street false) | 25.94989, -80.13456 **high** · new pin · “Aventura Arts & Cultural Center” · [osm-poi](https://www.openstreetmap.org/way/436109402) 2026-10-16 | OSM way/436109402 amenity=theatre · addresstype=amenity · name “Aventura Arts & Cultural Center” · 3385 Northeast 188th Street, Aventura, Florida 33180 · website=https://www.aventuracenter.org/, building=yes |
| Opa-locka Heritage Trail | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Art Deco Welcome Center & Museum | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Faena Theater | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| North Shore Open Space Park | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only: needs the address or a second source | 25.86528, -80.12028 **high** · new pin · “North Shore Open Space Park” · [wikidata](https://www.wikidata.org/wiki/Q49532917) 2026-10-16 |  |
| Ichimura Miami-Japan Garden | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Gramps — CLOSED | UNVERIFIED | unverified | pin | **hold**: med: needs a second independent source within 50 m | 25.79965, -80.1983 **med** · new pin · “Gramps” · [osm-poi](https://www.openstreetmap.org/node/6110284487) 2026-10-16 | OSM node/6110284487 amenity=bar · addresstype=amenity · name “Gramps” · Northwest 24th Street, Miami, Florida 33127 |
| Wynwood Brewing Company — CLOSED | UNVERIFIED | unverified | pin | **hold**: OSM POI without an exact address match (house number true, street false) | 25.80016, -80.20438 **high** · new pin · “Wynwood Brewing Company” · [osm-poi](https://www.openstreetmap.org/way/353953354) 2026-10-16 | OSM way/353953354 building=yes · addresstype=building · name “Wynwood Brewing Company” · 565 Northwest 24th Street, Miami, Florida 33127 — disused:craft=brewery ([src](https://www.openstreetmap.org/way/353953354)) |
| J. Wakefield Brewing — CLOSED | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Itamae AO — CLOSED | UNVERIFIED | unverified | pin | **pass**: wikidata coordinate with an independent source within 40 m | 25.8072, -80.1928 **high** · new pin · “Itamae Ao” · [wikidata](https://www.wikidata.org/wiki/Q140157755) 2026-10-16 |  |
| Baby Jane — CLOSED | UNVERIFIED | unverified | pin | **pass**: OSM POI, name 0.9, house number + street match | 25.76843, -80.19064 **high** · new pin · “Baby Jane Cocktail House & Noodle Bar” · [osm-poi](https://www.openstreetmap.org/node/10111847374) 2026-10-16 | OSM node/10111847374 amenity=bar · addresstype=amenity · name “Baby Jane Cocktail House & Noodle Bar” · 500 Brickell Avenue, Miami, Florida 33131 · website=http://babyjanemiami.com/ |
| Havana Harry's — CLOSED | UNVERIFIED | unverified | pin | **hold**: med: needs a second independent source within 50 m | 25.72915, -80.26203 **med** · new pin · “Havana Harry's” · [osm-poi](https://www.openstreetmap.org/way/435565527) 2026-10-16 | OSM way/435565527 amenity=restaurant · addresstype=amenity · name “Havana Harry's” · 4612 Southwest 42nd Avenue, Coral Gables, Florida 33146 · building=yes |
| Jaguar Sun — CLOSED | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Cotoa | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Havana Café of the Everglades | 25.81529045, -81.35958099 (med) | status | no-match | **reject**: no proposal | — |  |

_Contains information from OpenStreetMap, © OpenStreetMap contributors, available under the Open Database Licence (ODbL) — https://www.openstreetmap.org/copyright_

Review: set `review.decision` in the JSON to `accept` (coordinate) or `accept-closed` (closure confirmed — also set `review.statusSource`), with `review.by` and `review.why`; then run `node tools/location-verify.js --accept <this json>` locally and the gates.
