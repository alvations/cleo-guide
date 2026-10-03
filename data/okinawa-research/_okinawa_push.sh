#!/bin/bash
# usage: bash data/okinawa-research/_okinawa_push.sh "msg"  (adds only okinawa research files + optional extra paths)
cd /home/user/cleo-guide
flock -w 3600 .git/cleo-shared.lock bash -c "git add data/okinawa-research/ ${EXTRA} && git commit -q -m \"\$0\" -m 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VjDaZF1gYJz6K7mqkAHid2' && (git push -q -u origin claude/peaceful-goodall-i0hsrt 2>/dev/null || (git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt && git push -q -u origin claude/peaceful-goodall-i0hsrt))" "$1"
git log --oneline -1; git status -sb | head -1
