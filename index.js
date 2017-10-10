/* eslint-disable */
'use strict';

var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var path = require('path');
var merge = require('lodash.merge');

module.exports = {
  name: 'ember-site-tour',

  _options: {},

  included: function(app) {
    this._super.included(app);
    this._ensureThisImport();

    // Setup default options
    var options = merge({
      importHopscotchJS: true,
      importHopscotchCSS: false
    }, app.options['ember-site-tour'] || {});

    this._options = options;

    if (options.importHopscotchJS) {
      this.import('vendor/hopscotch/js/hopscotch.js');
    }

    if (options.importHopscotchCSS) {
      this.import('vendor/hopscotch/css/hopscotch.css');
      this.import('vendor/hopscotch-override.css');
    }
  },

  treeForVendor: function(vendorTree) {
    var hopscotchPath = this._getPath();

    var trees = [];
    if (vendorTree) {
      trees.push(vendorTree);
    }

    var hopscotchTree = new Funnel(hopscotchPath, {
      include: ['js/hopscotch.js', 'css/hopscotch.css'],
      destDir: 'hopscotch'
    });

    trees.push(hopscotchTree);

    return new MergeTrees(trees, { overwrite: true });
  },

  treeForPublic: function(tree) {
    this._requireBuildPackages();

    if (!this.app) {
      return tree;
    }

    var importHopscotchCSS = this._options.importHopscotchCSS;

    if (importHopscotchCSS) {
      var hopscotchPath = this._getPath();

      return new Funnel(hopscotchPath, {
        srcDir: '/img',
        destDir: '/assets/img'
      });
    }

    return tree;
  },

  _getPath() {
    var hopscotchPath = path.dirname(require.resolve('hopscotch'));

    // The path returned here is e.g. node_modules/hopscotch/dist/js
    // We want to move one step out to get the dist folder
    hopscotchPath = hopscotchPath.replace('/dist/js', '/dist');
    hopscotchPath = hopscotchPath.replace('\\dist\\js', '\\dist');

    return hopscotchPath;
  },

  _ensureThisImport: function() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        var current = this;
        var app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
      this.import = function importShim(asset, options) {
        var app = this._findHost();
        app.import(asset, options);
      };
    }
  }
};
