import { LANGUAGE } from '@core/Intl';
import * as React from 'react';
import { OffersAppProps } from './OffersApp';

/**
 * OffersContextType is same as OffersAppProps plus:
 *
 * - language is LANGUAGE instead of optional string
 * - applicationId
 */
type OffersContextType = Omit<OffersAppProps, 'language'> & {
  language: LANGUAGE;
  /** app id - we use the same as pod-myaxa */
  applicationId: string;
};

export const OffersContext = React.createContext<OffersContextType>({} as OffersContextType); // pretend empty is OffersContextType
