#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$HOME/prashant_workspace/gigs/workspace"
EXT_SRC="$WORKSPACE/dotfiles/gnome/extensions/focus-mode@local"
EXT_DST="$HOME/.local/share/gnome-shell/extensions/focus-mode@local"
FOCUS_DIR="$WORKSPACE/focus_mode"

echo "── Installing Focus Mode extension ──────────────────────────"

mkdir -p "$EXT_DST"
cp "$EXT_SRC/extension.js" "$EXT_DST/"
cp "$EXT_SRC/metadata.json" "$EXT_DST/"
echo "✔  Extension files copied to $EXT_DST"

mkdir -p "$FOCUS_DIR/tracks"

if [ ! -f "$FOCUS_DIR/config.json" ]; then
    cat > "$FOCUS_DIR/config.json" << 'CONF'
{}
CONF
    echo "✔  Created blank config at $FOCUS_DIR/config.json"
else
    echo "✔  config.json already exists — leaving untouched"
fi

if command -v gnome-extensions &>/dev/null; then
    gnome-extensions enable focus-mode@local && \
        echo "✔  Extension enabled" || \
        echo "⚠  Enable failed — try: gnome-extensions enable focus-mode@local"
else
    echo "⚠  gnome-extensions CLI not found — enable manually in Extensions app"
fi

echo ""
echo "── Done! ────────────────────────────────────────────────────"
echo "   Reload GNOME Shell:  Alt+F2 → type 'r' → Enter"
echo "   (Wayland: log out and back in)"
echo ""
echo "   Edit config:   $FOCUS_DIR/config.json"
echo "   Drop sounds:   $FOCUS_DIR/tracks/"
