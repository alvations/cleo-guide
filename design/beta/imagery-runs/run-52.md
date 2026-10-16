# Imagery run #52 — review

`all` scope at budget 1200, Actions run 38918569922, committed e5584852 (2026-10-16), on 15bf5685. Reviewed by the imagery lane from a contact sheet of the committed 500 w files.

**9 new rows; 2 of them were a bug.** Gotoku-ji and the Cleveland Museum of Art came back with the very files refused after run #48. Each file also had an earlier *vetted* line in `manifest/cands.tsv`, and `build_manifest.py` kept the first line per file, so the refusal never reached the manifest. Fixed: a later refusal now wins, and a test checks that every refusal in cands.tsv reaches the manifest. Both rows were removed again. No other refusal had been lost.

**Yield is now low.** 236 targets were tried and 9 were stored: the article lead images are used up. More coverage needs vetted candidates (Commons file titles found by search, then vetted), not more `all` runs.

```
  chicago#national-a-philip-randolph-pullman-porter-museum ← Pullman Chicago Clock Tower.jpg | National A. Philip Randolph Pullman Porter Museum  ⚠ ? the Pullman factory clock tower — the museum is a separate building nearby (wrong subject?)
  singapore/toa-payoh#lian-shan-shuang-lin-monastery ← Lian Shan Shuang Lin Monastery 蓮山雙林禪寺 (2025) - img 09.jpg | Lian Shan Shuang Lin Monastery
  singapore/toa-payoh#toa-payoh-dragon-playground ← Original "Toa Payoh Dragon Playground", Singapore (2025) - img 09.jpg | Toa Payoh Dragon Playground
  singapore/upper-serangoon#church-of-the-nativity-of-the-blessed-virgin-mary ← Church of the Nativity of the Blessed Virgin Mary, panorama 2, Nov 06.jpg | Church of the Nativity of the Blessed Virgin Mary
  singapore/upper-serangoon#hougang-tou-mu-kung-kew-ong-yah-temple ← Tou Mu Kung Temple 4, Sep 06.JPG | Hougang Tou Mu Kung
  statecollege#bellefonte-historic-district ← Bellefonte Historic District Aug 10.JPG | Bellefonte Historic District
  statecollege#east-broad-top-railroad ← East Broad Top Orbisonia Station 1.jpg | East Broad Top Railroad
  REMOVED (refused after run #48, re-fetched by the bug):
  tokyo#gotoku-ji ← Gotokuji Temple (Cat Temple).jpg
  cleveland#cleveland-museum-of-art ← Cleveland Museum of Art - south facade.jpg
```

After the review: CREDITS 555 rows. Tier-1 coverage 462/1018; heroes 76 + 8 stated; leads 20/27; first row 42/56. `beta:qa:w8p` passes: Tokyo phone@3× 607 KB.
