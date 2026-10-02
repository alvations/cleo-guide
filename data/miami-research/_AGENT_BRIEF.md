# Miami · Fort Lauderdale · Everglades — standing research brief (every Miami agent follows this)

**Region.** Broward (Fort Lauderdale & Hollywood) → Miami-Dade → the Glades edge (Everglades NP, Biscayne NP,
Big Cypress / Tamiami Trail). Out of scope: Palm Beach County (Boca and north), the Florida Keys past Florida City
(Key Largo belongs to a Keys map), Naples proper. Everglades City / Chokoloskee is IN (the park's Gulf Coast gateway).

**Areas** (`a` ids, see consolidate.py): FTL · NMIA · WYN · DTB · LHAV · MBCH · CGCG · SDADE · GLADE. Every
area needs ≥1 tier-1 that survives sourcing + geocoding, or the build assert fails.

## The bar
1. **≥2 credible sources** per place, OR a lone institutional authority (MICHELIN/MICHELIN_BIB/MICHELIN_STAR,
   JAMESBEARD, NPS for a site it operates). Yelp/TripAdvisor/OpenTable/Google = ZERO (measure only).
   Florida State Parks, the Greater Miami CVB and Wikipedia count as credible but need a second source.
2. **Merit bar — measure before adding** (docs/SOURCES.md): institution · real award/vote (Miami New Times Best
   of Miami, Sun Sentinel readers' choice, JBF semifinalist) · findable major-press/creator rave · or high rating
   with real volume on ≥2 platforms. No padding (don't stack four mid-tier ventanitas). Log MEASURED & DROPPED.
3. **Open/closed** fact-checked (2025/2026 evidence). Notable closed → kept, `closed:true`; non-notable closed → drop.
4. **No coordinates in discovery.** Geocode stage only: google.com `!3d<lat>!4d<lng>` place pins, Wikipedia
   published coords, official pages. Never `/@` viewports, never memory. Unresolvable → UNVERIFIED.

## Ranked source palette (data/sources.json → miami-fl)
- **Institutional (rank 1):** MICHELIN (Florida guide: stars, Bib Gourmand, Recommended), JAMESBEARD, NPS
  (Everglades, Biscayne, Big Cypress).
- **Local editorial of record (rank 1–2):** MIAMIHERALD, MIAMINEWTIMES (Best of Miami), SUNSENTINEL (Broward),
  EATERMIAMI, INFATUATION (Miami), WLRN (public media), MIAMIMAG / OCEANDRIVE.
- **Tourism / official (rank 2):** GMCVB (miamiandbeaches.com), VISITLAUDERDALE, FLSTATEPARKS, MIAMIDADE (county
  parks), VISITFLORIDA.
- **Travel sites (rank 2–3):** TIMEOUT (Time Out Miami), ATLASOBSCURA, CNTRAVELER, FODORS, USATODAY 10Best,
  TASTINGTABLE, FOODWINE, NYT (36 Hours), local TV (LOCAL10, NBC6, CBSMIAMI).
- **Creators** — only verifiably popular, with a findable piece naming the place (e.g. national: Kara and Nate,
  Wolters World, One Bite; Miami: vet per wave). A creator is ONE corroborating source.

## Food canon first
Cuban sandwich & medianoche · croquetas · pastelitos + ventanita cafecito · the frita · stone crab · Haitian griot ·
Peruvian ceviche · arepas · key lime pie · conch · Nicaraguan fritanga · Redland tropical fruit · gator & frog legs.

## Sights backbone
Art Deco Historic District/Ocean Drive, Wynwood Walls, Vizcaya, Pérez Art Museum, Little Havana/Calle Ocho, the
Barnacle, Fairchild, Coral Castle, Bill Baggs lighthouse, Everglades NP trails & visitor centres, Biscayne NP,
Shark Valley, Big Cypress, Fort Lauderdale beach/Las Olas/Bonnet House, Hollywood Broadwalk.

## Artifacts
`FOOD_<tag>.json` (array `{t,a,cz,dish,n,address,w,closed,sources}`), `SIGHTS_<tag>.json` (`{sights:[…]}`),
`CREATORS_<tag>.json`, `SOURCES_<tag>.json`, `geo/_geoout_<tag>.json`. Never delete a wave's files.
