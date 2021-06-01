/* tslint:disable */
declare const window: any;

// @ts-ignore
import { store } from '@axa-ch/bifrost/lib';

const { get, publish, subscribe, clean, getAsync } = store;

window.store = { get, publish, subscribe, clean, getAsync };

// Simulate a AJAX request and publish value
// setTimeout(() => {
//   window.store.publish('test', 'any-namespace', 'hello world of pods');
// }, 3000);
