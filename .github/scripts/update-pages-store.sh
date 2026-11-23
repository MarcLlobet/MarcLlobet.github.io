#!/usr/bin/env bash
#
# Keeps one slot (production/, or PR-<number>/) up to date on the
# pages-store branch — a plain git branch used purely as persistent
# storage between workflow runs, never served by GitHub Pages itself.
# Several of these can run concurrently (a push to main racing a PR
# update), so this retries on a rejected push rather than assuming it
# owns the branch.
#
# Required env:
#   MODE          "publish" or "cleanup"
#   SLOT          e.g. "production" or "PR-123"
#   COMMIT_MESSAGE
# Required for MODE=publish:
#   SOURCE_DIR    the built site to store (e.g. ./out)
set -euo pipefail

: "${MODE:?MODE is required}"
: "${SLOT:?SLOT is required}"
: "${COMMIT_MESSAGE:?COMMIT_MESSAGE is required}"

STORE_BRANCH="${STORE_BRANCH:-pages-store}"
MAX_ATTEMPTS=5
WORKTREE=".pages-store-worktree"

cleanup_worktree() {
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
}
trap cleanup_worktree EXIT

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  cleanup_worktree
  git fetch origin "$STORE_BRANCH" 2>/dev/null || true

  if git show-ref --quiet "refs/remotes/origin/$STORE_BRANCH"; then
    git worktree add "$WORKTREE" "origin/$STORE_BRANCH"
  else
    git worktree add --detach "$WORKTREE"
    (cd "$WORKTREE" && git checkout --orphan "$STORE_BRANCH" && git reset --hard && git clean -fdx)
  fi

  if [ "$MODE" = "cleanup" ]; then
    if [ ! -d "$WORKTREE/$SLOT" ]; then
      echo "Nothing to clean up at $SLOT."
      exit 0
    fi
    rm -rf "${WORKTREE:?}/${SLOT:?}"
  else
    : "${SOURCE_DIR:?SOURCE_DIR is required for MODE=publish}"
    rm -rf "${WORKTREE:?}/${SLOT:?}"
    mkdir -p "$WORKTREE/$SLOT"
    cp -r "$SOURCE_DIR/." "$WORKTREE/$SLOT/"
  fi

  status=0
  (
    cd "$WORKTREE"
    git add -A
    if git diff --cached --quiet; then
      echo "No changes to store."
      exit 0
    fi
    git -c user.name="github-actions[bot]" \
      -c user.email="github-actions[bot]@users.noreply.github.com" \
      commit --quiet -m "$COMMIT_MESSAGE"
    git push origin "HEAD:$STORE_BRANCH"
  ) || status=$?

  if [ "$status" -eq 0 ]; then
    echo "Stored successfully."
    exit 0
  fi

  echo "Push attempt $attempt failed (branch moved under us), retrying..."
  sleep $((attempt * 5))
done

echo "Failed to push to $STORE_BRANCH after $MAX_ATTEMPTS attempts." >&2
exit 1
