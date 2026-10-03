#!/bin/bash
# Madison: build + gates + validate/test + card refresh + commit + push (all shared writes under the lock).
# usage: _mad_push.sh "<commit msg>" "<CITIES note>"
set -u
cd /home/user/cleo-guide
LOCK=.git/cleo-shared.lock
flock -w 3600 $LOCK python3 tools/rebuild-city.py madison-wi --build > data/madison-research/_mad_build.log 2>&1 || { echo BUILD FAILED; tail -20 data/madison-research/_mad_build.log; exit 1; }
for g in sourcecheck geocheck statuscheck buildcheck; do node tools/research.js --$g madison-wi 2>&1 | grep -E ">>>" | head -1; done
python3 tools/density.py madison-wi | sed -n 4,10p
flock -w 3600 $LOCK python3 data/madison-research/_mad_card.py "$2"
(cd tools && npm run validate 2>&1 | grep ">>>" ; npm test 2>&1 | grep -E "ALL PASS|FAIL" | head -3)
P="index.html docs/CITIES.md docs/AGENT-PROMPTS.md cities/madison.html data/madison.dataset.json data/geocodes.json data/sources.json docs/GEOCODE-BACKLOG.md $(git ls-files --others --modified --exclude-standard data/madison-research | grep -v '_mad_build' | tr '\n' ' ')"
flock -w 3600 $LOCK bash -c "git add $P && git commit -q -m \"$1\" -m 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rjg6M4XRHgN3TEY1BpEFYX'"
for i in 1 2 3 4; do
  flock -w 3600 $LOCK bash -c '
    git push -q -u origin claude/peaceful-goodall-i0hsrt 2>/dev/null && exit 0
    git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt >/dev/null 2>&1
    U=$(git diff --name-only --diff-filter=U)
    for f in $U; do
      case $f in
        docs/GEOCODE-BACKLOG.md) git checkout --theirs $f; python3 tools/geocode-status.py >/dev/null 2>&1; git add $f;;
        *) echo "MANUAL CONFLICT $f"; exit 2;;
      esac
    done
    [ -n "$U" ] && git commit -q --no-edit
    git push -q -u origin claude/peaceful-goodall-i0hsrt' && break
  rc=$?; [ $rc = 2 ] && exit 2; sleep $((2**i))
done
git status -sb | head -1
