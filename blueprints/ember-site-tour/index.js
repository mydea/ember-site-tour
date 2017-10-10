/* eslint-env node */

'use strict';

module.exports = {
  normalizeEntityName: function() {
  },

  afterInstall: function() {
    return this.addPackageToProject('hopscotch');
  }
};
