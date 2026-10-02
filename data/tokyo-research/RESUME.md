# Tokyo (東京) — RESUME checkpoint (read first)

Map: `cities/tokyo.html` · dataset `data/tokyo.dataset.json` · key `tokyo` · built by `tools/build-tokyo.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py tokyo` on the DISCOVERED set. Total ≈ 530.
- `CYD` Chiyoda-ku (Imperial Palace · Marunouchi · Akihabara · Kanda · Jimbōchō) — target ~45
- `CHUO` Chūō-ku (Ginza · Nihonbashi · Tsukiji · Tsukishima · Ningyōchō) — target ~50
- `MNT` Minato-ku (Roppongi · Azabu-Jūban · Akasaka · Shimbashi · Shiba · Odaiba) — target ~50
- `SJK` Shinjuku-ku (Kabukichō · Golden Gai · Omoide Yokochō · Shinjuku Gyoen · Kagurazaka · Shin-Ōkubo) — target ~50
- `SBY` Shibuya-ku (Shibuya · Harajuku · Omotesandō · Ebisu · Yoyogi · Daikanyama) — target ~50
- `TAITO` Taitō-ku (Asakusa · Ueno · Yanaka · Kappabashi · Okachimachi) — target ~50
- `SMKT` Sumida-ku & Kōtō-ku (Skytree · Ryōgoku · Kiyosumi-Shirakawa · Monzen-Nakachō · Toyosu) — target ~40
- `JONAN` Jōnan — Shinagawa · Meguro · Ōta (Nakameguro · Togoshi-Ginza · Kamata · Haneda) — target ~35
- `JOSAI` Jōsai — Setagaya · Nakano · Suginami (Shimokitazawa · Sangenjaya · Gōtokuji · Nakano Broadway · Kōenji · Ogikubo) — target ~40
- `JHOKU` Jōhoku — Toshima · Bunkyō · Kita · Arakawa · Itabashi · Nerima (Ikebukuro · Sugamo · Nezu · Akabane · Nippori) — target ~35
- `JOTO` Jōtō — Katsushika · Edogawa · Adachi (Shibamata · Kameari · Kita-Senju · Kasai) — target ~20
- `TAMA` Tama area (Kichijōji · Mitaka & Ghibli · Takao-san · Okutama · Hachiōji · Chōfu) — target ~30
- `KANTO` Kantō day trips (Yokohama · Kamakura · Hakone · Nikkō · Kawagoe · Fuji Five Lakes) — target ~35

## Regioning
Tokyo's 23 **special wards (tokubetsu-ku, 特別区)** are the borough-equivalent. The densest wards are their own areas (Chiyoda, Chūō, Minato, Shinjuku, Shibuya, Taitō, Sumida+Kōtō); the rest are grouped by the long-standing Tokyo compass terms **Jōnan (城南, south), Jōsai (城西, west), Jōhoku (城北, north) and Jōtō (城東, east)**; beyond the wards is the **Tama area (多摩地域)** of the Metropolis, and the Kantō day-trip ring (NYC's 'Day Trips' equivalent). Assign each place by its actual ward (the address names the -ku).

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 W1 batch 1: 9 CYD sights (`SIGHTS_TOKYO_W1.json`, `geo/_geoout_tokyo_w1.json`) — then the shared 200-search cap hit.
- **2026-10-02 W2 (relaunch, own budget; 166 of ~200 searches used, stopped with a buffer as yield/search fell below ~2):**
  **314 discovered / 294 rendered (212 sights + 82 food), 20 UNVERIFIED held off the map, 1 closure flagged
  (Unicorn Gundam statue). All four gates green; `npm run validate` + `npm test` green. Tokyo is LIVE** — Japan hub
  `CARD:tokyo` live link, `data/countries.json` japan `live: true`, root `CARD:japan` "1 of 5 maps live",
  `docs/CITIES.md` row (all refreshed by `_tokyo_golive.py`).
- Files: `FOOD_TOKYO_W2.json` (104 food), `SIGHTS_TOKYO_W2.json` (203 sights), `geo/_geoout_tokyo_w2.json`,
  `CREATORS_TOKYO_W2.json` (Ramen Adventures, Paolo fromTOKYO), `_pending_w2.json` (39 held: single-source or no pin),
  `_renamed_w2.json` (31 Japanese-script names stripped — see AUDIT), `_tokyo_golive.py` (refresh go-live surfaces).

- **2026-10-02 W5 (session_01VQaxQ69L5PmZRFY3PnAJQQ) — food & drink first + anime.** +38 food & drink + 8 anime sights (50 Best bars,
  kissaten & specialty coffee, yokochō, craft beer, sake bars, ramen/tsukemen/udon, wagashi & bakeries) in
  `FOOD_TOKYO_W5.json`; only 4 pinned (rest UNVERIFIED → helper). Build: **433 discovered / 387 rendered; food 184 of
  433 discovered = 42.5% (was 37%); ANIME layer 24 records (+9)**; 4 gates PASS; validate + test green; hub refreshed. Whole session budget (200 searches) used.
  Vetting helper `_tokyo_w5_ingest.py`; held candidates `_w5_held.json`; agent brief `_w5_agent_brief.md`.

- **2026-10-02 W6 (session_01S4xkEp3ybvSczLJTRuA3Xb) — FOOD FIRST + anime.** +97 food & +10 sights (7 anime): ramen canon,
  Michelin 2026 three/two/one-star tier (venue-page pins), depachika, shinise, yokochō/senbero, Kichijōji/TAMA ramen & breweries,
  kissaten/kakigōri/bars (drinks agent). Build: **537 discovered / 411 rendered; food 278 = 51.8%**; 4 gates PASS; validate +
  test green; hub card refreshed. Files: `FOOD_TOKYO_W6.json`, `SIGHTS_TOKYO_W6.json`, `geo/_geoout_tokyo_w6.json`,
  `geo/_geofix_tokyo_w6.json` (+ `_tokyo_w6_applyfix.py`), `_w6_*_verified.json` (vetted inputs), `_w6_held.json`,
  `_w6_unverified_worklist.json` (pins still needed). Helpers: `_tokyo_w6_ingest.py`, `_tokyo_w6_add.py`, `_tokyo_w6_dup.py`.
  Density after W6: CHUO 52 OK · CYD 45 OK · JHOKU 36 OK · KANTO 41 OK · MNT 57 OK · SBY 52 OK · JONAN 33/35 · JOSAI 39/40 ·
  JOTO 19/20 · SJK 49/50 · SMKT 38/40 · TAITO 49/50 · TAMA 29/30.

### Density (discovered, `python3 tools/density.py tokyo`) vs target
(after W5) CHUO 43/50 · CYD 33/45 · JHOKU 30/35 · JONAN 22/35 · JOSAI 26/40 · JOTO 14/20 · KANTO 37/35 OK · MNT 51/50 OK ·
SBY 42/50 · SJK 40/50 · SMKT 29/40 · TAITO 40/50 · TAMA 19/30 → **433 / ~530**; food 184 (42.5%). (CYD 36, JHOKU 32 after anime.) Weakest food: TAMA 3, JOTO 3, KANTO 3, SMKT 8.

## In-flight wave
**W7 (session_01LvabJcJR7Zay1SoN8gzwc7, 2026-10-02 18:17Z) — finishing pass.** (1) close last NEEDs food-first + anime:
JONAN +2, SMKT +2, JOSAI/JOTO/SJK/TAITO/TAMA +1 → vetted inputs `_w7_*_verified.json` → `_tokyo_w6_ingest.py`-style
ingest into `FOOD_TOKYO_W7.json` / `SIGHTS_TOKYO_W7.json` + `geo/_geoout_tokyo_w7.json`; anime candidates: Captain
Tsubasa statues Yotsugi (JOTO), Seiseki-Sakuragaoka Whisper of the Heart (TAMA), Sazae-san street (JOSAI);
(2) pin the 128 UNVERIFIED → `geo/_geofix_tokyo_w7.json` (Michelin venue pages / Google `!3d!4d` / Wikipedia only);
(3) re-verify low-confidence pins.

## W7 plan (next session)
1. **Pins first (no/low searches):** 126 UNVERIFIED — run `tools/geocode-helper.html` in a browser over
   `_w6_unverified_worklist.json` (+ W6 additions); Google `!3d!4d` via WebSearch yields ~1 in 7 — don't spend discovery budget on it.
2. **Close the last NEEDs** (+1–3 each): JONAN (Gotanda/Ōimachi/Ōta — e.g. Toriyoshi Nakameguro needs a 2nd source), JOSAI
   (Kōenji: Yakiton Tonkichi / Gyoza Tachibana need Time Out or JT corroboration), JOTO (Monzen Toraya / Kawachiya need a
   2nd outlet), SJK (Kabuto, Tonchang — Time Out only), SMKT (Kameido Gyoza 2nd source), TAITO, TAMA (Takahashiya, Kyoka).
3. **Re-check held:** Tonkatsu Hasegawa (current Michelin selection?), Kiyosumi Takahara (dish), Ozasa (2nd source).
4. Michelin one-star tier is NOT exhausted (122 one-stars; ~20 on the map): 3-name "MICHELIN Guide map coordinates" queries
   return pins ~50% of the time — the most efficient way to add PINNED food.

## W6 plan (previous — executed)
**Budget lesson (W5):** the 200-search cap is per SESSION and shared with subagents — 5 parallel agents burned it in
~10 minutes. Run at most 2 agents at once and give each a hard search allowance (e.g. 35) in its prompt.
**Pin lesson:** Google place pins for bars/kissaten/wagashi rarely surface `!3d!4d` via WebSearch (≈1 in 6). Spend
pins on Michelin venue pages (coords printed, 3 per query) and Wikipedia/Wikidata items; leave small venues to
`tools/geocode-helper.html` (browser) — 33 W5 food records are UNVERIFIED and waiting there (list: geo/_geoout_tokyo_w5.json
where confidence = unverified).
1. **Helper pass first (no searches):** run `tools/geocode-helper.html` for the 33 UNVERIFIED W5 pins + the 5 older ones.
2. **Clear `_w5_held.json`** — each needs ONE more source: Gen Yamamoto (50 Best URL), Tokyo Confidential, Cafe Bon,
   Monozuki, Satella, Higashi-Mukojima Coffee-Ten, Baikatei; ramen one-source list in AUDIT (Ramenya Shima, Menya Shiki,
   Niboshi Himawari, Tagano, Kagura-ya, Nara Seimen, Menya Nanigashi, Kamofuku).
3. **Food still needed (food share 43% → ≥50%):** SJK (Rokurinsha? no — Shinjuku: Nagi Golden Gai, Ramenya Shima, Tsunahachi
   tempura, Isetan depachika), CYD (Kanda Sudachō shinise: Botan, Takemura, Isegen on map), SMKT (Menya Shiki, chanko —
   Tomoegata held for pin, Fukagawa-meshi), JONAN (Tagano, Togoshi Ginza), JOSAI (Ozasa? TAMA), TAMA (Jindai-ji soba, Satou,
   Ozasa, Kamofuku), JOTO (Kita-Senju/Tateishi senbero, Kawachiya Shibamata).
4. **ANIME wave completion** — W5 landed Super Potato, Mandarake Complex, Pokémon Café, Gundam Base Tokyo, Tokiwasō Manga
   Museum, Suginami Animation Museum, Suga Shrine stairs, @home cafe, Pokémon Center Mega Tokyo (8 of 9 UNVERIFIED pins). Remaining: Animate Ikebukuro, Tokyo Anime Center, Ultraman Soshigaya, Sanrio Puroland, Toei
   Animation Museum, Kirby Café, Gashapon Dept Store, Kamakura-kōkōmae (Slam Dunk).
5. Every ~50: `flock … python3 tools/rebuild-city.py tokyo --build` → 4 gates → `cd tools && npm run validate && npm test`
   → `flock … python3 data/tokyo-research/_tokyo_golive.py` → commit + push.

## Previous wave (W3/W4)
**W3 (2026-10-02, continuation) — CLOSED.** Last full build: **387 discovered / 382 rendered (241 sights + 141
food)**, 13/13 areas, all 4 gates green, validate + npm test pass, hub card refreshed. Searches W3: ~155.
Still UNVERIFIED (5 → run `tools/geocode-helper.html`, place pin `!3d!4d`): Tempura Abe Honten (Michelin page shows Bib
2021 only — also re-check status), Afuri Ebisu, Tamahide, Iseya Kichijōji, Amazake-chaya. Held queue `_pending_w2.json`:
25 (Tomoegata, Fukagawajuku, Kichijōji Satou, Funabashiya need helper pins; Senzokuike, Tower Hall Funabori, Togoshi
Ginza need a 2nd source).
**W4 plan:** (1) geocode-helper pass for the 5 UNVERIFIED + held food pins; (2) Michelin by ward for the remaining
wards (Bunkyō/Toshima/Kita → JHOKU; Sumida/Kōtō → SMKT; Katsushika/Edogawa/Adachi → JOTO; Taitō) and the annual
announcement lists for 2023; (3) sights for SBY/SJK/TAITO/CHUO/JONAN/JOSAI via GO TOKYO spot pages + Wikipedia coords;
(4) TAMA/JOTO food needs non-Michelin canon sources (Time Out + GO TOKYO + Japan Times) and helper pins — state the gap
if nothing clears the bar. Then rebuild → gates → validate/test → `_tokyo_golive.py` → commit + push.

## Next wave (W3) — exact plan, in order
1. **Clear the held queue first** (`_pending_w2.json`, 39 items): most need ONE more source or ONE pin. Use the
   corroboration query (`gotokyo.org` + `japan-guide.com` + `timeout.com`, 6 names per query) and the Wikidata pin
   query (`wikidata.org`, "A latitude longitude; B latitude longitude; …", 4 names). ~12 searches → ~25 places.
2. **UNVERIFIED Michelin pins (20 in geo)** — Ponta Honke, Yaesu Unagi Hashimoto, Japanese Ramen Gokan, Sushi Kanesho,
   Katsuo Shokudo, Ginza Katsukami II, Shutei Tanaka, Yoshoku Edoya, Sézanne, Mutsukari, Tempura Abe Honten, Jinbo,
   Aoyama Ototo, Tempura Motoyoshi, Ten Yokota, Il Ballond'oro, Ginza Shinohara, Osobano Kouga, Teuchi Asama, Afuri
   Ebisu: retry each in **3-name** Michelin queries WITHOUT the word "cuisine"; if the venue page never yields coords,
   run `tools/geocode-helper.html` in a browser (place pin, `!3d!4d`).
3. **Food density** — SBY, SJK, SMKT, TAMA, JOTO, KANTO. Seed lists: Michelin category pages (Tokyo Bib by cuisine),
   Time Out "best X in Tokyo" lists + Japan Times "Tokyo Food File" columns; pins via Michelin venue pages or Wikidata
   (heritage shops). TAMA: Jindai-ji soba shops, Kichijōji (Satou, Ozasa, Iseya), Takao tororo soba. KANTO: Kamakura
   shirasu-don, Yokohama Chinatown (Manchinro?) / Sanma-men, Hakone / Kawagoe sweet potato — verify each.
4. **Address verify pass (CLAUDE.md 4a)** — many W2 *sight* addresses were written from the venue's well-known
   address, not re-read from a source (coordinates ARE sourced). Re-read the street address from the cited
   GO TOKYO / Wikipedia page for every W2 sight and fix any mismatch (log in AUDIT).
5. **Status re-check** — Edo-Tokyo Museum and Shitamachi Museum (renovation closures; held), 3331 Arts Chiyoda (closed
   2023 — add as CLOSED only with a source), Hara Museum (closed 2021) — same.
6. Re-run `python3 tools/rebuild-city.py tokyo --build` (under the lock) → 4 gates → `cd tools && npm run validate && npm test`
   → `python3 data/tokyo-research/_tokyo_golive.py` (under the lock) → commit + push.

## Next actions (standing)
1. Discovery waves per area (canon first) → `python3 tools/density.py tokyo` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_tokyo_*.json` → `flock /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py tokyo --build`.
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target (KANTO 34/35 closest) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row · [x] address-verify pass (W3: 130 verified · 8 fixed · 55 coarsened · 29 locality-only)
