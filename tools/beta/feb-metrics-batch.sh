#!/bin/bash
# FE-B (R7 gap 5 sweep, from FE-A): run tools/beta/metrics.js one page at a time, N in parallel, one JSON per page under
# design/beta/eval/w8/metrics-all/ (<page path with / → -->.json). Resumable: a page whose JSON exists is skipped, so a
# stop loses at most the pages in flight. metrics.js serves beta/ itself and blocks every off-origin request.
#   tools/beta/feb-metrics-batch.sh [parallel=4] [filter-regex]
cd "$(git rev-parse --show-toplevel)/tools" || exit 1
OUT=design/beta/eval/w8/metrics-all; PAR=${1:-4}; RE=${2:-.}
mkdir -p "../$OUT"
pages=$(cd ../beta && find . -name '*.html' -not -path './data/*' -not -path './assets/*' | sed 's#^\./##' | sort | grep -E "$RE")
todo=(); for p in $pages; do f="../$OUT/$(echo "$p" | sed 's#/#--#g; s#\.html$##').json"; [ -s "$f" ] || todo+=("$p"); done
echo "pages: $(echo "$pages" | wc -w), to do: ${#todo[@]}"
printf '%s\n' "${todo[@]}" | xargs -P "$PAR" -I{} sh -c 'o="'"$OUT"'/$(echo "{}" | sed "s#/#--#g; s#\.html\$##").json"; node beta/metrics.js --all --only "{}" --out "$o" --concurrency 1 >/dev/null 2>&1 && echo "done {}" || echo "FAILED {}"'
