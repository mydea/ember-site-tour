import Ember from 'ember';
import TourObject from 'ember-site-tour/utils/tour';
import { module, test } from 'qunit';

module('Unit | Object | tour');

const MockTourManagerService = Ember.Object.extend({
  _t(str) {
    return str;
  },

  getIsRead(id) {
    return !!id;
  },

  setIsRead(id) {
    return !!id;
  }
});

test('normalizing the ID works', function(assert) {
  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    steps: [],
    model: undefined
  });

  assert.equal(subject._normalizeHopscotchId('my-tour.index'), 'my-tour-index');
});

test('no step count is added if includeStepCount is not true on servcie', function(assert) {
  let steps = [
    {
      content: 'Test content'
    },
    {
      content: 'Test content'
    },
    {
      content: 'Test content'
    }
  ];

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    steps
  });

  let paginatedSteps = subject._addTourStepCount(subject.get('steps'));
  assert.deepEqual(paginatedSteps, steps);

});

test('adding the tour step count works if includeStepCount is true on service', function(assert) {
  let steps = [
    {
      content: 'Test content'
    },
    {
      content: 'Test content'
    },
    {
      content: 'Test content'
    }
  ];

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create({
      includeStepCount: true
    }),
    tourId: 'my-tour.index',
    steps
  });

  let stepsTarget = [
    {
      content: `Test content<div class='hopscotch-pagination'>Step 1 of 3</div>`
    },
    {
      content: `Test content<div class='hopscotch-pagination'>Step 2 of 3</div>`
    },
    {
      content: `Test content<div class='hopscotch-pagination'>Step 3 of 3</div>`
    }
  ];

  let paginatedSteps = subject._addTourStepCount(subject.get('steps'));
  assert.deepEqual(paginatedSteps, stepsTarget);
});

test('checking steps works', function(assert) {
  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    model: Ember.Object.create({
      condition1: true,
      condition2: false
    }),
    steps: [
      {
        target: {},
        title: 'Step 1',
        content: 'Test content'
      },
      {
        target: {},
        condition(model) {
          return model.get('condition1');
        },
        title: 'Step 2',
        content: 'Test content'
      },
      {
        target: {},
        condition(model) {
          return model.get('condition2');
        },
        title: 'Step 3',
        content: 'Test content'
      },
      {
        target: null,
        title: 'Step 4',
        content: 'Test content'
      }
    ]
  });

  subject._checkSteps();
  assert.equal(subject.get('_steps').length, 2, '2 steps remain');
});

test('event data is correctly built', function(assert) {
  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'RUNNING'
  });

  let e = subject._getEventData();
  assert.deepEqual(e.toJSON(), {
    id: 'my-tour.index',
    status: 'RUNNING',
    currentStep: 0,
    calloutStatus: undefined,
    tourHasBeenEnded: true
  });
  assert.equal(e.tour, subject);
});

test('tour.start event is correctly emitted', function(assert) {
  assert.expect(3);

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'INACTIVE'
  });

  subject.on('tour.start', function(e) {
    assert.ok('tour.start event is emitted');
    assert.ok(arguments.length, 1, 'one argument is passed to the function.');
    assert.deepEqual(e.toJSON(), {
      id: 'my-tour.index',
      status: 'RUNNING',
      currentStep: 0,
      calloutStatus: undefined,
      tourHasBeenEnded: true
    });
  });

  subject._onStart();
});

test('tour.end event is correctly emitted', function(assert) {
  assert.expect(3);

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'INACTIVE'
  });

  subject.on('tour.end', function(e) {
    assert.ok('tour.end event is emitted');
    assert.ok(arguments.length, 1, 'one argument is passed to the function.');
    assert.deepEqual(e.toJSON(), {
      id: 'my-tour.index',
      status: 'ENDED',
      currentStep: 0,
      calloutStatus: undefined,
      tourHasBeenEnded: true
    });
  });

  subject._onEnd();
});

test('tour.close event is correctly emitted', function(assert) {
  assert.expect(3);
  let done = assert.async();

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'RUNNING'
  });

  subject.on('tour.close', function(e) {
    assert.ok('tour.close event is emitted');
    assert.ok(arguments.length, 1, 'one argument is passed to the function.');
    assert.deepEqual(e.toJSON(), {
      id: 'my-tour.index',
      status: 'CANCELED',
      currentStep: 0,
      calloutStatus: undefined,
      tourHasBeenEnded: true
    });

    done();
  });

  subject._onClose();
});

test('tour.close is not emitted if the tour is ended', function(assert) {
  assert.expect(0);
  let done = assert.async();

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'ENDED'
  });

  subject.on('tour.close', function() {
    assert.notOk(true, 'tour.close event is not emitted');
  });

  subject._onClose();
  Ember.run.later(this, () => done(), 2);
});

test('callout.show event is correctly emitted', function(assert) {
  assert.expect(3);

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'INACTIVE',
    calloutOptions: {}
  });

  subject.on('callout.show', function(e) {
    assert.ok('callout.show event is emitted');
    assert.ok(arguments.length, 1, 'one argument is passed to the function.');
    assert.deepEqual(e.toJSON(), {
      id: 'my-tour.index',
      status: 'INACTIVE',
      currentStep: 0,
      calloutStatus: 'SHOWN',
      tourHasBeenEnded: true
    });
  });

  subject._onCalloutShow();
});

test('callout.close event is correctly emitted', function(assert) {
  assert.expect(3);
  let done = assert.async();

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'INACTIVE',
    calloutStatus: 'SHOWN',
    calloutOptions: {}
  });

  subject.on('callout.close', function(e) {
    assert.ok('callout.close event is emitted');
    assert.ok(arguments.length, 1, 'one argument is passed to the function.');
    assert.deepEqual(e.toJSON(), {
      id: 'my-tour.index',
      status: 'INACTIVE',
      currentStep: 0,
      calloutStatus: 'CLOSED',
      tourHasBeenEnded: true
    });

    done();
  });

  subject._onCalloutClose();
});

test('callout.close event is not emitted if callout is not shown', function(assert) {
  assert.expect(0);
  let done = assert.async();

  let subject = TourObject.create({
    tourManager: MockTourManagerService.create(),
    tourId: 'my-tour.index',
    status: 'INACTIVE',
    calloutStatus: 'INACTIVE',
    calloutOptions: {}
  });

  subject.on('callout.close', function() {
    assert.notOk(true, 'callout.close event is not emitted');
  });

  subject._onCalloutClose();
  Ember.run.later(this, () => done(), 2);
});
