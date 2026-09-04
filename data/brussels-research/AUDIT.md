# Brussels — discovery audit ledger

Discovery stage only (no coordinates, no build). Areas: `BRU` (centre & inner communes) and `BRUR`
(periphery). Bilingual research: searched in French and Dutch, English where natural; WebSearch only.
Pipeline contract: [docs/PIPELINE.md](../../docs/PIPELINE.md). Source bar: ≥2 credible sources per place,
OR one lone institutional authority (UNESCO, Michelin, Gault&Millau, a national museum, or a brewery's own
site + a credible write-up). Yelp/TripAdvisor/Google/resto.be-user-reviews/RateBeer/Untappd = ZERO.

## Output & final counts
- `SIGHTS_BRUSSELS_BRU.json` — 47 sights (dict)
- `SIGHTS_BRUSSELS_BRUR.json` — 16 sights (dict)
- `FOOD_BRUSSELS_BRU.json` — 45 food/drink (list)
- `FOOD_BRUSSELS_BRUR.json` — 10 food/drink (list)
- `SOURCES_BRUSSELS.json` — 30 outlets · `CREATORS_BRUSSELS.json` — 0 (no lone-creator reliance)

**Totals: 63 sights + 55 food = 118 places** (BRU 92 / BRUR 26). Split ≈ 53% sights / 47% food.
Beer & breweries grouped `cz:["Beer"]` = 12 (all in BRU; Cantillon carries the BRUR beer layer).
Every place clears the bar; candidates that could not were held (below), not padded.

## Waves (WebSearch, sequenced, ~40 queries)
1. **BRU headline sights** — Grand-Place/Hôtel de Ville (UNESCO 857), Magritte + Royal Museums of Fine
   Arts (national), MIM/Old England, Atomium + Design Museum + Mini-Europe, Galeries Royales
   Saint-Hubert, Cathedral Sts-Michel-et-Gudule, Bourse/Belgian Beer World.
2. **Sablon/Marolles/comic/Art Nouveau** — Notre-Dame du Sablon, Place du Grand Sablon, Jeu de Balle flea
   market, Palais de Justice, Belgian Comic Strip Center + Comic Book Route, Musée Horta (UNESCO 1005).
3. **Cinquantenaire/EU/Ixelles** — Parc du Cinquantenaire + Autoworld + Art&History + War Heritage + Arc,
   Étangs d'Ixelles, Flagey, Matongé, Parlamentarium, House of European History.
4. **Manneken cluster + BRUR anchors** — Manneken Pis + GardeRobe + Maison du Roi; AfricaMuseum (Tervuren),
   Waterloo 1815/Butte du Lion, Maison d'Érasme + Béguinage (Anderlecht), Serres de Laeken, Magritte House
   (Jette), Van Buuren (Uccle), Train World (Schaerbeek), Cantillon (Anderlecht).
5. **More BRU landmarks** — BOZAR (Horta), La Monnaie, Choco-Story; Koekelberg basilica, WIELS (Forest),
   Chinese Pavilion/Japanese Tower (Laeken), Bois de la Cambre, Sonian Forest (UNESCO 1133).
6. **Art Nouveau UNESCO houses + Toone** — Hôtel Solvay, Hôtel van Eetvelde, Maison Saint-Cyr, Villa
   Empain/Fondation Boghossian, Porte de Hal; Théâtre Royal de Toone (UNESCO intangible 2025); Schaerbeek
   (Sainte-Marie, Parc Josaphat, Maison Autrique).
7. **Beer & breweries** — RTBF's 5-bars feature + visit.brussels beer-bars listicle: Delirium, À la Mort
   Subite, Moeder Lambic (Fontainas + Saint-Gilles), La Bécasse, Poechenellekelder; Le Cirio, À l'Imaige
   Nostre-Dame, Au Bon Vieux Temps (visit.brussels time-travel-bars); Brasserie de la Senne, Brussels Beer
   Project, En Stoemelings.
8. **Chocolate/sweet/frites** — Marcolini, Wittamer, Neuhaus, Mary, Laurent Gerbaud, Maison Dandoy,
   Frederic Blondeel (visit.brussels chocolate); Maison Antoine (own + Brussels Express).
9. **Belgian brasseries & seafood** — Chez Léon, Aux Armes de Bruxelles, Les Brigittines, Au Vieux
   Saint-Martin, Belga Queen, Brasserie Ploegmans, Le Roy d'Espagne (Michelin + LeVif/Pudlowski/Fodors/own);
   La Belle Maraîchère, François, Noordzee/Mer du Nord (Michelin/PetitFuté/own).
10. **Michelin bench + Bib Gourmand** — Comme Chez Soi (2★), Bozar (1★), humus x hortense (1★), Old Boy,
    La Buvette; La Paix (2★, relocating), Le Chalet de la Forêt (2★), Bouchéry, Le Pigeon Noir. Full 2026
    Bib Gourmand list (Michelin + BX1/La Libre/L'Avenir/DHnet) → selected diverse tables.
11. **Matongé / African / intl** — Inzia, L'Horloge du Sud, Kokob (Jeune Afrique + Travel Tomorrow/AFAR/
    doeatbetter). Turkish/Moroccan belt (Schaerbeek/Saint-Josse) probed; see held.

## Closure / status notes (fact-checked)
- **La Paix** (Anderlecht, 2★) — RELOCATING to central Brussels (Corinthia Grand Hotel Astoria) from
  mid-Sept 2026 (La Libre/DHnet, June 2026). Kept at the well-sourced Anderlecht address with the move
  flagged in `w`; NOT `closed`. Geocode/re-verify stage must confirm the new central address.
- **Bon-Bon** (Woluwe-St-Pierre, ex-2★, Christophe Hardiquest) — permanently CLOSED June 2022 (BX1/Wikipedia).
  NOT included. Chef's successor **Menssa** (Woluwe-St-Pierre, 1★) held (no verified street address).
- **Musée Horta** (Saint-Gilles) — VRT (Feb 2026) reports a deep renovation is planned (future tense);
  listed as open with a caveat in `w`. Confirm opening at build time.
- **Serres Royales de Laeken** — open to the public only ~3 weeks/year (spring). Flagged seasonal in `w`.
- **Chinese Pavilion / Japanese Tower** (Laeken) — interiors closed for long-running restoration; kept as
  exterior architectural landmarks.
- **Little Asia** (Vietnamese, Dansaert) — permanently closed per directories; NOT included.
- **Bar Bik** (Modern European, Quai aux Pierres de Taille) — closed; NOT included.
- All other included places checked open as of the discovery searches (Sept 2026).

## Held candidates (could not clear ≥2-credible, or address unverifiable) — NOT included
- **Beer/cafés**: Bier Circus, La Fleur en Papier Doré, La Chaloupe d'Or (only own site / city-blog).
- **Belgian brasseries**: Fin de Siècle, Le Kelderke, Le Volle Gas, La Roue d'Or (own + city-guide only),
  Vincent/Maison Vincent, La Maison du Cygne, La Quincaillerie, GUS, Skievelat, Zotte Mouche,
  Au Vieux Spijtigen Duivel (LeVif names it but only 1 credible found).
- **Seafood**: Bij den Boer, La Marée, Vismet (no ≥2 credible / TripAdvisor-only).
- **Frites/waffles**: Frit Flagey, Fritland, Peck 47 (city blogs / TripAdvisor only).
- **Michelin single-institutional but NO verified address**: Menssa, Barge, Kamo, La Villa in the Sky,
  Eliane, San (each Michelin-listed → clears the merit bar, but held pending a street address so the
  geocode stage has something to resolve; add on the next wave once addresses are verified).
- **Turkish/Moroccan/Syrian belt** (Chaussée de Haecht — Hanedan, Hanımeli, Sahbaz, Kasim, Metin, O'Syrie,
  Le Touareg): only directory/TripAdvisor coverage found — held. The belt is currently represented by the
  Michelin Bib Gourmand **Babam** (Anatolian). A dedicated credible feature (Bruzz/Brussels Times) is
  needed to add the Haecht spots.

## Notes for the next stages
- **Bib Gourmand entries** carry commune-level addresses (e.g. "Ixelles, 1050 Bruxelles") — acceptable for
  later geocoding per brief, but the geocode stage should resolve exact streets from the Michelin pages.
  Dishes reflect each kitchen's cuisine (institutional Michelin listing is the recommender).
- **Cross-tag check**: `cz:["Beer"]` used only for genuine beer bars/breweries; a shared dish never drove a
  cuisine tag. Seafood houses tagged `SEA` (+`Belgian` where the kitchen is Belgian).
- Every food entry names a specific dish or beer; no bare labels. No coordinates anywhere.

---

# Wave 2 — deepening pass (target NYC-level density, ~140+)

Wave-1 total was 118 (63 sights + 55 food). Wave 2 adds **23 NEW places** in `*_X2.json` files
(deduped against wave 1) → **new running total 141 places** (81 sights + 60 food). Bilingual research
(FR/NL/EN), WebSearch only, same source bar. New files: `FOOD_BRUSSELS_BRU_X2.json` (13),
`FOOD_BRUSSELS_BRUR_X2.json` (2), `SIGHTS_BRUSSELS_BRU_X2.json` (6), `SIGHTS_BRUSSELS_BRUR_X2.json` (2),
`SOURCES_BRUSSELS_X2.json` (9 new outlets), `CREATORS_BRUSSELS_X2.json` (0 — no lone-creator reliance).

## Wave-2 new counts by area
- **BRU food (13):** Kamo, La Villa in the Sky, Barge, San Sablon, Eliane, Nüetnigenough, La Fleur en
  Papier Doré, La Porte Noire, MOK, Renard Bakery, Fine Bakery, Titulus, Café des Spores.
- **BRUR food (2):** Menssa (Woluwe-St-Pierre), Sahbaz (Schaerbeek).
- **BRU sights (6):** Abbaye de la Cambre, Maison Cauchie, Parvis de Saint-Gilles, Hôtel de Ville de
  Saint-Gilles, Marché du Châtelain, Quartier turc de la Chaussée de Haecht.
- **BRUR sights (2):** Palais Stoclet (UNESCO 1298), Halles de Schaerbeek.

## Priority 1 — held Michelin/Bib tables now RESOLVED with verified street address
All six wave-1 held tables (each a lone institutional authority) now carry a full street address so the
geocode stage has an exact point; each paired with a 2nd credible source where available:
- **Menssa** — Avenue de Tervueren 453, 1150 Woluwe-Saint-Pierre (1★, Christophe Hardiquest, ex-Bon-Bon).
  Michelin + visit.brussels. → BRUR.
- **Kamo** — Chaussée de Waterloo 550A, 1050 Ixelles (1★, only Japanese star in Belgium). Michelin + G&M.
- **La Villa in the Sky** — Avenue Louise 480, 1050 Ixelles (1★, 25th floor of the IT Tower). Michelin + G&M.
- **Barge** — Boulevard d'Ypres 33, 1000 Bruxelles (1★ + Green Star, canal). Michelin + G&M.
- **San (San Sablon)** — Rue Joseph Stevens 12, 1000 Bruxelles (Degeimbre; Michelin selection + DHnet
  full review). Confirmed as San Sablon (not a bare "San").
- **Eliane** — Rue Saint-Laurent 36, 1000 Bruxelles (1★, Kobe Desramaults). Michelin + La Libre.

## Priority 2 — diverse belt
- **Turkish (Chaussée de Haecht):** added the **quartier turc** as a neighbourhood SIGHT (Bruzz
  'Brussel bij de Turk' feature + Saint-Josse commune sjtn.brussels) and **Sahbaz** (Schaerbeek) as a
  food entry on two distinct Bruzz editorial pieces (a dedicated restaurant review + the Sint-Joost
  hotspots feature). NOTE: Sahbaz's two sources are the same outlet (Bruzz); accepted as substantive
  native editorial (one is a full review), on a par with wave-1's "credible + Wikipedia" pairings — flag
  for the merit re-rank. Hanedan (Haacht 79, Saint-Josse) held: only commune-listing + directories, no
  distinct 2nd credible editorial.
- **Moroccan:** HELD — L'Emir (L'Éventail "meilleur couscous" is a strong single credible, but no distinct
  2nd credible found); La Kasbah, Tajine d'Or = TripAdvisor/directory only. Needs one more native feature.
- **Congolese/Matongé depth:** HELD — beyond wave-1's Inzia/L'Horloge du Sud, no new spot cleared ≥2
  credible (Kin Malebo etc. only directories). Matongé already carried as a sight in wave 1.

## Priority 3 — communes deepened
- **Ixelles:** Abbaye de la Cambre (gardens.brussels + heritage.brussels), Marché du Châtelain (BX1 +
  RTBF), Titulus natural-wine bar (G&M HIP + L'Éventail), Renard Bakery (Le Fooding + Inside Brussels).
- **Saint-Gilles:** Parvis + market (visit.brussels + Routard), Hôtel de Ville (Routard + visit.brussels),
  Café des Spores mushroom restaurant (Brussels' Kitchen + G&M; also Le Soir/Paris Match per its press page).
- **Etterbeek:** Maison Cauchie Art Nouveau sgraffito house (RTBF + heritage.brussels).
- **Woluwe-St-Pierre:** Palais Stoclet UNESCO villa (UNESCO + La Libre) + Menssa.
- **Schaerbeek:** Halles de Schaerbeek arts venue (heritage.brussels + Wikipedia).
- **Specialty coffee:** MOK roaster (European Coffee Trip + Le Fooding). **Bakeries:** Fine Bakery (ELLE +
  Petit Futé), Renard (above).

## Priority 4 — more beer (grouped cz:["Beer"])
- Added: **Nüetnigenough** (Belgian+Beer; carbonnade + 90 beers; Brusselslife + Petit Futé), **La Fleur
  en Papier Doré** (surrealists' estaminet; VRT 'best café' 2025 + Wikipedia — reopened after 2022
  bankruptcy), **La Porte Noire** (120+ Belgian beers in a 16th-c. Alexians cellar; visit.brussels + Petit Futé).

## Wave-2 closure / status notes (fact-checked)
- **Monk** (Sainte-Catherine) — EXCLUDED: café closed / reopening flagged under the name "Billie"
  (L'Avenir Nov 2023); current identity ambiguous, not added.
- **Musée Wiertz** (rue Vautier, EU quarter) — EXCLUDED: closed to the public for renovation since
  11 Oct 2024, no reopening date (fine-arts-museum.be). Not currently visitable.
- **Musée d'Ixelles** (rue Jean Van Volsem) — EXCLUDED for now: closed for major renovation, reopening
  only **March 2027** (BX1/RTBF). Re-add on a later wave once it reopens.
- **Bier Circus** (rue de l'Enseignement) — HELD: beer.be reports it is "cherche un repreneur" (seeking a
  buyer); future uncertain + otherwise only directory coverage. Excluded pending status confirmation.
- **Frit Flagey** (Place Flagey) — still HELD: iconic but only TripAdvisor/TikTok/Mapstr; no credible
  native editorial found (same as wave 1). Re-attempt with a Bruzz/BX1 feature later.
- **Palais Stoclet** — privately owned, NOT open to the public; kept as a UNESCO architectural landmark
  admirable from the exterior only (noted in `w`). Klimt frieze interior is private.

## New cz tags introduced (for consolidate.py mapping)
- `CAFE` (specialty coffee — MOK), `BAKERY` (viennoiserie/bread — Fine Bakery, Renard), `WINE`
  (natural-wine bar — Titulus). Follows wave-1's uppercase custom-tag convention (SWEET/SEA/INT); the
  build's consolidate step should map these to cuisine buckets (or fold CAFE/BAKERY/WINE into a
  café/sweet/drinks grouping) — flag for the build agent.
