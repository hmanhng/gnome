"use strict";
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const NotInstalled = Me.imports.src.notinstalled;
const Wireguard = Me.imports.src.wireguard;
const Tools = Me.imports.src.tools;

let _indicator;
let _install_test;

function myLog(msg) {
    log(`[wg-main] ${msg}`);
}

const _enableIndicator = () => {
    Main.panel.addToStatusArea('wireguard', _indicator._mainButton);
    _indicator.enable();
};

function init () {
    myLog("init");
}


function enable () {
    myLog("enable");
    _install_test = Tools.test();
    if (!_install_test) {
        _indicator = new NotInstalled.NotInstalledIndicator(function (success) {
            if (success)
            {
                disable();
                enable();
            }
        });
    } else {
        _indicator = new Wireguard.WireguardIndicator();
    }
    _enableIndicator();
}

function disable () {
    myLog("disable");
    if (_indicator != null) {
        _indicator.disable();
        _indicator.destroy();
    }
}
