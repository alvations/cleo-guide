# Orlando & Central Florida — standing agent brief

Same pipeline + gates as every US city (docs/PIPELINE.md, docs/SOURCES.md, docs/RUN-2026-10-02.md):
**discover sources → extract places → fact-check (≥2 credible, or lone Michelin/James Beard/NPS) → measure
merit & re-rank within area → geocode + location-verify → open/closed → build & gate.** WebSearch only.
Discovery records carry an ADDRESS but NO coordinates.

## Region & area codes (`a`)
`DTO` Downtown & Thornton Park · `MILLS` Mills 50/Milk District/Audubon Park/SoDo/Curry Ford · `WPK` Winter Park/
Baldwin Park/Maitland · `IDR` I-Drive/Dr Phillips/Restaurant Row/Millenia/SeaWorld · Walt Disney World per park:
`MK` `EPCOT` `DHS` `DAK` `DSP` (Disney Springs + resorts not on the MK/EPCOT lagoons) · Universal per park: `USF`
`IOA` `EPIC` `CWALK` (CityWalk, Volcano Bay, resorts) · `KISS` Kissimmee/Celebration/St Cloud/Lake Nona ·
`WEST` Winter Garden/Windermere/Ocoee · `SPRNG` Sanford/Lake Mary/Mount Dora/Wekiwa/Blue Spring/DeLand ·
`EAST` East Orlando/UCF/Oviedo · `SPACE` Kennedy Space Center/Titusville/Merritt Island/Cocoa Beach.

## Theme-park rule
A park attraction or restaurant earns a pin on merit like anything else: ≥2 credible sources. The park's own
page (Disney/Universal) is `OFFICIAL` and counts ONCE. Pair it with Wikipedia (notability + published
coords), the Orlando Sentinel, Theme Park Insider, Disney Food Blog / Inside the Magic (verifiably popular
creators/outlets), WDWNT, Attractions Magazine, or major press. Pin attractions at their OWN location inside
the park (Wikipedia/Wikidata/latitude.to coords), never a park centroid; a land/area with no own coordinate
stays UNVERIFIED.

## Food canon (signature first)
Mills 50 Vietnamese (pho, banh mi, bun bo hue) · Puerto Rican Kissimmee (mofongo, lechón, pastelillos) ·
Cuban (sandwich, croquetas, café) · Michelin Florida (Sorekara ★★; Camille, Kadence, Ômo by Jônt, Soseki,
Victoria & Albert's ★; 14 Bibs) · Florida flavors (gator, citrus, key lime, Gulf/Indian River seafood) ·
park icons (Dole Whip, Butterbeer, turkey legs, Mickey pretzel, Ronto Wrap, School Bread, Grey Stuff).

## Source palette (§2a — draw from ALL channels every wave)
Editorial: Michelin, James Beard, Orlando Sentinel, Orlando Weekly, Orlando Magazine, Eater, WMFE, Spectrum
News 13, WFTV/WESH/News 6, Tasty Chomps (Ricky Ly, long-running Orlando food blog), Tampa Bay Times/Florida
Trend. Institutional: NPS (Canaveral NS), NASA, Florida State Parks, USFWS (Merritt Island NWR).
Travel sites: Visit Orlando, Atlas Obscura, Time Out, Condé Nast, USA Today 10Best, Lonely Planet.
Creators: Disney Food Blog, Theme Park Insider, Inside the Magic, WDWNT, Mr. Hulot? (vet each: following + a
findable piece). Local: r/orlando threads (corroborating only). Yelp/TripAdvisor/Google/OpenTable = ZERO.

## Output schema
Food (LIST) `FOOD_<tag>.json`: `{t,a,cz:[...],dish,n,address,w,closed,sources:[[KEY,url],...]}`
Sights (DICT) `SIGHTS_<tag>.json`: `{"sources":[{key,name,url}],"sights":[{t,a,n,address,w,k,g?,sources}]}`
Outlets `SOURCES_<tag>.json`: `{"outlets":[{key,name,type,url,credible}]}` · creators `CREATORS_<tag>.json`.
Tier `t` is graded WITHIN the area. No duplicates (names are normalized in consolidate.py).
