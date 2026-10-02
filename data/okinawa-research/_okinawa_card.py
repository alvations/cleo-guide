# usage: python3 _okinawa_card.py TOTAL FOOD SIGHTS PINS "NEED text"
import re,sys
tot,food,sights,pins,need=sys.argv[1:6]
share=round(100*int(food)/int(tot))
p="Japan/index.html";s=open(p).read()
a=s.index('<!-- CARD:okinawa -->');b=s.index('<!-- /CARD:okinawa -->')
card=re.sub(r'<p class="stat">[^<]*</p>',f'<p class="stat">{tot} places researched ({food} food &amp; drink) · {pins} pinned so far · still being built</p>',s[a:b])
s=s[:a]+card+s[b:];open(p,"w").write(s)
p="docs/CITIES.md";s=open(p).read()
i=s.index("| Okinawa (JP) |");j=s.index("\n",i)
row=(f"| Okinawa (JP) | `cities/okinawa.html` (Japan hub — card still \"Being built\") | `data/okinawa.dataset.json` | `data/okinawa-research/` | {pins} | **being built** · W1–W4: **{tot} discovered** ({sights} sights + {food} food & drink = {share} % food; all ≥2-credible or lone UNESCO), **{pins} pinned**; restaurants mostly await the geocode-helper (search summaries rarely print restaurant GPS). 4 gates PASS. ANIME 6 (Nirai Kanai, Azama, Pokémon Center Okinawa, Sugar Road/Chura-san, Cape Chinen/Aquatope, Okitsura Gushikawa). 2 notable closures flagged (Ayagu, Ichigin). Per-area NEED: {need}. Continue from `data/okinawa-research/RESUME.md`. Rebuild: `python3 tools/rebuild-city.py okinawa --build`. |")
s=s[:i]+row+s[j:];open(p,"w").write(s)
print("card+row ->",tot,food,pins,share)
