# Japan — five maps (Tokyo · Kyoto · Osaka · Okinawa · Hokkaido) — shared standing agent brief

**Five SEPARATE maps**, one per city/region, each a dark-engine **dataset city** (like the Belgian maps)
grouped under the 🇯🇵 **Japan hub** (`Japan/index.html`, kind `dataset-cities` in `data/countries.json`).
**Target density: New York (~500 places) per map** — per-area targets live in each `data/<city>-research/RESUME.md`
and are measured by `python3 tools/density.py <city>`. Iterate in sequenced waves until every area is `OK`
([docs/DENSITY.md](../../docs/DENSITY.md)). Same pipeline + gates as every guide
([docs/PIPELINE.md](../../docs/PIPELINE.md)): **discover sources → extract places → fact-check (≥2 credible) →
re-rank within area → geocode + location-verify → build & gate.** WebSearch only (WebFetch is blocked).
**Search in Japanese AND English** — Japanese-language queries (e.g. `京都 おばんざい 名店`, `札幌 スープカレー 人気`)
surface the native press and creators; cite the native source.

Shared modules (do not fork): `tools/japan_consolidate.py` (ONE Japanese cuisine taxonomy + sight collections +
source labels) and `tools/japan_build.py` (wraps `tools/belgium_build.py`: GATE 1 sources, GATE 2 verified pin,
derived map centre/labels, engine_guard scrub). Per-city files are thin wrappers:
`data/<city>-research/consolidate.py` (AREAS + colours) and `tools/build-<city>.py` (prose).

## Names
Use the **common romanized name** as `n` (Hepburn, macrons fine: "Sensō-ji", "Ichiran Shibuya"), optionally with
the Japanese in parentheses: `"Kanda Matsuya (神田まつや)"`. Never a bare kanji name (the dedup normalizer keys on
romanized text). Branches: name the branch ("Ichiran Shibuya"), never a chain generically.

## ★ ANIME, MANGA & POP CULTURE — a required layer on every Japan map (user instruction 2026-10-02)
Every Japan map gets a dedicated **"★ Anime, Manga & Pop Culture"** collection (`ANIME`, first in the filter) and each
such card carries a **special note** shown on the card. Find **as many as possible** — sights AND food:
- **Franchise flagships & museums:** Pokémon Center / Pokémon Café, Nintendo stores & Super Nintendo World, Gundam
  (Gundam Base, Gundam Factory Yokohama legacy, life-size statues), Ghibli (Ghibli Museum, Ghibli Park edge, Donguri
  Kyowakoku), Doraemon (Fujiko F. Fujio Museum), Tezuka Osamu Manga Museum (Takarazuka), Kyoto International Manga
  Museum, Toei/Sunrise/Kyoto Animation sites, Ultraman/Godzilla/Kamen Rider spots, Sanrio Puroland/Hello Kitty,
  Jump Shop, Capcom/Sega/Square Enix cafés & stores, Detective Conan (Hokuei town if in reach), Chiikawa, Tamagotchi,
  gachapon halls.
- **Districts & shops:** Akihabara, Nakano Broadway, Ikebukuro Otome Road, Den Den Town (Osaka), Teramachi (Kyoto),
  Mandarake, Animate, Surugaya, retro-game shops, maid/character/collab cafés with real acclaim.
- **Anime pilgrimage (seichi junrei) sites** with verifiable fame: e.g. Kanda Myōjin (Love Live!), Suga Shrine stairs
  (Your Name), Uji (Hibike! Euphonium), Otaru / Hakodate / Okinawa locations used in well-known series, Okinawa's
  Shuri/Chatan anime settings — only with ≥2 credible sources (Japan Anime Tourism Association "88 Anime Spots" list
  counts as one credible source; official franchise/municipal pages count once as OFFICIAL).
- **Record format:** add `"anime": "<franchise — why it matters, one line>"` to the record (sight or food). The
  consolidator forces it into `ANIME` (first collection) and prefixes the card note with
  "★ Anime & pop culture — …". Whole-word keyword matching also tags obvious ones automatically.
- Same bar as everything: ≥2 credible sources or a lone institution, verified open (retired statues/closed cafés kept
  flagged — e.g. the DiverCity Unicorn Gundam), real pins. Report the ANIME count per map in AUDIT.md each wave.

## The source bar (hard rule)
≥2 **credible** sources per place, OR one lone institutional authority: **Michelin Guide** (star / Bib Gourmand /
Selected — key `MICHELIN` / `MICHELIN_BIB` / `MICHELIN_STAR`), **UNESCO**, or the **Agency for Cultural Affairs**
designations — National Treasure / Important Cultural Property / Special Place of Scenic Beauty / Special Historic
Site (key `BUNKACHO`). Credible, native-language and international:
- **Japanese national press:** Asahi Shimbun (`ASAHI`), Yomiuri (`YOMIURI`), Mainichi (`MAINICHI`), Nikkei
  (`NIKKEI`, incl. Nikkei Style 何でもランキング), NHK (`NHK`); **regional:** Kyoto Shimbun (`KYOTOSHIMBUN`), Ryukyu
  Shimpo (`RYUKYUSHIMPO`), Okinawa Times (`OKINAWATIMES`), Hokkaido Shimbun (`HOKKAIDOSHIMBUN`), Kobe Shimbun.
- **Japanese food media with an editorial voice:** dancyu, Hanako, Brutus, Pen, Tokyo Calendar, Meshi Tsū, Ippin
  (editorial picks by named writers), Tabelog **Award** (`TABELOGAWARD`) and Tabelog **Hyakumeiten 百名店**
  (`TABELOG100`) — these are published annual selections and count as ONE source each.
- **Official tourism:** JNTO (`JNTO`), GO TOKYO (`GOTOKYO`), Kyoto City Official Travel Guide (`KYOTOTOURISM`),
  OSAKA-INFO (`OSAKAINFO`), Visit Okinawa (`VISITOKINAWA`), Hokkaido Tourism (`HOKKAIDOTOURISM`), Ministry of the
  Environment national-park pages (`ENV`). The place's **own official site** (`OFFICIAL`) corroborates but is never
  one of the two on its own for a restaurant.
- **English/international:** The Japan Times (`JAPANTIMES`), Time Out Tokyo/Osaka/Kyoto (`TIMEOUT`), Eater,
  The Infatuation, NYT, Guardian, BBC Travel, CNN Travel, Condé Nast Traveler, National Geographic, Lonely Planet,
  Atlas Obscura, japan-guide.com (`JAPANGUIDE`), Savor Japan, Tokyo Cheapo, World's / Asia's 50 Best (`WORLD50`/`ASIA50`).
- **Creators (viral/authentic):** verifiably popular Japan food/travel creators — e.g. Abroad in Japan (Chris
  Broad), Paolo fromTOKYO, Rachel & Jun, Tokyo Lens, Only in Japan (John Daub), Life Where I'm From, Ramen Adventures
  (Brian MacDuckston), Ramen Beast, Keiko Ishiyama-style local food writers, plus Japanese YouTubers/TikTokers with
  a real following. Each needs a real, sizeable following + a findable piece naming THIS place. A creator is ONE
  corroborating source, never institutional. Record in `CREATORS_<CITY>_<tag>.json`.
- **Reddit / X / TikTok:** r/JapanTravel, r/Tokyo, r/Kyoto, r/osaka, r/okinawa, r/hokkaido — a corroborating local
  vote at most, never a lone pin.
- **ZERO toward the bar (measure only):** Yelp, TripAdvisor, Google, **Tabelog scores**, **Retty**, Hot Pepper,
  Gurunavi listings, Klook/KKday. You MAY use a Tabelog score (≥3.5 with volume) as a *measurement* of merit.

## Merit bar — a mention is not merit
Measure before adding: Michelin/Bib, Tabelog Award/Hyakumeiten, a national-press or famous-creator rave, or a
genuinely high rating with real volume on ≥2 platforms. Rank within area; **no padding** (don't stack five
near-identical ramen shops in one block — keep the standouts). Log every MEASURED & DROPPED candidate with reason in
`AUDIT.md` (or `_note_<tag>.md` when another agent of yours runs concurrently).

## Editorial rules (CLAUDE.md — do not bend)
- **Food discovery centres on what is UNIQUE to the city** — name the canon (each city's `_AGENT_BRIEF.md`) first,
  then find the hidden-gem places that serve it.
- **Cuisine tag = the kitchen's own tradition**, never a single dish it serves. Emit labels from the taxonomy in
  `tools/japan_consolidate.py` (`SUSHI RAMEN NOODLE KAISEKI IZAKAYA TEMPURA KONAMON WAGYU TEISHOKU OKINAWA HOKKAIDO
  TOFU SWEET CAFE SAKE MKT FINE INT`) — bare ids are accepted. A Michelin-listed place also gets `FINE` only if it is
  genuinely fine dining (a Bib ramen shop stays `RAMEN`).
- **Every food card names a specific dish** (`dish` field + in `w`).
- **Tiers graded within each area**; every area needs ≥1 geocodable tier-1 must-see.
- **Closed places stay, flagged** (`"closed": true` and the name gets ` — CLOSED`) if notable; non-notable closed →
  drop. Verify 2025/2026 status against a real source (official site/SNS, Google "Permanently closed", news, Tabelog
  閉店 notice counts as a status signal).
- **Gaps are stated, not filled.** **Attribution is honest.**

## Output schema (dataset-city format — identical to the Belgian maps)
- **Food/drink** → LIST `FOOD_<CITY>_<tag>.json`; each:
  `{"t":1|2|3,"a":"<AREA>","cz":["RAMEN",…],"dish":"<named dish>","n":"<name>","address":"<full address, ward/town,
  prefecture, Japan — include the 〒postcode if known>","w":"<1-3 sentences>","closed":false,
  "sources":[["KEY","url"],["KEY2","url2"]]}`
- **Sights** → DICT `SIGHTS_<CITY>_<tag>.json`: `{"sources":[{key,name,url}],"sights":[{"t","a","n","address","w",
  "k","g":["ICON","UNESCO","TEMPLE","CASTLE","GARDEN","MUS","NATURE","ONSEN","MKT","NIGHT","POP","VIEW","FREE"],
  "sources":[…]}]}`
- **New outlets** → `SOURCES_<CITY>_<tag>.json` `{"outlets":[{key,name,url,credible:"<why>"}]}`; creators →
  `CREATORS_<CITY>_<tag>.json` `{creators:[…], attach:[…], rejected:[…]}`.
- **NO lat/lng in discovery.** Geocoding is its own pass → `geo/_geoout_<city>_<tag>.json`, a LIST of
  `{"n","address","lat","lng","confidence":"high|med|low|unverified","geoSource","status","statusSource"}`.
  Japanese addresses are block-numbered (丁目-番-号); read coordinates from Wikipedia/Wikidata (landmarks),
  Michelin's venue page, the official site's map embed, or a Google `!3d<lat>!4d<lng>` place pin — **never a `/@`
  viewport, never a town/ward centroid, never memory**. Unresolvable → `lat:null,lng:null,confidence:"unverified"`.

## Do NOT
Fabricate a place, address, dish, source, creator or coordinate. No rating-only entries. If a place can't clear the
bar, leave it out and log it as held.
