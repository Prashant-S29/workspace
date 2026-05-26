# keyboard-toggle@local

A GNOME Shell quick settings toggle to disable/enable your keyboard.

## Use case
Put notes on top of your laptop keyboard while watching a video
without random keypresses interrupting playback.

## How it works
Uses the Linux kernel (5.11+) `inhibited` sysfs property to block
keyboard input at the kernel level — works natively on Wayland.
The keyboard device path is resolved dynamically on every toggle,
so it survives reboots even if the input device number changes.

## Works on
- Ubuntu 24.04 / GNOME 46
- Wayland (no xinput, no evtest)
- Kernel 5.11+

## Setup
```bash
bash setup.sh
```
Reboot when prompted, then enable the extension:
```bash
gnome-extensions enable keyboard-toggle@local
```

## The toggle
Appears in the GNOME quick settings panel (top-right, same row as Dark Style).
Orange = keyboard active. Grey = keyboard disabled.

## Notes
- Works for built-in laptop keyboard
- Keyboard is always re-enabled when extension is disabled or on reboot
- No sudo password needed at toggle time (udev rule handles permissions)
