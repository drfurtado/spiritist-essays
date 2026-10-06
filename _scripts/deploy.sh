#!/usr/bin/env bash
# _scripts/deploy.sh
#
# Build the bilingual site with babelquarto and publish it to GitHub Pages.
#
# Usage (from anywhere in the project):
#   _scripts/deploy.sh
#
# What it does:
#   1. Renders the full EN + PT site into _site/ (a clean build).
#   2. Checks that both language home pages were produced.
#   3. Force-pushes the contents of _site/ to the gh-pages branch of origin.
#
# The gh-pages branch holds only build output, so its history is replaced on
# every deploy. Source changes are NOT committed by this script; commit and
# push main separately.

set -euo pipefail

cd "$(dirname "$0")/.."

remote_url=$(git remote get-url origin)
site_url=$(sed -n 's/^  site-url: *"\{0,1\}\([^"]*\)"\{0,1\}$/\1/p' _quarto.yml)
source_sha=$(git rev-parse --short HEAD)

if [ -n "$(git status --porcelain)" ]; then
  echo "[deploy] Note: you have uncommitted changes. They will be deployed but not committed."
fi

echo "[deploy] Rendering site (EN + PT)..."
rm -rf _site
Rscript -e 'babelquarto::render_website()'

# Remove empty scratch files left behind by the render
find . -name '*.spl' -size 0 -not -path './_site/*' -delete

for page in _site/index.html _site/pt/index.html; do
  if [ ! -f "$page" ]; then
    echo "[deploy] ERROR: $page was not produced. Aborting." >&2
    exit 1
  fi
done

# Serve files as-is (no Jekyll processing on GitHub Pages)
touch _site/.nojekyll

echo "[deploy] Publishing to gh-pages..."
tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT
cp -R _site/. "$tmp_dir"/
(
  cd "$tmp_dir"
  git init -q -b gh-pages
  git add -A
  git commit -q -m "Deploy site from $source_sha"
  git push -q -f "$remote_url" gh-pages
)

echo "[deploy] Done. GitHub Pages usually updates within a minute:"
echo "         ${site_url}/"
