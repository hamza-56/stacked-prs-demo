# Command cheatsheet for the recording

Everything here is non-interactive and safe to paste on camera.

## Setup, once

```bash
gh extension install github/gh-stack
git config rerere.enabled true        # remember conflict resolutions
git config remote.pushDefault origin  # skip the remote picker
```

## Build a stack from scratch

```bash
gh stack init 01-due-dates        # bottom branch, based on main
# ...write code...
git add src/due.js
git commit -m "Add due-date parsing"

gh stack add 02-due-endpoint      # new layer, based on the branch below
git add src/dueApi.js
git commit -m "Add GET /api/due"

gh stack add 03-due-badge
git add public/dueBadge.js
git commit -m "Show a due badge on tasks"

gh stack submit --auto --open     # push all, open a PR per layer, link the stack
```

`--auto` titles the PRs from the commit messages. `--open` opens them ready
for review instead of as drafts. Drop `--open` if you want drafts.

There is a one-line shortcut for a single-commit layer:

```bash
gh stack add -Am "Add due badge" 03-due-badge
```

## Look at the stack

```bash
gh stack view --json | jq          # machine-readable, safe in a script
gh stack view                      # interactive TUI, nice on camera
```

Useful reads:

```bash
gh stack view --json | jq -r '.branches[] | "\(.name)  PR #\(.pr.number)  \(.pr.state)"'
gh stack view --json | jq '[.branches[] | select(.needsRebase)] | length'
```

## Move around

```bash
gh stack bottom     # closest to main
gh stack up         # away from main
gh stack up 2
gh stack down
gh stack top
gh stack checkout 3 # by PR number, pulls the stack from GitHub if needed
```

## The mid-stack change, the one that used to hurt

A reviewer on the bottom PR asks for a change, and three PRs sit on top.

```bash
gh stack bottom
# ...make the fix...
git commit -am "Fix due-date rounding"
gh stack rebase --upstack   # replay every layer above onto the new commit
gh stack push
```

`--upstack` is current branch and above. `--downstack` is trunk up to here.
Plain `gh stack rebase` does the whole thing.

If it conflicts: fix the files, `git add` them, then `gh stack rebase
--continue`. To bail out entirely, `gh stack rebase --abort` restores every
branch.

## Routine sync

```bash
gh stack sync           # fetch, rebase onto trunk, push, refresh PR state
gh stack sync --prune   # and delete local branches whose PRs merged
```

Run this after merging the bottom PR. It detects the merge, including a
squash-merge, and replays the rest onto the updated trunk.

## Restructure, reorder, drop a layer

```bash
gh stack unstack
git branch -m 02-old-name 02-new-name
gh stack init --base main 01-due-dates 02-new-name 03-due-badge
```

## Adopt branches you already have

```bash
gh stack init existing-a existing-b existing-c   # local, with tracking
gh stack link existing-a existing-b existing-c   # remote only, no local state
gh stack link 7 48                               # append PR #48 to stack #7
```

`link` is the one to use if branches are managed by another tool such as jj
or Sapling.

## Scripted demo

```bash
./demo/live-stack.sh          # builds a 3-layer stack and opens the PRs
STEP=1 ./demo/live-stack.sh   # pause before each command, good for recording
PREFIX=take2 ./demo/live-stack.sh
./demo/reset.sh               # close the PRs and delete the branches
```

## Exit codes worth knowing

| Code | Meaning |
|------|---------|
| 2 | Not in a stack, run `gh stack init` |
| 3 | Rebase conflict, resolve then `gh stack rebase --continue` |
| 5 | Bad arguments, or `gh stack add` from a branch that is not the top |
| 6 | Branch is in more than one stack, check out a different one first |
| 9 | Stacked PRs not enabled on this repository |
