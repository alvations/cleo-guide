# Agent prompts, flow & lessons — the replication playbook

**Why this file exists.** Every expansion in this repo is run by a launched sub-agent. If the prompts live only
in chat scrollback, the next maintainer re-improvises them — that is the ad-hoc trap. This file is the
**auditable, reusable library** of the agent prompt *templates*, how each pass works, the artifact conventions
they must emit, the run log of what was actually run, and the lessons (successes + failures) that shaped the
flow. Read this with [SOURCES.md](SOURCES.md) (source discovery + the post-discovery tool pipeline),
[PIPELINE.md](PIPELINE.md) (stage contract) and [CITIES.md](CITIES.md) (per-city state).

**Golden rule:** discovery (WebSearch) is the only manual stage; *everything after it is codified in tools*
(`tools/rebuild-city.py` and its sub-tools). Never hand-script the merge/register/area/geocode steps.

---

## The shared HARD-RULES block (every discovery prompt embeds this verbatim)

> - **ONLY add credible / authentic / viral / famous-creator-or-major-press-cited places — NOT everything a
>   source lists.** A directory/listicle mention is not merit.
> - **≥2 credible sources per place**, OR one lone institutional authority (Michelin / James Beard / NPS /
>   Smithsonian). **Yelp / TripAdvisor / OpenTable / Google = ZERO** toward the two (fact-check / measure only).
> - **MERIT BAR — measure before adding, then re-rank within region.** Qualify via institutional authority, a
>   real award/vote (Washingtonian 100 Very Best, a RAMMY-type, "Best of <City>"), a verifiable famous-creator
>   or major-press or viral rave, **or** a genuinely high rating with real volume cross-checked on ≥2 platforms.
>   **No padding** — don't stack near-identical spots; record what was MEASURED & DROPPED and why.
> - **Fact-check OPEN/CLOSED** (2025/2026). Notable closed → `"closed": true` (kept, flagged); non-notable
>   closed → drop.
> - **NO coordinates** in discovery — geocoding is a separate stage; never invent lat/lng.
> - **No duplicates** — read the built dataset's `F`/`P` array first and skip what's already there.
> - **Vet every creator** — real, sizable following + a real city/cuisine beat + a *findable* piece of content
>   about the place. A creator is ONE corroborating source, never an institutional authority. Reject anonymous
>   accounts, unverifiable followings, SEO farms.
> - **Do NOT edit shared files** (`data/sources.json`, `data/geocodes.json`, `tools/*`, the dataset, or — for
>   concurrent runs — `AUDIT.md`). Write ONLY the named artifacts in `data/<city>-research/`. Under concurrency,
>   put the pass summary in `_note_<tag>.md`, not `AUDIT.md`.

Run `python3 tools/find-sources.py "<City>, <ST>" [--cuisine|--seed|--creators] --key <city-key>` first — it
prints the credible source TYPES + the canonical query set for the pass, and what's already registered.

---

## Pass templates (what to launch, per pass type)

Each pass writes standard artifacts that `tools/rebuild-city.py <key> [--build]` then consumes deterministically.

### 1. Food discovery — signature canon / cuisine deep-dive / non-American
- **Goal:** the city's signature/unique canon first, then fill thin cuisines (esp. non-American / immigrant).
- **Seed the sources:** local critic of record, city-magazine cuisine best-of, Eater/Infatuation, the
  **"Where the Ambassador of <country> eats"** series, diaspora/community media, awards, vetted creators.
- **Emit:** `FOOD_<tag>.json` (array; `{t,a,cz,dish,n,address,w,closed,sources}`), `CREATORS_<tag>.json`,
  optional `SOURCES_<tag>.json`. No coords.
- **Report:** counts by area+cuisine; creators vetted vs rejected (with follower scale); MEASURED & DROPPED;
  closed found; new outlets.

### 2. Sights discovery — things to visit/see (NOT food)
- **Goal:** monuments/museums/parks/landmarks/oddities the map is missing; every area keeps ≥1 tier-1.
- **Sources:** NPS/Smithsonian/official museum & park sites (lone institutional authority OK), CVBs, city
  magazine, Atlas Obscura, Wikipedia (published coords + notability), historical societies.
- **Emit:** `SIGHTS_<tag>.json` (object `{"sights":[{t,a,n,address,w,k?,sources}], "sources":[{key,name,url}]}`).
- **Report:** counts by area; confirm each area's tier-1; access/closed issues; MEASURED & DROPPED.

### 3. Creator / viral pass
- **Goal:** widen the credible base into verified creators + surface the viral places they made popular.
- **Emit:** `CREATORS_<tag>.json` (`{creators:[…], attach:[{place,creatorKey,url}], rejected:[…]}`) + a
  `VIRAL_<tag>.json` / normal food file for the new places. Repeatable: name later passes `CREATORS_<tag>.json`
  so `merge-creators.py` accumulates them without clobbering.

### 4. Seed-place pass (`--seed`)
- **Goal:** the user names a place (e.g. Mama Chang); reverse-find WHO credibly cites it + merit-worthy siblings.
- **Emit:** `CREATORS_<seed>.json` + `FOOD_<seed>.json`. Same downstream flow.

### 5. Corridor / between-cities pass
- **Goal:** places between two mapped cities; assign each to the nearer map. If a needed area doesn't exist,
  write records with `{"a":"<NEWID>","_newarea":"<Human Name>"}` — `tools/apply-newareas.py` adds it centrally.
- **Emit:** `FOOD_MIDCORRIDOR.json` / `SIGHTS_MIDCORRIDOR.json` (+ `CREATORS_*`) in the appropriate city dir.
- **Note:** a new area needs a **geocodable tier-1** or the build asserts fail — pair a corridor *sights* pass
  (Wikipedia-documented landmarks geocode high) with the food pass so the new area has an anchor.

### 6. Geocode pass
- **Goal:** turn addresses into place-pins. Read Wikipedia coords / Google `!3d!4d` / Apple `coordinate=`;
  **never** a `/@` viewport; **never** fabricate — unresolvable = null + `"unverified"` (the gate holds it for
  the browser `geocode-helper.html`). Grade high/med/low. Confirm status. Emit `geo/_geoout_<tag>_*.json`.

### 7. Engine (Cleveland) splice
- Cleveland is the engine (`cleveland.html`, inline data + validator invariants), not a dataset build. Agents
  only research into `data/cleveland-research/`; the orchestrator geocodes then splices with a **record-count
  assert** (CLAUDE.md rule 2) via `tools/add-to-cleveland.py`, then runs `npm run validate && npm test`.

---

## Concurrent multi-city runs — the shared-lock protocol (2026-10-02)

When several long-running city agents work in ONE clone at once (e.g. the Japan ×5 + Singapore ×4 + US ×6 run),
everything they share is serialized through ONE lock so no read-modify-write is lost:

```bash
LOCK=/home/user/cleo-guide/.git/cleo-shared.lock
flock -w 1800 $LOCK python3 tools/rebuild-city.py <key> --build      # touches geocodes.json, sources.json, backlog
flock -w 1800 $LOCK bash -c 'git add <your paths> data/geocodes.json data/sources.json docs/GEOCODE-BACKLOG.md \
  && git commit -m "<msg>" && git push -u origin <branch>'                       # commit + push your wave
```
- Inside your own `data/<city>-research/` you may write freely; **every** write to a shared file (`data/geocodes.json`,
  `data/sources.json`, `docs/*`, `index.html`, a country hub, `data/countries.json`, `tools/*`) happens under the lock,
  and is a minimal, targeted edit (never rewrite a whole shared file from a stale copy).
- Hubs/indexes carry `<!-- CARD:<key> --> … <!-- /CARD:<key> -->` markers — edit ONLY your own card.
- `git add` explicit paths only (never `-A`/`.`) — other agents' half-written files must not ride your commit.
  If the push is rejected, `git pull --no-rebase origin <branch>` under the lock, then push again.
- WebSearch is shared across all agents: expect rate limits; back off and resume, never fabricate to fill a gap.

---

## Run log (append one row per launched agent; keep updated after each run completes)

| Date | Map | Pass | Focus | Kept | Notable drops / closed | Artifacts |
|---|---|---|---|---|---|---|
| 2026-08-20 | DC | sights | Mall/Smithsonian/NoVA | 61 | Smithsonian Castle (reno) omitted | SIGHTS.json |
| 2026-08-20 | DC | food canon | half-smoke/Ethiopian/Salvadoran/Eden | 26 | pupuseria Yelp-only dropped | FOOD_CANON.json |
| 2026-08-20 | DC | fine dining | Michelin/JB/Washingtonian | 31 | Reverie (closed); Métier/Little Pearl padding | FOOD_FINE.json |
| 2026-08-20 | DC | NoVA suburbs | ARL/TYSONS/RESTON/FCITY/FAIRFAX | 30 | Mokomandy/Water&Wall closed | FOOD_NOVA.json |
| 2026-08-20 | DC | creator/viral | NoVA | 4 | @dcspot rejected | CREATORS.json/VIRAL_NOVA.json |
| 2026-08-20 | DC | NoVA sights | Mosaic/Reston/Great Falls | 15 | — | SIGHTS_NOVA.json |
| 2026-08-21 | DC | Eden+corridor food | Eden Center + inner-NoVA | 18 | Uncle Liu's closed; Banh Mi Oi held | FOOD_EDEN/FOOD_CORRIDOR.json |
| 2026-08-21 | DC | non-American | ambassador/where-X-eats | 36 | Makan/Yeshi/Jiwa closed; Maharani 1-src | FOOD_GLOBAL_DC/NOVA.json |
| 2026-08-21 | DC | seed-place | Mama Chang | 1 | 3 creators rejected | CREATORS_MAMACHANG/FOOD_MAMACHANG.json |
| 2026-08-24 | Dayton | food (Beavercreek) | EAST Asian/Vietnamese | 8 | Dak Joy closed; North China padding | FOOD_BEAVERCREEK_ASIAN.json |
| 2026-08-24 | Dayton | nearby sights | EAST/SOUTH/NORTH/YS | 17 | Brandeberry Yelp-only | SIGHTS_NEARBY.json |
| 2026-08-24 | Dayton+Columbus | corridor food | Springfield/Madison Co | 8 | Fountain on Main closed | FOOD_MIDCORRIDOR.json (both) |
| 2026-08-24 | Columbus | metro sights | theaters/parks/museums | 15 | Palace Theatre padding; Santa Maria gone | SIGHTS_EXPAND2.json |
| 2026-08-24 | Columbus | metro food | immigrant/non-American | 14 | Kamil's Uyghur closed; Thai gap stated | FOOD_COLUMBUS_EXPAND2.json |
| 2026-08-24 | Dayton+Columbus | corridor sights | Springfield/Madison | 13 | — | SIGHTS_MIDCORRIDOR.json (both) |
| 2026-08-24 | Cleveland | region food+sights | Lakewood/West Side | 23 (6 spliced, 17 helper) | Melt + Deagan's closed (flagged); El Carnicero/Nighttown/Balaton dropped | FOOD/SIGHTS_LAKEWOOD.json |
| 2026-08-24 | Cleveland | geocode wave | 23 Lakewood/Heights/Bay | 6 pinned | Capitol Theatre viewport-trap → UNVERIFIED; Deagan's new closure catch | geo/_geoout_lakewood_*.json |
| 2026-08-24 | Columbus | geocode wave | 42 metro+corridor | 24 pinned | Mikey's/Chuan Jiang bad-pin rejected → UNVERIFIED | geo/_geoout_wave_*.json |
| 2026-08-24 | Dayton | geocode wave | 41 metro+corridor | 18 pinned | 14 restaurants + 9 parks UNVERIFIED (helper) | geo/_geoout_wave_*.json |
| 2026-10-02 | Indianapolis | scaffold + food-canon W1 | tenderloin/IM Best Restaurants/JB 2026 | 0 (leads only) | W1 truncated at 5 searches by shared WebSearch session cap (200/200) | _PENDING_LEADS.md, AUDIT.md |
| 2026-10-02 | Hokkaido | sights (SPR) W01 | Sapporo icons, batched Wikipedia-coords queries | 12 (9 pinned) | Ōkurayama/Hōheikan/Tanukikōji held single-source; stopped at the 200/200 session WebSearch cap | SIGHTS_HOKKAIDO_W01.json, geo/_geoout_hokkaido_w01.json |
| 2026-10-02 | Okinawa | W2 relaunch (all areas) | Stripes-GPS lists × japan-guide/Visit Okinawa/LP/Mapple/Okinawa Times soba poll; island coords via Wikipedia/Atlas Obscura | 106 (+W1 13 = 119; 74 pinned) | Itokazu (2× Stripes = 1 outlet) re-held until Wikipedia; Kintaro, Urasoe, Araha-GPS rejected for unattributable/misattributed GPS; Yaedake pin pulled (GPS conflict w/ Nakijin); Yui soba closed (KozaWeb) not added | FOOD/SIGHTS/SOURCES/CREATORS_OKINAWA_W2, geo/_geoout_okinawa_W2, _okinawa_w2_notes.md |
| 2026-10-02 | Okinawa | W3 — §2b food & drink first + ANIME (200/200 searches incl. 2 bg geocoders) | Rurubu ↔ Mapple list pairs, Okinawa Times 2023 soba poll ↔ Okinawa Traveler, prefecture Ryukyu-cuisine certification, KozaWeb, Stripes; ANIME via Ryukyu Shimpo (Anime Tourism 88 / Aquatope) + Pokémon official | +95 (214 researched: 107 food = 50 %, was 22 %; 89 pinned; ANIME 4) | 5 geocoder coords rejected (unattributed summary GPS); restaurant GPS essentially unfindable via search (1/50) → helper; ~60 single-source leads held; CLOSED flagged: Ayagu Shokudō, Ichigin Shokudō | FOOD/SIGHTS/SOURCES_OKINAWA_W3, geo/_geoout_okinawa_W3{,G,R}, _okinawa_w3_notes.md |
| 2026-10-02 | Miami | food canon + Michelin + sights + 3 geocode waves | all 9 areas (FTL→GLADE) | 166 researched / 71 pinned | Seaquarium, Fiola, Lion & the Rambler CLOSED; ~40 single-source held; 95 restaurant pins UNVERIFIED | FOOD_F1–F4, SIGHTS_S1–S5, CREATORS_F1, geo/_geoout_w1–w3 |

| 2026-10-02 | Liège | discovery W1 (partial) | LIE sights + boulets/gaufre canon | 5 (1 geocoded) | halted: WebSearch session budget 200/200 after 11 searches; ~20 leads held in _PENDING_LEADS.md | liege-research/SIGHTS_LIEGE_LIE, FOOD_LIEGE_LIE, geo/_geoout_liege_w1 |
| 2026-10-02 | Tokyo | sights W1 (CYD) | sights backbone via Wikipedia/GO TOKYO/japan-guide/Time Out | 9 (all geocoded) | halted: shared WebSearch budget 200/200 exhausted | SIGHTS_TOKYO_W1.json, geo/_geoout_tokyo_w1.json |
| 2026-10-02 | Tokyo | W2 relaunch (own budget, 166 searches) | Michelin venue pins, Wikipedia/Wikidata coords, GO TOKYO/japan-guide/Time Out/Japan Times corroboration, 2 creators | 314 discovered / 294 rendered (212 sights + 82 food) — LIVE | 20 Michelin UNVERIFIED (no coords on page); 39 held (`_pending_w2.json`); Unicorn Gundam flagged CLOSED; 31 memory-typed kanji names stripped | FOOD/SIGHTS/CREATORS_TOKYO_W2.json, geo/_geoout_tokyo_w2.json, _tokyo_golive.py |
| 2026-10-02 | Tokyo | W3 continuation (~155 searches) | UNVERIFIED Michelin pins re-run; address-verify pass on all 222 sights; status re-checks; Michelin by ward ("<Ward>-ku" "Bib Gourmand" "2026 MICHELIN Guide Japan") + 2024–26 star/Bib announcement lists; Wikidata pins for held sights | 382 discovered / 377 rendered (237 sights + 140 food) — LIVE | 5 UNVERIFIED (Abe Honten, Afuri Ebisu, Tamahide, Iseya, Amazake-chaya → geocode-helper); 25 held; addresses 130 verified · 8 fixed · 55 coarsened | FOOD/SIGHTS_TOKYO_W3.json, geo/_geoout_tokyo_w3.json, _addrcheck_w3.json, _addrmark.py |
| 2026-10-02 | Kyoto | W2 relaunch (own budget, ~170 searches incl. an 18-search pin worker) | UNESCO WHC component coordinates (688 + 870 maps pages); en/ja Wikipedia coordinate batches; japan-guide/kyoto.travel domain-filtered corroboration; Michelin ward+genre lists + venue-page lat/lng pins | 220+ discovered / 198+ rendered at go-live (136 sights + 62 food) — LIVE | 0 creators vetted (creator queries returned tour vendors/unattributed videos); 2 Gion kaiseki dropped as padding; memory-typed chō names stripped; ~12 UNVERIFIED held | SIGHTS_KYOTO_*.json, FOOD_KYOTO_{W2,W3,W4}.json, geo/_geoout_kyoto_*.json, _kyoto_{add,rows,food}.py, _kyoto_push.sh |
| 2026-10-02 | Kyoto | W3 relaunch — §2b food & drink first + §2c anime (main ~100 searches + 3 bg workers: anime 22, Michelin 40, pins 30) | Leaf KYOTO, Inside Kyoto (Chris Rowthorn), Time Out, MATCHA, Lonely Planet, Kyoto City Official (EN + 京都観光Navi), Savor Japan, Visit Nara, Amanohashidate official, Michelin 2026 venue pages; ja-Wikipedia 座標 batches | 229 → 370 discovered (food 71 → 187 = 51%), 216 → 301 rendered; ★ Anime 7 | Wabiya Korekidō / Michelin 'wabiya' conflation caught & corrected; Unagi Hirokawa not claimed as Michelin (absent from 2026 guide); KyoAni Studio 1 deliberately not added; ~40 single-source leads held; 69 UNVERIFIED (non-Michelin food) | FOOD_KYOTO_{W5,MICH5}, SIGHTS_KYOTO_{W3S,ANIME1}, SOURCES/CREATORS_KYOTO_W3, geo/_geoout_kyoto_{food_w5,mich5,w3s,anime1}, geo/_repin_kyoto_w3 |
| 2026-10-02 | Kyoto | W4 relaunch — food-first fill of every NEED area (main ~98 searches + 2 bg workers: sights 25, pins 28) | JA queries domain-filtered to credible JA outlets (京都観光Navi, Rurubu, MAPPLE, Walkerplus, Serai, Wa-raku, Leaf, Kyoto Shimbun, Keihan) + official DMOs (Umi-no-Kyoto, Ine, Nara City, Biwako Visitors, Amanohashidate); ja-Wikipedia 座標 batches | 370 → 494 discovered (food 272 = 55%), 301 → 339 rendered; every area at target; ★ Anime 9 | 4 worker sights held (passing-mention / same-outlet 2nd source); 2 container pins rejected (Matsuba≠Minami-za, Tsūen≈Uji Bridge); ~25 single-outlet leads held; memory-typed details stripped before commit | FOOD_KYOTO_W6, SIGHTS_KYOTO_{W4S,W4B,ANIME2}, SOURCES_KYOTO_W4, geo/_geoout_kyoto_{w4s,w4b,w4pins,anime2}, _kyoto_w4_held.json |
| 2026-10-02 | Chicago | scaffold + food canon W1 | areas/taxonomy/build + canon | 0 (BLOCKED) | session WebSearch cap 200/200 exhausted by concurrent agents after 3 calls; 7 partial leads in _PENDING_LEADS.md | consolidate.py, build-chicago.py, SOURCES_BASE.json |
| 2026-10-02 | Akron-Kent-Canton | scaffold + W1 food canon | Barberton chicken | 1 | blocked: shared WebSearch session cap 200/200 hit at 2nd query; Milich's held 1-src | FOOD_W1CANON/SOURCES_W1.json, geo/_geoout_w1_canon.json |
| 2026-10-02 | Singapore BLS | food canon (W1, partial) | Balestier Rd + Whampoa Makan Place | 13 | 545 Whampoa (relocation?) + 20 single-source held; stopped at session WebSearch cap 200/200 | FOOD/SOURCES/CREATORS_BALESTIER.json, _note_BALESTIER.md |
| 2026-10-02 | Singapore — Punggol (PGL) | discovery W1 (partial) | One Punggol / Punggol Coast HC + Coney/Punggol Point/Sook Ching sights | 9 (5 food + 4 sights; 0 geocoded) | halted ~17 searches in: session WebSearch cap 200/200; ~35 single-source/unmeasured leads held in _note_PUNGGOL.md | FOOD/SIGHTS/SOURCES/CREATORS_PUNGGOL.json, _note_PUNGGOL.md |
| 2026-10-02 | Orlando | scaffold + W1 Michelin (partial) | 18 areas/taxonomy, build-orlando.py, 22 outlets | 0 (leads only) | stopped: session WebSearch cap 200/200 hit after 8 calls | consolidate.py, SOURCES_CORE.json, _PENDING_LEADS.md |
| 2026-10-02 | Osaka | W1 Michelin + sights backbone | KITA/CHUO food (udon/soba/ramen/tonkatsu) + Kita sights | 28 (24 food, 4 sights; 5 geocoded) | truncated by session WebSearch cap 200/200; 3 Bib held (no address), 9 single-source sights held | FOOD/SIGHTS/SOURCES_OSAKA_W1.json, _held_W1.json, geo/_geoout_osaka_W1.json |
| 2026-10-02 | Singapore NVN | food+sights W1 | Newton FC Bib canon | 6 | 15 held single-source; halted by WebSearch 200 cap | FOOD/SIGHTS/CREATORS/SOURCES_NOVENA.json, geo/_geoout_novena_w1.json |
| 2026-10-02 | Kyoto | W1 HGS sights + canon (partial) | Higashiyama icons + Michelin Bib | 12 (11 HGS + 1 CTR; 3 pinned) | halted after ~14 Kyoto searches: session WebSearch cap 200/200; 16 leads held | SIGHTS/FOOD/SOURCES_KYOTO_*, geo/_geoout_kyoto_hgs1.json, _PENDING_LEADS.json |
| 2026-10-02 | Okinawa | W1 sights+canon (truncated) | Naha UNESCO backbone, soba/taco-rice canon | 13 (6 pinned, 7 UNVERIFIED) | session WebSearch cap 200/200 hit after 17 searches; Shuri Soba/Miyazato/Tsuboya held 1-src | SIGHTS/FOOD/SOURCES_OKINAWA_W1.json, geo/_geoout_okinawa_W1.json |
| 2026-10-02 | Madison WI | food canon W1 (truncated) | curds/fish fry/supper clubs/JB honorees | 3 | 19 food + 1 sight held in _PENDING_LEADS.md (dish/address/2026 status); halted by shared 200-call WebSearch cap after ~22 searches | FOOD_CANON.json, SOURCES_W1.json, geo/_geoout_w1.json |
| 2026-10-02 | Singapore HLV | discovery W1 (partial) + geocode + build | Ghim Moh / Holland Drive MFC hawker canon + 3 food-centre sights | 13 (10 food + 3 sights; 5 pinned med, 8 UNVERIFIED) | Guan Kee CKT CLOSED flagged; 9 held (single-source / status / attribution); halted at session WebSearch cap 200/200 after 27 calls | FOOD/SIGHTS/SOURCES/CREATORS_HOLLANDV.json, geo/_geoout_hollandv_w1.json, _note_HOLLANDV.md |
| 2026-10-02 | Osaka | W2 discovery + geocode + build + go-live (main + workers G1/S1/M1/M2) | held W1 Bibs, konamon canon, Michelin Osaka harvest, sights all 9 areas | 189 discovered, 166 rendered (61 sights + 105 food) | 0 closures; Housing & Living museum closed for renovation (not added); 3 Michelin held (no dish); street-food pins UNVERIFIED; Time Out singles pending | FOOD_OSAKA_W2/M1/M2, SIGHTS_OSAKA_W2/S1, SOURCES_OSAKA_W2, geo/_geoout_osaka_{W2,W2u,G1,M1,M2,S1}.json, _pending_osaka_W2.json |
| 2026-10-02 | Philadelphia | W1+W2 discover + geocode + build + go-live | Michelin 2025, cheesesteak/roast pork/tomato pie/water ice/RTM canon, Washington Ave Vietnamese, sights in all 10 areas | 170 sourced (106 on map: 91 sights + 15 food; ~49 food UNVERIFIED) | Hiroki + Laurel CLOSED flagged; Singing Fountain dropped (1 outlet); Casa Mexico merged; ~27 single-source leads held | FOOD_MICHELIN/CANON/W1B.json, SIGHTS_W1/W2.json, CREATORS_W1.json, geo/_geoout_w1_food/w1_sights/w2_sights.json |
| 2026-10-02 | Philadelphia | W3 food+sights discovery, 3 status passes, rebuild | neighbourhood guides x 2nd outlet in all 10 areas; JBF 2023-26 + NYT award lists; hoagie/water-ice canon; NPS Independence, Fairmount Park houses, Bucks/Brandywine/Montco/South Jersey sights; 7 restaurant Wikipedia pins | 422 sourced (+242; 170 on map: 149 sights + 21 food) | Cheu Fishtown, Jansen, Italiano's, Pizza Brain, Lunar Inn, Martha, Syrenka, Hops dropped; Tony's Place flagged CLOSED; density.py worklist double-count fixed | FOOD_W3.json, SIGHTS_W3.json, SOURCES_W3.json, CREATORS_W3.json, geo/_geoout_w3_food/sights/foodpins.json |
| 2026-10-03 | Philadelphia | W4 food & drink first density wave + 2 pin passes + status pass (3 bg agents ≤30 searches each) | FISH bars/breweries + Las Parcelas, NPH Brewerytown, NW Manayunk/Mt Airy/Chestnut Hill, UCW Baltimore Ave, NE Castor/Bustleton, Chinatown, East Passyunk drinks, Point Breeze, Eater Sept-2026 heatmap, Sparks Shot Tower | 455 sourced (+33: 31 food/drink + 2 sights); 179 on map (150 sights + 29 food); +9 pins, +11 statuses | Kensington Quarters + Dock Street (W Philly) CLOSED flagged; Crime & Punishment, Majolica dropped (closed); Graffiti Pier skipped (Conrail trespass, not public); Fairhill Dominican/PR (El Bohio, La Sierra, La Caribeña, El Príncipe) held single-source (Visit Philly only); pin passes: Google !3d/OSM never surface via WebSearch — only Wikipedia coords | FOOD_W4.json, SIGHTS_W4.json, SOURCES_W4.json, geo/_geoout_w4_pinA/pinB/status/sights.json |
| 2026-10-02 | Liège | W2+W3 discover + geocode + build + go-live (lead + 5 bg geocode agents) | Michelin/G&M benches (Liège, Verviers, Spa, Huy, Theux, Esneux, Eupen, Waimes), boulets canon (Moustique, RTBF, Diamond Boulet), péket/beer layer, sights via Wikipedia coords | 147 discovered, 99 rendered (57 sights + 42 food) | 0 closures; Gaufrette pin downgraded (was Cabale's node); Arabelle OSM pin rejected (ViaMichelin used); ~30 single-source leads held; 48 restaurant pins UNVERIFIED (cap 200/200) | FOOD_LIEGE_{W2,W3,LIER,LIER_W3}, SIGHTS_LIEGE_{W2,W3}, CREATORS_LIEGE_W2, geo/_geoout_liege_{w2,w2food,w2b,w2c,w3,w3r,w3s,w3t}.json |
| 2026-10-02 | Hokkaido | W02–W15 discovery + geocode (G01/G02 workers) + build + go-live | food canon (miso ramen, soup curry, jingisukan, Otaru sushi, Hakodate shio, Asahikawa shōyu, butadon, Muroran curry ramen) + sights in all 9 areas incl. 6 UNESCO Jōmon sites | 140 discovered, 104 rendered (100 sights + 4 food) | 0 closures; ~30 single-source leads held (AUDIT); 60 unsourced block numbers/postcodes stripped in a self-audit; restaurant pins UNVERIFIED (no lat/lng via WebSearch) | _w02…_w15 ledgers → FOOD/SIGHTS/SOURCES_HOKKAIDO_W02–W15.json, geo/_geoout_hokkaido_{w02–w15,g01,g02}.json |

**Builds landed 2026-08-24:** Columbus → **86 pins** (62 sights + 24 food), all 4 gates green, 41 UNVERIFIED queued.
Dayton → **74 pins** (55 sights + 19 food), geocheck/statuscheck/buildcheck green; sourcecheck FAIL = 2 single-source
places (Aullwood, Third Perk) that build GATE 1 drops, so the page is clean. Cleveland (engine) → Lakewood/West-Side +
Heights + Bay Village spliced via `add-to-cleveland.py`: **+6 geocoded** (P 143→148, F 45→46 = **194 on page**),
17 UNVERIFIED held for the helper, Melt + Deagan's flagged CLOSED; `npm run validate && npm test` green.

_Update the last rows' counts/outcomes when those agents complete and after the builds land._

---
| 2026-10-02 | Chicago | food canon + Michelin/JB | beef/deep-dish/tavern/dogs/jibarito/Iconic Eats; Michelin 2025 stars+Bib; JB America's Classics | 69 food | 13 canon pins + 8 Bib pins UNVERIFIED (no Wikipedia/POI pin); Boka/Galit aggregator coords demoted | FOOD_CANON.json, FOOD_MICHELIN.json, geo/_geoout_canon.json, _geoout_michelin.json |
| 2026-10-02 | Chicago | sights S1–S8 | every area via Wikipedia 4-per-query pins + Time Out/Choose Chicago/CAC/WTTW/Atlas Obscura 2nd sources | 135 sights | Uptown Theatre flagged CLOSED; Calumet Park dropped (2nd source didn't name it); Givins Castle/Indiana Dunes SP/Douglass Park coords too coarse — not used | SIGHTS_W1..W8.json, geo/_geoout_sights.json |
| 2026-10-02 | Chicago | creators | Portnoy One Bite, Keith Lee | 2 creators / 3 attaches | SEO beef listicles rejected | CREATORS_W1.json |
| 2026-10-02 | Singapore PGL/BLS/NVN/HLV | W2 relaunch (one session, ~170 searches incl. 52 geocoder) | extended + domain-filtered multi-guide stall lists; Roots/URA/Wikipedia heritage; Michelin Scotts Rd | +144 (PGL 35, BLS 56, NVN 37, HLV 57 — true counts after the density.py worklist fix) — HLV LIVE (33 pins) | BLS held from go-live (hawker buildings unpinnable via search); CLOSED flagged: Miao Sin, Ponggol Seafood, Old Police Academy; Food King rejected (videos deleted) | FOOD/SIGHTS_{PUNGGOL2,BALESTIER2,NOVENA2,HOLLANDV2}, geo/_geoout_{punggol_w2*,sg4_w2b,sg4_w2d,balestier_w2/3,novena_w2/3,hollandv_w2/3}, _sg4_searchlog.md |
| 2026-10-02 | Orlando | session 2 relaunch (~160 searches incl. ~84 by 5 background pin-pass agents) | Michelin 2026 (stars/Bibs/Recommended), JBF semifinalists, OW Best of, DDD; per-park attractions pinned from Wikipedia/Wikidata/Coasterpedia; AllEars/Frommer's/TPI/Attractions Mag/Laughing Place/Orlando Informer corroboration | 208 researched (153 sights + 55 food) — LIVE, 136 sights + 6 food on the map | restaurants unpinnable via search (40/42 failed) → helper backlog; CLOSED: Dinosaur (DAK), Ethos Vegan Kitchen; Cocoa Beach Pier coord rejected (= Ron Jon's); Slinky Dog coord rejected (= RnRC's) | data/orlando-research FOOD_*/SIGHTS_*/geo/_geoout_{parkpins1-3,pinpass4,foodpins1,…} |
| 2026-10-02 | Orlando | session 3 — §2b food & drink first (lead + 4 bg discovery workers, 200/200 searches) | OW Best of Orlando 2026 polls, Sentinel Foodie/Central FL Favorites, Michelin Recommended, Scott Joseph, Tasty Chomps, Food Network/TouringPlans/DFB park dining, Space Coast Living, Florida Rambler, Roadfood, @somehowimnotfat (FOX 35) | +76 food (284 researched; food share 26%→46%); page 141 sights + 6 food | Papa Llama CLOSED (flagged); Deadwords/Credo/Finnegan's not added; ~60 single-source leads held; all new restaurants UNVERIFIED → helper | FOOD_S3{BAR,PARK,CITY,PR,SPACE,NORTH,IDR,LOCAL,MICH}, SOURCES_S3*, geo/_geoout_s3* |
| 2026-10-02 | Hokkaido | session 3 — §2b food & drink first + §2c anime (lead + W40 anime & W60 sights bg agents, ≈168 searches) | soup curry, jingisukan, shime parfait, Hakodate shio/squid, Shakotan uni, Otaru sake/beer/sweets, Kushiro ramen/robata, Asahikawa ramen; michi-no-eki signature foods with ja.wikipedia pins; Golden Kamuy overlay | 327 discovered (153 food = 47%), 184 rendered; ANIME 7 | 0 closures found; Doraemon Sky Park (closed 2025) & Kita no Kuni kara museum (closed 2016) dropped; ~40 single-source leads held; restaurant pins → helper (143 UNVERIFIED) | _w31…_w75 ledgers → FOOD/SIGHTS/SOURCES/CREATORS_HOKKAIDO_W31–W75.json, geo/_geoout_hokkaido_w31–w75.json; japan_consolidate _overlay() |
| 2026-10-02 | Hokkaido | session 4 — W80 host-landmark pins, W81 anime wave 2, W82–W84 food-first discovery (5 bg agents ≤30 searches) + W85–W87 (SPR/NSK/DONAN/DHOKU sights, promotions) | SPR/OTARU ramen, soup curry, zangi, bars, Otaru/Yoichi wine; Hakodate wine/squid, Niseko distillery & cheese, Asahikawa sake/shinkoyaki, Biei curry udon; DOTO/IBURI/TKC/SOYA michi-no-eki & capes; Golden Kamuy / Love Live! Saint Snow | 435 discovered (218 food = 50%), 252 rendered; ANIME 18 | 0 closures; 4 W82 records held by orchestrator review (non-exact 2nd source); restaurant pins still mostly UNVERIFIED (183) | _w80…_w85, FOOD/SIGHTS/CREATORS_HOKKAIDO_W81–W85.json, geo/_geoout_hokkaido_w80–w85.json, _note_W80–W84.md |
| 2026-10-03 | Hokkaido | session 5 — W88–W92 food-first discovery + anime/pop-culture (5 bg agents ≤30 searches) + G05 pins agent + W93 orchestrator promotions | Sapporo ramen/soup curry/jingisukan/bars/parfait; Niseko dairy, Kutchan/Hirafu curry, Shakotan uni, Yoichi wine; Asahikawa shinkoyaki & sake, Furano omu-curry, Tokachi cheese/butadon; Hakodate shio & cafés, Kushiro robata, Nemuro escalope, Shiraoi beef; Detective Conan (Hakodate 2024 film), Golden Kamuy, Pokéfuta, Snow Miku, Kita no Kuni kara | 509 discovered (273 food = 54%), 274 rendered; ANIME/pop 30 | 0 closures; G05: 0 restaurant pins reachable (5 sight pins); ~35 single-source leads held | _w88…_w93, _g05_pins.py, FOOD/SIGHTS/SOURCES/CREATORS_HOKKAIDO_W88–W93.json, geo/_geoout_hokkaido_w88–w93,g05.json, _note_W88–W92,G05.md |
| 2026-10-02 | San Francisco & Peninsula | modernisation session (plumbing → credibility audit → closures → re-rank → 4b re-verify → food-first expansion; ~173 main + 18 pin-agent searches) | Michelin venue pages by ZIP/cuisine (address **and** place-pin lat/lng from the venue page, 4 names/query), 2026 Michelin stars (sfist) + Bibs, JBF 2025/26 semifinalists (axios), Eater SF 38, SF Travel neighbourhood pages × Wikipedia coordinate batches, Infatuation/Time Out/SF Standard/Atlas Obscura for bars & SE | 148 → 290 researched (food 62.4%), 141 → 265 on the map; 8 key-hygiene fixes, 0 drops; food re-ranked per area (`_sf_rerank.py`); 7 old pins upgraded (Yank Sing 176 m fix) | CLOSED found & not added: Prelude, Auntie April's, Café Jacqueline, Lord Stanley; 3 Sichuan places dropped (only legacy Michelin pages); no creator met the bar | data/san-francisco-research FOOD_W3A/B/C, SIGHTS_W3A, geo/_geoout_{w3a,w3b,w3c,s3a,fixold}, _sf_*.py/sh |
| 2026-10-02 | San Francisco & Peninsula | wave 2 (W4): pin 25 held + food-first discovery every area (~113 main + 52 pin-agent searches) | Infatuation neighbourhood/cuisine guides intersected with SF Chronicle (2026 Top 100 + features), Time Out, SF Standard, SFGATE, SF Travel, 7x7, Mission Local; `allowed_domains` multi-name OR queries return addresses for 3–6 names; Wikipedia/Atlas Obscura/HMDB/OSM pins for sights; building-level pins for Ferry Building/Ghirardelli vendors | 290 → 383 researched (food ≈67%, ≥50% in every area), 265 → 298 on the map; 13 of the 25 held pinned + new sights pinned | Dropped/excluded: Osito, Mr. Holmes, Shanghai Dumpling King, Ton Kiang, Naadam, Mongol Cafe (closed), Casaro Osteria (padding); 15 Romolo/Slanted Door/Cha Cha Cha status unconfirmed; no creator met the bar (Joey Yee: no follower scale/place picks) | data/san-francisco-research FOOD_W4, SIGHTS_W4, geo/_geoout_{w4,w4pin,w4pin2} |
| 2026-10-02 | San Francisco & Peninsula | W6 (session 4): close every NEED area, then expand past target (~123 main + 30 pin-agent searches) | SF Standard "panel of pros" lists (print addresses) × one `allowed_domains` cross-check query (Infatuation/Chronicle/SFGATE/7x7/Mission Local); Chronicle 2025 1906-survivors tour, underrated-parks, best-kept-secrets & classic-bars guides × Wikipedia/Atlas coordinate batches; pin agent: wikipedia-restricted "<name> <street> coordinates" | 503→579 researched, 368→396 on map; every area ≥ target; food 63% | DROPPED: Sam Wo, Edinburgh Castle, Chili House (closed), Otra (closing Dec 2026), MCCLA (closed Jan 2026), Anchor Brewing (dormant); SFO museum pin low→med | FOOD_W6.json, SIGHTS_W6.json, geo/_geoout_w6.json, geo/_geoout_w6pin.json |
| 2026-10-02 | Tokyo | W6 food-first + anime (lead) | ramen canon, Michelin 2026 star tier, shinise, yokochō/senbero, TAMA/JOTO | 62 food + 10 sights | Tonkatsu Hasegawa held (2023-only Michelin); one-outlet drops logged in AUDIT | FOOD/SIGHTS_TOKYO_W6.json, _w6_*_verified.json |
| 2026-10-02 | Tokyo | W6 drinks agent | kissaten, kakigōri, bars, craft beer | 17 | DUG closed 27 Jun 2026 (Time Out); chains/padding dropped | _w6_drinks_verified.json |
| 2026-10-02 | Tokyo | W6 outer-area agent | TAMA/JOTO/KANTO/SMKT canon | 4 (+3 held) | 11 one-outlet candidates dropped | _w6_outer_verified.json |
| 2026-10-02 | Tokyo | W6 geocode agent | UNVERIFIED pins via Google !3d!4d / Michelin | 4 pins of 93 | 89 no usable place pin | geo/_geofix_tokyo_w6.json |
| 2026-10-02 | Miami | S3 discovery (food-first, all areas) | domain-restricted list ∩ list (Time Out/Infatuation/NT/Fodor's), NPS, creators | 191 (162 food & drink) | Dos Croquetas (negative Infatuation review), Fookem's (delivery-only), Viernes Culturales (event); ~120 single-outlet held | FOOD_F5.json, SIGHTS_S6.json, CREATORS_F5.json |
| 2026-10-02 | Miami | S3 geocode agents w4–w8 | sight pins via Wikipedia/hmdb/NPS | 33 pins | Fillmore Miami Beach found CLOSED (2022); Clippix/latlong/tide-gauge coords rejected | geo/_geoout_w4–w8.json, _geoout_zz_status1.json |
| 2026-10-02 | Tokyo | W7 finishing (food-first close-out + anime + pins) | last 7 NEED areas, ANIME wave, 128 unpinned | +13 (8 food, 5 anime) · 26 pins · 6 address fixes | Allpress Kiyosumi (closing autumn 2026); Funabashiya/Tonkatsu Hasegawa/Namiki Yabusoba/Azabu Hikawa held (1 source or stale award) | FOOD/SIGHTS/SOURCES_TOKYO_W7.json, geo/_geofix_tokyo_w7.json, _w7_*_verified.json |
| 2026-10-02 | Okinawa | W4 pin-first + discovery + anime (9 bg agents) | geocode 125 unpinned; Naha/Chūbu/Nanbu/Hokubu/islands food & drink; anime | +44 places, +41 pins (89→130) | aggregator coords graded low; 5 untraceable coords demoted; Ukishima Garden → held (constructed URL) | geo/_geoout_okinawa_W4G1–G5/D1–D3/A.json, *_OKINAWA_W4D*.json |
| 2026-10-03 | Okinawa | W5 pin-first + discovery + anime (8 bg agents) | geocode 128 unpinned; Naha/Chūbu/Nanbu/Hokubu/islands food & drink; anime | +44 places (258→302), +53 pins (130→183) | Arakaki Shokudō CLOSED; Todoroki pin demoted (unattributed); Tamatorizaki/Akagi med→low; KOURI SHRIMP listing rejected (address mismatch) | geo/_geoout_okinawa_W5*.json, *_OKINAWA_W5*.json |
| 2026-10-03 | Osaka | W4 discovery + anime (6 bg agents × 28 + main) | MINAM/TNJ/EAST/BAY/SOUTH/NORTH/KNSAI food; sights backbone; anime | +53 places (319→372, 62% food), +24 pins (266→290), ANIME 10→16 | Shochikuza flagged CLOSED (May 2026); Tominoya dropped (no current Michelin page); Michelin dead for suburbs/bay | FOOD/SIGHTS_OSAKA_W4{A-F,M}, geo/_geoout_osaka_W4*, _held_W4.json |
| 2026-10-03 | Osaka | W5 discovery JP+EN + anime + geocode (6 bg agents + main) | BAY/EAST/TNJ/MINAM/SOUTH/NORTH/KNSAI food; Den Den Town anime; pin backlog | +26 places (372→398, 62% food), +7 rendered (290→297), ANIME 16→21 | Misono Bldg flagged CLOSED (Jul 2025); Shochikuza CLOSED re-confirmed; 4 held on main review (KANPAI rejected; unconfirmed Oggi URL; creator-only pair; shop-page-as-Hyakumeiten); EAST 0 (single-source exhaustion) | FOOD/SIGHTS_OSAKA_W5{A,C,D,E}, geo/_geoout_osaka_W5*, _held_W5.json |

## Lessons learned (successes, failures, and the code fix each produced)
- **UNESCO WHC `/list/<id>/maps` pages carry per-component coordinates** (Kyoto, 2026-10-02): two searches ("whc.unesco.org 688 maps <component names> coordinates N E") gave 23 lone-authority sights with pins. Try this first for any serial World Heritage property. Also: a `ja.wikipedia.org`-filtered query of 5–6 Japanese names + 座標 returns up to 5 published coordinates where enwiki has no article; and in a multi-name Wikipedia query, one name WITHOUT an article makes the tool retry internally (~6 searches), so pre-screen the names.

- **2026-10-02 (SG 4-town): `allowed_domains` makes attribution exact.** A standard WebSearch summary merges several pages, so per-stall "which outlet said it" is guesswork; restricting `allowed_domains` to the credible outlets (eatbook.sg, sethlui.com, misstamchiak.com, danielfooddiary.com, hungrygowhere.com, ieatishootipost.sg, timeout.com, …) and OR-ing 6-8 held names returns the exact pages that mention each — the cheapest way to 2nd-source a held list. Some domains are refused by the API (straitstimes.com, cntraveler.com, tatler.com) and fail the whole call. Also: Women's Weekly and Her World hawker lists are syndicated — count them as one voice.

- **Wikipedia pins, four per query (Chicago 2026-10-02).** `Wikipedia coordinates A; B; C; D` with
  `allowed_domains:["en.wikipedia.org"]` returns published coords for ~3–4 landmarks per search (≈0.3 searches/pin), and
  Wikipedia restaurant articles (Girl & the Goat, Avec, Oriole, Next, Kumiko…) pin food too. Per-restaurant latlong.net
  searches for non-Wikipedia restaurants failed 13/20 — hold those UNVERIFIED for the helper rather than burning budget.
  Pair each coord batch with ONE themed 2nd-source query on `choosechicago.com`/`timeout.com`/`architecture.org`/`wttw.com`.
  Builders: an area whose places are all un-pinned is now hidden by `tools/build-chicago.py` instead of tripping the
  tier-1 assert (areas WITH pins must still carry a tier-1).

- **Restaurant place-pins rarely surface via WebSearch here** (only place-id/CID/viewport links). → Honest
  `UNVERIFIED` + the browser `geocode-helper.html`; never fabricate. Sights (Wikipedia coords) geocode high.
- **A cloned build once shipped centred on the wrong city (SF on San Jose).** → Map centre/labels are DERIVED
  from pins + the `--buildcheck` gate. Structural, not a one-off.
- **A find-and-replace once deleted 143 records from cleveland.html and still parsed.** → Any script touching
  the engine must assert record counts before/after (CLAUDE.md rule 2); the Cleveland splicer enforces it.
- **"Mention is not merit."** Adding on a single listing produced padding. → The merit bar (measure acclaim)
  is codified in SOURCES.md + CLAUDE.md and embedded in every prompt; agents now report MEASURED & DROPPED.
- **Institutional authorities were missing from the gate** (Smithsonian; earlier NPS). → Added to `ELITE_SOLO`
  across sourcecheck.py / research.js / geocode-status.py / build-*.py / guidekit — kept in sync, tested.
- **A creator pass clobbered the previous CREATORS.json.** → `merge-creators.py` globs `CREATORS*.json`
  (repeatable, non-clobbering); passes are named `CREATORS_<tag>.json`.
- **`merge-creators.py` mis-resolved multi-part keys** (`washington-dc` → `washington`). → Prefer the full-key
  dir, fall back to the state-stripped slug.
- **Source discovery was improvised.** → `tools/find-sources.py` emits the canonical query plan (city / cuisine
  / seed / creators) + the source-type checklist; a DC-ism leak in its template was fixed to stay generic.
- **35 source keys were used in Columbus but never registered.** → `register-sources.py` auto-catches any
  used-but-unregistered key (excluding creators + open-check) and flags it for a rationale — the registry can
  no longer silently miss a discovered source. **Cleaning up the flow must never drop a discovered source.**
- **Closed-place flagging was hand-done inconsistently** (name vs registry key mismatch → statuscheck FAIL). →
  `geo-merge.py` renames both the registry key and the research record when a geocode pass finds a closure.
- **New corridor areas need a geocodable tier-1** or the build asserts. → Pair a corridor sights pass; verify
  each area has a surviving tier-1 before `--build` (promote a within-region standout if needed, as for Columbus WEST).
- **Concurrency corrupts shared appends.** → Parallel agents write distinct filenames + `_note_<tag>.md`, never
  a shared `AUDIT.md`; the orchestrator folds notes into AUDIT.md centrally after the run.
- **`’`/`—` escapes leaked into page prose.** Build scripts wrote escaped `’` into HTML text
  (standfirst/meta/placeholders) where — unlike inside a `<script>` — it renders as the literal string
  `’`. → Use the real characters (`'` `—` `…`) in prose, never `\u` escapes. Guarded THREE ways so it
  can't regress: (1) every `build-*.py` asserts no literal `\uXXXX` in its visible HTML before writing;
  (2) `tools/check-escapes.py` scans all built pages (wired into `rebuild-city.py` and `npm test`);
  (3) `test-singapore.js` asserts it per page. `npm run check:escapes` runs it standalone.
- **`rebuild-city.py` derived the wrong build-script name** (`os.path.splitext("columbus.dataset.json")` →
  `columbus.dataset` → `build-columbus.dataset.py`, which doesn't exist). → Derive the stem before the FIRST dot
  (`dataset.split('.',1)[0]`); the per-city `BUILD` override map is now only for genuinely irregular names.
- **The engine-leak guard was a bare `"Cleveland" not in …` substring test** and tripped on legitimate local
  addresses (Columbus has a *Cleveland Ave*). → All nine `build-*.py` now strip `Cleveland Ave(nue)` before the
  check, so it fires only on a real template-data leak (a Cleveland place name or a "Cleveland, OH" address city).
- **`sourcecheck.py` wrote its `_needs_sources.json` to a hardcoded `silicon-valley-research/`** for every city,
  clobbering that dir with other cities' data. → It now writes a per-city `data/<stem>_needs_sources.json` next to
  the dataset. Auditable, no cross-city clobber.
- **Geocode agents emit two output shapes** — a list of `{n, …}` records, or a dict keyed by place name. A prompt
  that asked for the keyed-dict form crashed `geo-merge.py` (which assumed a list) with `'str' object has no
  attribute 'get'`. → `geo-merge.py` now normalizes both shapes and accepts `source` as an alias for `geoSource`,
  so neither agent convention breaks the merge. (Pass-6 template still standardizes on the list form.)
- **One 200-call WebSearch cap per session is shared by every concurrent agent** (2026-10-02 run: the Chicago agent got 3 searches before `200 of 200` refusals). A ~500-place NYC-density city alone needs ~700–900 searches (discovery + one pin search per place + status). → Budget the run: give each dense city its own session (or raise `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`), and an agent that hits the cap checkpoints `## In-flight wave` in RESUME.md and stops — never fills from memory.
- **`density.py` hid empty areas** (it only iterated areas that already had records), so a fresh city looked 1-area-short instead of 5-areas-empty. → It now unions the RESUME targets into the area list; a 0-count area prints `NEED +N`.
- **The session-wide WebSearch cap (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`, 200) is shared by every concurrent agent** and is a hard stop, not a rate limit — back-off does not help. (Okinawa, 2026-10-02: cap hit after 17 of its own searches.) → Checkpoint verified places after every few searches (append helper + RESUME), and in a ~16-agent run budget ≈12 searches/agent unless the cap is raised.
- **Michelin venue pages carry the pin, but only when the search engine fetches the venue page itself** (Tokyo W2):
  name exactly **3** Michelin page names + "Michelin restaurant page latitude longitude coordinates" (no word
  "cuisine" — it makes the engine summarise list pages and drop the coords). ~70% of established listings return
  lat/lng; brand-new (2026) listings often don't → UNVERIFIED, never estimated. Reject any "approximate" coords the
  engine offers from a neighbourhood centroid.
- **Wikidata P625 is the pin source for streets, alleys and heritage restaurants** (Tokyo W2): a `wikidata.org`-
  restricted "A latitude longitude; B latitude longitude; …" query returns coordinate locations for ja-wiki-only items
  (Ameyoko, Omoide Yokochō, Takeshita-dōri, Kanda Matsuya, Isegen, Komagata Dozeu, Rengatei, Taimeiken…). Wikidata is
  the PIN only — the two sources come from a separate editorial corroboration query. Reject whole-second-precision
  points that land off the shop, and station/district points returned for a venue.
- **Never type a Japanese-script name or street address from memory** (Tokyo W2 self-correction): 31 kanji/kana names
  added "for flavour" had to be stripped back to the sourced romanized name. Add native script only when a source in
  hand shows it; queue an address-verify pass for any address not re-read from a cited page.

- **An address-verify query must not contain the address being verified** (Tokyo W3): putting "2-3-1 Asakusa" in the
  query made the search summary echo it back as confirmed. Query the venue names only ("GO TOKYO spot address: A; B;
  C; D", 4 names, `gotokyo.org`), compare the returned address to the record, and coarsen to the sourced locality when
  the page gives none or sources disagree. Log per-place results (`_addrcheck_w3.json` pattern).
- **ja.wikipedia `座標` batch queries pin Japanese shinise; trust only matched articles** (Tokyo W7): `<name A> 座標; <name B> 座標; <name C> 座標` restricted to ja.wikipedia.org pinned 18 heritage shops/museums/department stores (~50% hit). But the summariser cross-contaminates coordinates between names in one query (八ッ手屋 got Daikokuya's Asakusa point; ぼたん and 竹むら got one identical point): accept a point only when the matching article is in the result links and the point fits the address; identical points for two venues → `med`. Google `!3d!4d`, Michelin venue pages, Apple Maps and OSM do NOT expose coordinates to WebSearch for small venues (0/12) — leave those to `tools/geocode-helper.html`.
- **Michelin discovery by ward** (Tokyo W3): `"Shibuya-ku" "Bib Gourmand" "2026 MICHELIN Guide Japan"` (one ward per
  query, `guide.michelin.com`) lists that ward's current Bibs with addresses; the annual "new Bib Gourmands" / "newly
  starred" / "inspectors' favourite dishes" articles give named-dish candidates. Pins: 2–3 exact names + "Michelin
  restaurant page latitude longitude coordinates" — adding "dish"/"description" to that query drops the coords, so
  fetch dishes in a separate query.
- **Overlay waves (Japan maps, 2026-10-02, Hokkaido s3):** to add a corroborating source or an `"anime"` note to a place already
  in the dataset, emit a record with the SAME `n` (and area), only the new `sources` + `anime`, and NO geo file.
  `tools/japan_consolidate.py` `_overlay()` merges just sources + a missing anime note — prose/area/pin are never rewritten.
