#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Copying extension files..."
mkdir -p ~/.local/share/gnome-shell/extensions/keyboard-toggle@local
cp "$SCRIPT_DIR/extension.js" ~/.local/share/gnome-shell/extensions/keyboard-toggle@local/
cp "$SCRIPT_DIR/metadata.json" ~/.local/share/gnome-shell/extensions/keyboard-toggle@local/

echo "==> Installing toggle-keyboard system script..."
sudo cp "$SCRIPT_DIR/toggle-keyboard.sh" /usr/local/bin/toggle-keyboard.sh
sudo chmod +x /usr/local/bin/toggle-keyboard.sh

echo "==> Setting up udev rule for keyboard inhibit permissions..."
sudo tee /etc/udev/rules.d/99-keyboard-inhibit.rules > /dev/null << 'UDEV'
SUBSYSTEM=="input", ATTRS{name}=="AT Translated Set 2 keyboard", ACTION=="add", RUN+="/bin/chmod a+w /sys%p/inhibited"
UDEV
sudo udevadm control --reload-rules
sudo udevadm trigger

echo ""
echo "✓ Done! Please reboot for the GNOME extension to be detected."
read -p "Reboot now? [y/N] " choice
if [[ "$choice" =~ ^[Yy]$ ]]; then
    sudo reboot
else
    echo "Run 'gnome-extensions enable keyboard-toggle@local' after next reboot."
fi
