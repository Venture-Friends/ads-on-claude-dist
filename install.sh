#!/bin/sh
# ads-on-claude installer (macOS / Linux)
#   curl -fsSL https://<host>/install.sh | sh
#
# Thin by design: detect prerequisites, download the bundles, then hand off the
# settings.json wiring to the real (tested) installer.
set -eu

BASE_URL="${AOC_BASE_URL:-https://raw.githubusercontent.com/Venture-Friends/ads-on-claude-dist/main}"
INSTALL_DIR="${AOC_HOME:-$HOME/.ads-on-claude}"

if ! command -v node >/dev/null 2>&1; then
  echo "ads-on-claude needs Node.js (you already have it if you run Claude Code)." >&2
  echo "Install Node, then re-run this command." >&2
  exit 1
fi

echo "Downloading ads-on-claude..."
mkdir -p "$INSTALL_DIR"
for f in aoc.mjs statusline.mjs; do
  curl -fsSL "$BASE_URL/$f" -o "$INSTALL_DIR/$f"
done

echo "Wiring Claude Code..."
AOC_HOME="$INSTALL_DIR" node "$INSTALL_DIR/aoc.mjs" install

echo "Done. Open or restart Claude Code to see your footer."
