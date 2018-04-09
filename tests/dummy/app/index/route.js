/* eslint-disable no-console */
import Route from '@ember/routing/route';

import RouteTourMixin from 'ember-site-tour/mixins/route-tour';

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
