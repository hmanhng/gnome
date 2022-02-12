
const Lang = imports.lang;
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Gio = imports.gi.Gio;
const Main = imports.ui.main;

function myLog(msg) {
    log(`[wg-base] ${msg}`);
}



// var BaseMenu = new Lang.Class({
//     Name: "BaseMenu",
//     Extends: PanelMenu.Button,
//     _getIcon(statusColor) {
//         let path = Me.dir.get_path() + "/icons/wireguard-" + statusColor + ".svg";
//         let gicon = Gio.icon_new_for_string(path);
//         return gicon;
//     },
//     _init() {
//         this.parent(0.0, "Wireguard", false);
//         this._initButton();
//         this._initMenu();
//     },
//     _initButton() {
//         let box = new St.BoxLayout();
//         this.add_actor(box);
//         this._wireguardIcon = new St.Icon({ gicon: this._getIcon("gray"),
//                                           style_class: "system-status-icon" });
//         box.add_child(this._wireguardIcon);
//     },
//     _initMenu() {
//     },

    
// });
var BaseIndicator = class BaseIndicator {

    constructor() {
        this._mainButton = new PanelMenu.Button(null, 'wg');
        this.menu = this._mainButton.menu;
        this.actor = this._mainButton;
        Main.panel.menuManager.addMenu(this.menu);
        this.hbox = new St.BoxLayout();
        this.icon = new St.Icon({
            gicon: this._getIcon('gray'),
            style_class: 'system-status-icon'
        });
        this.hbox.add_child(this.icon);
    }


    _getIcon(statusColor) {
        let path = Me.dir.get_path() + "/icons/wireguard-" + statusColor + ".svg";
        let gicon = Gio.icon_new_for_string(path);
        return gicon;
    }

    createMenu() {
        this.menu.removeAll(); // clear the menu in case we are recreating the menu
        this.section = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(this.section);
    }

    disable() {
        this.actor.remove_actor(this.hbox);
    }

    enable() {
        this.actor.add_actor(this.hbox);
    }
    destroy() {
        this._mainButton.destroy();
    }



}



var BaseMenu = new Lang.Class({
    Name: "BaseMenu",
    Extends: PanelMenu.Button,
    _getIcon(statusColor) {
        let path = Me.dir.get_path() + "/icons/wireguard-" + statusColor + ".svg";
        let gicon = Gio.icon_new_for_string(path);
        return gicon;
    },
    _init() {
        this.parent(0.0, "Wireguard", false);
        this._initButton();
        this._initMenu();
    },
    _initButton() {
        let box = new St.BoxLayout();
        this.add_actor(box);
        this._wireguardIcon = new St.Icon({ gicon: this._getIcon("gray"),
                                          style_class: "system-status-icon" });
        box.add_child(this._wireguardIcon);
    },
    _initMenu() {
    },

    
});

