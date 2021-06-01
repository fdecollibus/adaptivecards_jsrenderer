import { FALLBACK_LANGUAGE, isLanguageSupported } from '@core/Intl';
import * as React from 'react';
import { BifrostStore, MyaxaRegistrationItem } from '@axa-ch/bifrost-types';
import { OffersAppEnv } from './OffersAppEnv';
import { OffersAppLoader } from './OffersAppLoader';
import { OffersContext } from './OffersContext';
import { DevLogger, OnTokenOptions } from '../../interfaces';

export type OffersAppProps = {
  children?: never;
  /**
   * Received from pod class (index.ts) at a later point in time
   */
  token?: OnTokenOptions;
  /** object from podproperties */
  store: BifrostStore;
  /** language from POD options */
  language?: string;
  apiBaseUrl: string;
  clientId: string;
  /** string contains placeholder @LANG@, to be replaced with lang key (en, de, it, fr) */
  contactFormUrl: string;
  /** url to pod-myaxa */
  podMyaxaUrl: string;
  /**
   * Current registration
   *
   * May arrive at a later point in time (when pod-access-manager processes its onTokenOptions)
   */
  registration: MyaxaRegistrationItem | undefined;
  /**
   * Whether the environment (the above `registration` prop) is ready or being still loaded
   */
  envReady: boolean;
  /** helper fn to log information on DEV and ACC */
  devLog: DevLogger;
};

export const OffersApp: React.FC<OffersAppProps> = (props) => {

  return (
    <OffersContext.Provider value={{
      ...props,
      /** the same appId as myaxa */
      applicationId: 'APP-638',
      language: isLanguageSupported(props.language) ? props.language : FALLBACK_LANGUAGE,
    }}>
      <OffersAppEnv registration={props.registration}>
        <OffersAppLoader/>
      </OffersAppEnv>
    </OffersContext.Provider>
  );
};
