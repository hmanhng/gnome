var init = (function () {
  'use strict';

  var Gio2_0 = imports.gi.Gio;

  var Gvc1_0 = imports.gi.Gvc;

  var St1_0 = imports.gi.St;

  // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
  const Volume = imports.ui.status.volume;
  var ApplicationStreamSlider = class extends Volume.StreamSlider {
      constructor(stream, showDesc) {
          super(Volume.getMixerControl());
          this.stream = stream;
          this._icon.icon_name = stream.get_icon_name();
          let name = stream.get_name();
          let description = stream.get_description();
          if (name || description) {
              this._vbox = new St1_0.BoxLayout();
              this._vbox.vertical = true;
              this._label = new St1_0.Label();
              this._label.text = name && showDesc ? `${name} - ${description}` : (name || description);
              this._vbox.add(this._label);
              this.item.remove_child(this._slider);
              this._vbox.add(this._slider);
              this._slider.set_height(32);
              this.item.actor.add(this._vbox);
          }
      }
  };

  // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/popupMenu.js
  const PopupMenu = imports.ui.popupMenu;
  // https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/status/volume.js
  const Volume$1 = imports.ui.status.volume;
  const ExtensionUtils = imports.misc.extensionUtils;
  const Me = ExtensionUtils.getCurrentExtension();
  class VolumeMixerPopupMenuClass extends PopupMenu.PopupMenuSection {
      constructor() {
          super();
          this._applicationStreams = {};
          // The PopupSeparatorMenuItem needs something above and below it or it won't display
          this._hiddenItem = new PopupMenu.PopupBaseMenuItem();
          this._hiddenItem.set_height(0);
          this.addMenuItem(this._hiddenItem);
          this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
          this._control = Volume$1.getMixerControl();
          this._streamAddedEventId = this._control.connect("stream-added", this._streamAdded.bind(this));
          this._streamRemovedEventId = this._control.connect("stream-removed", this._streamRemoved.bind(this));
          let gschema = Gio2_0.SettingsSchemaSource.new_from_directory(Me.dir.get_child('schemas').get_path(), Gio2_0.SettingsSchemaSource.get_default(), false);
          this.settings = new Gio2_0.Settings({
              settings_schema: gschema.lookup('net.evermiss.mymindstorm.volume-mixer', true)
          });
          this._settingsChangedId = this.settings.connect('changed', () => this._updateStreams());
          this._updateStreams();
      }
      _streamAdded(control, id) {
          if (id in this._applicationStreams) {
              return;
          }
          const stream = control.lookup_stream_id(id);
          if (stream.is_event_stream ||
              !(stream instanceof Gvc1_0.MixerSinkInput) ||
              this._ignoredStreams.indexOf(stream.get_name()) !== -1) {
              return;
          }
          this._applicationStreams[id] = new ApplicationStreamSlider(stream, this._showStreamDesc);
          this.addMenuItem(this._applicationStreams[id].item);
      }
      _streamRemoved(_control, id) {
          if (id in this._applicationStreams) {
              this._applicationStreams[id].item.destroy();
              delete this._applicationStreams[id];
          }
      }
      _updateStreams() {
          for (const id in this._applicationStreams) {
              this._applicationStreams[id].item.destroy();
              delete this._applicationStreams[id];
          }
          this._ignoredStreams = this.settings.get_strv("ignored-streams");
          this._showStreamDesc = this.settings.get_boolean("show-description");
          for (const stream of this._control.get_streams()) {
              this._streamAdded(this._control, stream.get_id());
          }
      }
      destroy() {
          this._control.disconnect(this._streamAddedEventId);
          this._control.disconnect(this._streamRemovedEventId);
          this.settings.disconnect(this._settingsChangedId);
          super.destroy();
      }
  }
  var VolumeMixerPopupMenu = VolumeMixerPopupMenuClass;

  const Main = imports.ui.main;
  var volumeMixer = null;
  function enable() {
      volumeMixer = new VolumeMixerPopupMenu();
      Main.panel.statusArea.aggregateMenu._volume.menu.addMenuItem(volumeMixer);
  }
  function disable() {
      // REMINDER: It's required for extensions to clean up after themselves when
      // they are disabled. This is required for approval during review!
      if (volumeMixer !== null) {
          volumeMixer.destroy();
          volumeMixer = null;
      }
  }
  function extension () {
      return {
          enable,
          disable
      };
  }

  return extension;

}());
