# Tokyo — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (13), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — W1 sights backbone (CYD batch 1) — STOPPED by WebSearch budget
**Method.** Each sight searched with `allowed_domains` = en.wikipedia.org, japan-guide.com, gotokyo.org, timeout.com;
one call returns the credible pages (WIKIPEDIA + GOTOKYO/JAPANGUIDE/TIMEOUT) and Wikipedia's published infobox
coordinates. Status = the current GO TOKYO / Time Out page (open). Restaurant pins: a `google.com`-restricted search
returns the Maps place URL — read `!3d!4d` (tested on Kanda Matsuya → !3d35.6961091!4d139.7687915; NOT the
`/@35.6936645,139.7696566` viewport). Food lead noted for W2 (not yet written): Kanda Yabu Soba — TIMEOUT +
JAPANTIMES + visit-chiyoda; Kanda Matsuya — TIMEOUT + SAVORJAPAN + Tokyo Metropolitan Govt location box.
**Kept (9, CYD):** Imperial Palace East Gardens (t1), Yasukuni Shrine (t1), Kanda Myōjin (t1), Tokyo Station
Marunouchi Building (t1), Akihabara Electric Town (t1), MOMAT (t2), Jimbōchō Book Town (t2), Hie Shrine (t2),
Nippon Budōkan (t2). Each ≥2 credible (Wikipedia + GO TOKYO / japan-guide / Time Out).
**Geocode:** 7 high (Wikipedia infobox), 2 med (Akihabara, Jimbōchō — Wikipedia district points by the station /
main crossing). **Held:** Chidorigafuchi — GO TOKYO + japan-guide + Time Out, but no published coords in results →
not written until a place pin is read.
**Channel mix this wave:** editorial/travel sites 9 (GO TOKYO official tourism, Time Out, japan-guide), Wikipedia 9;
creators 0 (creator pass not reached).
**STOP:** the shared WebSearch session budget hit 200/200 (all ~16 concurrent agents) at this agent's 15th call.
No further discovery is possible this session; nothing was fabricated to fill the gap. Density: 9 / ~530.

## 2026-10-02 — W2 (relaunch, own search budget) — batches 1–6 (searches 1–29)
**Methods proven this run (record for every later wave).**
- *Michelin venue pins:* a `guide.michelin.com`-restricted search naming **3 exact Michelin page names** + "Michelin
  restaurant page cuisine latitude longitude coordinates" returns each venue page's published lat/lng, address,
  cuisine and distinction (2026 guide) in one call. 4 names works ~half the time; 5–6 names usually drops the coords
  (the engine falls back to list-page snippets). Some venue pages (Ponta Honke, Yaesu Unagi Hashimoto, Gokan,
  Sushi Kanesho, Katsuo Shokudo) never surface coords → written as UNVERIFIED (gate drops them; queued).
- *Michelin category lists* ("Tokyo Bib Gourmand ramen", "Tokyo tonkatsu") return ~10–16 names per call → feed the
  3-name pin queries.
- *Sights:* `en.wikipedia.org` (+`gotokyo.org`) restricted query "A coordinates; B coordinates; C coordinates;
  D coordinates" returns Wikipedia's published infobox coords for 3–4 places per call, often with the GO TOKYO spot
  page. A separate `japan-guide.com`-restricted query naming ~6 places gathers the 2nd source in one call.
**Kept — food (39, all Michelin lone authority; key = MICHELIN_BIB when the 2026 page says Bib, MICHELIN_STAR when it
states stars, else MICHELIN):** CHUO — Ginza Hachigou, Ginza Haru Chan Ramen, Tempura Kondo, Sushi Yoshitake, Yaesu
Unagi Hashimoto*; MNT — Iruca Tokyo Roppongi, Soba Tajima, Narisawa, Florilège, Nodaiwa Azabu Iikura, Kanda, L'AS;
SJK — Konjiki Hototogisu, Soba Osame, Tonkatsu Nanaido, Tonkatsu Hinata, Ramen Matsui, Kagurazaka Ishikawa; SBY — Den,
Katsuo Shokudo*; TAITO — Tompachitei, Onigiri Asakusa Yadoroku, Nabeno-Ism, Hommage, Asakusa Hirayama, Asakusa Nagami,
Shokudo Uyuki, Ponta Honke*, Sushi Kanesho*; CYD — Myojinshita Soba Oshin; JHOKU — Nakiryu, Ramenya Toy Box, Japanese
Ramen Gokan*; JONAN — Yakumo, Muginae, Tonkatsu Enraku, Mochibuta Tonkatsu Taiyo; JOSAI — Tonkatsu Narikura (Michelin
address now Naritahigashi, Suginami), Shiosoba Jiku. (*UNVERIFIED pin — held off the map.)
**Kept — sights (15):** TAITO Sensō-ji, Tokyo National Museum, Ueno Park, Kappabashi (med, street point); SMKT
Ryōgoku Kokugikan, Sumida Hokusai Museum, Kiyosumi Garden, Tokyo Skytree; JHOKU Nezu Shrine; SBY Shibuya Crossing,
Yoyogi Park, Meiji Jingū; SJK Shinjuku Gyoen, Tokyo Metropolitan Government Bldg, Golden Gai. Each WIKIPEDIA + GO TOKYO
and/or japan-guide.
**MEASURED & DROPPED / held:** Tsuta — Michelin page not surfaced and it has relocated (Yoyogi-Uehara) → held, not
written. Motoazabu Kushima — surfaced but cuisine unknown → not written. Sasaki Seimenjo, there is ramen, Teuchi Asama,
Ramen Break Beats, Hakodate Shioramen Goryokaku, Shinjiko Shijimi Chukasoba Kohaku, Sugita, Katsuyoshi, Takumi
Tatsuhiro, Unagi Tokito, Watabe, Ishibashi, Hashimoto — Michelin-listed names surfaced, pins not yet queried (next
wave). Held sights in `_pending_w2.json` (Omoide Yokochō, Ameyoko, Takeshita-dōri, Harmonica Yokochō, Chidorigafuchi
— coords not in Wikipedia results).
**Channel mix so far:** Michelin 39 food; Wikipedia 15 + GO TOKYO 10 + japan-guide 7 sights; creators 0 (creator
pass scheduled for the next wave). **Closures:** none found (all Michelin 2026/current listings).
**Build + gates (58 rendered / 63 discovered):** sourcecheck PASS (63; 39 lone authority) · geocheck PASS ·
statuscheck CONSISTENT · buildcheck PASS · `npm run validate` DATA OK · `npm test` ALL PASS.
