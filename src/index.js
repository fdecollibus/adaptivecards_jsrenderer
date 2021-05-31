import '@axa-ch/patterns-library-polyfill';
import '@axa-ch/button';
import './index.scss';

export default class PodAdaptiveCardsTestings {
  // elem is the DOM node where the pod will be atatched on
  // options contains the store and the rest is the data attributes of the pod
  constructor(elem, { store, ...rest }) {
    this.elem = elem;
    this.options = rest;

    // { get: ƒ, publish: ƒ, subscribe: ƒ, clean: ƒ, getAsync: f }
    this.store = store;

    this.store.subscribe('test', 'any-namespace', (value) => {
      // eslint-disable-next-line no-console
      console.info(`-> external mock pod passed ${value} to us!`);
    });
    this.init();
  }

  init() {
    this.elem.innerHTML = '<axa-button>Hello, im a Button</axa-button>';
  }
}
