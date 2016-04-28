/* globals hopscotch */
import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import Tour from './../utils/tour';

const { get } = Ember;

/**
 * A service to handle guided tours through the interface.
 *
 * @namespace EmberHopscotch.Service
 * @class Tour
 * @extends Ember.Service
 */
export default Ember.Service.extend({

  // ---------------------------------------------------------------------------------------------------------
  // Properties

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
  _localStorageKey: 'ember-hopscotch',

  // ---------------------------------------------------------------------------------------------------------
  // Methods

  /**
   * Show a single callout. This can be useful for hints etc.
   *
   * @method showCallout
   * @param {String} id A unique id for this callout
   * @param {Object} callout The callout object
   * @param {Boolean} [onlyUnread=true] If the callout should only be shown if it is unread
   */
  showCallout(id, callout = {}, onlyUnread = true) {
    const calloutManager = this.get('_calloutManager');

    if (!onlyUnread || !this.getIsRead(id) && callout.target) {

      const options = Ember.$.extend({
        id,
        onClose: () => this.setIsRead(id)
      }, callout, true);

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
   */
  closeCallout(id) {
    const calloutManager = this.get('_calloutManager');

    if (!id) {
      calloutManager.removeAllCallouts();
    } else {
      calloutManager.removeCallout(id);
      this.setIsRead(id);
    }
  },

  /**
   * Setup a tour object.
   *
   * @method _setupTour
   * @param tourId
   * @param model
   * @returns {Object}
   */
  setupTour(tourId, model) {
    let steps = this._setupTourSteps(tourId, model);

    let tour = Tour.create(
      getOwner(this).ownerInjection(), {
        tourId,
        steps,
        model
      });

    return tour;
  },

  addCallout(tour, {
    calloutTitle = 'Start a tour!',
    calloutMessage,
    placement = 'top',
    target
  }) {
    let options = {
      id: `${tour.get('tourId')}-callout`,
      target,
      placement,
      title: this._t(calloutTitle),
      content: this._t(calloutMessage)
    };

    tour.set('calloutOptions', options);
    return tour;
  },


  /**
   * Check if a tour/callout has been read.
   *
   * @method getIsRead
   * @param {String} id The id to check
   * @return {Boolean}
   */
  getIsRead(id) {
    if (!window.localStorage || !id) {
      return false;
    }


    const lsKey = get(this, '_localStorageKey');
    let lsData = window.localStorage.getItem(lsKey);
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
   */
  setIsRead(id, isRead = true) {
    if (!window.localStorage) {
      return;
    }

    const lsKey = get(this, '_localStorageKey');
    let lsData = window.localStorage.getItem(lsKey);
    if (lsData) {
      lsData = JSON.parse(lsData);
    } else {
      lsData = {};
    }
    lsData[id] = isRead;
    window.localStorage.setItem(lsKey, JSON.stringify(lsData));
  },

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
    let tourData = getOwner(this)._lookupFactory(`tour:${tourId}`) || [];
    tourData = Ember.A(tourData);

    return tourData.map((step) => {
      return {
        target: get(step, 'target'),
        placement: get(step, 'placement') || 'top',
        title: this._t(get(step, 'title')),
        content: this._t(get(step, 'content'))
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
        nextBtn: this._t('Next'),
        prevBtn: this._t('Previous'),
        skipBtn: this._t('Skip'),
        doneBtn: this._t('Done')
      }
    });
  },

  /**
   * Init the tour & callout manager.
   * This is automatically called on service initialisation.
   *
   * @method init
   */
  init() {
    let calloutManager = hopscotch.getCalloutManager();
    this.set('_calloutManager', calloutManager);
    this._configureHopscotch();
  }

});
