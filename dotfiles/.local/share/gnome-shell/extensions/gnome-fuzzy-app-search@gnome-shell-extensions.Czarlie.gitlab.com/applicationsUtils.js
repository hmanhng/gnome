/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
"use strict";

// import modules
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const IndexUtils = Me.imports.indexUtils;
const Scorer = Me.imports.scorer;
const Tokenizer = Me.imports.tokenizer;

const Lang = imports.lang;
const Gio = imports.gi.Gio;

const NAME_WEIGHT = 8;
const KEYWORD_WEIGHT = 3;
const DESCRIPTION_WEIGHT = 1;

const N_GRAM_MAX_LENGTH = 6;

let refreshingIndex = false;

/* TODO Add power-off, logout, suspend, (hibernate?),
        which aren't apps (?) but still show up in vanilla GNOME's results */

/**
 * Get AppSearchProvider from registered
 * providers. There is try/catch block
 * here because imports.ui.main is part
 * of gnome-shell and can not be used
 * in prefs.js.
 *
 * @return {Mixed}
 */
var provider = () => {
    try {
        const Main = imports.ui.main;
        const AppDisplay = imports.ui.appDisplay;

        let result = null;

        let searchController;

        // GNOME 3.xx
        if (Main.overview.viewSelector !== undefined)
            searchController = Main.overview.viewSelector;
        // GNOME >= 40
        else
            searchController =
                Main.overview._overview.controls._searchController;

        searchController._searchResults._providers.forEach((item) => {
            if (!result && item instanceof AppDisplay.AppSearchProvider)
                result = item;
        });

        return result;
    } catch (e) {
        return null;
    }
};

var Search = new Lang.Class({
    Name: "AppUtilsSearch",

    /**
     * Constructor
     *
     * @return {Void}
     */
    _init: function () {
        const stringTokenizer =
            Tokenizer.getStringNgramTokenizer(N_GRAM_MAX_LENGTH);
        const keywordsTokenizer =
            Tokenizer.getKeywordArrayNgramTokenizer(N_GRAM_MAX_LENGTH);

        this.index = new IndexUtils.Index(
            "applications",
            ["id", "name", "display_name", "description", "keywords"],
            Scorer.getTokenizedScorer([
                {
                    keys: ["name", "display_name"],
                    weight: NAME_WEIGHT,
                    tokenizer: stringTokenizer,
                },
                {
                    key: "keywords",
                    weight: KEYWORD_WEIGHT,
                    tokenizer: keywordsTokenizer,
                },
                {
                    key: "description",
                    weight: DESCRIPTION_WEIGHT,
                    tokenizer: stringTokenizer,
                },
            ]),
            keywordsTokenizer
        );

        this._appInfoMonitorHandlerId = Gio.AppInfoMonitor.get().connect(
            "changed",
            Lang.bind(this, this._handleMonitorChanged)
        );

        this.refreshAgain = false;

        this.refresh();
    },

    /**
     * Destructor
     *
     * @return {Void}
     */
    destroy: function () {
        Gio.AppInfoMonitor.get().disconnect(this._appInfoMonitorHandlerId);
    },

    /**
     * Refresh data
     *
     * @return {Void}
     */
    refresh: function () {
        // Prevent multiple calls of refresh() from happening at the same time,
        // since writing index operations aren't thread-safe (for now, at least)

        // refreshingIndex is not an attribute because the Search object may be
        // discarded and swapped for a new instance during runtime (e.g. when
        // disabling and re-enabling the provider in the extension settings)
        if (refreshingIndex) {
            this.refreshAgain = true;
            return;
        }

        this.refreshAgain = false;
        refreshingIndex = true;

        this.index
            .updateIndex(
                Gio.AppInfo.get_all()
                    .filter((appInfo) => appInfo.should_show())
                    .map(this._appInfoToObj)
            )
            .then(() => {
                // If refresh() was called while another refresh was in progress, refresh again.
                refreshingIndex = false;
                if (this.refreshAgain) {
                    this.refresh();
                }
            })
            .catch((error) =>
                logError(
                    error,
                    `${Me.metadata.uuid}: applications: refresh failed with error:`
                )
            );
    },

    /**
     * Get whether the Search object is fully initialized yet
     *
     * @return {boolean} Whether the Search object is ready to be used.
     */
    isReady: function () {
        return this.index.isReady();
    },

    /**
     * Get list of application ids by string query, split into terms
     *
     * @async
     *
     * @param  {string[]} query - An array of search terms (split at whitespace)
     *
     * @return {string[]} - A promise resolving to an array of appinfo ID's
     */
    find: async function (query) {
        // 6 because GNOME only shows six results for application search
        const appInfos = await this.index.find(query, 6);
        return appInfos.map((appInfo) => appInfo.id);
    },

    /**
     * Function to be called once the Search is ready
     * @callback readyCallback
     */

    /**
     * Call a function when the Search is ready to be used.
     *
     * Overwrites any previous functions passed to this method.
     *
     * @param {readyCallback} callback - The function to call once the search is up and running
     * @return {Void}
     */
    setReadyCallback: function (callback = () => {}) {
        this.index.setReadyCallback(callback);
    },

    /**
     * A vanilla Object with the properties of a Gio.AppInfo object.
     * Conveniently JSON-stringifiable.
     *
     * This doesn't use the conventional camelCase,
     * but snake_case to at least be consistent with Gio.AppInfo.
     *
     * @typedef {Object} AppInfoObject
     * @property {string} id - The ID of the appinfo (usually, filename of desktop file)
     * @property {string} name - The name of the application
     * @property {?string} display_name - The display name of the application
     * @property {?string} description - A description of the application
     * @property {string[]} keywords - Some keywords that can also be used to find the application
     */

    /**
     * Extract all relevant data from an Gio.AppInfo and turn it into a vanilla Object.
     *
     * @param  {Gio.AppInfo} appInfo - The Gio.AppInfo to convert
     * @return {AppInfoObject} A vanilla JS Object with all search-relevant keys
     */
    _appInfoToObj: function (appInfo) {
        return {
            id: appInfo.get_id(),
            name: appInfo.get_name(),
            display_name: appInfo.get_display_name(),
            description: appInfo.get_description(),
            keywords: appInfo.get_keywords ? appInfo.get_keywords() : [],
        };
    },

    /**
     * File monitor changed event handler
     *
     * @return {Void}
     */
    _handleMonitorChanged: function () {
        this.refresh();
    },
});
