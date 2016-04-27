/* globals hopscotch */
import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Object.extend(Ember.Evented, {

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
   * The i18n configuration for the tour. Overwrite this if you want to.
   *
   * @attribute i18nConfiguration
   * @type {Object}
   * @optional
   * @public
   */
  i18nConfiguration: {
    stepOfSteps: 'Step {{step}} of {{of}}'
  },

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

  start() {
    this._checkSteps();
    let id = get(this, 'tourId');
    let steps = get(this, '_steps');

    let tour = {
      id,
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

  showCallout() {
    let calloutOptions = get(this, 'calloutOptions');
    let calloutManager = this.get('_calloutManager');

    if (calloutOptions) {
      let { id } = calloutOptions;
      if (calloutManager.getCallout(id)) {
        calloutManager.removeCallout(id);
      }

      calloutOptions = Ember.$.extend({}, calloutOptions, {
        onClose: () => this._onCalloutClose()
      });

      this._onCalloutShow();
      calloutManager.createCallout(calloutOptions);
    }
  },

  hideCallout() {
    let calloutOptions = get(this, 'calloutOptions');
    let calloutManager = this.get('_calloutManager');
    if (calloutOptions) {
      let { id } = calloutOptions;
      if (calloutManager.getCallout(id)) {
        calloutManager.removeCallout(id);
        this._onCalloutClose();
      }
    }
  },

  _onStart() {
    set(this, 'status', 'RUNNING');
    this.trigger('tour.start', this._getEventData());
  },

  _onEnd() {
    set(this, 'status', 'ENDED');
    this.trigger('tour.end', this._getEventData());
  },

  _onClose() {
    Ember.run.next(() => {
      if (get(this, 'status') !== 'ENDED') {
        set(this, 'status', 'CANCELED');
        this.trigger('tour.close', this._getEventData());
      }
    });
  },

  _onCalloutShow() {
    set(this, 'calloutStatus', 'SHOWN');
    this.trigger('callout.show', this._getEventData());
  },

  _onCalloutClose() {
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
    return {
      tour: this,
      id: get(this, 'tourId'),
      status: get(this, 'status'),
      currentStep: get(this, 'currentStep'),
      calloutStatus: get(this, 'calloutOptions') ? get(this, 'calloutStatus') : undefined
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
    let stepCount = tourSteps.length;
    let stepOfStepsStr = get(this, 'i18nConfiguration.stepOfSteps').replace('{{of}}', stepCount);

    return tourSteps.map((step, i) => {
      let stepOfSteps = stepOfStepsStr.replace('{{step}}', i + 1);
      return Ember.$.extend({}, step, {
        content: step.content + `<div class='hopscotch-pagination'>
          ${stepOfSteps}
        </div>`
      });
    });
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
