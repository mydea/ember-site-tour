/* jshint node: true */
'use strict';

var pickFiles = require('broccoli-static-compiler');
var merge = require('lodash.merge');

module.exports = {
  name: 'ember-site-tour',

  included: function(app) {
    this._super.included(app);

    // Setup default options
    var options = merge({
      'importHopscotchJS': true,
      'importHopscotchCSS': false
    }, app.options['ember-site-tour'] || {});

    // In nested addons, app.bowerDirectory might not be available
    var bowerDirectory = app.bowerDirectory || 'bower_components';
    // In ember-cli < 2.7, this.import is not available, so fall back to use app.import
    var importShim = typeof this.import !== 'undefined' ? this : app;

    if (options.importHopscotchJS) {
      importShim.import(bowerDirectory + '/hopscotch/dist/js/hopscotch.js');
    }

    if (options.importHopscotchCSS) {
      importShim.import('vendor/hopscotch.css');
    }
  },

  treeForPublic: function(tree) {
    this._requireBuildPackages();

    var appOptions = (this.app && this.app.options) ? this.app.options : {};
    var bowerDirectory = appOptions.bowerDirectory || 'bower_components';

    var options = merge({
      'importHopscotchCSS': false
    }, appOptions['ember-site-tour'] || {});

    if (!options.importHopscotchCSS) {
      return tree;
    }

    tree = pickFiles(bowerDirectory + '/hopscotch/dist/img', {
      srcDir: '/',
      files: ['*.png'],
      destDir: '/assets/img'
    });

    return tree;
  },

  isDevelopingAddon: function() {
    return false;
  }
};
