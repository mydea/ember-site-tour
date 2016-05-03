import Ember from 'ember';
import { ResetControllerMixin } from 'ember-site-tour/mixins/route-tour';

export default Ember.Route.extend(ResetControllerMixin, {

  tourManager: Ember.inject.service(),

  activate() {
    Ember.run.later(this, () => {
      let tourManager = this.get('tourManager');

      tourManager.showCallout('tour-start-button-callout', {
        target: document.querySelector('#callout'),
        title: 'This is a callout',
        content: 'It is positioned next to an element',
        placement: 'top'
      }, false);
    }, 2000);
  }

});
