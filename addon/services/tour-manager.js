/* globals hopscotch */
import { computed } from "@ember/object";
import Service from "@ember/service";
import { A as array } from "@ember/array";
import { getOwner } from "@ember/application";
import { typeOf as getTypeOf } from "@ember/utils";
import Tour from "./../utils/tour";
import { assign } from "@ember/polyfills";

/**
 * A service to handle guided tours through the interface.
 *
 * @namespace EmberHopscotch.Service
 * @class TourManager
 * @extends Ember.Service
 * @public
 */
export default Service.extend({
  // ---------------------------------------------------------------------------------------------------------
  // Properties

  /**
   * This property returns the global hopscotch variable.
   * This makes it easy to access it via the service without needing to directly access a global.
   *
   * @property hopscotch
   * @type {Object}
   * @public
   */
  hopscotch: computed(function () {
    return hopscotch;
  }),

  /**
   * Overwrite this for custom translations.
   *
   * @property messages
   * @type {Object}
   * @readOnly
   * @protected
   */
  messages: computed(function () {
    return {
      nextBtn: "Next",
      prevBtn: "Previous",
      closeTooltip: "Close",
      skipBtn: "Skip",
      doneBtn: "Done",
      defaultCalloutTitle: "Start a tour!",
      stepCount: "Step %step% of %stepCount%",
    };
  }),

  /**
   * This can be overwritten if necessary, e.g. for engines.
   *
   * @property owner
   * @type {Object}
   * @protected
   */
  owner: computed(function () {
    return getOwner(this);
  }),

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
   * The key where to store which tours have been viewed.
   *
   * @property _localStorageKey
   * @type {String}
   * @private
   */
  _localStorageKey: "ember-site-tour",

  /**
   * If this is set to false,
   * do not include 'Step X of Y' in the steps.
   *
   * @property includeStepCount
   * @type {Boolean}
   * @default {true}
   * @public
   */
  includeStepCount: true,

  // ---------------------------------------------------------------------------------------------------------
  // Methods

  /**
   * Show a single callout. This can be useful for hints etc.
   *
   * @method showCallout
   * @param {String} id A unique id for this callout
   * @param {Object} callout The callout object
   * @param {Boolean} [onlyUnread=true] If the callout should only be shown if it is unread
   * @public
   */
  showCallout(id, callout = {}, onlyUnread = true) {
    let calloutManager = this._calloutManager;

    if (!onlyUnread || (!this.getIsRead(id) && callout.target)) {
      let options = assign(
        {
          id,
          onClose: () => this.setIsRead(id),
        },
        callout
      );

      if (calloutManager.getCallout(id)) {
        calloutManager.removeCallout(id);
      }
      calloutManager.createCallout(options);
    }
  },

  /**
   * Close a callout.
   *
   * @method closeCallout
   * @param {String} id The callout id to close
   * @param {Boolean} setIsRead If the callout should be auto-set to isRead
   * @public
   */
  closeCallout(id, setIsRead = true) {
    let calloutManager = this._calloutManager;

    if (!id) {
      calloutManager.removeAllCallouts();
    } else {
      calloutManager.removeCallout(id);
      if (setIsRead) {
        this.setIsRead(id);
      }
    }
  },

  /**
   * Setup a tour object.
   *
   * @method _setupTour
   * @param tourId
   * @param model
   * @returns {EmberHopscotch.Object.Tour}
   * @public
   */
  setupTour(tourId, model) {
    let steps = this._setupTourSteps(tourId, model);
    let owner = this.owner;

    let tour = Tour.create(owner.ownerInjection(), {
      tourId,
      steps,
      model,
    });

    return tour;
  },

  /**
   * Add a callout to a tour.
   *
   * @param {EmberHopscotch.Object.Tour} tour
   * @param {Object} calloutOptions
   * @return {EmberHopscotch.Object.Tour}
   * @public
   */
  addCallout(
    tour,
    { calloutTitle, calloutMessage, placement = "top", target }
  ) {
    calloutTitle = calloutTitle || this.messages.defaultCalloutTitle;

    let options = {
      id: `${tour.get("tourId")}-callout`,
      target,
      placement,
      title: this._t(calloutTitle),
      content: this._t(calloutMessage),
    };

    tour.set("calloutOptions", options);
    return tour;
  },

  /**
   * Check if a tour/callout has been read.
   *
   * @method getIsRead
   * @param {String} id The id to check
   * @return {Boolean}
   * @public
   */
  getIsRead(id) {
    if (!window.localStorage || !id) {
      return false;
    }

    let lsKey = this._localStorageKey;
    let lsData = null;
    try {
      lsData = window.localStorage.getItem(lsKey);
    } catch (e) {
      console.error("Could not read from local storage.", e); //eslint-disable-line
    }
    if (!lsData) {
      return false;
    }

    lsData = JSON.parse(lsData);
    return lsData[id];
  },

  /**
   * Set a callout/tour as read.
   *
   * @method setIsRead
   * @param {String} id The id to set as read
   * @param {Boolean} isRead=true Set this to false if it should be unmarked
   * @public
   */
  setIsRead(id, isRead = true) {
    if (!window.localStorage) {
      return;
    }

    let lsKey = this._localStorageKey;
    let lsData = window.localStorage.getItem(lsKey);
    if (lsData) {
      lsData = JSON.parse(lsData);
    } else {
      lsData = {};
    }
    lsData[id] = isRead;

    try {
      window.localStorage.setItem(lsKey, JSON.stringify(lsData));
    } catch (e) {
      console.error("Could not save to local storage.", e); //eslint-disable-line
    }
  },

  /**
   * Setup tour steps.
   *
   * @method _setupTourSteps
   * @param {String} tourId The ID of the tour to load
   * @param {Mixed} model An optional model to pass to the tour steps
   * @returns {Object[]}
   * @private
   */
  _setupTourSteps(tourId, model) {
    let tourSteps = this._loadTour(tourId, model);
    return tourSteps;
  },

  /**
   * Load & prepare a tour.
   *
   * @method _loadTour
   * @param {string} tourId The unique id of this tour
   * @param {*} model An optional model that is passed to the steps condition functions
   * @return {Object[]}
   * @private
   */
  _loadTour(tourId) {
    let owner = this.owner;
    let tourData = owner.factoryFor(`tour:${tourId}`) || [];

    let tourArray = [];
    let tourInstance;
    switch (getTypeOf(tourData.class)) {
      case "array":
        tourArray = tourData.class;
        break;
      case "function":
        tourArray = tourData.class(tourId);
        break;
      case "class":
        tourInstance = tourData.create({ tourId });
        tourArray = tourInstance.tour || [];
    }

    tourData = array(tourArray);

    return tourData.map((step) => {
      return {
        condition: step.condition,
        target: step.target,
        placement: step.placement || "top",
        title: this._t(step.title),
        content: this._t(step.content),
      };
    });
  },

  /**
   * Override this function to implement your own translation method.
   *
   * @method _t
   * @param {string} str The string to translate
   * @returns {*}
   * @private
   */
  _t(str) {
    return str;
  },

  /**
   * Basic configuration for hopscotch.
   * Overwrite this if you want a different configuration.
   *
   * @method _configureHopscotch
   * @private
   */
  _configureHopscotch() {
    hopscotch.configure({
      i18n: {
        nextBtn: this._t(this.messages.nextBtn),
        prevBtn: this._t(this.messages.prevBtn),
        skipBtn: this._t(this.messages.skipBtn),
        doneBtn: this._t(this.messages.doneBtn),
        closeTooltip: this._t(this.messages.closeTooltip),
      },
    });
  },

  /**
   * Remove all callouts.
   *
   * @method _removeAllCallouts
   * @private
   */
  _removeAllCallouts() {
    let calloutManager = this._calloutManager;
    calloutManager.removeAllCallouts();
  },

  /**
   * Init the tour & callout manager.
   * This is automatically called on service initialisation.
   *
   * @method init
   * @override
   * @protected
   */
  init() {
    let calloutManager = hopscotch.getCalloutManager();
    this.set("_calloutManager", calloutManager);
    this._configureHopscotch();

    this._super(...arguments);
  },

  willDestroy() {
    this._super(...arguments);

    this._removeAllCallouts();
  },
});
