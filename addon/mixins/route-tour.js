/* eslint-disable ember/no-new-mixins */
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import Mixin from '@ember/object/mixin';

/**
 * This mixin adds setupController functions to a route.
 *
 * @namespace EmberHopsotch.Mixin
 * @class SetupControllerMixin
 * @extends Ember.Mixin
 * @public
 */
export const SetupControllerMixin = Mixin.create({
  tourManager: service(),

  /**
   * Setup a tour object on the controller, available for usage.
   *
   * @method setupController
   * @param controller
   * @param model
   * @override
   * @public
   */
  setupController(controller, model) {
    this._super(...arguments);

    // Avoid multiple declarations of same tour
    if (!get(controller, 'tour')) {
      let tourName = get(this, 'routeName');
      let tour = get(this, 'tourManager').setupTour(tourName, model);
      set(controller, 'tour', tour);
    }
  }
});

/**
 * This mixin adds resetController functions to a route.
 *
 * @namespace EmberHopsotch.Mixin
 * @class ResetControllerMixin
 * @extends Ember.Mixin
 * @public
 */
export const ResetControllerMixin = Mixin.create({
  tourManager: service(),

  /**
   * Close all visible callouts.
   *
   * @method resetController
   * @param controller
   * @param isExiting
   * @override
   * @returns {*}
   * @public
   */
  resetController(controller, isExiting) {
    if (isExiting) {
      let tourManager = get(this, 'tourManager');
      tourManager.closeCallout();
      let tour = get(controller, 'tour');
      if (tour) {
        tour.close();
        tour.destroy();
      }
      set(controller, 'tour', null);

    }

    return this._super(...arguments);
  }
});

/**
 * This mixin adds setupController and resetController functions to a route
 * to provide hooks for the tour.
 *
 * @namespace EmberHopsotch.Mixin
 * @class RouteTour
 * @extends Ember.Mixin
 * @uses EmberHopscotch.Mixin.SetupControllerMixin
 * @uses EmberHopscotch.Mixin.ResetControllerMixin
 * @public
 */
export default Mixin.create(SetupControllerMixin, ResetControllerMixin);
