#!/usr/bin/env bash
# Delete the branches and PRs created by live-stack.sh so you can do another take.
#   ./demo/reset.sh            # cleans up the "live" prefix
#   PREFIX=take2 ./demo/reset.sh
set -uo pipefail

PREFIX="${PREFIX:-live}"
cd "$(dirname "$0")/.."

branches=$(git branch --list "${PREFIX}-*" | tr -d ' *')

# Unstack FIRST, from inside the stack. Deleting the branches before this
# leaves an orphaned entry in .git/gh-stack that later runs trip over.
if [ -n "$branches" ]; then
  top=$(echo "$branches" | tail -1)
  git checkout -q "$top"
  gh stack unstack 2>/dev/null || gh stack unstack --local 2>/dev/null || true
fi

git checkout -q main

for pr in $(gh pr list --state open --json number,headRefName \
    --jq '.[] | select(.headRefName | startswith("'"$PREFIX"'")) | .number'); do
  echo "closing PR #$pr"
  gh pr close "$pr" --delete-branch >/dev/null 2>&1 || true
done

for branch in $branches; do
  echo "deleting branch $branch"
  git branch -D "$branch" >/dev/null 2>&1 || true
  git push -q origin --delete "$branch" >/dev/null 2>&1 || true
done

echo "reset done"
