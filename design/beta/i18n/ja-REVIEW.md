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

## Round 6: FE-C's 84 keys (`trip.*`, `geo.*`, `src.*`, `share.*`, `rec.*`; 10 changes, applied)

FE-C staged these English strings in `tools/beta/i18n-fec/pending-en.json`. The i18n lane wrote `pending-ja.json`, and FE-C's `merge.py` merges both into the catalogue. A fresh independent subagent reviewed them under the same brief, with access only to the pending files and the catalogue.

| Key | Before | After | Why |
|---|---|---|---|
| `trip.why.gone` | どのガイドにも掲載されていません | ガイドに掲載されなくなりました | "no longer" had been dropped; the place was removed after the link was made. |
| `trip.gone.one` | このリンクの1か所は、どのガイドにも掲載されていません: {ids}。リンクがガイドより古い可能性があります。 | このリンクの1か所は、ガイドに掲載されなくなりました: {ids}。リンクがガイドより古い可能性があります。 | Keeps "no longer listed" (the next sentence depends on it); matches trip.why.gone. |
| `trip.gone` | このリンクの{n}か所は、どのガイドにも掲載されていません: {ids}。リンクがガイドより古い可能性があります。 | このリンクの{n}か所は、ガイドに掲載されなくなりました: {ids}。リンクがガイドより古い可能性があります。 | Same fix as the singular. |
| `trip.noday` | このリンクからは1日プランを作れません。どの場所も閉店、ピンなし、またはガイドに掲載されていません。 | このリンクからは1日プランを作れません。どの場所も閉店、ピンなし、またはガイドに掲載されなくなっています。 | Same "no longer listed". |
| `trip.all` | 保存したすべて | 保存したすべての場所 | An incomplete noun phrase as a selector label. |
| `trip.from` | 元にするもの | 作成元 | A concise noun label. |
| `trip.b.fit` | {places}を1日プランに入れられます。最大{days}です。 | {places}を1日プランに入れられます(最大{days}分)。 | "最大{days}です" was unclear; the places fill at most that many days. |
| `geo.assume` | 徒歩時間は直線距離で、分速約80 mの目安です。経路ではありません | 徒歩時間は直線距離と分速約80 mから出した目安で、経路ではありません | The times are estimated from straight-line distance; they are not distances. |
| `rec.label` | 評価・受賞 | 受賞・注目 | 評価 means tiers and star ratings in the catalogue; the site shows no ratings. |
| `rec.tile.k` | 評価 | 注目 | Same clash with 評価; consistent with rec.label. |

## Round 7: FE-B's Guidebook and Insights views (`gb.*`, `ins.*`; 11 changes, applied)

These keys came in when the i18n lane catalogued `client/guidebook.js` and `client/insights.js` (approved by the orchestrator, FE-B told first). The Insights footnotes the platform writes into the page data are re-said from `ins.p.*` only when the catalogue's English equals the data text exactly. A fresh independent subagent reviewed the keys under the same brief, with access only to the two catalogues.

| Key | Before | After | Why |
|---|---|---|---|
| `gb.intro.t1` | 必見はまず{a}です。 | 必見の筆頭は{a}です。 | まず〜です read unnaturally for "start with"; 筆頭 says the list begins with {a}. |
| `gb.intro.t2` | 必見はまず{a}と{b}です。 | 必見の筆頭は{a}と{b}です。 | Parallel to t1. |
| `gb.intro.pop` | ここの{places}は、ポップカルチャーの巡礼ルートに含まれます。 | このエリアの{places}は、ポップカルチャーの巡礼ルートに含まれます。 | ここの was colloquial; "here" means this area. |
| `gb.intro.closed.one` | ここの{places}は閉店しました。表示を付けて章の最後に残しています。 | このエリアの{places}は閉店しました。表示を付けて章の最後に残しています。 | Same as gb.intro.pop. |
| `gb.intro.closed` | ここの{places}は閉店しました。表示を付けて章の最後に残しています。 | このエリアの{places}は閉店しました。表示を付けて章の最後に残しています。 | Same; identical to the .one form. |
| `gb.dt.closed` | 閉店(掲載継続) | 閉店(記録として掲載) | "kept" is 記録として掲載 everywhere else. |
| `gb.src.h` | 出典と方法 | 出典と調査方法 | 方法 alone was vague as an appendix heading. |
| `gb.count.m` |  がこの絞り込みに一致します。 | がこの絞り込みに一致します。 | The English leading space left a stray space after Japanese text. |
| `ins.spr.absent` |  そのようなピンが2件未満のエリアは、0で埋めずに省いています。 | そのようなピンが2件未満のエリアは、0で埋めずに省いています。 | Same stray-space fix (it follows a 。). |
| `ins.src.t` | 各エリアを推薦しているのは | 各エリアを推薦している出典 | A heading should be a noun phrase. |
| `ins.rec.cited` | 3件以上の出典が掲載 | 3件以上の出典に掲載 | "Cited by" is passive. |

## Round 8: FE-C's second batch (43 new keys: `base.*`, `geo.walk.*`, `share.*`; 4 changes, applied)

FE-C's pending list grew to 122 keys: the round-6 strings plus 43 new ones. At FE-C's request the i18n lane merged all 122 into en.json and ja.json together with FE-C's prepared client patch, in one commit. A fresh independent subagent reviewed the 43 new strings under the same brief.

| Key | Before | After | Why |
|---|---|---|---|
| `base.from` | 起点: | 拠点: | The から word order doesn't fit between distance and name, so it must be a label, and the catalogue's term is 拠点. |
| `base.cleared.why` | 拠点を解除しました: {why}。 | 拠点が解除されました: {why}。 | The English is passive (the guide cleared it, not the user). |
| `share.checked.to` | {date}まで営業状況を確認 | 営業状況は{date}時点で確認済み | まで read as "will check until"; the meaning is "checked as of". |
| `share.more` | ほか{n}か所はリンクで | ほか{n}か所はリンク先に | リンクで read unfinished. |

## Round 9: method, accessibility and 404 headings (`m.*`, `a.*`, `nf.*`), the updated banner, and FE-C's `trip.page.*` (2 changes, applied)

QC-16: the method pages' headings, labels and buttons moved to the catalogue. The banner now says the method pages' longer explanations stay in English too, which matches what a visitor sees. A fresh independent subagent reviewed the strings under the same brief.

| Key | Before | After | Why |
|---|---|---|---|
| `note.text` | 日本語の画面表示: 機械翻訳し、別のAIによるレビューで確認したものです。各場所の解説と、方法のページの詳しい説明は英語のままです。 | 日本語の画面表示: 機械翻訳し、別のAIによるレビューで確認したものです。各場所の解説と、選定方法のページの詳しい説明は英語のままです。 | The catalogue translates "Method" as 選定方法. |
| `trip.page.desc` | 保存した場所から数日間の旅程を作ります。1日1エリア、近い順、徒歩時間の目安つきで、閉店した場所は理由を添えて除外します。リンク1つ、印刷できる冊子、KMLに対応しています。 | 保存した場所から数日間の旅程を作ります。1日1エリア、近い順、徒歩時間の目安つきで、閉店した場所は理由を添えて除外します。リンク1つ、印刷できる冊子、KMLで使えます。 | 対応しています read like a spec sheet. |

**Total: 51 changes over nine rounds.**
