import Ember from 'ember';

const { get } = Ember;

export default Ember.Mixin.create({

  tour: Ember.inject.service(),

  setupController(controller, model) {
    this._super(...arguments);

    let tourName = `route-${Ember.String.dasherize(Ember.String.classify(get(this, 'routeName')))}`;
    let tour = this.get('tour').setupTour(tourName, model);
    controller.set('tour', tour);
  }

});
