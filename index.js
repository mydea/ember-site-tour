/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-hopscotch',

  included: function (app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/hopscotch/dist/js/hopscotch.js');
    app.import(app.bowerDirectory + '/hopscotch/dist/css/hopscotch.css');
  },

  isDevelopingAddon: function() {
    return true;
  }
};
