import { MyaxaRegistrationItem } from '@axa-ch/bifrost-types';
import { BifrostStore } from '@axa-ch/bifrost-types/lib/bifrost/BifrostStore';

import * as React from 'react';
import ReactDOM from 'react-dom';

import { OnFailError, OnTokenOptions, PodOptions } from './interfaces';
import { OffersApp } from '@features/Offers';

export default class PodMyaxaOffers {
  private elem: HTMLElement;
  private store: BifrostStore;
  private options: Omit<PodOptions, 'store'>;
  private token: OnTokenOptions;

  // elem is the DOM node where the pod will be attached on
  // options contains the store and the rest is the data attributes of the pod
  constructor(elem: HTMLElement, options: PodOptions) {
    const { store, ...rest } = options;

    this.elem = elem;
    this.options = rest;

    this.devLog('PodMyAxaOffers.constructor, options', options);

    // dev log information about POD (version, stage, lang)
    this.devLog(
      `%cpod-myaxa-offers: v${options.podversion} (stage: ${options.stage}, language: ${options.language})`,
      'color: #00adc6; font-family:sans-serif; font-size: 14px; font-weight: bold;',
    );

    // { get: ƒ, publish: ƒ, subscribe: ƒ, clean: ƒ, getAsync: f }
    this.store = store;

    // listen to current registration change (can happen async) to re-render OffersApp
    this.store.subscribe('registration-current', 'myaxa', this.render.bind(this));

    // if access-manager not ready, then listen to change (will happen async) to re-render
    const envReady = !!this.store.get('ready', 'access-manager');
    if (!envReady) {
      this.store.subscribe('ready', 'access-manager', this.render.bind(this));
    }

    this.render();
  }

  // Called when Access Token is ready. Options having following structure:
  // VERY IMPORTANT: Before every request to the API, retrieve the current token from bifrost
  // using getValidToken(). DO NOT CACHE in a variable this token!
  // { getValidToken(): '123', scope: 'name_of_scope', token_type: 'Bearer', referrer: 'any-url' }
  // Additionally there can be other options
  public onToken(onTokenOptions: OnTokenOptions) {
    this.devLog('PodMyAxaOffers.onToken, options', onTokenOptions);
    this.token = onTokenOptions;
    this.render();
  }

  // Called when there was an issue in retrieving the access token from MAAM
  // err object has following structure:
  // { error: 'error_key', error_code: 0 }
  public onFail(err: OnFailError) {
    this.devLog('PodMyAxaOffers.onFail, err', err);
  }

  /**
   * Does console.log but only on dev/acc stages (=not on prod)
   *
   * If first arg is a function, runs it and console.logs its result.
   */
  private devLog(...args: any[]) {
    if (['dev', 'acc'].includes(this.options.stage || '')) {
      if (typeof args[0] === 'function') {
        console.log(args[0]()); // tslint:disable-line:no-console
      } else {
        console.log(...args); // tslint:disable-line:no-console
      }
    }
  }

  private render() {
    try {

      // todo: require that apiBaseUrl and clientId exist in this.options, otherwise throw

      // one-time read data from bifrost (render() fn is subscribed to changes)
      const registration: MyaxaRegistrationItem | undefined | null = this.store.get('registration-current', 'myaxa');
      const envReady = !!this.store.get('ready', 'access-manager'); // ready when registrations loaded

      ReactDOM.render(
        React.createElement(
          OffersApp,
          {
            token: this.token,
            language: this.options.language,
            store: this.store,
            // @ts-ignore
            apiBaseUrl: this.options.apiBaseUrl || this.options.apibaseurl, // comes lowercase on localhost
            // @ts-ignore
            clientId: this.options.clientId || this.options.clientid, // comes lowercase on localhost
            // @ts-ignore
            contactFormUrl: this.options.contactFormUrl || this.options.contactformurl, // comes lowercase on localhost
            // @ts-ignore
            podMyaxaUrl: this.options.podMyaxaUrl || this.options.podmyaxaurl, // comes lowercase on localhost
            registration: registration ?? undefined,
            envReady,
            devLog: this.devLog.bind(this),
          },
        ),
        this.elem,
      );
    } catch (e) {
      ReactDOM.render(React.createElement('span', null, e.message), this.elem);
    }

  }
}
