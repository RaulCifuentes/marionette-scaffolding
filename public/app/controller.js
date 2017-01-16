define([
  'marionette',
  'app',

  'view/header/header',
  'view/index/index',
  'view/settings/settings',
  'view/playing/playing',

], function (Marionette, App, HeaderView, IndexView, SettingsView, PlayingView) {

  return Marionette.Controller.extend({

    initialize: function() {
      App.layout.header.show(new HeaderView());
    },

    index: function() {
      App.layout.content.show(new IndexView());
    },
    settings: function() {
      App.layout.content.show(new SettingsView());
    },
    playing: function () {
      App.layout.content.show(new PlayingView());
    }
  });
});
