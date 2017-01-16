define([
  'marionette',

  'hbs!template/layout'
], function (Marionette, layout) {

  return Marionette.LayoutView.extend({
    template: layout,

    regions: {
      header: "#header",
      content: "#content"
    }
  });
});