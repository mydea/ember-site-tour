import Ember from 'ember';
import RouteTourMixin from 'ember-hopscotch/mixins/route-tour';
import { module, test } from 'qunit';

module('Unit | Mixin | route tour');

// Replace this with your real tests.
test('it works', function(assert) {
  let RouteTourObject = Ember.Object.extend(RouteTourMixin);
  let subject = RouteTourObject.create();
  assert.ok(subject);
});
