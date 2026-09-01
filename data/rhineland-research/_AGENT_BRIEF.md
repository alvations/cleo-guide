# The Rhineland (Cologne · Bonn · Düsseldorf) — standing agent brief

One map page covering the lower-Rhine metropolitan triangle: **Köln/Cologne**, **Bonn**, **Düsseldorf**
(all DE), each with its surrounding quarters. Same pipeline + gates as every guide (docs/PIPELINE.md,
docs/SOURCES.md): **discover → fact-check (≥2 credible) → geocode + location-verify → re-rank within area
→ build & gate.** WebSearch only (WebFetch blocked). Discovery agents emit **sourced research JSON with an
ADDRESS but NO coordinates**. **Search in German** (English where natural); cite native-language sources.
Target density: **as dense as the SaarLorLux region (~287)** — deep in each of the three cities.

## Region & area codes (a)
- `KOLN` — **Cologne / Köln:** the **UNESCO Kölner Dom** + Domschatzkammer, the twelve **Romanesque
  churches** (Groß St. Martin, St. Gereon, St. Aposteln…), Altstadt/Alter Markt/Heumarkt, the museums
  (**Museum Ludwig, Wallraf-Richartz, Römisch-Germanisches, Schokoladenmuseum, Kolumba, MAKK**),
  Hohenzollernbrücke & the Rhine, the **Kranhäuser/Rheinauhafen**, and the quarters — **Belgisches
  Viertel, Ehrenfeld, Südstadt, Nippes, Kwartier Latäng/Zülpicher, Deutz**. Canon: **Kölsch** brewhouse
  culture, **Halve Hahn**, **Himmel un Ääd**, Flönz, Rheinischer Sauerbraten, and a deep Michelin bench.
- `BONN` — **Bonn:** **Beethoven-Haus** & Beethoven sites, the **Museumsmeile** (Haus der Geschichte,
  Kunstmuseum, Bundeskunsthalle, Museum Koenig), the Münster, Poppelsdorf (Schloss + Botanischer Garten),
  the Rhine & Rheinaue, the old government quarter/UN campus, **Bad Godesberg** & Godesburg, and
  Königswinter/**Drachenfels** across the river as an edge day-trip.
- `DUS` — **Düsseldorf:** the **Altstadt** ("längste Theke der Welt") and its **Altbier** brewhouses
  (**Uerige, Füchschen, Schumacher, Zum Schlüssel**), the **Königsallee (Kö)**, **MedienHafen** (Gehry
  buildings) + Rheinturm, the Rhine promenade, **Little Tokyo** (Immermannstraße — ramen, izakaya, sushi —
  a genuine signature), the **Kunstsammlung K20/K21** & Kunstpalast, Kaiserswerth, and quarters Flingern &
  Bilk. Canon: **Altbier**, Rheinischer cooking, Japanese, and a strong Michelin bench.

## The food & drink canon — signature FIRST, then depth (name the dish)
- **Cologne (KOLN):** **Kölsch** (only from the stange, poured by a Köbes), the **Brauhaus** institutions
  (Früh, Päffgen, Gaffel, Sion, Malzmühle), **Halve Hahn** (rye roll + Gouda), **Himmel un Ääd** (black
  pudding + apple/potato), Rheinischer Sauerbraten, Mettbrötchen, plus Ehrenfeld/Belgisches-Viertel modern
  bistros, specialty coffee, and Michelin depth (**Le Moissonnier, Ox & Klee, maximilian lorenz, Astrein,
  neobiota, La Société**).
- **Bonn (BONN):** Rheinischer cooking & Brauhaus (Bönnsch, the city's own beer), Bad Godesberg dining,
  student/Poppelsdorf spots, and Michelin (**Yunico, Halbedel's Gasthaus, Strandhaus, Kaspars**).
- **Düsseldorf (DUS):** **Altbier** brewhouses (Uerige, Füchschen, Schumacher, Zum Schlüssel, Kürzer),
  Rheinischer cooking, **Little Tokyo** ramen/izakaya/sushi (**Takumi, Naniwa, Maruyasu, Okinii**), and
  Michelin (**Im Schiffchen, Agata's, Yoshi by Nagaya, 1876, Fritz's Frau Franzi, Setzkasten**).

## The source bar (hard rule)
≥2 **credible** sources per place, OR one lone institutional authority (**Michelin**, **UNESCO**,
Gault&Millau, a national monument/museum). Credible, native-language, for this region:
- **Köln:** **Kölner Stadt-Anzeiger (KStA)**, **Express**, **WDR / Lokalzeit Köln**, **KölnTourismus**,
  **Mit Vergnügen Köln**, Michelin Deutschland, Gault&Millau, Der Feinschmecker.
- **Bonn:** **General-Anzeiger Bonn (GA)**, WDR, **Bonn Tourismus/Bonn.de**, Michelin, Gault&Millau.
- **Düsseldorf:** **Rheinische Post (RP)**, **Antenne Düsseldorf**, WDR, **Düsseldorf Tourismus/
  visitduesseldorf**, **The Düsseldorfer**, Michelin, Gault&Millau.
- **Cross-border / international (reuse where they name a specific place):** **DW Travel**, **Rick Steves**,
  **Atlas Obscura**, **Lonely Planet**, **Time Out** (has a Cologne edition), **Culture Trip**,
  **National Geographic**, **CNN Travel**, **Condé Nast Traveler**. Count toward the ≥2 bar (never a lone
  recommender unless Michelin/UNESCO/Gault&Millau). Register any you use.
- **University & campus (authentic student-local):** **Universität zu Köln / TH Köln**, **Universität
  Bonn**, **Heinrich-Heine-Universität Düsseldorf**, and **ESN** local guides.
- **Local bloggers & vloggers (viral/authentic):** verifiably-popular German food/travel bloggers,
  YouTubers and TikTokers who cover Köln/Bonn/Düsseldorf — count only with a **real, findable following and
  a specific piece naming the place**; record the creator in `CREATORS_*.json`.
- **TikTok & Reddit (younger-gen / local):** in-language hashtags + the local subreddits (**r/cologne**,
  **r/koeln**, **r/bonn**, **r/dusseldorf**). A TikTok counts only as a *specific findable video from a
  verifiably-popular account* naming the place (tag `"Viral"`); Reddit is a corroborating local vote, never
  a lone-comment pin. See the Reddit/TikTok rules in [docs/SOURCES.md](../../docs/SOURCES.md).
- **Yelp/TripAdvisor/Google/OpenTable ratings count as ZERO** toward the bar (may only *measure*
  popularity — merit bar below). Reject anonymous SEO listicles / content farms. Prefer German-language.

Merit bar: a mention is not merit — an award (Michelin/Gault&Millau), a real rave, or a high cross-platform
rating volume before a place earns a pin. Record keep/drop in AUDIT.md.

## Output schema (mirror the other cities' files exactly)
- **Food/drink** → LIST `FOOD_<scope>.json`; each: `{"t":1|2|3,"a":"KOLN"|"BONN"|"DUS","cz":["<cuisine>"],
  "dish":"<named dish>","n":"<name>","address":"<full street, City, Germany>","w":"<1-3 sentences>",
  "closed":false,"sources":[["KEY","url"],["KEY2","url2"]]}`
- **Sights** → DICT `SIGHTS_<scope>.json`: `{"sources":[{"key","name","url"}...],"sights":[{"t","a","n",
  "address","w","k","g":["ICON","UNESCO","HIST","ARCH","MUS","RIVER","PARK","MKT","NIGHT","FREE"...],
  "sources":[["KEY","url"]...]}]}`
- **New outlets** → `SOURCES_<scope>.json` `{"outlets":[{"key","name","type","url","credible"}...]}`.
- Name a **specific dish**, never a bare cuisine label. `t` = tier WITHIN the city. **NO lat/lng** —
  ADDRESS names the city + Germany. Dedup: add NEW places only.

## Do NOT
Fabricate a place, address, dish, or source. No Yelp-only entries. No coordinates from memory. If a place
can't clear the ≥2-credible bar, leave it out.
