/* eslint-env node */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    'ember-bootstrap': {
      'importBootstrapTheme': true
    },
    'ember-site-tour': {
      importHopscotchJS: true,
      importHopscotchCSS: true
    },
    'ember-prism': {
      'theme': 'twilight',
      'components': ['bash', 'handlebars', 'javascript'],
      'plugins': ['line-highlight']
    }
  });

  return app.toTree();
};
