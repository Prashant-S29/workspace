#!/usr/bin/env python3
import evdev
import json
import subprocess
import sys
import os

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.json')

KEY_ALIASES = {
    'KEY_ENTER'     : 'enter',
    'KEY_KPENTER'   : 'enter',
    'KEY_SPACE'     : 'space',
    'KEY_BACKSPACE' : 'backspace',
    'KEY_TAB'       : 'tab',
    'KEY_ESC'       : 'esc',
    'KEY_LEFTCTRL'  : None,
    'KEY_RIGHTCTRL' : None,
    'KEY_LEFTSHIFT' : None,
    'KEY_RIGHTSHIFT': None,
    'KEY_LEFTALT'   : None,
    'KEY_RIGHTALT'  : None,
    'KEY_LEFTMETA'  : None,
    'KEY_RIGHTMETA' : None,
}

def load_config():
    with open(CONFIG_PATH) as f:
        return json.load(f)

def key_name(code):
    name = evdev.ecodes.KEY[code] if code in evdev.ecodes.KEY else None
    if name is None:
        return None
    if isinstance(name, list):
        name = name[0]
    if name in KEY_ALIASES:
        return KEY_ALIASES[name]
    # strip KEY_ prefix and lowercase: KEY_A -> a, KEY_1 -> 1
    if name.startswith('KEY_'):
        return name[4:].lower()
    return name.lower()

def find_keyboards():
    devices = []
    for path in evdev.list_devices():
        try:
            dev = evdev.InputDevice(path)
            cap = dev.capabilities()
            if evdev.ecodes.EV_KEY in cap:
                keys = cap[evdev.ecodes.EV_KEY]
                if evdev.ecodes.KEY_A in keys and evdev.ecodes.KEY_ENTER in keys:
                    devices.append(dev)
        except Exception:
            pass
    return devices

def main():
    config = load_config()
    keyboards = find_keyboards()
    if not keyboards:
        print('[FocusMode] No keyboards found', flush=True)
        sys.exit(1)

    print(f'[FocusMode] Listening on {len(keyboards)} keyboard(s)', flush=True)
    print(f'[FocusMode] Config keys: {list(config.keys())}', flush=True)

    held = set()
    import selectors
    sel = selectors.DefaultSelector()
    for kb in keyboards:
        sel.register(kb, selectors.EVENT_READ)

    while True:
        for key, _ in sel.select():
            dev = key.fileobj
            try:
                for event in dev.read():
                    if event.type != evdev.ecodes.EV_KEY:
                        continue
                    kev = evdev.categorize(event)
                    name = key_name(kev.scancode)

                    if kev.keystate == evdev.KeyEvent.key_down:
                        if name:
                            held.add(name)
                        # build combo string: modifiers first, then key
                        mods = []
                        for m in ['ctrl', 'shift', 'alt', 'super']:
                            if m in held:
                                mods.append(m)
                        non_mod = [k for k in held if k not in ('ctrl','shift','alt','super') and k is not None]
                        for k in non_mod:
                            combo = '+'.join(mods + [k]) if mods else k
                            print(f'[FocusMode] key: {combo}', flush=True)
                            if combo in config:
                                print(f'[FocusMode] playing: {config[combo]}', flush=True)
                                subprocess.Popen(['/usr/bin/aplay', config[combo]])

                    elif kev.keystate == evdev.KeyEvent.key_up:
                        held.discard(name)
            except Exception as e:
                print(f'[FocusMode] read error: {e}', flush=True)

if __name__ == '__main__':
    main()
