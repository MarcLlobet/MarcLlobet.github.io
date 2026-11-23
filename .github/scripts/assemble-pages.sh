#!/usr/bin/env bash
#
# Builds the single combined site that gets deployed via
# actions/deploy-pages: production's own build at the root, plus every
# open PR's stored build as its own PR-<number>/ subfolder. Pages'
# Actions source only ever serves one atomic deployment, so this
# reassembly is what lets production and every preview coexist on it.
#
# Required env:
#   OUT_DIR   where to write the combined site (e.g. ./combined)
set -euo pipefail

: "${OUT_DIR:?OUT_DIR is required}"

STORE_BRANCH="${STORE_BRANCH:-pages-store}"
WORKTREE=".pages-store-worktree"

cleanup_worktree() {
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
}
trap cleanup_worktree EXIT
cleanup_worktree

git fetch origin "$STORE_BRANCH"
git worktree add "$WORKTREE" "origin/$STORE_BRANCH"

if [ ! -d "$WORKTREE/production" ]; then
  echo "No production build has ever been stored on $STORE_BRANCH yet." >&2
  exit 1
fi

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
cp -r "$WORKTREE/production/." "$OUT_DIR/"

shopt -s nullglob
for pr_dir in "$WORKTREE"/PR-*/; do
  name="$(basename "$pr_dir")"
  cp -r "$pr_dir" "$OUT_DIR/$name"
done

echo "Assembled $(find "$OUT_DIR" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ') top-level entries into $OUT_DIR."
