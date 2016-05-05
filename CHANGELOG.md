# Changelog

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
