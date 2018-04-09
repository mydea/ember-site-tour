import Route from '@ember/routing/route';
import RouteTourMixin from 'ember-site-tour/mixins/route-tour';

export default Route.extend(RouteTourMixin, {

  _trackEvent(eventName, data) {
    let log = document.querySelector('#tracking-log');
    let dataStr = `{ id: ${data.id}, status: ${data.status}, currentStep: ${data.currentStep}, calloutStatus: ${data.calloutStatus}, tourHasBeenEnded: ${data.tourHasBeenEnded} }`;

    let li = document.createElement('li');
    li.innerText = `${eventName}: ${dataStr}`;

    log.appendChild(li);
  },

  actions: {
    tourStarted(e) {
      this._trackEvent('tour-started', e.toJSON());
    },
    tourEnded(e) {
      this._trackEvent('tour-ended', e.toJSON());
    },
    tourClosed(e) {
      this._trackEvent('tour-closed', e.toJSON());
    }
  }

});
