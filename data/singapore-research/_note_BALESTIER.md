# Balestier (BLS) — agent checkpoint + per-wave notes

Page: `Singapore/balestier.html` (slug `balestier`, area code `BLS`). Target: 55 (SG_POP floor) —
`python3 tools/density.py singapore --area BLS`. Pre-existing records on the page (other area codes, kept,
counted toward the page): Boon Tong Kee (Balestier) [SGWN], Founder Bak Kut Teh (Balestier) [SGWN].
Scope: Balestier Road, Whampoa, Moulmein, Jalan Kemaman, Zhongshan Park, Sun Yat Sen Nanyang Memorial Hall,
Balestier heritage trail, Whampoa Makan Place. NOT Thomson Road / Novena (NVN agent).

Files (BALESTIER tag only): FOOD_BALESTIER*.json, SIGHTS_BALESTIER*.json, SOURCES_BALESTIER*.json,
CREATORS_BALESTIER*.json, geo/_geoout_balestier_*.json, this note.

Continue: `python3 tools/density.py singapore --area BLS`;
`flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py singapore --build`

## In-flight wave
- (none running — W1 stopped early: session WebSearch cap hit, see below.)

## State
- 2026-10-02 start: 0 BLS records; 2 pre-existing SGWN records on the page.
- 2026-10-02 W1 (partial): **13 food** in FOOD_BALESTIER.json (t1=6, t2=6, t3=1; 0 closed), 0 sights.
  BLS = 13 + 2 pre-existing SGWN records on the page = 15 vs target 55 (NEED +40 counting pre-existing).
  **0 geocoded** — nothing new renders until a geocode wave lands. Page stays greyed (not in LIVE_SLUGS).

## W1 — 2026-10-02 — canon-first food (Balestier Road + Whampoa Makan Place)
**Canon named first:** bak kut teh (Founder, Kai Juan/Ah Hak, Balestier BKT 1966), Hainanese chicken rice (Boon
Tong Kee, Loy Kee), tau sar piah & old bakeries (Loong Fatt, Sing Hon Loong/Ghee Leong, Sweetlands), Whampoa
hawker canon (Hoover rojak, Hokkien mee, fish-head bee hoon, braised duck, lor mee, prawn mee).

**Searches run (22, WebSearch only):** Eatbook Balestier guide; SethLui Balestier; MTC/SethLui/Eatbook/TSL/
CityNomads/DFD/HGW/Women's Weekly Whampoa round-ups; Roots Balestier Food Trail; Michelin Bib Whampoa; Balestier
BKT list; Loy Kee; Bee Kia; Singapore Fried Hokkien Mee; Beach Road Fish Head Bee Hoon; Liang Zhao Ji; Loong Fatt.
**Stopped at search 23:** "this session has used its web search budget (200 of 200 WebSearch calls)" — the cap is
per SESSION (shared by all agents), not a rate limit; retried once, still refused. No fabrication to fill the gap.

**Kept (13, all >=2 credible or lone Michelin):** Loy Kee Best Chicken Rice (t1; TimeOut+Eatbook+HGW), Loong Fatt
Tau Sar Piah (t1; Roots/NHB+Eatbook+Traveller), Balestier Road Hoover Rojak (t1; Bib — SethLui+TimeOut+HGW+Eatbook),
Singapore Fried Hokkien Mee (t1; Bib 2023 — Eatbook+ieat+HGW), Beach Road Fish Head Bee Hoon (t1; Michelin Bib
2024/25 + SethLui+Eatbook+MTC), Bee Kia Seafood Restaurant (t2; Eatbook+ieat+MTC), Liang Zhao Ji Duck Rice (t2;
ieat+MTC+CityNomads+HGW), Huat Heng Fried Oyster (t2; HGW+Eatbook), China Whampoa Home Made Noodle (t2; WW+HGW),
Mat Noh & Rose Ginger Fried Chicken Rice (t2; SethLui+HGW), Amoy St Lor Mee (t2; TSL+DFD+CityNomads+HGW+SethLui),
Xin Heng Feng Guo Tiao Tan (t2; DFD 2025+HGW), Tanglin Halt A1 Carrot Cake (t3; SethLui+DFD).
Tiers graded within BLS: t1 = the area's defining chicken rice / tau sar piah / Michelin-Bib hawkers.

**HELD (single credible source or status unclear) — next wave must 2nd-source/status-check:**
- 545 Whampoa Prawn Noodles — Michelin-listed, WW+HGW, BUT SethLui headline places it "in Tekka Food Centre":
  possible relocation; status must be confirmed before adding.
- Kai Juan / Ah Hak Bak Kut Teh (395/397 Balestier Rd) — Roots food trail only (+Burpple/Lemon8/Yelp = 0).
- Balestier Bak Kut Teh (est. 1966, 365/369 Balestier Rd, 24h) — only an aggregator snippet.
- Tandoori Corner (Balestier Plaza), Sweetlands Confectionery, Sing Hon Loong (Ghee Leong) Bakery, Lam Yeo Coffee
  Powder Factory, Lotus Vegetarian, Haji Shaikh Vali Ahmad, Original Herbal Shop, Subway Niche — Roots/NHB Balestier
  Food Trail only so far (1 credible each).
- Golden Roast Char Siew, Three Bowls kolo mee (SethLui only); Robert Mee Siam, Nyonya Chendol, Yu Chu La Mian XLB,
  Hi Leskmi Nasi Lemak, Deep Fried Carrot Cake (HGW only); Guang Dong Xiao Shi laksa YTF (CityNomads only);
  Delisnacks (WW only); Hillview Steam Food (DFD only); Wheeler's Yard, Da Luca, Picolino, Viio Gastropub
  (Honeycombers/WW snippet only — status unverified).
- Out of scope: Ng Ah Sio BKT (Rangoon Road = Farrer Park). Zhongshan Mall eatbook guide not yet mined.
**Rejected sources:** see CREATORS_BALESTIER.json rejected[] (aggregators = 0; SEO listicles; personal blogs).
**Channel mix (W1):** editorial 13/13 places (Eatbook, SethLui, MTC, DFD, HGW, TimeOut, TSL, WW, CityNomads,
Traveller); institutional 2 (Michelin Bib for Beach Road FHBH; Roots/NHB for Loong Fatt); creator 3 attaches
(ieatishootipost); viral TikTok/YouTube 0 — not reached before the cap.
**Fact-check:** status from 2024-26 sources (Bib 2024/25, DFD Feb 2025, Loong Fatt review Jul 2026); every place
still needs a formal statuscheck in the geocode wave. Closures found: 0.

## NEXT (ordered)
1. When WebSearch is available again: geocode W1 (OneMap/Wikidata/Apple/Google !3d!4d place pins) ->
   geo/_geoout_balestier_w1.json; Whampoa Makan Place blocks 90/91 pin high from OneMap building records.
2. Sights wave (SIGHTS_BALESTIER.json): Sun Yat Sen Nanyang Memorial Hall (t1), Goh Chor Tua Pek Kong + wayang
   stage, Maha Sasana Ramsi Burmese Buddhist Temple, Balestier Market, Shaw/Jalan Ampas film studios, Balestier
   Heritage Trail shophouses, Whampoa dragon playground/fountain, Zhongshan Park.
3. Second-source the HELD list above; mine Zhongshan Mall + Moulmein + Jalan Kemaman; creator/viral pass.
4. Build under lock, gates, re-verify, go-live only when dense (>=55 incl. pre-existing) and gated.
