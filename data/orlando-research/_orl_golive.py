# Orlando go-live / refresh: rewrite ONLY the CARD:orlando-fl block in index.html and the Orlando row in docs/CITIES.md.
# Run under the shared lock. Counts are read from the built page.
import re, json, sys, os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
h=open(os.path.join(ROOT,'cities/orlando.html')).read()
np=h.split('const P = [')[1].split('\n];')[0].count('{t:'); nf=h.split('const F = [')[1].split('\n];')[0].count('{t:')
ds=json.load(open(os.path.join(ROOT,'data/orlando.dataset.json'))); nres=len(ds['P'])+len(ds['F'])
card=f'''<!-- CARD:orlando-fl -->
    <div class="city">
      <a class="cardmain" href="cities/orlando.html">
        <p class="kicker">First edition · growing</p>
        <p class="nm">Orlando &amp; Central Florida</p>
        <p class="desc">Walt Disney World and Universal ride by ride (each park its own filter, every pin on the
          attraction itself), SeaWorld's coasters, and the Orlando beyond them — the Michelin stars and Bibs, Mills 50's
          Vietnamese corridor, Winter Park's Tiffany chapel, Gatorland, the springs and the Space Coast. Restaurant pins
          still being verified.</p>
        <p class="stat">{np} sights · {nf} food on the map ({nres} researched) · updated 2026-10-03</p>
        <span class="go">Open the Orlando guide →</span>
      </a>
    </div>
    <!-- /CARD:orlando-fl -->'''
p=os.path.join(ROOT,'index.html'); s=open(p).read()
s2=re.sub(r'<!-- CARD:orlando-fl -->.*?<!-- /CARD:orlando-fl -->',card,s,flags=re.S)
assert s2!=s or card in s; open(p,'w').write(s2)
row=(f"| Orlando & Central Florida FL (WDW + Universal per park, Space Coast, springs) | `cities/orlando.html` | `data/orlando.dataset.json` | "
     f"`data/orlando-research/` | {np+nf} | LIVE 2026-10-02 (refreshed 2026-10-03) · {nres} researched ({np} sights + {nf} food pinned); 18 areas; theme-park attractions pinned "
     f"at their own Wikipedia/Wikidata/Coasterpedia coords; Michelin 2026 (20) + Mills 50 pho + park eats researched, most restaurant pins "
     f"UNVERIFIED for the geocode-helper. Rebuild: `python3 tools/rebuild-city.py orlando-fl --build`; continue from RESUME.md. |")
p=os.path.join(ROOT,'docs/CITIES.md'); c=open(p).read()
c2=re.sub(r'^\| Orlando & Central Florida FL.*$',row.replace('\\','\\\\'),c,count=1,flags=re.M)
assert c2!=c; open(p,'w').write(c2)
print("card+row:",np,nf,nres)
