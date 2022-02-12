const { Meta, Gtk, Gio, GLib, St, Shell } = imports.gi;

const Main = imports.ui.main;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

function createIcon(mimeType, size) {
    let symbolicIcon = mimeType ? Gio.content_type_get_symbolic_icon(mimeType)?.to_string() : null;
    return symbolicIcon
        ? new St.Icon({ gicon: Gio.icon_new_for_string(symbolicIcon), icon_size: size })
        : new St.Icon({ icon_name: 'icon-missing', icon_size: size });
}

var RecentFilesSearchProvider = class {
    constructor() {
        this.id = 'arcmenu.recent-files';
        this.isRemoteProvider = true;
        this.canLaunchSearch = true;

        this._recentFiles = [];
        this.recentManager = new Gtk.RecentManager();

        this.appInfo = {
            get_description: () => _('Recent Files'),
            get_name: () => _('Recent Files'),
            get_id: () => 'arcmenu.recent-files',
            get_icon: () => Gio.icon_new_for_string('document-open-recent-symbolic'),
        }
    }

    getResultMetas(fileUris, callback) {
        const metas = fileUris.map(fileUri => {
            const rf = this._getRecentFile(fileUri);
            return rf ? {
                id: fileUri,
                name: rf.item.get_display_name(),
                description: rf.item.get_uri_display().replace(rf.item.get_display_name(), ''),
                createIcon: (size) => createIcon(rf.item.get_mime_type(), size),
            } : undefined;
        }).filter(m => m?.name !== undefined && m?.name !== null);

        callback(metas);
    }

    filterResults(results, maxNumber) {
        return results.slice(0, maxNumber);
    }

    getInitialResultSet(terms, callback, _cancellable) {
        this._recentFiles = this.recentManager.get_items().map(item => {
            let file = Gio.File.new_for_uri(item.get_uri());
            if(file !== null)
                return {
                    item,
                    file
                }
        }).filter(rf => rf !== undefined);

        callback(this._getFilteredFileUris(terms, this._recentFiles));
    }

    getSubsearchResultSet(previousResults, terms, callback, _cancellable) {
        const recentFiles = previousResults.map(fileUri => this._getRecentFile(fileUri)).filter(rf => rf !== undefined);
        callback(this._getFilteredFileUris(terms, recentFiles));
    }

    activateResult(fileUri, _terms) {
        const recentFile = this._getRecentFile(fileUri)?.file;
        if (recentFile){
            let launchContext = global.create_app_launch_context(0, -1);
            Gio.AppInfo.launch_default_for_uri(recentFile.get_uri(), launchContext);
        }
    }

    launchSearch() {
        let launchContext = global.create_app_launch_context(0, -1);
        
        Gio.AppInfo.launch_default_for_uri('recent:///', launchContext);
    }

    _getFilteredFileUris(terms, recentFiles) {
        terms = terms.map(term => term.toLowerCase());
        recentFiles = recentFiles.filter(rf => {
            if (!rf.item.exists())
                return false;
            const fileName = rf.item.get_display_name()?.toLowerCase();
            const uri = rf.item.get_uri()?.toLowerCase();
            const fileDescription = rf.item.get_description()?.toLowerCase();
            return terms.some(term => fileName?.includes(term) || uri?.includes(term) || fileDescription?.includes(term));
        });

        return recentFiles.map(rf => rf.file.get_uri());
    }

    _getRecentFile(fileUri) {
        return this._recentFiles.find(rf => rf.file.get_uri() === fileUri);
    }
}
