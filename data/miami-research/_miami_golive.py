# Relink the Miami index card + CITIES.md row (run under the shared lock; edits only Miami's own markers/row).
import re
CARD='''    <!-- CARD:miami-fl -->
    <div class="city">
      <a class="cardmain" href="cities/miami.html">
        <p class="kicker">Growing edition · New-York-density build in progress</p>
        <p class="nm">Miami, Fort Lauderdale &amp; the Everglades</p>
        <p class="desc">Fort Lauderdale and Hollywood through Miami-Dade to Everglades, Biscayne and Big Cypress —
          Cuban sandwiches, croquetas and ventanita cafecito, the frita, stone crab, Haitian griot, every Michelin
          star and Bib, Art Deco South Beach, Little Havana, Wynwood and the Glades. Every pin sourced and placed.</p>
        <p class="stat">59 sights · 12 food on the map (166 researched) · updated 2026-10-02</p>
        <span class="go">Open the Miami guide →</span>
      </a>
      <div class="subrow">
        <a href="docs/SOURCES.md">how sources are vetted</a>
      </div>
    </div>
    <!-- /CARD:miami-fl -->'''
h=open('index.html').read()
h2,n=re.subn(r'    <!-- CARD:miami-fl -->.*?<!-- /CARD:miami-fl -->',lambda m:CARD,h,flags=re.S)
assert n==1; open('index.html','w').write(h2)
ROW="| Miami FL (+ Fort Lauderdale/Broward + Everglades & Biscayne NPs) | `cities/miami.html` | `data/miami.dataset.json` | `data/miami-research/` | 71 | **live (growing)** 2026-10-02 · 166 researched / 71 pinned (59 sights + 12 food); 9 areas (targets sum 500 in RESUME.md); 4 gates + validate + test green; 95 UNVERIFIED pins (mostly restaurants — WebSearch never surfaces their place pins) await tools/geocode-helper.html. Rebuild: `python3 tools/rebuild-city.py miami-fl --build`. |\n"
c=open('docs/CITIES.md').read()
lines=c.splitlines(True)
idx=[i for i,l in enumerate(lines) if l.startswith('| Miami FL')]
if idx: lines[idx[0]]=ROW
else:
    j=[i for i,l in enumerate(lines) if l.startswith('| Chicago IL')][0]; lines.insert(j+1,ROW)
open('docs/CITIES.md','w').write(''.join(lines)); print("ok")
