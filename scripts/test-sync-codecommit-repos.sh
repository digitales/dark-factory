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

write_git_stub() {
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
  chmod +x "$BIN/git"
}

cat >"$BIN/aws" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
case "$*" in
  *sts\ get-caller-identity*)
    exit 0
    ;;
  *codecommit\ list-repositories*)
    printf '%s\t%s\n' 'alpha' 'beta'
    exit 0
    ;;
  *)
    echo "unexpected aws call: $*" >&2
    exit 99
    ;;
esac
EOF

chmod +x "$BIN/aws"
write_git_stub

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
if [[ -f "$REPOS_ROOT/alpha/.git/shallow" ]]; then
  echo "FAIL: shallow marker still present after deepen" >&2
  FAIL=1
else
  echo "PASS: shallow marker removed"
fi

if [[ $FAIL -ne 0 ]]; then
  echo "Some tests failed."
  exit 1
fi

echo "All mocked integration tests passed."
