# Singapore & Southeast Asia — standing research brief

The map opens on **Toa Payoh** and spans Singapore's towns + the major cities of Southeast Asia.
Same pipeline + gates as every US city (discover sources → expand → fact-check → re-rank → location-verify
→ build). The page has a **pastel light/dark theme** (in `tools/build-singapore.py`) — research is unaffected.

## Area ids (use these exact ids in every record's `a`)
- `TPY` — **Toa Payoh** (the opening view; give it real depth)
- `SGC` — Singapore Central (Marina Bay, Chinatown, Kampong Glam, Little India, Bugis, Orchard, Civic)
- `SGE` — Singapore East (Katong/Joo Chiat, Geylang, Bedok, Tampines, Changi)
- `SGWN` — Singapore West & North (Jurong, Bukit Timah, Holland V, Ang Mo Kio, Bishan, Woodlands)
- `MY` — Malaysia (Kuala Lumpur, Penang/George Town, Malacca, Ipoh, Johor Bahru)
- `TH` — Thailand (Bangkok, Chiang Mai, Phuket)
- `VN` — Vietnam (Ho Chi Minh City, Hanoi, Hoi An)
- `ID` — Indonesia (Jakarta, Bali, Yogyakarta)
- `PH` — Philippines (Manila, Cebu)
- `IC` — Indochina (Phnom Penh/Siem Reap, Vientiane/Luang Prabang, Yangon)

Every area needs **≥1 tier-1 must-see** or the build asserts fail.

## The food-canon opening move (do this before searching restaurants)
Name the region-unique canon first, then find the hidden-gem places that serve it:
**Hainanese chicken rice, laksa (Katong/curry), char kway teow, Hokkien mee, bak chor mee, bak kut teh,
nasi lemak, satay, roti prata, nasi padang, chilli/black-pepper crab, fish head curry, chendol, kaya
toast & kopi** (Singapore/Malaysia); **pho, banh mi, bun cha** (Vietnam); **boat noodles, tom yum, khao
soi, mango sticky rice** (Thailand); **nasi padang, rendang, sate, bakso** (Indonesia). Tag the cuisine by
the **kitchen's own tradition**, never a single shared dish.

## Ranked source palette (credible = counts toward the ≥2 bar)
- **Institutional / lone-authority-OK:** Michelin Guide (Singapore, Bangkok, KL, Hanoi/HCMC all have
  guides — Bib Gourmand is gold for hawkers), UNESCO (heritage sights).
- **Singapore:** The Straits Times, CNA, Time Out Singapore, **Seth Lui (sethlui.com)**, **Eatbook.sg**,
  **Miss Tam Chiak**, Daniel Food Diary, HungryGoWhere, Tatler Singapore, Visit Singapore (STB),
  Roots.gov.sg (NHB heritage), NParks.
- **Malaysia:** Eat Drink KL, KL Foodie, Time Out KL, Penang Foodie, Tourism Malaysia.
- **Thailand:** BK Magazine, Time Out Bangkok, TAT.  **Vietnam:** Vietnam Coracle, Vietcetera, VnExpress.
- **Indonesia/Philippines:** Time Out Jakarta, Wonderful Indonesia, Spot.ph, Guide to the Philippines.
- **Cross-region:** CNN Travel, BBC Travel, Lonely Planet, NYT, Atlas Obscura, Wikipedia (coords/notability).
- **NEVER a recommender:** Yelp, TripAdvisor, OpenTable, Google (measure/fact-check only = 0 toward the two).

## The rules (identical to every city)
- **≥2 credible sources per place**, OR one lone institutional authority (Michelin/UNESCO). **Merit bar:**
  measure acclaim before adding (award/Bib, famous-creator/major-press rave, or high rating w/ real volume
  cross-checked on ≥2 platforms). No padding — record MEASURED & DROPPED.
- **Fact-check OPEN/CLOSED (2025/2026).** Notable closed → `"closed":true` (kept, flagged); else drop.
- **NO coordinates in discovery** — geocoding is a separate stage; never invent lat/lng.
- **No duplicates** — read the built dataset's `F`/`P` first.
- Vet every creator (real following + findable content); a creator is ONE corroborating source, never an authority.

## Source policy for THIS region (user directives, 2026-08-26 — non-negotiable)
- **Keep the Asian cities' sources SEPARATE.** Each SEA city/country writes its OWN `SOURCES_<city>.json`
  and `CREATORS_<city>.json` (e.g. `SOURCES_KL`, `SOURCES_PENANG`, `SOURCES_BANGKOK`, `SOURCES_HCMC`,
  `SOURCES_BALI`, `SOURCES_MANILA`, `SOURCES_IC`). **Namespace source KEYS per city** so they never collide.
  Singapore clusters likewise keep their own (`SOURCES_TOAPAYOH`, `SOURCES_SGC/SGE/SGWN`). Do not merge into
  one file. `consolidate.py` reads all of them for labels; `register-sources.py` registers them.
- **Sources must be LOCAL, AUTHENTIC, CREDIBLE, VIRAL:** local food/travel **YouTubers, TikTokers, IG
  influencers, travel bloggers** (real, sizable following + a *findable* piece of content on THAT place) +
  **local news** + city magazines + Michelin/UNESCO. A vetted creator = ONE corroborating source, never an
  authority. **Reject anonymous SEO farms / content mills / unverifiable followings** — popularity you can't
  verify isn't popularity. Note follower scale in the note.
- **EXPAND SOURCES AS MUCH AS POSSIBLE** — gather more than the bare 2 per place where you can.
- **DENSITY: Singapore per-town rivals NYC.** A single town/estate can hold 100s of food places; the food
  scene is enormous. Go deep — cover the full signature canon (famous AND hidden-gem) per area plus the
  viral spots. Merit bar still applies (measure, no anonymous padding, record MEASURED & DROPPED).

## Artifacts to emit (consumed by `tools/rebuild-city.py singapore [--build]`)
- Food: `FOOD_<tag>.json` — array of `{t,a,cz,dish,n,address,w,closed,sources}`.
- Sights: `SIGHTS_<tag>.json` — `{"sights":[{t,a,n,address,w,k?,sources}], "sources":[{key,name,url}]}`.
- Optional `CREATORS_<tag>.json`, `SOURCES_<tag>.json`. Under concurrency, put the pass summary in
  `_note_<tag>.md`, NOT `AUDIT.md`. Do NOT edit shared files (`data/sources.json`, `data/geocodes.json`,
  `tools/*`, the dataset).
