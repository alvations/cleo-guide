# Tokyo (東京) — standing agent brief

Read `data/japan-research/_AGENT_BRIEF.md` first (shared Japan rules, source bar, output schema). This file
adds only what is specific to Tokyo.

## Areas (use these exact ids in every record's `a`)
- `CYD` — Chiyoda-ku (Imperial Palace · Marunouchi · Akihabara · Kanda · Jimbōchō)
- `CHUO` — Chūō-ku (Ginza · Nihonbashi · Tsukiji · Tsukishima · Ningyōchō)
- `MNT` — Minato-ku (Roppongi · Azabu-Jūban · Akasaka · Shimbashi · Shiba · Odaiba)
- `SJK` — Shinjuku-ku (Kabukichō · Golden Gai · Omoide Yokochō · Shinjuku Gyoen · Kagurazaka · Shin-Ōkubo)
- `SBY` — Shibuya-ku (Shibuya · Harajuku · Omotesandō · Ebisu · Yoyogi · Daikanyama)
- `TAITO` — Taitō-ku (Asakusa · Ueno · Yanaka · Kappabashi · Okachimachi)
- `SMKT` — Sumida-ku & Kōtō-ku (Skytree · Ryōgoku · Kiyosumi-Shirakawa · Monzen-Nakachō · Toyosu)
- `JONAN` — Jōnan — Shinagawa · Meguro · Ōta (Nakameguro · Togoshi-Ginza · Kamata · Haneda)
- `JOSAI` — Jōsai — Setagaya · Nakano · Suginami (Shimokitazawa · Sangenjaya · Gōtokuji · Nakano Broadway · Kōenji · Ogikubo)
- `JHOKU` — Jōhoku — Toshima · Bunkyō · Kita · Arakawa · Itabashi · Nerima (Ikebukuro · Sugamo · Nezu · Akabane · Nippori)
- `JOTO` — Jōtō — Katsushika · Edogawa · Adachi (Shibamata · Kameari · Kita-Senju · Kasai)
- `TAMA` — Tama area (Kichijōji · Mitaka & Ghibli · Takao-san · Okutama · Hachiōji · Chōfu)
- `KANTO` — Kantō day trips (Yokohama · Kamakura · Hakone · Nikkō · Kawagoe · Fuji Five Lakes)

**Regioning:** Tokyo's 23 **special wards (tokubetsu-ku, 特別区)** are the borough-equivalent. The densest wards are their own areas (Chiyoda, Chūō, Minato, Shinjuku, Shibuya, Taitō, Sumida+Kōtō); the rest are grouped by the long-standing Tokyo compass terms **Jōnan (城南, south), Jōsai (城西, west), Jōhoku (城北, north) and Jōtō (城東, east)**; beyond the wards is the **Tama area (多摩地域)** of the Metropolis, and the Kantō day-trip ring (NYC's 'Day Trips' equivalent). Assign each place by its actual ward (the address names the -ku).

## Food canon — the opening move (name it, then find who serves it best)
Edomae sushi (Tsukiji/Toyosu), soba (Kanda Yabu, Sunaba), tempura, unagi, monjayaki (Tsukishima), chankonabe (Ryōgoku), Tokyo-style shōyu ramen & tsukemen, yakitori under the Yūrakuchō tracks, oden, tonkatsu, kissaten coffee, depachika, ningyō-yaki (Ningyōchō), Shibamata kusa-dango, monaka & Ginza wagashi, natural-wine izakaya, and the deepest Michelin bench on earth.

## Sights backbone (tier-1 candidates; every area needs ≥1 geocodable tier-1)
Sensō-ji, Meiji Jingū, Imperial Palace East Gardens, Shibuya Crossing, Tokyo Skytree, Tokyo Tower, Ueno Park & Tokyo National Museum, teamLab, Shinjuku Gyoen, Golden Gai, Yanaka Ginza, Nakano Broadway, Ghibli Museum, Gōtokuji, Rikugien, Kiyosumi Teien, Nezu Shrine, Toyosu Market; day trips: Kamakura Daibutsu, Hakone, Nikkō Tōshō-gū (UNESCO), Kawagoe.

## Proven methods (W2, 2026-10-02) — use these first
- **Sights:** `en.wikipedia.org`+`gotokyo.org`+`timeout.com` restricted, 4 names: "A coordinates; B coordinates;
  C coordinates; D coordinates" → infobox coords + GO TOKYO spot page per place. Kantō: `japan-guide.com` instead.
- **Michelin food:** `guide.michelin.com`, exactly 3 exact page names + "Michelin restaurant page latitude longitude
  coordinates" (never the word "cuisine"). Seed names from Michelin category/list queries and the yearly "New Bib
  Gourmands" article (which also gives the named dish).
- **Streets, yokochō, heritage shops:** `wikidata.org`, "A latitude longitude; B latitude longitude; …" (P625 = pin
  only), then a Time Out / Japan Times / Savor Japan / GO TOKYO corroboration query for the two sources.
- Never type kanji/kana names or street numbers from memory. Held items live in `_pending_w2.json`.
