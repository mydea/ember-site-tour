import Ember from 'ember';
const { get } = Ember;

/**
 * This mixin adds setupController functions to a route.
 *
 * @namespace EmberHopsotch.Mixin
 * @class SetupControllerMixin
 * @extends Ember.Mixin
 * @public
 */
export const SetupControllerMixin = Ember.Mixin.create({
  tour: Ember.inject.service(),

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

    let tourName = get(this, 'routeName');
    let tour = get(this, 'tour').setupTour(tourName, model);
    controller.set('tour', tour);
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
export const ResetControllerMixin = Ember.Mixin.create({
  tour: Ember.inject.service(),

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
      let tourService = get(this, 'tour');
      tourService.closeCallout();
      let tour = get(this.controllerFor(get(this, 'routeName')), 'tour');
      tour.close();
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
export default Ember.Mixin.create(SetupControllerMixin, ResetControllerMixin);
