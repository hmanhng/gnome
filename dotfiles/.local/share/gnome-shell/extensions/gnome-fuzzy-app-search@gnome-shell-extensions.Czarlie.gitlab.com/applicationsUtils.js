/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// strict mode
"use strict";

// import modules
const Mainloop = imports.mainloop;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

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

        if (Main.overview.viewSelector !== undefined)
            searchController = Main.overview.viewSelector;  // GNOME 3.xx
        else
            searchController = Main.overview._overview.controls._searchController;  // GNOME >= 40

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
        // listen object - file/monitor list
        this._listen = [...new Set(GLib.get_system_data_dirs())]
            .map((path) => Gio.File.new_for_path(path + "/applications"))
            .filter((file) => file.query_exists(null))
            .map((file) => {
                let monitor = file.monitor(Gio.FileMonitorFlags.NONE, null);

                // refresh on each directory change
                monitor.connect(
                    "changed",
                    Lang.bind(this, this._handleMonitorChanged)
                );

                return {
                    file: file,
                    monitor: monitor,
                };
            });
        this._interval = null;
        this._data = {};

        this.refresh();
    },

    /**
     * Destructor
     *
     * @return {Void}
     */
    destroy: function () {
        this._listen.forEach((item) => {
            item.monitor.cancel();
        });
    },

    /**
     * Find all desktop files in path and append
     * each id/name to result object
     *
     * @param  {String} path
     * @return {Object}
     */
    _desktopFileObject: function (path) {
        // @todo - async?
        let dir = Gio.file_new_for_path(path);
        let children = dir.enumerate_children("*", 0, null);
        let result = {};

        let info;
        while ((info = children.next_file(null)) !== null) {
            let id = info.get_name();
            if (!id.match(/\.desktop$/)) continue;

            let app = Gio.DesktopAppInfo.new(id);
            if (!app || !app.should_show()) continue;

            result[app.get_id()] = app.get_name();
        }
        children.close(null);

        return result;
    },

    /**
     * Data iterator
     *
     * @param  {Function} callback
     * @return {Void}
     */
    forEach: function (callback) {
        for (let id in this._data) {
            callback.call(this, id, this._data[id]);
        }
    },

    /**
     * Refresh data
     *
     * @return {Void}
     */
    refresh: function () {
        let desktopFile = [];
        this._listen.forEach((item) => {
            desktopFile.push(this._desktopFileObject(item.file.get_path()));
        });

        //this._data = Object.assign.apply(Object, desktopFile);

        // @todo - Object.assign does not work
        let result = {};
        desktopFile.reverse().forEach((desktopObject) => {
            for (let key in desktopObject) {
                result[key] = desktopObject[key];
            }
        });
        this._data = result;
    },

    /**
     * Get the levenshtein distance between str1 and str2 without additions
     *
     * @param  {String} str1
     * @param  {String} str2
     * @param  {Boolean} includeAdditions
     * @return {Number}
     */
    _levenshteinDistance: function (
        str1 = "",
        str2 = "",
        includeAdditions = true
    ) {
        const track = Array(str2.length + 1)
            .fill(null)
            .map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }

        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1, // deletion
                    track[j - 1][i] + includeAdditions, // + 1, // insertion (no +1 because substrings should be matched too)
                    track[j - 1][i - 1] + indicator // substitution
                );
            }
        }
        return track[str2.length][str1.length];
    },

    /**
     * Get a score for a result based on its name and the query
     *
     * @param  {String} query
     * @param  {String} name
     * @return {Number}
     */
    _scoreResult: function (query, name) {
        let totalTokenLength = 0;
        let correctCharacters = 0;

        let nameTokens = name.toLowerCase().split(" ");

        query
            .toLowerCase()
            .split(" ")
            .forEach((token, idx, array) => {
                totalTokenLength += token.length;
                correctCharacters += token.length;

                let tokenDiffs = [];

                nameTokens.forEach((nameToken) => {
                    tokenDiffs.push(
                        this._levenshteinDistance(
                            token,
                            nameToken,
                            !(idx === array.length - 1)
                        )
                    );
                });

                correctCharacters -= Math.min(...tokenDiffs);
            });

        return correctCharacters / totalTokenLength;
    },

    /**
     * Get list of application ids by string query
     *
     * @param  {String} query
     * @return {Array}
     */
    find: function (query) {
        let result = [];

        let scores = {};

        this.forEach((id, name) => {
            let score = this._scoreResult(query, name);
            if (score >= 0.65) {
                result.push(id);
                scores[id] = score;
            }
        });

        return result.sort((a, b) => scores[a] - scores[b]);
    },

    /**
     * File monitor changed event handler
     *
     * @param  {Object} monitor
     * @param  {Object} file
     * @param  {Mixed}  otherFile
     * @param  {Number} eventType
     * @return {Void}
     */
    _handleMonitorChanged: function (monitor, file, otherFile, eventType) {
        Mainloop.source_remove(this._interval);

        // handle multiple changes as one with delay
        this._interval = Mainloop.timeout_add(
            1000,
            () => {
                this.refresh();

                this._interval = null;
                return !!this._interval;
            },
            null
        );
    },
});
