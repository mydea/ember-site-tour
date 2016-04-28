# ember-hopscotch

[![Build Status](https://travis-ci.org/mydea/ember-hopscotch.svg?branch=master)](https://travis-ci.org/mydea/ember-hopscotch)

An ember add-on to implement site tours based on
[hoscotch.js](http://linkedin.github.io/hopscotch).

Documentation: [http://mydea.github.io/ember-hopscotch/](http://mydea.github.io/ember-hopscotch/)

## Installation

`ember install ember-hopscotch`

## Basic Usage

```js
// app/index/route.js

import Ember from 'ember';
import RouteTourMixin from 'ember-hopscotch/mixins/route-tour';

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
please visit the [documentation](http://mydea.github.io/ember-hopscotch/).
