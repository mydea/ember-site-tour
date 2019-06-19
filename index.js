'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const path = require('path');

module.exports = {
  name: 'ember-site-tour',

  _options: {},

  included(app) {
    this._super.included.apply(this, arguments);
    this._ensureThisImport();

    // Setup default options
    let options = Object.assign({
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

  treeForVendor(vendorTree) {
    let hopscotchPath = this._getPath();

    let trees = [];
    if (vendorTree) {
      trees.push(vendorTree);
    }

    let hopscotchTree = new Funnel(hopscotchPath, {
      include: ['js/hopscotch.js', 'css/hopscotch.css'],
      destDir: 'hopscotch'
    });

    trees.push(hopscotchTree);

    return new MergeTrees(trees, { overwrite: true });
  },

  treeForPublic(tree) {
    if (!this.app) {
      return tree;
    }

    let importHopscotchCSS = this._options.importHopscotchCSS;

    if (importHopscotchCSS) {
      let hopscotchPath = this._getPath();

      return new Funnel(hopscotchPath, {
        srcDir: '/img',
        destDir: '/assets/img'
      });
    }

    return tree;
  },

  _getPath() {
    let hopscotchPath = path.dirname(require.resolve('hopscotch'));

    // The path returned here is e.g. node_modules/hopscotch/dist/js
    // We want to move one step out to get the dist folder
    hopscotchPath = hopscotchPath.replace('/dist/js', '/dist');
    hopscotchPath = hopscotchPath.replace('\\dist\\js', '\\dist');

    return hopscotchPath;
  },

  _ensureThisImport() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
      this.import = function importShim(asset, options) {
        let app = this._findHost();
        app.import(asset, options);
      };
    }
  }
};
