import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const {QuickToggle, SystemIndicator} = QuickSettings;

function isKeyboardDisabled() {
    try {
        let result = GLib.spawn_command_line_sync(
            'grep -rl "AT Translated Set 2 keyboard" /sys/class/input/ --include=name'
        );
        let sysfsDir = new TextDecoder().decode(result[1]).trim().replace('/name', '');
        let [ok, out] = GLib.spawn_command_line_sync('cat ' + sysfsDir + '/inhibited');
        return new TextDecoder().decode(out).trim() === '1';
    } catch(e) { return false; }
}

const KeyboardToggle = GObject.registerClass(
class KeyboardToggle extends QuickToggle {
    _init() {
        super._init({
            title: 'Keyboard',
            iconName: 'input-keyboard-symbolic',
            toggleMode: true,
        });
        this.checked = !isKeyboardDisabled();
        this.connect('clicked', () => {
            const action = this.checked ? 'enable' : 'disable';
            GLib.spawn_command_line_async('/usr/local/bin/toggle-keyboard.sh ' + action);
        });
    }
});

const KeyboardIndicator = GObject.registerClass(
class KeyboardIndicator extends SystemIndicator {
    _init() {
        super._init();
        this.quickSettingsItems.push(new KeyboardToggle());
    }
});

export default class KeyboardToggleExtension extends Extension {
    enable() {
        this._indicator = new KeyboardIndicator();
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }
    disable() {
        GLib.spawn_command_line_async('/usr/local/bin/toggle-keyboard.sh enable');
        this._indicator?.quickSettingsItems.forEach(i => i.destroy());
        this._indicator?.destroy();
        this._indicator = null;
    }
}
