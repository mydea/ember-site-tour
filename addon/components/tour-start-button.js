import Ember from 'ember';
import layout from '../templates/components/tour-start-button';

const { get } = Ember;

export default Ember.Component.extend({

  // ---------------------------------------------------------------------------------------------------------
  // Properties

  layout,

  tourService: Ember.inject.service('tour'),

  // ---------------------------------------------------------------------------------------------------------
  // Attributes

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

  /**
   * Tear down the tour's event listeners.
   *
   * @method _tearDownEventListeners
   * @private
   */
  _tearDownEventListeners() {
    let tour = get(this, 'tour');
    if (!tour) {
      return;
    }
    tour.off('tour.start');
    tour.off('tour.end');
    tour.off('tour.close');

    tour.off('callout.show');
    tour.off('callout.close');
  },

  /**
   * Setup the tour & event listeners.
   * Also show the callout if it is available.
   *
   * @method didInsertElement
   * @protected
   * @override
   */
  didInsertElement() {
    let tourService = get(this, 'tourService');
    let tour = get(this, 'tour');
    let callout = get(this, 'callout');
    let placement = get(this, 'calloutPlacement') || 'top';
    let [target] = this.$().children();

    if (tour && callout) {
      tourService.addCallout(tour, {
        calloutMessage: callout,
        placement,
        target
      });

      Ember.run.later(this, () => tour.showCallout(), 2000);
    }

    this._setupEventListeners();
  },

  /**
   * When the element is destroyed, tear down the event listeners.
   *
   * @method willDestroyElement
   * @protected
   * @override
   */
  willDestroyElement() {
    this._tearDownEventListeners();
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
  }
});
