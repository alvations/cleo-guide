#!/bin/bash
# Orlando commit+push helper: _orl_push.sh "<message>"  (adds Orlando paths + generated shared files, retries)
cd /home/user/cleo-guide
LOCK=.git/cleo-shared.lock
ORL_EXTRA="$2" flock -w 3600 $LOCK bash -c 'git add data/orlando-research/ data/orlando.dataset.json cities/orlando.html data/geocodes.json data/sources.json docs/GEOCODE-BACKLOG.md $ORL_EXTRA 2>/dev/null; git commit -q -m "$0" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014dzA4W8xoPEUzDSWEswASU"' "$1"
for i in 1 2 3 4; do
 flock -w 3600 $LOCK bash -c 'git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt 2>&1|tail -2; if git diff --name-only --diff-filter=U | grep -q .; then for f in $(git diff --name-only --diff-filter=U); do if [ "$f" = docs/GEOCODE-BACKLOG.md ]; then git checkout --theirs $f; python3 tools/geocode-status.py >/dev/null; git add $f; else echo "CONFLICT $f"; exit 1; fi; done; git commit -q --no-edit; fi; git push -q -u origin claude/peaceful-goodall-i0hsrt' && break; sleep $((2**i)); done
git log --oneline -1
