# v2 motion: the signature moment and the heart pop

This spec answers ROUND-6 gap #1 and the owner amendment's "small moments of delight". The designer owns the tokens and the CSS (`tokens.css`, `css/v2.css` V2.14 and V2.16). FE-A owns the trigger.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--dur-grow` | 300 ms (≤ 300, the R7 delight cap) | the cover or pin growing into the sheet |
| `--ease-grow` | `cubic-bezier(.2, .9, .1, 1)` | fast out of the tap, long soft landing |
| `--dur-pop` / `--ease-spring` | 300 ms / `cubic-bezier(.34, 1.56, .64, 1)` | the heart pop, the only spring |
| `--dur-1…4` | 120 / 200 / 320 / 480 ms | everything else; primary paths stay at 200 ms or less |

Under `prefers-reduced-motion: reduce`, every one of these is `0ms`. V2.16 also sets `animation: none` on every view-transition pseudo-element and on `.v2-grow`. A test that asserts 0 running animations under reduced motion therefore holds.

## The moment: "the tapped cover or pin grows into the sheet"

The moment is action-driven only. It never autoplays.

1. **Tap.** On tap of a card's media (or a map pin's card), set `view-transition-name: cleo-grow` on that media element.
2. **Open inside a transition.** Call `document.startViewTransition(() => openSheet(id))`. In the new state, the sheet's hero media carries `view-transition-name: cleo-grow`, so the browser morphs the card media into the sheet media over `--dur-grow` with `--ease-grow`. The rest of the page cross-fades over `--dur-2`.
3. **Clean up.** Remove the name from the card after the transition's `finished` promise resolves, so two elements never share it.
4. **Fallback.** If `startViewTransition` is missing, add `.v2-grow` to the sheet's panel. Set `--gx` / `--gy` / `--gs` from the tapped rect relative to the panel (FLIP). The keyframe lands at `transform: none`.
5. **Close.** Closing runs the same transition in reverse. If the card is no longer in view, skip the name and the sheet simply fades.
6. **Capture.** With reduced motion off, a 390 px capture at 120 ms shows the media mid-growth. With reduced motion on, it shows the open sheet at once.

## The heart pop

- When a heart turns `aria-pressed="true"`, its icon pops: scale 0.7 → 1.18 → 1, over `--dur-pop` with `--ease-spring`.
- A 2 px `--sun-wash` ring sits behind the heart. That ring is the one sun moment on that card.
- Under reduced motion there is no pop. The state change is still carried by the fill and by `aria-pressed`.

## Soft card lift (hover only, `@media (hover: hover)`)

Card media dims 3 % on hover and scales to 0.99 when pressed. There is no shadow lift on resting cards, which follows the v2 elevation rule.
