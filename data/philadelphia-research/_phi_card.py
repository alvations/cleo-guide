#!/usr/bin/env python3
# _phi_card.py SIGHTS_ON FOOD_ON SOURCED DATE NOTE — refresh ONLY the CARD:philadelphia-pa stat/desc tail + CITIES.md row counts.
# Run under the shared lock (re-reads the shared files inside it).
import sys, re
s_on, f_on, src, date, note = sys.argv[1:6]
p = "index.html"; h = open(p).read()
a, b = h.index("<!-- CARD:philadelphia-pa -->"), h.index("<!-- /CARD:philadelphia-pa -->")
card = h[a:b]
card = re.sub(r"\d+ places sourced; restaurant pins still being verified\.", f"{src} places sourced; restaurant pins still being verified.", card)
card = re.sub(r'<p class="stat">.*?</p>', f'<p class="stat">{s_on} sights · {f_on} food on the map ({src} sourced) · updated {date}</p>', card)
h = h[:a] + card + h[b:]; open(p, "w").write(h)
p = "docs/CITIES.md"; c = open(p).read()
c = re.sub(r"(\| `cities/philadelphia\.html` \| `data/philadelphia\.dataset\.json` \| `data/philadelphia-research/` \| )[^|]*\| [^|]*\|",
           lambda m: m.group(1) + f"{int(s_on)+int(f_on)} on page ({s_on} sights + {f_on} food) of {src} sourced | **live** {date} — {note} Continue from RESUME.md. Rebuild: `python3 tools/rebuild-city.py philadelphia-pa --build`. |", c, count=1)
open(p, "w").write(c); print("card + CITIES row refreshed")
