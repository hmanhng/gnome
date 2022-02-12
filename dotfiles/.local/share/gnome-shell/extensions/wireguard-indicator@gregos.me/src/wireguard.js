"use strict";


const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Systemd = Me.imports.src.systemd;
const Base = Me.imports.src.base;

function myLog(msg) {
    log(`[wg-wireguard] ${msg}`);
}

var WireguardIndicator = class WireguardIndicator extends Base.BaseIndicator {
    constructor() {
        super();
        this._systemd = new Systemd.Control(8);
        this.systemd_state = "systemd-not-available";
        this._systemd.connect("state-changed", this._onSystemdStateChanged.bind(this));
        this._systemd.update();
        this.item_switch = null;
    }

    _onSwitch(actor, event) {
        if (actor.state) {
            this._systemd.startService();
            this._systemd.setUpdateInterval(1, 8);
        } else {
            this._systemd.stopService();
            this._systemd.setUpdateInterval(1, 8);
        }
        this._systemd.update();
    }

    _onSystemdStateChanged(control, state) {
        myLog("state "+ state);
        switch (state) {
            case "systemd-not-available":
            case "unit-not-loaded":
                myLog("systemd unit “wg-quick@wg0.service” not loaded");
                if (this.item_switch !== null) {
                    this.item_switch.disconnect(this._switchNotifyId);
                    this.item_switch.destroy();
                    this.item_switch = null;
                }
                break;
            case "inactive":
            case "active":
                if (this.item_switch === null) {
                    this.item_switch = new PopupMenu.PopupSwitchMenuItem("Wireguard", false, null);
                    this._switchNotifyId = this.item_switch.connect("activate", this._onSwitch.bind(this));
                    this.menu.addMenuItem(this.item_switch, 0);
                }
                if (state === "active") {
                    this.item_switch.setToggleState(true);
                } else {
                    this.item_switch.setToggleState(false);
                }
                break;
            default:
                throw `Unknown systemd state: ${state}`;
        }
        this.systemd_state = state;
        this._updateStatusIcon();
    }
    _updateStatusIcon() {
        if (this.systemd_state === "active") {
            this.icon.gicon = this._getIcon("green");
        } else if (this.systemd_state === "inactive") {
            this.icon.gicon = this._getIcon("red");
        } else {
            this.icon.gicon = this._getIcon("gray");
        }
    }
}