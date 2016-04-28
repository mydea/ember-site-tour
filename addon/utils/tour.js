/* globals hopscotch */
import Ember from 'ember';

const { get, set } = Ember;

/**
 * A tour object.
 *
 * @namespace EmberTour.Objects
 * @class Tour
 * @extends Ember.Object
 * @uses Ember.Evented
 * @public
 */
export default Ember.Object.extend(Ember.Evented, {

  tour: Ember.inject.service(),

  /**
   * The ID of the tour.
   *
   * @attribute tourId
   * @type {String}
   * @required
   * @public
   */
  tourId: null,

  /**
   * The steps for this tour.
   *
   * @attribute steps
   * @type {Object[]}
   * @required
   * @public
   */
  steps: Ember.A(),

  /**
   * A model to observe for changes.
   *
   * @attribute model
   * @type {Mixed}
   * @optional
   * @public
   */
  model: null,

  /**
   * The options for the callout associated to this tour.
   * If this is not set, not callout will be shown.
   *
   * @attribute calloutOptions
   * @type {Object}
   * @optional
   * @public
   */
  calloutOptions: null,

  /**
   * The status of the tour.
   *
   * @property status
   * @type {'INACTIVE'|'RUNNING'|'ENDED'|'CANCELED'}
   * @readOnly
   * @public
   */
  status: 'INACTIVE',

  /**
   * The status of the callout.
   *
   * @property calloutStatus
   * @type {'INACTIVE'|'SHOWN'|'AUTOCLOSED'|'CLOSED'}
   * @readOnly
   * @public
   */
  calloutStatus: 'INACTIVE',

  /**
   * The current step of the tour.
   *
   * @property currentStep
   * @type {Number}
   * @readOnly
   * @public
   */
  currentStep: 0,

  /**
   * The callout manager to handle simple callouts.
   * Callouts are basically one-step tours.
   *
   * @property _calloutManager
   * @type {Object}
   * @private
   */
  _calloutManager: null,

  /**
   * Start the tour.
   *
   * @method start
   * @public
   */
  start() {
    this._checkSteps();
    let id = get(this, 'tourId');
    let steps = get(this, '_steps');
    let normalizedId = this._normalizeHopscotchId(id);

    let tour = {
      id: normalizedId,
      steps,
      onClose: () => this._onClose(),
      onEnd: () => this._onEnd(),
      onNext: () => set(this, 'currentStep', hopscotch.getCurrStepNum()),
      onPrev: () => set(this, 'currentStep', hopscotch.getCurrStepNum())
    };

    if (get(this, 'calloutStatus') === 'SHOWN') {
      set(this, 'calloutStatus', 'AUTOCLOSED');
      this.hideCallout();
    }
    hopscotch.startTour(tour);
    let currentStep = hopscotch.getCurrStepNum();
    set(this, 'currentStep', currentStep);
    this._onStart();
  },

  /**
   * Close the tour.
   *
   * @method close
   * @public
   */
  close() {
    let id = get(this, 'tourId');
    let normalizedId = this._normalizeHopscotchId(id);

    hopscotch.endTour(normalizedId);
  },

  /**
   * Show the callout for the tour.
   * By default, only show it if it hasn't been viewed before.
   *
   * @method showCallout
   * @param {Boolean} showAgain If this is true, show it even if it has been closed before.
   * @public
   */
  showCallout(showAgain = false) {
    let calloutOptions = get(this, 'calloutOptions');
    if (!calloutOptions) {
      return;
    }
    let { id } = calloutOptions;
    let calloutManager = this.get('_calloutManager');
    let tour = get(this, 'tour');
    let normalizedId = this._normalizeHopscotchId(id);

    if (!showAgain && tour.getIsRead(id) || this.get('status') === 'RUNNING') {
      return false;
    }

    if (calloutOptions) {
      if (calloutManager.getCallout(normalizedId)) {
        calloutManager.removeCallout(normalizedId);
      }

      calloutOptions = Ember.$.extend({}, calloutOptions, {
        id: normalizedId,
        onClose: () => this._onCalloutClose()
      });

      this._onCalloutShow();
      calloutManager.createCallout(calloutOptions);
    }
  },

  /**
   * Hide the callout for the tour.
   *
   * @method hideCallout
   * @public
   */
  hideCallout() {
    let calloutOptions = get(this, 'calloutOptions');
    let calloutManager = this.get('_calloutManager');
    if (calloutOptions) {
      let { id } = calloutOptions;
      let normalizedId = this._normalizeHopscotchId(id);

      if (calloutManager.getCallout(normalizedId)) {
        calloutManager.removeCallout(normalizedId);
        this._onCalloutClose();
      }
    }
  },

  /**
   * This is called whenever the tour starts.
   *
   * @method _onStart
   * @private
   */
  _onStart() {
    set(this, 'status', 'RUNNING');
    this.trigger('tour.start', this._getEventData());
  },

  /**
   * This is called whenever the tour ends (=viewed until the end).
   *
   * @method _onEnd
   * @private
   */
  _onEnd() {
    let tour = get(this, 'tour');
    tour.setIsRead(get(this, 'tourId'), true);

    set(this, 'status', 'ENDED');
    this.trigger('tour.end', this._getEventData());
  },

  /**
   * This is called whenever the tour is closed before its end.
   *
   * @method _onClose
   * @private
   */
  _onClose() {
    let tour = get(this, 'tour');
    tour.setIsRead(get(this, 'tourId'), true);

    Ember.run.next(() => {
      if (get(this, 'status') !== 'ENDED') {
        set(this, 'status', 'CANCELED');
        this.trigger('tour.close', this._getEventData());
      }
    });
  },

  /**
   * This is called whenever the callout is shown.
   *
   * @method _onCalloutShow
   * @private
   */
  _onCalloutShow() {
    set(this, 'calloutStatus', 'SHOWN');
    this.trigger('callout.show', this._getEventData());
  },

  /**
   * This is called whenever the callout is closed.
   *
   * @method _onCalloutClose
   * @private
   */
  _onCalloutClose() {
    let tour = get(this, 'tour');
    tour.setIsRead(get(this, 'calloutOptions.id'), true);

    Ember.run.next(() => {
      if (get(this, 'calloutStatus') === 'SHOWN') {
        set(this, 'calloutStatus', 'CLOSED');
        this.trigger('callout.close', this._getEventData());
      }
    });
  },

  /**
   * Get the data that is sent with events.
   * This data is the same for all events.
   *
   * @method _getEventData
   * @returns {{id, status, calloutStatus}}
   * @private
   */
  _getEventData() {
    let tour = get(this, 'tour');
    let id = get(this, 'tourId');

    return {
      tour: this,
      id,
      status: get(this, 'status'),
      currentStep: get(this, 'currentStep'),
      calloutStatus: get(this, 'calloutOptions') ? get(this, 'calloutStatus') : undefined,
      tourHasBeenEnded: !!tour.getIsRead(id),
      toJSON() {
        return {
          id: this.id,
          status: this.status,
          currentStep: this.currentStep,
          calloutStatus: this.calloutStatus,
          tourHasBeenEnded: this.tourHasBeenEnded
        };
      }
    };
  },

  /**
   * Check which steps are currenctly available due to available DOM nodes and condition functions.
   * This will set the internal _steps property accordingly
   *
   * @method _checkSteps
   * @returns {*}
   * @private
   */
  _checkSteps() {
    let steps = get(this, 'steps');
    let model = get(this, 'model');

    let tour = Ember.A();
    steps.forEach((step) => {
      let target = get(step, 'target');
      let targetElement = Ember.typeOf(target) === 'string' ? document.querySelector(target) : target;
      let condition = get(step, 'condition');
      let showStep = Ember.typeOf(condition) === 'function' ? condition(model) : true;

      // Only add the step if the target-selector exists in the DOM and if a condition function is not returning false
      if (targetElement && showStep) {
        tour.push({
          target: targetElement,
          placement: get(step, 'placement'),
          title: get(step, 'title'),
          content: get(step, 'content')
        });
      }
    });

    tour = this._addTourStepCount(tour);
    set(this, '_steps', tour);
    return tour;
  },

  /**
   * Adds a nice step counter to the bottom of the steps.
   *
   * @method _addTourStepCount
   * @param {Object[]} steps The steps to prepare
   * @return {Object[]}
   * @private
   */
  _addTourStepCount(tourSteps) {
    let tourService = get(this, 'tour');
    let stepCount = tourSteps.length;
    let stepOfStepsStr = tourService._t('Step {{step}} of {{of}}').replace('{{of}}', stepCount);

    return tourSteps.map((step, i) => {
      let stepOfSteps = stepOfStepsStr.replace('{{step}}', i + 1);
      return Ember.$.extend({}, step, {
        content: step.content + `<div class='hopscotch-pagination'>${stepOfSteps}</div>`
      });
    });
  },

  /**
   * Normalize the ID for hopscotch.
   * This is necessary because hopscotch cannot work with dots in the ID.
   *
   * @method _normalizeHopscotchId
   * @param {String} id The ID to normalize
   * @returns {String} The normalized ID
   * @private
   */
  _normalizeHopscotchId(id) {
    return Ember.String.dasherize(Ember.String.classify(id));
  },

  /**
   * Initialise the tour.
   *
   * @method init
   * @private
   * @override
   */
  init() {
    let calloutManager = hopscotch.getCalloutManager();
    this.set('_calloutManager', calloutManager);
  }

});
