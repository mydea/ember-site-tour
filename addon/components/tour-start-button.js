import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/tour-start-button';
import { typeOf as getTypeOf } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({

  // ---------------------------------------------------------------------------------------------------------
  // Properties

  layout,

  tourManager: service('tourManager'),
  attributeBindings: ['data-test-start-tour'],

  // ---------------------------------------------------------------------------------------------------------
  // Attributes

  'data-test-start-tour': true,

  /**
   * The tour object for this button.
   *
   * @attribute tour
   * @type {EmberTour.Object.Tour}
   * @required
   * @public
   */
  tour: null,

  /**
   * An optional model.
   * This is passed to the steps and can be used to only show steps if certain criteria pass.
   *
   * @attribute model
   * @type {Mixed}
   * @optional
   * @public
   */
  model: null,

  /**
   * A text for a callout.
   * If this is not set, not callout will be displayed.
   *
   * @attribute callout
   * @type {String}
   * @optional
   * @public
   */
  callout: null,

  /**
   * The placement for the callout.
   *
   * @attribute calloutPlacement
   * @type {'top'|'right'|'bottom'|'left'}
   * @default 'top'
   * @optional
   * @public
   */
  calloutPlacement: 'top',

  /**
   * The title for the callout.
   *
   * @attribute calloutTitle
   * @type {String}
   * @default 'Start a tour!',
   * @optional
   * @public
   */
  calloutTitle: 'Start a tour!',

  /**
   * This action is called when the tour starts.
   *
   * @event tourStarted
   * @param {Object} The tour object
   * @public
   */
  tourStarted: null,

  /**
   * This action is called when the tour ends after the last step.
   *
   * @event tourEnded
   * @param {Object} The tour object
   * @public
   */
  tourEnded: null,

  /**
   * This action is called when the tour is closed before the last step.
   *
   * @event tourClosed
   * @param {Object} The tour object
   * @public
   */
  tourClosed: null,

  /**
   * This action is called when the callout is displayed.
   *
   * @event calloutShown
   * @param {Object} The tour object
   * @public
   */
  calloutShown: null,

  /**
   * This action is called when the callout is closed manually.
   *
   * @event calloutClosed
   * @param {Object} The tour object
   * @public
   */
  calloutClosed: null,

  // ---------------------------------------------------------------------------------------------------------
  // Methods

  /**
   * Setup the tour & event listeners.
   * Also show the callout if it is available.
   *
   * @method didInsertElement
   * @protected
   * @override
   */
  didInsertElement() {
    this._super(...arguments);

    get(this, '_setupCalloutTask').perform();
    this._setupEventListeners();
  },

  /**
   * When the element is destroyed, tear down the event listeners & timers.
   *
   * @method willDestroyElement
   * @protected
   * @override
   */
  willDestroyElement() {
    this._tearDownEventListeners();

    let tour = get(this, 'tour');
    if (tour) {
      tour.hideCallout({ markAsRead: false });
    }

    this._super(...arguments);
  },

  /**
   * On click, start the tour.
   *
   * @event click
   * @protected
   */
  click() {
    let tour = get(this, 'tour');
    tour.start();
  },

  _sendAction(actionName, ...args) {
    let action = get(this, actionName);
    if (action && getTypeOf(action) === 'function') {
      return action(...args);
    }
  },

  _eventListeners: null,

  /**
   * Setup the tour event listeners.
   *
   * @method _setupEventListeners
   * @private
   */
  _setupEventListeners() {
    let tour = get(this, 'tour');
    if (!tour) {
      return;
    }

    let eventListeners = {
      'tour-start': (e) => {
        this._sendAction('tourStarted', e);
      },
      'tour.end': (e) => {
        this._sendAction('tourEnded', e);
      },
      'tour.close': (e) => {
        this._sendAction('tourClosed', e);
      },
      'callout.show': (e) => {
        this._sendAction('calloutShown', e);
      },
      'callout.close': (e) => {
        this._sendAction('calloutClosed', e);
      }
    };

    tour.on('tour.start', eventListeners['tour.start']);
    tour.on('tour.end', eventListeners['tour.end']);
    tour.on('tour.close', eventListeners['tour.close']);
    tour.on('callout.show', eventListeners['callout.show']);
    tour.on('callout.close', eventListeners['callout.close']);

    set(this, '_eventListeners', eventListeners);
  },

  /**
   * Tear down the tour's event listeners.
   *
   * @method _tearDownEventListeners
   * @private
   */
  _tearDownEventListeners() {
    let tour = get(this, 'tour');
    let eventListeners = get(this, '_eventListeners');

    if (!tour) {
      return;
    }

    tour.off('tour.start', eventListeners['tour.start']);
    tour.off('tour.end', eventListeners['tour.end']);
    tour.off('tour.close', eventListeners['tour.close']);
    tour.off('callout.show', eventListeners['callout.show']);
    tour.off('callout.close', eventListeners['callout.close']);
  },

  _setupCalloutTask: task(function* () {
    let tourManager = get(this, 'tourManager');
    let tour = get(this, 'tour');
    let callout = get(this, 'callout');
    let placement = get(this, 'calloutPlacement') || 'top';

    let { element } = this;
    let [target] = element.children;

    if (!tour || !callout || !target) {
      return;
    }

    tourManager.addCallout(tour, {
      calloutMessage: callout,
      placement,
      target
    });

    yield timeout(2000);

    tour.showCallout();
  })
});
