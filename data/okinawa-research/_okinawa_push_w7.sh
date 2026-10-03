#!/bin/bash
# usage: bash data/okinawa-research/_okinawa_push_w7.sh "msg" [extra paths...]   (W7 session trailer)
cd /home/user/cleo-guide
M="$1"; shift
flock -w 3600 .git/cleo-shared.lock bash -c 'git add data/okinawa-research/ "$@" && git commit -q -m "$0" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ArZFSzKcMbcHeXLyDAXfRU" && (git push -q -u origin claude/peaceful-goodall-i0hsrt 2>/dev/null || (git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt && git push -q -u origin claude/peaceful-goodall-i0hsrt))' "$M" "$@"
git log --oneline -1; git status -sb | head -1
