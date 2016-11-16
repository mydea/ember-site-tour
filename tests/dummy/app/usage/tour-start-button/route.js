import Ember from 'ember';
import { ResetControllerMixin } from 'ember-site-tour/mixins/route-tour';

const {
  Route,
  inject,
  run
} = Ember;

export default Route.extend(ResetControllerMixin, {

  tourManager: inject.service(),

  activate() {
    run.later(this, () => {
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
