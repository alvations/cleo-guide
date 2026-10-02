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
