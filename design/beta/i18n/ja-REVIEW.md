# Japanese interface catalogue: independent review (D-41)

- **Catalogue:** `tools/beta/i18n/ja.json`, published as `beta/assets/i18n/ja.json`. It has 147 interface strings and the AI-tier note.
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
