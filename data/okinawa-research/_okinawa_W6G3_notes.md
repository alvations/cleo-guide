# W6G3 notes (geocoder, Miyako/Yaeyama restaurants) — 2026-10-03

Searches used: 22/22 (cap reached; stopped). Pattern: WebSearch extended, one place per query,
`<日本語名> <full JA street address> 緯度 経度` → aggregator listing coordinate, graded `low`, accepted only when
consistent with the sourced street address (aggregators named in geoSource; coordinate only, never a recommender).
Output: `geo/_geoout_okinawa_W6G3.json` (23 records).

## Pinned (low) — 21
Kojasobaya; Rakuen no Kajitsu; Kinatsuyu; Irabu Soba Kame; Maruyoshi Shokudō; Yamato Shokudō; Minato Shokudō;
Jinku-ya; Yamamoto (yakiniku); Kimi Shokudō; Adan-tei; Hitoshi Ishigantō; Mori no Kenja; Milmil Honpo; RICCO gelato;
Tunkaraya; KITCHEN inaba; Akashi Shokudō; How Tree Gelato; Shiken-bara; Gōya.
Most had 2–4 listings agreeing within ~100 m. FLAG for 4b re-verify: Milmil Honpo (listings ~250 m apart; took
the agreeing pair), KITCHEN inaba (single listing).

## UNVERIFIED — 2
- Inaka Ryōri Kura: only a latitude surfaced (TripAdvisor 24.800209), no longitude.
- Shima Gourmet ROCO: only 24.43333301,123.7718948 — latitude is exactly 24°26'00", looks like an area value → rejected.

## Not reached (no record written, per W5 rule) — 17
Nakayoshi Shokudō, Shima no Ushi Ishigaki-ya, Shiraho Shokudō (no street address: find JA address first);
Seifuku, Yaesen, Takamine, Taragawa, Hateruma, Sakimoto, Tokuyama distilleries (try `<名> <address> 緯度 経度` or
jawiki infobox); Takesan-tei (浜崎町2-2-4), Kingyū (美崎町8-8), Pengin Shokudō, Arakaki Shokudō (closed, Ihara),
Kuninaka Shokudō, Kōrakuen, Blue Turtle. Pattern hit 21/23 — the next geocoder should keep using it.

## Closures
None newly found. All pinned places had current listings/hours (statusSource in each record).
