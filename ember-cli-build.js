/* eslint-env node */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    'ember-site-tour': {
      importHopscotchJS: true,
      importHopscotchCSS: true
    },
    'ember-prism': {
      'theme': 'twilight',
      'components': ['bash', 'handlebars', 'javascript', 'scss', 'markup-templating'],
      'plugins': ['line-highlight']
    }
  });

  // Import bootstrap CSS
  app.import('node_modules/bootstrap/dist/css/bootstrap.css');

  return app.toTree();
};
