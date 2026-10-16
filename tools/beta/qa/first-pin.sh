#!/bin/bash
# QA-70 probe (platform): time from tapping the map pill on the phone Gallery (pinned #view=gallery: D-46 makes Atlas the default) (390, @2, reduced motion, unthrottled) to
# the first drawn Atlas pin (.leaflet-marker-icon), median of 3, for one commit — measured in a clean detached worktree
# of that commit (its own committed beta/), so it can bisect.
#   tools/beta/qa/first-pin.sh <sha> [page=cities/tokyo.html]      e.g. first-pin.sh be74c82f cities/newyork.html
#   bisect: git bisect start <bad> <good>; git bisect run tools/beta/qa/first-pin.sh --bisect 2070
set -u
REPO=$(git -C "$(dirname "$0")" rev-parse --show-toplevel); PE="$REPO/tools/beta/qa/page-eval.js"
TMP=${TMPDIR:-/tmp}/cleo-first-pin; mkdir -p "$TMP"
if [ "${1:-}" = "--bisect" ]; then sha=$(git rev-parse --short=8 HEAD); lim=${2:-2070}; pg=${3:-cities/tokyo.html#view=gallery}; else sha=$1; pg=${2:-cities/tokyo.html#view=gallery}; fi
W="$TMP/$sha"; [ -d "$W" ] || git -C "$REPO" worktree add -q --detach "$W" "$sha" >/dev/null 2>&1
mkdir -p "$W/tools/beta/qa"; cp "$PE" "$W/tools/beta/qa/page-eval-fp.js"   # the probe itself from this checkout; it serves $W
EXPR="(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));await sl(1500);const b=document.querySelector('.mappill [data-cleo-map], .mappill button, .mappill, [data-cleo-map].map-toggle');const t0=performance.now();b.click();while(!document.querySelector('#cleo-map .leaflet-marker-icon')){await sl(20);if(performance.now()-t0>20000)return -1;}return Math.round(performance.now()-t0)})()"
R=(); for i in 1 2 3; do R+=($(node "$W/tools/beta/qa/page-eval-fp.js" m "$pg" "$EXPR" 2>/dev/null)); done
M=$(printf "%s\n" "${R[@]}" | sort -n | sed -n 2p); echo "$sha $pg ${R[*]} median=$M"
git -C "$REPO" worktree remove --force "$W" >/dev/null 2>&1
if [ "${1:-}" = "--bisect" ]; then [ -z "$M" ] || [ "$M" -lt 0 ] && exit 125; [ "$M" -gt "$lim" ] && exit 1; exit 0; fi
