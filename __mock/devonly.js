/* eslint-disable import/no-extraneous-dependencies */
import { store } from '@axa-ch/bifrost/lib';

const { get, publish, subscribe, clean, getAsync } = store;
window.store = { get, publish, subscribe, clean, getAsync };

// Simulate a AJAX request and publish value
setTimeout(() => {
  window.store.publish('test', 'any-namespace', 'hello world');
}, 1000);

