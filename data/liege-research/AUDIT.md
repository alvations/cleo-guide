# AUDIT — Liège (Lîdje) + the Meuse valley — append-only ledger

**City key:** `liege` (dataset city under the 🇧🇪 Belgium hub) · **Areas:** `LIE` Liège city · `LIER` around Liège.

## 2026-10-02 — Stage 0: scope & taxonomy
- Two areas mirror the other Belgian maps (city + surroundings). `LIE` = the city's quarters (Carré, Outremeuse,
  Batte, Montagne de Bueren, Guillemins, Palais des Princes-Évêques, Grand Curtius, La Boverie, Cathédrale &
  St-Barthélemy, Coteaux de la Citadelle). `LIER` = Spa & Francorchamps, Huy, the Meuse valley (Seraing/
  Val-Saint-Lambert, Chaudfontaine), the Herve plateau, Val-Dieu abbey, Blegny-Mine (UNESCO), the Ardennes edge.
- Cuisine taxonomy = the shared Belgian one (`tools/belgium_consolidate.py`) — Walloon/liégeois dishes map to
  `Belgian`/`Walloon` labels (BEL / FR), beer to `Beer` (BEER), waffles/sirop/sweets to SWEET. No taxonomy change needed.
- Target density ~145 (Antwerp 137, Brussels 139, Bruges 123): LIE ~85, LIER ~60.

## 2026-10-02 — Wave 1 (partial) — discovery + one geocode — HALTED: WebSearch session budget exhausted
**Searches run: 11** (FR-first). After the 11th the tool returned *"this session has used its web search budget
(200 of 200 WebSearch calls)"* — the cap is per session and shared by all ~17 concurrent agents, so it does not
reset by backing off (retried once; same result). Per the hard rule (never fabricate), discovery stopped here.

**Sources discovered (Stage 1):** VISITLIEGE (official Maison du Tourisme — PDF city guide + venue pages),
ROUTARD (FR guide of record), LONELYPLANET FR, WBT (Wallonie Belgique Tourisme UK site), ULIEGE (University of Liège
campus guide — curated regional-cuisine selection; institutional/student-life source per the Belgium brief), SNCB
(national railway "Discover Belgium" editorial), BRUSSELSTIMES (Hidden Belgium), RTBF, PARISMATCHBE, LALIBRE,
Wikipedia. **Rejected (0 toward the bar):** rankeat.fr (rating aggregator), mapstr (user lists), wanderlog,
generationvoyage/lemagvoyage (SEO travel blogs — corroboration only), mediacite.be (a shopping mall's page).

**Records written (≥2 credible each):** sights — Grand Curtius (WIKIPEDIA+VISITLIEGE+official), Palais des
Princes-Évêques (LP+ROUTARD+VISITLIEGE), Collégiale Saint-Barthélemy (ROUTARD+WBT); food — Café Lequet
(ULIEGE+SNCB; boulets sauce lapin), Une Gaufrette Saperlipopette (BRUSSELSTIMES+RTBF; gaufre de Liège).
**Channel mix this wave:** editorial/tourism 5 · creators 0 (creator pass not reached) · notable travel sites
(LP/Routard) 2 · local recommendation (ULiège) 1.
**Held:** see `_PENDING_LEADS.md` (≈20 leads: single-source, or no confirmed street address).
**Geocode:** Grand Curtius 50.64742, 5.58394 — high (Wikipedia protected-heritage list, published DMS). Others not
geocoded. **Build:** not run — 1 pin is not a map; card stays "being built".

## 2026-10-02 (session 2) — Wave 2 batch 1 — discovery + geocode
**Searches:** ~33 by the lead + 12 by a background geocode agent. FR-first.
**Sources discovered:** MICHELIN venue pages (lone authority — ¡Toma! 1★, Héliport Brasserie 1★, Bib Gourmand: Bistrot d'en
Face, Le Cabochon, La Cuisine de Yannick, Sébastian; Caudalie selected), INFOLUX (info-lux.com province food guide — editorial,
corroboration), LAVENIR, LADH, EUROPEANBARGUIDE (Top-100 European bars), COE (Council of Europe cultural routes + Landscape
Award), KIKIRPA (Royal Institute for Cultural Heritage), AWAP (Walloon heritage inventory, lampspw.wallonie.be), ERIH, MUSEUMDE,
PROVINCELIEGE, LIEGECITY (liege.be), CULTURETRIP, OFFICIAL (spagrandprix.com).
**Creators:** DARLEYNEWMAN (PBS 'Travels with Darley', Emmy-winning host) — filmed the Confrérie du Gay Boulet in Liège,
names Amon Nanesse / Maison du Péket. Rejected: generationvoyage, lemagvoyage, stategroup 'Top 5 foodie' (content farms).
**Records (≥2 credible or lone Michelin/UNESCO):** LIE sights +14 (Montagne de Bueren, Guillemins, La Boverie, Cathédrale
St-Paul, Cité Miroir, Vie wallonne, Archéoforum, St-Jacques, Musée Tchantchès, Opéra, Aquarium-Muséum, St-Denis, Coteaux,
Place du Marché/Perron); LIER sights +6 (Blegny-Mine UNESCO, Val-Dieu, Fort de Huy, Collégiale de Huy, Pouhon, Circuit);
LIE food +12 (7 Michelin, Pot au Lait, Taverne St-Paul, Brasserie C, Maison du Péket, Tchantchès et Nanesse).
**Channel mix:** institutional (Michelin/UNESCO/AWaP/COE/KIK-IRPA) 11 · editorial/tourism 19 · travel sites (LP/Routard/
Culture Trip) 12 · creators 1 · local (ULiège) 1.
**Geocode:** sights 19 pinned (17 high, 2 med: La Boverie Wikipedia rounded, Coteaux area point); Musée Tchantchès UNVERIFIED.
Food: 4 pinned med via Mapcarta/OSM (Cabochon, Brasserie C, Taverne St-Paul, Maison du Péket); 7 UNVERIFIED (Toma,
Héliport, Bistrot d'en Face, Yannick, Sébastian, Caudalie, Pot au Lait) — no published coordinate found; queued.
**Corrections from geocode:** Maison du Péket = Rue de l'Épée 2 (OSM node) not 4; Brasserie C = Impasse des Ursulines 14.
**Held:** Le Dernier Ragot (Diamond Boulet 2005–06, single source), Sandwicherie Pollux (mapstr only), Thermes de Spa (needs
2nd credible), Chez Nathalie / Côté cour-Côté jardin (Boulet de cristal 2021 — rankeat/mapstr only).

## 2026-10-02 (session 2) — Wave 2 batches 2–3 + FIRST BUILD
**Searches:** lead ≈104 · agents 26 (≈130 total this session).
**Added:** LIE sights +6 (Ansembourg, MMIL, Transports museum, Cointe memorial, Sart-Tilman open-air museum, Batte market);
LIER sights +10 (Remouchamps, Coo, Franchimont, Botrange, Val-St-Lambert, Thermes de Spa, Villa Royale museum, Stavelot
abbey); LIE food +4 (As Ouhès, Au Point de Vue, Jupille brewery…); LIER food +12 (Michelin: Le Roannay, Un Max de Goût,
Arabelle Meirlaen, Le Coq aux Champs, La Roseraie; Bib: La Chapellerie, Au Dos de la Cuillère, Le Coin des Saveurs, La
Maison Thaï; beer: Val-Dieu, Grain d'Orge; Siroperie Meurens).
**Key hygiene:** La Roseraie / La Maison Thaï re-keyed to the press outlets that reported the award (INFOLUX/FORBES,
PARISMATCHBE/LAVENIR) — a press URL never sits under the MICHELIN key.
**Geocode:** agent pass 2 → 7 pins (Tchantchès museum, Cointe, Batte, Val-St-Lambert, MMIL, Café Lequet, Tchantchès et
Nanesse); lead → Au Point de Vue (Mapcarta W402678454, high), Gaufrette Saperlipopette (med), Villa Royale (med), Thermes de
Spa (med). Address corrections: Au Point de Vue = Place Verte 10; As Ouhès = Place du Marché 19-21; Siroperie Meurens = Rue
de la Kan 2, Aubel; Gaufrette Saperlipopette = Rue des Mineurs 6. Technique: `allowed_domains:["mapcarta.com"]` + the
exact name/OSM id makes the search summary print coordinates (≈50 % hit rate for restaurants; ≈90 % for sights via Wikipedia).
**Build:** `rebuild-city.py liege --build` → sourcecheck PASS 65/65 (6 on a lone Michelin), geocheck PASS (43 on page:
high 29 · med 14), statuscheck CONSISTENT (43 open, 0 closed), buildcheck PASS; 22 discovered places held (no pin yet).
`npm run validate` DATA OK · `npm test` ALL PASS.

## 2026-10-02 (session 2) — Wave 3 + FINAL BUILD + GO-LIVE
**Sources added:** GAULTMILLAU venue pages (lone authority — 36 Liège-province tables), MOUSTIQUE (La Libre group: 12 boulets
addresses; 7 Liège breweries; 6 gourmet addresses), ERICBOSCHMAN (creator: Belgian TV/radio sommelier, 9-best Liège list on
Moustique), RTBF city lists (10 + 10 cafés; 'bonnes bières du côté de Liège'), GOURMANDIZ (DH food), APAQW, PAYSDEHERVE,
PAYSDEVESDRE, LIEGECITY, Wikipedia (fr) coordinates for ~25 sights.
**Channel mix (whole map, 147):** institutional (Michelin/G&M/UNESCO/AWaP/COE/KIK-IRPA) ≈60 · national/regional press
(RTBF, L'Avenir, DH, La Libre, Moustique, Paris Match) ≈45 · tourism boards (Visit Liège, WBT, Pays de Herve/Vesdre) ≈35 ·
travel guides (LP, Routard, Culture Trip) ≈25 · creators 2 (Darley Newman PBS, Eric Boschman) · local/uni (ULiège) 3.
**MEASURED & DROPPED / held:** see RESUME.md 'Held single-source leads' (~30). Château de Harzé dropped (private events
venue, not a visitor sight). Au Moriane kept (Michelin + G&M restaurant; the OSM 'leather shop' tag is the building's name).
**Geocode corrections:** Une Gaufrette Saperlipopette DOWNGRADED to UNVERIFIED in data/geocodes.json (its point was Cabale's
OSM node, Rue des Mineurs 6); Arabelle Meirlaen OSM pin rejected (no address, possible pre-move) → ViaMichelin POI used;
Héliport Brasserie is in a château ~10 km out (ViaMichelin POI + Michelin text) — description corrected; Jupiler brewery =
Rue des Anciennes Houblonnières 2; Le Grand Maur = Rue de Barisart 209; La Roseraie = Route de Limet 80, Modave; Darcis =
Esplanade de la Grâce 1, Verviers.
**Technique (lesson):** RestaurantGuru/Foursquare/Wanderlog single-place search (`allowed_domains`) prints venue lat/lng
≈90 % of the time — far better than Mapcarta/OSM (≈15 %). ViaMichelin works for Michelin venues.
**FINAL BUILD:** sourcecheck PASS 147/147 (34 on a lone Michelin/G&M) · geocheck PASS — **99 on page** (57 sights + 42
food; high 51 · med 48 · low 0) · statuscheck CONSISTENT (0 closed) · buildcheck PASS. 48 held UNVERIFIED.
Density: LIE 82/85 (NEED +3), LIER 66/60 OK. **Go-live:** CARD:liege relinked, countries.json belgium pages + blurb,
Belgium hub (five maps), root Belgium card (606 places on maps), CITIES.md row, AGENT-PROMPTS run-log row.
**Halt:** session-wide WebSearch cap 200/200 reached.

## 2026-10-03 (session 3) — Wave 4: pin pass + LIE top-up (~95 searches)
**Pins (geo/_geoout_liege_w4.json, 45 records):** one place per WebSearch, `allowed_domains`
restaurantguru/foursquare/wanderlog/viamichelin → venue lat/lng in the summary (≈85 % hit rate again). 40 of the 48 held
places pinned (all `med`, RestaurantGuru/ViaMichelin POI; CTLM Verviers `high` from fr.wikipedia infobox). Town-only
discovery addresses replaced with the venue street address from the pin source (`_liege_w4geo.py` only fills addresses with
no house number). **Corrections:** L'Epicurien (Herve) is Rue des Martyrs 15 per its Michelin page (Bib Gourmand — MICHELIN
source added), not Rue des Xhawirs; Une Gaufrette Saperlipopette re-pinned at Rue des Mineurs 18 (RestaurantGuru) — the old
Cabale-node point stays retired; Danieli = Rue Hors-Château 46 — RestaurantGuru flags the old Danieli 'permanently closed'
but Le Fooding documents its revival by Yann Stroobant (ex-Cabale) at the same address → kept OPEN, LEFOODING added; Cyrano
(Waimes) = Rue de la Gare 23 (Hôtel Ravel); Les Brasseries de Liège share the Grand Poste building (Quai sur Meuse 19).
**CLOSURE:** **Qualia** (Verviers, Gault&Millau 13.5) CLOSED August 2024 — Paris Match Belgique 2024-10-08; flagged
`closed:true`, pinned at Le Petit Château Peltzer (Mapcarta W626979293) so it renders as `— CLOSED`.
**Still UNVERIFIED (8):** Origo (no venue coord printed), Beer Lover's Café & Shop (Foursquare 'Fermé maintenant' vs live
Schlouk Map listing — status ambiguous, not pinned until settled), Musée en plein air du Sart-Tilman (Wikidata point is the
city centre — rejected; campus-wide museum), Brasserie Coopérative Liégeoise (Badjawe), Fromagerie du Vieux Moulin, Galler
(Vaux-sous-Chèvremont; only a village centroid printed — rejected), Siroperie Meurens (search returned the *Siroperie
Artisanale d'Aubel* — a different company — rejected), The Owl Distillery (area centroid only).
**Discovery (LIE +5, food-first; FOOD_LIEGE_W4.json, SIGHTS_LIEGE_W4.json, SOURCES_LIEGE_W4.json):**
- Magma — Michelin Bib Gourmand 2024 (lone authority) + RTBF.
- La Grand Poste (food market + house brewery) — ELLE Belgique + Brussels Times 'Hidden Belgium' + RTBF.
- Utamu Coffee'n Pastries — European Coffee Trip (awards: top-10 Belgian specialty café) + ELLE.
- Constantin Café — Le Fooding + Visit Liège + ELLE.
- Théâtre de Liège (Émulation) — Visit Liège + La Libre + L'Avenir; pin fr.wikipedia 50°38′27″N 5°34′29″E.
Channel mix this wave: institution 1 · national press 4 (RTBF, ELLE, La Libre, L'Avenir) · guides/creator-scale outlets 3
(Le Fooding, European Coffee Trip, Brussels Times) · tourism board 2. Creator query run ('Liège food tour youtube vlog') →
only Taste of Liège tour copy + Darley Newman (already registered); no new creator met the bar.
**MEASURED & held (single source):** Volga bar d'atmosphère (Le Fooding only), La Caféière (RTBF only), Torrefactory coffee
shop (Paris Match only), Eggenols waffles (one blog), Le Barbecue de Jacky (Barchon, G&M 'hip' — LIER, not needed).
**Build:** sourcecheck PASS · geocheck PASS — **144 on page** (59 sights + 85 food) of 153 · statuscheck CONSISTENT
(1 closed: Qualia) · buildcheck PASS · `npm run validate` DATA OK · `npm test` ALL PASS.
**Density:** LIE 87/85 OK (51 food + 36 sights), LIER 66/60 OK → **every area OK**; food share 92/153 = 60 %.
