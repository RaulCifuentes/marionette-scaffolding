define([
  'marionette'
], function (Marionette) {

  return Marionette.AppRouter.extend({

    appRoutes: {
      "settings" : "settings",

      "playing": "playing",

      "*actions" : "index"
    }
  });
});
