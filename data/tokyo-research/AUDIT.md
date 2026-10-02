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

## 2026-10-02 — W2 batches 7–20 (searches 30–58)
**Kept — sights (+43):** CHUO Kabuki-za, Nihonbashi Bridge, Hama-rikyū; MNT Zōjō-ji, Roppongi Hills Mori Tower,
Tokyo Tower, Sengaku-ji, Nezu Museum, National Art Center, Kyū-Shiba-rikyū, Rainbow Bridge, Teien Art Museum; SMKT
teamLab Planets, Toyosu Market, Tomioka Hachimangū, MOT; JOSAI Nakano Broadway, Shimokitazawa (med, district point),
Gōtoku-ji; TAMA Ghibli Museum, Inokashira Park, Mt Takao (summit), Jindai-ji; KANTO Kōtoku-in Daibutsu, Tsurugaoka
Hachimangū, Nikkō Tōshō-gū (WIKIPEDIA + UNESCO 913); JOTO Shibamata Taishakuten, Kasai Rinkai Park; JHOKU Rikugien,
Koishikawa Kōrakuen, Kyū-Furukawa, Sunshine City, Jiyū Gakuen Myōnichikan; CYD Nikolai-dō, Tokyo International Forum;
SBY Shibuya Sky, Hachikō, Yebisu Garden Place, Omotesandō Hills; TAITO National Museum of Western Art, Kyū-Iwasaki-tei,
Yanaka Cemetery, Asakusa Shrine; JONAN Meguro Parasitological Museum, Ikegami Honmon-ji.
**Kept — food (+19, Michelin):** Yakitori Abe, Jimbocho Gokita, Bird Land Ginza, Yakitori Omino, Yakitori Sanka,
Asagaya Bird Land, Tempura Ginya, Tempura Taku, Ginza Kojyu, Unagi Tokito, Sobakappo Nagano; UNVERIFIED pin (held off
map): Ginza Katsukami II, Shutei Tanaka, Yoshoku Edoya, Sézanne, Mutsukari, Tempura Abe Honten, Jinbo Minami Aoyama,
Aoyama Ototo. Newly-listed 2026 Michelin pages never surface coords; 4+ names per query drops coords; the word
"cuisine" in the query seems to make the engine summarise list pages instead of venue pages.
**REJECTED coordinates:** Tsukiji Outer Market — Wikipedia "Tsukiji fish market" point is the demolished inner
market (~400 m off) → held. Jinbo / Aoyama Ototo — engine returned an *area estimate*, not the page pin → UNVERIFIED.
Google-Maps-restricted search (Ponta Honke) returned an unrelated place → method abandoned (1 search wasted).
**Creators (channel mix):** Ramen Adventures (Brian MacDuckston) attached to Konjiki Hototogisu, Muginae, Nakiryu,
Yakumo (`CREATORS_TOKYO_W2.json`). Time Out Tokyo attraction pages added as 2nd source (Gōtoku-ji, Ikegami Honmon-ji).
**Held:** `_pending_w2.json` (17: Omoide Yokochō, Ameyoko, Takeshita-dōri, Harmonica Yokochō, Chidorigafuchi, Tsukiji
Outer Market, Tsukishima Monja St, Tokyo Dome, Gokoku-ji, Yushima Seidō, Todoroki Valley, Taishakuten-sandō,
Kochikame statues, Nishiarai Daishi, Kawagoe Toki no Kane, Togoshi Ginza, Meguro River).
**Build (127 discovered / 114 rendered, 13 UNVERIFIED):** sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT ·
buildcheck PASS · validate DATA OK · npm test ALL PASS. Closures: none.

## 2026-10-02 — W2 batches 21–48 (searches 59–95)
**New method — Wikidata P625 (record for every later wave).** A `wikidata.org`-restricted query "A latitude
longitude; B latitude longitude; …" (4 names) returns each item's `coordinate location` (P625) — it covers streets,
alleys and *historic restaurants* (ja-wiki shinise) that en.wikipedia infoboxes lack. Wikidata is used for the PIN
only, never as one of the two sources; the sources come from a separate Time Out / Japan Times / Savor Japan /
GO TOKYO / japan-guide corroboration query naming the same places. Rejected Wikidata points: Daikokuya Tempura
(whole-second precision, ~400 m east of the shop), Tamahide/Harmonica Yokochō/Shin-Ōkubo (only the district or
station point came back — Shin-Ōkubo kept at `med` as an explicit station-hub point, the others held).
**Kept — sights (+56):** KANTO (Yokohama: CupNoodles Museum, Landmark Tower, Sankei-en, Chinatown; Hakone Shrine,
Open-Air Museum; Kamakura: Hase-dera, Engaku-ji, Kenchō-ji, Hōkoku-ji, Enoshima (med); Nikkō: Kegon Falls, Rinnō-ji,
Lake Chūzenji (med); Fuji: Chūreitō, Lake Kawaguchi (med), Oshino Hakkai; Kawagoe: Kita-in, Toki no Kane);
SJK Yayoi Kusama Museum, Hanazono Shrine, Kabukichō Tower, Kagurazaka (med), Omoide Yokochō, Godzilla Head,
Shin-Ōkubo (med); CHUO Tsukiji Hongan-ji, Suitengū, Wakō (med); TAMA Edo-Tokyo Open Air Architectural Museum,
Shōwa Kinen Park (med), Nippara Caves; JOTO Mizumoto Park, Tora-san Museum, KochiKame Museum, Nishiarai Daishi;
JONAN Nakameguro (med), Jiyūgaoka (med), Meguro Sky Garden; JOSAI Kōenji (med); JHOKU Gokoku-ji, Tokyo Dome City,
Yushima Seidō; CYD Hibiya Park, National Diet Building, Kitanomaru Park; TAITO Ameyoko; SBY Takeshita-dōri,
Yoyogi National Gymnasium, Daikanyama T-Site, Miyashita Park; MNT Meiji Jingū Gaien ginkgo avenue (med);
SMKT Fukagawa Edo Museum, Mukōjima-Hyakkaen, Tokyo Big Sight, Unicorn Gundam statue (CLOSED).
**Kept — food (+15):** Michelin: Nihombashi Kakigaracho Sugita, Ishibashi, Hashimoto, Sushi Hashimoto, Sasaki
Seimenjo, Sushi Miyuki; non-Michelin heritage (Wikidata pin + 2 editorial): Sukiyabashi Jiro Honten (Wikipedia +
Time Out), Kanda Yabu Soba (Time Out + Japan Times), Kanda Matsuya, Isegen (Savor Japan + Japan Times), Komagata
Dozeu (Time Out + Japan Times), Rengatei (Time Out + Japan Times), Taimeiken (Time Out + Savor Japan), Kamiya Bar
(Time Out + Japan Times), Sasanoyuki (Time Out + Japan Times).
**CLOSURE (4c):** Unicorn Gundam statue, DiverCity — Time Out Tokyo news (May 2026) reports retirement in August
2026 → kept, flagged `— CLOSED`, statusSource recorded.
**MEASURED & DROPPED:** Shintomicho Yuasa, Kutan (Michelin, pinned, but cuisine not returned → no named dish; also
a 4th/5th Shintomi counter would be padding); Taishakuten-sandō (would duplicate the Taishakuten pin — folded into it
as JAPANGUIDE/TIMEOUT sources); Nihombashi Mitsukoshi (returned point = Nihonbashi district → rejected, held).
**Held (single source or no pin):** see `_pending_w2.json` — Botan, Takemura, Tamahide, Hantei, Tomoegata, Chōmeiji
Sakuramochi, Asakusa Imahan, Daikokuya, Kanda-area Chidorigafuchi, Tsukiji Outer Market, Tsukishima Monja St,
Harmonica Yokochō, Todoroki Valley, Togoshi Ginza, Horikiri Shōbuen, Shōin Shrine, Kuhonbutsu, Setagaya Boro-ichi,
Shinkyō, Ōwakudani, Nonbei Yokochō, Shinjuku Suehirotei, Ichiran Shibuya.
**Build (198 discovered / 185 rendered, 13 UNVERIFIED):** all four gates PASS/CONSISTENT; validate DATA OK; npm test
ALL PASS. Channel mix to date: Michelin 50 · Wikipedia ~120 · GO TOKYO ~85 · japan-guide ~40 · Time Out ~35 ·
Japan Times 7 · Savor Japan 3 · UNESCO 2 · creators: Ramen Adventures (4 attachments).

## 2026-10-02 — self-correction: Japanese-script names
Some W2 food records carried a Japanese-script name in parentheses typed from memory rather than read from a source.
That is unverified content, so 31 of them were stripped back to the sourced romanized name (map in
`_renamed_w2.json`; registry keys in `data/geocodes.json` renamed in place, no coordinates changed). Japanese names are
kept only where the shop/landmark name is unambiguous and well attested (e.g. 神田まつや, いせ源, 駒形どぜう, 浅草寺).
Rule for later waves: add the kanji/kana only when a source in hand shows it.

## 2026-10-02 — W2 batches 49–110 (searches 96–166) + go-live + close-out
**Kept since the last section:** food +29 (Michelin: Tentempura Uchitsu, Abysse, Tempura Otsuka, Bistro Yebisu,
Kyorakutei, Tamawarai, Ginza Yondaime Takahashiya, Makiyaki Ginza Onodera, Sobakiri Suzuki, Teuchisoba Jiyusan,
Biriyani Osawa, Shinrakuki, Gigio, Hakodate Shioramen Goryokaku, Zupperia Osteria Pitigliano, Shinjiko Shijimi
Chukasoba Kohaku; heritage/canon with Wikidata pins: Shin-Yokohama Rāmen Museum, Kashiya Yokochō, Takagiya Rōho,
Tsukishima Monja Street, Chōmeiji Sakuramochi, Kototoi Dango; UNVERIFIED: Tempura Motoyoshi, Ten Yokota,
Il Ballond'oro, Ginza Shinohara, Osobano Kouga, Teuchi Asama, Afuri Ebisu) · sights +~80 across every area
(see `SIGHTS_TOKYO_W2.json`; highlights: Akasaka Palace, Kōkyo Gaien, Ōta Memorial Museum, Sompo (Sunflowers),
Warner Bros. Studio Tour, Asukayama, Higo-Hosokawa, Chinzan-sō, Kameido Tenjin, Tokyo Sea Life Park, Tonogayato,
Ōkunitama, Hachiōji Castle, Ōwakudani, Lake Ashi, Odawara Castle, Fujiya Hotel, Futarasan, Zeniarai Benten,
Doraemon Museum, Nihon Minka-en, Kawagoe Hikawa).
**Creators:** Paolo fromTOKYO ('Behind the Counter at the ONLY Japanese Monkfish Restaurant in Tokyo') attached to
Isegen. ONLY in JAPAN (John Daub) vetted but rejected for now — no findable video naming a mapped place.
**MEASURED & DROPPED (no named dish on the Michelin page / padding):** Ippei Hanten, Chugoku Hanten Fureika, Washokuya
Taichi, YAMATO, Shokudo Wata, Night Market, Ramen Break Beats, Yakumo Uezu (pins found but cuisine/dish not stated in
the result — a card must name a dish), Ginza Kousui, Nominokoji Yamagishi, Le Nougat (Ginza padding), Shintomicho
Yuasa, Kutan. Sumo Museum (inside the Kokugikan — same pin), Kachidoki Bridge and Sunamachi Ginza (only station/
district points returned).
**Self-correction:** 31 Japanese-script names typed from memory removed (`_renamed_w2.json`; registry keys renamed,
coords untouched). Three addresses typed from memory (Kototoi Dango, Afuri Ebisu, Ōmori Nori Museum) coarsened to the
sourced locality. **Open item:** W2 *sight* street addresses were mostly written from the venue's well-known address,
not re-read from the cited page — an address-verify pass is queued as W3 step 4 (coordinates are all sourced).
**Status (4c):** every record carries status + statusSource from a current page; held for status: Edo-Tokyo Museum,
Shitamachi Museum (renovation closures not confirmed in hand). Closed flagged: Unicorn Gundam statue (Time Out 2026).
**Final build:** 314 discovered / 294 rendered (212 sights + 82 food), 20 UNVERIFIED held, 13/13 areas;
sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS.
**Go-live:** Japan hub CARD:tokyo → live link with counts; countries.json japan live; root CARD:japan "1 of 5 maps
live"; CITIES.md row. **Searches used:** 166 (of ~200); stopped with a buffer as yield fell below ~2 places/search.

## 2026-10-02 — W3 (continuation): pins, address-verify, status re-checks, Michelin food
**Pins upgraded (UNVERIFIED → Michelin venue-page coords):** Ponta Honke, Sushi Kanesho, Katsuo Shokudo, Yaesu Unagi
Hashimoto, Ginza Katsukami II, Japanese Ramen Gokan, Shutei Tanaka, Yoshoku Edoya, Mutsukari, Sézanne, Jinbo Minami
Aoyama, Aoyama Ototo, Tempura Motoyoshi, Ten Yokota, Il Ballond'oro, Ginza Shinohara, Osobano Kouga, Teuchi Asama.
Still UNVERIFIED (gate holds them): Tempura Abe Honten, Afuri Ebisu, Tamahide, Iseya Kichijōji, Amazake-chaya.
**Held queue cleared:** Kawasaki Daishi, Meguro Fudōson, Shōin Shrine, Kuhonbutsu, Toneri Park, Ōmori Shell Mound,
Tsukiji Outer Market (Wikidata Q117475236), Shinkyō, Chidorigafuchi, TAKAO 599 Museum.
**Address-verify pass (CLAUDE.md 4a) — all 222 sights.** Each street address re-read from GO TOKYO spot pages,
Wikipedia infoboxes or japan-guide (4 names per query, *without* our street numbers in the query so results can't echo
them). Result per sight + source URL in `_addrcheck_w3.json`: **130 verified · 8 fixed · 55 coarsened to the sourced
locality · 29 already locality-only**. Fixed: Hanazono Shrine 5-17-3→5-17-13; Chūreitō 3353-1→3360-1 Arakura; Toranomon
Hills 1-23-1→1-23-4; Golden Gai 1-1→1-1-6 Kabukichō; Scramble Crossing → "Dōgenzaka-shita" (GO TOKYO); Ginkgo Avenue →
Gaien 1-1 Kasumigaokamachi (GO TOKYO); Yoyogi Park → Yoyogikamizonochō / 2 Jinnan; Shakujii Park → Shakujiidai 1–2 /
Shakujiimachi 5. Coarsened where sources disagreed or gave no number (e.g. CupNoodles Museum — Wikipedia and our record
disagreed — now "Minato Mirai 21, Naka-ku"; Rikugien, Toyosu Market, Kyū-Shiba-rikyū, Kasai Rinkai, Kantō day trips).
**Lesson:** never put our own street number in a verify query — the search summary echoes it back as if confirmed.
**Status (4c):** Edo-Tokyo Museum — reopened 31 Mar 2026 (Time Out, Japan Times 2026-03-27, japan-guide blog) → added
(Wikipedia pin). Shitamachi Museum — reopened 9 Mar 2025 (official taitogeibun.net) → added (Wikipedia whole-second pin,
conf med). 3331 Arts Chiyoda (closed Mar 2023, Time Out) and Hara Museum Shinagawa (closed Jan 2021, Wikipedia) — were
never on the map; not added (a closed place earns no new pin). Tempura Abe Honten — Michelin page still shows Bib 2021
only → stays held.
**Food (Michelin, lone authority + editorial):** Sushi Kourin, Ramen Break Beats (dish now stated: clear chicken shōyu —
reverses the W2 drop), unagi trio from Michelin's "Tokyo freshwater eel" feature (Watabe, Hatsuogawa, Mejiro Zorome),
inspectors' iconic-dish picks (Edosoba Hosokawa, Tempura Kakiage Yukimura, Katsuyoshi, Hikarimono, SUKIYAKI ASAI),
inspectors' dishes of the year (Myojaku 3★ 2026, Sushi Miura, Sanosushi), 2025 new Bibs (Tachiguisushi Sushikawa,
Fry-ya, Sushi Mikata), 2024 addition Yotsuya Minemura. **Dropped:** Night Market (Southeast-Asian hawker — not Tokyo
canon), jeeten (Chinese), Shokudo Wata (still no named dish), Kappo Muroi / Yakitori Moe es (coords not returned —
retry). Kantō/Tama food searches yielded little (gap stated, not filled).
**Build:** 347 discovered / 342 rendered (224 sights + 118 food); sourcecheck PASS · geocheck PASS · statuscheck
CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS. Go-live surfaces refreshed.

### W3 (cont.) — Michelin by ward, 2024–26 star lists, Shinjuku/Shibuya sights → close-out
**Kept:** SBY Torishige (yakiton, Bib 2026), Kuhara (duck, Bib 2026), Sassa, Sushi Yuki, Hiroo Ishizaka; SJK Sushi Oya,
Ichirin, Ubuka (crab), Fry-ya, Yotsuya Minemura; JOSAI Tensuke (tamago-ten, Bib 2026 + Time Out), Sushi Yoshino; TAITO
grill GRAND (yōshoku); CHUO Nihombashi Sonoji (1★), Yakitori Takahashi, Ginza Kitagawa, Katsuyoshi; JONAN Higashiyama
Muku, Ramen Break Beats; MNT Nishiazabu Sushi Shin (2★), Hakuun (2★), Akasaka Shimabukuro, Sushi Tanaka, Daigo
(shōjin), Miyasaka, Nishiazabu Noguchi. Sights: Japan National Stadium, Haruki Murakami Library, Tsubouchi Theatre
Museum, National Noh Theatre, Tokyo Metropolitan Gymnasium, Toyama Park & Hakoneyama, Akagi Shrine, Shinjuku
Suehirotei, Natsume Sōseki Museum (Wikidata pins + Time Out/japan-guide/GO TOKYO), Gyosen Park (GO TOKYO + Time Out).
**Stopped adding** generic "seasonal Japanese course" fine dining in Minato (MNT 48/50) — padding risk under the merit
rule; further MNT adds need a named signature dish.
**Dropped / held:** Takumi Tatsuhiro (cuisine not stated), Chukasoba Kotetsu (Bib 2025, dish not stated), Kisaiya Hide
and Shuko Takigiya (no dish, no pin), Night Market / jeeten / REI / Hibino / SANTOSHAM / French–Spanish–Italian Bibs
(not Tokyo canon; kept the list Japanese-led), Tomoegata and Fukagawajuku (sources in hand, no pin — helper),
Kichijōji Satou / Ozasa / Funabashiya (no pin). Tonkatsu Nanaido and Nakiryu addresses re-checked after conflicting
search summaries — both records correct (Michelin venue pins Aizumichō / Minami-Ōtsuka).
**Build:** 379 discovered / 374 rendered (234 sights + 140 food); sourcecheck PASS · geocheck PASS · statuscheck
CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS. Searches W3 ≈ 155.
**W4 opener (same session):** CHUO sights +3 — Mitsui Memorial Museum, Bank of Japan Currency Museum (GO TOKYO + Wikipedia
pins), Tsukudajima (GO TOKYO + Wikipedia; district point for a district sight). Rejected: Nihombashi Mitsukoshi (only the
Mitsukoshimae Station point), Kachidoki Bridge (whole-second point not confirmed on the span), Eitai Bridge (coords
without a page in hand), Tokyo Stock Exchange (one source). → **382 discovered / 377 rendered (237 sights + 140 food)**;
all gates green, validate + npm test pass.

## 2026-10-02 — W4: discovery in front, placement re-check in background
**Process decision (logged per protocol):** the orchestrating session relayed the instruction to keep discovery running
and background the CLAUDE.md 4b placement pass. A background subagent re-checked the 8 venue-level `med` pins (11
searches; results in `_placement_w4.json`, applied via `_pin.py`): **keep** Wakō (Wikidata Q1355621 is the building),
Shitamachi Museum, Akagi Shrine, Suehirotei; **upgrade** Toyama Park → Hakoneyama summit (ja.wikipedia 箱根山, old
point ~800 m west), Gyosen Park (~60 m), Natsume Sōseki Memorial Museum (ja.wikipedia 早稲田南町7 — old Wikidata pin
~700 m off, i.e. misplaced), Shōwa Kinen Park (~300 m). District/lake/street `med` pins left as-is (district sights).
**Discovery:** TAITO Shinobazu Pond (Wikipedia + Time Out + japan-guide), Asakusa Culture Tourist Information Center
(Wikipedia + Time Out), Imado Shrine (Time Out + GO TOKYO Sumida map; Wikidata pin); JHOKU Yushima Tenmangū (GO TOKYO +
Time Out; Wikidata pin); CHUO Hamacho Kaneko (Bib 2026 + Michelin soba-mae feature). Held: Matsuchiyama Shōden (one
source), Kan'ei-ji, Yanaka Ginza (no street pin). Prose on new cards trimmed to what the sources state.
**Build:** 387 discovered / 382 rendered (241 sights + 141 food); all gates green; validate + npm test pass.

## 2026-10-02 — W5: FOOD & DRINK FIRST + ANIME (session_01VQaxQ69L5PmZRFY3PnAJQQ)
**Process decision:** discovery split into category waves run by background agents (bars & coffee, ramen/noodles,
izakaya/drinks, sweets/bakeries, anime) under one brief (`_w5_agent_brief.md`); each writes `_w5_<cat>_verified.json`;
the lead vets every record with `_tokyo_w5_ingest.py` (≥2 distinct credible outlets or a Michelin award; OFFICIAL never
counts for food; named dish; pin only from `!3d!4d` matching lat/lng or Michelin/Wikipedia; dedup) → FOOD/SIGHTS_TOKYO_W5 +
`geo/_geoout_tokyo_w5.json`; failures logged in `_w5_held.json`.
**Lesson (search channel):** multi-name `google.com` place queries return hotels, not the bars; Wikidata has no items
for small yokochō — one Google place query per venue is the only pin channel, and bars/kissaten often return only
`cid=` or no-`!3d` links (bars wave: 3 of 21 pinned in 44 searches). Unpinned but well-sourced places are kept as
UNVERIFIED (discovered, held off the map for `tools/geocode-helper.html`).
### Batch 1 — bars & kissaten / specialty coffee (44 agent searches + 9 lead searches)
**Kept (14):** Bar Benfiddich (pin), Virtù, Punch Room Tokyo, Bar Libre, The Bellwood (pin), Bar High Five, Bar Trench —
World's/Asia's 50 Best Bars + Time Out (+ CNN/PUNCH); Café de l'Ambre (Monocle + Time Out), Chatei Hatou (Monocle +
Infatuation), Koffee Mameya Kakeru (Time Out + Tokyo Weekender + Sprudge), Glitch Coffee (pin; Time Out + Tokyo
Weekender), Fuglen Tokyo, Onibus Nakameguro (Time Out + Tokyo Weekender), Tajimaya (Time Out + Metropolis).
New outlets (SOURCES_TOKYO_W5.json): WORLD50, MONOCLE, PUNCH, TOKYOWEEKENDER, METROPOLIS, SPRUDGE, INFATUATION, CNN.
**Held:** Gen Yamamoto (no 50 Best URL in hand; possible relocation), Tokyo Confidential, Cafe Bon, Monozuki, Satella
(Time Out only), Higashi-Mukojima Coffee-Ten (Time Out + unconfirmed municipal PDF), The SG Club (no named drink).
Stars and Stripes dropped as a source (not editorial of record). Lead's Shibamata/Kamakura probes: Savor Japan (a
Gurunavi reservation site's advertorial) not counted; Taishakuten-sandō held (no place pin).
Pins: 3 high, 11 UNVERIFIED → helper.
### Batch 2 — izakaya/drinks, ramen/noodles, sweets (agents ~30 + ~24 + ~33 searches) → session cap hit (200/200)
**Kept (23):** yokochō & drinks — Nonbei Yokochō (Time Out + Tokyo Cheapo + GO TOKYO), Harmonica Yokochō (GO TOKYO + Time
Out + Lonely Planet), Hoppy Street, Yūrakuchō Gādo-shita (japan-guide + Tokyo Cheapo), Beer Club Popeye (Time Out + Japan
Times), Ushitora Shimokitazawa (Time Out + Tokyo Cheapo; the two give different addresses — confirm in the helper pass),
Gem by Moto, Shinsuke Yushima (Lonely Planet + Japan Times + Izakaya Hyakumeiten), Sasagin. Ramen/noodles — Harukiya
Ogikubo, Fuunji (address 2-14-3 Yoyogi → SBY), Menya Itto (JOTO), Chinchintei abura soba (TAMA), Tsukemen Michi (JOTO;
status not separately checked), Sanukiya udon (Michelin Bib venue page). Sweets — Usagiya, Toraya Akasaka (pin), Naniwaya
Sōhonten, Kūya, Ginza Kimuraya, Himitsudō, Asakusa Kagetsudō, Bricolage Bread & Co.
**Held (lead's vetting):** Shuko Takigiya & Kisaiya Hide (still no specific dish — W3 reason stands), Tanako (Michelin
source is a 2017 article; current Bib unconfirmed), Chūka Soba Ibuki (no source describes the bowl), Baikatei (Hyakumeiten
claim only via an aggregator). Agent drops: Kurand Sake Market Ikebukuro (a directory says closed — status unclear),
Yakiton Tatsuya / Ebisu Yokochō / Itakuraya / Kameju / Comme'N / Truffle Bakery (one source), Daihashi & Yusui (no
credible source). Not reached: depachika, Akabane/Tateishi senbero, Rokurinsha/Mutekiya/Taishoken/Nagi.
**Channel mix W5:** 50 Best (7), Time Out (30), Japan Times (6), Lonely Planet (5), Tokyo Cheapo (8), GO TOKYO (3),
Monocle (2), Tokyo Weekender (4), Tabelog Hyakumeiten (4), Michelin (1), creators — Ramen Adventures (4), Ramen Beast (1).
**Build:** 424 discovered / 386 rendered (241 sights + 183 food → food share 43%, up from 37%); sourcecheck PASS ·
geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS. 33 W5 pins UNVERIFIED.
### Batch 3 — ANIME & pop culture (agent ~23 searches; cap reached)
**Kept (9, each with `"anime"`):** Super Potato Akihabara (Time Out + Tokyo Cheapo; pin), Mandarake Complex, @home cafe
Akihabara (sight — no source names a dish), Pokémon Café Nihonbashi (food; reopened 17 Jun 2026 after renovation, Time
Out), The Gundam Base Tokyo (still operating after the Unicorn statue's retirement), Pokémon Center Mega Tokyo (own store
inside Sunshine City — distinct place), Tokiwasō Manga Museum (GO TOKYO + japan-guide; Google Arts & Culture point
rejected as a pin → UNVERIFIED), Suginami Animation Museum, Suga Shrine stairs (*Your Name.*; Atlas Obscura + nippon.com).
**Dropped (one outlet):** Kirby Café, Gachapon Kaikan / Gashapon Dept Store, Jump Shop/Character Street, Captain Tsubasa
statues Yotsugi. Not reached: Ultraman Soshigaya, Sanrio Puroland, Toei Animation, Animate Ikebukuro, Tokyo Anime Center,
Kamakura-kōkōmae, Anpanman Museum. **ANIME layer: 24 records** on the dataset (15 before W5).
**Final W5 build:** 433 discovered / 387 rendered; all 4 gates PASS; validate DATA OK; npm test ALL PASS; hub refreshed.
Session searches: lead 9 + agents ~154 + bars agent 44 → the 200 cap (shared with subagents) — W5 closed.

## 2026-10-02 — W6 (session_01S4xkEp3ybvSczLJTRuA3Xb) — FOOD FIRST + anime — batches 1–3
**Method decisions (logged per run protocol).** (1) Michelin Bib/Selected is largely mined by W2/W3 (dup-checks on
Sobakappo Nagano, Jiyusan, Gigio, Omino, Narikura, Nanaido, Hinata, Enraku, Taiyo, Katsukami all hit) — W6 pivots to
genre lists cross-corroborated across outlets (Time Out best-of lists + Ramen Adventures / Tokyo Cheapo / Japan Times /
Savor Japan / Tokyo Weekender). (2) **Pins:** Google `!3d!4d` via WebSearch failed again (Rokurinsha: 0 hits, and the
tool chained 4–5 sub-searches); department-store queries to Wikipedia return district points only (REJECTED); an
openstreetmap.org-restricted search returns only wiki pages. So W6 records places with a sourced address and an
UNVERIFIED pin (gate holds them off the map) unless Michelin/Wikipedia coords surface free; a capped background
geocode agent works the UNVERIFIED list. (3) Multi-name queries (≥4 names or mixed domains) make the search tool chain
3–5 internal searches — keep corroboration to ≤3 names.
**Kept (batch 1–3): 39 food + 10 sights.**
- Ramen (8): Rokurinsha (TOKYOCHEAPO+RAMENADVENTURES+TIMEOUT), Kiraku Dōgenzaka (TIMEOUT+RA+RAMENBEAST), Gonokami
  Seisakusho (TIMEOUT+TOKYOCHEAPO+RA), Akanoren (TIMEOUT+RA+SAVORJAPAN), Shibire Noodles Rousokuya (TIMEOUT+RA),
  Ramenya Shima (RA best-100 2025 #1 + TOKYOWEEKENDER — clears W5 one-source hold), Chūka Soba Shibata (TIMEOUT+RA #4),
  Kamofuku (TIMEOUT+RA #5 — clears hold), Ichiran Shibuya (TIMEOUT+WIKIPEDIA, W2 held item).
- Shinise/other: Asakusa Oden Otafuku (TIMEOUT+TOKYOCHEAPO+GOTOKYO), Unagi Komagata Maekawa (TIMEOUT+SAVORJAPAN),
  Daikokuya Tempura (TOKYOCHEAPO+JAPANGUIDE; W2 Wikidata point stays REJECTED), Takemura (TIMEOUT+JAPANTIMES),
  Dashin Soan (TIMEOUT+JAPANTIMES), Blue Bottle Kiyosumi (TIMEOUT+WIKIPEDIA), Isetan Shinjuku & Ginza Mitsukoshi
  depachika (TIMEOUT depachika list + GOTOKYO + WIKIPEDIA/TOKYOCHEAPO), Kirby Café (TIMEOUT+TOKYOWEEKENDER, anime).
- Drinks agent (17, all TIMEOUT + JAPANTIMES/LONELYPLANET/TOKYOCHEAPO/TOKYOWEEKENDER/SPRUDGE/MONOCLE): Ladrio, Sabouru,
  Kayaba Coffee, Arise, Zoetrope, Goodbeer Faucets, Baird Nakameguro, Azuki to Kouri, Mamatoko, Utsura Utsura, Lion,
  Coffee Lawn, JBS, Gunrindo, Lonich, Dandelion Kuramae (t3, US chain), Obscura Sangenjaya. Dropped: DUG (closed 27 Jun
  2026 per Time Out), Milonga Nueva / Chap / Mitsuki / Violon / Know by Moto / Jules Verne / Poppins (one source),
  Allpress/Kurand (chains), Cream of the Crop/Lucent/Coffee Wrights (padding).
- Outer-area agent (4 kept): Tonkatsu Hasegawa (MICHELIN_BIB — result cited 2023; re-check current selection),
  Yoshimuraya Yokohama (RA+JAPANGUIDE), Ogawakiku Kawagoe (SAVORJAPAN+TIMEOUT), Hōtō Fudō Kawaguchiko (TOKYOCHEAPO+JNTO).
  HELD → `_w6_held.json`: Kameido Gyoza (2nd source unconfirmed), Kiyosumi Takahara (no named dish), Ozasa (GO TOKYO only).
  Dropped one-source: Monzen Toraya, Kawachiya, Ojigi Chaya, Uchida, Kaburaya, Satou, Takahashiya, Hatsuhana, Takeyabu,
  Wasai Yakura, Cafe Torocco.
- Anime (7 sights + Kirby Café): Sanrio Puroland (WIKIPEDIA coords high), Kamakurakōkōmae Slam Dunk crossing (station
  infobox coords, med), Animate Ikebukuro, Ultraman Shopping Street, Anime Tokyo Station, Tokyo Anime Center (Shibuya),
  Toei Animation Museum. Other sights (W2 held, 2 sources, pin UNVERIFIED): Todoroki Valley, Koiwa Iris Garden,
  Nihombashi Mitsukoshi Main Store.
**Channel mix:** editorial/travel sites (Time Out, GO TOKYO, japan-guide, Tokyo Cheapo, Japan Times, Savor Japan, Weekender,
Lonely Planet, Monocle, Sprudge) on every place; creators: Ramen Adventures on 9, RamenBeast 1; Michelin 1; Wikipedia 5.
**Build (after batch 3):** 482 discovered / 389 rendered (244 sights + 145 food on map); food 223/482 = 46.3%;
UNVERIFIED held 93; sourcecheck PASS (482) · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS; validate + test green.
