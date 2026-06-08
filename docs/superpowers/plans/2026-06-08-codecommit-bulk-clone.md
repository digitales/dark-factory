# CodeCommit Bulk Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bash script that syncs all AWS CodeCommit repos in `us-east-1` to `~/Sites/codecommit/` with shallow clone, pull-on-rerun, and optional `--deepen`.

**Architecture:** Single entry-point script `scripts/sync-codecommit-repos.sh` uses AWS CLI for discovery and git over HTTPS (existing credential helper) for clone/pull. A companion test script stubs `aws`/`git` in a temp directory to verify sync logic without touching real repos.

**Tech Stack:** bash, AWS CLI v2, git, existing CodeCommit HTTPS credential helper

**Spec:** `docs/superpowers/specs/2026-06-08-codecommit-bulk-clone-design.md`

---

## File Structure

| File | Responsibility |
|------|----------------|
| `scripts/sync-codecommit-repos.sh` | Pre-flight checks, `--deepen`, list/clone/pull loop, summary |
| `scripts/test-sync-codecommit-repos.sh` | Mocked integration test (no real AWS/git remote calls) |
| `README.md` | Short usage section under Scripts |

---

### Task 1: Create sync script skeleton with pre-flight checks

**Files:**
- Create: `scripts/sync-codecommit-repos.sh`

- [ ] **Step 1: Create the script with env defaults, usage, and pre-flight checks**

```bash
#!/usr/bin/env bash
# Sync all CodeCommit repos in a region to ~/Sites/codecommit/ for local analysis.
# Requires: aws CLI, git, CodeCommit HTTPS credential helper (see design spec).

set -euo pipefail

CODECOMMIT_REGION="${CODECOMMIT_REGION:-us-east-1}"
CODECOMMIT_ROOT="${CODECOMMIT_ROOT:-$HOME/Sites/codecommit}"
CODECOMMIT_HOST="git-codecommit.${CODECOMMIT_REGION}.amazonaws.com"

usage() {
  cat <<EOF
Usage:
  $(basename "$0")                 Sync all repos (clone new, pull existing)
  $(basename "$0") --deepen NAME   Fetch full history for one local repo

Environment:
  CODECOMMIT_REGION   AWS region (default: us-east-1)
  CODECOMMIT_ROOT     Local clone root (default: ~/Sites/codecommit)
  AWS_PROFILE         Optional AWS CLI profile
EOF
}

aws_cmd() {
  if [[ -n "${AWS_PROFILE:-}" ]]; then
    aws --profile "$AWS_PROFILE" "$@"
  else
    aws "$@"
  fi
}

clone_url_for() {
  local name="$1"
  printf 'https://%s/v1/repos/%s' "$CODECOMMIT_HOST" "$name"
}

preflight_checks() {
  if ! command -v aws >/dev/null 2>&1; then
    echo "Error: aws CLI not found." >&2
    exit 1
  fi

  if ! command -v git >/dev/null 2>&1; then
    echo "Error: git not found." >&2
    exit 1
  fi

  if ! aws_cmd sts get-caller-identity --region "$CODECOMMIT_REGION" >/dev/null 2>&1; then
    echo "Error: AWS credentials invalid or insufficient for sts get-caller-identity." >&2
    exit 1
  fi

  local helper
  helper="$(git config --global --get "credential.https://${CODECOMMIT_HOST}.helper" || true)"
  if [[ -z "$helper" ]]; then
    echo "Error: git credential helper not configured for https://${CODECOMMIT_HOST}" >&2
    echo "Run:" >&2
    echo "  git config --global credential.\"https://${CODECOMMIT_HOST}\".helper \"!aws codecommit credential-helper \\\$@\"" >&2
    echo "  git config --global credential.\"https://${CODECOMMIT_HOST}\".UseHttpPath true" >&2
    exit 1
  fi

  mkdir -p "$CODECOMMIT_ROOT"
}

main() {
  case "${1:-}" in
    -h|--help)
      usage
      exit 0
      ;;
    --deepen)
      echo "Error: --deepen requires a repository name." >&2
      usage
      exit 1
      ;;
    "")
      preflight_checks
      echo "Pre-flight checks passed. Sync not yet implemented."
      ;;
    *)
      echo "Error: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"
```

- [ ] **Step 2: Make executable and smoke-test pre-flight**

Run:
```bash
chmod +x scripts/sync-codecommit-repos.sh
./scripts/sync-codecommit-repos.sh --help
```

Expected: usage text printed, exit 0.

Run (requires valid AWS credentials):
```bash
./scripts/sync-codecommit-repos.sh
```

Expected: `Pre-flight checks passed. Sync not yet implemented.`

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-codecommit-repos.sh
git commit -m "feat: add CodeCommit sync script skeleton with pre-flight checks"
```

---

### Task 2: Implement `--deepen` mode

**Files:**
- Modify: `scripts/sync-codecommit-repos.sh`

- [ ] **Step 1: Add `deepen_repo` function and wire `--deepen` in `main`**

Replace the `main` function and add `deepen_repo` before it:

```bash
deepen_repo() {
  local name="$1"
  local path="$CODECOMMIT_ROOT/$name"

  if [[ -z "$name" ]]; then
    echo "Error: --deepen requires a repository name." >&2
    usage
    exit 1
  fi

  if [[ ! -d "$path/.git" ]]; then
    echo "Error: $path is not a git repository." >&2
    exit 1
  fi

  if [[ -f "$path/.git/shallow" ]]; then
    echo "Deepening $name ..."
    git -C "$path" fetch --unshallow
    echo "Done: $name now has full history."
  else
    echo "$name is already a full clone (no .git/shallow)."
  fi
}

main() {
  case "${1:-}" in
    -h|--help)
      usage
      exit 0
      ;;
    --deepen)
      preflight_checks
      deepen_repo "${2:-}"
      ;;
    "")
      preflight_checks
      echo "Pre-flight checks passed. Sync not yet implemented."
      ;;
    *)
      echo "Error: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
}
```

- [ ] **Step 2: Manual verify deepen on a shallow clone**

Run (after Task 3 provides a shallow clone, or create one manually):
```bash
git clone --depth 1 https://git-codecommit.us-east-1.amazonaws.com/v1/repos/KNOWN-REPO ~/Sites/codecommit/KNOWN-REPO
./scripts/sync-codecommit-repos.sh --deepen KNOWN-REPO
test ! -f ~/Sites/codecommit/KNOWN-REPO/.git/shallow && echo "PASS: shallow removed"
```

Expected: `Done: KNOWN-REPO now has full history.` and shallow file absent.

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-codecommit-repos.sh
git commit -m "feat: add --deepen support for CodeCommit sync script"
```

---

### Task 3: Implement sync loop (clone new, pull existing)

**Files:**
- Modify: `scripts/sync-codecommit-repos.sh`

- [ ] **Step 1: Add `sync_repo`, `list_repo_names`, and `sync_all` functions**

Insert before `deepen_repo`:

```bash
sync_repo() {
  local name="$1"
  local path="$CODECOMMIT_ROOT/$name"
  local url
  url="$(clone_url_for "$name")"

  if [[ -d "$path" && ! -d "$path/.git" ]]; then
    echo "WARN: skipping $name — directory exists but is not a git repo: $path" >&2
    return 1
  fi

  if [[ ! -d "$path/.git" ]]; then
    echo "Cloning $name ..."
    git clone --depth 1 "$url" "$path"
    echo "Cloned $name"
    return 0
  fi

  echo "Pulling $name ..."
  if git -C "$path" pull --ff-only; then
    echo "Pulled $name"
    return 0
  fi

  echo "WARN: pull failed for $name (local changes or diverged branch): $path" >&2
  return 1
}

list_repo_names() {
  aws_cmd codecommit list-repositories \
    --region "$CODECOMMIT_REGION" \
    --query 'repositories[].repositoryName' \
    --output text | tr '\t' '\n' | sed '/^$/d'
}

sync_all() {
  local names=() name
  local total=0 cloned=0 pulled=0 failed=0
  local -a failures=()

  while IFS= read -r name; do
    [[ -z "$name" ]] && continue
    names+=("$name")
  done < <(list_repo_names)

  if [[ ${#names[@]} -eq 0 ]]; then
    echo "No CodeCommit repositories found in $CODECOMMIT_REGION."
    return 0
  fi

  for name in "${names[@]}"; do
    total=$((total + 1))
    if [[ ! -d "$CODECOMMIT_ROOT/$name/.git" ]]; then
      if sync_repo "$name"; then
        cloned=$((cloned + 1))
      else
        failed=$((failed + 1))
        failures+=("$name")
      fi
    elif sync_repo "$name"; then
      pulled=$((pulled + 1))
    else
      failed=$((failed + 1))
      failures+=("$name")
    fi
  done

  echo
  echo "Synced $total repos: $cloned cloned, $pulled pulled, $failed failed"
  if [[ ${#failures[@]} -gt 0 ]]; then
    echo "Failed: ${failures[*]}"
  fi
  echo "Root: $CODECOMMIT_ROOT"

  if [[ $failed -gt 0 ]]; then
    return 1
  fi
  return 0
}
```

- [ ] **Step 2: Replace default branch in `main` to call `sync_all`**

Change the empty-argument branch in `main`:

```bash
    "")
      preflight_checks
      sync_all
      ;;
```

- [ ] **Step 3: Run first real sync**

Run:
```bash
./scripts/sync-codecommit-repos.sh
ls ~/Sites/codecommit/
```

Expected: one directory per CodeCommit repo; summary line with clone counts.

- [ ] **Step 4: Run second sync (pull mode)**

Run:
```bash
./scripts/sync-codecommit-repos.sh
```

Expected: `0 cloned, N pulled, 0 failed` (assuming no failures).

- [ ] **Step 5: Commit**

```bash
git add scripts/sync-codecommit-repos.sh
git commit -m "feat: sync all CodeCommit repos with clone and pull-on-rerun"
```

---

### Task 4: Add mocked integration test script

**Files:**
- Create: `scripts/test-sync-codecommit-repos.sh`

- [ ] **Step 1: Create test script**

```bash
#!/usr/bin/env bash
# Integration test for sync-codecommit-repos.sh using stubbed aws/git commands.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$ROOT/scripts/sync-codecommit-repos.sh"
TMP="$(mktemp -d)"
BIN="$TMP/bin"
REPOS_ROOT="$TMP/repos"
FAIL=0

cleanup() {
  rm -rf "$TMP"
}
trap cleanup EXIT

mkdir -p "$BIN" "$REPOS_ROOT"

cat >"$BIN/aws" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
case "$*" in
  *sts\ get-caller-identity*)
    exit 0
    ;;
  *codecommit\ list-repositories*)
    printf '%s\n' 'alpha' 'beta'
    exit 0
    ;;
  *)
    echo "unexpected aws call: $*" >&2
    exit 99
    ;;
esac
EOF

cat >"$BIN/git" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "config" && "${2:-}" == "--global" && "${3:-}" == "--get" ]]; then
  echo '!aws codecommit credential-helper $@'
  exit 0
fi
if [[ "${1:-}" == "config" ]]; then
  exit 0
fi
if [[ "${1:-}" == "-C" ]]; then
  exit 0
fi
if [[ "${1:-}" == "clone" ]]; then
  dest="${@: -1}"
  mkdir -p "$dest/.git"
  exit 0
fi
echo "unexpected git call: $*" >&2
exit 99
EOF

chmod +x "$BIN/aws" "$BIN/git"

export PATH="$BIN:$PATH"
export CODECOMMIT_ROOT="$REPOS_ROOT"
export CODECOMMIT_REGION="us-east-1"

assert_dir() {
  local path="$1"
  if [[ ! -d "$path/.git" ]]; then
    echo "FAIL: expected git repo at $path" >&2
    FAIL=1
  else
    echo "PASS: $path"
  fi
}

echo "Test: first sync clones repos"
"$SCRIPT" >/tmp/sync-test-1.log 2>&1 || { cat /tmp/sync-test-1.log; exit 1; }
assert_dir "$REPOS_ROOT/alpha"
assert_dir "$REPOS_ROOT/beta"

cat >"$BIN/git" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "config" && "${2:-}" == "--global" && "${3:-}" == "--get" ]]; then
  echo '!aws codecommit credential-helper $@'
  exit 0
fi
if [[ "${1:-}" == "config" ]]; then
  exit 0
fi
if [[ "${1:-}" == "-C" ]]; then
  if [[ "${3:-}" == "pull" ]]; then
    exit 0
  fi
  if [[ "${3:-}" == "fetch" ]]; then
    rm -f "${2:-}/.git/shallow"
    exit 0
  fi
fi
if [[ "${1:-}" == "clone" ]]; then
  dest="${@: -1}"
  mkdir -p "$dest/.git"
  exit 0
fi
echo "unexpected git call: $*" >&2
exit 99
EOF
chmod +x "$BIN/git"

echo "Test: second sync pulls existing repos"
"$SCRIPT" >/tmp/sync-test-2.log 2>&1 || { cat /tmp/sync-test-2.log; exit 1; }
grep -q "0 cloned, 2 pulled, 0 failed" /tmp/sync-test-2.log || {
  echo "FAIL: expected pull summary" >&2
  cat /tmp/sync-test-2.log
  FAIL=1
}

mkdir -p "$REPOS_ROOT/alpha/.git"
echo "1" >"$REPOS_ROOT/alpha/.git/shallow"
echo "Test: deepen removes shallow marker"
"$SCRIPT" --deepen alpha >/tmp/sync-test-3.log 2>&1 || { cat /tmp/sync-test-3.log; exit 1; }

if [[ $FAIL -ne 0 ]]; then
  echo "Some tests failed."
  exit 1
fi

echo "All mocked integration tests passed."
```

- [ ] **Step 2: Run test script**

Run:
```bash
chmod +x scripts/test-sync-codecommit-repos.sh
./scripts/test-sync-codecommit-repos.sh
```

Expected: `All mocked integration tests passed.`

Note: the test stubs `git config` globally — if the real credential helper check runs before PATH override affects `git`, ensure `preflight_checks` uses the stubbed `git config`. The stub returns exit 0 for all `git config` calls.

- [ ] **Step 3: Commit**

```bash
git add scripts/test-sync-codecommit-repos.sh
git commit -m "test: add mocked integration test for CodeCommit sync script"
```

---

### Task 5: Document usage in README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add Scripts section before Structure**

Insert after the Deploy section (before `## Structure`):

```markdown
## Scripts

### Sync CodeCommit repos for local analysis

Clones or updates all AWS CodeCommit repositories in `us-east-1` under `~/Sites/codecommit/`.

**Prerequisites:** AWS CLI configured, CodeCommit HTTPS credential helper (see `docs/superpowers/specs/2026-06-08-codecommit-bulk-clone-design.md`).

```bash
./scripts/sync-codecommit-repos.sh
./scripts/sync-codecommit-repos.sh --deepen my-repo
./scripts/test-sync-codecommit-repos.sh
```

Environment overrides: `CODECOMMIT_REGION`, `CODECOMMIT_ROOT`, `AWS_PROFILE`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document CodeCommit sync script usage"
```

---

### Task 6: Final verification against real AWS

**Files:** none (manual only)

- [ ] **Step 1: Confirm repo count**

Run:
```bash
aws codecommit list-repositories --region us-east-1 --query 'length(repositories)'
./scripts/sync-codecommit-repos.sh
find ~/Sites/codecommit -maxdepth 1 -mindepth 1 -type d | wc -l
```

Expected: directory count matches AWS repo count (minus any failed clones listed in summary).

- [ ] **Step 2: Confirm Cursor can index a repo**

Open `~/Sites/codecommit/{any-repo}` in Cursor and confirm file search works.

- [ ] **Step 3: Confirm deepen on one repo**

Run:
```bash
./scripts/sync-codecommit-repos.sh --deepen {any-repo}
git -C ~/Sites/codecommit/{any-repo} log --oneline | head
```

Expected: commit history beyond depth 1 if repo has multiple commits.

---

## Spec Coverage Checklist

| Spec requirement | Task |
|------------------|------|
| Layout `~/Sites/codecommit/{name}/` | Task 3 |
| All repos in us-east-1 | Task 3 (`list_repo_names`) |
| Shallow clone | Task 3 (`git clone --depth 1`) |
| `--deepen` | Task 2 |
| Pull on re-run | Task 3 (`git pull --ff-only`) |
| HTTPS credential helper auth | Task 1 preflight |
| Pre-flight checks | Task 1 |
| Per-repo continue on failure | Task 3 (`sync_all` counters) |
| Exit code 1 on partial failure | Task 3 (`sync_all` return) |
| Summary output | Task 3 |
| Env vars CODECOMMIT_REGION/ROOT, AWS_PROFILE | Task 1 |
| Manual verification | Task 6 |
| Out of scope items omitted | N/A |

## Self-Review Notes

- No TBD/TODO placeholders; full script bodies provided for Tasks 1–3.
- `sync_all` uses `while read` instead of `mapfile` for macOS bash 3.2 compatibility.
- Test git stub returns a credential helper value for `git config --global --get`.
- Deepen test stub removes `.git/shallow` on `git fetch`.
