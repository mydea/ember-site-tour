import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import {
  startTour,
  waitForStep,
  tourNextStep,
  getTourElement,
  getTourTitle,
  getTourContent,
  getTourStep
} from 'ember-site-tour/test-support/helpers';

module('Acceptance | tour', function(hooks) {
  setupApplicationTest(hooks);

  test('tour works', async function(assert) {
    await visit('/');

    await startTour();
    await tourNextStep(1);

    // Check if the test helpers work
    await waitForStep(2);
    assert.ok(getTourElement());
    assert.equal(getTourTitle(), 'Configuration', 'title is correct');
    assert.equal(getTourContent(), 'There are many configuration options.', 'content is correct');
    assert.equal(getTourStep(), 2, 'step is correct');

    await tourNextStep(2);
    await tourNextStep(3);
    await tourNextStep(4);

    assert.notOk(getTourElement());
  });
});
