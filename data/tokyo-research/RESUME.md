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

### Density (discovered, `python3 tools/density.py tokyo`) vs target
CHUO 28/50 · CYD 29/45 · JHOKU 25/35 · JONAN 17/35 · JOSAI 19/40 · JOTO 10/20 · KANTO 34/35 · MNT 34/50 · SBY 25/50 ·
SJK 24/50 · SMKT 24/40 · TAITO 30/50 · TAMA 15/30 → **314 / ~530**. Food is the gap (102 vs 212 sights); TAMA has 0 food,
JOTO 1, KANTO 2.

## In-flight wave
None — W2 closed cleanly 2026-10-02.

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
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row · [ ] address-verify pass
