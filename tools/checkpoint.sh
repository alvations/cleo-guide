#!/bin/bash
# npm run checkpoint -- -m "<message incl. your trailers>" <path> [<path>…]   (docs/resume/README.md, the resume protocol)
# A green, verified push in one command, for every lane. Refuses on red at every step; never rebases or force-pushes.
#   1. full gate on your work: validate + npm test + beta:check (a red gate → nothing is committed);
#   2. commits EXACTLY the paths given (add `beta/` yourself when you rebuilt it), plus nothing else;
#   3. merges origin (up to 5 rounds while origin moves): a conflict only in generated beta/ files → regenerate
#      (npm run beta) + fast gate (validate + beta:check); a SOURCE conflict → stops with the merge in progress, for you
#      to resolve by hand (rule 8: never by a script);
#   4. pushes and verifies `git ls-remote` == HEAD.
# Then run the full gate again on the pushed head (rule 8.5): `npm run checkpoint -- --verify`.
set -u
BR=${CLEO_BRANCH:-claude/peaceful-goodall-i0hsrt}
CALLER=${INIT_CWD:-$PWD}   # npm runs scripts from tools/; paths are relative to where YOU ran npm
TOOLS=$(cd "$(dirname "$0")" && pwd); ROOT=$(cd "$TOOLS/.." && pwd); cd "$ROOT" || exit 2
say() { echo ">>> checkpoint: $*"; }
full() { (cd "$TOOLS" && npm run -s validate && npm test && npm run -s beta:check) >/tmp/cleo-checkpoint.log 2>&1 || { tail -25 /tmp/cleo-checkpoint.log; say "RED gate — $1. Nothing pushed."; exit 1; }; }
fast() { (cd "$TOOLS" && npm run -s validate && npm run -s beta:check) >/tmp/cleo-checkpoint.log 2>&1 || { tail -25 /tmp/cleo-checkpoint.log; say "RED fast gate after the merge — fix, commit, re-run. Nothing pushed."; exit 1; }; }
if [ "${1:-}" = "--verify" ]; then full "on the pushed head $(git rev-parse --short=8 HEAD) — fix forward NOW"; say "full gate green on $(git rev-parse --short=8 HEAD)"; exit 0; fi
MSG=""; PATHS=()
while [ $# -gt 0 ]; do case "$1" in -m) MSG=$2; shift 2;; /*) PATHS+=("$1"); shift;; *) PATHS+=("$CALLER/$1"); shift;; esac; done
[ -n "$MSG" ] && [ ${#PATHS[@]} -gt 0 ] || { echo 'usage: npm run checkpoint -- -m "<message>" <path>…   |   npm run checkpoint -- --verify'; exit 2; }
git diff --name-only --diff-filter=U | grep -q . && { say "a merge is in progress — resolve it first"; exit 1; }
full "on your working tree"
git add -- "${PATHS[@]}" || exit 1
git diff --cached --quiet && say "nothing staged in those paths (pushing what is committed)" || git commit -q -m "$MSG" || exit 1
regen() { (cd "$TOOLS" && npm run -s beta >/dev/null 2>&1) && git add beta/ || { say "beta/ regeneration failed"; exit 1; }; }
for i in 1 2 3 4 5; do
  H0=$(git rev-parse HEAD); git pull -q --no-rebase origin "$BR" >/dev/null 2>&1
  SRC=$(git diff --name-only --diff-filter=U | grep -v '^beta/')
  [ -n "$SRC" ] && { say "SOURCE conflict — resolve by hand, commit, re-run:"; echo "$SRC"; exit 1; }
  if git rev-parse -q --verify MERGE_HEAD >/dev/null; then      # stopped on generated-only conflicts
    git checkout -q --theirs beta/ && regen; fast; git commit -q --no-edit || exit 1
  elif [ "$(git rev-parse HEAD)" != "$H0" ]; then                # a clean auto-merge: beta/ may still be stale
    (cd "$TOOLS" && npm run -s beta:check >/dev/null 2>&1) || { regen; git commit -q -m "Merge origin; beta/ regenerated" || true; }
    fast
  fi
  if git push -q origin "HEAD:$BR" 2>/dev/null; then
    L=$(git ls-remote origin "refs/heads/$BR" | cut -f1); H=$(git rev-parse HEAD)
    [ "$L" = "$H" ] && { say "pushed ${H:0:8} (ls-remote = HEAD). Now: npm run checkpoint -- --verify"; exit 0; }
    say "ls-remote ${L:0:8} != HEAD ${H:0:8}"; exit 1
  fi
  say "origin moved; merging again ($i)"
done
say "origin kept moving — 5 rounds without a clean push"; exit 1
