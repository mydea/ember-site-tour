# Changelog

v1.1.2

* Fix regex for `getTourContent` test helper

v1.1.1

* Stop using jQuery
* Update dependencies
* Add test helpers, e.g. `import { startTour } from 'ember-site-tour/test-support/helpers';`:
  * `startTour`
  * `waitForStep`
  * `tourNextStep`
  * `getTourElement`
  * `getTourTitle`
  * `getTourContent`
  * `getTourStep`

v1.1.0

* Use npm dependency instead of bower dependency for hopscotch - you can remove it from bower!
* [INTERNAL] Update dependencies

v1.0.0

* Use new `getOwner(this).factoryFor()` method. This required Ember >= 2.13, or you'll need to manually install https://github.com/rwjblue/ember-factory-for-polyfill
* Allow tours to be defined as arrays, functions or Ember.Objects. 
  * The function is expected to return an array in the same format
  * The Ember.Object is expected to have a `tours` property which contains an array in the same format
* [INTERNAL] Use eslint-plugin-ember-suave instead of ember-suave

v0.5.0

* Remove ember-getowner-polyfill
* [INTERNAL] Update dependencies
* [INTERNAL] Use ember-cli-eslint instead of ember-cli-jshint

v0.4.2

* Catch error if LocalStorage is not available

v0.4.1

* Add optional `setIsRead` option to `closeCallout` method

v0.4.0

* [BREAKING] Change default behavior to not import CSS - explicitly set `importHopscotchCSS=true` in your ember-cli-build.js!
* [FEATURE] Make owner an overwrite-able computed property
* [DOCS] Add docs about usage with Engines

v0.3.1

* [BUGFIX] Do not use array deconstructing on jQuery collections
* [BUGFIX] Auto-convert the result of `._t()` with `.toString()` to make it work with SafeStrings

## v0.3.0

* [BREAKING] Rename tour service to tour-manager
* [BREAKING] Step counter string is now `Step %step% of %stepCount%`
* [FEATURE] Add option to disable step count (Step X of Y)

## v0.2.1

* [BUGFIX] Account for non-existing tours in ResetController mixin

## v0.2.0

* [FEATURE] Make hopscotch global available through tour-service
* [FEATURE] Add hasBeenRead property to Tour-object
* [BUGFIX] Do not ignore condition-functions for steps

## v0.1.0

* Initial Release
