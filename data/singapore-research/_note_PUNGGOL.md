# Punggol (PGL): wave notes

## In-flight wave
- **W4 (2026-10-03, PGL+NVN wave-3 relaunch session)** — files FOOD_PUNGGOL4.json, SIGHTS_PUNGGOL4.json, SOURCES_PUNGGOL4.json, CREATORS_PUNGGOL4.json, geo/_geoout_punggol_w5.json. Queries: 2nd-source the W3 held list (domain-restricted), Settlement/Tebing Lane status pass, Sumang/Edgefield/Punggol Field coffeeshops, Waterway Point/Punggol Plaza non-chain, creator pass, Punggol sights; NVN Goodwood Deli/Carousel/Mun Zuk; pin Punggol Coast HC / Settlement / Northshore.

## W1 (2026-10-02): discovery, cut short by the WebSearch budget
**Outcome.** 9 places discovered (5 food + 4 sights) against a target of ~93 (`python3 tools/density.py singapore --area PGL`).
Every place has at least 2 credible sources, or a lone MICHELIN.
**Geocoded: 0. Rendered: 0.** The page is NOT live.

**Why it stopped.** About 17 searches into the wave, this session hit its WebSearch cap of 200/200 calls. Every
agent in the session shares that cap. Further calls return "Web search was not performed". This is a hard cap,
not a rate limit, so backing off does not help.

WebSearch is the only allowed web channel, so with no budget left:
- discovery stops;
- geocoding is impossible, because no coordinates can come from memory (CLAUDE.md 4a/4b);
- the open/closed check is impossible (4c).

Nothing was fabricated to fill the gap.

**Searches run.** Roots/NHB Punggol heritage; Punggol Beach Massacre; Coney Island; the waterway bridges;
TheSmartLocal Punggol things to do; Honeycombers Punggol guide; Eatbook Punggol food guide; One Punggol HC
(SethLui / Her World / Eatbook); Kwang Kee Bib status; Punggol Coast HC opening coverage (SethLui / Eatbook /
Mothership / AsiaOne / Honeycombers / Time Out).

**Places contributed, by channel:**
- Institutional (MICHELIN, Roots/NHB, SG101, NParks): 3
- Editorial (SethLui, Eatbook, Her World, Mothership, AsiaOne, Honeycombers, Time Out, TheSmartLocal, Little Day Out, City Nomads): 9
- Notable travel (Wikipedia, Time Out): 3
- Viral creators: 0. The creator pass never ran.
- Local recommendation: 0

**KEPT**
- Food:
  - t1: Kwang Kee Teochew Fish Porridge (One Punggol), Singapore Fried Hokkien Mee (Punggol Coast)
  - t2: 99 South Buona Vista Braised Duck, Botak Cantonese Porridge (One Punggol), Lim Bo Rojak
- Sights:
  - t1: Coney Island Park, Punggol Beach Massacre Site
  - t2: Punggol Point Park
  - t3: Waterway Point

**DEDUP (already in the dataset under USG, not re-added).** Punggol Park, Kampong Lorong Buangkok, Lorong Halus
Wetland, Ponggol Nasi Lemak. The last originated in Punggol but is now in Tanjong Katong.

**HELD: only one credible source found, or merit/status not yet measured (W2 leads)**
- Matilda House (1902 Cashin house): Roots only. Needs a 2nd source (Wikipedia/URA).
- Punggol Heritage Trail (PDD): NParks only.
- Punggol Waterway Park, Sunrise Bridge, Jewel Bridge, Punggol Promenade Nature Walk, Punggol Point Jetty: TheSmartLocal only.
- Heritage Activation Node @ Punggol (NHB × OH! Open House): Roots only.
- One Punggol HC stalls:
  - No.25 Minced Meat Noodles (#02-28): SethLui only
  - Hi Leskmi Whampoa Nasi Lemak: Eatbook only
  - Souperb!: Eatbook only
- Punggol Coast HC, Michelin-Selected names (Hock Hai Curry Chicken Noodle, Pin Wei HK Chee Cheong Fun, Whampoa
  Traditional Fried Oyster): the summarised result did not show which outlet named them, so they are held rather
  than misattributed.
- Punggol Settlement and Tebing Lane:
  - Ponggol Seafood (since 1965) and Siam Square Mookata: Honeycombers 2018 only, status unknown.
  - Izakaya 95 and Whisk & Paddle: Honeycombers + Eatbook listicles. Merit not yet measured, status unchecked.
  - Fat Po and Frienzie: listicle only.
- Eatbook "30 best Punggol" leads to measure: JB Dai Tao Lala Pot, White Restaurant, Georges by the Bay, Keng Eng
  Kee Seafood (Punggol), Huang Hong Ji Porridge, Lao Jiang Superior Soup, Seoul Good, Tenderbest Makcik Tuckshop,
  Uncle Leong Seafood, Buddy Hoagies, Warabimochi Kamakura, Rise & Grind, Cat & The Fiddle, Three Little Coconuts,
  Anna's Sourdough, Nomstop, Maruhachi Donburi & Curry.
- Chains dropped as padding: Jollibee, Genki Sushi, Sushiro.

**Rejected sources.** See CREATORS_PUNGGOL.json `rejected[]`: gocity, getgo, greatdeals, mustsharenews,
recordowl, eatapp, TripAdvisor, hotelscombined, Oddle issuu.

**Addresses.** No coordinates were recorded. One Punggol and Punggol Coast stall addresses carry the stall no.
where a source printed it. Street names and postal codes are marked "to confirm at geocode" rather than filled in
from memory.

## W2 plan (to run once budget is available)
1. Confirm addresses and postal codes, then geocode via OneMap, Wikipedia or Wikidata through WebSearch:
   One Punggol HC, Punggol Coast HC, Coney Island west entrance, Punggol Point Park, Waterway Point.
   Also check status for the 9 kept places.
2. Second sources for the HELD sights above: Matilda House, Waterway Park, the bridges, the jetty, Heritage Trail,
   PDD/SIT campus, One Punggol, and the Punggol Regional Library.
3. Food canon by hawker centre: Oasis Terraces, One Punggol, Punggol Coast, Northshore Plaza, Punggol Plaza and
   the coffee shops. Cover chicken rice, Hokkien mee, CKT, bak chor mee, nasi lemak, prata, satay, laksa,
   kopi/kaya and zi char, using Michelin Bib/Selected, SethLui, Eatbook, DFD, MTC, ieat and Johor Kaki.
4. Creator pass: Food King (NOC), Ghib Ojisan, Exploding Belly, Eatbook/SethLui video, #punggolfood TikTok.

## W2 (2026-10-02 relaunch, 4-town session)
- **Outcome:** PGL 28 food + 7 sights = **35 / target ~93 -> NEED +58** (true count after the density.py fix); page renders 16 pins; greyed (not live).
- **Files:** FOOD_PUNGGOL2.json (23), SIGHTS_PUNGGOL2.json (3), SOURCES_PUNGGOL2.json, geo/_geoout_punggol_w2.json (13 pins: One Punggol via
  Wikipedia Punggol Regional Library coords, Waterway Point, Coney Island, Punggol Point Park, Matilda House), _w2c.json, _w3.json.
- **Added:** sights Matilda House (Wikipedia+URA), Punggol Waterway Park (NParks+HDB+TSL+SilverStreak; Wikipedia pin), Punggol Regional
  Library; One Punggol HC (No.25 Minced Meat, Eng Kee Wings, Souperb!, Zi Jia YTF, Uncle Penyet); Punggol Coast HC (Hock Hai, Whampoa
  Traditional Fried Oyster, Pin Wei CCF, Hakka Leipopo, Kedai Salima, Huay Kwang); Punggol Settlement/Tebing Lane (Izakaya 95, Whisk &
  Paddle, White Restaurant, Georges by the Bay, Uncle Leong, Ponggol Seafood — CLOSED 2 May 2024); Buddy Hoagies, Well Collective, Anna's
  Sourdough, Keng Eng Kee (SAFRA Punggol), Maruhachi, Huang Hong Ji.
- **Watch:** Timbre stops managing One Punggol HC in 2026 (Mothership Dec 2025) — re-check the One Punggol stall line-up.
- **UNVERIFIED (helper):** Punggol Coast HC building (84 Punggol Way S829911) + its stalls, The Punggol Settlement (3 Punggol Point Rd),
  Whisk & Paddle (10 Tebing Lane), Northshore Plaza, Edgefield Plains coffeeshops, SAFRA Punggol.
- **Held:** Seoul Good, Fat Po, Rise & Grind, Tenderbest Makcik Tuckshop, Cat & the Fiddle, Three Little Coconuts, Nomstop, Ju Hao,
  JB Dai Tao Lala Pot, Fei Mookata, Shitamachi Tendon Akimitsu, House of Seafood, Rong Hua BKT, Tam Chiak Kopitiam (blogger-owned),
  Punggol Digital District (Wikipedia-only), bridges (folded into Waterway Park), Punggol Promenade Nature Walk.
- **Next (+74):** Punggol needs ~2 more full sessions: Oasis Terraces / Waterway Point / Punggol Plaza / Northshore / Sumang & Edgefield
  coffeeshops (domain-filtered Eatbook/SethLui/DFD/MTC), Punggol Coast Mall (Eatbook 16 places), heritage (Punggol Heritage Trail, Lorong Buangkok
  is USG), Sengkang-edge excluded. Geocode Punggol Coast HC + Settlement via helper first (unlocks ~10 pins).

> **COUNT CORRECTION (2026-10-02, later the same session):** `tools/density.py` was fixed by another session (commit 4f706d7) to stop
> counting `sg_worklist.json` as food — the earlier W2 figures in this file were inflated by that double-count. **True counts after the
> fix: HLV 56/55 OK (live) · BLS 55/55 OK (go-live held for pins) · NVN 35/55 (NEED +20) · PGL 35/93 (NEED +58).**

- **FINAL (end of session): HLV 57/55 OK (LIVE) · BLS 56/55 OK (go-live held for pins) · NVN 37/55 (NEED +18) · PGL 35/93 (NEED +58).** Late adds: NVN Baan Ying, Banelé; BLS Niu Dian (VIIO @ Balestier); HLV Niu Dian (HV).

## W3 (2026-10-03, PGL+NVN session) — batch 1+2
- **Outcome:** PGL 37 food + 13 sights = **50 / ~93 → NEED +43** (was 35). Page renders **23** pins (was 16); greyed (not live).
- **Files:** FOOD_PUNGGOL3.json (9), SIGHTS_PUNGGOL3.json (6), SOURCES_PUNGGOL3.json (ARCHNET, ARCHITIZER, JTC, MONOCLE, DEZEEN, DESIGNBOOM, VULCANPOST, TWOBEARBEAR), CREATORS_PUNGGOL3.json, geo/_geoout_punggol_w4.json.
- **Added food:** Lao Jiang Superior Soup + Rise & Grind (Oasis Terraces, pinned), Rendang Nation (One Punggol, pinned); Punggol Coast HC: Jade's Chicken, 75 Ah Balling, One Soy, You Fu Ban Mian, What The Puff! (UNVERIFIED — building pin); Sixth Floor Oyster Cake — **CLOSED** after 28 Sep 2025 (Seth Lui).
- **Added sights:** Masjid Al-Islah (Wikipedia pin, MUIS address), Punggol Digital District / SIT campus (Wikipedia pin), Oasis Terraces (Wikipedia pin), Punggol Point Jetty (park pin, med), Punggol Promenade + Punggol Heritage Trail (linear — UNVERIFIED).
- **Held (1 credible source / status unknown):** Selera Sumang Nasi Padang + Satay Sumang (Seth Lui only, 2021), Tuck Shop (One Punggol drinks), Downstairs (Northshore; chain), Xiang Chi Mian, SJ Sickander Ammal (no named dish), Hee Hee Hee Steamed Fish (7th branch = chain), Seoul Good / Ju Hao (Eatbook only), Fei Mookata, Siam Square Mookata, JB Dai Tao Lala Hotpot, Ah Dong Teh House (2015–18 sources, status unconfirmed), Shitamachi Tendon Akimitsu (Waterway Point; 2018, status unknown), HK Street Chun Tat Kee (chain; blog only), Gallop Stable Punggol Ranch (location may be USG-side), Chai O'Clock (pasar-malam pop-up — not a place).
- **Dropped:** Punggol Coast Mall chains (Din Tai Fung, Paradise Hotpot, Sushi-GO, Ya Kun, Jollibee, Playmade, Shihlin) = padding; Tenderbest Makcik (Punggol Park = USG); Punggol Noodles (Hainanese Village = Hougang/USG); St Anne's Church (Lorong Buangkok = USG).
- **Geocode blocker:** Punggol Coast HC (84 Punggol Way S829911), The Punggol Settlement, Northshore Plaza have NO published place pin WebSearch can read → 16+ PGL records wait on tools/geocode-helper.html. This is the single biggest lever for rendered density.

### W3 close (2026-10-03)
- **Final:** PGL 37 food + 13 sights = **50 / ~93 (NEED +43)**; food share 74%; **24 pinned** on punggol.html (was 16).
- **Attribution correction (same session, before publish):** 75 Ah Balling, One Soy and You Fu Ban Mian were first filed with a second source (Honeycombers / 2bearbear) inferred from co-surfacing search results; domain-restricted re-checks showed Honeycombers' 12-stall list does NOT include them and 2bearbear's page could not be confirmed to name them → **removed and re-HELD** (Women's Weekly / Seth Lui only). Lesson: confirm each second source with an `allowed_domains` query before filing.
- **Added late:** Hee Hee Hee Steamed Fish, SJ Sickander Ammal (Honeycombers 12 + WW / Time Out / Little Day Out), Warabimochi Kamakura café (Waterway Point; Time Out + Mothership + Eatbook; pinned).
- **More held:** Dosa Delights, Xiang Chi Mian (attribution unconfirmed), 218 Centre Hokkien Mee (MTC + blog, 2017, status unknown), Fat Po (2018–19 sources, status unknown), Siam Square Mookata / House of Seafood (status unknown; note DFD prints the Settlement as 500 Punggol Point Rd vs 3 Punggol Point Rd elsewhere — resolve at helper), NomStop (Eatbook + SIT alumni page only), Hwa Heng Beef Noodle Waterway Point branch (Seth Lui: weaker than the original — dropped).
- **Next wave plan (PGL +43):** (1) helper-pin Punggol Coast HC → +11 pins immediately; (2) status pass on the Settlement/Tebing Lane held list (Siam Square, House of Seafood, Fat Po, Ah Dong, JB Dai Tao) via each place's own socials/2025 coverage; (3) domain-restricted 2nd-sourcing of held hawkers (Ah Balling, One Soy, You Fu, Xiang Chi Mian, Dosa Delights, Rendang-style Malay stalls); (4) Sumang/Edgefield/Punggol Field coffeeshops via MTC/DFD/ieat domain queries; (5) Punggol Plaza + Punggol Coast Mall non-chain picks.

## W4 (2026-10-03, PGL+NVN wave-3 relaunch session) — batch 1
- **Outcome so far:** PGL 42 food + 16 sights = **58 / ~93 (NEED +35)**; page **25 pinned** (P12 F13; was 24).
- **Files:** FOOD_PUNGGOL4.json, SIGHTS_PUNGGOL4.json, SOURCES_PUNGGOL4.json (SASSYMAMA, RTF), geo/_geoout_punggol_w5.json.
- **Added food:** 219 Sarawak Kolo Mee (Edgefield Plains; Seth Lui + Eatbook), Fat Po (Tebing Lane; DFD + Eatbook + Seth Lui + MTC — status confirmed by Eatbook's current 30-best list), Seoul Good (container park; Eatbook + TSL + Honeycombers), House of Seafood (Settlement; Honeycombers + TSL; open per official site + 2026 reviews), Downstairs (Northshore; Eatbook Northshore guide + DFD Punggol cafés — 2-outlet homegrown brand, not a padding chain).
- **Added sights:** Punggol East Container Park (TSL + DFD + Little Day Out + Sassy Mama), Treelodge@Punggol (Wikipedia + HDB; Wikipedia estate pin, med), Punggol Waterway Terraces (designboom + RTF award; UNVERIFIED pin).
- **Status checks:** Botak Cantonese Porridge — founders retired 2024 (Mothership) but the business continues under 2nd-gen Lim Hwee Yi (Eatbook) → stays open. House of Seafood open (official site lists Punggol).
- **Held (1 credible source / status unknown):** Ah Huat Hokkien Prawn Mee (Foodgle, 308C Punggol Walk; Seth Lui ×2 + Yahoo syndication = one voice), Wong Kee Claypot Rice (Eatbook only), Selera Sumang Nasi Padang (Seth Lui review + Seth Lui 2021 rewind = one voice), Ju Hao (Eatbook ×2 + singaporefoodie.com — unvetted), Sugartown (Eatbook + DFD + Seth Lui but all 2021–22; no current status), Staple by Qiji (Seth Lui + Honeycombers; status unknown — a 'Daily Staples' now at Northshore), You Fu Ban Mian (Seth Lui list confirmed; WW not confirmed by domain query), 75 Ah Balling + One Soy (WW confirmed; 2nd outlet not found), Happy Lok Lok (TSL only confirmed), Siam Square Mookata (status unknown), Leong Ji Kitchen (moved to Waterway Sunrise; 2bearbear + Ranting Panda blogs only), Min Xiang Ge Putian, Dai Lou, Buey Tahan See-Food (Seth Lui only), Woke by Wake The Crew (HGW only), BYD by 1826 (AsiaOne only).
- **Dropped:** Slappy Cakes / Blackball / Gram Café (chains = padding); Settlement 2015-era list (Just The Place, Cravings, Trunk at Bay, Wayne's Chill Out, Fur Kicks — MTC 2015 / Eatbook hidden-gems, no current status).
- **Creator pass:** "Punggol food youtube/TikTok" + Ghib Ojisan / Food King → no findable Punggol video from a vetted creator (one anonymous YouTube "Finding the best food in Punggol" rejected).
- **Geocode:** Punggol Coast HC still has no readable place pin (Apple Maps place exists, coords not exposed; JTC stall-list PDF has no coords) → stays UNVERIFIED.
