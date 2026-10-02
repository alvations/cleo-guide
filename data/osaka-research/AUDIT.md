# Osaka — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (9), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — Wave W1 (TRUNCATED: session WebSearch budget exhausted, 200/200)
**What ran.** ~22 WebSearch calls by this agent before the session-wide WebSearch cap (200 calls, shared by all
~16 concurrent agents) was hit; every further search is refused ("this session has used its web search budget").
Nothing was fabricated to fill the gap.

**Stage 1 — sources discovered (registered via `SOURCES_OSAKA_W1.json`):** MICHELIN_BIB / MICHELIN (Michelin Guide
Japan 2026 Osaka-region venue pages — institutional, lone-solo; the venue pages ALSO expose the place's lat/lng, a
real place pin — the best restaurant-geocoding channel found for Japan), JAPANGUIDE (e4002 Umeda Sky, e4009 Kita),
OSAKAINFO (official bureau: area_kita, Temma spot 204), TIMEOUT (Osaka best-things list), WIKIPEDIA (sight coords).
Rejected as sources: hotel "sightseeing" pages (granbellhotel, hotelkeihan), jw-webmagazine, japankuru, theplanetd,
makemytrip, sygic, haveagood-holiday (SEO/aggregator, unbylined). Inside Osaka and Japan Travel (JAL) noted as
candidate corroborators — not yet vetted.

**Stage 2/3 — extracted & fact-checked (channel counts: Michelin 27 · editorial/official 4 · creators 0 · local 0):**
- FOOD (24 kept, `FOOD_OSAKA_W1.json`): Michelin 2026 Bib Gourmand / Selected, each with the venue-page address:
  udon (Oudon Yomogi, Udondokoro Shigemi, Udonbo Osaka Honten, Udonya Kisuke, Ogimachi Udonya Asuro, Aozora Blue),
  soba (Soba Takama, Sobakiri Gaku, Sobakiri Arabompu, Ayamedo, Sobadokoro Toki, Naniwa Okina), ramen (Chukasoba
  Uemachi, Ramen Kuon, Ramen Hayato), tonkatsu (Minato, Fujii, KATSU Hana, Kyomachibori Nakamura), Tempura Kozaki,
  Kushikatsu Gojoya, Izakaya Tokitame, Yakitori Ichimatsu, Yakitori Torisen. Status: open (listed in the 2026 guide).
- HELD pending address (`_held_W1.json`): Jibundoki, Tanpopo, Oribe (Bib 2026 confirmed; ward not surfaced, so no
  area can be assigned honestly). Also Sumisho Mikuriya / Sumibi Iwata (named as new Bib yakitori, no page/address).
- SIGHTS (4 kept, `SIGHTS_OSAKA_W1.json`): Umeda Sky Building (t1 KITA), Osaka Tenmangū, Japan Mint cherry passage,
  HEP Five Ferris Wheel — each ≥2 credible.
- HELD single-source (`_held_W1.json`): Shitennō-ji (Wikipedia only; coord already verified 34.6539,135.51645),
  Osaka Castle, Dōtonbori, Kuromon Market (Time Out only), Hōzen-ji/Yokochō (non-credible pages only),
  Tenjinbashisuji, Museum of Housing and Living, Nakanoshima Museum of Art, Temma Tenjin Hanjo Tei (OSAKA-INFO only).
- No Michelin takoyaki/yakiniku Bib surfaced — the konamon/horumon canon needs the editorial channel (W2).

**Stage 5 — geocode (`geo/_geoout_osaka_W1.json`):** 4 high (Umeda Sky, Tenmangū, Japan Mint — Wikipedia infobox;
Kushikatsu Gojoya — Michelin venue-page geo), 1 UNVERIFIED (HEP Five). The other 23 Michelin restaurants are not yet
geocoded (each needs one Michelin-domain query; ~1 search/place).

**Stage 6 — build:** NOT built / NOT live. 4 geocodable pins across 2 of 9 areas is not a guide; per protocol §6 the
card stays "Being built" and Japan is not flipped live.
