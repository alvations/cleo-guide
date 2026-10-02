# Harrisburg · York · Lancaster & Amish Country (South-Central PA) — standing research brief

Key `harrisburg-pa` · page `cities/harrisburg.html` · dataset `data/harrisburg.dataset.json` · research dir
`data/harrisburg-research/` · build `tools/build-harrisburg.py` · consolidate output `hbg_dataset.json`.
Standard engine theme. Same pipeline + gates as every US city (docs/PIPELINE.md). Does NOT overlap State
College (Centre County / Altoona) — the western edge here is Carlisle/Shippensburg, the southern edge Gettysburg.

## Area ids (use these exact ids in every record's `a`) + density targets (RESUME.md is authoritative)
- `HBG` — Harrisburg & the West Shore: Capitol complex, Midtown, Broad Street Market, City Island, Riverfront,
  Camp Hill, Lemoyne, Mechanicsburg, New Cumberland, Enola/Marysville, Fort Hunter, Dauphin narrows.
- `HER` — Hershey & Derry Township: Hersheypark, Chocolate World, The Hershey Story, Hershey Gardens, Hotel
  Hershey, ZooAmerica, Hummelstown (Indian Echo Caverns), Middletown, Palmyra, Annville/Lebanon edge (Seltzer's).
- `CAR` — Carlisle & the Cumberland Valley: Carlisle (Army Heritage, Dickinson, Carlisle Barracks/Indian School
  sites), Boiling Springs (Appalachian Trail), Pine Grove Furnace (AT midpoint, half-gallon challenge),
  Shippensburg, Newville, Kings Gap.
- `YORK` — York & York County: Central Market York, Harley-Davidson tour, York County History Center, Colonial
  Courthouse, Utz/Snyder's of Hanover (Hanover), Martin's chips (Thomasville), Wolfgang candy, Ma & Pa trail,
  Codorus, Wrightsville, Hanover.
- `LAN` — Lancaster city: Central Market (oldest continuously operating farmers market in US), Penn Square,
  Gallery Row / Prince St, Fulton Theatre, Wheatland, Thaddeus Stevens, Lancaster Science Factory, restaurants.
- `AMISH` — Lancaster County Amish country & towns: Intercourse, Bird-in-Hand, Strasburg (Rail Road, Railroad
  Museum of PA), Paradise, Ronks, Ephrata (Cloister), Lititz (Julius Sturgis, Wilbur), Landis Valley, Manheim,
  Mount Joy, Columbia, Marietta, Elizabethtown, Smoketown, New Holland/East Earl (Shady Maple), covered bridges.
- `GBG` — Gettysburg & Adams County (day-trip edge): Gettysburg NMP + Museum & Visitor Center, Little Round Top,
  Soldiers' National Cemetery, David Wills House, Eisenhower NHS, Adams County fruit belt (orchards), Dobbin House.

Every area needs **≥1 tier-1 must-see** or the build asserts.

## Food canon (opening move — do this first)
Pennsylvania Dutch: **shoofly pie** (Dutch Haven, Bird-in-Hand Bakery), **whoopie pies** (Hershey Farm, Lancaster
Central Market stands), **chicken pot pie** (the square-noodle PA Dutch kind — Good 'N Plenty, Stoltzfus Farm,
Miller's), **chow-chow** & seven sweets and sours, **scrapple** (Habbersett/Hatfield heritage; diners),
**soft pretzels** (Julius Sturgis, Lititz — first commercial pretzel bakery in America; Auntie Anne's born at
Downingtown/Lancaster markets; Hanover's Snyder's), **potato chips** (Utz/Martin's/Gibble's), **York Peppermint
Pattie** heritage, **Hershey** chocolate, **smorgasbords** (Shady Maple — measure merit, don't pad with clones),
standing **markets** (Lancaster Central Market, Broad Street Market Harrisburg, York Central Market, Root's,
Green Dragon, Bird-in-Hand Farmers Market), **birch beer / root beer**, apple butter, Lebanon bologna (Seltzer's).
Then the cities' modern scenes (Harrisburg/Lancaster New American, Puerto Rican/Latin in Lancaster & York,
Bhutanese/Nepali in Harrisburg, breweries).

## Ranked source palette (credible = counts toward the ≥2 bar)
- **Local editorial of record:** LancasterOnline / LNP (`LNP`), PennLive / Patriot-News (`PENNLIVE`), York
  Daily Record (`YDR`), York Dispatch (`YORKDISPATCH`), WITF (`WITF` — public media), WGAL, ABC27, FOX43,
  CBS21, TheBurg (`THEBURG`, Harrisburg civic magazine), Fly Magazine (Lancaster).
- **Tourism boards:** Discover Lancaster (`DISCOVERLANC`), Visit Hershey & Harrisburg (`VISITHERSHEY`), Explore
  York (`EXPLOREYORK`), Destination Gettysburg (`DESTGETTYSBURG`), Visit Cumberland Valley (`VISITCUMBERLAND`),
  Visit PA (`VISITPA`).
- **Institutional (lone-authority-OK where they operate the site):** NPS, Smithsonian, James Beard. PA DCNR /
  PHMC are official but still need a 2nd source.
- **Travel / national:** Uncovering PA (Jim Cheney), Atlas Obscura, Travel + Leisure, USA Today 10Best, Food
  Network, Eater, NYT, Smithsonian Magazine, Wikipedia (coords + notability only).
- **Creators:** only verifiably popular, with a findable piece naming the place (CREATORS_<tag>.json).
- **NEVER a recommender:** Yelp, TripAdvisor, OpenTable, Google (measure/fact-check only = 0 toward the two).

## Amish-region etiquette
Farm stands/Amish businesses often have no website, phone or Sunday hours. They still need ≥2 credible sources
(LNP, Discover Lancaster, Uncovering PA, etc.). Never photograph-centric "tourist" framing; note "closed Sundays,
cash only" in `k` where sourced.

## Rules (identical to every city)
- ≥2 credible sources per place (or lone institutional authority). Merit bar — measure before adding. No padding.
- Fact-check OPEN/CLOSED (2025/2026). Notable closed → kept, flagged `closed:true`; non-notable closed → drop.
- NO coordinates in discovery; geocoding is its own stage (geo/_geoout_*.json, place pins only).
- No duplicates — check existing FOOD_*/SIGHTS_* files first.

## Artifacts (consumed by `tools/rebuild-city.py harrisburg-pa [--build]`)
- Food: `FOOD_<tag>.json` (array `{t,a,cz,dish,n,address,w,closed,warn?,k?,sources}`).
- Sights: `SIGHTS_<tag>.json` (`{"sights":[{t,a,n,address,w,k?,sources}], "sources":[{key,name,url}]}`).
- `SOURCES_<tag>.json` (`{"outlets":[{key,name,type,url,credible,rank}]}`), `CREATORS_<tag>.json`.
