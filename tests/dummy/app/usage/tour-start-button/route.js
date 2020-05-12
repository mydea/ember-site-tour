import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { run } from '@ember/runloop';
import { ResetControllerMixin } from 'ember-site-tour/mixins/route-tour';

export default Route.extend(ResetControllerMixin, {

  tourManager: service(),

  activate() {
    run.later(this, () => {
      let tourManager = this.tourManager;

      tourManager.showCallout('tour-start-button-callout', {
        target: document.querySelector('#callout'),
        title: 'This is a callout',
        content: 'It is positioned next to an element',
        placement: 'top'
      }, false);
    }, 2000);
  }

});
