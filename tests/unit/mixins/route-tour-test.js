import Ember from 'ember';
import RouteTourMixin from 'ember-hopscotch/mixins/route-tour';
import { module, test } from 'qunit';

module('Unit | Mixin | route tour');

const MockTourService = Ember.Object.extend({
  setupTour(id, model) {
    return {
      id,
      model
    };
  }
});

test('setting up a tour works', function(assert) {
  let RouteTourObject = Ember.Object.extend(RouteTourMixin);
  let subject = RouteTourObject.create({
    routeName: 'test-route.index',
    tour: MockTourService.create()
  });

  let controller = Ember.Object.create();
  let model = Ember.Object.create();

  subject.setupController(controller, model);
  let tour = controller.get('tour');

  assert.equal(tour.id, 'test-route.index', 'tour id is correctly set');
  assert.equal(tour.model, model, 'tour model is correctly set');
});
