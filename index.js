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
      'importHopscotchCSS': true
    }, app.options['ember-site-tour'] || {});

    if (options.importHopscotchJS) {
      app.import(app.bowerDirectory + '/hopscotch/dist/js/hopscotch.js');
    }

    if (options.importHopscotchCSS) {
      app.import('vendor/hopscotch.css');
    }
  },

  treeForPublic: function(tree) {
    this._requireBuildPackages();

    var options = merge({
      'importHopscotchCSS': true
    }, this.app.options['ember-site-tour'] || {});
    
    if (!options.importHopscotchCSS) {
      return tree;
    }

    tree = pickFiles(this.app.bowerDirectory + '/hopscotch/dist/img', {
      srcDir: '/',
      files: ['*.png'],
      destDir: '/assets/img'
    });

    return tree;
  },

  isDevelopingAddon: function() {
    return true;
  }
};
