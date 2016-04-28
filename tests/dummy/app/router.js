import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
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
  });
});

export default Router;
