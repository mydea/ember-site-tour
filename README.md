# ember-site-tour

[![Build Status](https://travis-ci.org/mydea/ember-site-tour.svg?branch=master)](https://travis-ci.org/mydea/ember-site-tour)
[![Ember Observer Score](https://emberobserver.com/badges/ember-site-tour.svg)](https://emberobserver.com/addons/ember-site-tour)

An ember add-on to implement site tours based on
[hopscotch.js](http://linkedin.github.io/hopscotch).

Documentation: [http://mydea.github.io/ember-site-tour/](http://mydea.github.io/ember-site-tour/)

## Installation

`ember install ember-site-tour`

## Basic Usage

```js
// app/index/route.js

import Ember from 'ember';
import RouteTourMixin from 'ember-site-tour/mixins/route-tour';

export default Ember.Route.extend(RouteTourMixin, {});
```

```handlebars
{{! app/index/template.hbs }}

{{#tour-start-button}}
  <button>Start Tour</button>
{{/tour-start-button}}
```

```js
// app/index/tour.js

export default [
  {
    target: '.first',
    title: 'First Step',
    content: `Lorem Ipsum...`
  },
  {
    target: '.second',
    title: 'Second Step',
    content: `Lorem Ipsum...`
  },
  {
    target: '.third',
    placement: 'bottom',
    title: 'Third Step',
    content: `Lorem Ipsum...`
  }
];
```

For more detailed instructions and examples,
please visit the [documentation](http://mydea.github.io/ember-site-tour/).
