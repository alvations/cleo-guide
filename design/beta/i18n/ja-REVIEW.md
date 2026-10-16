# Japanese interface catalogue: independent review (D-41)

- **Catalogue:** `tools/beta/i18n/ja.json`, published as `beta/assets/i18n/ja.json`. It has 419 interface strings (147 at first; the rest added with the offline pack, For you and the city page) and the AI-tier note: 147 at first, plus 10 offline-pack strings and 9 "For you" strings that landed upstream during the work.
- **Translator:** an AI agent (session_01HB7igqdcuhrau7mUWSauDL).
- **Reviewer:** an independent AI subagent. It was given only `en.json`, `ja.json` and the review brief, and none of the translator's reasoning.
- **Date:** 2026-10-11.
- **Status:** AI-reviewed (`review.by: "ai"`) and `reviewed: false`. A human sign-off is still needed before `reviewed: true`, per the catalogue's own rule.

## Review brief (as given)

Check each string for:

- **Meaning:** nothing dropped, nothing added, no invented facts.
- **Natural UI Japanese:** concise, polite です/ます for full sentences, noun phrases for buttons, labels, headings and tabs.
- **Consistent terms:** an identical English string gets identical Japanese.
- **Placeholders:** `{n}` and the rest are kept intact, as are `.one` singulars, the 12 month names, the leading space in `hub.desc.known`, and the labels that follow a number.
- **Attribution strings:** these may stay in Latin script.

## Checks that passed

- Every key has the same placeholders as the English, the same number of times.
- Repeated English strings have the same Japanese.
- `land.month.names` has 12 entries.
- `hub.desc.known` keeps its leading space.
- The note's meaning is accurate.
- Terms are used consistently: 出典つき, 名前のわかる出典, 検証済みのピン, 表示を付けて, 件のガイド, か所.

## Changes (4, all applied)

| Key | Before | After | Why |
|---|---|---|---|
| `land.trust.closed.n` | か所の閉店を表示付きで掲載 | か所は閉店済み。表示付きで掲載 | 閉店 is an event, not a place, so "<n>か所の閉店" reads oddly after the number. The new wording also matches `chg.checked.closed`. |
| `hub.food` | 食べる・飲む{n}か所 | 飲食スポット{n}か所 | Two bare verbs before a count read unnaturally. A noun phrase fits the stat label and matches 見どころ{n}か所. |
| `hub.checked` | 営業状況の最終確認 {d} (plain space) | 営業状況の最終確認&nbsp;{d} (U+00A0) | The English uses a non-breaking space so the date never wraps away from its label. The Japanese had dropped it. |
| `theme.free.t` | 無料で訪れる | 無料スポット | Theme titles are headings, so they should be noun phrases like the other theme titles. |

## Round 2: the 10 offline-pack strings (1 change, applied)

`pack.*` and `map.offline` landed in `en.json` upstream while this work was in progress. A fresh independent subagent reviewed just those 10 strings under the same brief and had access only to the two catalogues. It accepted 9 of them.

| Key | Before | After | Why |
|---|---|---|---|
| `pack.size` | この端末で{size} | この端末で{size}を使用 | The phrase read as cut off. Adding を使用 states the English meaning, that {size} is used on this device, and adds no new information. |

## Round 3: the 9 "For you" strings (2 changes, applied)

The `fy.*` strings landed upstream after round 2. A fresh independent subagent reviewed them under the same brief, with access only to the two catalogues. It accepted 7 of them.

| Key | Before | After | Why |
|---|---|---|---|
| `fy.note` | …すべてのガイドは下に一覧があります。 | …すべてのガイドは引き続き下に一覧表示されています。 | The English "still" had been dropped, and the old phrasing read awkwardly. The new wording keeps the reassurance that nothing is hidden. |
| `fy.i.food` | 食と飲み物 | 飲食 | 食と飲み物 is an unnatural pairing for a chip. The catalogue already uses 飲食 for "eat & drink" (`hub.food`). |

## Round 4: the 90 city-page strings (`tier.*`, `city.*`; 9 changes, applied)

These keys came in when the city page's server-rendered interface (`lib/render/city.js`) moved into the catalogue. A fresh independent subagent reviewed them under the same brief, with access only to the two catalogues.

| Key | Before | After | Why |
|---|---|---|---|
| `city.card.look` | 見どころ | 注目ポイント | 見どころ is already the "Sights" label, and "Look for" means what to notice. |
| `city.card.within` | {area} | {area}内 | The bare placeholder had dropped "within". |
| `city.src.k` | 推薦したすべての場所 | この出典が推薦したすべての場所 | The old string didn't say who recommended. |
| `city.door.day.d` | {n}か所 · {areas}を計画済み | {n}か所 · {areas}を巡るプラン | The old phrasing said the areas were planned, not that the day plan covers them. |
| `city.view.label` | 表示 | 表示形式 | It clashed with `city.mode.label` (表示), so two control groups had the same accessible name. |
| `city.how.order` | …評価・価格・営業時間… | …星評価・価格・営業時間… | 評価 is the catalogue's word for tiers, which the page does show. |
| `city.door.near.d` | 確認は1回 · 保存しません | 位置情報の許可は1回だけ · 保存しません | 確認 means status checks elsewhere; it's the location permission that is asked once. The reviewer proposed 位置情報の許可を求めるのは1回だけ; I applied it shortened to fit the rail chip, with the same meaning. |
| `city.elsewhere` | その他の地域 | その他のエリア | The catalogue's term for an area is エリア. |
| `city.area.day` | この地域の1日プラン · {n}か所 | このエリアの1日プラン · {n}か所 | Same reason: エリア. |

## Round 5: the browser-drawn city-page strings (`sheet.*`, `gal.*`, `views.*`, `day.*`, new `city.*` and `fy.*` keys; 8 changes, applied)

These came in when FE-A's client modules (sheet, city, views, gallery, day, foryou) moved to `Cleo.t`. A fresh independent subagent reviewed them under the same brief, with access only to the two catalogues.

| Key | Before | After | Why |
|---|---|---|---|
| `sheet.pinned` | 入口までピン: 確度 {c} | ピンは入口の位置: 確度 {c} | 「入口までピン」 doesn't read; the English means the pin is placed at the door. |
| `sheet.been.on` | 行った ✓ | 行った場所 ✓ | Matches 行った場所 in city.stamp, city.been and sheet.been.off. |
| `sheet.wasat` | かつての場所 | かつての所在地 | かつての場所 could read as the place itself having changed; 所在地 says where it stood. |
| `gal.sub.top` | {places} · 最上位の評価(エリアごと) | {places} · 最上位(エリアごとに評価) | Same phrasing as city.across.t (エリアごとに評価). |
| `gal.sub.canon` | {places} · {city}で知られるもの | {places} · {city}ならではの定番 | で知られるもの read unnaturally; aligns with 定番 in fy.sub.canon. |
| `city.empty.note` | 絞り込みで場所が消えることはありません。 | 絞り込みで場所が完全に消えることはありません。 | "for good" had been dropped (filters can hide places for a while). |
| `city.mine.all` | すべてのリスト | すべてのマイリスト | Glossary term マイリスト. |
| `city.src.entries` | 番号付きの{n}項目すべてがここにあります。 | この出典の番号付き{n}項目すべてを掲載しています。 | "its" (this source's) had been dropped; 掲載 aligns with other strings. |

**Total: 24 changes over five rounds.**
