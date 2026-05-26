#!/bin/bash

# Dynamically find the keyboard sysfs path
SYSFS_PATH=$(grep -rl "AT Translated Set 2 keyboard" /sys/class/input/*/name 2>/dev/null | head -1 | sed 's|/name||')

if [ -z "$SYSFS_PATH" ]; then
    echo "ERROR: Keyboard device not found" >&2
    exit 1
fi

INHIBIT="$SYSFS_PATH/inhibited"

case "$1" in
    disable) echo 1 | tee "$INHIBIT" ;;
    enable)  echo 0 | tee "$INHIBIT" ;;
    status)  cat "$INHIBIT" ;;
    *)       echo "Usage: $0 {enable|disable|status}" >&2; exit 1 ;;
esac
