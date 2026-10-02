# Tokyo — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (13), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — W1 sights backbone (CYD batch 1) — STOPPED by WebSearch budget
**Method.** Each sight searched with `allowed_domains` = en.wikipedia.org, japan-guide.com, gotokyo.org, timeout.com;
one call returns the credible pages (WIKIPEDIA + GOTOKYO/JAPANGUIDE/TIMEOUT) and Wikipedia's published infobox
coordinates. Status = the current GO TOKYO / Time Out page (open). Restaurant pins: a `google.com`-restricted search
returns the Maps place URL — read `!3d!4d` (tested on Kanda Matsuya → !3d35.6961091!4d139.7687915; NOT the
`/@35.6936645,139.7696566` viewport). Food lead noted for W2 (not yet written): Kanda Yabu Soba — TIMEOUT +
JAPANTIMES + visit-chiyoda; Kanda Matsuya — TIMEOUT + SAVORJAPAN + Tokyo Metropolitan Govt location box.
**Kept (9, CYD):** Imperial Palace East Gardens (t1), Yasukuni Shrine (t1), Kanda Myōjin (t1), Tokyo Station
Marunouchi Building (t1), Akihabara Electric Town (t1), MOMAT (t2), Jimbōchō Book Town (t2), Hie Shrine (t2),
Nippon Budōkan (t2). Each ≥2 credible (Wikipedia + GO TOKYO / japan-guide / Time Out).
**Geocode:** 7 high (Wikipedia infobox), 2 med (Akihabara, Jimbōchō — Wikipedia district points by the station /
main crossing). **Held:** Chidorigafuchi — GO TOKYO + japan-guide + Time Out, but no published coords in results →
not written until a place pin is read.
**Channel mix this wave:** editorial/travel sites 9 (GO TOKYO official tourism, Time Out, japan-guide), Wikipedia 9;
creators 0 (creator pass not reached).
**STOP:** the shared WebSearch session budget hit 200/200 (all ~16 concurrent agents) at this agent's 15th call.
No further discovery is possible this session; nothing was fabricated to fill the gap. Density: 9 / ~530.
