import Ember from 'ember';
import RouteTourMixin from 'ember-site-tour/mixins/route-tour';

const {
  Route
} = Ember;

export default Route.extend(RouteTourMixin, {
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
