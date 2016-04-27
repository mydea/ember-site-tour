export default [
  {
    target: '#first',
    placement: 'bottom',
    title: 'First step',
    content: `This is the first step of the tour.`
  },
  {
    target: '.second',
    title: 'Second step',
    content: `The second step follows.`
  },
  {
    target: '#does-not-exist',
    placement: 'bottom',
    title: 'Skip this step',
    content: `Non-existing selectors will be skipped. This is checked on runtime, when a tour is started.`
  },
  {
    condition(model) {
      return !!model;
    },
    target: '#third',
    title: 'Skip this step',
    content: `Skip this step if the condition returns false.`
  },
  {
    target: '#third',
    placement: 'bottom',
    title: 'The actual third step',
    content: `A step in between was skipped, because the selector did not exist in the DOM.`
  }
];
