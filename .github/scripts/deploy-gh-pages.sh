#!/usr/bin/env bash
#
# Publishes (or removes) one directory's worth of content on the gh-pages
# branch, alongside whatever else already lives there — production at the
# branch root, each PR preview in its own PR-<number>/ folder. Several of
# these can run concurrently (a push to main racing a PR build), so this
# retries on a rejected push instead of assuming it owns the branch.
#
# Required env:
#   MODE          "publish" or "cleanup"
#   DEST_DIR      "." for the branch root, or "PR-123" for a preview
#   COMMIT_MESSAGE
# Required for MODE=publish:
#   SOURCE_DIR    the built site to copy (e.g. ./out)
set -euo pipefail

: "${MODE:?MODE is required}"
: "${DEST_DIR:?DEST_DIR is required}"
: "${COMMIT_MESSAGE:?COMMIT_MESSAGE is required}"

MAX_ATTEMPTS=5
WORKTREE=".gh-pages-worktree"

cleanup_worktree() {
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
}
trap cleanup_worktree EXIT

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  cleanup_worktree
  git fetch origin gh-pages 2>/dev/null || true

  if git show-ref --quiet refs/remotes/origin/gh-pages; then
    git worktree add "$WORKTREE" origin/gh-pages
  else
    git worktree add --detach "$WORKTREE"
    (cd "$WORKTREE" && git checkout --orphan gh-pages && git reset --hard && git clean -fdx)
  fi

  if [ "$MODE" = "cleanup" ]; then
    if [ ! -d "$WORKTREE/$DEST_DIR" ]; then
      echo "Nothing to clean up at $DEST_DIR."
      exit 0
    fi
    rm -rf "${WORKTREE:?}/${DEST_DIR:?}"
  else
    : "${SOURCE_DIR:?SOURCE_DIR is required for MODE=publish}"
    if [ "$DEST_DIR" = "." ]; then
      # Production deploy: replace everything at the root except other
      # PRs' own preview folders (and the worktree's own .git pointer file).
      find "$WORKTREE" -mindepth 1 -maxdepth 1 \
        ! -name 'PR-*' ! -name '.git' -exec rm -rf {} +
      cp -r "$SOURCE_DIR/." "$WORKTREE/"
    else
      rm -rf "${WORKTREE:?}/${DEST_DIR:?}"
      mkdir -p "$WORKTREE/$DEST_DIR"
      cp -r "$SOURCE_DIR/." "$WORKTREE/$DEST_DIR/"
    fi
    # GitHub Pages ignores dot-prefixed directories (e.g. Next's own
    # _next/ is fine, but without this it also runs a Jekyll build we
    # don't want or need).
    touch "$WORKTREE/.nojekyll"
  fi

  status=0
  (
    cd "$WORKTREE"
    git add -A
    if git diff --cached --quiet; then
      echo "No changes to deploy."
      exit 0
    fi
    git -c user.name="github-actions[bot]" \
      -c user.email="github-actions[bot]@users.noreply.github.com" \
      commit --quiet -m "$COMMIT_MESSAGE"
    git push origin HEAD:gh-pages
  ) || status=$?

  if [ "$status" -eq 0 ]; then
    echo "Deployed successfully."
    exit 0
  fi

  echo "Push attempt $attempt failed (branch moved under us), retrying..."
  sleep $((attempt * 5))
done

echo "Failed to push to gh-pages after $MAX_ATTEMPTS attempts." >&2
exit 1
