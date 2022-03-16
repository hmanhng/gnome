/*
  Add user id in top panel
  (c) fthx 2021
  License: GPL v3
*/

const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;


class Extension {
    constructor() {
    }

    enable() {
      this.id_label = new St.Label({text: GLib.get_user_name() + "@" + GLib.get_host_name(), y_align: Clutter.ActorAlign.CENTER, style_class: "user-label"});
      this.aggregate_menu = Main.panel.statusArea["aggregateMenu"];
      this.aggregate_menu._indicators.insert_child_above(this.id_label, this.aggregate_menu._power);
    }

    disable() {
		  this.aggregate_menu._indicators.remove_child(this.id_label); 
    }
}

function init() {
	return new Extension();
}
