#!/usr/bin/env bash
set -euo pipefail

log_file="submodule-branches.log"
: > "$log_file"
export LOG_FILE="$PWD/$log_file"

git submodule foreach --quiet --recursive '
  case "$displaypath" in
    vendor/*|sources/*)
      url=$(git remote get-url origin 2>/dev/null || echo "no-origin")
      branch=$(
        git symbolic-ref --short -q HEAD ||
        printf "DETACHED@%s" "$(git rev-parse --short HEAD)"
      )
      line="$(basename "$displaypath") ($url): $branch"
      printf "%s\n" "$line" | tee -a "$LOG_FILE"
      ;;
  esac
'
