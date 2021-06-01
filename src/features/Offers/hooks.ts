import { makeT } from '@core/Intl';
import { OffersContext } from './OffersContext';
import * as React from 'react';

/** hook to use translate function */
export const useTranslation = () => {
  const offersContextConsumer = React.useContext(OffersContext);
  return makeT(offersContextConsumer.language);
};

/**
 * myaxa stores current url in bifrost store before leaves to offers page.
 * We try to read this url and if it's there, we navigate back to it.
 * Otherwise we use default url for pod-myaxa
 */
export const useBackUrlToMyAxa = () => {
  const { store, podMyaxaUrl } = React.useContext(OffersContext);
  const backUrlFromStore = store.get('offers-back-url', 'myaxa');
  return backUrlFromStore ?? podMyaxaUrl;
};
