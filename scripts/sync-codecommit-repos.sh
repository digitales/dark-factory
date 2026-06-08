#!/usr/bin/env bash
# Sync all CodeCommit repos in a region to ~/Sites/edi/ for local analysis.
# Requires: aws CLI, git, CodeCommit HTTPS credential helper (see design spec).

set -euo pipefail

CODECOMMIT_REGION="${CODECOMMIT_REGION:-us-east-1}"
CODECOMMIT_ROOT="${CODECOMMIT_ROOT:-$HOME/Sites/edi}"
CODECOMMIT_AWS_PROFILE="${CODECOMMIT_AWS_PROFILE:-CodeCommitReader-710388360265}"
CODECOMMIT_HOST="git-codecommit.${CODECOMMIT_REGION}.amazonaws.com"

# Export so git's CodeCommit credential helper uses the same profile as aws_cmd.
export AWS_PROFILE="${AWS_PROFILE:-$CODECOMMIT_AWS_PROFILE}"

usage() {
  cat <<EOF
Usage:
  $(basename "$0")                 Sync all repos (clone new, pull existing)
  $(basename "$0") --deepen NAME   Fetch full history for one local repo

Environment:
  CODECOMMIT_REGION       AWS region (default: us-east-1)
  CODECOMMIT_ROOT         Local clone root (default: ~/Sites/edi)
  CODECOMMIT_AWS_PROFILE  AWS CLI profile (default: CodeCommitReader-710388360265)
  AWS_PROFILE             Overrides CODECOMMIT_AWS_PROFILE when set
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
      sync_all
      ;;
    *)
      echo "Error: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"
