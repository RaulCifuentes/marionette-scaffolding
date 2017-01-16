define([
    'marionette',

    'hbs!template/playing/playing'
], function(Marionette, playingTemplate) {
    return Marionette.ItemView.extend({
        template: playingTemplate
    });
});
