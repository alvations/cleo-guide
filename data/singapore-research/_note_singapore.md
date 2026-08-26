# Rest-of-Singapore discovery pass (SGC / SGE / SGWN) — DISCOVERY agent note

Scope: everything in Singapore EXCEPT Toa Payoh (TPY, covered by another agent).
WebSearch only (WebFetch blocked). NO coordinates — addresses only; geocoding is a later stage.
cz cuisine tags name the KITCHEN's tradition, never a single shared dish.

## Files emitted (all in data/singapore-research/)
- `FOOD_SGC.json` (31), `FOOD_SGE.json` (14), `FOOD_SGWN.json` (15) — **60 food total**
- `SIGHTS_SINGAPORE.json` — **32 sights** (SGC 18, SGE 5, SGWN 9) + embedded sights `sources` registry
- `SOURCES_SGC.json` / `SOURCES_SGE.json` / `SOURCES_SGWN.json` — outlet registries used per cluster
- `CREATORS_SGC.json` / `CREATORS_SGE.json` / `CREATORS_SGWN.json` — vetted creators, attachments, rejected SEO farms

## Counts by area + tier
### FOOD (60)
| Area | t1 | t2 | t3 | total |
|---|---|---|---|---|
| SGC | 8 | 20 | 3 | 31 |
| SGE | 5 | 9 | 0 | 14 |
| SGWN | 5 | 8 | 2 | 15 |

### SIGHTS (32)
| Area | t1 | t2 | t3 | total |
|---|---|---|---|---|
| SGC | 7 | 11 | 0 | 18 |
| SGE | 2 | 2 | 1 | 5 |
| SGWN | 6 | 2 | 1 | 9 |

Every area has ≥1 tier-1 must-see (food and sights). Canon coverage across the 3 areas:
chicken rice (Tian Tian, Ah Tai, Wee Nam Kee, Boon Tong Kee, Margaret Drive Sin Kee), laksa (Sungei Rd
Trishaw, 328 Katong, Depot Rd Zhen Shan Mei), char kway teow (Hill Street/Bedok, Lao Fu Zi), Hokkien mee
(Nam Sing), bak chor mee (Tai Hwa 1★, Tai Wah), wanton mee (Ji Ji, Kok Kee, Fei Fei, Long Kee), prawn
noodle (Wah Kee), bak kut teh (Song Fa, Founder, Sin Heng claypot), roti prata (Springleaf, Mr & Mrs
Mohgan), nasi lemak (Selera Rasa, Kitchenman, Boon Lay Power), nasi padang (Hjh Maimunah), chilli crab
(Jumbo), black pepper crab (Eng Seng — CLOSED), fish head curry (Muthu's), satay (Lau Pa Sat 7&8, Haron),
Peranakan (Candlenut 1★, Guan Hoe Soon), chendol (Old Amoy), kaya toast (Ya Kun, Tong Ah, Chin Mee Chin),
biryani (Allauddin's), murtabak (Zam Zam), thosai (Komala Vilas), carrot cake (He Zhong, Fu Ming), char
siew (Roast Paradise, Foong Kee, Fatty Cheong), Hainanese curry rice (Beach Rd Scissors, Loo's), kway chap
(To-Ricos), oyster omelette (Hup Kee), fishball noodle (Li Xin), chwee kueh (Jian Bo), popiah (Kway Guan
Huat), fish porridge (Song Kee), beef kway teow (Lor 9), + fine dining (Odette 3★, Burnt Ends 1★).

## Source keys (key → name → representative URL)
MICHELIN → MICHELIN Guide Singapore (stars/Bib; lone-authority OK) → https://guide.michelin.com/sg/en
EATBOOK → Eatbook.sg → https://eatbook.sg/
SETHLUI → Seth Lui → https://sethlui.com/
DFD → Daniel Food Diary → https://danielfooddiary.com/
MTC → Miss Tam Chiak → https://www.misstamchiak.com/
HGW → HungryGoWhere → https://hungrygowhere.com/
TIMEOUT → Time Out Singapore → https://www.timeout.com/singapore
HERWORLD → Her World (SPH) → https://www.herworld.com/
WOMENSWEEKLY → The Singapore Women's Weekly (SPH) → https://www.womensweekly.com.sg/
ASIAONE → AsiaOne (SPH) → https://www.asiaone.com/
HONEYCOMBERS → The Honeycombers / HoneyKids → https://thehoneycombers.com/singapore/
TATLER → Tatler Asia → https://www.tatlerasia.com/
SCMP → South China Morning Post (major press) → https://www.scmp.com/
VICE → VICE (major press) → https://www.vice.com/
IEAT → ieatishootipost / Dr Leslie Tay (vetted authority-creator) → https://ieatishootipost.sg/
CHINATOWNSG → Chinatown Singapore precinct (STB-supported) → https://chinatown.sg/
VISITSG → Visit Singapore (STB, official) → https://www.visitsingapore.com/
ROOTS → Roots.gov.sg (NHB, official) → https://www.roots.gov.sg/
NPARKS → NParks (official) → https://www.nparks.gov.sg/
UNESCO → UNESCO World Heritage Centre → https://whc.unesco.org/
MANDAI → Mandai Wildlife Reserve (official) → https://www.mandai.com/
MBS → Marina Bay Sands (official) → https://www.marinabaysands.com/
CHANGI → Changi Airport (official) → https://www.changiairport.com/
NHB → National Heritage Board (museums) → https://www.nhb.gov.sg/
NLB → NLB Singapore Infopedia → https://www.nlb.gov.sg/
CHNC → Chinatown Heritage Centre (official) → https://www.chinatownheritagecentre.com.sg/
WIKI → Wikipedia (cross-check/notability only) → https://en.wikipedia.org/
JOHORKAKI → Johor Kaki blog (supporting only; Eng Seng closure) → https://johorkaki.blogspot.com/

Every FOOD place has ≥2 credible sources OR a lone institutional authority (MICHELIN star/Bib).
Every SIGHT has ≥2 official/credible sources OR a lone institutional authority (UNESCO / NHB National
Monument / official body). Yelp/TripAdvisor/OpenTable/Google/Burpple were used for MEASURE/fact-check only
and count ZERO toward the two.

## MEASURED & DROPPED (a mention is not merit)
- **Victory Restaurant** (murtabak, Kampong Glam) — measured (103 yrs, ieatishootipost feature). DROPPED:
  near-identical neighbour of Zam Zam (kept the more famous Zam Zam). Strong candidate if more depth wanted.
- **No Signboard Seafood** (chilli crab, Geylang) — measured (Time Out; eggy Peranakan-style sauce). DROPPED:
  chilli-crab canon already anchored by Jumbo (t1). Candidate to add for SGE seafood depth.
- **Sin Ming Roti Prata** (Upper Thomson) — measured (Seth Lui, Eatbook; coin prata). DROPPED: prata canon
  covered by Springleaf in the same area — avoid padding.
- **Tim Ho Wan** (dim sum) — measured (ex-1★, casual chain). DROPPED: dim sum covered by Swee Choon; global
  chain, less city-unique.
- **Les Amis / Zén** (both 3★) — measured. Kept **Odette** (3★) as the single SGC fine-dining t1 anchor to
  avoid stacking four fine-dining rooms.
- **Huat Heng Fried Oyster** (Whampoa, Michelin Plate) — measured. Kept **Hup Kee** (Newton, Bib) for orh luak.
- **Whitley Road Big Prawn Noodle** (Old Airport Rd, Michelin rec) — measured. Kept **Wah Kee** (SGC) to avoid
  a 3rd Old Airport Road stall in one cluster.
- **Ponggol Nasi Lemak** — measured (since 1979). Not added: nasi lemak already covered ×3; north location
  ambiguous.

## Closures / status flags (2025/2026 verified)
- **Eng Seng Restaurant** (black pepper crab, 247 Joo Chiat Place) — **CLOSED**: premises sold for ~S$8.5m,
  original shophouse shut **Aug 2025**; crew (incl. Uncle Tan) relocated to **9007 Tampines** industrial
  canteen. KEPT FLAGGED as `"— CLOSED"` (notable heritage closure). *Discovery sourcing weak (JohorKaki
  documents the move) — needs a stronger 2nd credible at the gate.*
- **Hawker Chan** — original Chinatown Complex stall LOST its Michelin star in 2021; the **78 Smith St**
  branch retains a **Bib Gourmand** (that is the entry used). Not a closure.
- **Chin Mee Chin** — closed 2018, **reopened 2021** (Ebb & Flow Group); currently OPEN, now 101 years old.
- **Jumbo Seafood East Coast** — East Coast Seafood Centre is up for redevelopment; used the **Riverside
  Point** outlet (open) as the entry.

## Verify-before-publish flags (transparency for the sourcecheck gate)
- **Old Amoy Chendol** (SGC, t3) — rests on IEAT (verified authority-creator) + Chinatown precinct listing;
  add one more top-tier editorial (Eatbook/Time Out) before publishing to be safely ≥2 editorial.
- **Komala Vilas** (SGC, t3) — SETHLUI + VISITSG; heritage merit (since 1947) is strong, but VISITSG is
  official-tourism rather than an editorial recommender.
- **Allauddin's Briyani** (SGC, t2) — HONEYCOMBERS + "Michelin recognition"; confirm the exact Michelin
  listing (Selected vs Bib) at the gate.
- **Guan Hoe Soon** (SGE, t1) — ASIAONE + ROOTS; heritage merit (oldest Peranakan, 1953) strong.
- **Eng Seng** — see Closures above.

## Notes for the build
- NO coordinates written anywhere (discovery only).
- No duplicates introduced across clusters; Toa Payoh (TPY) deliberately untouched.
- cz tags key on the kitchen's tradition. No SG/MY Nyonya hybrids were added that require dual SG+MY tags in
  this pass; if Nonya/Kopitiam/Taste Good-type hybrids are added later, tag on cuisine, never on a dish.
- Shared files (data/sources.json, data/geocodes.json, tools/*, the dataset) were NOT edited.
