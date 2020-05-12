import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('defining-tours');
  this.route('usage', function() {
    this.route('mixin');
    this.route('tour-start-button');
    this.route('service');
    this.route('tour-object');
  });
  this.route('examples', function() {
    this.route('tracking');
    this.route('simple');
    this.route('engines');
    this.route('tests');
  });
});
