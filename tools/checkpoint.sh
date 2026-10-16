#!/bin/bash
# npm run checkpoint -- -m "<message incl. your trailers>" <path> [<path>…]   (docs/resume/README.md, the resume protocol)
# The gates around FE-A's tools/beta/sync-push.sh, so every lane pushes the same way:
#   1. full gate on your working tree: validate + npm test + beta:check — red → nothing is committed or pushed;
#   2. commits EXACTLY the paths given (relative to where you ran npm; add `beta/` yourself when you rebuilt it);
#   3. tools/beta/sync-push.sh: merge origin (never rebase/force), regenerate beta/ on generated-only conflicts, stop on
#      a source conflict or a leftover marker, beta:check, push, succeed only when ls-remote == HEAD.
# Then `npm run checkpoint -- --verify` re-runs the full gate on the pushed head (rule 8.5).
set -u
CALLER=${INIT_CWD:-$PWD}   # npm runs scripts from tools/; paths are relative to where YOU ran npm
TOOLS=$(cd "$(dirname "$0")" && pwd); ROOT=$(cd "$TOOLS/.." && pwd); cd "$ROOT" || exit 2
say() { echo ">>> checkpoint: $*"; }
full() { (cd "$TOOLS" && npm run -s validate && npm test && npm run -s beta:check) >"${TMPDIR:-/tmp}/cleo-checkpoint.log" 2>&1 || { tail -25 "${TMPDIR:-/tmp}/cleo-checkpoint.log"; say "RED gate — $1. Nothing pushed."; exit 1; }; }
if [ "${1:-}" = "--verify" ]; then full "on the pushed head $(git rev-parse --short=8 HEAD) — fix forward NOW"; say "full gate green on $(git rev-parse --short=8 HEAD)"; exit 0; fi
MSG=""; PATHS=()
while [ $# -gt 0 ]; do case "$1" in -m) MSG=$2; shift 2;; /*) PATHS+=("$1"); shift;; *) PATHS+=("$CALLER/$1"); shift;; esac; done
[ -n "$MSG" ] && [ ${#PATHS[@]} -gt 0 ] || { echo 'usage: npm run checkpoint -- -m "<message>" <path>…   |   npm run checkpoint -- --verify'; exit 2; }
git rev-parse -q --verify MERGE_HEAD >/dev/null && { say "a merge is in progress — resolve and commit it first"; exit 1; }
full "on your working tree"
git add -- "${PATHS[@]}" || exit 1
if git diff --cached --quiet; then say "nothing staged in those paths (pushing what is committed)"; else git commit -q -m "$MSG" || exit 1; fi
bash "$TOOLS/beta/sync-push.sh" || { say "sync-push stopped (see above). Nothing more done."; exit 1; }
say "now run: npm run checkpoint -- --verify"
