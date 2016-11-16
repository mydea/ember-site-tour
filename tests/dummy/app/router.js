import Ember from 'ember';
import config from './config/environment';

const {
  Router: EmberRouter
} = Ember;

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

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
  });
});

export default Router;
