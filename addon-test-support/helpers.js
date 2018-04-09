import { click, waitUntil } from '@ember/test-helpers';

export async function startTour(context) {
  let button = context ? document.querySelector(context).querySelector('[data-test-start-tour]') : '[data-test-start-tour]';
  await click(button);
}

export async function tourNextStep(step) {
  let selector = step ? `[data-test-site-tour-step="${step}"]` : '[data-test-site-tour-step]';
  await waitUntil(() => document.querySelector(selector)); // Use waitUntil instead of waitFor, as this is outside of the test scope
  await click(document.querySelector('.hopscotch-next'));
}

export function getTourElement() {
  return document.querySelector('.hopscotch-bubble-container');
}

export function getTourTitle() {
  return document.querySelector('.hopscotch-title').innerText.trim();
}

export function getTourContent(regex = /(.*)(Step \d* of \d*)/gi) {
  let content = document.querySelector('.hopscotch-content').innerText.trim();

  // We want to remove the "step x of x" part
  return content.replace(regex, '$1').trim();
}

export function getTourStep() {
  return document.querySelector('[data-test-site-tour-step]').getAttribute('data-test-site-tour-step') * 1;
}

export default {
  startTour,
  tourNextStep,
  getTourElement,
  getTourTitle,
  getTourContent,
  getTourStep
};
