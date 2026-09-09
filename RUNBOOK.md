# Demo runbook

Every block below is paste-ready and non-interactive. Run them top to
bottom. Narration cues are in *italics*.

Repo: https://github.com/hamza-56/stacked-prs-demo

---

## Step 0. Before you hit record

```bash
cd ~/Workspace/Projects/github-stacked-prs/stacked-prs-demo
./demo/reset.sh          # clears PRs #7-#9 so you can create them live
git checkout main && git pull
git fetch --prune        # drop stale refs, or `submit` fails with "stale info"
gh auth status           # confirm you are logged in
clear
```

Have these browser tabs open and ready:

1. `https://github.com/hamza-56/stacked-prs-demo/pull/6` (the big one)
2. `https://github.com/hamza-56/stacked-prs-demo/pull/3` (a stack layer)
3. `https://github.com/hamza-56/stacked-prs-demo/actions`
4. `https://github.com/hamza-56/stacked-prs-demo/pulls`

---

## Step 1. Show the problem, in the browser

*No commands. Open PR #6.*

Scroll the file tree. 49 files, +1,127 lines, five unrelated concerns in one
branch. Tests pass and CI is green, so nothing here is obviously wrong. That
is the point.

*Optional: open `docs/ARCHITECTURE.md` in the diff and read the "note for
reviewers" at the bottom.*

---

## Step 2. Show the same work as a stack

*Open the Pull requests tab, then PR #3.*

Point at the stack icon, then the stack map in the merge box. Then the diff:
four files, UI only. The model and API it depends on are in their own PRs.

---

## Step 3. Build a stack from scratch, live

*Terminal. This is the core of the demo.*

**3a. Start the stack.**

```bash
gh stack init live-01-due-dates
```

*"That branch is the bottom of the stack. Its base is main."*

**3b. Write layer one and commit.**

```bash
cat > src/due.js << 'JS'
export function parseDue(input) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error('invalid due date');
  return date.toISOString();
}

export function dueLabel(iso, from = Date.now()) {
  if (!iso) return '';
  const days = Math.floor((new Date(iso) - from) / 86400000);
  if (days < 0) return `overdue by ${Math.abs(days)}d`;
  return days === 0 ? 'due today' : `due in ${days}d`;
}
JS

git add src/due.js
git commit -m "Add due-date parsing and labels"
```

**3c. New concern, so a new layer.**

```bash
gh stack add live-02-due-endpoint
```

*"This branches off layer one, not off main. That is the whole idea."*

```bash
cat > src/dueApi.js << 'JS'
import { route } from './server.js';
import { parseDue, dueLabel } from './due.js';

export function registerDueRoutes() {
  route('GET', '/api/due', (req, res, url) => {
    const iso = parseDue(url.searchParams.get('at'));
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ dueAt: iso, label: dueLabel(iso) }));
  });
}
JS

git add src/dueApi.js
git commit -m "Add GET /api/due endpoint"
```

**3d. Third layer, the UI.**

```bash
gh stack add live-03-due-badge

mkdir -p public
cat > public/dueBadge.js << 'JS'
export async function renderDueBadge(el, dueAt) {
  if (!dueAt) return;
  const res = await fetch(`/api/due?at=${encodeURIComponent(dueAt)}`);
  const { label } = await res.json();
  el.textContent = label;
  el.className = label.startsWith('overdue') ? 'due overdue' : 'due';
}
JS

git add public/dueBadge.js
git commit -m "Show a due-date badge on each task"
```

**3e. Look at the chain before pushing.**

```bash
gh stack view --json | jq -r '.branches[] | .name'
```

**3f. Ship all three.**

```bash
gh stack submit --auto --open
```

*"One command. Pushed three branches, opened a PR per layer, and linked them
as a stack. `--auto` takes the titles from the commit messages."*

```bash
gh pr list --limit 3 --json number,headRefName,baseRefName \
  --jq '.[] | "#\(.number)  \(.headRefName)  base: \(.baseRefName)"'
```

*Switch to the browser, refresh the Pull requests tab. Three new PRs, chained.*

---

## Step 4. CI runs on every layer

*Actions tab.*

```bash
gh run list --limit 6 --json headBranch,status,conclusion \
  --jq '.[] | "\(.headBranch)  \(.conclusion // .status)"'
```

*"A run for every branch, not just the bottom one, even though their base is
not main. That is what used to be broken."*

---

## Step 5. The mid-stack change

*"A reviewer on PR one asks for a fix, and I have two PRs sitting on top."*

```bash
gh stack bottom
```

```bash
cat >> src/due.js << 'JS'

export function isOverdue(iso, from = Date.now()) {
  return Boolean(iso) && new Date(iso) < from;
}
JS

git commit -am "Add isOverdue helper"
```

```bash
gh stack rebase --upstack
gh stack push
```

*"That replayed both layers above onto the new commit. No manual rebasing,
nobody's base branch rewritten by hand. The same thing is a button on the PR
page."*

```bash
gh stack view --json | jq -r '.branches[] | "\(.name)  needsRebase=\(.needsRebase)"'
```

---

## Step 6. Navigation, quick

```bash
gh stack top
gh stack down
gh stack bottom
gh stack view --json | jq -r '.currentBranch'
```

---

## Step 7. Merge bottom-up

*Browser. Merge PR #7, the bottom one.*

*"Watch PR #8: it re-targets to main automatically, and #9 stays open and
stays stacked."*

```bash
gh stack sync --prune
```

*"Fetched, detected the merge, replayed the rest onto the new main, pushed,
and deleted the local branch for the merged PR."*

```bash
gh stack view --json | jq -r '.branches[] | "\(.name)  \(.pr.state)"'
```

---

## Step 8. Cleanup after the take

```bash
./demo/reset.sh
git checkout main && git pull
```

To do another take without touching the first one's branches:

```bash
PREFIX=take2 ./demo/live-stack.sh
PREFIX=take2 ./demo/reset.sh
```

---

## If something goes wrong on camera

| Symptom | Fix |
|---------|-----|
| `not a git repository` | You are in the parent folder. `cd stacked-prs-demo` |
| `can only add branches on top of the stack` (code 5) | `gh stack top` first |
| `branch ... already exists in a stack` | `./demo/reset.sh`, or use `PREFIX=take2` |
| `! [rejected] ... (stale info)` on push | `git fetch --prune`, then rerun |
| Rebase conflict (code 3) | Fix files, `git add`, `gh stack rebase --continue` |
| Rebase going badly | `gh stack rebase --abort` restores every branch |
| Branch in two stacks (code 6) | `gh stack checkout <a-branch>` then retry |
| `gh stack view` opens a TUI you cannot exit | Press `q`. Use `--json` in scripts |

**Panic button.** If the live build falls apart, the scripted version does
the identical thing in one command:

```bash
./demo/reset.sh && ./demo/live-stack.sh
```
