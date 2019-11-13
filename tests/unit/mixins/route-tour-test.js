/* eslint-disable ember/no-new-mixins */
import RouteTourMixin from 'ember-site-tour/mixins/route-tour';
import { module, test } from 'qunit';
import EmberObject, { get } from '@ember/object';

module('Unit | Mixin | route tour', function() {
  const MockTourManagerService = EmberObject.extend({
    setupTour(id, model) {
      return {
        id,
        model
      };
    }
  });

  test('setting up a tour works', function(assert) {
    let RouteTourObject = EmberObject.extend(RouteTourMixin);
    let subject = RouteTourObject.create({
      routeName: 'test-route.index',
      tourManager: MockTourManagerService.create()
    });

    let controller = EmberObject.create();
    let model = EmberObject.create();

    subject.setupController(controller, model);
    let tour = get(controller, 'tour');

    assert.equal(tour.id, 'test-route.index', 'tour id is correctly set');
    assert.equal(tour.model, model, 'tour model is correctly set');
  });
});
