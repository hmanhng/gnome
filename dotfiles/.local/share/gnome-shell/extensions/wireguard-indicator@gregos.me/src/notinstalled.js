const Lang = imports.lang;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Base = Me.imports.src.base;
const PopupMenu = imports.ui.popupMenu;
const Tools = Me.imports.src.tools;


function myLog(msg) {
    log(`[wg-notinstalled] ${msg}`);
}

var NotInstalledIndicator = class NotInstalledIndicator extends Base.BaseIndicator {
    constructor (done) {
        super();
        this._done=done;
        this.createMenu();
    }
    createMenu() {
        super.createMenu();
        let notInstalledLabel = new PopupMenu.PopupMenuItem(_('Installation required.'), {reactive: false});
        this.section.addMenuItem(notInstalledLabel);

        this.attemptInstallationLabel = new PopupMenu.PopupMenuItem(_('Attempt installation'), {reactive: true});
        this.attemptInstallationLabel.connect('activate', Tools.install.bind(null, this._done));
        this.section.addMenuItem(this.attemptInstallationLabel);   
    }
}