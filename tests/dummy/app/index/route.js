import Ember from 'ember';
import RouteTourMixin from 'ember-hopscotch/mixins/route-tour';

export default Ember.Route.extend(RouteTourMixin, {
  model() {
    return {
      myProperty: 1
    };
  },

  actions: {
    tourChanged(e) {
      console.log(e);
    }
  }
});
