import re
p="docs/AGENT-PROMPTS.md";s=open(p).read()
if "Okinawa | W3" not in s:
    k=s.index("| 2026-10-02 | Okinawa | W2 relaunch"); e=s.index("\n",k)
    row="\n| 2026-10-02 | Okinawa | W3 — §2b food & drink first + ANIME (lead ~120 searches + 2 bg geocoders 70) | Rurubu ↔ Mapple list pairs, Okinawa Times 2023 soba poll ↔ Okinawa Traveler, prefecture Ryukyu-cuisine certification, KozaWeb, Stripes; ANIME via Ryukyu Shimpo (Anime Tourism 88 / Aquatope) + Pokémon official | +67 (186 researched: 85 food = 46 %, was 22 %; 89 pinned) | 5 geocoder coords rejected (unattributed summary GPS); restaurant GPS essentially unfindable via search (1/50) → helper; ~60 single-source leads held | FOOD/SIGHTS/SOURCES_OKINAWA_W3, geo/_geoout_okinawa_W3{,G,R}, _okinawa_w3_notes.md |"
    s=s[:e]+row+s[e:]; open(p,"w").write(s)
p="docs/RESEARCH-LOG.md";s=open(p).read()
if "Okinawa W3 (food & drink first)" not in s:
    s+=("\n\n## 2026-10-02 — Okinawa W3 (food & drink first)\n"
    "- **Best yield for Japanese regional food:** pair the two big guidebook webs — Rurubu (るるぶ&more, JTB) list articles and Mapple (まっぷる) list/spot pages — each list search returns 4–8 names with addresses; a search on the other domain confirms 2–4 of them. Okinawa Traveler (Rikka Docca editors) features and the prefecture's 「琉球料理が味わえる店」 certification list add independent channels.\n"
    "- **Restaurant pins are not findable via WebSearch summaries** (geocoder pass: 1 of 50) — Stars and Stripes prints GPS in the article body, but summaries rarely surface it; leave restaurants UNVERIFIED for tools/geocode-helper.html and record the Stripes article URLs in the notes for the helper.\n"
    "- **Reject summary coordinates without a citable page** — 5 of 12 geocoder hits were dropped for this; also re-check citation URLs before commit (one draft pointed a rurubu URL at the wrong shop).\n")
    open(p,"w").write(s)
p="Japan/index.html";s=open(p).read()
s=re.sub(r'<p class="stat">\d+ places researched[^<]*</p>','<p class="stat">186 places researched (85 food &amp; drink) · 89 pinned so far · still being built</p>',s,count=1) if s.index('CARD:okinawa')<s.find('<p class="stat">',s.index('CARD:okinawa'))<s.index('/CARD:okinawa') else s
# ensure only within okinawa card
a=s.index('<!-- CARD:okinawa -->');b=s.index('<!-- /CARD:okinawa -->')
card=s[a:b]; card=re.sub(r'<p class="stat">[^<]*</p>','<p class="stat">186 places researched (85 food &amp; drink) · 89 pinned so far · still being built</p>',card)
s=s[:a]+card+s[b:]; open(p,"w").write(s)
p="docs/CITIES.md";s=open(p).read()
i=s.index("| Okinawa (JP) |"); j=s.index("\n",i)
row="| Okinawa (JP) | `cities/okinawa.html` (Japan hub — card still \"Being built\") | `data/okinawa.dataset.json` | `data/okinawa-research/` | 89 | **being built** · W1–W3: **186 discovered** (101 sights + 85 food & drink = 46 % food; all ≥2-credible or lone UNESCO), **89 pinned**; restaurants mostly await the geocode-helper (search summaries rarely print restaurant GPS). 4 gates PASS. ANIME 3 (Nirai Kanai, Azama, Pokémon Center Okinawa). Per-area NEED: NAHA +83, CHUBU +64, HOKBU +54, NANBU +38, YAEYA +39, MYK +27, KRM +19. Continue from `data/okinawa-research/RESUME.md`. Rebuild: `python3 tools/rebuild-city.py okinawa --build`. |"
s=s[:i]+row+s[j:]; open(p,"w").write(s)
print("docs updated")
