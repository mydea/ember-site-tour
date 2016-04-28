import Ember from 'ember';
import { ResetControllerMixin } from 'ember-hopscotch/mixins/route-tour';

export default Ember.Route.extend(ResetControllerMixin, {

  tour: Ember.inject.service(),

  activate() {
    Ember.run.later(this, () => {
      let tour = this.get('tour');

      tour.showCallout('tour-start-button-callout', {
        target: document.querySelector('#callout'),
        title: 'This is a callout',
        content: 'It is positioned next to an element',
        placement: 'top'
      }, false);
    }, 2000);
  }

});
