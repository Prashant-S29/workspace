import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const { QuickToggle, SystemIndicator } = QuickSettings;

const VENV_PYTHON  = '/home/prashantsingh/prashant_workspace/gigs/workspace/focus_mode/venv/bin/python3';
const LISTENER     = '/home/prashantsingh/prashant_workspace/gigs/workspace/focus_mode/listener.py';
const PIDFILE      = '/tmp/focusmode.pid';

function startListener() {
    let ret = GLib.spawn_command_line_async(
        `bash -c '${VENV_PYTHON} ${LISTENER} & echo $! > ${PIDFILE}'`
    );
    log('[FocusMode] listener started, spawn ok: ' + ret);
}

function stopListener() {
    GLib.spawn_command_line_async(
        `bash -c 'if [ -f ${PIDFILE} ]; then kill $(cat ${PIDFILE}) 2>/dev/null; rm ${PIDFILE}; fi'`
    );
    log('[FocusMode] listener stopped');
}

const FocusModeToggle = GObject.registerClass(
class FocusModeToggle extends QuickToggle {
    _init() {
        super._init({
            title: 'Focus Mode',
            iconName: 'audio-headphones-symbolic',
            toggleMode: true,
        });
        this.checked = false;
        this.connect('clicked', () => {
            if (this.checked) startListener();
            else stopListener();
        });
    }

    destroy() {
        stopListener();
        super.destroy();
    }
});

const FocusModeIndicator = GObject.registerClass(
class FocusModeIndicator extends SystemIndicator {
    _init() {
        super._init();
        this.quickSettingsItems.push(new FocusModeToggle());
    }
});

export default class FocusModeExtension extends Extension {
    enable() {
        this._indicator = new FocusModeIndicator();
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        stopListener();
        this._indicator?.quickSettingsItems.forEach(i => i.destroy());
        this._indicator?.destroy();
        this._indicator = null;
    }
}
