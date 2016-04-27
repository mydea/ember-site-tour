import Ember from 'ember';
import layout from '../templates/components/tour-start-button';

const { get } = Ember;

export default Ember.Component.extend({
  layout,

  tourService: Ember.inject.service('tour'),

  tour: null,

  model: null,

  callout: null,

  didInsertElement() {
    let tourService = get(this, 'tourService');
    let tour = get(this, 'tour');
    let callout = get(this, 'callout');

    if (tour && callout) {
      tourService.addCallout(tour, {
        calloutMessage: callout,
        target: this.element
      });

      Ember.run.later(this, () => tour.showCallout(), 2000);
    }

    tour.on('tour.start', (e) => {
      this.sendAction('tourStarted', e);
    });

    tour.on('tour.end', (e) => {
      this.sendAction('tourEnded', e);
    });

    tour.on('tour.close', (e) => {
      this.sendAction('tourClosed', e);
    });

    tour.on('callout.show', (e) => {
      this.sendAction('calloutShown', e);
    });

    tour.on('callout.close', (e) => {
      this.sendAction('calloutClosed', e);
    });
  },

  willDestroyElement() {
    let tour = get(this, 'tour');
    tour.off('tour.start');
    tour.off('tour.end');
    tour.off('tour.close');

    tour.off('callout.show');
    tour.off('callout.close');
  },

  click() {
    let tour = get(this, 'tour');
    tour.start();
  }
});
