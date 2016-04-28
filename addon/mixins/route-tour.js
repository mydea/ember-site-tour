import Ember from 'ember';
const { get } = Ember;

export const SetupControllerMixin = Ember.Mixin.create({
  tour: Ember.inject.service(),

  /**
   * Setup a tour object on the controller, available for usage.
   *
   * @method setupController
   * @param controller
   * @param model
   * @override
   */
  setupController(controller, model) {
    this._super(...arguments);

    let tourName = get(this, 'routeName');
    let tour = get(this, 'tour').setupTour(tourName, model);
    controller.set('tour', tour);
  }
});

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
   */
  resetController(controller, isExiting) {
    if (isExiting) {
      get(this, 'tour').closeCallout();
    }

    return this._super(...arguments);
  }
});

export default Ember.Mixin.create(SetupControllerMixin, ResetControllerMixin);
