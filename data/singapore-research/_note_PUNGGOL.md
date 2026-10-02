# Punggol (PGL): wave notes

## In-flight wave
None. W1 stopped early (see below). Next is W2, which needs WebSearch budget.

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
