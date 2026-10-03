# Tokyo W5 — brief for background discovery agents (read fully)

Repo: /home/user/cleo-guide. You research ONE category for the Tokyo map and write ONE output JSON file
(path given in your prompt). Do NOT edit any other file, do NOT git commit. WebSearch is the only web tool
(WebFetch is blocked — don't try). Never invent a name, URL, address, dish or coordinate: copy only from results.

## Already on the map — do NOT return these (also skip obvious variants/branches)
See `data/tokyo-research/_w5_existing_names.txt` (one name per line) and any `_w5_*_verified.json` already written.

## Areas (field "a") — assign by the actual ward in the address
CYD Chiyoda · CHUO Chūō · MNT Minato · SJK Shinjuku · SBY Shibuya · TAITO Taitō · SMKT Sumida+Kōtō ·
JONAN Shinagawa/Meguro/Ōta · JOSAI Setagaya/Nakano/Suginami · JHOKU Toshima/Bunkyō/Kita/Arakawa/Itabashi/Nerima ·
JOTO Katsushika/Edogawa/Adachi · TAMA Tama area (Musashino/Mitaka/Chōfu/Hachiōji/Tachikawa/Ōme...) ·
KANTO day trips (Yokohama, Kamakura, Kawagoe, Hakone, Nikkō, Fuji Five Lakes...).
Areas most in need (prefer these): SBY, SJK, JOSAI, JONAN, SMKT, TAITO, CYD, TAMA, JOTO, JHOKU.

## Source bar (hard)
Each place needs ≥2 credible sources from DIFFERENT outlets, OR one Michelin award (star/Bib/Selected — key
MICHELIN_BIB/MICHELIN_STAR/MICHELIN) alone. Credible keys: TIMEOUT, JAPANTIMES, EATER, INFATUATION, CNTRAVELER, CNN,
NYT, GUARDIAN, BBC, LONELYPLANET, ATLASOBSCURA, JAPANGUIDE, GOTOKYO, JNTO, SAVORJAPAN, TOKYOCHEAPO, MONOCLE,
WORLD50 (World's/Asia's 50 Best), TABELOG100 (Tabelog Hyakumeiten 百名店 selection — counts once), TABELOGAWARD,
DANCYU, BRUTUS, HANAKO, ASAHI, NIKKEI, NHK, MICHELIN_EDITORIAL (Michelin magazine feature, not an award),
creators: RAMENADVENTURES (Ramen Adventures/Brian MacDuckston), RAMENBEAST, PAOLOFROMTOKYO, ONLYINJAPAN, ABROADINJAPAN,
TOKYOLENS, RACHELJUN — creators only with a specific findable piece naming the place. OFFICIAL (own site) may be
listed but never counts toward the 2. ZERO: Yelp, TripAdvisor, Google, Tabelog scores/pages, Retty, Klook, SEO farms.
Merit: no padding — keep standouts; don't return 4 near-identical shops on one block.

## Pin (hard) — one search per place
WebSearch with allowed_domains ["google.com"], query "<Name> <neighbourhood> maps place" (try the Japanese name if
the first misses). Read LAT/LNG ONLY from `!3d<LAT>!4d<LNG>` in a google.com/maps/place URL — NEVER the `/@lat,lng`
viewport. Michelin venue pages (guide.michelin.com) that print coordinates are also fine. No pin after 2 tries →
lat/lng null, conf "unverified" (still return it if sources are good). Address: copy from the pin result title.

## Status
Note anything saying permanently closed / moved (2025–2026). Closed → "st":"closed" with the source.

## Output — a JSON LIST, written incrementally after every 3–4 places (so work survives a cutoff)
Food/drink record:
{"t":1|2|3,"a":"SBY","cz":["RAMEN"],"dish":"<specific dish/drink named by a source>","n":"<romanized name (日本語)>",
 "address":"<full address, ward, Tokyo + 〒postcode>","w":"<1–2 factual sentences from the sources; name the dish>",
 "sources":[["TIMEOUT","url"],["TABELOG100","url"]],
 "lat":35.0,"lng":139.0,"conf":"high"|"unverified","gs":"Google Maps place pin !3d!4d — <maps url>",
 "st":"open","sts":"<source + date it was seen operating>","kind":"food"}
cz labels: SUSHI RAMEN NOODLE KAISEKI IZAKAYA TEMPURA KONAMON WAGYU TEISHOKU TOFU SWEET CAFE SAKE MKT FINE INT
(bars/whisky/cocktail/beer → SAKE; coffee/kissaten → CAFE; bakeries/wagashi → SWEET; yakitori/tachinomi → IZAKAYA;
tonkatsu/yōshoku/curry → TEISHOKU; soba/udon → NOODLE).
Sight record (anime wave only): same but "kind":"sight", no cz/dish, plus "k":"<short tag>",
"g":["POP","MUS","MKT","TEMPLE","FREE",...] and "anime":"<franchise — why it matters, one line>".
t = tier within its area: 1 = must-go standout (major award/institution), 2 = strong, 3 = good local pick.
Use ~2–3 searches per place on average (1 list search can seed many). At the end report: searches used, places
written, and candidates dropped (with reason).
