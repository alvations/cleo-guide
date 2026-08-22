#!/usr/bin/env python3
# find-sources.py — the reusable SOURCE-DISCOVERY planner.
#
# The registry is only as good as the sources feeding it. A city-name-only search misses whole seams:
# the local critic of record, the city magazine's cuisine best-of, the "Where the Ambassador of X eats"
# series, diaspora/community media, awards bodies, and verified creators. This tool emits the canonical
# batch of WebSearch queries + the credible source TYPES to sweep, so every agent runs the SAME systematic
# discovery instead of improvising — for a city, a cuisine, a seed place, or a creator pass.
#
# It also reads data/sources.json to show which sources the city ALREADY has, so you expand the gaps.
#
#   python3 tools/find-sources.py "Washington, DC"                       # city-wide food+sights source sweep
#   python3 tools/find-sources.py "Washington, DC" --cuisine "Vietnamese"  # one cuisine's credible + community sources
#   python3 tools/find-sources.py "Washington, DC" --seed "Mama Chang"     # reverse-find who credibly cites a place
#   python3 tools/find-sources.py "Washington, DC" --creators              # verified-creator discovery + vetting
#   python3 tools/find-sources.py "Washington, DC" --key washington-dc     # also print the registry's current sources
#
# Every query uses <city>/<cuisine>/<place>/<community> as fillable slots, so the method carries to any
# city unchanged. Output is a plan you run with WebSearch; record winners in data/sources.json with a
# `credible` rationale (see docs/SOURCES.md). Yelp/TripAdvisor are open-verification only — never a recommender.
import sys, os, json, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_registry_city(key):
    try:
        s = json.load(open(os.path.join(ROOT, "data", "sources.json"), encoding="utf-8"))
        return s["cities"].get(key)
    except Exception:
        return None

# The credible source TYPES to hunt for — the spine of any city's food+sights palette.
SOURCE_TYPES = [
    ("Institutional authority", "Michelin (guide/star/Bib), James Beard (win/semifinalist), NPS, Smithsonian/UNESCO — a lone one is sufficient ground truth."),
    ("Critic of record", "the metro daily's named restaurant critic (e.g. a Sietsema/Carman/Bauer figure) — search the person, not just the paper."),
    ("City magazine best-of", "the regional glossy's annual '100 Very Best' / 'Best of <City>' + its cuisine-by-cuisine guides."),
    ("Digital food desk", "Eater <city> essential/heatmap maps; The Infatuation; national desks (NYT/Bon Appetit/Esquire best-new) as corroboration."),
    ("Diaspora / community media", "the ethnic-community outlet a cuisine's own diners read (e.g. a Vietnamese/Korean/Asian-American paper) — authentic, credible for that cuisine."),
    ("'Where X eats' / celebrity-guide", "the city mag's 'Where the Ambassador of <country> eats' / 'where chefs eat' series — authentic pointers to non-touristy ethnic spots."),
    ("Awards / votes", "James Beard, Michelin, the local restaurant-association awards (a 'RAMMY'-type), reader 'Best of' polls."),
    ("Verified creators", "YouTubers/TikTokers/bloggers with a REAL following, a real <city>/cuisine beat, and a FINDABLE piece of content — corroboration, not lone authority."),
    ("Local news (suburbs)", "neighborhood/suburban news sites + weeklies for openings/closings and community spots the core-city search misses."),
    ("CVB / official / tourism", "the destination-marketing org + the place's own site — vetted listings + the primary factual record for address/hours/status."),
    ("Encyclopedic / rankings", "Wikipedia (published coords + long-tail indexes), Tripadvisor/US News/PlanetWare rankings — measure popularity, never a lone recommender."),
]

def city_food_queries(city):
    return [
        f'best restaurants {city} {city} magazine 100 very best',
        f'{city} restaurant critic review site:washingtonpost.com OR named critic best new restaurants',
        f'Eater {city} essential restaurants map',
        f'The Infatuation {city} best restaurants',
        f'Michelin guide {city} stars bib gourmand',
        f'James Beard award winners semifinalists {city}',
        f'{city} restaurant association awards best of {city} winners',
        f'where the ambassador of eats {city} washingtonian OR city magazine',
        f'where chefs eat {city} favorite restaurants',
        f'best cheap eats {city} $20 diner immigrant food',
    ]

def cuisine_queries(city, cuisine):
    c = cuisine
    return [
        f'best {c} restaurants {city} {city} magazine',
        f'Eater {city} best {c} essential',
        f'{c} {city} Washington Post OR critic review',
        f'best {c} food {city} Northern Virginia OR suburbs guide',
        f'{c} community {city} where to eat authentic diaspora',
        f'{c} newspaper OR community media {city} restaurant guide',
        f'"{c}" {city} James Beard OR Michelin',
        f'{c} {city} tiktok OR youtube viral best',
        f'most authentic {c} restaurant {city} reddit OR local forum',
        f'Tyler Cowen ethnic dining guide {c} {city}',   # metro-specific critic-guides carry to other cities' equivalents
    ]

def seed_queries(city, seed):
    p = seed
    return [
        f'"{p}" {city} review',
        f'"{p}" {city} Washington Post OR Eater OR city magazine',
        f'"{p}" {city} Michelin OR James Beard OR best new restaurant',
        f'"{p}" {city} tiktok viral',
        f'"{p}" {city} youtube review',
        f'"{p}" {city} instagram food blogger',
        f'"{p}" owner chef {city} interview story',
        f'"{p}" {city} address hours open 2026',            # fact-check open/closed
        f'where does {p} chef eat OR sibling restaurants {city}',  # find merit-worthy related places
    ]

def creator_queries(city):
    return [
        f'best {city} food youtuber channel restaurants',
        f'{city} food tiktok creator viral restaurants',
        f'{city} food blogger instagram DMV eats',
        f'{city} food influencer followers restaurant reviews',
        f'"{city}" food creator featured on Washingtonian OR Eater OR local TV',   # vet: has real press acknowledged them?
        f'<creator handle> followers count subscribers',                            # vet each candidate's real scale
        f'<creator handle> {city} restaurant video',                                # vet: a findable piece of content
    ]

def sec(title): return "\n" + "=" * 78 + f"\n{title}\n" + "=" * 78

def main():
    ap = argparse.ArgumentParser(description="Emit the canonical source-discovery query plan for a city/cuisine/seed.")
    ap.add_argument("city", help='City or region, e.g. "Washington, DC"')
    ap.add_argument("--cuisine", help='Focus one cuisine, e.g. "Vietnamese"')
    ap.add_argument("--seed", help='Reverse-find who credibly cites a named place, e.g. "Mama Chang"')
    ap.add_argument("--creators", action="store_true", help="Add the verified-creator discovery + vetting queries")
    ap.add_argument("--key", help="City key in data/sources.json to print current registered sources, e.g. washington-dc")
    a = ap.parse_args()
    city = a.city

    print(sec(f"SOURCE-DISCOVERY PLAN — {city}"))
    print("Run each line with WebSearch. Record winners in data/sources.json with a `credible` rationale.")
    print("Bar: >=2 credible per place (or a lone Michelin/JB/NPS/Smithsonian). Yelp/TripAdvisor/Google = 0.")
    print("A mention is not merit — MEASURE acclaim before adding (docs/SOURCES.md 'Merit bar').")

    print(sec("SOURCE TYPES to hunt for (sweep for each; label the `credible` rationale honestly)"))
    for name, desc in SOURCE_TYPES:
        print(f"  • {name}: {desc}")

    if a.seed:
        print(sec(f"SEED-PLACE reverse-source discovery — \"{a.seed}\""))
        print("Find WHO credibly cites this place (critics, community media, verified creators), then run the")
        print("normal flow. Register creators in CREATORS_<tag>.json; put the place(s) in FOOD_<tag>.json.")
        for q in seed_queries(city, a.seed): print(f"  ?  {q}")

    if a.cuisine:
        print(sec(f"CUISINE source discovery — {a.cuisine}"))
        print("Pull the credible editorial AND the authentic community/diaspora source for this cuisine.")
        for q in cuisine_queries(city, a.cuisine): print(f"  ?  {q}")
    else:
        print(sec("CITY-WIDE food source discovery"))
        for q in city_food_queries(city): print(f"  ?  {q}")

    if a.creators:
        print(sec("VERIFIED-CREATOR discovery + vetting"))
        print("A creator qualifies only with a REAL following, a real beat, and a FINDABLE piece of content.")
        print("Vet each candidate (the last two templates) before registering; a lone creator is NOT authority.")
        for q in creator_queries(city): print(f"  ?  {q}")

    if a.key:
        c = load_registry_city(a.key)
        print(sec(f"ALREADY REGISTERED for {a.key} (expand the GAPS, don't re-add)"))
        if not c:
            print(f"  (no city '{a.key}' in data/sources.json yet)")
        else:
            srcs = c.get("sources", []); crs = c.get("creators", [])
            print(f"  {len(srcs)} sources: " + ", ".join(sorted(x.get("key", "?") for x in srcs)))
            if crs:
                print(f"  {len(crs)} creators: " + ", ".join(sorted(x.get("key", "?") for x in crs)))

    print(sec("AFTER discovery"))
    print("  1. Register winners in data/sources.json (key,name,type,rank,verified,credible).")
    print("  2. Vetted creators -> CREATORS_<tag>.json ; run: python3 tools/merge-creators.py <city-key>")
    print("  3. New places -> a FOOD_<tag>.json research file (>=2 credible, merit-measured, NO coords).")
    print("  4. consolidate -> --sourcecheck -> geocode -> --geocheck/--statuscheck -> build -> --buildcheck.")
    print("  5. Log the pass in that city's AUDIT.md. See docs/SOURCES.md.\n")

if __name__ == "__main__":
    main()
